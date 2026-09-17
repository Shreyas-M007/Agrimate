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
      className={`rounded-2xl transition-all p-5 flex flex-col justify-between cursor-pointer ${
        isSelected 
          ? 'glass-panel-elevated border-[#00FF87] shadow-[0_0_35px_rgba(0,255,135,0.22)] ring-1 ring-[#00FF87]' 
          : 'glass-panel border-white/10 hover:border-emerald-500/40 hover:shadow-[0_12px_36px_rgba(0,0,0,0.8)]'
      }`}
      onClick={() => onSelect(market)}
    >
      <div>
        {/* Market Title & Distance/Freshness Badges */}
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-1.5 font-['Syne',sans-serif]">
              <span>{market.market_name}</span>
              {isSelected && (
                <CheckCircle className="w-4 h-4 text-[#00FF87] shrink-0 inline drop-shadow-[0_0_8px_rgba(0,255,135,0.8)]" />
              )}
            </h3>
            <p className="text-xs font-mono text-stone-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>{market.district}, {market.state}</span>
              {market.distance_km !== null && (
                <span className="font-bold text-[#00FF87] bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30 ml-1">
                  ~{market.distance_km} km
                </span>
              )}
            </p>
          </div>

          {/* Freshness Badge */}
          <div className="inline-flex items-center gap-1 text-[11px] font-mono text-stone-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
            <Clock className="w-3 h-3 text-stone-500" />
            <span>{market.freshness}</span>
          </div>
        </div>

        {/* Variety & Grade info */}
        <div className="flex flex-wrap gap-1.5 mb-4 text-xs font-mono">
          <span className="bg-[#111713] text-stone-300 px-2 py-0.5 rounded border border-white/10">
            {market.variety}
          </span>
          <span className="bg-[#111713] text-stone-300 px-2 py-0.5 rounded border border-white/10">
            {market.grade}
          </span>
          <span className="bg-amber-950/50 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
            {t.arrivalQty}: {market.arrival_quantity} q
          </span>
        </div>

        {/* Primary Pricing Grid */}
        <div className="bg-[#0A0D0B] rounded-xl p-4 border border-white/10 mb-4 shadow-inner">
          {/* Modal Price Highlight */}
          <div className="text-center pb-3 border-b border-white/10">
            <div className="flex items-center justify-center gap-1 text-[11px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-0.5">
              <span>{t.modalPrice}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onExplainTerm('modal_price');
                }}
                className="text-stone-500 hover:text-[#00FF87] cursor-pointer transition-colors"
                title="Explain Modal Price"
                aria-label="Explain Modal Price"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-[#00FF87] tracking-tight font-mono tnum drop-shadow-[0_0_20px_rgba(0,255,135,0.25)]">
              ₹{market.modal_price.toLocaleString('en-IN')}
              <span className="text-xs font-semibold text-stone-400 font-sans ml-1">/quintal</span>
            </div>
          </div>

          {/* Min and Max Range */}
          <div className="grid grid-cols-2 gap-2 pt-3 text-center">
            <div className="border-r border-white/10 pr-2">
              <div className="flex items-center justify-center gap-1 text-[10px] font-mono font-bold text-stone-500 uppercase">
                <span>{t.minPrice}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExplainTerm('min_price');
                  }}
                  className="text-stone-600 hover:text-stone-300 cursor-pointer"
                  title="Explain Minimum Price"
                  aria-label="Explain Minimum Price"
                >
                  <HelpCircle className="w-3 h-3" />
                </button>
              </div>
              <div className="text-sm sm:text-base font-bold text-stone-300 font-mono tnum mt-0.5">
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
                  className="text-stone-600 hover:text-stone-300 cursor-pointer"
                  title="Explain Maximum Price"
                  aria-label="Explain Maximum Price"
                >
                  <HelpCircle className="w-3 h-3" />
                </button>
              </div>
              <div className="text-sm sm:text-base font-bold text-amber-400 font-mono tnum mt-0.5">
                ₹{market.max_price.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Arrival Volume Meter */}
        <div className="mb-4">
          <div className="flex justify-between text-[11px] font-mono text-stone-400 mb-1">
            <span>Arrival Volume Density</span>
            <span className="text-[#00FF87]">{Math.min(100, Math.round((market.arrival_quantity / 500) * 100))}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-[#00FF87] rounded-full"
              style={{ width: `${Math.min(100, Math.max(15, Math.round((market.arrival_quantity / 500) * 100)))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer / Action */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[10px] font-mono text-stone-400">
          <ShieldCheck className="w-3 h-3 text-[#00FF87]" />
          <span className="truncate max-w-[140px] sm:max-w-[170px]" title={market.source}>
            {market.source.split('/')[0]}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(market);
          }}
          className={`text-xs font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all cursor-pointer font-mono ${
            isSelected 
              ? 'bg-[#00FF87] text-[#060807] shadow-[0_0_15px_rgba(0,255,135,0.4)]' 
              : 'bg-white/5 hover:bg-emerald-500/20 text-stone-300 hover:text-[#00FF87] border border-white/10 hover:border-emerald-500/30'
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
