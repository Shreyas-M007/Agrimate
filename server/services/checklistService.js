// PRD Section 16: Selling Checklist
// Pre-departure, at the market, and transaction closure steps in EN, HI, KN

export function getSellingChecklist({ crop = "produce", marketName = "the market", quantityQuintals = 0, language = 'en' }) {
  const lang = (language === 'hi' || language === 'kn') ? language : 'en';

  if (lang === 'hi') {
    return {
      title: `${marketName} के लिए फसल बिक्री चेकलिस्ट`,
      language: 'hi',
      steps: [
        {
          id: 1,
          category: "मंडी जाने से पहले",
          title: "आज का दर्ज बाजार भाव जांचें",
          desc: `${marketName} में आज का मोडल भाव सत्यापित कर लें ताकि आपको उचित दर का अंदाजा रहे।`,
          important: true
        },
        {
          id: 2,
          category: "मंडी जाने से पहले",
          title: "पुष्टि करें कि मंडी फसल स्वीकार कर रही है",
          desc: "मंडी की छुट्टी या विशेष बोली दिवस (ट्रेड हॉलिडे) की अग्रिम जानकारी रखें।",
          important: false
        },
        {
          id: 3,
          category: "मंडी जाने से पहले",
          title: "अपेक्षित वजन / मात्रा की पुष्टि करें",
          desc: `आपकी लगभग ${quantityQuintals > 0 ? quantityQuintals + ' क्विंटल' : 'उपज'} लोड करने से पहले बोरियों की गिनती कर लें।`,
          important: false
        },
        {
          id: 4,
          category: "मंडी जाने से पहले",
          title: "परिवहन (किराया) लागत का अनुमान लगाएं",
          desc: "ट्रैक्टर/पिकअप चालक के साथ आने-जाने का भाड़ा पहले ही तय कर लें।",
          important: true
        },
        {
          id: 5,
          category: "मंडी जाने से पहले",
          title: "उपज की गुणवत्ता और छंटाई जांचें",
          desc: `${crop} की सूखी, साफ और अच्छी छंटाई (ग्रेडिंग) से बेहतर भाव मिलता है।`,
          important: true
        },
        {
          id: 6,
          category: "मंडी में प्रवेश",
          title: "आवश्यक दस्तावेज साथ रखें",
          desc: "पहचान पत्र (आधार), बैंक पासबुक/खाता विवरण, और मंडी पर्ची यदि आवश्यक हो।",
          important: false
        },
        {
          id: 7,
          category: "नीलामी व तौल",
          title: "धर्मकांटे या इलेक्ट्रॉनिक तौल की पुष्टि करें",
          desc: "वजन करवाते समय तराजू के कांटे को शून्य पर जांचें और पर्ची तुरंत प्राप्त करें।",
          important: true
        },
        {
          id: 8,
          category: "नीलामी व तौल",
          title: "बोली में मिले भाव की पुष्टि करें",
          desc: "नीलामी समाप्त होने पर व्यापारी या आढ़ती द्वारा बोले गए अंतिम भाव की पुष्टि करें।",
          important: true
        },
        {
          id: 9,
          category: "भुगतान प्रक्रिया",
          title: "लागू शुल्क और कटौतियों के बारे में पूछें",
          desc: "मंडी उपकर, पल्लेदारी (लोडिंग/अनलोडिंग) व आढ़त के वैध शुल्कों का ब्यौरा लें।",
          important: false
        },
        {
          id: 10,
          category: "भुगतान प्रक्रिया",
          title: "अंतिम देय राशि का मिलान करें",
          desc: "कुल वजन × भाव माइनस स्वीकृत शुल्क = आपको मिलने वाली शुद्ध राशि।",
          important: true
        },
        {
          id: 11,
          category: "भुगतान प्रक्रिया",
          title: "भुगतान या लेन-देन की पक्की रसीद प्राप्त करें",
          desc: "नकद रसीद या बैंक खाते में ट्रांसफर (RTGS/NEFT/UPI) का बैंक एसएमएस देखकर ही मंडी छोड़ें।",
          important: true
        }
      ]
    };
  }

  if (lang === 'kn') {
    return {
      title: `${marketName} ಮಂಡಿಯಲ್ಲಿ ಮಾರಾಟ ಪೂರ್ವ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ`,
      language: 'kn',
      steps: [
        {
          id: 1,
          category: "ಹೊರಡುವ ಮುನ್ನ",
          title: "ಇಂದಿನ ಅಧಿಕೃತ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಪರಿಶೀಲಿಸಿ",
          desc: `${marketName} ಮಂಡಿಯಲ್ಲಿ ಇಂದಿನ ಮಾದರಿ ಬೆಲೆ ಖಚಿತಪಡಿಸಿಕೊಂಡು ಹೊರಡಿ.`,
          important: true
        },
        {
          id: 2,
          category: "ಹೊರಡುವ ಮುನ್ನ",
          title: "ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಬೆಳೆ ಸ್ವೀಕರಿಸಲಾಗುತ್ತಿದೆಯೇ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ",
          desc: "ಮಂಡಿಗೆ ರಜೆ ಅಥವಾ ಸಾರ್ವತ್ರಿಕ ಮುಷ್ಕರ ಇಲ್ಲದಿರುವುದನ್ನು ದೃಢಪಡಿಸಿಕೊಳ್ಳಿ.",
          important: false
        },
        {
          id: 3,
          category: "ಹೊರಡುವ ಮುನ್ನ",
          title: "ತರುವ ಒಟ್ಟು ಚೀಲಗಳು/ಪ್ರಮಾಣವನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ",
          desc: `ನಿಮ್ಮ ${quantityQuintals > 0 ? quantityQuintals + ' ಕ್ವಿಂಟಾಲ್' : 'ಬೆಳೆಯ'} ಚೀಲಗಳ ಸಂಖ್ಯೆಯನ್ನು ನಿಖರವಾಗಿ ಲೆಕ್ಕಹಾಕಿ.`,
          important: false
        },
        {
          id: 4,
          category: "ಹೊರಡುವ ಮುನ್ನ",
          title: "ಸಾರಿಗೆ ವೆಚ್ಚದ ಅಂದಾಜು ಮಾಡಿ",
          desc: "ವಾಹನದ ಬಾಡಿಗೆಯನ್ನು ಮುಂಚಿತವಾಗಿಯೇ ಮಾತನಾಡಿ ನಿಗದಿಪಡಿಸಿಕೊಳ್ಳಿ.",
          important: true
        },
        {
          id: 5,
          category: "ಹೊರಡುವ ಮುನ್ನ",
          title: "ಗುಣಮಟ್ಟ ಮತ್ತು ಗ್ರೇಡಿಂಗ್ ಪರಿಶೀಲಿಸಿ",
          desc: `${crop} ಬೆಳೆಯನ್ನು ಚೆನ್ನಾಗಿ ವಿಂಗಡಿಸಿ, ಒಣಗಿಸಿ ತಂದರೆ ಉತ್ತಮ ಬೆಲೆ ದೊರೆಯುತ್ತದೆ.`,
          important: true
        },
        {
          id: 6,
          category: "ಮಂಡಿ ಪ್ರವೇಶ",
          title: "ಅಗತ್ಯ ದಾಖಲೆಗಳನ್ನು ಜೊತೆಯಲ್ಲಿಡಿ",
          desc: "ಆಧಾರ್ ಕಾರ್ಡ್, ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್ ಮತ್ತು ಅಗತ್ಯವಿದ್ದಲ್ಲಿ ಕೃಷಿ ಗುರುತಿನ ಚೀಟಿ.",
          important: false
        },
        {
          id: 7,
          category: "ಹರಾಜು & ತೂಕ",
          title: "ಎಲೆಕ್ಟ್ರಾನಿಕ್ ತೂಕವನ್ನು ಕಣ್ಣಾರೆ ಪರಿಶೀಲಿಸಿ",
          desc: "ತೂಕ ಹಾಕುವಾಗ ಸೊನ್ನೆ (Zero) ತೋರಿಸುವುದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಂಡು ತೂಕದ ಚೀಟಿ ಪಡೆಯಿರಿ.",
          important: true
        },
        {
          id: 8,
          category: "ಹರಾಜು & ತೂಕ",
          title: "ಹರಾಜಿನಲ್ಲಿ ಅಂತಿಮಗೊಂಡ ಬೆಲೆಯನ್ನು ಖಚಿತಪಡಿಸಿ",
          desc: "ಖರೀದಿದಾರರು ಕೂಗಿದ ಅಂತಿಮ ದರವನ್ನು ಸರಿಯಾಗಿ ಕೇಳಿ ಒಪ್ಪಿಗೆ ನೀಡಿ.",
          important: true
        },
        {
          id: 9,
          category: "ಹಣ ಪಾವತಿ",
          title: "ಅನ್ವಯವಾಗುವ ಶುಲ್ಕಗಳ ವಿವರ ಕೇಳಿ",
          desc: "ಹಮಾಲಿ, ಲೋಡಿಂಗ್ ಹಾಗೂ ನಿಯಮಾನುಸಾರ ಕಟಾವಣೆ ಶುಲ್ಕಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
          important: false
        },
        {
          id: 10,
          category: "ಹಣ ಪಾವತಿ",
          title: "ಅಂತಿಮವಾಗಿ ಸಿಗುವ ಒಟ್ಟು ಹಣವನ್ನು ಲೆಕ್ಕಹಾಕಿ",
          desc: "ಒಟ್ಟು ತೂಕ × ನಿಗದಿತ ಬೆಲೆ - ಕಡಿತ ಶುಲ್ಕಗಳು = ಕೈಗೆ ಸಿಗುವ ನಿವ್ವಳ ಹಣ.",
          important: true
        },
        {
          id: 11,
          category: "ಹಣ ಪಾವತಿ",
          title: "ಹಣ ಸಂದಾಯದ ರಸೀದಿ ಅಥವಾ ಬ್ಯಾಂಕ್ ದೃಢೀಕರಣ ಪಡೆಯಿರಿ",
          desc: "ನಗದು ರಸೀದಿ ಅಥವಾ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆಯಾದ ಸಂದೇಶ (SMS) ನೋಡಿದ ನಂತರವೇ ಮಂಡಿ ಬಿಡಿ.",
          important: true
        }
      ]
    };
  }

  // Default: English
  return {
    title: `Mandi Selling Checklist for ${marketName}`,
    language: 'en',
    steps: [
      {
        id: 1,
        category: "Before Leaving Farm",
        title: "Check today's reported market price",
        desc: `Verify prevailing modal prices at ${marketName} so you enter auctions with full price awareness.`,
        important: true
      },
      {
        id: 2,
        category: "Before Leaving Farm",
        title: "Confirm that the market is accepting the crop",
        desc: "Ensure the APMC yard is operating normally and not observing a local market holiday.",
        important: false
      },
      {
        id: 3,
        category: "Before Leaving Farm",
        title: "Confirm expected quantity",
        desc: `Count your loaded bags and verify estimated volume (${quantityQuintals > 0 ? quantityQuintals + ' quintals' : 'produce'}).`,
        important: false
      },
      {
        id: 4,
        category: "Before Leaving Farm",
        title: "Estimate transportation cost",
        desc: "Negotiate vehicle freight and loading charges upfront to protect your net profit margin.",
        important: true
      },
      {
        id: 5,
        category: "Before Leaving Farm",
        title: "Check produce quality & grade requirements",
        desc: `Clean, grade, and discard spoiled ${crop} at the farm to secure modal or maximum rates.`,
        important: true
      },
      {
        id: 6,
        category: "At Mandi Gate",
        title: "Carry required documents if applicable",
        desc: "Carry Aadhaar ID, bank account details for direct transfer, and gate pass.",
        important: false
      },
      {
        id: 7,
        category: "Weighing & Auction",
        title: "Confirm weighing on certified electronic scales",
        desc: "Observe the electronic scale tare weight and collect your official weighbridge slip.",
        important: true
      },
      {
        id: 8,
        category: "Weighing & Auction",
        title: "Confirm quoted auction price",
        desc: "Confirm the winning bidder's agreed rate per quintal before signing over the lot.",
        important: true
      },
      {
        id: 9,
        category: "Settlement",
        title: "Ask about applicable market charges",
        desc: "Clarify statutory APMC cess, unloading fees (hamali), and weighing charges.",
        important: false
      },
      {
        id: 10,
        category: "Settlement",
        title: "Confirm final payable amount",
        desc: "Calculate: Total net weight × agreed rate - authorized deductions = final amount.",
        important: true
      },
      {
        id: 11,
        category: "Settlement",
        title: "Obtain payment or transaction confirmation",
        desc: "Demand official payment voucher, cash settlement, or verify bank SMS for RTGS/UPI transfer before leaving.",
        important: true
      }
    ]
  };
}
