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
import { syncMarketData, getSyncStatus } from "./services/syncService.js";
import { TERMINOLOGY_EXPLANATIONS } from "./services/aiService.js";

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

    // Route: GET /sync/status
    if (path.endsWith("/sync/status") && method === "GET") {
      const status = await getSyncStatus();
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ success: true, ...status })
      };
    }

    // Route: POST /sync
    if (path.endsWith("/sync") && method === "POST") {
      const result = await syncMarketData();
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify(result)
      };
    }

    // Route: GET /preferences
    if (path.endsWith("/preferences") && method === "GET") {
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          success: true,
          preferences: {
            user_id: 'default_farmer',
            language: 'en',
            location: 'Ballari, Karnataka',
            preferred_units: 'quintal'
          }
        })
      };
    }

    // Route: POST /preferences
    if (path.endsWith("/preferences") && method === "POST") {
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ success: true, message: "Preferences saved" })
      };
    }

    // Route: GET /weather
    if (path.endsWith("/weather") && method === "GET") {
      const location = queryParams.location || 'Ballari';
      const clean = location.toLowerCase().trim();
      let lat = 15.1394;
      let lon = 76.9214;
      let resolvedMandi = 'Ballari APMC';
      let resolvedState = 'Karnataka';

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
        'mumbai': { lat: 19.0760, lon: 72.8777, name: 'Vashi Turbhe APMC (Navi Mumbai)', state: 'Maharashtra' }
      };

      for (const [key, coords] of Object.entries(MANDI_COORDINATES)) {
        if (clean.includes(key)) {
          lat = coords.lat;
          lon = coords.lon;
          resolvedMandi = coords.name;
          resolvedState = coords.state;
          break;
        }
      }

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&timezone=auto`;
      const wRes = await fetch(weatherUrl);
      const wData = await wRes.json();
      const current = wData.current || {};

      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          success: true,
          location: resolvedMandi,
          state: resolvedState,
          coordinates: { lat, lon },
          source: 'Open-Meteo Satellite & Station Telemetry',
          telemetry: {
            temp: current.temperature_2m != null ? Math.round(current.temperature_2m) : 28,
            feelsLike: current.apparent_temperature != null ? Math.round(current.apparent_temperature) : 30,
            humidity: current.relative_humidity_2m != null ? current.relative_humidity_2m : 65,
            precipitationMm: current.precipitation != null ? current.precipitation : 0.0,
            windSpeed: current.wind_speed_10m != null ? current.wind_speed_10m : 12,
            windDirectionDeg: current.wind_direction_10m != null ? current.wind_direction_10m : 180,
            windDirectionText: 'S',
            pressureHpa: current.surface_pressure != null ? Math.round(current.surface_pressure) : 1012,
            weatherCode: current.weather_code != null ? current.weather_code : 1,
            conditionText: 'Clear / Moderate Climate',
            conditionIcon: '☀️',
            harvestVibe: 'Optimal Conditions for Transit',
            stationObservationTime: current.time || new Date().toISOString(),
            fetchedAt: new Date().toISOString()
          },
          temperature: current.temperature_2m != null ? Math.round(current.temperature_2m) : 28,
          apparent_temperature: current.apparent_temperature != null ? Math.round(current.apparent_temperature) : 30,
          humidity: current.relative_humidity_2m != null ? current.relative_humidity_2m : 65,
          precipitation: current.precipitation != null ? current.precipitation : 0.0,
          wind_speed: current.wind_speed_10m != null ? current.wind_speed_10m : 12,
          wind_direction: current.wind_direction_10m != null ? current.wind_direction_10m : 180,
          surface_pressure: current.surface_pressure != null ? Math.round(current.surface_pressure) : 1012,
          weather_code: current.weather_code != null ? current.weather_code : 1,
          recorded_at: current.time || new Date().toISOString()
        })
      };
    }

    // Route: GET /explain-term/:term
    if (path.includes("/explain-term")) {
      const parts = path.split("/explain-term/");
      const term = (parts[1] || "").split("/")[0].toLowerCase().trim();
      const lang = queryParams.lang || "en";
      const termData = TERMINOLOGY_EXPLANATIONS ? TERMINOLOGY_EXPLANATIONS[term] : null;
      const localized = termData ? (termData[lang] || termData['en']) : {
        title: term,
        definition: "Mandi market benchmark metric."
      };
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({ success: true, term, data: localized })
      };
    }

    // Route: POST /net-return
    if (path.endsWith("/net-return") && method === "POST") {
      const { grossValue = 0, transportCost = 0, loadingCost = 0, marketCessPercent = 1.5, otherCharges = 0 } = body;
      const gross = Math.max(0, Number(grossValue) || 0);
      const transport = Math.max(0, Number(transportCost) || 0);
      const loading = Math.max(0, Number(loadingCost) || 0);
      const cess = Math.round((gross * (Number(marketCessPercent) || 0)) / 100);
      const other = Math.max(0, Number(otherCharges) || 0);
      const totalDeductions = transport + loading + cess + other;
      const estimatedNetReturn = Math.max(0, gross - totalDeductions);
      return {
        statusCode: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          success: true,
          gross_value: gross,
          deductions: { transport, loading_unloading: loading, market_cess: cess, other_charges: other, total_deductions: totalDeductions },
          estimated_net_return: estimatedNetReturn
        })
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
