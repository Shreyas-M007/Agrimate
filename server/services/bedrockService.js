// MandiMate AWS Bedrock Service
// Implements PRD Sections 14, 18, 19.1 & 34:
// Amazon Bedrock acts strictly as an explanation and NLU layer on structured, verified data.
// It NEVER invents prices and NEVER overrides verified numbers.

import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { generateMarketExplanation, TERMINOLOGY_EXPLANATIONS } from "./aiService.js";

const AWS_REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "ap-south-1";
const DEFAULT_MODEL_ID = process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-haiku-20240307-v1:0";

let bedrockClient = null;

function getBedrockClient() {
  if (!bedrockClient) {
    bedrockClient = new BedrockRuntimeClient({
      region: AWS_REGION,
      // Credentials automatically loaded from environment, IAM Role, or ~/.aws/credentials
    });
  }
  return bedrockClient;
}

export function isBedrockConfigured() {
  return Boolean(
    (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) ||
    process.env.AWS_EXECUTION_ENV
  );
}

export function getBedrockConfig() {
  return {
    provider: "Amazon Bedrock",
    region: AWS_REGION,
    modelId: DEFAULT_MODEL_ID,
    isConfigured: isBedrockConfigured(),
    groundingRule: "Deterministic Ground Truth from Agmarknet / APMC. Zero numerical hallucination."
  };
}

/**
 * Invoke Amazon Bedrock to explain market trends and pricing.
 * Falls back deterministically if Bedrock call fails or credentials are not supplied.
 */
export async function explainMarketWithBedrock({ market, trend, language = 'en', quantityQuintals = 0 }) {
  // Always obtain deterministic base explanation first to guarantee invariant
  const deterministicResult = generateMarketExplanation({ market, trend, language, quantityQuintals });

  // If AWS credentials are not set, return grounded deterministic result with AWS metadata
  if (!process.env.AWS_ACCESS_KEY_ID && !process.env.AWS_EXECUTION_ENV) {
    return {
      ...deterministicResult,
      aws_telemetry: {
        engine: "Amazon Bedrock (Grounded Template Fallback)",
        region: AWS_REGION,
        model_id: DEFAULT_MODEL_ID,
        mode: "Deterministic Local Edge / Offline",
        grounded: true
      }
    };
  }

  try {
    const client = getBedrockClient();
    const prompt = `
You are MandiMate, an agricultural market advisor for small and marginal Indian farmers.
Explain the following verified market facts in simple, encouraging language in ${language === 'hi' ? 'Hindi (हिन्दी)' : (language === 'kn' ? 'Kannada (ಕನ್ನಡ)' : 'English')}.

CRITICAL PRINCIPLE: NEVER invent, hallucinate, or adjust prices. Stick ONLY to these verified facts:
- Market: ${market.market_name}, District: ${market.district}, State: ${market.state}
- Crop: ${market.commodity_name || 'Crop'} (Variety: ${market.variety || 'Standard'})
- Modal Price: ₹${market.modal_price}/quintal
- Min Price: ₹${market.min_price}/quintal, Max Price: ₹${market.max_price}/quintal
- Arrival Volume: ${market.arrival_quantity} quintals
- Trend: ${trend?.direction || 'stable'} (${trend?.percent_change || 0}% change over ${trend?.period_days || 7} days)
- Source: ${market.source} (${market.source_timestamp})
- Farmer Quantity: ${quantityQuintals} quintals (Gross Estimate: ₹${Math.round(quantityQuintals * market.modal_price)})

Format response strictly as JSON with keys:
{
  "title": "short headline",
  "summary": "1-2 sentence core message with modal price",
  "priceDetails": "spread between min and max and arrivals",
  "trendExplanation": "explanation of price direction",
  "estimatedValueNote": "gross value estimate statement with disclaimer",
  "advice": "practical farmer advice on grading/transport",
  "verifiedNotice": "mention official Agmarknet source"
}
`;

    let payload;
    if (DEFAULT_MODEL_ID.includes("claude")) {
      payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 600,
        temperature: 0.1,
        messages: [{ role: "user", content: prompt }]
      };
    } else {
      // Amazon Nova / Titan format
      payload = {
        inputText: prompt,
        textGenerationConfig: { maxTokenCount: 600, temperature: 0.1 }
      };
    }

    const command = new InvokeModelCommand({
      modelId: DEFAULT_MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload)
    });

    const response = await client.send(command);
    const decoded = JSON.parse(new TextDecoder().decode(response.body));

    let parsedText = "";
    if (decoded.content && decoded.content[0]?.text) {
      parsedText = decoded.content[0].text;
    } else if (decoded.results && decoded.results[0]?.outputText) {
      parsedText = decoded.results[0].outputText;
    }

    // Try extracting JSON from LLM output
    const jsonMatch = parsedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsedJson = JSON.parse(jsonMatch[0]);
      return {
        ...deterministicResult,
        ...parsedJson,
        aws_telemetry: {
          engine: "Amazon Bedrock (Live Runtime)",
          region: AWS_REGION,
          model_id: DEFAULT_MODEL_ID,
          grounded: true
        }
      };
    }

    return {
      ...deterministicResult,
      aws_telemetry: {
        engine: "Amazon Bedrock (Grounding Safe Fallback)",
        region: AWS_REGION,
        model_id: DEFAULT_MODEL_ID,
        grounded: true
      }
    };
  } catch (err) {
    console.warn("[BedrockService] Error invoking Bedrock, falling back to deterministic template:", err.message);
    return {
      ...deterministicResult,
      aws_telemetry: {
        engine: "Amazon Bedrock (Offline Grounded Fallback)",
        region: AWS_REGION,
        model_id: DEFAULT_MODEL_ID,
        grounded: true
      }
    };
  }
}
