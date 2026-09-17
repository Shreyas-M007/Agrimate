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
  "tomato": { hi: "टमाटर", kn: "ಟೊಮೆಟೊ" },
  "onion": { hi: "प्याज", kn: "ಈರುಳ್ಳಿ" },
  "potato": { hi: "आलू", kn: "ಆಲೂಗಡ್ಡೆ" },
  "groundnut": { hi: "मूंगफली", kn: "ಕಡಲೆಕಾಯಿ" },
  "maize": { hi: "मक्का", kn: "ಮೆಕ್ಕೆಜೋಳ" },
  "paddy": { hi: "धान", kn: "ಭತ್ತ" },
  "wheat": { hi: "गेहूं", kn: "ಗೋಧಿ" },
  "cotton": { hi: "कपास", kn: "ಹತ್ತಿ" },
  "chilli": { hi: "मिर्च", kn: "ಮೆಣಸಿನಕಾಯಿ" }
};

// Bedrock-style narrative explanation generator based strictly on retrieved verified facts
export function generateMarketExplanation({ market, trend, language = 'en', quantityQuintals = 0 }) {
  const lang = (language === 'hi' || language === 'kn') ? language : 'en';

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
