// MandiMate AWS Scheduled Lambda Data Pipeline
// Implements PRD Section 22 & 23:
// "Government data/API → Scheduled Lambda → Validate records → Normalize crop names 
// → Normalize units → Validate timestamps → Store in DynamoDB → Application queries DynamoDB"

import { putPriceRecordToDynamo, isDynamoConfigured } from "../services/dynamoService.js";
import { syncMarketData } from "../services/syncService.js";

/**
 * Scheduled Lambda Handler triggered by Amazon EventBridge (e.g., cron(0 6 * * ? *))
 * Fetches daily APMC / Agmarknet market arrivals, validates them, and persists to DynamoDB & SQLite.
 */
export async function handler(event, context) {
  console.log("[Scheduled Lambda] EventBridge triggered APMC Ingestion Pipeline:", JSON.stringify(event));

  const startTime = Date.now();
  try {
    // 1. Ingest, validate records, normalize crop names, normalize units, validate timestamps
    const syncResult = await syncMarketData();

    // 2. If DynamoDB is active, batch sync verified records into DynamoDB
    if (isDynamoConfigured() && syncResult.records) {
      for (const rec of syncResult.records) {
        await putPriceRecordToDynamo(rec);
      }
    }

    const durationMs = Date.now() - startTime;
    console.log(`[Scheduled Lambda] Ingestion successful in ${durationMs}ms. Records synced: ${syncResult.records_synced}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        pipeline: "AWS EventBridge -> Scheduled Lambda -> DynamoDB",
        records_synced: syncResult.records_synced,
        timestamp: syncResult.timestamp,
        duration_ms: durationMs
      })
    };
  } catch (error) {
    console.error("[Scheduled Lambda] Ingestion Pipeline Failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
}
