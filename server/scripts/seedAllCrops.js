/**
 * Seed ALL crops grown in India into the commodities table.
 * Run: node server/scripts/seedAllCrops.js
 */
import db from '../database/db.js';

const ALL_INDIA_CROPS = [
  // ── Cereals & Millets ──
  { id: 'CMD_RICE',           name: 'Rice',            name_hi: 'चावल',       name_kn: 'ಅಕ್ಕಿ',       category: 'Cereal',   unit: 'quintal', icon: '', varieties: ['Basmati', 'Sona Masuri', 'IR-64', 'Ponni', 'HMT', 'Swarna'] },
  { id: 'CMD_PADDY',          name: 'Paddy',           name_hi: 'धान',        name_kn: 'ಭತ್ತ',        category: 'Cereal',   unit: 'quintal', icon: '', varieties: ['Basmati', 'Non-Basmati', 'Sona Masuri', 'IR-36', 'HMT'] },
  { id: 'CMD_WHEAT',          name: 'Wheat',           name_hi: 'गेहूं',      name_kn: 'ಗೋಧಿ',       category: 'Cereal',   unit: 'quintal', icon: '', varieties: ['Sharbati', 'Lokwan', 'MP Wheat', 'HD-2967', 'PBW-550'] },
  { id: 'CMD_MAIZE',          name: 'Maize',           name_hi: 'मक्का',      name_kn: 'ಜೋಳ',        category: 'Cereal',   unit: 'quintal', icon: '', varieties: ['Yellow', 'White', 'Baby Corn', 'Sweet Corn', 'Hybrid'] },
  { id: 'CMD_JOWAR',          name: 'Jowar',           name_hi: 'ज्वार',      name_kn: 'ಜೋಳ',        category: 'Millet',   unit: 'quintal', icon: '', varieties: ['Kharif Jowar', 'Rabi Jowar', 'Maldandi'] },
  { id: 'CMD_BAJRA',          name: 'Bajra',           name_hi: 'बाजरा',      name_kn: 'ಸಜ್ಜೆ',       category: 'Millet',   unit: 'quintal', icon: '', varieties: ['Hybrid Bajra', 'Local Bajra'] },
  { id: 'CMD_RAGI',           name: 'Ragi',            name_hi: 'रागी',       name_kn: 'ರಾಗಿ',       category: 'Millet',   unit: 'quintal', icon: '', varieties: ['GPU-28', 'MR-1', 'Local'] },
  { id: 'CMD_BARLEY',         name: 'Barley',          name_hi: 'जौ',         name_kn: 'ಬಾರ್ಲಿ',      category: 'Cereal',   unit: 'quintal', icon: '', varieties: ['Malting Barley', 'Feed Barley'] },
  { id: 'CMD_FOXTAIL_MILLET', name: 'Foxtail Millet',  name_hi: 'कंगनी',      name_kn: 'ನವಣೆ',       category: 'Millet',   unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_KODO_MILLET',    name: 'Kodo Millet',     name_hi: 'कोदो',       name_kn: 'ಹಾರಕ',       category: 'Millet',   unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_PROSO_MILLET',   name: 'Proso Millet',    name_hi: 'चीना',       name_kn: 'ಬರಗು',       category: 'Millet',   unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_BARNYARD_MILLET',name: 'Barnyard Millet', name_hi: 'सांवा',      name_kn: 'ಊದಲು',       category: 'Millet',   unit: 'quintal', icon: '', varieties: [] },

  // ── Pulses ──
  { id: 'CMD_TUR',            name: 'Tur',             name_hi: 'तुअर',       name_kn: 'ತೊಗರಿ',      category: 'Pulse',    unit: 'quintal', icon: '', varieties: ['Wadi Tur', 'Local Tur'] },
  { id: 'CMD_GRAM',           name: 'Gram',            name_hi: 'चना',        name_kn: 'ಕಡಲೆ',       category: 'Pulse',    unit: 'quintal', icon: '', varieties: ['Desi', 'Kabuli', 'Bold'] },
  { id: 'CMD_MOONG',          name: 'Moong',           name_hi: 'मूंग',       name_kn: 'ಹೆಸರು',      category: 'Pulse',    unit: 'quintal', icon: '', varieties: ['Green Moong', 'Yellow Moong', 'Whole Moong'] },
  { id: 'CMD_URAD',           name: 'Urad',            name_hi: 'उड़द',       name_kn: 'ಉದ್ದಿನ ಕಾಳು', category: 'Pulse',    unit: 'quintal', icon: '', varieties: ['Black Urad', 'White Urad'] },
  { id: 'CMD_MASOOR',         name: 'Masoor',          name_hi: 'मसूर',       name_kn: 'ಮಸೂರ',       category: 'Pulse',    unit: 'quintal', icon: '', varieties: ['Bold Masoor', 'Small Masoor'] },
  { id: 'CMD_PEAS',           name: 'Peas',            name_hi: 'मटर',        name_kn: 'ಬಟಾಣಿ',      category: 'Pulse',    unit: 'quintal', icon: '', varieties: ['Green Peas', 'Dry Peas'] },
  { id: 'CMD_RAJMA',          name: 'Rajma',           name_hi: 'राजमा',      name_kn: 'ರಾಜ್ಮಾ',      category: 'Pulse',    unit: 'quintal', icon: '', varieties: ['Red Rajma', 'Light Rajma'] },
  { id: 'CMD_MOTH',           name: 'Moth Bean',       name_hi: 'मोठ',        name_kn: 'ಮಠ',         category: 'Pulse',    unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_HORSEGRAM',      name: 'Horse Gram',      name_hi: 'कुलथी',      name_kn: 'ಹುರುಳಿ',     category: 'Pulse',    unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_COWPEA',         name: 'Cowpea',          name_hi: 'लोबिया',     name_kn: 'ಅಲಸಂದೆ',     category: 'Pulse',    unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_GUAR',           name: 'Guar',            name_hi: 'ग्वार',      name_kn: 'ಗ್ವಾರ್',      category: 'Pulse',    unit: 'quintal', icon: '', varieties: [] },

  // ── Oilseeds ──
  { id: 'CMD_GROUNDNUT',      name: 'Groundnut',       name_hi: 'मूंगफली',    name_kn: 'ಕಡಲೆಕಾಯಿ',   category: 'Oilseed', unit: 'quintal', icon: '', varieties: ['Bold', 'Java', 'TG-37A', 'J-11'] },
  { id: 'CMD_SOYBEAN',        name: 'Soybean',         name_hi: 'सोयाबीन',    name_kn: 'ಸೋಯಾಬೀನ್',   category: 'Oilseed', unit: 'quintal', icon: '', varieties: ['JS-335', 'Yellow Soybean'] },
  { id: 'CMD_MUSTARD',        name: 'Mustard',         name_hi: 'सरसों',      name_kn: 'ಸಾಸಿವೆ',     category: 'Oilseed', unit: 'quintal', icon: '', varieties: ['Bold', 'Lohi', 'Toria'] },
  { id: 'CMD_SUNFLOWER',      name: 'Sunflower',       name_hi: 'सूरजमुखी',   name_kn: 'ಸೂರ್ಯಕಾಂತಿ', category: 'Oilseed', unit: 'quintal', icon: '', varieties: ['Hybrid', 'Non-Hybrid'] },
  { id: 'CMD_SESAME',         name: 'Sesame',          name_hi: 'तिल',        name_kn: 'ಎಳ್ಳು',      category: 'Oilseed', unit: 'quintal', icon: '', varieties: ['White Sesame', 'Black Sesame'] },
  { id: 'CMD_CASTOR',         name: 'Castor',          name_hi: 'अरंडी',      name_kn: 'ಹರಳು',       category: 'Oilseed', unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_LINSEED',        name: 'Linseed',         name_hi: 'अलसी',       name_kn: 'ಅಗಸೆ',       category: 'Oilseed', unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_SAFFLOWER',      name: 'Safflower',       name_hi: 'कुसुम',      name_kn: 'ಕುಸುಮೆ',     category: 'Oilseed', unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_COCONUT',        name: 'Coconut',         name_hi: 'नारियल',     name_kn: 'ತೆಂಗಿನಕಾಯಿ', category: 'Plantation', unit: 'number', icon: '', varieties: ['Tender Coconut', 'Dry Coconut', 'Copra'] },

  // ── Cash Crops ──
  { id: 'CMD_COTTON',         name: 'Cotton',          name_hi: 'कपास',       name_kn: 'ಹತ್ತಿ',      category: 'Fibre',   unit: 'quintal', icon: '', varieties: ['Bt Cotton', 'Long Staple', 'Medium Staple', 'Short Staple'] },
  { id: 'CMD_SUGARCANE',      name: 'Sugarcane',       name_hi: 'गन्ना',      name_kn: 'ಕಬ್ಬು',      category: 'Cash',    unit: 'tonne',   icon: '', varieties: ['CO-86032', 'CO-0238'] },
  { id: 'CMD_JUTE',           name: 'Jute',            name_hi: 'जूट',        name_kn: 'ಸೆಣಬು',      category: 'Fibre',   unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_TOBACCO',        name: 'Tobacco',         name_hi: 'तंबाकू',     name_kn: 'ತಂಬಾಕು',     category: 'Cash',    unit: 'quintal', icon: '', varieties: ['Flue Cured', 'Burley'] },

  // ── Vegetables ──
  { id: 'CMD_TOMATO',         name: 'Tomato',          name_hi: 'टमाटर',      name_kn: 'ಟೊಮ್ಯಾಟೊ',   category: 'Vegetable', unit: 'quintal', icon: '', varieties: ['Hybrid', 'Country', 'Cherry', 'Desi'] },
  { id: 'CMD_ONION',          name: 'Onion',           name_hi: 'प्याज',      name_kn: 'ಈರುಳ್ಳಿ',    category: 'Vegetable', unit: 'quintal', icon: '', varieties: ['Red Onion', 'White Onion', 'Small Onion'] },
  { id: 'CMD_POTATO',         name: 'Potato',          name_hi: 'आलू',        name_kn: 'ಆಲೂಗಡ್ಡೆ',   category: 'Vegetable', unit: 'quintal', icon: '', varieties: ['Jyoti', 'Kufri', 'Pukhraj'] },
  { id: 'CMD_BRINJAL',        name: 'Brinjal',         name_hi: 'बैंगन',      name_kn: 'ಬದನೆಕಾಯಿ',   category: 'Vegetable', unit: 'quintal', icon: '', varieties: ['Round', 'Long'] },
  { id: 'CMD_CHILLI',         name: 'Chilli',          name_hi: 'मिर्च',      name_kn: 'ಮೆಣಸಿನಕಾಯಿ', category: 'Vegetable', unit: 'quintal', icon: '', varieties: ['Guntur Sannam', 'Teja', 'Byadgi', 'Green Chilli'] },
  { id: 'CMD_CAPSICUM',       name: 'Capsicum',        name_hi: 'शिमला मिर्च', name_kn: 'ಡಬ್ಬಿ ಮೆಣಸು', category: 'Vegetable', unit: 'quintal', icon: '', varieties: ['Green', 'Red', 'Yellow'] },
  { id: 'CMD_CABBAGE',        name: 'Cabbage',         name_hi: 'पत्तागोभी',  name_kn: 'ಕೋಸು',       category: 'Vegetable', unit: 'quintal', icon: '', varieties: ['Local', 'Hybrid'] },
  { id: 'CMD_CAULIFLOWER',    name: 'Cauliflower',     name_hi: 'फूलगोभी',    name_kn: 'ಹೂಕೋಸು',     category: 'Vegetable', unit: 'quintal', icon: '', varieties: ['Snowball', 'Hybrid'] },
  { id: 'CMD_OKRA',           name: 'Okra',            name_hi: 'भिंडी',      name_kn: 'ಬೆಂಡೆ',      category: 'Vegetable', unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_CUCUMBER',       name: 'Cucumber',        name_hi: 'खीरा',       name_kn: 'ಸೌತೆಕಾಯಿ',   category: 'Vegetable', unit: 'quintal', icon: '', varieties: ['Slicing', 'Pickling'] },
  { id: 'CMD_PUMPKIN',        name: 'Pumpkin',         name_hi: 'कद्दू',      name_kn: 'ಕುಂಬಳಕಾಯಿ',  category: 'Vegetable', unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_BITTER_GOURD',   name: 'Bitter Gourd',    name_hi: 'करेला',      name_kn: 'ಹಾಗಲಕಾಯಿ',   category: 'Vegetable', unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_BOTTLE_GOURD',   name: 'Bottle Gourd',    name_hi: 'लौकी',       name_kn: 'ಸೋರೆಕಾಯಿ',   category: 'Vegetable', unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_RIDGE_GOURD',    name: 'Ridge Gourd',     name_hi: 'तोरई',       name_kn: 'ಹೀರೆಕಾಯಿ',   category: 'Vegetable', unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_CARROT',         name: 'Carrot',          name_hi: 'गाजर',       name_kn: 'ಗಜ್ಜರಿ',     category: 'Vegetable', unit: 'quintal', icon: '', varieties: ['Desi', 'Hybrid', 'Nantes'] },
  { id: 'CMD_RADISH',         name: 'Radish',          name_hi: 'मूली',       name_kn: 'ಮೂಲಂಗಿ',     category: 'Vegetable', unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_BEETROOT',       name: 'Beetroot',        name_hi: 'चुकंदर',     name_kn: 'ಬೀಟ್‌ರೂಟ್',   category: 'Vegetable', unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_GARLIC',         name: 'Garlic',          name_hi: 'लहसुन',      name_kn: 'ಬೆಳ್ಳುಳ್ಳಿ',  category: 'Vegetable', unit: 'quintal', icon: '', varieties: ['Desi Garlic', 'Hybrid Garlic'] },
  { id: 'CMD_GINGER',         name: 'Ginger',          name_hi: 'अदरक',       name_kn: 'ಶುಂಠಿ',      category: 'Spice',   unit: 'quintal', icon: '', varieties: ['Green Ginger', 'Dry Ginger'] },
  { id: 'CMD_TURMERIC',       name: 'Turmeric',        name_hi: 'हल्दी',      name_kn: 'ಅರಿಶಿನ',     category: 'Spice',   unit: 'quintal', icon: '', varieties: ['Nizamabad', 'Erode', 'Salem'] },
  { id: 'CMD_DRUMSTICK',      name: 'Drumstick',       name_hi: 'सहजन',       name_kn: 'ನುಗ್ಗೆಕಾಯಿ',  category: 'Vegetable', unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_SWEET_POTATO',   name: 'Sweet Potato',    name_hi: 'शकरकंद',     name_kn: 'ಗೆಣಸು',      category: 'Vegetable', unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_YAM',            name: 'Yam',             name_hi: 'रतालू',      name_kn: 'ಗೆಣಸು',      category: 'Vegetable', unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_COLOCASIA',      name: 'Colocasia',       name_hi: 'अरबी',       name_kn: 'ಕೆಸವು',      category: 'Vegetable', unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_MUSHROOM',       name: 'Mushroom',        name_hi: 'मशरूम',      name_kn: 'ಅಣಬೆ',       category: 'Vegetable', unit: 'quintal', icon: '', varieties: ['Button', 'Oyster', 'Milky'] },
  { id: 'CMD_FRENCH_BEANS',   name: 'French Beans',    name_hi: 'फ्रेंच बीन', name_kn: 'ಫ್ರೆಂಚ್ ಬೀನ್', category: 'Vegetable', unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_SPINACH',        name: 'Spinach',         name_hi: 'पालक',       name_kn: 'ಪಾಲಕ',       category: 'Vegetable', unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_FENUGREEK',      name: 'Fenugreek',       name_hi: 'मेथी',       name_kn: 'ಮೆಂತ್ಯ',     category: 'Vegetable', unit: 'quintal', icon: '', varieties: ['Green Methi', 'Kasuri Methi'] },
  { id: 'CMD_CORIANDER_LEAF', name: 'Coriander Leaves', name_hi: 'धनिया पत्ता', name_kn: 'ಕೊತ್ತಂಬರಿ ಸೊಪ್ಪು', category: 'Vegetable', unit: 'quintal', icon: '', varieties: [] },

  // ── Fruits ──
  { id: 'CMD_MANGO',          name: 'Mango',           name_hi: 'आम',         name_kn: 'ಮಾವು',       category: 'Fruit',   unit: 'quintal', icon: '', varieties: ['Alphonso', 'Kesar', 'Dasheri', 'Langra', 'Banganapalli', 'Totapuri'] },
  { id: 'CMD_BANANA',         name: 'Banana',          name_hi: 'केला',       name_kn: 'ಬಾಳೆ',       category: 'Fruit',   unit: 'quintal', icon: '', varieties: ['Robusta', 'Cavendish', 'Nendran', 'Rasthali', 'Poovan'] },
  { id: 'CMD_APPLE',          name: 'Apple',           name_hi: 'सेब',        name_kn: 'ಸೇಬು',       category: 'Fruit',   unit: 'quintal', icon: '', varieties: ['Royal Delicious', 'Fuji', 'Shimla Apple'] },
  { id: 'CMD_GRAPES',         name: 'Grapes',          name_hi: 'अंगूर',      name_kn: 'ದ್ರಾಕ್ಷಿ',    category: 'Fruit',   unit: 'quintal', icon: '', varieties: ['Thompson', 'Sharad Seedless', 'Anab-e-Shahi', 'Bangalore Blue'] },
  { id: 'CMD_ORANGE',         name: 'Orange',          name_hi: 'संतरा',      name_kn: 'ಕಿತ್ತಳೆ',    category: 'Fruit',   unit: 'quintal', icon: '', varieties: ['Nagpur Orange', 'Coorg Orange'] },
  { id: 'CMD_MOSAMBI',        name: 'Mosambi',         name_hi: 'मौसम्बी',    name_kn: 'ಮೋಸಂಬಿ',     category: 'Fruit',   unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_LEMON',          name: 'Lemon',           name_hi: 'नींबू',      name_kn: 'ನಿಂಬೆ',      category: 'Fruit',   unit: 'quintal', icon: '', varieties: ['Kagzi Lime', 'Eureka'] },
  { id: 'CMD_GUAVA',          name: 'Guava',           name_hi: 'अमरूद',      name_kn: 'ಪೇರಲ',       category: 'Fruit',   unit: 'quintal', icon: '', varieties: ['Allahabad Safeda', 'Apple Guava'] },
  { id: 'CMD_PAPAYA',         name: 'Papaya',          name_hi: 'पपीता',      name_kn: 'ಪಪ್ಪಾಯಿ',    category: 'Fruit',   unit: 'quintal', icon: '', varieties: ['Red Lady', 'Solo', 'Surya'] },
  { id: 'CMD_POMEGRANATE',    name: 'Pomegranate',     name_hi: 'अनार',       name_kn: 'ದಾಳಿಂಬೆ',    category: 'Fruit',   unit: 'quintal', icon: '', varieties: ['Bhagwa', 'Ganesh', 'Kesar'] },
  { id: 'CMD_WATERMELON',     name: 'Watermelon',      name_hi: 'तरबूज',      name_kn: 'ಕಲ್ಲಂಗಡಿ',   category: 'Fruit',   unit: 'quintal', icon: '', varieties: ['Sugar Baby', 'Hybrid'] },
  { id: 'CMD_MUSKMELON',      name: 'Muskmelon',       name_hi: 'खरबूजा',     name_kn: 'ಕರಬೂಜ',      category: 'Fruit',   unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_PINEAPPLE',      name: 'Pineapple',       name_hi: 'अनानास',     name_kn: 'ಅನಾನಸ',      category: 'Fruit',   unit: 'quintal', icon: '', varieties: ['Queen', 'Kew'] },
  { id: 'CMD_SAPOTA',         name: 'Sapota',          name_hi: 'चीकू',       name_kn: 'ಸಪೋಟ',       category: 'Fruit',   unit: 'quintal', icon: '', varieties: ['Cricket Ball', 'Kalipatti'] },
  { id: 'CMD_JACKFRUIT',      name: 'Jackfruit',       name_hi: 'कटहल',       name_kn: 'ಹಲಸು',       category: 'Fruit',   unit: 'quintal', icon: '', varieties: ['Hard Jackfruit', 'Soft Jackfruit'] },
  { id: 'CMD_LITCHI',         name: 'Litchi',          name_hi: 'लीची',       name_kn: 'ಲೀಚಿ',       category: 'Fruit',   unit: 'quintal', icon: '', varieties: ['Shahi', 'Rose Scented'] },
  { id: 'CMD_AMLA',           name: 'Amla',            name_hi: 'आंवला',      name_kn: 'ನೆಲ್ಲಿ',     category: 'Fruit',   unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_STRAWBERRY',     name: 'Strawberry',      name_hi: 'स्ट्रॉबेरी', name_kn: 'ಸ್ಟ್ರಾಬೆರಿ',  category: 'Fruit',   unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_DRAGON_FRUIT',   name: 'Dragon Fruit',    name_hi: 'ड्रैगन फ्रूट', name_kn: 'ಡ್ರ್ಯಾಗನ್ ಫ್ರೂಟ್', category: 'Fruit', unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_FIG',            name: 'Fig',             name_hi: 'अंजीर',      name_kn: 'ಅಂಜೂರ',      category: 'Fruit',   unit: 'quintal', icon: '', varieties: [] },

  // ── Spices & Aromatics ──
  { id: 'CMD_CUMIN',          name: 'Cumin',           name_hi: 'जीरा',       name_kn: 'ಜೀರಿಗೆ',     category: 'Spice',   unit: 'quintal', icon: '', varieties: ['Bold Jeera', 'Small Jeera'] },
  { id: 'CMD_CORIANDER',      name: 'Coriander Seeds', name_hi: 'धनिया',      name_kn: 'ಕೊತ್ತಂಬರಿ',  category: 'Spice',   unit: 'quintal', icon: '', varieties: ['Eagle', 'Scooter'] },
  { id: 'CMD_FENNEL',         name: 'Fennel',          name_hi: 'सौंफ',       name_kn: 'ಸೋಂಪು',      category: 'Spice',   unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_BLACK_PEPPER',   name: 'Black Pepper',    name_hi: 'काली मिर्च', name_kn: 'ಕರಿಮೆಣಸು',   category: 'Spice',   unit: 'quintal', icon: '', varieties: ['Panniyur-1', 'Karimunda'] },
  { id: 'CMD_CARDAMOM',       name: 'Cardamom',        name_hi: 'इलायची',     name_kn: 'ಏಲಕ್ಕಿ',     category: 'Spice',   unit: 'kg',      icon: '', varieties: ['Green Cardamom', 'Large Cardamom'] },
  { id: 'CMD_AJWAIN',         name: 'Ajwain',          name_hi: 'अजवाइन',     name_kn: 'ಅಜವಾನ',      category: 'Spice',   unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_FENUGREEK_SEED', name: 'Fenugreek Seeds', name_hi: 'मेथी दाना',  name_kn: 'ಮೆಂತ್ಯ ಬೀಜ', category: 'Spice',   unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_CLOVES',         name: 'Cloves',          name_hi: 'लौंग',       name_kn: 'ಲವಂಗ',       category: 'Spice',   unit: 'kg',      icon: '', varieties: [] },
  { id: 'CMD_VANILLA',        name: 'Vanilla',         name_hi: 'वेनिला',     name_kn: 'ವೆನಿಲ್ಲಾ',   category: 'Spice',   unit: 'kg',      icon: '', varieties: [] },
  { id: 'CMD_SAFFRON',        name: 'Saffron',         name_hi: 'केसर',       name_kn: 'ಕೇಸರಿ',      category: 'Spice',   unit: 'kg',      icon: '', varieties: [] },

  // ── Tea & Coffee ──
  { id: 'CMD_TEA',            name: 'Tea',             name_hi: 'चाय',        name_kn: 'ಚಹಾ',        category: 'Plantation', unit: 'kg',   icon: '', varieties: ['CTC', 'Orthodox', 'Green Tea'] },
  { id: 'CMD_COFFEE',         name: 'Coffee',          name_hi: 'कॉफी',       name_kn: 'ಕಾಫಿ',       category: 'Plantation', unit: 'kg',   icon: '', varieties: ['Arabica', 'Robusta'] },
  { id: 'CMD_ARECANUT',       name: 'Arecanut',        name_hi: 'सुपारी',     name_kn: 'ಅಡಿಕೆ',      category: 'Plantation', unit: 'quintal', icon: '', varieties: ['Red Betel', 'White Betel'] },
  { id: 'CMD_RUBBER',         name: 'Rubber',          name_hi: 'रबर',        name_kn: 'ರಬ್ಬರ್',      category: 'Plantation', unit: 'quintal', icon: '', varieties: ['RSS-1', 'RSS-4'] },
  { id: 'CMD_CASHEW',         name: 'Cashew',          name_hi: 'काजू',       name_kn: 'ಗೋಡಂಬಿ',     category: 'Nut',     unit: 'quintal', icon: '', varieties: ['Raw Cashew', 'W-180', 'W-240', 'W-320'] },

  // ── Flowers ──
  { id: 'CMD_MARIGOLD',       name: 'Marigold',        name_hi: 'गेंदा',      name_kn: 'ಚೆಂಡುಹೂ',    category: 'Flower',  unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_ROSE',           name: 'Rose',            name_hi: 'गुलाब',      name_kn: 'ಗುಲಾಬಿ',     category: 'Flower',  unit: 'quintal', icon: '', varieties: [] },
  { id: 'CMD_JASMINE',        name: 'Jasmine',         name_hi: 'चमेली',      name_kn: 'ಮಲ್ಲಿಗೆ',    category: 'Flower',  unit: 'quintal', icon: '', varieties: ['Single Petal', 'Double Petal'] },
  { id: 'CMD_CHRYSANTHEMUM',  name: 'Chrysanthemum',   name_hi: 'गुलदाउदी',   name_kn: 'ಶೇವಂತಿ',     category: 'Flower',  unit: 'quintal', icon: '', varieties: [] },
];

async function seedCrops() {
  let inserted = 0, skipped = 0;
  for (const crop of ALL_INDIA_CROPS) {
    try {
      const exists = await db.get('SELECT commodity_id FROM commodities WHERE commodity_id = ?', [crop.id]);
      if (exists) { skipped++; continue; }
      await db.run(
        `INSERT INTO commodities (commodity_id, name, name_hi, name_kn, category, unit, icon, varieties_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [crop.id, crop.name, crop.name_hi, crop.name_kn, crop.category, crop.unit, crop.icon, JSON.stringify(crop.varieties)]
      );
      inserted++;
    } catch (err) {
      console.error(`Failed to insert ${crop.name}:`, err.message);
    }
  }
  console.log(`✓ Seeded ${inserted} new crops | Skipped ${skipped} existing | Total in DB: ${ALL_INDIA_CROPS.length}`);
  process.exit(0);
}

seedCrops();
