import React, { useState } from 'react';
import type { Language, CropUnit, Commodity } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Search, MapPin, Navigation, Scale } from 'lucide-react';

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

  // Quantity normalization math for preview
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
    <div className="bg-white rounded-2xl shadow-md border-2 border-stone-200 overflow-hidden">
      {/* Visual Header Banner */}
      <div className="bg-stone-100 border-b border-stone-200 px-5 py-3.5 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-stone-800 flex items-center gap-2">
          <Search className="w-5 h-5 text-emerald-700" />
          <span>{t.searchTabForm}</span>
        </h2>
        <span className="text-xs font-semibold text-stone-600 bg-stone-200 px-2.5 py-1 rounded-md">
          APMC Agmarknet Source
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
        {/* Quick Crop Chips */}
        <div>
          <label className="block text-sm font-bold text-stone-800 mb-2.5">
            {t.cropLabel} <span className="text-red-600">*</span>
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
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-sm scale-105' 
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-400 hover:bg-white'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span className="text-2xl mb-1">{item.icon}</span>
                  <span className="text-xs font-bold leading-tight truncate w-full text-center">
                    {localName}
                  </span>
                  {language !== 'en' && (
                    <span className="text-[10px] text-stone-600 truncate w-full text-center">
                      {item.name}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Variety Selector if applicable */}
          {activeCommodity && activeCommodity.varieties && activeCommodity.varieties.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-medium text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
              <span className="font-bold text-stone-700">{t.varietyLabel}:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeCommodity.varieties.map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => onVarietyChange(v)}
                    className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                      variety === v 
                        ? 'bg-emerald-700 text-white font-bold' 
                        : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
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
            <label className="block text-sm font-bold text-stone-800 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                {t.locationLabel}
              </span>
              <button
                type="button"
                onClick={handleGpsClick}
                disabled={locating}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded border border-emerald-300 transition-colors cursor-pointer"
                aria-label="Use device GPS location"
              >
                <Navigation className={`w-3 h-3 ${locating ? 'animate-spin' : ''}`} />
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
              className="w-full px-4 py-3 text-base border-2 border-stone-300 rounded-xl bg-white text-stone-900 focus-ring placeholder:text-stone-600 font-medium"
            />
            <p className="text-[11px] text-stone-600 mt-1">
              Supports: Ballari, Kolar, Bangalore, Belagavi, Mysuru, Nashik, Pune, Guntur, Agra, Khanna, etc.
            </p>
          </div>

          {/* Quantity Input with Unit Selector */}
          <div>
            <label className="block text-sm font-bold text-stone-800 mb-1.5 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-700" />
              <span>{t.quantityLabel}</span>
            </label>
            <div className="flex rounded-xl overflow-hidden border-2 border-stone-300 focus-within:ring-4 focus-within:ring-emerald-600/40 focus-within:border-emerald-700">
              <input
                type="number"
                min="0.1"
                step="any"
                value={quantity}
                onChange={(e) => onQuantityChange(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-4 py-3 text-base bg-white text-stone-900 focus:outline-none font-bold"
                placeholder="500"
              />
              <div className="flex bg-stone-100 border-l-2 border-stone-300 shrink-0">
                {(['kg', 'quintal', 'tonne'] as CropUnit[]).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => onUnitChange(u)}
                    className={`px-3 py-2 text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                      unit === u 
                        ? 'bg-emerald-700 text-white shadow-inner' 
                        : 'text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {u === 'kg' ? t.unitKg : (u === 'quintal' ? t.unitQuintal : t.unitTonne)}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Normalized Quantity Preview (PRD Sec 7.3) */}
            <div className="mt-2 text-xs bg-amber-50 border border-amber-200 text-amber-950 px-3 py-1.5 rounded-lg flex items-center justify-between font-medium">
              <span>{t.normalizedPreview}:</span>
              <span className="font-mono font-bold">
                {numQty > 0 ? (
                  <>
                    <strong className="text-emerald-900">{normalizedInQuintals} Quintals</strong> ({normalizedInKg} kg / {normalizedInTonnes} tonnes)
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
            className="w-full bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-black text-lg py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-b-4 border-emerald-900"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
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

        {/* Quick Pre-sets / Scenario Chips */}
        <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-stone-500">Quick Queries:</span>
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
              className="bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-900 font-semibold px-2.5 py-1 rounded-lg border border-stone-200 transition-colors cursor-pointer text-[11px]"
            >
              {item.label}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
};
