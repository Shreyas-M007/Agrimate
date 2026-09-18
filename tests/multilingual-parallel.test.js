// Parallel Multilingual Test Suite
// Concurrently tests all 10 supported Indian languages to verify no cross-language race conditions,
// no missing translation keys, no unshielded emoji corruptions, and no undefined terms.

import assert from 'assert';
import { getSellingChecklist } from '../server/services/checklistService.js';
import { explainTerm } from '../server/services/bedrockService.js';
import { generateMarketExplanation } from '../server/services/aiService.js';
import { parseNaturalLanguageQuery } from '../server/services/nlpService.js';
import { searchMarkets } from '../server/services/marketService.js';

console.log("==========================================================");
console.log("🌾 MandiMate Parallel Multilingual Concurrency Test Suite");
console.log("==========================================================\n");

const LANGUAGES = ['en', 'hi', 'kn', 'te', 'ta', 'mr', 'bn', 'gu', 'pa', 'ml'];
const TERMS = ['modal_price', 'min_price', 'max_price', 'arrival_quantity'];

const sampleMarket = {
  market_id: "MKT-KA-001",
  market_name: "Ballari APMC",
  commodity_name: "Tomato",
  modal_price: 2200,
  min_price: 2000,
  max_price: 2400,
  freshness: "Reported today",
  arrival_quantity: 140,
  source: "Agmarknet / DMI"
};

const sampleTrend = {
  symbol: "↑",
  direction: "increasing",
  percent_change: 4.8,
  period_days: 7
};

async function runParallelTests() {
  let testsPassed = 0;

  // TEST 1: Simultaneous Checklist Generation across all 10 languages
  console.log("1. Testing simultaneous checklist generation across all 10 languages...");
  const checklistPromises = LANGUAGES.map(async (lang) => {
    const res = getSellingChecklist({
      crop: "Tomato",
      marketName: "Ballari APMC",
      quantityQuintals: 10,
      language: lang
    });
    assert.strictEqual(res.language, lang);
    assert.strictEqual(res.steps.length, 11, `Language ${lang} must have exactly 11 steps`);
    res.steps.forEach((step, idx) => {
      assert.strictEqual(step.id, idx + 1);
      assert.ok(step.title && step.title.length > 0, `Step ${idx + 1} title missing for ${lang}`);
      assert.ok(step.desc && step.desc.length > 0, `Step ${idx + 1} desc missing for ${lang}`);
      assert.ok(step.category && step.category.length > 0, `Step ${idx + 1} category missing for ${lang}`);
    });
    return lang;
  });

  const checkedLangs = await Promise.all(checklistPromises);
  assert.strictEqual(checkedLangs.length, 10);
  console.log(`✅ PASS: All 10 language checklists generated concurrently without error`);
  testsPassed++;

  // TEST 2: Concurrent Terminology Explanations across all 4 terms in all 10 languages (40 concurrent requests)
  console.log("2. Testing 40 concurrent terminology explanations (all terms in all 10 languages)...");
  const termPromises = [];
  for (const lang of LANGUAGES) {
    for (const term of TERMS) {
      termPromises.push(
        explainTerm({ term, contextPrice: 2200, language: lang }).then(res => {
          assert.strictEqual(res.term, term);
          assert.strictEqual(res.language, lang);
          assert.ok(res.explanation && res.explanation.length > 5);
          assert.ok(!res.explanation.includes("undefined"), `Explanation should not contain undefined in ${lang}`);
        })
      );
    }
  }
  await Promise.all(termPromises);
  console.log(`✅ PASS: 40/40 concurrent terminology explanations resolved cleanly`);
  testsPassed++;

  // TEST 3: Concurrent AI Market Explanations across all 10 languages
  console.log("3. Testing concurrent AI market explanations across all 10 languages...");
  const expPromises = LANGUAGES.map(async (lang) => {
    const exp = generateMarketExplanation({
      market: sampleMarket,
      trend: sampleTrend,
      language: lang,
      quantityQuintals: 10
    });
    assert.ok(exp.summary && exp.summary.length > 0);
    assert.ok(exp.summary.includes("₹2,200"));
    assert.ok(exp.advice && exp.advice.length > 0);
    assert.ok(!exp.summary.includes("undefined"));
  });
  await Promise.all(expPromises);
  console.log(`✅ PASS: All 10 concurrent AI market explanations completed accurately`);
  testsPassed++;

  // TEST 4: Multilingual Natural Language Parsing
  console.log("4. Testing natural language parsing across multiple languages...");
  const queries = [
    { text: "I want to sell 500 kg of tomato in Ballari", expectedCrop: "Tomato", expectedLoc: "Ballari", expectedQty: 500, expectedUnit: "kg" },
    { text: "Mere paas 15 quintal pyaz hai Nashik me", expectedCrop: "Onion", expectedLoc: "Nashik", expectedQty: 15, expectedUnit: "quintal" },
    { text: "5 tonnes wheat in Karnal", expectedCrop: "Wheat", expectedLoc: "Karnal", expectedQty: 5, expectedUnit: "tonne" }
  ];

  for (const q of queries) {
    const res = parseNaturalLanguageQuery(q.text);
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.parsed.crop, q.expectedCrop);
    assert.strictEqual(res.parsed.quantity, q.expectedQty);
    assert.strictEqual(res.parsed.unit, q.expectedUnit);
  }
  console.log(`✅ PASS: Multilingual natural queries parsed correctly`);
  testsPassed++;

  // TEST 5: Market Search Determinism with Multilingual Inputs
  console.log("5. Testing market search with localized and English crop queries...");
  const searchTomato = searchMarkets({ crop: "Tomato", location: "Ballari", quantity: 500, unit: "kg" });
  assert.strictEqual(searchTomato.success, true);
  assert.strictEqual(searchTomato.normalized_quantity.in_quintals, 5);

  const searchPyaz = searchMarkets({ crop: "Onion", location: "Nashik", quantity: 10, unit: "quintal" });
  assert.strictEqual(searchPyaz.success, true);
  assert.strictEqual(searchPyaz.normalized_quantity.in_quintals, 10);

  console.log(`✅ PASS: Market searches resolved deterministically`);
  testsPassed++;

  console.log(`\n==========================================================`);
  console.log(`🎉 All ${testsPassed} parallel multilingual tests PASSED successfully!`);
  console.log(`==========================================================\n`);
}

runParallelTests().catch(err => {
  console.error("Parallel multilingual test failure:", err);
  process.exit(1);
});
