// MandiMate Amazon DynamoDB Service
// Implements PRD Section 19.3, 21 & 22:
// Schema:
// 1. Markets: market_id (PK), market_name, district, state, latitude, longitude
// 2. Commodities: commodity_id (PK), commodity_name, variety, unit
// 3. PriceRecords: record_id (PK), market_id, commodity_id, date, min_price, modal_price, max_price, arrival_quantity, source, source_timestamp
// 4. UserPreferences: user_id (PK), language, location, preferred_units

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
  DynamoDBDocumentClient, 
  GetCommand, 
  PutCommand, 
  QueryCommand, 
  ScanCommand 
} from "@aws-sdk/lib-dynamodb";

const AWS_REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "ap-south-1";

let docClient = null;

export function getDynamoDocClient() {
  if (!docClient) {
    const rawClient = new DynamoDBClient({
      region: AWS_REGION,
      // Endpoint can be overridden for Local DynamoDB (e.g., http://localhost:8000)
      endpoint: process.env.DYNAMODB_ENDPOINT || undefined
    });
    docClient = DynamoDBDocumentClient.from(rawClient, {
      marshallOptions: { removeUndefinedValues: true }
    });
  }
  return docClient;
}

export function isDynamoConfigured() {
  return Boolean(
    (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) ||
    process.env.AWS_EXECUTION_ENV ||
    process.env.DYNAMODB_ENDPOINT
  );
}

export function getDynamoConfig() {
  return {
    provider: "Amazon DynamoDB",
    region: AWS_REGION,
    tables: {
      markets: process.env.DYNAMO_TABLE_MARKETS || "MandiMate_Markets",
      commodities: process.env.DYNAMO_TABLE_COMMODITIES || "MandiMate_Commodities",
      priceRecords: process.env.DYNAMO_TABLE_PRICES || "MandiMate_PriceRecords",
      users: process.env.DYNAMO_TABLE_USERS || "MandiMate_Users"
    },
    isConfigured: isDynamoConfigured()
  };
}

/**
 * Put a verified price record into DynamoDB per PRD Sec 22 pipeline
 */
export async function putPriceRecordToDynamo(record) {
  if (!isDynamoConfigured()) return null;
  const client = getDynamoDocClient();
  const tableName = process.env.DYNAMO_TABLE_PRICES || "MandiMate_PriceRecords";

  const command = new PutCommand({
    TableName: tableName,
    Item: {
      record_id: record.record_id || `rec_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      market_id: record.market_id,
      commodity_id: record.commodity_id,
      commodity_name: record.commodity_name,
      variety: record.variety || 'Standard',
      date: record.date,
      min_price: Number(record.min_price),
      modal_price: Number(record.modal_price),
      max_price: Number(record.max_price),
      arrival_quantity: Number(record.arrival_quantity),
      source: record.source || "Agmarknet / APMC",
      source_timestamp: record.source_timestamp || new Date().toISOString()
    }
  });

  return await client.send(command);
}

/**
 * Get user preferences from DynamoDB (PRD Sec 21)
 */
export async function getUserPreferencesFromDynamo(userId = 'default_farmer') {
  if (!isDynamoConfigured()) return null;
  try {
    const client = getDynamoDocClient();
    const command = new GetCommand({
      TableName: process.env.DYNAMO_TABLE_USERS || "MandiMate_Users",
      Key: { user_id: userId }
    });
    const res = await client.send(command);
    return res.Item || null;
  } catch (err) {
    console.warn("[DynamoService] Could not read user preferences:", err.message);
    return null;
  }
}
