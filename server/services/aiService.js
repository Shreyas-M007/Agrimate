// MandiMate AI Explanation Layer
// Strict Principle: Bedrock/AI acts solely as an explanation layer for structured verified data.
// It NEVER invents prices and NEVER overrides verified numbers.

export const TERMINOLOGY_EXPLANATIONS = {
  modal_price: {
    en: {
      term: "Modal Price",
      title: "What is Modal Price?",
      definition: "The modal price is the most common price at which the majority of the crop was bought and sold in the market today.",
      analogy: "Think of it like the standard rate of the day. If 10 lots were sold, and 7 of them were sold around ₹2,200/quintal, ₹2,200 is the modal price. It is the most realistic price for average-to-good quality produce.",
      farmerTip: "Use the modal price to budget your expected earnings, rather than the highest price."
    },
    hi: {
      term: "मोडल भाव (Modal Price)",
      title: "मोडल भाव क्या होता है?",
      definition: "मोडल भाव वह भाव है जिस पर आज मंडी में सबसे ज्यादा फसल बिकी।",
      analogy: "इसे आज का 'आम भाव' समझें। अगर 10 ढेरियों में से 7 ढेरियां ₹2,200 प्रति क्विंटल पर बिकीं, तो ₹2,200 मोडल भाव है। अच्छी और सामान्य गुणवत्ता के लिए यही सबसे यथार्थवादी भाव होता है।",
      farmerTip: "अपनी अनुमानित आय की गणना के लिए अधिकतम भाव के बजाय हमेशा मोडल भाव का उपयोग करें।"
    },
    kn: {
      term: "ಮಾದರಿ ಬೆಲೆ (Modal Price)",
      title: "ಮಾದರಿ ಬೆಲೆ (Modal Price) ಎಂದರೇನು?",
      definition: "ಮಾದರಿ ಬೆಲೆ ಎಂದರೆ ಇಂದು ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಗರಿಷ್ಠ ಪ್ರಮಾಣದ ಬೆಳೆ ಮಾರಾಟವಾದ ಅತ್ಯಂತ ಸಾಮಾನ್ಯ ಬೆಲೆ.",
      analogy: "ಇದನ್ನು ದಿನದ 'ಸಾಮಾನ್ಯ ದರ' ಎಂದು ಭಾವಿಸಿ. ಉದಾಹರಣೆಗೆ 10 ರಾಶಿಗಳಲ್ಲಿ 7 ರಾಶಿಗಳು ಕ್ವಿಂಟಾಲ್‌ಗೆ ₹2,200 ಕ್ಕೆ ಮಾರಾಟವಾದರೆ, ₹2,200 ಮಾದರಿ ಬೆಲೆಯಾಗಿದೆ. ಇದು ವಾಸ್ತವಿಕ ನಿರೀಕ್ಷಿತ ಬೆಲೆಯಾಗಿದೆ.",
      farmerTip: "ಗರಿಷ್ಠ ಬೆಲೆಗಿಂತ ಮಾದರಿ ಬೆಲೆಯನ್ನು ಆಧರಿಸಿ ನಿಮ್ಮ ಆದಾಯದ ಅಂದಾಜು ಮಾಡಿ."
    }
  },
  min_price: {
    en: {
      term: "Minimum Price",
      title: "What is Minimum Price?",
      definition: "The lowest price recorded in the mandi today, usually for lower-grade, damaged, or wet produce.",
      analogy: "If a farmer brings produce with high moisture, cuts, or uneven sorting, buyers bid lower rates starting at this minimum floor.",
      farmerTip: "Proper grading and drying at your farm helps ensure you stay well above this minimum price."
    },
    hi: {
      term: "न्यूनतम भाव (Minimum Price)",
      title: "न्यूनतम भाव क्या होता है?",
      definition: "मंडी में आज का सबसे कम दर्ज किया गया भाव, जो आमतौर पर कम गुणवत्ता, गीली या कटी-फटी फसल के लिए होता है।",
      analogy: "यदि फसल में नमी अधिक हो या छंटाई न की गई हो, तो व्यापारी सबसे निचली बोली लगाते हैं।",
      farmerTip: "खेत पर ही अच्छी छंटाई और सफाई करने से आपकी फसल को कभी न्यूनतम भाव पर नहीं बेचना पड़ेगा।"
    },
    kn: {
      term: "ಕನಿಷ್ಠ ಬೆಲೆ (Minimum Price)",
      title: "ಕನಿಷ್ಠ ಬೆಲೆ ಎಂದರೇನು?",
      definition: "ಇಂದು ಮಂಡಿಯಲ್ಲಿ ದಾಖಲಾದ ಅತ್ಯಂತ ಕಡಿಮೆ ಬೆಲೆ. ಇದು ಸಾಮಾನ್ಯವಾಗಿ ಕಡಿಮೆ ಗುಣಮಟ್ಟದ ಅಥವಾ ಹಾನಿಗೊಳಗಾದ ಬೆಳೆಗೆ ನೀಡಲಾಗುತ್ತದೆ.",
      analogy: "ಬೆಳೆಯಲ್ಲಿ ತೇವಾಂಶ ಹೆಚ್ಚಾಗಿದ್ದರೆ ಅಥವಾ ಸರಿಯಾಗಿ ವಿಂಗಡಿಸದಿದ್ದರೆ ವ್ಯಾಪಾರಿಗಳು ಕನಿಷ್ಠ ಬೆಲೆಗೆ ಬಿಡ್ ಮಾಡುತ್ತಾರೆ.",
      farmerTip: "ಮನೆಯಲ್ಲೇ ಗುಣಮಟ್ಟದ ಆಧಾರದ ಮೇಲೆ ವಿಂಗಡಿಸಿ ತಂದರೆ ಕನಿಷ್ಠ ಬೆಲೆಯ ಅಪಾಯ ತಪ್ಪಿಸಬಹುದು."
    }
  },
  max_price: {
    en: {
      term: "Maximum Price",
      title: "What is Maximum Price?",
      definition: "The highest price achieved today by premium Grade-A, perfectly sorted, and fresh produce.",
      analogy: "This is the top ceiling paid by selective buyers for the absolute best quality lots in the morning auction.",
      farmerTip: "Do not calculate your entire harvest value on this price unless your entire lot is top-tier export grade."
    },
    hi: {
      term: "अधिकतम भाव (Maximum Price)",
      title: "अधिकतम भाव क्या होता है?",
      definition: "मंडी में सर्वश्रेष्ठ गुणवत्ता (Grade-A), साफ और एक समान उपज के लिए मिलने वाला सबसे ऊंचा भाव।",
      analogy: "यह प्रीमियम खरीदारों द्वारा चुनिंदा उत्तम लॉट के लिए दी जाने वाली सर्वोच्च कीमत है।",
      farmerTip: "पूरी फसल के लिए इस भाव की उम्मीद न करें, जब तक कि पूरी उपज प्रथम श्रेणी की न हो।"
    },
    kn: {
      term: "ಗರಿಷ್ಠ ಬೆಲೆ (Maximum Price)",
      title: "ಗರಿಷ್ಠ ಬೆಲೆ ಎಂದರೇನು?",
      definition: "ಉತ್ತಮ ಗುಣಮಟ್ಟದ (Grade-A), ಸಂಪೂರ್ಣ ಸ್ವಚ್ಛವಾದ ಮತ್ತು ಆಕರ್ಷಕ ಬೆಳೆಗೆ ಸಿಗುವ ಅತ್ಯುನ್ನತ ಬೆಲೆ.",
      analogy: "ಬೆಳಗಿನ ಹರಾಜಿನಲ್ಲಿ ಶ್ರೇಷ್ಠ ದರ್ಜೆಯ ಬೆಳೆಗೆ ಪ್ರೀಮಿಯಂ ಖರೀದಿದಾರರು ನೀಡುವ ಅತ್ಯುನ್ನತ ದರ ಇದಾಗಿದೆ.",
      farmerTip: "ನಿಮ್ಮ ಸಂಪೂರ್ಣ ಬೆಳೆ ಮೊದಲ ದರ್ಜೆಯದ್ದಾಗಿದ್ದರೆ ಮಾತ್ರ ಈ ಗರಿಷ್ಠ ಬೆಲೆ ನಿರೀಕ್ಷಿಸಬಹುದು."
    }
  },
  arrival_quantity: {
    en: {
      term: "Market Arrivals",
      title: "What are Market Arrivals?",
      definition: "The total quantity of this crop brought into the mandi by all farmers today (in quintals or tonnes).",
      analogy: "High arrivals mean plenty of supply, which often softens prices. Low arrivals mean scarce supply, which can push buyers to bid higher.",
      farmerTip: "If heavy arrivals are reported for consecutive days, prices might ease downward."
    },
    hi: {
      term: "मंडी आवक (Market Arrivals)",
      title: "मंडी आवक का क्या मतलब है?",
      definition: "आज सभी किसानों द्वारा इस फसल की मंडी में लाई गई कुल मात्रा (क्विंटल या टन में)।",
      analogy: "अधिक आवक का मतलब है ज्यादा माल, जिससे भाव घट सकते हैं। कम आवक का मतलब है कमी, जिससे व्यापारी ऊंची बोली लगाते हैं।",
      farmerTip: "यदि लगातार कई दिनों से भारी आवक हो रही है, तो भाव में नरमी आ सकती है।"
    },
    kn: {
      term: "ಮಾರುಕಟ್ಟೆ ಆವಕ (Market Arrivals)",
      title: "ಮಾರುಕಟ್ಟೆ ಆವಕ ಎಂದರೇನು?",
      definition: "ಇಂದು ಎಲ್ಲಾ ರೈತರು ಈ ಬೆಳೆಯನ್ನು ಮಂಡಿಗೆ ತಂದಿರುವ ಒಟ್ಟು ಪ್ರಮಾಣ (ಕ್ವಿಂಟಾಲ್ ಅಥವಾ ಟನ್‌ಗಳಲ್ಲಿ).",
      analogy: "ಹೆಚ್ಚು ಆವಕ ಎಂದರೆ ಹೆಚ್ಚಿನ ಪೂರೈಕೆ, ಇದರಿಂದ ಬೆಲೆಗಳು ಕಡಿಮೆಯಾಗಬಹುದು. ಕಡಿಮೆ ಆವಕವಿದ್ದರೆ ಸ್ಪರ್ಧೆ ಹೆಚ್ಚಾಗಿ ಬೆಲೆ ಏರಬಹುದು.",
      farmerTip: "ಮಂಡಿಯಲ್ಲಿ ನಿರಂತರವಾಗಿ ಹೆಚ್ಚು ಆವಕ ಕಂಡುಬಂದರೆ ಬೆಲೆಗಳು ಇಳಿಯುವ ಸಾಧ್ಯತೆ ಇರುತ್ತದೆ."
    }
  }
};

