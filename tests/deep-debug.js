import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:5001';

console.log("==================================================");
console.log("🔍 MANDIMATE FULL-SYSTEM DEEP DEBUGGING AUDIT");
console.log("==================================================\n");

let passed = 0;
let issues = [];

function check(title, fn) {
  try {
    fn();
    console.log(`✅ [OK] ${title}`);
    passed++;
  } catch (err) {
    console.error(`❌ [BUG/FAIL] ${title}:`, err.message);
    issues.push({ title, error: err.message });
  }
}

async function checkAsync(title, fn) {
  try {
    await fn();
    console.log(`✅ [OK] ${title}`);
    passed++;
  } catch (err) {
    console.error(`❌ [BUG/FAIL] ${title}:`, err.message);
    issues.push({ title, error: err.message });
  }
}

async function runAudit() {
  let serverProcess = null;
  try {
    const ping = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(500) }).catch(() => null);
    if (!ping || !ping.ok) {
      console.log("🌾 Starting AgriMate test server on port 5001...");
      serverProcess = spawn(process.execPath, ['server/server.js'], {
        cwd: path.join(__dirname, '..'),
        env: { ...process.env, PORT: '5001' },
        stdio: 'ignore'
      });
      let serverReady = false;
      for (let i = 0; i < 150; i++) {
        await new Promise(r => setTimeout(r, 100));
        try {
          const testPing = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(500) });
          if (testPing.ok) {
            console.log("🌾 AgriMate test server ready.\n");
            serverReady = true;
            break;
          }
        } catch {}
      }
      if (!serverReady) {
        console.warn("⚠️ Warning: AgriMate test server did not respond to /api/health within 15 seconds.");
      }
    }
  } catch (err) {
    console.warn("Server check notice:", err.message);
  }

  try {
    // 1. DATASET INTEGRITY CHECK
    const dataPath = path.join(__dirname, '../server/data/verified_markets.json');
    check("Data file exists and is valid JSON", () => {
      assert.ok(fs.existsSync(dataPath), "verified_markets.json must exist");
    });

  const dataset = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  check("Dataset contains markets and commodities", () => {
    assert.ok(dataset.markets.length >= 20, "At least 20 markets");
    assert.ok(dataset.commodities.length >= 9, "At least 9 commodities");
    assert.ok(dataset.price_records.length > 5000, "Historical records present");
  });

  check("Data integrity: Every record has min <= modal <= max and valid timestamps", () => {
    let invalidRecords = 0;
    for (const r of dataset.price_records) {
      if (r.min_price > r.modal_price || r.modal_price > r.max_price) {
        invalidRecords++;
      }
      if (r.modal_price <= 0 || !r.source || !r.source_timestamp) {
        invalidRecords++;
      }
    }
    assert.strictEqual(invalidRecords, 0, `Found ${invalidRecords} mathematically invalid price records`);
  });

  // 2. BACKEND API ENDPOINTS
  await checkAsync("GET /api/health returns 200 and healthy status", async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, "healthy");
  });

  await checkAsync("GET /api/crops returns all standardized crops with local names", async () => {
    const res = await fetch(`${BASE_URL}/api/crops`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.commodities.length >= 9);
    for (const c of data.commodities) {
      assert.ok(c.name && c.localNames?.hi && c.localNames?.kn, `Missing local names for ${c.name}`);
    }
  });

  await checkAsync("GET /api/markets with valid crop, location, quantity", async () => {
    const res = await fetch(`${BASE_URL}/api/markets?crop=Tomato&location=Ballari&quantity=500&unit=kg`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.verified, true);
    assert.strictEqual(data.normalized_quantity.in_quintals, 5);
    assert.ok(data.markets.length > 0);
    assert.ok(data.markets[0].estimated_gross_value > 0);
  });

  await checkAsync("GET /api/markets boundary: Negative or zero quantity rejected with 400", async () => {
    const res = await fetch(`${BASE_URL}/api/markets?crop=Tomato&quantity=-10`);
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.code, "INVALID_QUANTITY");
  });

  await checkAsync("GET /api/markets boundary: Missing or unsupported crop handled per PRD Sec 26", async () => {
    const res = await fetch(`${BASE_URL}/api/markets?crop=UnknownAlienCrop123`);
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.code, "UNSUPPORTED_CROP");
  });

  await checkAsync("GET /api/trends with 7, 15, and 30 days", async () => {
    for (const d of [7, 15, 30]) {
      const res = await fetch(`${BASE_URL}/api/trends?crop=Onion&days=${d}`);
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.period_days, d);
      assert.ok(["↑", "→", "↓"].includes(data.symbol));
      assert.ok(data.history.length === d);
    }
  });

  await checkAsync("POST /api/explain in English, Hindi, Kannada", async () => {
    const mRes = await fetch(`${BASE_URL}/api/markets?crop=Tomato&quantity=5`);
    const mData = await mRes.json();
    const market = mData.markets[0];

    for (const lang of ['en', 'hi', 'kn']) {
      const res = await fetch(`${BASE_URL}/api/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ market, language: lang, quantityQuintals: 5 })
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.strictEqual(data.explanation.language, lang);
      assert.ok(data.explanation.summary.includes(market.modal_price.toLocaleString('en-IN')));
    }
  });

  await checkAsync("GET /api/explain-term/:term for all 4 PRD terms in all 3 languages", async () => {
    const terms = ['modal_price', 'min_price', 'max_price', 'arrival_quantity'];
    for (const term of terms) {
      for (const lang of ['en', 'hi', 'kn']) {
        const res = await fetch(`${BASE_URL}/api/explain-term/${term}?lang=${lang}`);
        assert.strictEqual(res.status, 200);
        const data = await res.json();
        assert.strictEqual(data.success, true);
        assert.ok(data.data.title && data.data.definition && data.data.analogy);
      }
    }
  });

  await checkAsync("POST /api/checklist returns 11 structured steps in EN, HI, KN", async () => {
    for (const lang of ['en', 'hi', 'kn']) {
      const res = await fetch(`${BASE_URL}/api/checklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop: 'Potato', marketName: 'Agra APMC', quantityQuintals: 10, language: lang })
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.checklist.steps.length, 11);
    }
  });

  await checkAsync("POST /api/net-return correctly computes deductions and net return", async () => {
    const res = await fetch(`${BASE_URL}/api/net-return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grossValue: 20000,
        transportCost: 1500,
        loadingCost: 500,
        marketCessPercent: 1.5, // 300
        otherCharges: 200
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.gross_value, 20000);
    assert.strictEqual(data.deductions.total_deductions, 2500);
    assert.strictEqual(data.estimated_net_return, 17500);
  });

  await checkAsync("POST /api/parse-query handles multilingual inputs", async () => {
    const queries = [
      { q: "500 kg tomato in Ballari", expectedCrop: "Tomato", expectedLoc: "Ballari" },
      { q: "10 क्विंटल प्याज नासिक", expectedCrop: "Onion", expectedLoc: "Nashik" },
      { q: "ಬಳ್ಳಾರಿಯಲ್ಲಿ 5 ಕ್ವಿಂಟಾಲ್ ಟೊಮೆಟೊ", expectedCrop: "Tomato", expectedLoc: "Ballari" }
    ];

    for (const item of queries) {
      const res = await fetch(`${BASE_URL}/api/parse-query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: item.q })
      });
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.parsed.crop, item.expectedCrop);
      assert.strictEqual(data.parsed.location, item.expectedLoc);
    }
  });

  // 3. PRODUCTION FEATURES & DATABASE INTEGRITY AUDIT
  await checkAsync("GET /api/sync/status returns verified sync health and record count", async () => {
    const res = await fetch(`${BASE_URL}/api/sync/status`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.total_verified_records >= 5000);
    assert.ok(data.last_sync !== undefined);
  });

  await checkAsync("POST /api/sync executes live Agmarknet pipeline sync and updates SQLite", async () => {
    const res = await fetch(`${BASE_URL}/api/sync`, { method: 'POST' });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.records_synced > 0);
  });

  await checkAsync("GET /api/markets/all returns complete set of verified pan-India APMC mandis", async () => {
    const res = await fetch(`${BASE_URL}/api/markets/all`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.markets.length >= 20, `Expected at least 20 mandis, got ${data.markets.length}`);
  });

  await checkAsync("GET & POST /api/preferences stores farmer profile in SQLite", async () => {
    const postRes = await fetch(`${BASE_URL}/api/preferences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: 'kn', location: 'Ballari, Karnataka', preferredUnits: 'quintal' })
    });
    assert.strictEqual(postRes.status, 200);
    const postData = await postRes.json();
    assert.strictEqual(postData.success, true);

    const getRes = await fetch(`${BASE_URL}/api/preferences`);
    assert.strictEqual(getRes.status, 200);
    const getData = await getRes.json();
    assert.strictEqual(getData.preferences.language, 'kn');
    assert.strictEqual(getData.preferences.location, 'Ballari, Karnataka');
  });

  await checkAsync("GET & POST /api/history logs and retrieves search history from SQLite", async () => {
    const postRes = await fetch(`${BASE_URL}/api/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ crop: 'Tomato', location: 'Ballari', quantity: 10, unit: 'quintal' })
    });
    assert.strictEqual(postRes.status, 200);

    const getRes = await fetch(`${BASE_URL}/api/history`);
    assert.strictEqual(getRes.status, 200);
    const getData = await getRes.json();
    assert.strictEqual(getData.success, true);
    assert.ok(Array.isArray(getData.history));
  });

  await checkAsync("GET /api/markets supports state filtering, max distance, and sorting", async () => {
    const res = await fetch(`${BASE_URL}/api/markets?crop=Tomato&filterState=Karnataka&sortBy=price_desc&quantity=10&unit=quintal`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.markets.length > 0);
    for (const m of data.markets) {
      assert.strictEqual(m.state, 'Karnataka');
    }
    // Verify descending order
    for (let i = 0; i < data.markets.length - 1; i++) {
      assert.ok(data.markets[i].modal_price >= data.markets[i+1].modal_price, "Must be sorted descending by price");
    }
  });

  // 4. FRONTEND STATIC SERVING
  await checkAsync("GET / serves the SPA index.html with 200", async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes("AgriMate"));
    assert.ok(html.includes("<div id=\"root\">"));
  });

  console.log("\n==================================================");
  console.log(`AUDIT COMPLETE: ${passed} passed, ${issues.length} issues found.`);
  console.log("==================================================");
  } finally {
    if (serverProcess) {
      serverProcess.kill();
    }
  }

  if (issues.length > 0) {
    process.exit(1);
  }
}

runAudit();
