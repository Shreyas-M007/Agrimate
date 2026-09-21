export interface CropDictionaryEntry {
  name: string;
  hindi: string;
  kannada: string;
  primaryAlias: string;
  aliases: string[];
  modal: string;
  category: string;
}

export const COMPREHENSIVE_CROPS: CropDictionaryEntry[] = [
  {
    name: 'Groundnut',
    hindi: 'मूंगफली',
    kannada: 'ಕಡಲೆಕಾಯಿ',
    primaryAlias: 'Kadlekayi',
    aliases: ['kadlekayi', 'kadale kayi', 'kadlekai', 'kadale', 'mungphali', 'moongphali', 'peanut', 'peanuts', 'shengdana', 'groundnut'],
    modal: '₹5,361/q',
    category: 'Oilseeds'
  },
  {
    name: 'Tomato',
    hindi: 'टमाटर',
    kannada: 'ಟೊಮೆಟೊ',
    primaryAlias: 'Tamatar',
    aliases: ['tomato', 'tomatoes', 'tamatar', 'tamate', 'tamatara', 'thakkali'],
    modal: '₹1,850/q',
    category: 'Vegetables'
  },
  {
    name: 'Onion',
    hindi: 'प्याज',
    kannada: 'ಈರುಳ್ಳಿ',
    primaryAlias: 'Eerulli',
    aliases: ['onion', 'onions', 'pyaz', 'pyaaz', 'kanda', 'eerulli', 'irulli', 'ulligaddi', 'vengayam'],
    modal: '₹2,100/q',
    category: 'Vegetables'
  },
  {
    name: 'Potato',
    hindi: 'आलू',
    kannada: 'ಆಲೂಗಡ್ಡೆ',
    primaryAlias: 'Alugadde',
    aliases: ['potato', 'potatoes', 'aloo', 'alu', 'batata', 'alugadde', 'urulaikizhangu'],
    modal: '₹1,600/q',
    category: 'Vegetables'
  },
  {
    name: 'Green Chilli',
    hindi: 'हरी मिर्च',
    kannada: 'ಹಸಿಮೆಣಸಿನಕಾಯಿ',
    primaryAlias: 'Menasinakayi',
    aliases: ['chilli', 'green chilli', 'chilli green', 'mirch', 'mirchi', 'hari mirch', 'menasinakayi', 'menasinkayi', 'milagai'],
    modal: '₹3,400/q',
    category: 'Spices'
  },
  {
    name: 'Cotton',
    hindi: 'कपास',
    kannada: 'ಹತ್ತಿ',
    primaryAlias: 'Hathi',
    aliases: ['cotton', 'kapas', 'kapaas', 'rui', 'hathi', 'hathhi', 'paruthi'],
    modal: '₹7,200/q',
    category: 'Cash Crops'
  },
  {
    name: 'Soybean',
    hindi: 'सोयाबीन',
    kannada: 'ಸೋಯಾಬೀನ್',
    primaryAlias: 'Soyabean',
    aliases: ['soybean', 'soya', 'soyabean', 'soya bean'],
    modal: '₹4,350/q',
    category: 'Oilseeds'
  },
  {
    name: 'Maize',
    hindi: 'मक्का',
    kannada: 'ಮೆಕ್ಕೆಜೋಳ',
    primaryAlias: 'Mekkejola',
    aliases: ['maize', 'corn', 'makka', 'makai', 'bhutta', 'mekkejola', 'musukinajola', 'makkacholam'],
    modal: '₹2,150/q',
    category: 'Grains'
  },
  {
    name: 'Paddy / Rice',
    hindi: 'धान / चावल',
    kannada: 'ಭತ್ತ / ಅಕ್ಕಿ',
    primaryAlias: 'Bhatta',
    aliases: ['paddy', 'rice', 'dhan', 'chawal', 'bhatta', 'akki', 'nellu', 'arisi'],
    modal: '₹2,450/q',
    category: 'Grains'
  },
  {
    name: 'Wheat',
    hindi: 'गेहूं',
    kannada: 'ಗೋಧಿ',
    primaryAlias: 'Godhi',
    aliases: ['wheat', 'gehun', 'gehu', 'godhi', 'gothumai'],
    modal: '₹2,600/q',
    category: 'Grains'
  },
  {
    name: 'Mustard',
    hindi: 'सरसों',
    kannada: 'ಸಾಸಿವೆ',
    primaryAlias: 'Sasive',
    aliases: ['mustard', 'sarson', 'rai', 'sasive', 'kadugu'],
    modal: '₹5,400/q',
    category: 'Oilseeds'
  },
  {
    name: 'Ginger',
    hindi: 'अदरक',
    kannada: 'ಶುಂಠಿ',
    primaryAlias: 'Shunti',
    aliases: ['ginger', 'adrak', 'shunti', 'inji'],
    modal: '₹6,200/q',
    category: 'Spices'
  },
  {
    name: 'Garlic',
    hindi: 'लहसुन',
    kannada: 'ಬೆಳ್ಳುಳ್ಳಿ',
    primaryAlias: 'Bellulli',
    aliases: ['garlic', 'lahsun', 'bellulli', 'poondu'],
    modal: '₹14,500/q',
    category: 'Spices'
  },
  {
    name: 'Turmeric',
    hindi: 'हल्दी',
    kannada: 'ಅರಿಶಿನ',
    primaryAlias: 'Arishina',
    aliases: ['turmeric', 'haldi', 'arishina', 'manjal'],
    modal: '₹12,400/q',
    category: 'Spices'
  },
  {
    name: 'Cardamom',
    hindi: 'इलायची',
    kannada: 'ಏಲಕ್ಕಿ',
    primaryAlias: 'Elakki',
    aliases: ['cardamom', 'elaichi', 'elakki', 'elakkai'],
    modal: '₹2,400/kg',
    category: 'Spices'
  },
  {
    name: 'Sugarcane',
    hindi: 'गन्ना',
    kannada: 'ಕಬ್ಬು',
    primaryAlias: 'Kabbu',
    aliases: ['sugarcane', 'ganna', 'kabbu', 'karumbu'],
    modal: '₹340/q',
    category: 'Cash Crops'
  },
  {
    name: 'Ragi / Finger Millet',
    hindi: 'रागी',
    kannada: 'ರಾಗಿ',
    primaryAlias: 'Ragi',
    aliases: ['ragi', 'finger millet', 'nachni', 'mandua', 'kezhvaragu'],
    modal: '₹3,200/q',
    category: 'Grains'
  },
  {
    name: 'Jowar / Sorghum',
    hindi: 'ज्वार',
    kannada: 'ಜೋಳ',
    primaryAlias: 'Jola',
    aliases: ['jowar', 'sorghum', 'jola', 'cholam'],
    modal: '₹2,800/q',
    category: 'Grains'
  },
  {
    name: 'Apple',
    hindi: 'सेब',
    kannada: 'ಸೇಬು',
    primaryAlias: 'Apple',
    aliases: ['apple', 'apples', 'seb', 'sebu'],
    modal: '₹8,500/q',
    category: 'Fruits'
  },
  {
    name: 'Banana',
    hindi: 'केला',
    kannada: 'ಬಾಳೆಹಣ್ಣು',
    primaryAlias: 'Balehannu',
    aliases: ['banana', 'bananas', 'kela', 'balehannu', 'bale hannu', 'valapalam'],
    modal: '₹2,200/q',
    category: 'Fruits'
  },
  {
    name: 'Mango',
    hindi: 'आम',
    kannada: 'ಮಾವಿನಹಣ್ಣು',
    primaryAlias: 'Mavinahannu',
    aliases: ['mango', 'mangoes', 'aam', 'mavinahannu', 'mavina hannu', 'manga'],
    modal: '₹4,500/q',
    category: 'Fruits'
  },
  {
    name: 'Pomegranate',
    hindi: 'अनार',
    kannada: 'ದಾಳಿಂಬೆ',
    primaryAlias: 'Dalimbe',
    aliases: ['pomegranate', 'anar', 'dalimbe', 'mathalam'],
    modal: '₹9,000/q',
    category: 'Fruits'
  },
  {
    name: 'Grapes',
    hindi: 'अंगूर',
    kannada: 'ದ್ರಾಕ್ಷಿ',
    primaryAlias: 'Drakshi',
    aliases: ['grapes', 'grape', 'angoor', 'drakshi', 'thiratchai'],
    modal: '₹5,800/q',
    category: 'Fruits'
  },
  {
    name: 'Orange',
    hindi: 'संतरा',
    kannada: 'ಕಿತ್ತಳೆ',
    primaryAlias: 'Kittale',
    aliases: ['orange', 'oranges', 'santra', 'kittale', 'naranga'],
    modal: '₹3,600/q',
    category: 'Fruits'
  },
  {
    name: 'Papaya',
    hindi: 'पपीता',
    kannada: 'ಪರಂಗಿ',
    primaryAlias: 'Parangi',
    aliases: ['papaya', 'papita', 'parangi', 'pappali'],
    modal: '₹1,800/q',
    category: 'Fruits'
  },
  {
    name: 'Coconut',
    hindi: 'नारियल',
    kannada: 'ತೆಂಗಿನಕಾಯಿ',
    primaryAlias: 'Tenginakayi',
    aliases: ['coconut', 'coconuts', 'nariyal', 'tenginakayi', 'thengai'],
    modal: '₹3,100/q',
    category: 'Plantation'
  },
  {
    name: 'Coffee',
    hindi: 'कॉफ़ी',
    kannada: 'ಕಾಫಿ',
    primaryAlias: 'Coffee',
    aliases: ['coffee', 'kapi', 'kaapi'],
    modal: '₹24,000/q',
    category: 'Plantation'
  },
  {
    name: 'Cashew',
    hindi: 'काजू',
    kannada: 'ಗೋಡಂಬಿ',
    primaryAlias: 'Godambi',
    aliases: ['cashew', 'kaju', 'godambi', 'mundhiri'],
    modal: '₹65,000/q',
    category: 'Plantation'
  }
];

