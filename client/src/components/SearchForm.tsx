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
        onLocationChange(`GPS (${coords.lat.toFixed(3)}, ${coords.lon.toFixed(3)})`);
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
    <div className="glass-panel rounded-2xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.8)] border border-emerald-500/20">
      {/* Visual Terminal Subheader */}
      <div className="bg-[#0D120E] border-b border-white/10 px-5 py-3.5 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-['Syne',sans-serif]">
          <SlidersHorizontal className="w-5 h-5 text-[#00FF87]" />
          <span>{t.searchTabForm}</span>
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-md">
            Official Agmarknet Rates
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
        {/* Commodity Selector Matrix */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-stone-400 mb-2.5">
            {t.cropLabel} <span className="text-red-400">*</span>
          </label>

          {/* Quick select pills */}
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 mb-3">
            {commodities.map((item) => {
              const isSelected = item.name.toLowerCase() === selectedCrop.toLowerCase();
              const localName = language === 'hi' ? item.localNames.hi : (language === 'kn' ? item.localNames.kn : item.name);

              return (
                <button
                  key={item.commodity_id}
                  type="button"
                  onClick={() => {
                    onCropChange(item.name);
                    if (item.varieties && item.varieties.length > 0) {
                      onVarietyChange(item.varieties[0]);
                    }
                  }}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-emerald-950/90 border-[#00FF87] text-[#00FF87] font-bold shadow-[0_0_20px_rgba(0,255,135,0.25)] scale-105' 
                      : 'bg-[#111713]/80 border-white/10 text-stone-300 hover:border-emerald-500/40 hover:bg-[#161E19]'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="text-2xl mb-1 filter drop-shadow">{item.icon}</span>
                  <span className="text-xs font-bold leading-tight truncate w-full text-center">
                    {localName}
                  </span>
                  {language !== 'en' && (
                    <span className="text-[10px] text-stone-500 truncate w-full text-center font-mono">
                      {item.name}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Variety Selector */}
          {activeCommodity && activeCommodity.varieties && activeCommodity.varieties.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-mono text-stone-400 bg-[#0A0D0B] p-2.5 rounded-xl border border-white/10">
              <span className="text-emerald-400 font-semibold">{t.varietyLabel}:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeCommodity.varieties.map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => onVarietyChange(v)}
                    className={`px-2.5 py-1 rounded-md text-xs transition-all cursor-pointer ${
                      variety === v 
                        ? 'bg-emerald-500/20 text-[#00FF87] border border-[#00FF87]/50 font-bold shadow-[0_0_10px_rgba(0,255,135,0.2)]' 
                        : 'bg-white/5 text-stone-400 hover:text-white border border-white/5 hover:border-white/20'
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
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-400 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-stone-300">
                <MapPin className="w-3.5 h-3.5 text-[#00FF87]" />
                {t.locationLabel}
              </span>
              <button
                type="button"
                onClick={handleGpsClick}
                disabled={locating}
                className="text-xs text-emerald-300 hover:text-[#00FF87] font-semibold flex items-center gap-1 bg-emerald-950/60 hover:bg-emerald-900/60 px-2 py-0.5 rounded-md border border-emerald-500/30 transition-all cursor-pointer"
                aria-label="Use device GPS location"
              >
                <Navigation className={`w-3 h-3 ${locating ? 'animate-spin text-[#00FF87]' : ''}`} />
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
              className="w-full px-4 py-3 text-sm bg-[#0A0D0B] border border-white/15 rounded-xl text-white placeholder:text-stone-600 focus:outline-none focus:border-[#00FF87] focus:ring-1 focus:ring-[#00FF87] transition-all font-medium"
            />
            <p className="text-[11px] font-mono text-stone-500 mt-1">
              Hubs: Ballari, Kolar, Bangalore, Belagavi, Mysuru, Nashik, Pune, Guntur, Agra, Khanna...
            </p>
          </div>

          {/* Quantity Input with Unit Selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-400 mb-1.5 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#00FF87]" />
              <span className="text-stone-300">{t.quantityLabel}</span>
            </label>
            <div className="flex rounded-xl overflow-hidden border border-white/15 bg-[#0A0D0B] focus-within:border-[#00FF87] focus-within:ring-1 focus-within:ring-[#00FF87] transition-all">
              <input
                type="number"
                min="0.1"
                step="any"
                value={quantity}
                onChange={(e) => onQuantityChange(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-4 py-3 text-sm bg-transparent text-white font-mono font-bold focus:outline-none"
                placeholder="500"
              />
              <div className="flex bg-[#111713] border-l border-white/10 shrink-0">
                {(['kg', 'quintal', 'tonne'] as CropUnit[]).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => onUnitChange(u)}
                    className={`px-3 py-2 text-xs font-mono font-semibold transition-all cursor-pointer ${
                      unit === u 
                        ? 'bg-emerald-500/20 text-[#00FF87] border-b-2 border-[#00FF87]' 
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {u === 'kg' ? t.unitKg : (u === 'quintal' ? t.unitQuintal : t.unitTonne)}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Normalized Quantity Preview (PRD Sec 7.3) */}
            <div className="mt-2 text-xs bg-[#0F1411] border border-white/10 text-stone-300 px-3 py-1.5 rounded-lg flex items-center justify-between font-mono">
              <span className="text-stone-400">{t.normalizedPreview}:</span>
              <span>
                {numQty > 0 ? (
                  <>
                    <strong className="text-[#00FF87]">{normalizedInQuintals} Quintals</strong> <span className="text-stone-500">({normalizedInKg} kg / {normalizedInTonnes} t)</span>
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
            className="w-full bg-gradient-to-r from-[#00FF87] to-[#059669] hover:from-[#10B981] hover:to-[#047857] text-[#060807] font-black text-base py-3.5 px-6 rounded-xl shadow-[0_0_30px_rgba(0,255,135,0.3)] hover:shadow-[0_0_40px_rgba(0,255,135,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-['Syne',sans-serif] tracking-wide"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-[#060807] border-t-transparent rounded-full animate-spin" />
                <span>{t.searching}</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>{t.searchButton}</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Presets */}
        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-mono text-stone-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#00FF87]" />
            Presets:
          </span>
          {[
            { label: "🍅 Tomato 500kg (Ballari)", crop: "Tomato", loc: "Ballari, Karnataka", qty: 500, u: "kg" as CropUnit },
            { label: "🧅 Onion 15q (Nashik)", crop: "Onion", loc: "Nashik, Maharashtra", qty: 15, u: "quintal" as CropUnit },
            { label: "🥔 Potato 20q (Agra)", crop: "Potato", loc: "Agra, Uttar Pradesh", qty: 20, u: "quintal" as CropUnit },
            { label: "🌶️ Chilli 5q (Guntur)", crop: "Chilli", loc: "Guntur, Andhra Pradesh", qty: 5, u: "quintal" as CropUnit },
            { label: "🌾 Paddy 30q (Karnal)", crop: "Paddy", loc: "Karnal, Haryana", qty: 30, u: "quintal" as CropUnit }
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
              className="bg-[#111713] hover:bg-emerald-950/60 text-stone-300 hover:text-[#00FF87] font-mono px-2.5 py-1 rounded-lg border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer text-[11px]"
            >
              {item.label}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
