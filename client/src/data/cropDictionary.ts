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
  }
];

export function resolveCropFromQuery(query: string): CropDictionaryEntry | undefined {
  if (!query) return undefined;
  const q = query.trim().toLowerCase();
  return COMPREHENSIVE_CROPS.find(c => 
    c.name.toLowerCase() === q ||
    c.name.toLowerCase().includes(q) ||
    c.primaryAlias.toLowerCase() === q ||
    c.primaryAlias.toLowerCase().includes(q) ||
    c.hindi.includes(query.trim()) ||
    c.kannada.includes(query.trim()) ||
    c.aliases.some(alias => alias === q || q.includes(alias) || alias.includes(q))
  );
}
