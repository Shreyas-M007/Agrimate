// On-Demand Live Agmarknet API Ingestion Engine
// Implements PRD Section 22: Data Ingestion Pipeline with 800ms race timeout
// Queries official api.data.gov.in and stores validated records into SQLite & DynamoDB

import db from '../database/db.js';
import { ValidationService } from './validationService.js';
import { putPriceRecordToDynamo, isDynamoConfigured } from './dynamoService.js';
import { refreshCache } from './marketService.js';

const getApiKey = () =>
  process.env.DATA_GOVT_IN_API_KEY ||
  process.env.DATA_GOV_IN_API_KEY ||
  '579b464db66ec23bdd000001cdd394632b774f197d623e686e86385a';

const AGMARKNET_ENDPOINT =
  'https://api.data.gov.in/resource/9ef74138-9617-4503-a4ca-c5050f5802cf';

export function withTimeout(promise, timeoutMs = 800) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Live Agmarknet API timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
}

/**
 * Process and ingest price records into SQLite & DynamoDB with strict validation.
 * Used by both live on-demand fetch and POST /api/ingest pipeline.
 */
export async function processAndIngestRecords(rawRecords = []) {
  let inserted = 0;
  let skippedDuplicates = 0;
  let failedValidation = 0;
  const errors = [];

  for (const raw of rawRecords) {
    try {
      const rawCrop = raw.commodity_name || raw.crop || raw.commodity || '';
      const normalizedCrop = String(rawCrop)
        .trim()
        .toLowerCase()
        .replace(/^\w/, c => c.toUpperCase());

      const normalizedUnit = String(raw.arrival_unit || raw.unit || 'quintal').toLowerCase();
      const dateStr = String(raw.date || raw.arrival_date || new Date().toISOString().split('T')[0]).trim();
      const marketId = String(raw.market_id || `MKT_${(raw.market || raw.market_name || 'APMC').toUpperCase().replace(/[^A-Z0-9]/g, '_')}`).trim();
      const commodityId = String(raw.commodity_id || `CMD_${normalizedCrop.toUpperCase()}`).trim();

      const candidate = {
        record_id: raw.record_id || `REC_${marketId}_${commodityId}_${dateStr}`,
        market_id: marketId,
        commodity_id: commodityId,
        commodity_name: normalizedCrop,
        variety: String(raw.variety || 'Standard').trim(),
        district: String(raw.district || 'General').trim(),
        state: String(raw.state || 'India').trim(),
        date: dateStr,
        min_price: Number(raw.min_price),
        modal_price: Number(raw.modal_price),
        max_price: Number(raw.max_price),
        arrival_quantity: raw.arrival_quantity !== undefined ? Number(raw.arrival_quantity) : 100,
        arrival_unit: normalizedUnit,
        source: String(raw.source || 'Govt of India Agmarknet Live Portal (Official)').trim(),
        source_timestamp: String(raw.source_timestamp || new Date().toISOString()).trim()
      };

      // 1. Validation check
      const validation = ValidationService.validatePriceRecord(candidate);
      if (!validation.valid) {
        failedValidation++;
        errors.push(`Record ${candidate.record_id} failed validation: ${validation.errors.join(', ')}`);
        continue;
      }

      // 2. Duplicate check in SQLite
      const existing = await db.get(
        "SELECT record_id FROM price_records WHERE market_id = ? AND (commodity_id = ? OR variety = ?) AND arrival_date = ?;",
        [candidate.market_id, candidate.commodity_id, candidate.variety, candidate.date]
      );
      if (existing) {
        skippedDuplicates++;
        continue;
      }

      // 3. Ensure market exists in SQLite
      const marketExists = await db.get("SELECT market_id FROM markets WHERE market_id = ?;", [candidate.market_id]);
      if (!marketExists) {
        const marketName = raw.market_name || raw.market || `${candidate.district} APMC`;
        await db.run(
          "INSERT OR IGNORE INTO markets (market_id, market_name, district, state, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?);",
          [candidate.market_id, marketName, candidate.district, candidate.state, 15.0, 76.5]
        );
      }

      // 4. Ensure commodity exists in SQLite
      const cmdExists = await db.get("SELECT commodity_id FROM commodities WHERE commodity_id = ?;", [candidate.commodity_id]);
      if (!cmdExists) {
        await db.run(
          "INSERT OR IGNORE INTO commodities (commodity_id, name, name_hi, name_kn, category, unit, icon, varieties_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
          [candidate.commodity_id, candidate.commodity_name, candidate.commodity_name, candidate.commodity_name, "General", "quintal", "🌾", '["Standard"]']
        );
      }

      // 5. Insert price record into SQLite
      await db.run(
        `INSERT OR REPLACE INTO price_records (
          record_id, market_id, commodity_id, variety, grade, arrival_date,
          min_price, modal_price, max_price, arrival_quantity, unit,
          source, source_timestamp, is_today
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1);`,
        [
          candidate.record_id,
          candidate.market_id,
          candidate.commodity_id,
          candidate.variety,
          "FAQ (Fair Average Quality)",
          candidate.date,
          candidate.min_price,
          candidate.modal_price,
          candidate.max_price,
          candidate.arrival_quantity,
          candidate.arrival_unit,
          candidate.source,
          candidate.source_timestamp
        ]
      );

      // 6. Push to DynamoDB if AWS credentials configured
      if (isDynamoConfigured()) {
        await putPriceRecordToDynamo(candidate).catch(err => {
          console.warn("[AgmarknetLiveService] DynamoDB push deferred:", err.message);
        });
      }

      inserted++;
    } catch (err) {
      failedValidation++;
      errors.push(`Ingestion error: ${err.message || String(err)}`);
    }
  }

  // Refresh in-memory market service cache
  await refreshCache().catch(() => {});

  return {
    total_processed: rawRecords.length,
    inserted,
    skipped_duplicates: skippedDuplicates,
    failed_validation: failedValidation,
    errors,
    timestamp: new Date().toISOString()
  };
}

