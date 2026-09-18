import React, { useState } from 'react';
import type { Language, NavigationPage, Commodity } from '../types';
import { 
  Search, 
  ChevronRight
} from 'lucide-react';

interface CropsPageProps {
  language: Language;
  onNavigate: (page: NavigationPage) => void;
  onSelectCropAndNavigate: (cropName: string) => void;
  commodities?: Commodity[];
}

interface CropDetail {
  id: string;
  name: string;
  hindiName: string;
  kannadaName: string;
  category: 'Solanaceous' | 'Alliums & Tubers' | 'Grains & Pulses' | 'Cash Crops' | 'Oilseeds' | 'Spices & Plantation' | 'Fruits & Exotic';
  icon: string;
  varieties: string[];
  modalRange: string;
  peakSeason: string;
  majorMandis: string[];
  storageAdvice: string;
  moistureThreshold: string;
}

const CROP_DATABASE: CropDetail[] = [
  {
    id: 'tomato',
    name: 'Tomato',
    hindiName: 'टमाटर',
    kannadaName: 'ಟೊಮೆಟೊ',
    category: 'Solanaceous',
    icon: '🍅',
    varieties: ['Hybrid Shivam', 'Local Country', 'Abhinav', 'Arka Rakshak'],
    modalRange: '₹1,400 - ₹2,350 / q',
    peakSeason: 'Year-round (Peak: Nov - Feb)',
    majorMandis: ['Kolar (KA)', 'Ballari (KA)', 'Madanapalle (AP)', 'Azadpur (DL)'],
    storageAdvice: 'Stage at 10-12°C with 90% relative humidity. Do not refrigerate below 8°C to prevent chilling injury.',
    moistureThreshold: 'Firm red / breaker stage, zero skin punctures'
  },
  {
    id: 'onion',
    name: 'Onion',
    hindiName: 'प्याज',
    kannadaName: 'ಈರುಳ್ಳಿ',
    category: 'Alliums & Tubers',
    icon: '🧅',
    varieties: ['Nashik Red', 'Garwa Late', 'Bellary White', 'Bhima Super'],
    modalRange: '₹1,600 - ₹2,450 / q',
    peakSeason: 'Kharif (Oct-Dec) & Rabi (Mar-Jun)',
    majorMandis: ['Lasalgaon (MH)', 'Hubballi (KA)', 'Dindori (MH)', 'Yeola (MH)'],
    storageAdvice: 'Cure in field shadows for 48 hours. Store in ventilated slotted sheds at 65% humidity.',
    moistureThreshold: 'Dry outer neck scale, moisture below 12%'
  },
  {
    id: 'potato',
    name: 'Potato',
    hindiName: 'आलू',
    kannadaName: 'ಆಲೂಗಡ್ಡೆ',
    category: 'Alliums & Tubers',
    icon: '🥔',
    varieties: ['Kufri Jyoti', 'Kufri Chandramukhi', 'Kufri Pukhraj'],
    modalRange: '₹1,300 - ₹1,900 / q',
    peakSeason: 'Dec - Mar',
    majorMandis: ['Hassan (KA)', 'Agra (UP)', 'Farrukhabad (UP)', 'Kolar (KA)'],
    storageAdvice: 'Cold storage at 3-4°C with CIPC sprout suppression for table stock.',
    moistureThreshold: 'Tough skin setting, no greening or tuber moth damage'
  },
  {
    id: 'turmeric',
    name: 'Turmeric',
    hindiName: 'हल्दी',
    kannadaName: 'ಅರಿಶಿನ',
    category: 'Spices & Plantation',
    icon: '🌿',
    varieties: ['Salem', 'Prathibha', 'Rajapore', 'Waigaon'],
    modalRange: '₹9,800 - ₹14,500 / q',
    peakSeason: 'Feb - May',
    majorMandis: ['Nizamabad (TS)', 'Sangli (MH)', 'Erode (TN)', 'Chamarajanagar (KA)'],
    storageAdvice: 'Boil, dry, and polish before storage. Keep in dry, dark warehouses.',
    moistureThreshold: 'Curcumin content > 3.5%, moisture strictly below 10%'
  },
  {
    id: 'ginger',
    name: 'Ginger',
    hindiName: 'अदरक',
    kannadaName: 'ಶುಂಠಿ',
    category: 'Spices & Plantation',
    icon: '🫚',
    varieties: ['Rio-de-Janeiro', 'Varada', 'Mahim', 'Nadia'],
    modalRange: '₹4,500 - ₹8,200 / q',
    peakSeason: 'Nov - Feb',
    majorMandis: ['Shimoga (KA)', 'Wayanad (KL)', 'Raipur (CG)', 'Kozhikode (KL)'],
    storageAdvice: 'Store in pit cellars with clean sand layering or cold storage at 12°C.',
    moistureThreshold: 'Plump rhizomes, free from soft rot and soil dirt'
  },
  {
    id: 'garlic',
    name: 'Garlic',
    hindiName: 'लहसुन',
    kannadaName: 'ಬೆಳ್ಳುಳ್ಳಿ',
    category: 'Alliums & Tubers',
    icon: '🧄',
    varieties: ['G-282', 'Yamuna Safed', 'Ooty-1', 'Bhima Omkar'],
    modalRange: '₹7,500 - ₹16,000 / q',
    peakSeason: 'Jan - Apr',
    majorMandis: ['Mandsaur (MP)', 'Neemuch (MP)', 'Kota (RJ)', 'Jamnagar (GJ)'],
    storageAdvice: 'Hang in braids in well-aerated sheds. Avoid humid airtight containers.',
    moistureThreshold: 'Compact papery cloves, moisture < 65% in fresh cured bulbs'
  },
  {
    id: 'cardamom',
    name: 'Cardamom (Small)',
    hindiName: 'छोटी इलायची',
    kannadaName: 'ಏಲಕ್ಕಿ',
    category: 'Spices & Plantation',
    icon: '🌱',
    varieties: ['Malabar', 'Mysore', 'Vazhukka'],
    modalRange: '₹1,40,000 - ₹2,10,000 / q',
    peakSeason: 'Aug - Jan',
    majorMandis: ['Bodinayakanur (TN)', 'Vandanmedu (KL)', 'Sakleshpur (KA)'],
    storageAdvice: 'Store cured green pods in black polythene lined airtight containers at 10-12% moisture.',
    moistureThreshold: 'Retention of vibrant parrot green color, capsule diameter > 7mm'
  },
  {
    id: 'dragonfruit',
    name: 'Dragonfruit (Pitaya)',
    hindiName: 'ड्रैगन फ्रूट / कमलम',
    kannadaName: 'ಡ್ರ್ಯಾಗನ್ ಹಣ್ಣು',
    category: 'Fruits & Exotic',
    icon: '🐉',
    varieties: ['Red Flesh (C规范)', 'White Flesh', 'Royal Red'],
    modalRange: '₹12,000 - ₹22,000 / q',
    peakSeason: 'Jun - Nov',
    majorMandis: ['Kolar (KA)', 'Surat (GJ)', 'Vashi APMC (MH)', 'Azadpur (DL)'],
    storageAdvice: 'Pre-cool to 10°C immediately after harvest. Shelf life 14 days at 7-10°C.',
    moistureThreshold: 'Glossy bracts, harvested at 80% color break for long transit'
  },
  {
    id: 'saffron',
    name: 'Saffron (Kesar)',
    hindiName: 'केसर',
    kannadaName: 'ಕೇಸರಿ',
    category: 'Spices & Plantation',
    icon: '🌸',
    varieties: ['Mongra', 'Lacha', 'Guchhi'],
    modalRange: '₹1,80,000 - ₹2,60,000 / kg',
    peakSeason: 'Oct - Nov',
    majorMandis: ['Pampore IIKSTC (JK)', 'Srinagar (JK)', 'Khari Baoli (DL)'],
    storageAdvice: 'Pack in hermetically sealed glass jars away from direct UV light.',
    moistureThreshold: 'Crocin color value > 220, moisture below 8%'
  },
  {
    id: 'chilli',
    name: 'Green Chilli',
    hindiName: 'हरी मिर्च',
    kannadaName: 'ಹಸಿ ಮೆಣಸಿನಕಾಯಿ',
    category: 'Solanaceous',
    icon: '🌶️',
    varieties: ['G-4', 'Sitara', 'Teja', 'Byadagi Green'],
    modalRange: '₹2,800 - ₹4,200 / q',
    peakSeason: 'Aug - Jan',
    majorMandis: ['Guntur (AP)', 'Ballari (KA)', 'Belagavi (KA)', 'Byadgi (KA)'],
    storageAdvice: 'Pack in aerated CFB corrugated boxes. Avoid direct sunlight during transit.',
    moistureThreshold: 'Deep green firm pod, stalk intact'
  },
  {
    id: 'cotton',
    name: 'Cotton',
    hindiName: 'कपास',
    kannadaName: 'ಹತ್ತಿ',
    category: 'Cash Crops',
    icon: '🌱',
    varieties: ['DCH-32 Extra Long Staple', 'Bunny BT', 'RCH-2'],
    modalRange: '₹6,400 - ₹7,800 / q',
    peakSeason: 'Oct - Feb',
    majorMandis: ['Adoni (AP)', 'Raichur (KA)', 'Davanagere (KA)', 'Jalgaon (MH)'],
    storageAdvice: 'Store in dry covered godowns on wooden pallets. Keep away from fuel fumes.',
    moistureThreshold: 'Moisture must remain strictly below 8-9% for top MSP bonus'
  },
  {
    id: 'soybean',
    name: 'Soybean',
    hindiName: 'सोयाबीन',
    kannadaName: 'ಸೋಯಾಬೀನ್',
    category: 'Oilseeds',
    icon: '🥜',
    varieties: ['JS-335', 'JS-9560', 'NRC-37'],
    modalRange: '₹4,100 - ₹4,850 / q',
    peakSeason: 'Sep - Nov',
    majorMandis: ['Indore (MP)', 'Latur (MH)', 'Akola (MH)', 'Belagavi (KA)'],
    storageAdvice: 'Avoid mechanical seed cracking during thrashing. Store below 10% moisture.',
    moistureThreshold: 'Foreign matter < 2%, oil content > 18%'
  },
  {
    id: 'maize',
    name: 'Maize',
    hindiName: 'मक्का',
    kannadaName: 'ಮೆಕ್ಕೆಜೋಳ',
    category: 'Grains & Pulses',
    icon: '🌽',
    varieties: ['Kargil 900M', 'Pioneer 30V92', 'DeKalb 9108'],
    modalRange: '₹1,950 - ₹2,350 / q',
    peakSeason: 'Oct - Jan (Kharif) & May - Jul (Rabi)',
    majorMandis: ['Davanagere (KA)', 'Ranebennur (KA)', 'Nizamabad (TS)', 'Chhindwara (MP)'],
    storageAdvice: 'Aflatoxin test required by poultry feed mills. Aerated grain bin storage.',
    moistureThreshold: 'Moisture < 14% to prevent Aspergillus fungus formation'
  },
  {
    id: 'wheat',
    name: 'Wheat',
    hindiName: 'गेहूं',
    kannadaName: 'ಗೋಧಿ',
    category: 'Grains & Pulses',
    icon: '🌾',
    varieties: ['Sharbati', 'Lokwan', 'HD-2967', 'PBW-343'],
    modalRange: '₹2,200 - ₹2,750 / q',
    peakSeason: 'Mar - May',
    majorMandis: ['Khanna (PB)', 'Sehore (MP)', 'Kotkapura (PB)', 'Belagavi (KA)'],
    storageAdvice: 'Fumigate against weevils using phosphine tables under certified guidance.',
    moistureThreshold: 'Grain moisture strictly below 12%, bold amber lustre'
  },
  {
    id: 'paddy',
    name: 'Paddy / Rice',
    hindiName: 'धान / चावल',
    kannadaName: 'ಭತ್ತ / ಅಕ್ಕಿ',
    category: 'Grains & Pulses',
    icon: '🍚',
    varieties: ['Sona Masoori (BPT-5204)', 'IR-64', 'Basmati 1121', 'JGL-1798'],
    modalRange: '₹2,100 - ₹2,850 / q',
    peakSeason: 'Nov - Jan (Kharif) & Apr - May (Rabi)',
    majorMandis: ['Sindhanur (KA)', 'Raichur (KA)', 'Karnal (HR)', 'Miryalaguda (TS)'],
    storageAdvice: 'Sun-dry on threshing floors before bagging. Keep in moisture-proof gunny sacks.',
    moistureThreshold: 'Head rice recovery > 58%, moisture 13-14%'
  },
  {
    id: 'groundnut',
    name: 'Groundnut',
    hindiName: 'मूंगफली',
    kannadaName: 'ಕಡಲೆಕಾಯಿ',
    category: 'Oilseeds',
    icon: '🥜',
    varieties: ['TMV-2', 'Kadiri-6', 'JL-24', 'TAG-24'],
    modalRange: '₹5,800 - ₹7,100 / q',
    peakSeason: 'Oct - Dec',
    majorMandis: ['Challakere (KA)', 'Bikaner (RJ)', 'Gondal (GJ)', 'Anantapur (AP)'],
    storageAdvice: 'Decorticate only prior to sale. Store pods in clean, dry jute sacks.',
    moistureThreshold: 'Pod moisture < 8%, shelling outturn > 70%'
  }
];

