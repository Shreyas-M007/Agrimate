import React, { useState } from 'react';
import type { Language, CropUnit, Commodity } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Search, MapPin, Navigation, Scale, SlidersHorizontal } from 'lucide-react';

interface SearchFormProps {
  language: Language;
  commodities: Commodity[];
  selectedCrop: string;
  onCropChange: (crop: string) => void;
  variety: string;
  onVarietyChange: (variety: string) => void;
  location: string;
  onLocationChange: (loc: string) => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  unit: CropUnit;
  onUnitChange: (unit: CropUnit) => void;
  onSearch: (gpsCoords?: { lat: number; lon: number }) => void;
  isLoading: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  language,
  commodities,
  selectedCrop,
  onCropChange,
  variety,
  onVarietyChange,
  location,
  onLocationChange,
  quantity,
  onQuantityChange,
  unit,
  onUnitChange,
  onSearch,
  isLoading
}) => {
  const t = TRANSLATIONS[language];
  const [gpsActive, setGpsActive] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lon: number } | undefined>();
  const [locating, setLocating] = useState(false);

  const activeCommodity = commodities.find(c => c.name.toLowerCase() === selectedCrop.toLowerCase());

  // Quantity normalization math for preview (PRD Sec 7.3)
  const numQty = Number(quantity) || 0;
  let normalizedInQuintals = 0;
  let normalizedInKg = 0;
  let normalizedInTonnes = 0;

  if (unit === 'kg') {
    normalizedInQuintals = numQty / 100;
    normalizedInKg = numQty;
    normalizedInTonnes = numQty / 1000;
  } else if (unit === 'tonne') {
    normalizedInQuintals = numQty * 10;
    normalizedInKg = numQty * 1000;
    normalizedInTonnes = numQty;
  } else {
    normalizedInQuintals = numQty;
    normalizedInKg = numQty * 100;
    normalizedInTonnes = numQty / 10;
  }

const KNOWN_DISTRICTS = [
  { name: 'Bengaluru, Karnataka', lat: 12.9716, lon: 77.5946 },
  { name: 'Ballari, Karnataka', lat: 15.1394, lon: 76.9214 },
  { name: 'Kolar, Karnataka', lat: 13.1367, lon: 78.1291 },
  { name: 'Chikkaballapur, Karnataka', lat: 13.4355, lon: 77.7315 },
  { name: 'Mysuru, Karnataka', lat: 12.2958, lon: 76.6394 },
  { name: 'Belagavi, Karnataka', lat: 15.8497, lon: 74.4977 },
  { name: 'Davanagere, Karnataka', lat: 14.4644, lon: 75.9218 },
  { name: 'Hubballi, Karnataka', lat: 15.3647, lon: 75.1240 },
  { name: 'Hassan, Karnataka', lat: 13.0033, lon: 76.1004 },
  { name: 'Shivamogga, Karnataka', lat: 13.9299, lon: 75.5681 },
  { name: 'Pune, Maharashtra', lat: 18.5204, lon: 73.8567 },
  { name: 'Nashik, Maharashtra', lat: 19.9975, lon: 73.7898 },
  { name: 'Guntur, Andhra Pradesh', lat: 16.3067, lon: 80.4365 },
  { name: 'Kurnool, Andhra Pradesh', lat: 15.8281, lon: 78.0373 },
  { name: 'Hyderabad, Telangana', lat: 17.3850, lon: 78.4867 },
  { name: 'Azadpur, Delhi', lat: 28.7041, lon: 77.1025 },
  { name: 'Ludhiana, Punjab', lat: 30.9010, lon: 75.8573 },
  { name: 'Agra, Uttar Pradesh', lat: 27.1767, lon: 78.0081 },
  { name: 'Indore, Madhya Pradesh', lat: 22.7196, lon: 75.8577 }
];

