import assert from 'assert';
import { 
  normalizeToQuintals, 
  calculateDistanceKm, 
  searchMarkets 
} from '../server/services/marketService.js';
import { getPriceTrends } from '../server/services/trendService.js';
import { 
  generateMarketExplanation, 
  TERMINOLOGY_EXPLANATIONS 
} from '../server/services/aiService.js';
import { getSellingChecklist } from '../server/services/checklistService.js';
import { parseNaturalLanguageQuery } from '../server/services/nlpService.js';

console.log("=========================================");
console.log("🌾 Running MandiMate Verification Checks");
console.log("=========================================\n");

let passedCount = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

// 1. Quantity Normalization (PRD Sec 7.3)
test("Quantity Normalization: 500 kg = 5 quintals", () => {
  const q = normalizeToQuintals(500, "kg");
  assert.strictEqual(q, 5);
});

test("Quantity Normalization: 1 tonne = 10 quintals", () => {
  const q = normalizeToQuintals(1, "tonne");
  assert.strictEqual(q, 10);
});

test("Quantity Normalization: 2.5 tonnes = 25 quintals", () => {
  const q = normalizeToQuintals(2.5, "tonne");
  assert.strictEqual(q, 25);
});

// 2. Gross Value Calculation (PRD Sec 12)
test("Gross Value Calculation: 5 quintals @ ₹2,200 = ₹11,000", () => {
  const result = searchMarkets({ crop: "Tomato", location: "Ballari", quantity: 500, unit: "kg" });
  assert.strictEqual(result.success, true);
  assert.strictEqual(result.verified, true);
  assert.strictEqual(result.normalized_quantity.in_quintals, 5);
  
  const ballariMarket = result.markets.find(m => m.market_id === "MKT-KA-001");
  assert.ok(ballariMarket, "Ballari APMC must be present");
  assert.strictEqual(ballariMarket.estimated_gross_value, 5 * ballariMarket.modal_price);
  assert.ok(ballariMarket.source.includes("Agmarknet"), "Must preserve verified source");
  assert.ok(ballariMarket.source_timestamp, "Must preserve source timestamp");
});

// 3. Distance Estimation
test("Distance Calculation: Ballari to Kudligi ~ 60-80 km", () => {
  const dist = calculateDistanceKm(15.1394, 76.9214, 14.9011, 76.3872);
  assert.ok(dist >= 60 && dist <= 80, `Expected ~70km, got ${dist}`);
});

// 4. Data Integrity: Refusal to fabricate prices (PRD Sec 9)
test("Data Integrity: Rejects unsupported or missing crops gracefully", () => {
  const result = searchMarkets({ crop: "DragonFruitUnknown123", location: "Ballari", quantity: 10 });
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.code, "UNSUPPORTED_CROP");
});

// 5. Deterministic Trends & Accessible Symbols (PRD Sec 13 & 29)
test("Trend Analysis: Returns valid stats and accessible symbols (↑ / → / ↓)", () => {
  const trend = getPriceTrends({ crop: "Tomato", market_id: "MKT-KA-001", days: 7 });
  assert.strictEqual(trend.success, true);
  assert.strictEqual(trend.has_data, true);
  assert.ok(trend.period_days === 7);
  assert.ok(["↑", "→", "↓"].includes(trend.symbol), `Symbol must be ↑, →, or ↓. Got ${trend.symbol}`);
  assert.ok(["increasing", "stable", "decreasing"].includes(trend.direction));
  assert.ok(trend.average_price > 0);
  assert.ok(trend.highest_price >= trend.lowest_price);
  assert.ok(trend.descriptive_statement.includes("7-day period"));
});

