// PRD Section 16: Selling Checklist
// Pre-departure, at the market, and transaction closure steps in EN, HI, KN

export function getSellingChecklist({ crop = "produce", marketName = "the market", quantityQuintals = 0, language = 'en' }) {
  if (language === 'te') {
    return {
      title: `${marketName} మార్కెట్ విక్రయాల తనిఖీ జాబితా`,
      language: 'te',
      steps: [
        { id: 1, category: "బయలుదేరే ముందు", title: "నేటి ధృవీకరించబడిన మార్కెట్ మోడల్ ధరను తనిఖీ చేయండి", desc: `${marketName} లో నేటి మోడల్ ధరను నిర్ధారించుకోండి.`, important: true },
        { id: 2, category: "బయలుదేరే ముందు", title: "మార్కెట్ ఈరోజు మీ పంటను స్వీకరిస్తోందో లేదో నిర్ధారించుకోండి", desc: "మార్కెట్ సెలవు లేదా ట్రేడ్ హాలిడే లేదని నిర్ధారించుకోండి.", important: false },
        { id: 3, category: "బయలుదేరే ముందు", title: "రవాణాకు ముందు మీ పంట పరిమాణాన్ని నిర్ధారించుకోండి", desc: `మీ ${quantityQuintals > 0 ? quantityQuintals + ' క్వింటాళ్లు' : 'పంట'} బస్తాల సంఖ్యను లెక్కించండి.`, important: false },
        { id: 4, category: "బయలుదేరే ముందు", title: "రవాణా మరియు లోడింగ్ ఖర్చులను అంచనా వేయండి", desc: "ముందే వాహన కిరాయి మరియు హమాలీ ఖర్చులను మాట్లాడండి.", important: true },
        { id: 5, category: "బయలుదేరే ముందు", title: "పంట నాణ్యత మరియు గ్రేడ్ అవసరాలను తనిఖీ చేయండి", desc: `${crop} పంటను శుభ్రపరచి, గ్రేడింగ్ చేస్తే మంచి ధర లభిస్తుంది.`, important: true },
        { id: 6, category: "మండి ప్రవేశం", title: "అవసరమైన గుర్తింపు కార్డులు (ఆధార్ / రైతు కార్డు) క్యారీ చేయండి", desc: "ఆధార్ కార్డు, బ్యాంక్ పాస్ బుక్ వెంట ఉంచుకోండి.", important: false },
        { id: 7, category: "వేలం & తూకం", title: "మార్కెట్‌లో తూకం యంత్రం ఖచ్చితత్వాన్ని తనిఖీ చేయండి", desc: "ఎలక్ట్రానిక్ కాంటా సున్నా వద్ద ప్రారంభమయ్యేలా చూసి తూకం రసీదు తీసుకోండి.", important: true },
        { id: 8, category: "వేలం & తూకం", title: "వ్యాపారి చెప్పిన ధరను అన్‌లోడ్ చేయడానికి ముందు నిర్ధారించుకోండి", desc: "వేలంలో నిర్ణయించిన తుది ధరను నిర్ధారించుకోండి.", important: true },
        { id: 9, category: "చెల్లింపు ప్రక్రియ", title: "వర్తించే మార్కెట్ ఛార్జీలు లేదా కమిషన్ల గురించి అడగండి", desc: "చట్టబద్ధమైన మండి సెస్ మరియు హమాలీ వివరాలు తెలుసుకోండి.", important: false },
        { id: 10, category: "చెల్లింపు ప్రక్రియ", title: "చివరి చెల్లింపు మొత్తాన్ని నిర్ధారించుకోండి", desc: "మొత్తం బరువు × ధర మైనస్ చట్టబద్ధమైన మినహాయింపులు = మీ నికర ఆదాయం.", important: true },
        { id: 11, category: "చెల్లింపు ప్రక్రియ", title: "అధికారిక రసీదు లేదా బ్యాంక్ నిర్ధారణ పొందండి", desc: "బ్యాంకు ఖాతాకు జమ అయిన మెసేజ్ చూసిన తర్వాతే మండి నుండి బయలుదేరండి.", important: true }
      ]
    };
  }

  if (language === 'ta') {
    return {
      title: `${marketName} சந்தை விற்பனை சரிபார்ப்பு பட்டியல்`,
      language: 'ta',
      steps: [
        { id: 1, category: "கிளம்புவதற்கு முன்", title: "இன்றைய சரிபார்க்கப்பட்ட சந்தை மாதிரி விலையை சரிபார்க்கவும்", desc: `${marketName} சந்தையின் மாதிரி விலையை முன்கூட்டியே தெரிந்து கொள்ளுங்கள்.`, important: true },
        { id: 2, category: "கிளம்புவதற்கு முன்", title: "சந்தை இன்று உங்கள் பயிரை ஏற்கிறதா என்பதை உறுதிப்படுத்தவும்", desc: "சந்தை விடுமுறை இல்லை என்பதை முன்கூட்டியே உறுதி செய்து கொள்ளுங்கள்.", important: false },
        { id: 3, category: "கிளம்புவதற்கு முன்", title: "போக்குவரத்துக்கு முன் உங்கள் பயிர் அளவை உறுதிப்படுத்தவும்", desc: `சுமார் ${quantityQuintals > 0 ? quantityQuintals + ' குவிண்டால்' : 'பயிர்'} மூட்டைகளை எண்ணி சரிபார்க்கவும்.`, important: false },
        { id: 4, category: "கிளம்புவதற்கு முன்", title: "போக்குவரத்து மற்றும் ஏற்றுதல்/இறக்குதல் செலவுகளை மதிப்பிடவும்", desc: "வாகன வாடகையையும் கூலியையும் முன்கூட்டியே பேசி முடிவு செய்யுங்கள்.", important: true },
        { id: 5, category: "கிளம்புவதற்கு முன்", title: "பயிர் தரம் மற்றும் தரத் தேவைகளை சரிபார்க்கவும்", desc: `${crop} பயிரை சுத்தம் செய்து தரம் பிரித்து விற்றால் நல்ல விலை கிடைக்கும்.`, important: true },
        { id: 6, category: "மண்டி நுழைவு", title: "தேவையான அடையாள ஆவணங்களை வைத்திருக்கவும்", desc: "ஆதார் அட்டை, வங்கி கணக்கு புத்தகம் உடன் வைத்திருக்கவும்.", important: false },
        { id: 7, category: "ஏலம் & எடை", title: "சந்தையில் எடை எந்திரத்தின் துல்லியத்தை சரிபார்க்கவும்", desc: "எடை போடும்போது பூஜ்ஜியம் இருப்பதை உறுதிசெய்து எடையிடல் சீட்டு பெறவும்.", important: true },
        { id: 8, category: "ஏலம் & எடை", title: "சரக்கை இறக்குவதற்கு முன் வியாபாரியின் விலையை உறுதிப்படுத்தவும்", desc: "ஏலத்தில் இறுதி செய்யப்பட்ட விலையை சரியாகக் கேட்டு ஒப்புக்கொள்ளுங்கள்.", important: true },
        { id: 9, category: "பணம் செலுத்துதல்", title: "சந்தை கட்டணங்கள் அல்லது கமிஷன்கள் பற்றி கேட்கவும்", desc: "முறையான சந்தை கட்டணங்கள் மற்றும் சுமை கூலியை சரிபார்க்கவும்.", important: false },
        { id: 10, category: "பணம் செலுத்துதல்", title: "இறுதி தொகையை உறுதி செய்யவும்", desc: "மொத்த எடை × விலை கழித்தல் அனுமதிக்கப்பட்ட பிடித்தம் = உங்கள் கையில் கிடைக்கும் நிகர தொகை.", important: true },
        { id: 11, category: "பணம் செலுத்துதல்", title: "அதிகாரப்பூர்வ ரசீதைப் பெறவும்", desc: "ரொக்க ரசீது அல்லது வங்கி பரிவர்த்தனை செய்தி பார்த்த பிறகே சந்தையை விட்டு செல்லவும்.", important: true }
      ]
    };
  }

  if (language === 'mr') {
    return {
      title: `${marketName} बाजार समिती शेतकरी विक्री चेकलिस्ट`,
      language: 'mr',
      steps: [
        { id: 1, category: "निघण्यापूर्वी", title: "आजचा सत्यापित बाजार मॉडेल भाव तपासा", desc: `${marketName} मधील आजचा मुख्य मॉडेल भाव आधीच जाणून घ्या.`, important: true },
        { id: 2, category: "निघण्यापूर्वी", title: "बाजार समिती आज तुमचे पीक स्वीकारत असल्याची खात्री करा", desc: "बाजार बंद किंवा लिलाव सुट्टी नाही याची खात्री करून घ्या.", important: false },
        { id: 3, category: "निघण्यापूर्वी", title: "वाहतुकीपूर्वी मालाचे प्रमाण निश्चित करा", desc: `अंदाजे ${quantityQuintals > 0 ? quantityQuintals + ' क्विंटल' : 'मालाची'} पोती मोजून लोड करा.`, important: false },
        { id: 4, category: "निघण्यापूर्वी", title: "वाहतूक व हमाली खर्चाचा अंदाज घ्या", desc: "गाडी भाडे व मजुरी आधीच ठरवून घ्या.", important: true },
        { id: 5, category: "निघण्यापूर्वी", title: "मालाची गुणवत्ता व प्रतवारी तपासा", desc: `${crop} ची चांगली प्रतवारी (ग्रेडिंग) केल्यास चांगला भाव मिळतो.`, important: true },
        { id: 6, category: "बाजार प्रवेश", title: "आवश्यक ओळखपत्रे सोबत ठेवा", desc: "आधार कार्ड, बँक पासबुक सोबत ठेवा.", important: false },
        { id: 7, category: "लिलाव व वजन", title: "बाजारात वजनाचा काटा अचूक असल्याची खात्री करा", desc: "इलेक्ट्रॉनिक काटा शून्य तपासून अधिकृत वजन पावती घ्या.", important: true },
        { id: 8, category: "लिलाव व वजन", title: "माल उतरवण्यापूर्वी व्यापाऱ्याने दिलेला भाव निश्चित करा", desc: "लिलावातील अंतिम भाव पक्का करूनच संमती द्या.", important: true },
        { id: 9, category: "पेमेंट प्रक्रिया", title: "लागू बाजार शुल्क किंवा अडतीबाबत विचारणा करा", desc: "अधिकृत बाजार शुल्क व हमाली व्यतिरिक्त कोणतीही कपात होऊ देऊ नका.", important: false },
        { id: 10, category: "पेमेंट प्रक्रिया", title: "अंतिम देय रक्कम तपासा", desc: "एकूण वजन × भाव वजा अधिकृत कपात = हातात मिळणारी निव्वळ रक्कम.", important: true },
        { id: 11, category: "पेमेंट प्रक्रिया", title: "अधिकृत पावती व बँकेत पैसे आल्याची खात्री करा", desc: "बँक खात्यात पैसे जमा झाल्याचा मेसेज पाहिल्याशिवाय बाजार सोडू नका.", important: true }
      ]
    };
  }

  if (language === 'bn') {
    return {
      title: `${marketName} বিক্রয় চেকলিস্ট`,
      language: 'bn',
      steps: [
        { id: 1, category: "রওনা হওয়ার আগে", title: "আজকের যাচাইকৃত বাজার মডেল মূল্য পরীক্ষা করুন", desc: `${marketName} এর আজকের মডেল দর জেনে নিন।`, important: true },
        { id: 2, category: "রওনা হওয়ার আগে", title: "আজ বাজারে আপনার ফসল নেওয়া হচ্ছে কিনা তা নিশ্চিত করুন", desc: "বাজারের ছুটির দিন বা ধর্মঘট নেই তা নিশ্চিত করুন।", important: false },
        { id: 3, category: "রওনা হওয়ার আগে", title: "পরিবহনের আগে আপনার মোট পরিমাণ নিশ্চিত করুন", desc: `আপনার আনুমানিক ${quantityQuintals > 0 ? quantityQuintals + ' কুইন্টাল' : 'ফসলের'} বস্তা গুনে নিন।`, important: false },
        { id: 4, category: "রওনা হওয়ার আগে", title: "পরিবহন ও লোডিং খরচের হিসাব করুন", desc: "গাড়ির ভাড়া আগে থেকেই ঠিক করে নিন।", important: true },
        { id: 5, category: "রওনা হওয়ার আগে", title: "ফসলের মান ও গ্রেড পরীক্ষা করুন", desc: `${crop} ভালো করে বাছাই ও শুকিয়ে নিলে ভালো দাম পাওয়া যায়।`, important: true },
        { id: 6, category: "মন্ডি প্রবেশ", title: "প্রয়োজনীয় পরিচয়পত্র সাথে রাখুন", desc: "আধার কার্ড ও ব্যাংক পাসবুক সাথে রাখুন।", important: false },
        { id: 7, category: "নিলাম ও ওজন", title: "বাজারে ওজনের স্কেলের সঠিকতা যাচাই করুন", desc: "ডিজিটাল কাঁটায় ওজন শূন্য দেখে মাপান এবং ওজন স্লিপ নিন।", important: true },
        { id: 8, category: "নিলাম ও ওজন", title: "মাল আনলোড করার আগে ব্যবসায়ীর দর নিশ্চিত করুন", desc: "নিলামের চূড়ান্ত দর শুনে সম্মতি দিন।", important: true },
        { id: 9, category: "পেমেন্ট প্রক্রিয়া", title: "বাজারের ফি বা কমিশন সম্পর্কে জেনে নিন", desc: "বৈধ বাজার সেস এবং লোডিং চার্জের হিসাব নিন।", important: false },
        { id: 10, category: "পেমেন্ট প্রক্রিয়া", title: "চূড়ান্ত মূল্য নিশ্চিত করুন", desc: "মোট ওজন × দর বিয়োগ বৈধ ফি = আপনার প্রাপ্য মোট টাকা।", important: true },
        { id: 11, category: "পেমেন্ট প্রক্রিয়া", title: "অফিশিয়াল রশিদ বা ব্যাংক পেমেন্ট নিশ্চিত করুন", desc: "টাকা ব্যাংক একাউন্টে জমা হওয়ার এসএমএস দেখে বাজার ত্যাগ করুন।", important: true }
      ]
    };
  }

  if (language === 'gu') {
    return {
      title: `${marketName} ખેડૂત વેચાણ ચેકલિસ્ટ`,
      language: 'gu',
      steps: [
        { id: 1, category: "નીકળતા પહેલા", title: "આજના ચકાસાયેલ મોડલ ભાવ તપાસો", desc: `${marketName} માં આજના સત્તાવાર ભાવ જાણીને જ નીકળો.`, important: true },
        { id: 2, category: "નીકળતા પહેલા", title: "યાર્ડમાં આજે તમારો પાક સ્વીકારવામાં આવે છે તેની ખાતરી કરો", desc: "માર્કેટ યાર્ડની રજા નથી તેની ખાતરી કરો.", important: false },
        { id: 3, category: "નીકળતા પહેલા", title: "પરિવહન પહેલા તમારા પાકના જથ્થાની ખાતરી કરો", desc: `તમારા આશરે ${quantityQuintals > 0 ? quantityQuintals + ' ક્વિન્ટલ' : 'પાકના'} બોરીઓની ગણતરી કરો.`, important: false },
        { id: 4, category: "નીકળતા પહેલા", title: "વાહન ભાડું અને મજૂરી ખર્ચનો અંદાજ મેળવો", desc: "વાહન ભાડું અને હમાલી અગાઉથી નક્કી કરો.", important: true },
        { id: 5, category: "નીકળતા પહેલા", title: "ગુણવત્તા અને ગ્રેડના ધોરણો તપાસો", desc: `${crop} નું સારું ગ્રેડિંગ કરવાથી ઊંચા ભાવ મળે છે.`, important: true },
        { id: 6, category: "યાર્ડમાં પ્રવેશ", title: "જરૂરી ઓળખપત્રો સાથે રાખો", desc: "આધાર કાર્ડ અને બેંક પાસબુક સાથે રાખો.", important: false },
        { id: 7, category: "હરાજી અને વજન", title: "યાર્ડમાં કાંટાના વજનની ચોકસાઈ ચકાસો", desc: "ઈલેક્ટ્રોનિક વજન કાંટો શૂન્ય જોઈને વજનની પહોંચ મેળવો.", important: true },
        { id: 8, category: "હરાજી અને વજન", title: "માલ ઉતારતા પહેલા વેપારીનો ભાવ નક્કી કરો", desc: "હરાજીમાં બોલાયેલો આખરી ભાવ મંજૂર કરો.", important: true },
        { id: 9, category: "ચુકવણી પ્રક્રિયા", title: "યાર્ડના ચાર્જ અથવા કમિશન વિશે પૂછપરછ કરો", desc: "કાયદેસર સેસ અને મજૂરી સિવાય કોઈ કપાત ન થવા દો.", important: false },
        { id: 10, category: "ચુકવણી પ્રક્રિયા", title: "અંતિમ રકમ નક્કી કરો", desc: "કુલ વજન × ભાવ બાદ માન્ય કપાત = તમારા હાથમાં આવતી ચોખ્ખી રકમ.", important: true },
        { id: 11, category: "ચુકવણી પ્રક્રિયા", title: "સત્તાવાર પહોંચ મેળવો", desc: "બેંક ખાતામાં નાણાં જમા થયાનો SMS જોઈને જ યાર્ડમાંથી વિદાય લો.", important: true }
      ]
    };
  }

  if (language === 'pa') {
    return {
      title: `${marketName} ਕਿਸਾਨ ਵਿਕਰੀ ਚੈੱਕਲਿਸਟ`,
      language: 'pa',
      steps: [
        { id: 1, category: "ਰਵਾਨਾ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ", title: "ਅੱਜ ਦਾ ਤਸਦੀਕਸ਼ੁਦਾ ਮੰਡੀ ਮਾਡਲ ਭਾਅ ਚੈੱਕ ਕਰੋ", desc: `${marketName} ਵਿੱਚ ਅੱਜ ਦਾ ਅਧਿਕਾਰਤ ਭਾਅ ਜਾਣ ਕੇ ਚੱਲੋ।`, important: true },
        { id: 2, category: "ਰਵਾਨਾ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ", title: "ਪੁਸ਼ਟੀ ਕਰੋ ਕਿ ਮੰਡੀ ਅੱਜ ਤੁਹਾਡੀ ਫਸਲ ਲੈ ਰਹੀ ਹੈ", desc: "ਮੰਡੀ ਵਿੱਚ ਛੁੱਟੀ ਜਾਂ ਹੜਤਾਲ ਨਾ ਹੋਣ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ।", important: false },
        { id: 3, category: "ਰਵਾਨਾ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ", title: "ਗੱਡੀ ਲੱਦਣ ਤੋਂ ਪਹਿਲਾਂ ਮਾਤਰਾ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ", desc: `ਆਪਣੀ ਲਗਭਗ ${quantityQuintals > 0 ? quantityQuintals + ' ਕੁਇੰਟਲ' : 'ਫਸਲ'} ਦੀਆਂ ਬੋਰੀਆਂ ਗਿਣੋ।`, important: false },
        { id: 4, category: "ਰਵਾਨਾ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ", title: "ਕਿਰਾਏ ਅਤੇ ਮਜ਼ਦੂਰੀ ਦੇ ਖਰਚੇ ਦਾ ਅੰਦਾਜ਼ਾ ਲਗਾਓ", desc: "ਟਰੈਕਟਰ-ਟਰਾਲੀ ਦਾ ਕਿਰਾਇਆ ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ।", important: true },
        { id: 5, category: "ਰਵਾਨਾ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ", title: "ਫਸਲ ਦੀ ਕੁਆਲਿਟੀ ਅਤੇ ਗ੍ਰੇਡ ਚੈੱਕ ਕਰੋ", desc: `${crop} ਨੂੰ ਚੰਗੀ ਤਰ੍ਹਾਂ ਸਾਫ਼ ਤੇ ਸੁਕਾ ਕੇ ਵੇਚਣ 'ਤੇ ਵਧੀਆ ਭਾਅ ਮਿਲਦਾ ਹੈ।`, important: true },
        { id: 6, category: "ਮੰਡੀ ਦਾਖਲਾ", title: "ਜ਼ਰੂਰੀ ਦਸਤਾਵੇਜ਼ ਨਾਲ ਰੱਖੋ", desc: "ਆਧਾਰ ਕਾਰਡ ਅਤੇ ਬੈਂਕ ਪਾਸਬੁੱਕ ਨਾਲ ਰੱਖੋ।", important: false },
        { id: 7, category: "ਬੋਲੀ ਅਤੇ ਤੋਲ", title: "ਮੰਡੀ ਵਿੱਚ ਕੰਡੇ (ਤੋਲ) ਦੀ ਪਰਖ ਕਰੋ", desc: "ਇਲੈਕਟ੍ਰਾਨਿਕ ਕੰਡੇ ਨੂੰ ਜ਼ੀਰੋ ਦੇਖ ਕੇ ਤੋਲ ਪਰਚੀ ਹਾਸਲ ਕਰੋ।", important: true },
        { id: 8, category: "ਬੋਲੀ ਅਤੇ ਤੋਲ", title: "ਫਸਲ ਲਾਹੁਣ ਤੋਂ ਪਹਿਲਾਂ ਵਪਾਰੀ ਦਾ ਭਾਅ ਪੱਕਾ ਕਰੋ", desc: "ਬੋਲੀ ਦਾ ਆਖਰੀ ਭਾਅ ਸੁਣ ਕੇ ਹੀ ਮਨਜ਼ੂਰੀ ਦਿਓ।", important: true },
        { id: 9, category: "ਭੁਗਤਾਨ ਪ੍ਰਕਿਰਿਆ", title: "ਮੰਡੀ ਦੇ ਖਰਚੇ ਜਾਂ ਕਮਿਸ਼ਨ ਬਾਰੇ ਪੁੱਛੋ", desc: "ਸਰਕਾਰੀ ਮਾਰਕੀਟ ਫੀਸ ਅਤੇ ਪੱਲੇਦਾਰੀ ਦੇ ਖਰਚੇ ਚੈੱਕ ਕਰੋ।", important: false },
        { id: 10, category: "ਭੁਗਤਾਨ ਪ੍ਰਕਿਰਿਆ", title: "ਆਖਰੀ ਰਕਮ ਤਸਦੀਕ ਕਰੋ", desc: "ਕੁੱਲ ਵਜ਼ਨ × ਭਾਅ ਘਟਾਓ ਜਾਇਜ਼ ਖਰਚੇ = ਤੁਹਾਡੇ ਹੱਥ ਆਉਣ ਵਾਲੀ ਕੁੱਲ ਕਮਾਈ।", important: true },
        { id: 11, category: "ਭੁਗਤਾਨ ਪ੍ਰਕਿਰਿਆ", title: "ਸਰਕਾਰੀ ਰਸੀਦ ਜਾਂ ਬੈਂਕ ਪੁਸ਼ਟੀ ਲਵੋ", desc: "ਖਾਤੇ ਵਿੱਚ ਪੈਸੇ ਆਉਣ ਦਾ SMS ਦੇਖ ਕੇ ਹੀ ਮੰਡੀ ਛੱਡੋ।", important: true }
      ]
    };
  }

  if (language === 'ml') {
    return {
      title: `${marketName} കർഷക വിൽപ്പന ചെക്ക് ലിസ്റ്റ്`,
      language: 'ml',
      steps: [
        { id: 1, category: "പുറപ്പെടുന്നതിന് മുൻപ്", title: "ഇന്നത്തെ സ്ഥിരീകരിച്ച മോഡൽ വില പരിശോധിക്കുക", desc: `${marketName} വിപണിയിലെ ഇന്നത്തെ മോഡൽ നിരക്ക് ഉറപ്പാക്കുക.`, important: true },
        { id: 2, category: "പുറപ്പെടുന്നതിന് മുൻപ്", title: "വിപണിയിൽ ഇന്ന് നിങ്ങളുടെ വിള സ്വീകരിക്കുന്നുണ്ടോ എന്ന് ഉറപ്പാക്കുക", desc: "വിപണി അവധി ഇല്ലെന്ന് ഉറപ്പാക്കുക.", important: false },
        { id: 3, category: "പുറപ്പെടുന്നതിന് മുൻപ്", title: "കൊണ്ടുപോകുന്നതിന് മുൻപ് അളവ് ഉറപ്പാക്കുക", desc: `നിങ്ങളുടെ ഏകദേശം ${quantityQuintals > 0 ? quantityQuintals + ' ക്വിന്റൽ' : 'വിള'} ചാക്കുകൾ എണ്ണി തിട്ടപ്പെടുത്തുക.`, important: false },
        { id: 4, category: "പുറപ്പെടുന്നതിന് മുൻപ്", title: "ഗതാഗത ചെലവുകൾ കണക്കാക്കുക", desc: "വാഹന വാടകയും ചുമട്ട് കൂലിയും മുൻകൂട്ടി നിശ്ചയിക്കുക.", important: true },
        { id: 5, category: "പുറപ്പെടുന്നതിന് മുൻപ്", title: "വിളയുടെ ഗുണനിലവാരം പരിശോധിക്കുക", desc: `${crop} വൃത്തിയാക്കി ഗ്രേഡ് ചെയ്ത് വിറ്റാൽ ഉയർന്ന വില ലഭിക്കും.`, important: true },
        { id: 6, category: "വിപണി പ്രവേശനം", title: "ആവശ്യമായ രേഖകൾ കരുതുക", desc: "ആധാർ കാർഡ്, ബാങ്ക് പാസ്ബുക്ക് എന്നിവ കൂടെ കരുതുക.", important: false },
        { id: 7, category: "ലേലവും തൂക്കവും", title: "വിപണിയിലെ അളവുതൂക്ക കൃത്യത ഉറപ്പാക്കുക", desc: "ഡിജിറ്റൽ ത്രാസ് പൂജ്യത്തിൽ തുടങ്ങിയെന്ന് ഉറപ്പുവരുത്തി സ്ലിപ്പ് വാങ്ങുക.", important: true },
        { id: 8, category: "ലേലവും തൂക്കവും", title: "വ്യാപാരി നൽകുന്ന വില ഉറപ്പാക്കുക", desc: "ലേലത്തിൽ ഉറപ്പിച്ച അന്തിമ നിരക്ക് സ്ഥിരീകരിക്കുക.", important: true },
        { id: 9, category: "പണമിടപാട്", title: "വിപണി കമ്മീഷനുകളെ കുറിച്ച് ചോദിച്ചറിയുക", desc: "ഔദ്യോഗിക സെസും ഹമാലിയും മാത്രം അനുവദിക്കുക.", important: false },
        { id: 10, category: "പണമിടപാട്", title: "അന്തിമ തുക ഉറപ്പാക്കുക", desc: "ആകെ തൂക്കം × വില മൈനസ് അനുവദനീയമായ കിഴിവ് = നിങ്ങളുടെ കൈയിൽ ലഭിക്കുന്ന തുക.", important: true },
        { id: 11, category: "പണമിടപാട്", title: "ഔദ്യോഗിക രസീത് വാങ്ങുക", desc: "ബാങ്ക് അക്കൗണ്ടിലേക്ക് പണം ക്രെഡിറ്റായ സന്ദേശം കണ്ട് മാത്രം വിപണി വിടുക.", important: true }
      ]
    };
  }

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
