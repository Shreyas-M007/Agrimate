// MandiMate AWS Lambda Serverless Handlers
// Implements PRD Section 19.2, 19.4 & 20:
// "Farmer UI → API Gateway → AWS Lambda → Agricultural APIs / verified datasets + DynamoDB cache → Amazon Bedrock → Farmer-friendly UI"

import { searchMarkets, getCommodities, getMarkets } from "./services/marketService.js";
import { getPriceTrends } from "./services/trendService.js";
import { explainMarketWithBedrock, getBedrockConfig } from "./services/bedrockService.js";
import { getSellingChecklist } from "./services/checklistService.js";
import { parseNaturalLanguageQuery } from "./services/nlpService.js";
import { getDynamoConfig } from "./services/dynamoService.js";
import { handler as scheduledPipelineHandler } from "./handlers/pipelineLambda.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Content-Type": "application/json"
};

/**
 * Universal AWS Lambda Handler for Amazon API Gateway Proxy Integration
 */
export async function handler(event, context) {
  const method = event.httpMethod || (event.requestContext && event.requestContext.http && event.requestContext.http.method) || "GET";
  const path = event.path || (event.rawPath) || "/";

  // Preflight CORS request
  if (method === "OPTIONS") {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: ""
    };
  }

  const queryParams = event.queryStringParameters || {};
  let body = {};
  if (event.body) {
    try {
      body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    } catch {
      body = {};
    }
  }

  try {
    // Route: GET /health
    if (path.endsWith("/health") && method === "GET") {
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ status: "healthy", platform: "AWS Lambda", timestamp: new Date().toISOString() })
      };
    }

    // Route: GET /aws/status
    if (path.endsWith("/aws/status") && method === "GET") {
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          success: true,
          platform: "AWS",
          bedrock: getBedrockConfig(),
          dynamodb: getDynamoConfig(),
          lambda: {
            runtime: "nodejs20.x",
            architecture: "arm64",
            handler: "server/lambda.handler"
          }
        })
      };
    }

    // Route: GET /crops
    if (path.endsWith("/crops") && method === "GET") {
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ success: true, commodities: getCommodities() })
      };
    }

    // Route: GET /markets
    if (path.endsWith("/markets") && method === "GET") {
      const { crop, location, quantity = 5, unit = 'quintal', lat, lon } = queryParams;
      const result = await searchMarkets({
        crop,
        location,
        quantity: Number(quantity),
        unit,
        lat: lat ? parseFloat(lat) : null,
        lon: lon ? parseFloat(lon) : null
      });
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify(result)
      };
    }

    // Route: GET /trends
    if (path.endsWith("/trends") && method === "GET") {
      const { crop, market_id, days = 7 } = queryParams;
      const result = await getPriceTrends({
        crop,
        marketId: market_id,
        days: parseInt(days, 10)
      });
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify(result)
      };
    }

    // Route: POST /explain (Amazon Bedrock)
    if (path.endsWith("/explain") && method === "POST") {
      const { market, trend, language = 'en', quantityQuintals = 0 } = body;
      if (!market) {
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({ success: false, error: "Market is required" })
        };
      }
      const explanation = await explainMarketWithBedrock({
        market,
        trend,
        language,
        quantityQuintals: Number(quantityQuintals) || 0
      });
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ success: true, explanation })
      };
    }

    // Route: POST /checklist
    if (path.endsWith("/checklist") && method === "POST") {
      const { crop = "produce", marketName = "APMC Mandi", quantityQuintals = 0, language = 'en' } = body;
      const checklist = getSellingChecklist({
        crop,
        marketName,
        quantityQuintals: Number(quantityQuintals) || 0,
        language
      });
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ success: true, checklist })
      };
    }

    // Route: POST /parse-query
    if (path.endsWith("/parse-query") && method === "POST") {
      const { query } = body;
      const parsed = parseNaturalLanguageQuery(query || "");
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify(parsed)
      };
    }

    // Route not matched
    return {
      statusCode: 404,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: `Not found: ${method} ${path}` })
    };
  } catch (error) {
    console.error("[AWS Lambda Error]", error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: error.message })
    };
  }
}

// Export Scheduled Ingestion Lambda for EventBridge
export const pipelineHandler = scheduledPipelineHandler;