export const CropsPage: React.FC<CropsPageProps> = ({
  onSelectCropAndNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Solanaceous', 'Alliums & Tubers', 'Grains & Pulses', 'Cash Crops', 'Oilseeds', 'Spices & Plantation', 'Fruits & Exotic'];

  const filteredCrops = CROP_DATABASE.filter(crop => {
    const matchesCat = selectedCategory === 'All' || crop.category === selectedCategory;
    const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          crop.hindiName.includes(searchQuery) ||
                          crop.kannadaName.includes(searchQuery) ||
                          crop.varieties.some(v => v.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Crops Page Header */}
      <section className="bg-[#F4F8F5] border-b border-[#E2ECE3] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] bg-white px-3 py-1 rounded-full border border-[#CCE0D0]">
              Agricultural Produce Directory
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-[#123826] font-['Syne',sans-serif] tracking-tight">
              Commodity Portfolio & Agronomic Standards
            </h1>
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-['Outfit',sans-serif]">
              Explore official APMC grading metrics, moisture benchmarks, storage conditions, and prevailing auction price bands for 10 key Indian agricultural commodities.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E2ECE3] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#123826] text-white shadow-xs'
                    : 'bg-[#F2F8F4] text-stone-700 hover:bg-[#E2ECE3]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search crop, variety or language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs border border-[#E2ECE3] focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] outline-none"
            />
          </div>
        </div>
      </section>

      {/* Crops Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <div 
              key={crop.id}
              className="bg-white rounded-2xl border border-[#E2ECE3] hover:border-[#CCE0D0] hover:shadow-lg transition-all p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-xl bg-[#F2F8F4]">{crop.icon}</span>
                    <div>
                      <h3 className="text-xl font-black text-[#123826] font-['Syne',sans-serif]">
                        {crop.name}
                      </h3>
                      <p className="text-xs text-stone-600 font-medium">
                        {crop.hindiName} • {crop.kannadaName}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EBF5ED] text-[#2E7D32] border border-[#CCE0D0]">
                    {crop.category}
                  </span>
                </div>

                {/* Modal Rate & Season */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2ECE3] text-xs">
                  <div>
                    <span className="text-stone-600 text-[11px] block font-medium">Prevailing Band</span>
                    <span className="font-bold text-[#123826] font-mono">{crop.modalRange}</span>
                  </div>
                  <div>
                    <span className="text-stone-600 text-[11px] block font-medium">Harvest Window</span>
                    <span className="font-semibold text-stone-700">{crop.peakSeason}</span>
                  </div>
                </div>

                {/* Varieties */}
                <div>
                  <span className="text-stone-600 text-[11px] block font-bold uppercase tracking-wider mb-1">Key Varieties</span>
                  <div className="flex flex-wrap gap-1.5">
                    {crop.varieties.map((v, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-[#FAFBF9] border border-[#E2ECE3] text-stone-700">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Major Mandis */}
                <div>
                  <span className="text-stone-600 text-[11px] block font-bold uppercase tracking-wider mb-1">Major APMC Hubs</span>
                  <div className="flex flex-wrap gap-1.5">
                    {crop.majorMandis.map((m, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-[#F2F8F4] text-[#123826] font-medium">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Storage & Moisture */}
                <div className="bg-[#FAFBF9] p-3 rounded-xl border border-[#E2ECE3] text-[11px] space-y-1 text-stone-600">
                  <p><strong className="text-stone-700">Quality:</strong> {crop.moistureThreshold}</p>
                  <p><strong className="text-stone-700">Storage:</strong> {crop.storageAdvice}</p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectCropAndNavigate(crop.name)}
                className="w-full mt-4 py-2.5 rounded-xl bg-[#123826] hover:bg-[#2E7D32] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <span>Analyze {crop.name} in Terminal</span>
                <ChevronRight className="w-4 h-4 text-[#E8A238]" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CropsPage;
