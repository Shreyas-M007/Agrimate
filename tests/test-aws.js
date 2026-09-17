// MandiMate AWS Architecture Unit & Integration Test
// Verifies PRD Sections 14, 18, 19, 21, 22

import assert from 'assert';
import { handler as apiHandler, pipelineHandler } from '../server/lambda.js';
import { getBedrockConfig, explainMarketWithBedrock } from '../server/services/bedrockService.js';
import { getDynamoConfig } from '../server/services/dynamoService.js';

async function runAwsTests() {
  console.log("🌾 Running AWS Architecture Verification Tests...\n");

  // 1. Check Bedrock Configuration
  const bedrockConfig = getBedrockConfig();
  console.log("1. Amazon Bedrock Config:", bedrockConfig);
  assert.strictEqual(bedrockConfig.provider, "Amazon Bedrock");
  assert.ok(bedrockConfig.modelId.includes("claude") || bedrockConfig.modelId.includes("nova") || bedrockConfig.modelId.includes("titan"));

  // 2. Check DynamoDB Configuration
  const dynamoConfig = getDynamoConfig();
  console.log("2. Amazon DynamoDB Config:", dynamoConfig);
  assert.strictEqual(dynamoConfig.provider, "Amazon DynamoDB");
  assert.ok(dynamoConfig.tables.priceRecords);

  // 3. Test API Gateway Lambda Proxy Handler: GET /aws/status
  const statusEvent = {
    httpMethod: "GET",
    path: "/api/aws/status",
    queryStringParameters: null
  };
  const statusRes = await apiHandler(statusEvent, {});
  assert.strictEqual(statusRes.statusCode, 200);
  const statusBody = JSON.parse(statusRes.body);
  assert.strictEqual(statusBody.platform, "AWS");
  assert.strictEqual(statusBody.success, true);
  console.log("3. API Gateway /aws/status Lambda handler: PASSED");

  // 4. Test API Gateway Lambda Proxy Handler: GET /markets
  const marketsEvent = {
    httpMethod: "GET",
    path: "/api/markets",
    queryStringParameters: {
      crop: "Tomato",
      location: "Ballari",
      quantity: "500",
      unit: "kg"
    }
  };
  const marketsRes = await apiHandler(marketsEvent, {});
  assert.strictEqual(marketsRes.statusCode, 200);
  const marketsBody = JSON.parse(marketsRes.body);
  assert.strictEqual(marketsBody.success, true);
  assert.ok(marketsBody.markets.length > 0);
  assert.strictEqual(marketsBody.normalized_quantity.in_quintals, 5);
  console.log(`4. API Gateway /markets Lambda handler: PASSED (Found ${marketsBody.markets.length} verified mandis)`);

  // 5. Test Bedrock Explanation Service (PRD Sec 14, 18, 35)
  const sampleMarket = marketsBody.markets[0];
  const explanation = await explainMarketWithBedrock({
    market: sampleMarket,
    trend: { direction: "increasing", percent_change: 8.5, period_days: 7 },
    language: "kn", // Kannada test per Section 35
    quantityQuintals: 5
  });
  assert.strictEqual(explanation.language, "kn");
  assert.ok(explanation.summary.length > 0);
  assert.ok(explanation.aws_telemetry);
  assert.strictEqual(explanation.aws_telemetry.grounded, true);
  console.log("5. Amazon Bedrock Multilingual Explanation (Kannada): PASSED");
  console.log("   Bedrock Summary:", explanation.summary);

  // 6. Test Scheduled Pipeline Lambda (PRD Sec 22)
  const pipelineRes = await pipelineHandler({ source: "aws.events", "detail-type": "Scheduled Event" }, {});
  assert.strictEqual(pipelineRes.statusCode, 200);
  const pipelineBody = JSON.parse(pipelineRes.body);
  assert.strictEqual(pipelineBody.success, true);
  assert.ok(pipelineBody.records_synced > 0);
  console.log(`6. Scheduled Lambda Data Pipeline: PASSED (Synced ${pipelineBody.records_synced} records)`);

  console.log("\n All AWS Architecture tests PASSED successfully!");
}

runAwsTests().catch(err => {
  console.error("❌ AWS test failed:", err);
  process.exit(1);
});