export function resolveCropFromQuery(query: string): CropDictionaryEntry | undefined {
  if (!query) return undefined;
  const raw = query.trim();
  const q = raw.toLowerCase();
  if (q.length < 2) return undefined;

  // 1. Exact match on name, primary alias, or aliases
  const exact = COMPREHENSIVE_CROPS.find(c => 
    c.name.toLowerCase() === q ||
    c.primaryAlias.toLowerCase() === q ||
    c.aliases.some(a => a.toLowerCase() === q) ||
    c.hindi === raw ||
    c.kannada === raw
  );
  if (exact) return exact;

  // 2. Query contains canonical name or alias (e.g. "fresh kadlekayi", "organic tomato")
  const containsAlias = COMPREHENSIVE_CROPS.find(c => 
    q.includes(c.name.toLowerCase()) ||
    q.includes(c.primaryAlias.toLowerCase()) ||
    c.aliases.some(a => q.includes(a.toLowerCase())) ||
    (c.kannada && raw.includes(c.kannada)) ||
    (c.hindi && raw.includes(c.hindi))
  );
  if (containsAlias) return containsAlias;

  // 3. Prefix match (min 3 chars)
  if (q.length >= 3) {
    const prefixMatch = COMPREHENSIVE_CROPS.find(c => 
      c.name.toLowerCase().startsWith(q) ||
      c.primaryAlias.toLowerCase().startsWith(q) ||
      c.aliases.some(a => a.toLowerCase().startsWith(q))
    );
    if (prefixMatch) return prefixMatch;
  }

  return undefined;
}
