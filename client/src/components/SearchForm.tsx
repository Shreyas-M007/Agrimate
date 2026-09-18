import React, { useState } from 'react';
import type { Language, CropUnit, Commodity } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Search, MapPin, Navigation, Scale, SlidersHorizontal, Sparkles } from 'lucide-react';

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

const CROP_TRANSLATIONS: Record<string, Record<Language, string>> = {
  Tomato: {
    en: "Tomato", hi: "टमाटर", kn: "ಟೊಮೆಟೊ", te: "టమోటా", ta: "தக்காளி",
    mr: "टोमॅटो", bn: "টমেটো", gu: "ટામેટા", pa: "ਟਮਾਟਰ", ml: "തക്കാളി"
  },
  Onion: {
    en: "Onion", hi: "प्याज", kn: "ಈರುಳ್ಳಿ", te: "ఉల్లిపాయ", ta: "வெங்காயம்",
    mr: "कांदा", bn: "পেঁয়াজ", gu: "ડુંગળી", pa: "ਪਿਆਜ਼", ml: "സവാള"
  },
  Potato: {
    en: "Potato", hi: "आलू", kn: "ಆಲೂಗಡ್ಡೆ", te: "బంగాళాదుంప", ta: "உருளைக்கிழங்கு",
    mr: "बटाटा", bn: "আলু", gu: "બટાટા", pa: "ਆਲੂ", ml: "ഉരുളക്കിഴങ്ങ്"
  },
  Groundnut: {
    en: "Groundnut", hi: "मूंगफली", kn: "ಕಡಲೆಕಾಯಿ", te: "వేరుశెనగ", ta: "வேர்க்கடலை",
    mr: "भुईमूग", bn: "চিনাবাদাম", gu: "મગફળી", pa: "ਮੂੰਗਫਲੀ", ml: "നിലക്കടല"
  },
  Maize: {
    en: "Maize", hi: "मक्का", kn: "ಮೆಕ್ಕೆಜೋಳ", te: "మొక్కజొన్న", ta: "மக்காச்சோளம்",
    mr: "मका", bn: "ভুট্টা", gu: "મકાઈ", pa: "ਮੱਕੀ", ml: "ചോളം"
  },
  Paddy: {
    en: "Paddy", hi: "धान", kn: "ಭತ್ತ", te: "వరి", ta: "நெல்",
    mr: "भात", bn: "ধান", gu: "ડાંગર", pa: "ਝੋਨਾ", ml: "നെല്ല്"
  },
  Wheat: {
    en: "Wheat", hi: "गेहूं", kn: "ಗೋಧಿ", te: "గోధుమలు", ta: "கோதுமை",
    mr: "गहू", bn: "গম", gu: "ઘઉં", pa: "ਕਣਕ", ml: "ഗോതമ്പ്"
  },
  Cotton: {
    en: "Cotton", hi: "कपास", kn: "ಹತ್ತಿ", te: "ప్రత్తి", ta: "பருத்தி",
    mr: "कापूस", bn: "তুলা", gu: "કપાસ", pa: "ਨਰਮਾ", ml: "പരുത്തി"
  },
  Chilli: {
    en: "Chilli", hi: "मिर्च", kn: "ಮೆಣಸಿನಕಾಯಿ", te: "మిరపకాయ", ta: "மிளகாய்",
    mr: "मिरची", bn: "লঙ্কা", gu: "મરચાં", pa: "ਮਿਰਚ", ml: "മുളക്"
  }
};

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
              <option value="Tomato" />
              <option value="Onion" />
              <option value="Potato" />
              <option value="Groundnut" />
              <option value="Soyabean" />
              <option value="Mustard" />
              <option value="Maize" />
              <option value="Paddy" />
              <option value="Wheat" />
              <option value="Cotton" />
              <option value="Chilli" />
              <option value="Apple" />
              <option value="Banana" />
              <option value="Mango" />
              <option value="Turmeric" />
              <option value="Garlic" />
              <option value="Ginger" />
              <option value="Cardamom" />
              <option value="Black Pepper" />
              <option value="Saffron" />
              <option value="Dragonfruit" />
              <option value="Vanilla" />
              <option value="Avocado" />
              <option value="Coffee" />
              <option value="Tea" />
              <option value="Coriander" />
              <option value="Cumin" />
              <option value="Cashew" />
            </datalist>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Quick Select Popular Crops:
            </span>
          </div>

          {/* Quick select pills */}
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 mb-3">
            {commodities.map((item) => {
              const isSelected = item.name.toLowerCase() === selectedCrop.toLowerCase();
              const localName = CROP_TRANSLATIONS[item.name]?.[language] || (item.localNames as any)?.[language] || item.name;

              return (
                <button
                  key={item.commodity_id}
                  type="button"
                  translate="no"
                  onClick={() => {
                    onCropChange(item.name);
                    if (item.varieties && item.varieties.length > 0) {
                      onVarietyChange(item.varieties[0]);
                    }
                  }}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all cursor-pointer notranslate ${
                    isSelected 
                      ? 'bg-[#EBF5ED] border-[#2E7D32] text-[#123826] font-bold shadow-xs scale-102 ring-1 ring-[#2E7D32]' 
                      : 'bg-white border-[#E2ECE3] text-stone-700 hover:border-[#2E7D32] hover:bg-[#F7FAF8]'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="text-2xl mb-1 filter drop-shadow-xs notranslate" translate="no">{item.icon}</span>
                  <span className="text-xs font-bold leading-tight truncate w-full text-center notranslate" translate="no">
                    {localName}
                  </span>
                  {language !== 'en' && (
                    <span className="text-[10px] text-stone-400 truncate w-full text-center font-mono notranslate" translate="no">
                      {item.name}
                    </span>
                  )}
                </button>
              );
            })}
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

        {/* Quick Presets */}
        <div className="pt-3 border-t border-[#E2ECE3] flex flex-wrap items-center gap-2 text-xs">
          <span className="text-stone-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#2E7D32]" />
            Quick Presets:
          </span>
          {[
            { icon: "🍅", label: "Tomato 500kg (Ballari)", crop: "Tomato", loc: "Ballari, Karnataka", qty: 500, u: "kg" as CropUnit },
            { icon: "🧅", label: "Onion 15q (Nashik)", crop: "Onion", loc: "Nashik, Maharashtra", qty: 15, u: "quintal" as CropUnit },
            { icon: "🥔", label: "Potato 20q (Agra)", crop: "Potato", loc: "Agra, Uttar Pradesh", qty: 20, u: "quintal" as CropUnit },
            { icon: "🌶️", label: "Chilli 5q (Guntur)", crop: "Chilli", loc: "Guntur, Andhra Pradesh", qty: 5, u: "quintal" as CropUnit },
            { icon: "🌾", label: "Paddy 30q (Karnal)", crop: "Paddy", loc: "Karnal, Haryana", qty: 30, u: "quintal" as CropUnit }
          ].map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onCropChange(item.crop);
                onLocationChange(item.loc);
                onQuantityChange(item.qty);
                onUnitChange(item.u);
                setTimeout(() => onSearch(), 50);
              }}
              className="bg-[#F4F8F5] hover:bg-[#EBF5ED] text-stone-700 hover:text-[#123826] px-3 py-1 rounded-xl border border-[#CCE0D0] transition-all cursor-pointer text-[11px] font-medium flex items-center gap-1.5"
            >
              <span className="notranslate" translate="no">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
