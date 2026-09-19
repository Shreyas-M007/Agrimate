import React from 'react';
import type { MarketItem, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { MapPin, Clock, ShieldCheck, TrendingUp, TrendingDown, HelpCircle, CheckCircle, Zap, Activity } from 'lucide-react';

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
  const arrivalPct = Math.min(100, Math.max(8, Math.round((market.arrival_quantity / 500) * 100)));
  const spread = market.max_price - market.min_price;
  const spreadPct = market.modal_price > 0 ? Math.round((spread / market.modal_price) * 100) : 0;
  const isEstimated = market.source?.toLowerCase().includes('fallback') || market.source?.toLowerCase().includes('dynamic');

  return (
    <div
      onClick={() => onSelect(market)}
      className={`
        rounded-2xl border cursor-pointer transition-all duration-200 overflow-hidden flex flex-col
        ${isSelected
          ? 'border-[#2E7D32] shadow-lg ring-1 ring-[#2E7D32]/30 bg-white'
          : 'border-[#E6E1D7] hover:border-[#2E7D32]/50 hover:shadow-md bg-white'
        }
      `}
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${isSelected ? 'bg-gradient-to-r from-[#2E7D32] to-[#4CAF50]' : 'bg-gradient-to-r from-[#E6E1D7] to-[#D6DFD4]'}`} />

      <div className="p-5 flex flex-col gap-4 flex-1">

        {/* Header: Name + freshness */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              {isSelected && <CheckCircle className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />}
              <h3 className="text-base font-bold text-[#153424] truncate font-['Syne',sans-serif]">
                {market.market_name}
              </h3>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-stone-500 font-mono">
              <MapPin className="w-3 h-3 shrink-0 text-stone-400" />
              <span className="truncate">{market.district}, {market.state}</span>
              {market.distance_km !== null && (
                <span className="ml-1 text-[#2E7D32] font-bold shrink-0 bg-[#EAEFE9] px-1.5 py-0.5 rounded text-[10px]">
                  ~{market.distance_km}km
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-mono text-stone-500 bg-[#FAF8F5] px-2 py-1 rounded-lg border border-[#E6E1D7] shrink-0">
            <Clock className="w-2.5 h-2.5 text-stone-400" />
            <span>{market.freshness}</span>
          </div>
        </div>

        {/* Modal Price — Hero block */}
        <div className={`rounded-xl p-4 relative overflow-hidden ${isSelected ? 'bg-[#F0F7F1]' : 'bg-[#FAF8F5]'} border border-[#E6E1D7]`}>
          <div className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500 mb-1.5">
            <span>{t.modalPrice}</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onExplainTerm('modal_price'); }}
              className="text-stone-400 hover:text-[#2E7D32] cursor-pointer transition-colors"
              aria-label="Explain Modal Price"
            >
              <HelpCircle className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-[#153424] font-mono tracking-tight">
              ₹{market.modal_price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-stone-500 font-mono mb-1">/quintal</span>
          </div>
          {/* Decorative icon */}
          <Activity className="absolute right-3 bottom-3 w-10 h-10 text-[#153424]/5" />
        </div>

        {/* Min / Max — two clean stat tiles */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl p-3 bg-sky-50 border border-sky-100">
            <div className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider text-sky-600 mb-1">
              <TrendingDown className="w-2.5 h-2.5" />
              <span>{t.minPrice}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onExplainTerm('min_price'); }}
                className="ml-auto text-sky-300 hover:text-sky-600 cursor-pointer"
                aria-label="Explain Min Price"
              >
                <HelpCircle className="w-2.5 h-2.5" />
              </button>
            </div>
            <div className="text-sm font-bold text-sky-700 font-mono">
              ₹{market.min_price.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="rounded-xl p-3 bg-amber-50 border border-amber-100">
            <div className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider text-amber-700 mb-1">
              <TrendingUp className="w-2.5 h-2.5" />
              <span>{t.maxPrice}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onExplainTerm('max_price'); }}
                className="ml-auto text-amber-300 hover:text-amber-600 cursor-pointer"
                aria-label="Explain Max Price"
              >
                <HelpCircle className="w-2.5 h-2.5" />
              </button>
            </div>
            <div className="text-sm font-bold text-amber-700 font-mono">
              ₹{market.max_price.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] font-mono text-stone-600 bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#E6E1D7]">
            {market.variety}
          </span>
          <span className="text-[10px] font-mono text-stone-600 bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#E6E1D7]">
            {market.grade}
          </span>
          <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            {t.arrivalQty}: {market.arrival_quantity}q
          </span>
          {spreadPct > 0 && (
            <span className="text-[10px] font-mono text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-200">
              Spread {spreadPct}%
            </span>
          )}
        </div>

        {/* Arrival volume bar */}
        <div>
          <div className="flex justify-between text-[10px] font-mono text-stone-500 mb-1.5">
            <span>Arrival Volume</span>
            <span className="text-[#2E7D32] font-semibold">{arrivalPct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#E6E1D7] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] transition-all duration-700"
              style={{ width: `${arrivalPct}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#E6E1D7] mt-auto">
          {isEstimated ? (
            <div className="flex items-center gap-1 text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
              <Zap className="w-2.5 h-2.5" />
              <span>Estimated</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-800 bg-[#EAEFE9] px-2 py-1 rounded-lg border border-[#D6DFD4]">
              <ShieldCheck className="w-2.5 h-2.5 text-[#2E7D32]" />
              <span>Official Agmarknet</span>
            </div>
          )}

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSelect(market); }}
            className={`text-[10px] font-bold font-mono px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              isSelected
                ? 'bg-[#2E7D32] text-white shadow-sm'
                : 'bg-[#FAF8F5] hover:bg-[#153424] hover:text-white text-[#153424] border border-[#E6E1D7]'
            }`}
          >
            {isSelected
              ? (language === 'hi' ? '✓ चयनित' : language === 'kn' ? '✓ ಆಯ್ಕೆ' : '✓ Selected')
              : (language === 'hi' ? 'विश्लेषण →' : language === 'kn' ? 'ವಿಶ್ಲೇಷಣೆ →' : 'Analyze →')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketCard;