function getNearestDistrictName(lat: number, lon: number): string {
  let closest = KNOWN_DISTRICTS[0].name;
  let minDist = Infinity;
  for (const d of KNOWN_DISTRICTS) {
    const dist = Math.hypot(lat - d.lat, lon - d.lon);
    if (dist < minDist) {
      minDist = dist;
      closest = d.name;
    }
  }
  return closest;
}

  const handleGpsClick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        setGpsCoords(coords);
        setGpsActive(true);
        setLocating(false);
        // Map raw GPS coordinates to the human-readable district/city name
        const resolvedPlace = getNearestDistrictName(coords.lat, coords.lon);
        onLocationChange(resolvedPlace);
      },
      (error) => {
        setLocating(false);
        console.warn("GPS lookup denied or unavailable", error);
        onLocationChange("Ballari, Karnataka");
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(gpsCoords);
  };

  return (
    <div className="verda-card rounded-3xl overflow-hidden border border-[#E2ECE3] shadow-sm">
      {/* Visual Subheader */}
      <div className="bg-[#F4F8F5] border-b border-[#E2ECE3] px-6 py-4 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-[#123826] flex items-center gap-2 font-['Syne',sans-serif]">
          <SlidersHorizontal className="w-5 h-5 text-[#2E7D32]" />
          <span>{t.searchTabForm}</span>
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#123826] bg-[#EBF5ED] border border-[#CCE0D0] px-3 py-1 rounded-full">
            Official Agmarknet Rates • Pan-India Search
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {/* Commodity Selector Matrix */}
        <div>
          <label htmlFor="cropInput" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
            {t.cropLabel} <span className="text-red-500">*</span>
          </label>

          {/* Pan-India Universal Crop Input Bar */}
          <div className="relative mb-3">
            <div className="flex items-center rounded-2xl overflow-hidden border border-[#CCE0D0] bg-white focus-within:border-[#2E7D32] focus-within:ring-2 focus-within:ring-[#2E7D32]/20 shadow-xs transition-all">
              <div className="pl-4 pr-2 text-[#2E7D32]">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="cropInput"
                list="panIndiaCropsList"
                value={selectedCrop}
                onChange={(e) => onCropChange(e.target.value)}
                placeholder="Type or select any crop e.g. Tomato, Ginger, Garlic, Cardamom, Mango, Dragonfruit..."
                className="w-full py-3 pr-3 text-sm bg-transparent text-stone-900 font-bold focus:outline-none placeholder:text-stone-400 placeholder:font-normal"
              />
              {selectedCrop && (
                <button
                  type="button"
                  onClick={() => onCropChange('')}
                  className="mr-3 text-xs text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-full cursor-pointer transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <datalist id="panIndiaCropsList">
              {/* Cereals & Millets */}
              <option value="Rice" /><option value="Paddy" /><option value="Wheat" />
              <option value="Maize" /><option value="Sorghum" /><option value="Jowar" />
              <option value="Bajra" /><option value="Ragi" /><option value="Finger Millet" />
              <option value="Barley" /><option value="Oats" /><option value="Small Millet" />
              <option value="Kodo Millet" /><option value="Foxtail Millet" /><option value="Proso Millet" />
              <option value="Barnyard Millet" />
              {/* Pulses */}
              <option value="Tur" /><option value="Arhar" /><option value="Pigeon Pea" />
              <option value="Gram" /><option value="Chickpea" /><option value="Bengal Gram" />
              <option value="Moong" /><option value="Green Gram" /><option value="Urad" />
              <option value="Black Gram" /><option value="Lentil" /><option value="Masoor" />
              <option value="Peas" /><option value="Rajma" /><option value="Kidney Beans" />
              <option value="Moth Bean" /><option value="Horse Gram" /><option value="Cowpea" />
              <option value="Cluster Bean" /><option value="Guar" />
              {/* Oilseeds */}
              <option value="Groundnut" /><option value="Soybean" /><option value="Mustard" />
              <option value="Rapeseed" /><option value="Sunflower" /><option value="Sesame" />
              <option value="Til" /><option value="Linseed" /><option value="Castor" />
              <option value="Safflower" /><option value="Nigerseed" /><option value="Coconut" />
              <option value="Copra" />
              {/* Cash Crops */}
              <option value="Cotton" /><option value="Sugarcane" /><option value="Jute" />
              <option value="Tobacco" /><option value="Rubber" /><option value="Tea" />
              <option value="Coffee" /><option value="Cardamom" /><option value="Arecanut" />
              {/* Vegetables */}
              <option value="Tomato" /><option value="Onion" /><option value="Potato" />
              <option value="Brinjal" /><option value="Chilli" /><option value="Capsicum" />
              <option value="Cabbage" /><option value="Cauliflower" /><option value="Bitter Gourd" />
              <option value="Bottle Gourd" /><option value="Ridge Gourd" /><option value="Snake Gourd" />
              <option value="Pumpkin" /><option value="Ash Gourd" /><option value="Cucumber" />
              <option value="Okra" /><option value="Bhindi" /><option value="Lady Finger" />
              <option value="Spinach" /><option value="Fenugreek" /><option value="Methi" />
              <option value="Coriander" /><option value="Dill" /><option value="Curry Leaves" />
              <option value="Amaranth" /><option value="Drumstick" /><option value="Moringa" />
              <option value="French Beans" /><option value="Cluster Beans" /><option value="Guar Beans" />
              <option value="Flat Beans" /><option value="Sword Beans" />
              <option value="Carrot" /><option value="Radish" /><option value="Turnip" />
              <option value="Beetroot" /><option value="Sweet Potato" /><option value="Yam" />
              <option value="Colocasia" /><option value="Arbi" /><option value="Garlic" />
              <option value="Ginger" /><option value="Turmeric" /><option value="Mushroom" />
              <option value="Green Peas" /><option value="Elephant Foot Yam" />
              <option value="Ash Plantain" /><option value="Raw Banana" />
              {/* Fruits */}
              <option value="Mango" /><option value="Banana" /><option value="Apple" />
              <option value="Grapes" /><option value="Orange" /><option value="Mosambi" />
              <option value="Lemon" /><option value="Lime" /><option value="Guava" />
              <option value="Papaya" /><option value="Pomegranate" /><option value="Watermelon" />
              <option value="Muskmelon" /><option value="Pineapple" /><option value="Sapota" />
              <option value="Chikoo" /><option value="Custard Apple" /><option value="Jackfruit" />
              <option value="Litchi" /><option value="Pear" /><option value="Plum" />
              <option value="Peach" /><option value="Apricot" /><option value="Cherry" />
              <option value="Strawberry" /><option value="Amla" /><option value="Ber" />
              <option value="Date Palm" /><option value="Avocado" /><option value="Dragon Fruit" />
              <option value="Kiwi" /><option value="Fig" /><option value="Tamarind" />
              {/* Spices */}
              <option value="Cumin" /><option value="Jeera" /><option value="Fennel" />
              <option value="Saunf" /><option value="Coriander Seeds" /><option value="Pepper" />
              <option value="Black Pepper" /><option value="Cloves" /><option value="Nutmeg" />
              <option value="Mace" /><option value="Cinnamon" /><option value="Star Anise" />
              <option value="Bay Leaf" /><option value="Ajwain" /><option value="Carom Seeds" />
              <option value="Fenugreek Seeds" /><option value="Asafoetida" /><option value="Hing" />
              <option value="Vanilla" /><option value="Saffron" />
              {/* Flowers */}
              <option value="Marigold" /><option value="Rose" /><option value="Jasmine" />
              <option value="Lotus" /><option value="Chrysanthemum" /><option value="Tuberose" />
              {/* Plantation */}
              <option value="Cashew" /><option value="Banana Flower" /><option value="Bamboo" />
              <option value="Oil Palm" />
            </datalist>
          </div>


          {/* Variety Selector */}
          {activeCommodity && activeCommodity.varieties && activeCommodity.varieties.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-mono text-stone-600 bg-[#F4F8F5] p-3 rounded-2xl border border-[#CCE0D0]">
              <span className="text-[#123826] font-bold">{t.varietyLabel}:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeCommodity.varieties.map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => onVarietyChange(v)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      variety === v 
                        ? 'bg-[#123826] text-white shadow-xs font-bold' 
                        : 'bg-white text-stone-700 hover:text-stone-900 border border-[#CCE0D0]'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Location & Quantity Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Location Input */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-stone-600 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-stone-800">
                <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                {t.locationLabel}
              </span>
              <button
                type="button"
                onClick={handleGpsClick}
                disabled={locating}
                className="text-xs text-[#123826] hover:text-[#2E7D32] font-semibold flex items-center gap-1 bg-[#EBF5ED] hover:bg-[#D5E7D8] px-2.5 py-0.5 rounded-full border border-[#CCE0D0] transition-all cursor-pointer shadow-xs"
                aria-label="Use device GPS location"
              >
                <Navigation className={`w-3 h-3 ${locating ? 'animate-spin text-[#2E7D32]' : 'text-[#2E7D32]'}`} />
                <span>{locating ? 'Locating...' : (gpsActive ? t.gpsActive : t.useGps)}</span>
              </button>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => {
                onLocationChange(e.target.value);
                setGpsActive(false);
              }}
              placeholder={t.locationPlaceholder}
              className="w-full px-4 py-3 text-sm bg-white border border-[#CCE0D0] rounded-2xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] transition-all font-medium shadow-xs"
            />
            <p className="text-[11px] text-stone-500 mt-1">
              Popular APMCs: Ballari, Kolar, Bangalore, Belagavi, Mysuru, Nashik, Pune, Guntur, Agra...
            </p>
          </div>

          {/* Quantity Input with Unit Selector */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-stone-600 mb-1.5 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span className="text-stone-800">{t.quantityLabel}</span>
            </label>
            <div className="flex rounded-2xl overflow-hidden border border-[#CCE0D0] bg-white focus-within:border-[#2E7D32] focus-within:ring-1 focus-within:ring-[#2E7D32] transition-all shadow-xs">
              <input
                type="number"
                min="0.1"
                step="any"
                value={quantity}
                onChange={(e) => onQuantityChange(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-4 py-3 text-sm bg-transparent text-stone-900 font-mono font-bold focus:outline-none"
                placeholder="500"
              />
              <div className="flex bg-[#F4F8F5] border-l border-[#CCE0D0] shrink-0 p-1 gap-1">
                {(['kg', 'quintal', 'tonne'] as CropUnit[]).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => onUnitChange(u)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                      unit === u 
                        ? 'bg-[#123826] text-white shadow-xs font-bold' 
                        : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                    }`}
                  >
                    {u === 'kg' ? t.unitKg : (u === 'quintal' ? t.unitQuintal : t.unitTonne)}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Normalized Quantity Preview */}
            <div className="mt-2 text-xs bg-[#F4F8F5] border border-[#CCE0D0] text-stone-700 px-3.5 py-2 rounded-xl flex items-center justify-between font-mono">
              <span className="text-stone-500">{t.normalizedPreview}:</span>
              <span>
                {numQty > 0 ? (
                  <>
                    <strong className="text-[#123826] font-bold">{normalizedInQuintals} Quintals</strong> <span className="text-stone-500">({normalizedInKg} kg / {normalizedInTonnes} t)</span>
                  </>
                ) : '0 Quintals'}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading || !selectedCrop}
            className="w-full bg-[#123826] hover:bg-[#1B4D35] text-white font-black text-base py-3.5 px-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-['Syne',sans-serif] tracking-wide"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t.searching}</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5 text-[#A5D6A7]" />
                <span>{t.searchButton}</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default SearchForm;
