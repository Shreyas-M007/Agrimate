// PRD Section 18: Natural language understanding
// Converts farmer speech or freeform text into validated parameters: crop, location, quantity, unit

const CROP_SYNONYMS = {
  "tomato": ["tomato", "tomatoes", "tamatar", "टमाटर", "ಟೊಮೆಟೊ", "ಟೊಮ್ಯಾಟೊ"],
  "onion": ["onion", "onions", "pyaz", "pyaaz", "kanda", "प्याज", "कांदा", "ಈರುಳ್ಳಿ"],
  "potato": ["potato", "potatoes", "aloo", "alu", "batata", "आलू", "बटाटा", "ಆಲೂಗಡ್ಡೆ"],
  "groundnut": ["groundnut", "peanut", "mungfali", "moongphali", "मूंगफली", "ಕಡಲೆಕಾಯಿ", "ಶೇಂಗಾ"],
  "maize": ["maize", "corn", "makka", "makai", "मक्का", "ಮೆಕ್ಕೆಜೋಳ"],
  "paddy": ["paddy", "rice", "dhan", "chawal", "धान", "चावल", "ಭತ್ತ", "ಅಕ್ಕಿ"],
  "wheat": ["wheat", "gehu", "gehun", "गेहूं", "ಗೋಧಿ"],
  "cotton": ["cotton", "kapas", "kapaas", "कपास", "ಹತ್ತಿ"],
  "chilli": ["chilli", "chili", "mirch", "mirchi", "मिर्च", "ಮೆಣಸಿನಕಾಯಿ"]
};

const LOCATION_SYNONYMS = {
  "Ballari": ["ballari", "bellary", "बेल्लारी", "बल्लारी", "ಬಳ್ಳಾರಿ"],
  "Kolar": ["kolar", "कोलार", "ಕೋಲಾರ"],
  "Kudligi": ["kudligi", "कुडलिगी", "ಕೂಡ್ಲಿಗಿ"],
  "Hospet": ["hospet", "होसपेट", "ಹೊಸಪೇಟೆ"],
  "Chintamani": ["chintamani", "चिंतामणि", "ಚಿಂತಾಮಣಿ"],
  "Chikkaballapur": ["chikkaballapur", "चिकबल्लापुर", "ಚಿಕ್ಕಬಳ್ಳಾಪುರ"],
  "Bangalore": ["bangalore", "bengaluru", "बैंगलोर", "बेंगलुरु", "ಬೆಂಗಳೂರು"],
  "Belagavi": ["belagavi", "belgaum", "बेलगावी", "बेलगाम", "ಬೆಳಗಾವಿ"],
  "Mysuru": ["mysuru", "mysore", "मैसूर", "ಮೈಸೂರು"],
  "Davanagere": ["davanagere", "दावणगेरे", "ದಾವಣಗೆರೆ"],
  "Hubballi": ["hubballi", "hubli", "हुबली", "ಹುಬ್ಬಳ್ಳಿ"],
  "Nashik": ["nashik", "nasik", "नासिक", "नाशिक", "ನಾಸಿಕ್"],
  "Lasalgaon": ["lasalgaon", "लासलगांव", "ಲಾಸಲ್‌ಗಾಂವ್"],
  "Pimpalgaon": ["pimpalgaon", "पिंपलगांव"],
  "Pune": ["pune", "poona", "पुणे", "ಪುಣೆ"],
  "Guntur": ["guntur", "गुंटूर", "ಗುಂಟೂರು"],
  "Kurnool": ["kurnool", "कुरनूल", "ಕರ್ನೂಲ್"],
  "Warangal": ["warangal", "वारंगल", "ವಾರಂಗಲ್"],
  "Agra": ["agra", "आगरा", "ಆಗ್ರಾ"],
  "Khanna": ["khanna", "खन्ना", "ಖನ್ನಾ"],
  "Ludhiana": ["ludhiana", "लुधियाना", "ಲುಧಿಯಾನ"],
  "Karnal": ["karnal", "करनाल", "ಕರ್ನಾಲ್"],
  "Indore": ["indore", "इंदौर", "ಇಂದೋರ್"]
};

export function parseNaturalLanguageQuery(text) {
  if (!text || typeof text !== 'string') {
    return { success: false, error: "Query text cannot be empty." };
  }

  const cleanText = text.toLowerCase();

  // 1. Detect Crop
  let detectedCrop = null;
  for (const [standardName, synonyms] of Object.entries(CROP_SYNONYMS)) {
    if (synonyms.some(s => cleanText.includes(s.toLowerCase()))) {
      detectedCrop = standardName.charAt(0).toUpperCase() + standardName.slice(1);
      break;
    }
  }

  // 2. Detect Quantity and Unit
  let detectedQuantity = null;
  let detectedUnit = "quintal";

  const qtyMatch = cleanText.match(/(\d+(?:\.\d+)?)\s*(kg|kgs|kilo|kilogram|kilograms|quintal|quintals|qtl|qtls|tonne|tonnes|ton|tons|क्विंटल|किलो|टन|ಕ್ವಿಂಟಾಲ್|ಕೆಜಿ|ಟನ್)?/i);

  if (qtyMatch) {
    detectedQuantity = parseFloat(qtyMatch[1]);
    const rawUnit = (qtyMatch[2] || "").toLowerCase();

    if (rawUnit.includes("kg") || rawUnit.includes("kilo") || rawUnit.includes("किलो") || rawUnit.includes("ಕೆಜಿ")) {
      detectedUnit = "kg";
    } else if (rawUnit.includes("ton") || rawUnit.includes("टन") || rawUnit.includes("ಟನ್")) {
      detectedUnit = "tonne";
    } else {
      detectedUnit = "quintal";
    }
  }

  // 3. Detect Location
  let detectedLocation = null;
  for (const [canonicalLoc, synonyms] of Object.entries(LOCATION_SYNONYMS)) {
    if (synonyms.some(s => cleanText.includes(s.toLowerCase()))) {
      detectedLocation = canonicalLoc;
      break;
    }
  }

  // Fallback PIN code check if 6 digits found
  const pinMatch = cleanText.match(/\b\d{6}\b/);
  if (pinMatch && !detectedLocation) {
    detectedLocation = pinMatch[0];
  }

  return {
    success: true,
    raw_query: text,
    parsed: {
      crop: detectedCrop || "Tomato",
      location: detectedLocation || "Ballari",
      quantity: detectedQuantity || 5,
      unit: detectedUnit
    },
    confidence: {
      crop_detected: !!detectedCrop,
      location_detected: !!detectedLocation,
      quantity_detected: !!detectedQuantity
    }
  };
}
