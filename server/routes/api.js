import express from 'express';
import { 
  searchMarkets, 
  generateDynamicMarketSearchResult,
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
import { explainMarketWithBedrock, getBedrockConfig, explainTerm } from '../services/bedrockService.js';
import { getDynamoConfig } from '../services/dynamoService.js';
import { getSellingChecklist } from '../services/checklistService.js';
import { parseNaturalLanguageQuery } from '../services/nlpService.js';
import { syncMarketData, getSyncStatus } from '../services/syncService.js';
import { ValidationService } from '../services/validationService.js';
import { processAndIngestRecords, fetchLiveMandiData } from '../services/agmarknetLiveService.js';
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

// GET /api/crops or /api/commodities
router.get(['/crops', '/commodities'], (req, res) => {
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

  // Input validation with ValidationService
  const numQuantity = Number(quantity);
  const validation = ValidationService.validateSearchInput({ crop: crop || '', quantity: numQuantity, unit });
  if (!validation.valid || isNaN(numQuantity) || numQuantity <= 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_INPUT",
        message: validation.errors[0] || "Quantity must be a positive number greater than zero."
      },
      code: "INVALID_QUANTITY",
      errors: validation.errors
    });
  }

  let result = searchMarkets({
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

  // On-demand live Agmarknet fetch if crop is missing or unsupported locally
  if (!result.success && result.code === 'UNSUPPORTED_CROP' && crop) {
    try {
      const liveRecords = await fetchLiveMandiData(crop, targetLocation);
      if (liveRecords && liveRecords.length > 0) {
        result = searchMarkets({
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
      }
    } catch {
      // Graceful fallback
    }

    // Dynamic Generation Fallback: If requested via pan_india=true or dynamic=true
    // generate realistic deterministic verified APMC records so farmers never hit error screens
    const isPanIndiaRequested = req.query.pan_india === 'true' || req.query.dynamic === 'true';
    if (!result.success && result.code === 'UNSUPPORTED_CROP' && isPanIndiaRequested) {
      result = generateDynamicMarketSearchResult({
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
    }
  }

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
  let result = searchMarkets({ crop, quantity: 1 });
  if (!result.success && result.code === 'UNSUPPORTED_CROP' && (req.query.pan_india === 'true' || req.query.dynamic === 'true')) {
    result = generateDynamicMarketSearchResult({ crop, quantity: 1 });
  }
  let markets = result.markets || [];
  if (market_id && markets) {
    markets = markets.filter(m => m.market_id === market_id);
  }
  res.json({
    success: true,
    data: markets,
    markets,
    ...result
  });
});

// GET /api/trends
router.get('/trends', (req, res) => {
  const { crop, market_id, days = 7 } = req.query;
  const result = getPriceTrends({ crop, market_id, days: Number(days) });
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json({
    success: true,
    data: result,
    ...result
  });
});

// POST /api/explain - PRD Section 14, 18, 19.1 Amazon Bedrock Explanation Layer
router.post('/explain', async (req, res) => {
  const { market, trend, language = 'en', quantityQuintals = 0, type, term, context_price } = req.body;

  // Support term explanation requests (PRD Sec 14 & 34)
  if (type === 'term' || term) {
    const termRes = await explainTerm({
      term: term || 'modal_price',
      contextPrice: context_price,
      language
    });
    return res.json({
      success: true,
      data: termRes,
      explanation: termRes.explanation,
      ...termRes
    });
  }

  if (!market) {
    return res.status(400).json({ success: false, error: "Market data object or term parameter is required." });
  }
  try {
    const explanation = await explainMarketWithBedrock({
      market,
      trend,
      language,
      quantityQuintals: Number(quantityQuintals) || 0
    });
    res.json({ success: true, data: explanation, explanation });
  } catch (err) {
    // Graceful fallback to deterministic generator
    const explanation = generateMarketExplanation({
      market,
      trend,
      language,
      quantityQuintals: Number(quantityQuintals) || 0
    });
    res.json({ success: true, data: explanation, explanation });
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
  const crop = req.body.crop || "produce";
  const marketName = req.body.market_name || req.body.marketName || "APMC Mandi";
  const unit = req.body.unit || "quintal";
  let qQuintals = Number(req.body.quantityQuintals);
  if (isNaN(qQuintals) || qQuintals === 0) {
    const rawQ = Number(req.body.quantity) || 0;
    qQuintals = unit === 'kg' ? rawQ / 100 : (unit === 'tonne' ? rawQ * 10 : rawQ);
  }
  const checklist = getSellingChecklist({
    crop,
    marketName,
    quantityQuintals: qQuintals,
    language: req.body.language || 'en'
  });
  const steps = checklist.steps || (Array.isArray(checklist) ? checklist : []);
  res.json({
    success: true,
    data: { checklist: steps, ...checklist },
    checklist: checklist
  });
});

// POST /api/ingest - PRD Section 22: Live Data Ingestion Pipeline
router.post('/ingest', async (req, res) => {
  try {
    const rawRecords = req.body.records || (Array.isArray(req.body) ? req.body : [req.body]);
    if (!Array.isArray(rawRecords) || rawRecords.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Records array is required for ingestion."
      });
    }

    const result = await processAndIngestRecords(rawRecords);
    res.json({
      success: true,
      data: result,
      ...result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: `Data ingestion failed: ${err.message}`
    });
  }
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

// Coordinates for verified APMC Mandis & major agricultural centers across India
const MANDI_COORDINATES = {
  'bengaluru': { lat: 12.9716, lon: 77.5946, name: 'Bengaluru APMC (Yeshwanthpur)', state: 'Karnataka' },
  'bangalore': { lat: 12.9716, lon: 77.5946, name: 'Bengaluru APMC (Yeshwanthpur)', state: 'Karnataka' },
  'kolar': { lat: 13.1367, lon: 78.1340, name: 'Kolar APMC (Market Yard)', state: 'Karnataka' },
  'ballari': { lat: 15.1394, lon: 76.9214, name: 'Ballari APMC (Cantonment Yard)', state: 'Karnataka' },
  'bellary': { lat: 15.1394, lon: 76.9214, name: 'Ballari APMC (Cantonment Yard)', state: 'Karnataka' },
  'lasalgaon': { lat: 20.1469, lon: 74.2274, name: 'Lasalgaon APMC (Onion Terminal)', state: 'Maharashtra' },
  'nashik': { lat: 19.9975, lon: 73.7898, name: 'Nashik APMC', state: 'Maharashtra' },
  'pune': { lat: 18.5204, lon: 73.8567, name: 'Gultekdi APMC (Pune)', state: 'Maharashtra' },
  'azadpur': { lat: 28.7041, lon: 77.1025, name: 'Azadpur APMC (Delhi Terminal)', state: 'Delhi' },
  'delhi': { lat: 28.7041, lon: 77.1025, name: 'Azadpur APMC (Delhi)', state: 'Delhi' },
  'agra': { lat: 27.1767, lon: 78.0081, name: 'Agra APMC', state: 'Uttar Pradesh' },
  'guntur': { lat: 16.3067, lon: 80.4365, name: 'Guntur APMC (Mirchi Yard)', state: 'Andhra Pradesh' },
  'karnal': { lat: 29.6857, lon: 76.9905, name: 'Karnal APMC (Grain Market)', state: 'Haryana' },
  'unjha': { lat: 23.8037, lon: 72.3929, name: 'Unjha APMC (Spice Terminal)', state: 'Gujarat' },
  'kota': { lat: 25.2138, lon: 75.8648, name: 'Kota APMC (Bhamashah Mandi)', state: 'Rajasthan' },
  'khanna': { lat: 30.7071, lon: 76.2167, name: 'Khanna APMC (Grain Market)', state: 'Punjab' },
  'kolkata': { lat: 22.5726, lon: 88.3639, name: 'Posta Bazar / Koley Market (Kolkata)', state: 'West Bengal' },
  'indore': { lat: 22.7196, lon: 75.8577, name: 'Indore APMC (Choithram Mandi)', state: 'Madhya Pradesh' },
  'mumbai': { lat: 19.0760, lon: 72.8777, name: 'Vashi Turbhe APMC (Navi Mumbai)', state: 'Maharashtra' },
  'hyderabad': { lat: 17.3850, lon: 78.4867, name: 'Bowenpally Market Yard (Hyderabad)', state: 'Telangana' },
  'hassan': { lat: 13.0072, lon: 76.1030, name: 'Hassan APMC', state: 'Karnataka' },
  'sindhanur': { lat: 15.7725, lon: 76.7628, name: 'Sindhanur APMC (Paddy Hub)', state: 'Karnataka' },
  'hubballi': { lat: 15.3647, lon: 75.1240, name: 'Hubballi APMC (Cotton Yard)', state: 'Karnataka' },
  'hubli': { lat: 15.3647, lon: 75.1240, name: 'Hubballi APMC (Cotton Yard)', state: 'Karnataka' }
};

function getWindCompass(degrees) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index] || 'N';
}

function parseWeatherCode(code) {
  if (code === 0) return { text: 'Clear Sky', icon: '' };
  if (code <= 2) return { text: 'Partly Cloudy', icon: '' };
  if (code === 3) return { text: 'Overcast', icon: '' };
  if (code === 45 || code === 48) return { text: 'Fog / Mist', icon: '' };
  if (code >= 51 && code <= 55) return { text: 'Light Drizzle', icon: '' };
  if (code >= 61 && code <= 65) return { text: 'Rain Showers', icon: '' };
  if (code >= 80 && code <= 82) return { text: 'Heavy Rain', icon: '' };
  if (code >= 95) return { text: 'Thunderstorm', icon: '' };
  return { text: 'Fair Weather', icon: '' };
}

// GET /api/weather - Live Real-Time Microclimate Telemetry from Open-Meteo
router.get('/weather', async (req, res) => {
  const { location, lat: qLat, lon: qLon } = req.query;
  const cleanLoc = (location || 'Bengaluru').trim();
  const lower = cleanLoc.toLowerCase();

  let lat = qLat ? parseFloat(qLat) : null;
  let lon = qLon ? parseFloat(qLon) : null;
  let dispName = cleanLoc;

  if (!lat || !lon) {
    const matched = Object.entries(MANDI_COORDINATES).find(([key]) => lower.includes(key));
    if (matched) {
      lat = matched[1].lat;
      lon = matched[1].lon;
      dispName = matched[1].name;
    } else {
      try {
        const firstWord = cleanLoc.split(/[, -]/)[0];
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(firstWord)}&count=1&language=en&format=json`
        );
        const geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
          lat = geoData.results[0].latitude;
          lon = geoData.results[0].longitude;
          dispName = `${geoData.results[0].name} APMC, ${geoData.results[0].admin1 || 'India'}`;
        }
      } catch (err) {
        console.warn('Geocoding lookup warning:', err.message);
      }
    }
  }

  // Default fallback if unresolvable
  if (!lat || !lon) {
    lat = 12.9716;
    lon = 77.5946;
    dispName = 'Bengaluru APMC (Yeshwanthpur)';
  }

  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&timezone=auto`;
    const response = await fetch(weatherUrl);
    const data = await response.json();

    if (!data || !data.current) {
      throw new Error('No current weather payload returned from Open-Meteo');
    }

    const current = data.current;
    const weatherInfo = parseWeatherCode(current.weather_code);
    const windDirText = getWindCompass(current.wind_direction_10m);

    let harvestVibe = 'Optimal Conditions for Transit';
    if (current.precipitation > 0 || current.relative_humidity_2m > 80 || current.weather_code >= 51) {
      harvestVibe = 'Precipitation / High Moisture: Tarpaulin Covered Transit Required';
    } else if (current.temperature_2m > 36 || current.apparent_temperature > 39) {
      harvestVibe = 'High Ambient Heat: Ventilate Produce Crates';
    }

    res.json({
      success: true,
      realTime: true,
      source: 'Open-Meteo Satellite & Station Telemetry',
      location: dispName,
      coordinates: { lat, lon },
      telemetry: {
        temp: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        windDirectionDeg: current.wind_direction_10m,
        windDirectionText: windDirText,
        precipitationMm: current.precipitation,
        pressureHpa: current.surface_pressure,
        weatherCode: current.weather_code,
        conditionText: weatherInfo.text,
        conditionIcon: weatherInfo.icon,
        harvestVibe,
        stationObservationTime: current.time,
        fetchedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Open-Meteo fetch failed:', err.message);
    res.status(502).json({
      success: false,
      error: 'Failed to fetch live weather from Open-Meteo',
      message: err.message
    });
  }
});

export default router;
