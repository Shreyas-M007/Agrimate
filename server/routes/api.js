import express from 'express';
import { 
  searchMarkets, 
  getCommodities, 
  getMarkets, 
  normalizeToQuintals,
  logSearch,
  getRecentSearches
} from '../services/marketService.js';
import { getPriceTrends } from '../services/trendService.js';
import { 
  generateMarketExplanation, 
  TERMINOLOGY_EXPLANATIONS 
} from '../services/aiService.js';
import { explainMarketWithBedrock, getBedrockConfig } from '../services/bedrockService.js';
import { getDynamoConfig } from '../services/dynamoService.js';
import { getSellingChecklist } from '../services/checklistService.js';
import { parseNaturalLanguageQuery } from '../services/nlpService.js';
import { syncMarketData, getSyncStatus } from '../services/syncService.js';
import db from '../database/db.js';

const router = express.Router();

// GET /api/health
router.get('/health', (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// GET /api/aws/status - PRD Section 19 AWS Architecture Telemetry
router.get('/aws/status', (req, res) => {
  res.json({
    success: true,
    platform: "AWS",
    bedrock: getBedrockConfig(),
    dynamodb: getDynamoConfig(),
    lambda: {
      runtime: "nodejs20.x",
      architecture: "arm64",
      handler: "server/lambda.handler",
      timeout: "15s"
    },
    apiGateway: {
      type: "REST / HTTP API",
      stage: "prod",
      cors: true,
      rateLimit: "100 req/sec"
    },
    pipeline: {
      trigger: "Amazon EventBridge",
      schedule: "cron(0 6 * * ? *)",
      service: "Scheduled Lambda Data Ingestion"
    }
  });
});

// GET /api/crops
router.get('/crops', (req, res) => {
  res.json({
    success: true,
    commodities: getCommodities()
  });
});

// GET /api/markets/all
router.get('/markets/all', (req, res) => {
  res.json({
    success: true,
    markets: getMarkets()
  });
});

// GET /api/markets
// Suggested API flow: GET /markets?crop=tomato&district=Ballari&quantity=500&unit=kg
router.get('/markets', async (req, res) => {
  const { 
    crop, 
    location, 
    district, 
    quantity = 5, 
    unit = 'quintal', 
    lat, 
    lon,
    filterState,
    maxDistanceKm,
    sortBy 
  } = req.query;
  const targetLocation = location || district || '';

  // Input validation
  const numQuantity = Number(quantity);
  if (isNaN(numQuantity) || numQuantity <= 0) {
    return res.status(400).json({
      success: false,
      error: "Quantity must be a positive number greater than zero.",
      code: "INVALID_QUANTITY"
    });
  }

  const result = searchMarkets({
    crop,
    location: targetLocation,
    quantity: numQuantity,
    unit,
    lat,
    lon,
    filterState,
    maxDistanceKm,
    sortBy
  });

  if (!result.success) {
    return res.status(400).json(result);
  }

  // Persist search query to history
  if (crop) {
    logSearch({ crop, location: targetLocation, quantity: numQuantity, unit }).catch(() => {});
  }

  res.json(result);
});

// GET /api/prices
router.get('/prices', (req, res) => {
  const { crop, market_id } = req.query;
  if (!crop) {
    return res.status(400).json({ success: false, error: "Crop parameter is required." });
  }
  const result = searchMarkets({ crop, quantity: 1 });
  if (market_id && result.markets) {
    result.markets = result.markets.filter(m => m.market_id === market_id);
  }
  res.json(result);
});

// GET /api/trends
router.get('/trends', (req, res) => {
  const { crop, market_id, days = 7 } = req.query;
  const result = getPriceTrends({ crop, market_id, days: Number(days) });
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

// POST /api/explain - PRD Section 14, 18, 19.1 Amazon Bedrock Explanation Layer
router.post('/explain', async (req, res) => {
  const { market, trend, language = 'en', quantityQuintals = 0 } = req.body;
  if (!market) {
    return res.status(400).json({ success: false, error: "Market data object is required." });
  }
  try {
    const explanation = await explainMarketWithBedrock({
      market,
      trend,
      language,
      quantityQuintals: Number(quantityQuintals) || 0
    });
    res.json({ success: true, explanation });
  } catch (err) {
    // Graceful fallback to deterministic generator
    const explanation = generateMarketExplanation({
      market,
      trend,
      language,
      quantityQuintals: Number(quantityQuintals) || 0
    });
    res.json({ success: true, explanation });
  }
});

// GET /api/explain-term/:term
router.get('/explain-term/:term', (req, res) => {
  const { term } = req.params;
  const { lang = 'en' } = req.query;
  const cleanTerm = term.toLowerCase().trim();

  const termData = TERMINOLOGY_EXPLANATIONS[cleanTerm];
  if (!termData) {
    return res.status(404).json({
      success: false,
      error: `No explanation found for term '${term}'. Available: modal_price, min_price, max_price, arrival_quantity`
    });
  }

  const localized = termData[lang] || termData['en'];
  res.json({ success: true, term: cleanTerm, data: localized });
});

// POST /api/checklist
router.post('/checklist', (req, res) => {
  const { crop = "produce", marketName = "APMC Mandi", quantityQuintals = 0, language = 'en' } = req.body;
  const checklist = getSellingChecklist({
    crop,
    marketName,
    quantityQuintals: Number(quantityQuintals) || 0,
    language
  });
  res.json({ success: true, checklist });
});

// POST /api/parse-query
router.post('/parse-query', (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ success: false, error: "Query is required." });
  }
  const result = parseNaturalLanguageQuery(query);
  res.json(result);
});

// POST /api/net-return
// PRD Section 17: Net Return Calculator
// Approximate net returns = estimated gross value - (transportation + loading/unloading + market cess/other)
router.post('/net-return', (req, res) => {
  const { 
    grossValue = 0, 
    transportCost = 0, 
    loadingCost = 0, 
    marketCessPercent = 1.5, 
    otherCharges = 0 
  } = req.body;

  const gross = Math.max(0, Number(grossValue) || 0);
  const transport = Math.max(0, Number(transportCost) || 0);
  const loading = Math.max(0, Number(loadingCost) || 0);
  const cess = Math.round((gross * (Number(marketCessPercent) || 0)) / 100);
  const other = Math.max(0, Number(otherCharges) || 0);

  const totalDeductions = transport + loading + cess + other;
  const estimatedNetReturn = Math.max(0, gross - totalDeductions);

  res.json({
    success: true,
    gross_value: gross,
    deductions: {
      transport: transport,
      loading_unloading: loading,
      market_cess: cess,
      other_charges: other,
      total_deductions: totalDeductions
    },
    estimated_net_return: estimatedNetReturn,
    disclaimer: "This net return is strictly an approximation for budgeting purposes based on user-entered cost estimates. Official receipts may vary."
  });
});

// POST /api/sync - Triggers verified Agmarknet pipeline sync (PRD Sec 22 & 23)
router.post('/sync', async (req, res) => {
  const result = await syncMarketData();
  res.json(result);
});

// GET /api/sync/status - Returns pipeline health and total records
router.get('/sync/status', async (req, res) => {
  const status = await getSyncStatus();
  res.json({ success: true, ...status });
});

// GET /api/history - Returns recent queries from SQLite
router.get('/history', async (req, res) => {
  const history = await getRecentSearches(15);
  res.json({ success: true, history });
});

// POST /api/history - Log query
router.post('/history', async (req, res) => {
  const { crop, location, quantity, unit } = req.body;
  await logSearch({ crop, location, quantity, unit });
  res.json({ success: true });
});

// GET /api/preferences - Fetch stored preferences
router.get('/preferences', async (req, res) => {
  try {
    const pref = await db.get("SELECT * FROM user_preferences WHERE user_id = 'default_farmer';");
    res.json({ success: true, preferences: pref || null });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// POST /api/preferences - Update farmer preferences
router.post('/preferences', async (req, res) => {
  const { language = 'en', location = '', preferredUnits = 'quintal' } = req.body;
  try {
    await db.run(`
      INSERT OR REPLACE INTO user_preferences (user_id, language, location, preferred_units, updated_at)
      VALUES ('default_farmer', ?, ?, ?, ?);
    `, [language, location, preferredUnits, new Date().toISOString()]);
    res.json({ success: true, message: "Preferences saved" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