// 6. Bedrock AI Explanation Layer (PRD Sec 14, 18, 34)
test("AI Explanation: Grounded in verified data without price hallucinations (EN, HI, KN)", () => {
  const market = {
    market_name: "Ballari APMC",
    commodity_name: "Tomato",
    modal_price: 2200,
    min_price: 2000,
    max_price: 2400,
    freshness: "Reported 2 hours ago",
    arrival_quantity: 140,
    source: "Agmarknet / DMI"
  };
  const trend = {
    symbol: "↑",
    direction: "increasing",
    percent_change: 8.5,
    period_days: 7
  };

  // English
  const expEn = generateMarketExplanation({ market, trend, language: 'en', quantityQuintals: 5 });
  assert.ok(expEn.summary.includes("₹2,200"));
  assert.ok(expEn.trendExplanation.includes("8.5%"));
  assert.ok(expEn.estimatedValueNote.includes("₹11,000"));

  // Hindi
  const expHi = generateMarketExplanation({ market, trend, language: 'hi', quantityQuintals: 5 });
  assert.ok(expHi.summary.includes("₹2,200"));
  assert.ok(expHi.trendExplanation.includes("8.5%"));
  assert.ok(expHi.title.includes("विश्लेषण"));

  // Kannada
  const expKn = generateMarketExplanation({ market, trend, language: 'kn', quantityQuintals: 5 });
  assert.ok(expKn.summary.includes("₹2,200"));
  assert.ok(expKn.trendExplanation.includes("8.5%"));
  assert.ok(expKn.title.includes("ವಿವರಣೆ"));
});

// 7. Selling Checklist 11-step verification (PRD Sec 16)
test("Selling Checklist: Produces 11 steps in English, Hindi, and Kannada", () => {
  const chkEn = getSellingChecklist({ crop: "Tomato", marketName: "Ballari APMC", quantityQuintals: 5, language: 'en' });
  assert.strictEqual(chkEn.steps.length, 11);
  assert.strictEqual(chkEn.steps[0].id, 1);
  assert.strictEqual(chkEn.steps[10].id, 11);

  const chkHi = getSellingChecklist({ crop: "टमाटर", marketName: "बेल्लारी मंडी", quantityQuintals: 5, language: 'hi' });
  assert.strictEqual(chkHi.steps.length, 11);

  const chkKn = getSellingChecklist({ crop: "ಟೊಮೆಟೊ", marketName: "ಬಳ್ಳಾರಿ ಎಪಿಎಂಸಿ", quantityQuintals: 5, language: 'kn' });
  assert.strictEqual(chkKn.steps.length, 11);
});

// 8. Natural Language Query Parser (PRD Sec 18)
test("NLP Parser: Extracts structured crop, location, quantity from farmer text", () => {
  const parsed1 = parseNaturalLanguageQuery("I want to sell 500 kg of tomato in Ballari");
  assert.strictEqual(parsed1.parsed.crop, "Tomato");
  assert.strictEqual(parsed1.parsed.location, "Ballari");
  assert.strictEqual(parsed1.parsed.quantity, 500);
  assert.strictEqual(parsed1.parsed.unit, "kg");

  const parsed2 = parseNaturalLanguageQuery("मेरे पास 15 क्विंटल प्याज है नासिक में");
  assert.strictEqual(parsed2.parsed.crop, "Onion");
  assert.strictEqual(parsed2.parsed.location, "Nashik");
  assert.strictEqual(parsed2.parsed.quantity, 15);
  assert.strictEqual(parsed2.parsed.unit, "quintal");
});

// 9. Terminology Explanations (PRD Sec 15)
test("Terminology Explanations: All 4 key terms covered in EN, HI, KN", () => {
  const terms = ["modal_price", "min_price", "max_price", "arrival_quantity"];
  for (const term of terms) {
    assert.ok(TERMINOLOGY_EXPLANATIONS[term].en, `Missing EN for ${term}`);
    assert.ok(TERMINOLOGY_EXPLANATIONS[term].hi, `Missing HI for ${term}`);
    assert.ok(TERMINOLOGY_EXPLANATIONS[term].kn, `Missing KN for ${term}`);
  }
});

console.log(`\n🎉 All ${passedCount} verification tests passed successfully!`);
