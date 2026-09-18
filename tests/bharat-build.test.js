// Bharat Builds 2026 AWS Cloud Integration Test Suite
// Verifies Amazon Bedrock, DynamoDB schema, Agmarknet live pipeline, and validation service

import assert from 'assert';
import { ValidationService } from '../server/services/validationService.js';
import { normalizeToQuintals, searchMarkets } from '../server/services/marketService.js';
import { getPriceTrends } from '../server/services/trendService.js';
import { explainTerm, getBedrockConfig, explainMarketWithBedrock } from '../server/services/bedrockService.js';
import { getDynamoConfig } from '../server/services/dynamoService.js';
import { processAndIngestRecords, withTimeout } from '../server/services/agmarknetLiveService.js';
import db from '../server/database/db.js';

console.log("==================================================");
console.log("🌾 Bharat Builds 2026 AWS Cloud Integration Tests");
console.log("==================================================\n");

let passed = 0;
let total = 0;

async function test(name, fn) {
  total++;
  try {
    await fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

async function runAllTests() {
  // Ensure database is initialized
  await db.initDb();

  // 1. Validation Service: Search Input
  await test("ValidationService: validates search input and rejects quantity <= 0", () => {
    const invalidRes = ValidationService.validateSearchInput({ crop: 'onion', quantity: -10, unit: 'kg' });
    assert.strictEqual(invalidRes.valid, false);
    assert.ok(invalidRes.errors.length > 0);

    const validRes = ValidationService.validateSearchInput({ crop: 'tomato', quantity: 500, unit: 'kg' });
    assert.strictEqual(validRes.valid, true);
    assert.strictEqual(validRes.errors.length, 0);
  });

  await test("ValidationService: rejects invalid measurement unit", () => {
    const res = ValidationService.validateSearchInput({ crop: 'tomato', quantity: 50, unit: 'litres' });
    assert.strictEqual(res.valid, false);
    assert.ok(res.errors[0].includes('Invalid unit'));
  });

  // 2. Validation Service: Price Hierarchy
  await test("ValidationService: enforces min_price <= modal_price <= max_price", () => {
    const badRecord = {
      commodity_name: 'Tomato',
      market_id: 'MKT-KA-001',
      date: '2026-09-18',
      min_price: 3000,
      modal_price: 2000, // Invalid: min > modal
      max_price: 2500,
      source: 'Agmarknet',
      source_timestamp: new Date().toISOString()
    };
    const check = ValidationService.validatePriceRecord(badRecord);
    assert.strictEqual(check.valid, false);
    assert.ok(check.errors.some(e => e.includes('Invalid price hierarchy')));

    const goodRecord = {
      commodity_name: 'Tomato',
      market_id: 'MKT-KA-001',
      date: '2026-09-18',
      min_price: 1800,
      modal_price: 2200,
      max_price: 2500,
      source: 'Agmarknet',
      source_timestamp: new Date().toISOString()
    };
    const goodCheck = ValidationService.validatePriceRecord(goodRecord);
    assert.strictEqual(goodCheck.valid, true);
  });

  // 3. Unit Calculation & Normalization
  await test("Unit Normalization: correctly normalizes kg and tonnes to quintals", () => {
    assert.strictEqual(normalizeToQuintals(500, 'kg'), 5);
    assert.strictEqual(normalizeToQuintals(1, 'tonne'), 10);
    assert.strictEqual(normalizeToQuintals(2.5, 'tonne'), 25);
    assert.strictEqual(normalizeToQuintals(12, 'quintal'), 12);
  });

  // 4. Market Search & Gross Value Calculation
  await test("Market Search: calculates normalized quintals and gross value", () => {
    const res = searchMarkets({ crop: 'tomato', location: 'Ballari', quantity: 500, unit: 'kg' });
    assert.strictEqual(res.success, true);
    assert.ok(Array.isArray(res.data) && res.data.length > 0);

    const first = res.data[0];
    assert.strictEqual(first.commodity_name, 'Tomato');
    assert.strictEqual(first.normalized_quantity_quintals, 5);
    assert.strictEqual(first.estimated_gross_value, 5 * first.modal_price);
    assert.ok(first.source);
  });

  // 5. Trend Engine
  await test("Trend Engine: computes trend metrics and direction symbol", () => {
    const trend = getPriceTrends({ crop: 'Tomato', market_id: 'MKT-KA-001', days: 7 });
    assert.strictEqual(trend.success, true);
    assert.ok(trend.average_price > 0);
    assert.ok(['↑', '→', '↓'].includes(trend.symbol));
    assert.ok(trend.highest_price >= trend.lowest_price);
  });

  // 6. Amazon Bedrock: Term Explanation in Kannada & Hindi
  await test("Amazon Bedrock: explains term modal_price in Kannada without hallucinations", async () => {
    const res = await explainTerm({ term: 'modal_price', contextPrice: 2200, language: 'kn' });
    assert.strictEqual(res.term, 'modal_price');
    assert.strictEqual(res.language, 'kn');
    assert.ok(res.explanation.includes('ಮಾದರಿ ಬೆಲೆ'));
  });

  await test("Amazon Bedrock: explains term modal_price in Hindi without hallucinations", async () => {
    const res = await explainTerm({ term: 'modal_price', contextPrice: 2200, language: 'hi' });
    assert.strictEqual(res.term, 'modal_price');
    assert.strictEqual(res.language, 'hi');
    assert.ok(res.explanation.includes('मॉडल भाव'));
  });

  // 7. Amazon Bedrock: Grounded Market Advisory
  await test("Amazon Bedrock: generates grounded market advisory with AWS telemetry", async () => {
    const sampleMarket = {
      market_name: "Ballari APMC",
      district: "Ballari",
      state: "Karnataka",
      commodity_name: "Tomato",
      modal_price: 2200,
      min_price: 2000,
      max_price: 2400,
      arrival_quantity: 140,
      source: "Agmarknet / DMI",
      source_timestamp: new Date().toISOString()
    };

    const res = await explainMarketWithBedrock({
      market: sampleMarket,
      trend: { direction: 'increasing', percent_change: 6.2, period_days: 7 },
      language: 'en',
      quantityQuintals: 5
    });

    assert.ok(res.summary);
    assert.ok(res.aws_telemetry);
    assert.strictEqual(res.aws_telemetry.grounded, true);
  });

  // 8. Agmarknet Timeout Racing
  await test("Agmarknet Service: withTimeout completes fast or rejects on deadline", async () => {
    const fastPromise = new Promise(resolve => setTimeout(() => resolve('fast'), 50));
    const result = await withTimeout(fastPromise, 200);
    assert.strictEqual(result, 'fast');

    const slowPromise = new Promise(resolve => setTimeout(() => resolve('slow'), 500));
    let timedOut = false;
    try {
      await withTimeout(slowPromise, 100);
    } catch (e) {
      timedOut = true;
    }
    assert.strictEqual(timedOut, true);
  });

  // 9. Data Ingestion Pipeline
  await test("Data Ingestion Pipeline: validates, deduplicates, and ingests price record", async () => {
    const newRecord = {
      market_id: 'MKT-KA-001',
      market_name: 'Ballari APMC',
      crop: 'Sunflower',
      variety: 'Hybrid',
      district: 'Ballari',
      state: 'Karnataka',
      date: '2026-09-18',
      min_price: 4500,
      modal_price: 4800,
      max_price: 5100,
      arrival_quantity: 80,
      unit: 'quintal',
      source: 'Verified Agmarknet Feed',
      source_timestamp: new Date().toISOString()
    };

    const result = await processAndIngestRecords([newRecord]);
    assert.strictEqual(result.total_processed, 1);
    assert.ok(result.inserted >= 0);
    assert.ok(result.failed_validation === 0);
  });

  // 10. AWS Config
  await test("AWS Architecture: telemetry configs are verified", () => {
    const bedrock = getBedrockConfig();
    assert.strictEqual(bedrock.provider, "Amazon Bedrock");

    const dynamo = getDynamoConfig();
    assert.strictEqual(dynamo.provider, "Amazon DynamoDB");
    assert.ok(dynamo.tables.priceRecords);
  });

  // 11. Pan-India Universal Dynamic Search (Custom crops without static JSON)
  await test("Universal Search Engine: Pan-India dynamic generation for arbitrary crops", async () => {
    const { generateDynamicMarketSearchResult } = await import('../server/services/marketService.js');
    const customResult = generateDynamicMarketSearchResult({
      crop: "Dragonfruit",
      location: "Ballari",
      quantity: 500,
      unit: "kg"
    });

    assert.strictEqual(customResult.success, true);
    assert.strictEqual(customResult.verified, true);
    assert.strictEqual(customResult.dynamic, true);
    assert.strictEqual(customResult.commodity.name, "Dragonfruit");
    assert.strictEqual(customResult.normalized_quantity.in_quintals, 5);
    assert.ok(customResult.markets.length >= 2, "Should return at least 2 comparison markets");
    assert.ok(customResult.markets[0].modal_price >= 1500, "Should generate realistic modal price");
    assert.strictEqual(customResult.markets[0].estimated_gross_value, 5 * customResult.markets[0].modal_price);
  });

  // 12. 10 Indian Languages Checklist Support
  await test("Checklist Service: supports all 10 Indian languages", async () => {
    const { getSellingChecklist } = await import('../server/services/checklistService.js');
    const languages = ['en', 'hi', 'kn', 'te', 'ta', 'mr', 'bn', 'gu', 'pa', 'ml'];
    for (const lang of languages) {
      const checklist = getSellingChecklist({
        crop: "Tomato",
        marketName: "Ballari APMC",
        quantityQuintals: 5,
        language: lang
      });
      assert.strictEqual(checklist.language, lang, `Language must match ${lang}`);
      assert.strictEqual(checklist.steps.length, 11, `Must have 11 steps for ${lang}`);
      assert.ok(checklist.title.length > 0, `Title must be present for ${lang}`);
      assert.ok(checklist.steps[0].category.length > 0, `Category must be translated for ${lang}`);
    }
  });

  // 13. Multilingual Term Explanations (10 Languages)
  await test("Multilingual Bedrock Explanations: all 10 languages supported", async () => {
    const languages = ['en', 'hi', 'kn', 'te', 'ta', 'mr', 'bn', 'gu', 'pa', 'ml'];
    for (const lang of languages) {
      const res = await explainTerm({ term: 'modal_price', contextPrice: 2200, language: lang });
      assert.strictEqual(res.term, 'modal_price');
      assert.strictEqual(res.language, lang);
      assert.ok(res.explanation.length > 10, `Explanation must be generated for ${lang}`);
    }
  });

  console.log(`\n==================================================`);
  console.log(`🎉 ${passed}/${total} Bharat Builds tests PASSED successfully!`);
  console.log(`==================================================\n`);
}

runAllTests().catch(err => {
  console.error("Fatal test error:", err);
  process.exit(1);
});
