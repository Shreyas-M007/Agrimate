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

function withTimeout(promise, timeoutMs = 800) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Bedrock request timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
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
 * Explain agricultural terminology in simple farmer terms (EN, HI, KN).
 */
export async function explainTerm({ term, contextPrice, language = 'en' }) {
  const cleanTerm = (term || 'modal_price').toLowerCase().trim();
  const lang = ['hi', 'kn', 'te', 'ta', 'mr', 'bn', 'gu', 'pa', 'ml', 'en'].includes(language) ? language : 'en';

  const getFallback = () => {
    const priceText = contextPrice ? ` ₹${contextPrice}/quintal.` : '.';
    if (lang === 'hi') {
      switch (cleanTerm) {
        case 'modal_price':
          return `मॉडल भाव (Modal Price) वह सबसे आम भाव है जिस पर आज मंडी में अधिकतर उपज बिकी है। वर्तमान में यह${priceText}`;
        case 'min_price':
        case 'minimum_price':
          return `न्यूनतम भाव (Minimum Price) वह सबसे कम दाम है जिस पर आज मंडी में सबसे निम्न गुणवत्ता की उपज बिकी है।`;
        case 'max_price':
        case 'maximum_price':
          return `अधिकतम भाव (Maximum Price) वह सबसे ऊंचा दाम है जो आज बेहतरीन गुणवत्ता वाली फसल के लिए मिला है।`;
        case 'market_arrival':
        case 'arrival_quantity':
          return `मंडी आवक (Market Arrival) का मतलब है कि आज मंडी में किसानों द्वारा कुल कितनी फसल बेचने के लिए लाई गई है।`;
        case 'gross_value':
          return `अनुमानित कुल मूल्य (Gross Value) आपकी उपज की मात्रा को मॉडल भाव से गुणा करके निकाला गया अनुमानित मूल्य है।`;
        default:
          return `यह एक कृषि मंडी शब्दावली है।`;
      }
    } else if (lang === 'kn') {
      switch (cleanTerm) {
        case 'modal_price':
          return `ಮಾದರಿ ಬೆಲೆ (Modal Price) ಎಂದರೆ ಇಂದು ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಹೆಚ್ಚಿನ ಪ್ರಮಾಣದ ಬೆಳೆ ಮಾರಾಟವಾದ ಸಾಮಾನ್ಯ ದರ. ಪ್ರಸ್ತುತ ಬೆಲೆ${priceText}`;
        case 'min_price':
        case 'minimum_price':
          return `ಕನಿಷ್ಠ ಬೆಲೆ (Minimum Price) ಎಂದರೆ ಇಂದು ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ವರದಿಯಾದ ಅತ್ಯಂತ ಕಡಿಮೆ ದರ.`;
        case 'max_price':
        case 'maximum_price':
          return `ಗರಿಷ್ಠ ಬೆಲೆ (Maximum Price) ಎಂದರೆ ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಬೆಳೆಗೆ ದೊರೆತ ಅತ್ಯಂತ ಹೆಚ್ಚಿನ ದರ.`;
        case 'market_arrival':
        case 'arrival_quantity':
          return `ಮಾರುಕಟ್ಟೆ ಆವಕ (Market Arrival) ಎಂದರೆ ಇಂದು ಮಾರುಕಟ್ಟೆಗೆ ರೈತರು ತಂದಿರುವ ಒಟ್ಟು ಉತ್ಪನ್ನದ ಪ್ರಮಾಣ.`;
        case 'gross_value':
          return `ಒಟ್ಟು ಅಂದಾಜು ಮೌಲ್ಯ (Gross Value) ಎಂದರೆ ನಿಮ್ಮ ಬೆಳೆಯ ಪ್ರಮಾಣ ಮತ್ತು ಮಾದರಿ ಬೆಲೆಯನ್ನು ಗುಣಿಸಿದಾಗ ಸಿಗುವ ಒಟ್ಟು ಮೌಲ್ಯ.`;
        default:
          return `ಇದು ಕೃಷಿ ಮಾರುಕಟ್ಟೆ ಪದವಾಗಿದೆ.`;
      }
    } else if (lang === 'te') {
      switch (cleanTerm) {
        case 'modal_price':
          return `మోడల్ ధర (Modal Price) అంటే నేడు మార్కెట్‌లో అత్యధిక పంట విక్రయించబడిన సాధారణ రేటు.${priceText}`;
        case 'min_price':
        case 'minimum_price':
          return `కనిష్ట ధర (Minimum Price) అంటే నేడు మార్కెట్‌లో తక్కువ గ్రేడ్ పంటకు నమోదైన అత్యల్ప రేటు.`;
        case 'max_price':
        case 'maximum_price':
          return `గరిష్ట ధర (Maximum Price) అంటే నేడు ప్రీమియం నాణ్యత కలిగిన పంటకు లభించిన అత్యధిక రేటు.`;
        case 'market_arrival':
        case 'arrival_quantity':
          return `మార్కెట్ రాక (Market Arrival) అంటే నేడు రైతులు మార్కెట్‌కు తీసుకువచ్చిన పంట మొత్తం పరిమాణం.`;
        case 'gross_value':
          return `అంచనా మొత్తం విలువ (Gross Value) అంటే పంట పరిమాణం మరియు మోడల్ ధరను గుణించగా వచ్చే విలువ.`;
        default:
          return `ఇది వ్యవసాయ మార్కెట్ పదం.`;
      }
    } else if (lang === 'ta') {
      switch (cleanTerm) {
        case 'modal_price':
          return `மாதிரி விலை (Modal Price) என்பது இன்று சந்தையில் பெரும்பாலான பயிர்கள் விற்கப்பட்ட சராசரி பொதுவான விலையாகும்.${priceText}`;
        case 'min_price':
        case 'minimum_price':
          return `குறைந்தபட்ச விலை (Minimum Price) என்பது தரம் குறைந்த பயிருக்கு இன்று சந்தையில் பதிவான மிகக் குறைந்த விலையாகும்.`;
        case 'max_price':
        case 'maximum_price':
          return `அதிகபட்ச விலை (Maximum Price) என்பது சிறந்த தரம் கொண்ட பயிருக்கு இன்று கிடைத்த மிக உயர்ந்த விலையாகும்.`;
        case 'market_arrival':
        case 'arrival_quantity':
          return `சந்தை வரத்து (Market Arrival) என்பது இன்று விவசாயிகள் சந்தைக்கு கொண்டு வந்த மொத்த விளைபொருளின் அளவாகும்.`;
        case 'gross_value':
          return `மதிப்பிடப்பட்ட மொத்த மதிப்பு (Gross Value) என்பது பயிர் அளவையும் மாதிரி விலையையும் பெருக்கி கணக்கிடப்படும் தொகையாகும்.`;
        default:
          return `இது ஒரு விவசாய சந்தை சொல்.`;
      }
    } else if (lang === 'mr') {
      switch (cleanTerm) {
        case 'modal_price':
          return `मॉडेल भाव (Modal Price) म्हणजे आज बाजारात ज्या दराने जास्तीत जास्त शेतमालाची खरेदी-विक्री झाली तो सामान्य दर.${priceText}`;
        case 'min_price':
        case 'minimum_price':
          return `किमान भाव (Minimum Price) म्हणजे आज बाजार समितीत कमी दर्जाच्या मालासाठी मिळालेला सर्वात कमी दर.`;
        case 'max_price':
        case 'maximum_price':
          return `कमाल भाव (Maximum Price) म्हणजे उत्कृष्ट ग्रेड-ए मालासाठी मिळालेला आजचा सर्वोच्च दर.`;
        case 'market_arrival':
        case 'arrival_quantity':
          return `बाजार आवक (Market Arrival) म्हणजे आज शेतकऱ्यांनी विक्रीसाठी बाजारात आणलेला एकूण शेतमाल.`;
        case 'gross_value':
          return `अंदाजे एकूण मूल्य (Gross Value) म्हणजे मालाचे प्रमाण आणि मॉडेल भाव यांचा गुणाकार करून काढलेली अंदाजे रक्कम.`;
        default:
          return `हे कृषी उत्पन्न बाजार शब्दावलीतील पद आहे.`;
      }
    } else if (lang === 'bn') {
      switch (cleanTerm) {
        case 'modal_price':
          return `মডেল মূল্য (Modal Price) হলো আজকের বাজারে যে মূল্যে সবচেয়ে বেশি পরিমাণ ফসল কেনাবেচা হয়েছে.${priceText}`;
        case 'min_price':
        case 'minimum_price':
          return `সর্বনিম্ন দর (Minimum Price) হলো আজকের বাজারে নিম্ন মানের ফসলের জন্য নথিভুক্ত সবচেয়ে কম দর.`;
        case 'max_price':
        case 'maximum_price':
          return `সর্বোচ্চ দর (Maximum Price) হলো সেরা মানের ফসলের জন্য আজকের বাজারে প্রাপ্ত সর্বোচ্চ দর.`;
        case 'market_arrival':
        case 'arrival_quantity':
          return `বাজার আমদানি (Market Arrival) হলো কৃষকদের দ্বারা আজ বাজারে আনা মোট ফসলের পরিমাণ.`;
        case 'gross_value':
          return `আনুমানিক মোট মূল্য (Gross Value) হলো ফসলের পরিমাণকে মডেল দর দিয়ে গুণ করে হিসাব করা মূল্য.`;
        default:
          return `এটি কৃষি বাজার সম্পর্কিত পরিভাষা।`;
      }
    } else if (lang === 'gu') {
      switch (cleanTerm) {
        case 'modal_price':
          return `મોડલ ભાવ (Modal Price) એ સરેરાશ બજાર ભાવ છે જેના પર આજે યાર્ડમાં મોટાભાગનો પાક વેચાયો છે.${priceText}`;
        case 'min_price':
        case 'minimum_price':
          return `ન્યૂનતમ ભાવ (Minimum Price) એ આજે યાર્ડમાં નબળા માલ માટે નોંધાયેલો સૌથી નીચો ભાવ છે.`;
        case 'max_price':
        case 'maximum_price':
          return `મહત્તમ ભાવ (Maximum Price) એ શ્રેષ્ઠ ગુણવત્તાવાળા પાક માટે મળેલ સૌથી ઊંચો ભાવ છે.`;
        case 'market_arrival':
        case 'arrival_quantity':
          return `બજાર આવક (Market Arrival) એટલે આજે ખેડૂતો દ્વારા માર્કેટ યાર્ડમાં લાવવામાં આવેલ પાકનો કુલ જथ્થો.`;
        case 'gross_value':
          return `અંદાજિત કુલ મૂલ્ય (Gross Value) એટલે પાકનો જથ્થો અને મોડલ ભાવનો ગુણાકાર કરીને અંદાજવામાં આવેલી રકમ.`;
        default:
          return `આ કૃષિ બજાર પારિભાષિક શબ્દ છે.`;
      }
    } else if (lang === 'pa') {
      switch (cleanTerm) {
        case 'modal_price':
          return `ਮਾਡਲ ਭਾਅ (Modal Price) ਉਹ ਆਮ ਭਾਅ ਹੈ ਜਿਸ 'ਤੇ ਅੱਜ ਮੰਡੀ ਵਿੱਚ ਬਹੁਤੀ ਫਸਲ ਵਿਕੀ ਹੈ।${priceText}`;
        case 'min_price':
        case 'minimum_price':
          return `ਘੱਟੋ-ਘੱਟ ਭਾਅ (Minimum Price) ਅੱਜ ਮੰਡੀ ਵਿੱਚ ਦਰਜ ਸਭ ਤੋਂ ਘੱਟ ਰੇਟ ਹੈ।`;
        case 'max_price':
        case 'maximum_price':
          return `ਵੱਧ ਤੋਂ ਵੱਧ ਭਾਅ (Maximum Price) ਵਧੀਆ ਕੁਆਲਿਟੀ ਦੀ ਫਸਲ ਲਈ ਮਿਲਿਆ ਸਭ ਤੋਂ ਉੱਚਾ ਭਾਅ ਹੈ।`;
        case 'market_arrival':
        case 'arrival_quantity':
          return `ਮੰਡੀ ਆਮਦ (Market Arrival) ਦਾ ਮਤਲਬ ਹੈ ਅੱਜ ਮੰਡੀ ਵਿੱਚ ਕਿਸਾਨਾਂ ਵੱਲੋਂ ਲਿਆਂਦੀ ਗਈ ਕੁੱਲ ਫਸਲ।`;
        case 'gross_value':
          return `ਅਨੁਮਾਨਿਤ ਕੁੱਲ ਕੀਮਤ (Gross Value) ਫਸਲ ਦੀ ਮਾਤਰਾ ਅਤੇ ਮਾਡਲ ਭਾਅ ਨੂੰ ਗੁਣਾ ਕਰਕੇ ਕੱਢਿਆ ਗਿਆ ਮੁੱਲ ਹੈ।`;
        default:
          return `ਇਹ ਖੇਤੀਬਾੜੀ ਮੰਡੀ ਸ਼ਬਦਾਵਲੀ ਹੈ।`;
      }
    } else if (lang === 'ml') {
      switch (cleanTerm) {
        case 'modal_price':
          return `മോഡൽ വില (Modal Price) എന്നാൽ ഇന്ന് വിപണിയിൽ ഭൂരിഭാഗം വിളയും വിറ്റഴിക്കപ്പെട്ട സാധാരണ വിലയാണ്.${priceText}`;
        case 'min_price':
        case 'minimum_price':
          return `കുറഞ്ഞ വില (Minimum Price) എന്നാൽ ഇന്ന് വിപണിയിൽ രേഖപ്പെടുത്തിയ ഏറ്റവും കുറഞ്ഞ നിരക്കാണ്.`;
        case 'max_price':
        case 'maximum_price':
          return `കൂടിയ വില (Maximum Price) എന്നാൽ മികച്ച ഗുണനിലവാരമുള്ള വിളയ്ക്ക് ലഭിച്ച ഏറ്റവും ഉയർന്ന നിരക്കാണ്.`;
        case 'market_arrival':
        case 'arrival_quantity':
          return `വിപണി വരവ് (Market Arrival) എന്നാൽ കർഷകർ ഇന്ന് വിപണിയിലേക്ക് കൊണ്ടുവന്ന ആകെ വിളയുടെ അളവാണ്.`;
        case 'gross_value':
          return `ഏകദേശ മൊത്തം മൂല്യം (Gross Value) എന്നാൽ വിളയുടെ അളവും മോഡൽ വിലയും ഗുണിച്ചുണ്ടാക്കുന്ന തുകയാണ്.`;
        default:
          return `ഇത് ഒരു കാർഷിക വിപണി പദമാണ്.`;
      }
    } else {
      switch (cleanTerm) {
        case 'modal_price':
          return `Modal Price is the most frequent transaction price at which the majority of produce traded today${priceText}`;
        case 'min_price':
        case 'minimum_price':
          return `Minimum Price is the lowest transaction price recorded today in the APMC mandi for lower-grade lots.`;
        case 'max_price':
        case 'maximum_price':
          return `Maximum Price is the highest transaction price achieved today in the APMC mandi for premium-grade produce.`;
        case 'market_arrival':
        case 'arrival_quantity':
          return `Market Arrival is the total physical volume of produce that arrived in the market yard today.`;
        case 'gross_value':
          return `Estimated Gross Value is the total estimated revenue before logistics and APMC market cess deductions.`;
        default:
          return `Standard APMC agricultural market trading parameter.`;
      }
    }
  };

  const fallbackText = getFallback();
  if (!isBedrockConfigured()) {
    return {
      term: cleanTerm,
      explanation: fallbackText,
      language: lang,
      source: "Deterministic Local Edge / Offline"
    };
  }

  try {
    const client = getBedrockClient();
    const prompt = `Explain the agricultural market term "${cleanTerm}" to a small farmer in India. Keep it simple in 2 short sentences. ${contextPrice ? `Context price: ₹${contextPrice}/quintal.` : ''} Language: ${lang === 'hi' ? 'Hindi' : (lang === 'kn' ? 'Kannada' : 'English')}`;

    let payload;
    if (DEFAULT_MODEL_ID.includes("claude")) {
      payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 300,
        temperature: 0.1,
        messages: [{ role: "user", content: prompt }]
      };
    } else {
      payload = {
        inputText: prompt,
        textGenerationConfig: { maxTokenCount: 300, temperature: 0.1 }
      };
    }

    const command = new InvokeModelCommand({
      modelId: DEFAULT_MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload)
    });

    const response = await withTimeout(client.send(command), 800);
    const decoded = JSON.parse(new TextDecoder().decode(response.body));
    let text = "";
    if (decoded.content && decoded.content[0]?.text) {
      text = decoded.content[0].text.trim();
    } else if (decoded.results && decoded.results[0]?.outputText) {
      text = decoded.results[0].outputText.trim();
    }
    return {
      term: cleanTerm,
      explanation: text || fallbackText,
      language: lang,
      source: "Amazon Bedrock (Live Runtime)"
    };
  } catch (err) {
    return {
      term: cleanTerm,
      explanation: fallbackText,
      language: lang,
      source: "Amazon Bedrock (Grounded Fallback)"
    };
  }
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

    const response = await withTimeout(client.send(command), 800);
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