const CROP_LOCAL_NAMES = {
  "tomato": { hi: "टमाटर", kn: "ಟೊಮೆಟೊ", te: "టమోటా", ta: "தக்காளி", mr: "टोमॅटो", bn: "টমেটো", gu: "ટામેટા", pa: "ਟਮਾਟਰ", ml: "തക്കാളി" },
  "onion": { hi: "प्याज", kn: "ಈರುಳ್ಳಿ", te: "ఉల్లిపాయ", ta: "வெங்காயம்", mr: "कांदा", bn: "পেঁয়াজ", gu: "ડુંગળી", pa: "ਪਿਆਜ਼", ml: "സവാള" },
  "potato": { hi: "आलू", kn: "ಆಲೂಗಡ್ಡೆ", te: "బంగాళాదుంప", ta: "உருளைக்கிழங்கு", mr: "बटाटा", bn: "আলু", gu: "બટાટા", pa: "ਆਲੂ", ml: "ഉരുളക്കിഴങ്ങ്" },
  "groundnut": { hi: "मूंगफली", kn: "ಕಡಲೆಕಾಯಿ", te: "వేరుశెనగ", ta: "வேர்க்கடலை", mr: "भुईमूग", bn: "চিনাবাদাম", gu: "મગફળી", pa: "ਮੂੰਗਫਲੀ", ml: "നിലക്കടല" },
  "maize": { hi: "मक्का", kn: "ಮೆಕ್ಕೆಜೋಳ", te: "మొక్కజొన్న", ta: "மக்காச்சோளம்", mr: "मका", bn: "ভুট্টা", gu: "મકાઈ", pa: "ਮੱਕੀ", ml: "ചോളം" },
  "paddy": { hi: "धान", kn: "ಭತ್ತ", te: "వరి", ta: "நெல்", mr: "भात", bn: "ধান", gu: "ડાંગર", pa: "ਝੋਨਾ", ml: "നെല്ല്" },
  "wheat": { hi: "गेहूं", kn: "ಗೋಧಿ", te: "గోధుమలు", ta: "கோதுமை", mr: "गहू", bn: "গম", gu: "ઘઉં", pa: "ਕਣਕ", ml: "ഗോതമ്പ്" },
  "cotton": { hi: "कपास", kn: "ಹತ್ತಿ", te: "ప్రత్తి", ta: "பருத்தி", mr: "कापूस", bn: "তুলা", gu: "કપાસ", pa: "ਨਰਮਾ", ml: "പരുത്തി" },
  "chilli": { hi: "मिर्च", kn: "ಮೆಣಸಿನಕಾಯಿ", te: "మిరపకాయ", ta: "மிளகாய்", mr: "मिरची", bn: "লঙ্কা", gu: "મરચાં", pa: "ਮਿਰਚ", ml: "മുളക്" }
};