/**
 * Fetches live market commodity records directly from Govt of India Agmarknet API on demand.
 * 800ms race timeout prevents government endpoint lag from impacting user queries.
 */
export async function fetchLiveMandiData(crop, district, state) {
  const apiKey = getApiKey();
  if (!apiKey) return [];

  try {
    let url = `${AGMARKNET_ENDPOINT}?api-key=${apiKey}&format=json&limit=50`;
    if (crop) url += `&filters[commodity]=${encodeURIComponent(crop.trim())}`;
    if (district) url += `&filters[district]=${encodeURIComponent(district.trim())}`;
    if (state) url += `&filters[state]=${encodeURIComponent(state.trim())}`;

    const response = await withTimeout(fetch(url), 800);
    if (!response.ok) return [];

    const json = await response.json();
    if (json && json.records && Array.isArray(json.records) && json.records.length > 0) {
      const rawRecords = json.records.map(r => {
        const cropName = r.commodity || crop;
        const marketName = r.market || `${r.district || 'APMC'} Mandi`;
        const marketId = `MKT_${marketName.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;

        return {
          record_id: `REC_${marketId}_${cropName.toUpperCase()}_${r.arrival_date || new Date().toISOString().split('T')[0]}`,
          market_id: marketId,
          market_name: marketName,
          commodity_name: cropName,
          variety: r.variety || 'Standard',
          district: r.district || district || 'General',
          state: r.state || state || 'India',
          date: r.arrival_date || new Date().toISOString().split('T')[0],
          min_price: Number(r.min_price) || 0,
          modal_price: Number(r.modal_price) || 0,
          max_price: Number(r.max_price) || 0,
          arrival_quantity: Number(r.arrival_quantity) || 0,
          arrival_unit: 'quintal',
          source: 'Govt of India Agmarknet Live Portal (Official)',
          source_timestamp: new Date().toISOString()
        };
      });

      const ingestionResult = await processAndIngestRecords(rawRecords);
      console.log(`🌾 Agmarknet Live: Ingested ${ingestionResult.inserted} verified record(s) for "${crop}"`);
      return rawRecords;
    }
  } catch (err) {
    // Gracefully swallow network/timeout errors, falling back to existing SQLite database
  }

  return [];
}

export default {
  withTimeout,
  fetchLiveMandiData,
  processAndIngestRecords
};
