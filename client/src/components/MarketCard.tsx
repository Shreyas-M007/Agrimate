import React from 'react';
import type { MarketItem, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { MapPin, Clock, ShieldCheck, ArrowRight, HelpCircle, CheckCircle } from 'lucide-react';

interface MarketCardProps {
  market: MarketItem;
  language: Language;
  isSelected: boolean;
  onSelect: (market: MarketItem) => void;
  onExplainTerm: (term: string) => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({
  market,
  language,
  isSelected,
  onSelect,
  onExplainTerm
}) => {
  const t = TRANSLATIONS[language];

  return (
    <div 
      className={`verda-card rounded-2xl transition-all p-5 flex flex-col justify-between cursor-pointer ${
        isSelected 
          ? 'bg-[#FBFDF9] border-2 border-[#2E7D32] shadow-md ring-1 ring-[#2E7D32]' 
          : 'bg-white border-[#E2ECE3] hover:border-[#2E7D32] hover:shadow-md'
      }`}
      onClick={() => onSelect(market)}
    >
      <div>
        {/* Market Title & Distance/Freshness Badges */}
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#123826] tracking-tight flex items-center gap-1.5 font-['Syne',sans-serif]">
              <span>{market.market_name}</span>
              {isSelected && (
                <CheckCircle className="w-4 h-4 text-[#2E7D32] shrink-0 inline" />
              )}
            </h3>
            <p className="text-xs font-mono text-stone-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>{market.district}, {market.state}</span>
              {market.distance_km !== null && (
                <span className="font-bold text-[#123826] bg-[#EBF5ED] px-1.5 py-0.5 rounded border border-[#CCE0D0] ml-1">
                  ~{market.distance_km} km
                </span>
              )}
            </p>
          </div>

          {/* Freshness Badge */}
          <div className="inline-flex items-center gap-1 text-[11px] font-mono text-stone-600 bg-[#F4F8F5] px-2 py-0.5 rounded border border-[#E2ECE3]">
            <Clock className="w-3 h-3 text-stone-400" />
            <span>{market.freshness}</span>
          </div>
        </div>

        {/* Variety & Grade info */}
        <div className="flex flex-wrap gap-1.5 mb-4 text-xs font-mono">
          <span className="bg-[#F4F8F5] text-stone-700 px-2 py-0.5 rounded border border-[#CCE0D0]">
            {market.variety}
          </span>
          <span className="bg-[#F4F8F5] text-stone-700 px-2 py-0.5 rounded border border-[#CCE0D0]">
            {market.grade}
          </span>
          <span className="bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200 font-medium">
            {t.arrivalQty}: {market.arrival_quantity} q
          </span>
        </div>

        {/* Primary Pricing Grid */}
        <div className="bg-[#F7FAF8] rounded-xl p-4 border border-[#E2ECE3] mb-4 shadow-inner">
          {/* Modal Price Highlight */}
          <div className="text-center pb-3 border-b border-[#E2ECE3]">
            <div className="flex items-center justify-center gap-1 text-[11px] font-mono font-bold text-stone-500 uppercase tracking-wider mb-0.5">
              <span>{t.modalPrice}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onExplainTerm('modal_price');
                }}
                className="text-stone-400 hover:text-[#2E7D32] cursor-pointer transition-colors"
                title="Explain Modal Price"
                aria-label="Explain Modal Price"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-[#123826] tracking-tight font-mono tnum">
              ₹{market.modal_price.toLocaleString('en-IN')}
              <span className="text-xs font-semibold text-stone-500 font-sans ml-1">/quintal</span>
            </div>
          </div>

          {/* Min and Max Range */}
          <div className="grid grid-cols-2 gap-2 pt-3 text-center">
            <div className="border-r border-[#E2ECE3] pr-2">
              <div className="flex items-center justify-center gap-1 text-[10px] font-mono font-bold text-stone-500 uppercase">
                <span>{t.minPrice}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExplainTerm('min_price');
                  }}
                  className="text-stone-400 hover:text-stone-600 cursor-pointer"
                  title="Explain Minimum Price"
                  aria-label="Explain Minimum Price"
                >
                  <HelpCircle className="w-3 h-3" />
                </button>
              </div>
              <div className="text-sm sm:text-base font-bold text-stone-700 font-mono tnum mt-0.5">
                ₹{market.min_price.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="pl-2">
              <div className="flex items-center justify-center gap-1 text-[10px] font-mono font-bold text-stone-500 uppercase">
                <span>{t.maxPrice}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExplainTerm('max_price');
                  }}
                  className="text-stone-400 hover:text-stone-600 cursor-pointer"
                  title="Explain Maximum Price"
                  aria-label="Explain Maximum Price"
                >
                  <HelpCircle className="w-3 h-3" />
                </button>
              </div>
              <div className="text-sm sm:text-base font-bold text-[#B45309] font-mono tnum mt-0.5">
                ₹{market.max_price.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Arrival Volume Meter */}
        <div className="mb-4">
          <div className="flex justify-between text-[11px] font-mono text-stone-600 mb-1">
            <span>Arrival Volume Density</span>
            <span className="text-[#2E7D32] font-semibold">{Math.min(100, Math.round((market.arrival_quantity / 500) * 100))}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#E2ECE3] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] rounded-full"
              style={{ width: `${Math.min(100, Math.max(15, Math.round((market.arrival_quantity / 500) * 100)))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer / Action */}
      <div className="pt-3 border-t border-[#E2ECE3] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          {market.source?.toLowerCase().includes('fallback') || market.source?.toLowerCase().includes('dynamic') ? (
            <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1 font-semibold" title="Calculated regional APMC benchmark for newly searched produce">
              <span>⚡</span>
              <span>Estimated Benchmark</span>
            </span>
          ) : (
            <span className="text-emerald-850 bg-[#EBF5ED] px-2 py-0.5 rounded border border-[#CCE0D0] flex items-center gap-1 font-semibold" title={market.source}>
              <ShieldCheck className="w-3 h-3 text-[#2E7D32]" />
              <span>Official Agmarknet Record</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(market);
          }}
          className={`text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all cursor-pointer font-mono ${
            isSelected 
              ? 'bg-[#2E7D32] text-white shadow-sm' 
              : 'bg-[#F4F8F5] hover:bg-[#EBF5ED] text-[#123826] hover:text-[#2E7D32] border border-[#CCE0D0]'
          }`}
        >
          <span>
            {language === 'hi' 
              ? (isSelected ? 'चयनित मंडी' : 'मंडी विश्लेषण') 
              : (language === 'kn' 
                ? (isSelected ? 'ಆಯ್ಕೆಯಾಗಿದೆ' : 'ವಿಶ್ಲೇಷಣೆ') 
                : (isSelected ? 'Focused Mandi' : 'Analyze Mandi'))}
          </span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default MarketCard;