// Bedrock-style narrative explanation generator based strictly on retrieved verified facts
export function generateMarketExplanation({ market, trend, language = 'en', quantityQuintals = 0 }) {
  const lang = ['hi', 'kn', 'te', 'ta', 'mr', 'bn', 'gu', 'pa', 'ml', 'en'].includes(language) ? language : 'en';

  const rawCrop = (market.commodity_name || "produce").toLowerCase();
  const localizedCrop = (CROP_LOCAL_NAMES[rawCrop] && CROP_LOCAL_NAMES[rawCrop][lang]) 
    ? CROP_LOCAL_NAMES[rawCrop][lang] 
    : (market.commodity_name || "produce");

  const cropName = localizedCrop;
  const marketName = market.market_name;
  const modalPrice = market.modal_price;
  const minPrice = market.min_price;
  const maxPrice = market.max_price;
  const spread = maxPrice - minPrice;
  const freshness = market.freshness;
  const arrivalQty = market.arrival_quantity;

  const trendSymbol = trend?.symbol || "→";
  const trendPercent = trend?.percent_change || 0;
  const trendDir = trend?.direction || "stable";

  let grossEstimated = quantityQuintals > 0 ? (quantityQuintals * modalPrice) : null;

  if (lang === 'hi') {
    let trendNarrative = "";
    if (trendDir === "increasing") {
      trendNarrative = `पिछले ${trend?.period_days || 7} दिनों में भाव में ${trendPercent}% की बढ़ोतरी (↑) दर्ज की गई है। मांग अच्छी बनी हुई है।`;
    } else if (trendDir === "decreasing") {
      trendNarrative = `पिछले ${trend?.period_days || 7} दिनों में भाव ${Math.abs(trendPercent)}% नीचे (↓) आए हैं। आवक बढ़ने के कारण भाव में थोड़ी नरमी है।`;
    } else {
      trendNarrative = `पिछले ${trend?.period_days || 7} दिनों से भाव लगभग स्थिर (→) बने हुए हैं, जिसमें 1.5% से कम का फेरबदल हुआ है।`;
    }

    const valueNote = grossEstimated 
      ? `आपके ${quantityQuintals} क्विंटल के लिए मोडल भाव के अनुसार अनुमानित सकल मूल्य ₹${grossEstimated.toLocaleString('en-IN')} बनता है (यह गारंटीकृत आय नहीं है)।`
      : "";

    return {
      language: 'hi',
      title: `${marketName} में ${cropName} बाजार का विश्लेषण`,
      summary: `आज ${marketName} में ${cropName} का मुख्य मोडल भाव ₹${modalPrice.toLocaleString('en-IN')}/क्विंटल दर्ज किया गया है (${freshness})।`,
      priceDetails: `न्यूनतम भाव ₹${minPrice.toLocaleString('en-IN')} तथा अधिकतम भाव ₹${maxPrice.toLocaleString('en-IN')} रहा (अंतर ₹${spread})। आज कुल आवक लगभग ${arrivalQty} क्विंटल रही।`,
      trendExplanation: trendNarrative,
      estimatedValueNote: valueNote,
      advice: `यदि आपकी उपज अच्छी गुणवत्ता की है, तो आप मोडल भाव (₹${modalPrice}/क्विंटल) या उससे थोड़ा ऊपर मिलने की उम्मीद कर सकते हैं। मंडी जाने से पहले तौल और पल्लेदारी के खर्च जरूर स्पष्ट कर लें।`,
      verifiedNotice: `यह जानकारी सरकारी कृषि विपणन स्रोत (${market.source}) से सत्यापित है।`
    };
  }

  if (lang === 'kn') {
    let trendNarrative = "";
    if (trendDir === "increasing") {
      trendNarrative = `ಕಳೆದ ${trend?.period_days || 7} ದಿನಗಳಲ್ಲಿ ಬೆಲೆಯು ${trendPercent}% ಹೆಚ್ಚಾಗಿದೆ (↑). ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಬೇಡಿಕೆ ಉತ್ತಮವಾಗಿದೆ.`;
    } else if (trendDir === "decreasing") {
      trendNarrative = `ಕಳೆದ ${trend?.period_days || 7} ದಿನಗಳಲ್ಲಿ ಬೆಲೆಯು ${Math.abs(trendPercent)}% ಇಳಿಕೆಯಾಗಿದೆ (↓). ಆವಕ ಹೆಚ್ಚಾದ ಕಾರಣ ಬೆಲೆಯಲ್ಲಿ ಕೊಂಚ ಇಳಿಕೆ ಕಂಡುಬಂದಿದೆ.`;
    } else {
      trendNarrative = `ಕಳೆದ ${trend?.period_days || 7} ದಿನಗಳಲ್ಲಿ ಬೆಲೆಗಳು ಸ್ಥಿರವಾಗಿವೆ (→). ಗಮನಾರ್ಹ ಬದಲಾವಣೆ ಇಲ್ಲ.`;
    }

    const valueNote = grossEstimated 
      ? `ನಿಮ್ಮ ${quantityQuintals} ಕ್ವಿಂಟಾಲ್ ಬೆಳೆಗೆ ಮಾದರಿ ಬೆಲೆಯ ಪ್ರಕಾರ ಅಂದಾಜು ಒಟ್ಟು ಮೌಲ್ಯ ₹${grossEstimated.toLocaleString('en-IN')} ಆಗುತ್ತದೆ (ಇದು ಗ್ಯಾರಂಟಿ ಆದಾಯವಲ್ಲ).`
      : "";

    return {
      language: 'kn',
      title: `${marketName} ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ${cropName} ವಿವರಣೆ`,
      summary: `ಇಂದು ${marketName} ಮಂಡಿಯಲ್ಲಿ ${cropName}ಗೆ ಮುಖ್ಯ ಮಾದರಿ ಬೆಲೆ ಕ್ವಿಂಟಾಲ್‌ಗೆ ₹${modalPrice.toLocaleString('en-IN')} ದಾಖಲಾಗಿದೆ (${freshness}).`,
      priceDetails: `ಕನಿಷ್ಠ ಬೆಲೆ ₹${minPrice.toLocaleString('en-IN')} ಹಾಗೂ ಗರಿಷ್ಠ ಬೆಲೆ ₹${maxPrice.toLocaleString('en-IN')} ಇದೆ (ವ್ಯತ್ಯಾಸ ₹${spread}). ಇಂದಿನ ಆವಕ ಸುಮಾರು ${arrivalQty} ಕ್ವಿಂಟಾಲ್ ಆಗಿದೆ.`,
      trendExplanation: trendNarrative,
      estimatedValueNote: valueNote,
      advice: `ನಿಮ್ಮ ಬೆಳೆ ಮಧ್ಯಮದಿಂದ ಉತ್ತಮ ಗುಣಮಟ್ಟದಲ್ಲಿದ್ದರೆ ಮಾದರಿ ಬೆಲೆ (₹${modalPrice}) ಸಿಗುವ ನಿರೀಕ್ಷೆ ಇರುತ್ತದೆ. ಮಂಡಿಗೆ ಹೊರಡುವ ಮುನ್ನ ಸಾಗಾಣಿಕೆ ಮತ್ತು ಕಮಿಷನ್ ಶುಲ್ಕಗಳನ್ನು ಮುಂಚಿತವಾಗಿ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.`,
      verifiedNotice: `ಈ ಮಾಹಿತಿಯು ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಮೂಲದಿಂದ (${market.source}) ಪರಿಶೀಲಿಸಲ್ಪಟ್ಟಿದೆ.`
    };
  }

  if (lang === 'te') {
    let trendNarrative = trendDir === "increasing"
      ? `గత ${trend?.period_days || 7} రోజులలో ధరలు ${trendPercent}% పెరిగాయి (↑). మార్కెట్లో డిమాండ్ బలంగా ఉంది.`
      : trendDir === "decreasing"
      ? `గత ${trend?.period_days || 7} రోజులలో ధరలు ${Math.abs(trendPercent)}% తగ్గాయి (↓). పంట రాక పెరిగింది.`
      : `గత ${trend?.period_days || 7} రోజులలో ధరలు స్థిరంగా ఉన్నాయి (→).`;

    const valueNote = grossEstimated 
      ? `మీ ${quantityQuintals} క్వింటాళ్లకు మోడల్ ధర ప్రకారం అంచనా మొత్తం విలువ ₹${grossEstimated.toLocaleString('en-IN')} అవుతుంది (గ్యారంటీ ఆదాయం కాదు).`
      : "";

    return {
      language: 'te',
      title: `${marketName} లో ${cropName} మార్కెట్ విశ్లేషణ`,
      summary: `ఈరోజు ${marketName} లో ${cropName} మోడల్ ధర క్వింటాల్‌కు ₹${modalPrice.toLocaleString('en-IN')} గా నమోదైంది (${freshness}).`,
      priceDetails: `కనిష్ట ధర ₹${minPrice.toLocaleString('en-IN')}, గరిష్ట ధర ₹${maxPrice.toLocaleString('en-IN')} (వ్యత్యాసం ₹${spread}). నేటి మొత్తం రాక సుమారు ${arrivalQty} క్వింటాళ్లు.`,
      trendExplanation: trendNarrative,
      estimatedValueNote: valueNote,
      advice: `మీ పంట మంచి నాణ్యత కలిగి ఉంటే మోడల్ ధర లేదా అంతకంటే ఎక్కువ ధర లభించే అవకాశం ఉంది. బయలుదేరే ముందు రవాణా మరియు హమాలీ ఖర్చులను లెక్కించండి.`,
      verifiedNotice: `ఈ సమాచారం ప్రభుత్వ అధికారిక మూలం (${market.source}) నుండి ధృవీకరించబడింది.`
    };
  }

  if (lang === 'ta') {
    let trendNarrative = trendDir === "increasing"
      ? `கடந்த ${trend?.period_days || 7} நாட்களில் விலை ${trendPercent}% அதிகரித்துள்ளது (↑). தேவை அதிகமாக உள்ளது.`
      : trendDir === "decreasing"
      ? `கடந்த ${trend?.period_days || 7} நாட்களில் விலை ${Math.abs(trendPercent)}% குறைந்துள்ளது (↓). வரத்து அதிகரித்துள்ளது.`
      : `கடந்த ${trend?.period_days || 7} நாட்களில் விலை சீராக உள்ளது (→).`;

    const valueNote = grossEstimated 
      ? `உங்கள் ${quantityQuintals} குவிண்டாலுக்கு மாதிரி விலையின்படி கணக்கிடப்பட்ட மதிப்பு ₹${grossEstimated.toLocaleString('en-IN')} (உத்தரவாத வருமானம் அல்ல).`
      : "";

    return {
      language: 'ta',
      title: `${marketName} சந்தையில் ${cropName} பகுப்பாய்வு`,
      summary: `இன்று ${marketName} சந்தையில் ${cropName} மாதிரி விலை குவிண்டாலுக்கு ₹${modalPrice.toLocaleString('en-IN')} என பதிவாகியுள்ளது (${freshness}).`,
      priceDetails: `குறைந்தபட்ச விலை ₹${minPrice.toLocaleString('en-IN')}, அதிகபட்ச விலை ₹${maxPrice.toLocaleString('en-IN')} (வித்தியாசம் ₹${spread}). இன்றைய மொத்த வரத்து சுமார் ${arrivalQty} குவிண்டால்.`,
      trendExplanation: trendNarrative,
      estimatedValueNote: valueNote,
      advice: `உங்கள் விளைபொருள் நல்ல தரமாக இருந்தால் மாதிரி விலை அல்லது அதற்கு மேல் கிடைக்க வாய்ப்புள்ளது. கொண்டு செல்வதற்கு முன் வண்டி வாடகை விவரங்களை உறுதி செய்யவும்.`,
      verifiedNotice: `இந்த தகவல் அதிகாரப்பூர்வ அரசு விவசாய தரவுகளிலிருந்து (${market.source}) பெறப்பட்டது.`
    };
  }

  if (lang === 'mr') {
    let trendNarrative = trendDir === "increasing"
      ? `गेल्या ${trend?.period_days || 7} दिवसांत भाव ${trendPercent}% वाढले आहेत (↑). बाजारात मागणी चांगली आहे.`
      : trendDir === "decreasing"
      ? `गेल्या ${trend?.period_days || 7} दिवसांत भाव ${Math.abs(trendPercent)}% घसरले आहेत (↓). आवक जास्त आहे.`
      : `गेल्या ${trend?.period_days || 7} दिवसांत भाव स्थिर राहिले आहेत (→).`;

    const valueNote = grossEstimated 
      ? `तुमच्या ${quantityQuintals} क्विंटलसाठी मॉडेल भावानुसार अंदाजे मूल्य ₹${grossEstimated.toLocaleString('en-IN')} होते (हमी उत्पन्न नाही).`
      : "";

    return {
      language: 'mr',
      title: `${marketName} बाजार समितीत ${cropName} बाजार विश्लेषण`,
      summary: `आज ${marketName} मध्ये ${cropName} चा मुख्य मॉडेल भाव ₹${modalPrice.toLocaleString('en-IN')}/क्विंटल नोंदवला गेला आहे (${freshness}).`,
      priceDetails: `किमान भाव ₹${minPrice.toLocaleString('en-IN')} आणि कमाल भाव ₹${maxPrice.toLocaleString('en-IN')} राहिला (फरक ₹${spread}). आजची एकूण आवक सुमारे ${arrivalQty} क्विंटल झाली.`,
      trendExplanation: trendNarrative,
      estimatedValueNote: valueNote,
      advice: `मालाची प्रतवारी उत्तम असल्यास मॉडेल भावापेक्षा चांगला दर मिळू शकतो. बाजारात जाण्यापूर्वी वाहतूक व हमालीचा खर्च नक्की करा.`,
      verifiedNotice: `ही माहिती अधिकृत कृषी उत्पन्न बाजार समिती स्रोताकडून (${market.source}) सत्यापित आहे.`
    };
  }

  if (lang === 'bn') {
    let trendNarrative = trendDir === "increasing"
      ? `গত ${trend?.period_days || 7} দিনে দর ${trendPercent}% বৃদ্ধি পেয়েছে (↑)। বাজারে চাহিদা ভালো।`
      : trendDir === "decreasing"
      ? `গত ${trend?.period_days || 7} দিনে দর ${Math.abs(trendPercent)}% হ্রাস পেয়েছে (↓)। আমদানি বেশি।`
      : `গত ${trend?.period_days || 7} দিনে দর স্থিতিশীল রয়েছে (→)।`;

    const valueNote = grossEstimated 
      ? `আপনার ${quantityQuintals} কুইন্টালের জন্য আনুমানিক মূল্য ₹${grossEstimated.toLocaleString('en-IN')} (নিশ্চিত আয় নয়)।`
      : "";

    return {
      language: 'bn',
      title: `${marketName} বাজারে ${cropName} এর দর বিশ্লেষণ`,
      summary: `আজ ${marketName} বাজারে ${cropName} এর গড় মডেল দর কুইন্টাল প্রতি ₹${modalPrice.toLocaleString('en-IN')} নথিভুক্ত হয়েছে (${freshness})।`,
      priceDetails: `সর্বনিম্ন দর ₹${minPrice.toLocaleString('en-IN')} এবং সর্বোচ্চ দর ₹${maxPrice.toLocaleString('en-IN')} (পার্থক্য ₹${spread})। আজকের মোট আমদানি প্রায় ${arrivalQty} কুইন্টাল।`,
      trendExplanation: trendNarrative,
      estimatedValueNote: valueNote,
      advice: `ফসল ভালোভাবে বাছাই করা থাকলে মডেল দর বা তার বেশি পাওয়ার সম্ভাবনা থাকে। গাড়ি ভাড়া ও লেবার খরচ আগে ঠিক করে নিন।`,
      verifiedNotice: `এই তথ্য সরকারি কৃষি বাজার রেকর্ড (${market.source}) থেকে সংগৃহীত ও যাচাইকৃত।`
    };
  }

  if (lang === 'gu') {
    let trendNarrative = trendDir === "increasing"
      ? `છેલ્લા ${trend?.period_days || 7} દિવસોમાં ભાવ ${trendPercent}% વધ્યો છે (↑). માંગ મજબૂત છે.`
      : trendDir === "decreasing"
      ? `છેલ્લા ${trend?.period_days || 7} દિવસોમાં ભાવ ${Math.abs(trendPercent)}% ઘટ્યો છે (↓). આવક વધી છે.`
      : `છેલ્લા ${trend?.period_days || 7} દિવસોમાં ભાવ સ્થિર રહ્યો છે (→).`;

    const valueNote = grossEstimated 
      ? `તમારા ${quantityQuintals} ક્વિન્ટલ માટે મોડલ ભાવ મુજબ અંદાજિત રકમ ₹${grossEstimated.toLocaleString('en-IN')} થાય છે (ગેરંટી આવક નથી).`
      : "";

    return {
      language: 'gu',
      title: `${marketName} માર્કેટ યાર્ડમાં ${cropName} ભાવ વિશ્લેષણ`,
      summary: `આજે ${marketName} માં ${cropName} નો સરેરાશ મોડલ ભાવ ₹${modalPrice.toLocaleString('en-IN')}/ક્વિન્ટલ નોંધાયો છે (${freshness}).`,
      priceDetails: `ન્યૂનતમ ભાવ ₹${minPrice.toLocaleString('en-IN')} અને મહત્તમ ભાવ ₹${maxPrice.toLocaleString('en-IN')} રહ્યો (તફાવત ₹${spread}). આજના દિવસની કુલ આવક લગભગ ${arrivalQty} ક્વિન્ટલ રહી.`,
      trendExplanation: trendNarrative,
      estimatedValueNote: valueNote,
      advice: `જો તમારી ઉપજ સારી ગુણવત્તાવાળી હશે તો મોડલ ભાવ અથવા તેનાથી વધુ મળવાની શક્યતા છે. યાર્ડમાં જતા પહેલા વાહન ભાડું નક્કી કરી લો.`,
      verifiedNotice: `આ માહિતી સત્તાવાર સરકારી સ્ત્રોત (${market.source}) પરથી ચકાસાયેલ છે.`
    };
  }

  if (lang === 'pa') {
    let trendNarrative = trendDir === "increasing"
      ? `ਪਿਛਲੇ ${trend?.period_days || 7} ਦਿਨਾਂ ਵਿੱਚ ਭਾਅ ${trendPercent}% ਵਧੇ ਹਨ (↑)। ਮੰਗ ਵਧੀਆ ਹੈ।`
      : trendDir === "decreasing"
      ? `ਪਿਛਲੇ ${trend?.period_days || 7} ਦਿਨਾਂ ਵਿੱਚ ਭਾਅ ${Math.abs(trendPercent)}% ਘਟੇ ਹਨ (↓)। ਆਮਦ ਵਧਣ ਕਾਰਨ ਨਰਮੀ ਹੈ।`
      : `ਪਿਛਲੇ ${trend?.period_days || 7} ਦਿਨਾਂ ਵਿੱਚ ਭਾਅ ਸਥਿਰ ਰਹੇ ਹਨ (→)।`;

    const valueNote = grossEstimated 
      ? `ਤੁਹਾਡੀ ${quantityQuintals} ਕੁਇੰਟਲ ਫਸਲ ਦੀ ਅਨੁਮਾਨਿਤ ਕੁੱਲ ਕੀਮਤ ₹${grossEstimated.toLocaleString('en-IN')} ਬਣਦੀ ਹੈ (ਗਰੰਟੀਸ਼ੁਦਾ ਆਮਦਨ ਨਹੀਂ)।`
      : "";

    return {
      language: 'pa',
      title: `${marketName} ਵਿੱਚ ${cropName} ਮੰਡੀ ਭਾਅ ਵਿਸ਼ਲੇਸ਼ਣ`,
      summary: `ਅੱਜ ${marketName} ਵਿਖੇ ${cropName} ਦਾ ਮੁੱਖ ਮਾਡਲ ਭਾਅ ₹${modalPrice.toLocaleString('en-IN')}/ਕੁਇੰਟਲ ਦਰਜ ਹੋਇਆ ਹੈ (${freshness})।`,
      priceDetails: `ਘੱਟੋ-ਘੱਟ ਭਾਅ ₹${minPrice.toLocaleString('en-IN')} ਅਤੇ ਵੱਧ ਤੋਂ ਵੱਧ ਭਾਅ ₹${maxPrice.toLocaleString('en-IN')} ਰਿਹਾ (ਅੰਤਰ ₹${spread})। ਅੱਜ ਕੁੱਲ ਆਮਦ ਲਗਭਗ ${arrivalQty} ਕੁਇੰਟਲ ਰਹੀ।`,
      trendExplanation: trendNarrative,
      estimatedValueNote: valueNote,
      advice: `ਜੇਕਰ ਤੁਹਾਡੀ ਫਸਲ ਸਾਫ਼ ਤੇ ਸੁੱਕੀ ਹੈ ਤਾਂ ਮਾਡਲ ਭਾਅ ਜਾਂ ਉਸ ਤੋਂ ਉੱਪਰ ਮਿਲਣ ਦੀ ਉਮੀਦ ਹੈ। ਮੰਡੀ ਜਾਣ ਤੋਂ ਪਹਿਲਾਂ ਕਿਰਾਇਆ ਪੱਕਾ ਕਰ ਲਵੋ।`,
      verifiedNotice: `ਇਹ ਜਾਣਕਾਰੀ ਸਰਕਾਰੀ ਖੇਤੀਬਾੜੀ ਮੰਡੀ ਸਰੋਤਾਂ (${market.source}) ਤੋਂ ਤਸਦੀਕ ਕੀਤੀ ਗਈ ਹੈ।`
    };
  }

  if (lang === 'ml') {
    let trendNarrative = trendDir === "increasing"
      ? `കഴിഞ്ഞ ${trend?.period_days || 7} ദിവസങ്ങളിൽ വില ${trendPercent}% കൂടി (↑). മികച്ച ഡിമാൻഡ് ഉണ്ട്.`
      : trendDir === "decreasing"
      ? `കഴിഞ്ഞ ${trend?.period_days || 7} ദിവസങ്ങളിൽ വില ${Math.abs(trendPercent)}% കുറഞ്ഞു (↓). വരവ് കൂടിയതിനാലാണിത്.`
      : `കഴിഞ്ഞ ${trend?.period_days || 7} ദിവസങ്ങളിൽ വില മാറ്റമില്ലാതെ തുടർന്നു (→).`;

    const valueNote = grossEstimated 
      ? `നിങ്ങളുടെ ${quantityQuintals} ക്വിന്റൽ വിളയ്ക്ക് കണക്കാക്കിയ ഏകദേശ മൂല്യം ₹${grossEstimated.toLocaleString('en-IN')} ആണ് (ഉറപ്പായ വരുമാനമല്ല).`
      : "";

    return {
      language: 'ml',
      title: `${marketName} വിപണിയിൽ ${cropName} വിപണി വിശകലനം`,
      summary: `ഇന്ന് ${marketName} വിപണിയിൽ ${cropName} പ്രധാന മോഡൽ വില ക്വിന്റലിന് ₹${modalPrice.toLocaleString('en-IN')} ആയി രേഖപ്പെടുത്തി (${freshness}).`,
      priceDetails: `കുറഞ്ഞ വില ₹${minPrice.toLocaleString('en-IN')}, കൂടിയ വില ₹${maxPrice.toLocaleString('en-IN')} (വ്യത്യാസം ₹${spread}). ഇന്നത്തെ ആകെ വരവ് ഏകദേശം ${arrivalQty} ക്വിന്റൽ ആണ്.`,
      trendExplanation: trendNarrative,
      estimatedValueNote: valueNote,
      advice: `നല്ല ഗുണനിലവാരമുള്ള വിളയാണെങ്കിൽ മോഡൽ നിരക്കോ അതിൽ കൂടുതലോ ലഭിക്കാൻ സാധ്യതയുണ്ട്. വാടകയും കയറ്റിറക്ക് കൂലിയും മുൻകൂട്ടി ഉറപ്പാക്കുക.`,
      verifiedNotice: `ഈ വിവരങ്ങൾ ഔദ്യോഗിക കാർഷിക ഡാറ്റയിൽ (${market.source}) നിന്ന് സ്ഥിരീകരിച്ചതാണ്.`
    };
  }

  // Default: English
  let trendNarrative = "";
  if (trendDir === "increasing") {
    trendNarrative = `Over the past ${trend?.period_days || 7} days, the reported modal price increased by ${trendPercent}% (↑), indicating healthy demand at this mandi.`;
  } else if (trendDir === "decreasing") {
    trendNarrative = `Over the past ${trend?.period_days || 7} days, the reported modal price decreased by ${Math.abs(trendPercent)}% (↓), likely due to increased crop arrivals.`;
  } else {
    trendNarrative = `Over the past ${trend?.period_days || 7} days, the modal price has remained stable (→), fluctuating within a tight 1.5% range.`;
  }

  const valueNote = grossEstimated 
    ? `For your ${quantityQuintals} quintal(s), the estimated gross value at the prevailing modal rate is ₹${grossEstimated.toLocaleString('en-IN')} (strictly an estimate, not guaranteed earnings).`
    : "";

  return {
    language: 'en',
    title: `Market Intelligence for ${cropName} at ${marketName}`,
    summary: `Today at ${marketName}, the prevailing modal price for ${cropName} is reported at ₹${modalPrice.toLocaleString('en-IN')} per quintal (${freshness}).`,
    priceDetails: `Prices ranged from a minimum of ₹${minPrice.toLocaleString('en-IN')} for lower grades to a maximum of ₹${maxPrice.toLocaleString('en-IN')} for premium lots (spread: ₹${spread}). Today's recorded arrival volume is approximately ${arrivalQty} quintals.`,
    trendExplanation: trendNarrative,
    estimatedValueNote: valueNote,
    advice: `Produce with good uniformity and low moisture typically commands the modal price or higher. Confirm transport charges and APMC market deductions before dispatching your load.`,
    verifiedNotice: `Sourced from official agricultural records: ${market.source}.`
  };
}
