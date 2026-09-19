import React from 'react';
import type { MarketItem, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { MapPin, Clock, ShieldCheck, HelpCircle, CheckCircle, Zap } from 'lucide-react';

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
  const arrivalPct = Math.min(100, Math.max(4, Math.round((market.arrival_quantity / 500) * 100)));
  const isEstimated = market.source?.toLowerCase().includes('fallback') || market.source?.toLowerCase().includes('dynamic');

  return (
    <div
      onClick={() => onSelect(market)}
      className={`
        group relative glass-card rounded-2xl cursor-pointer transition-all duration-200 flex flex-col
        ${isSelected
          ? 'border-[#2E7D32] ring-2 ring-[#2E7D32]/40'
          : 'border border-white/80 hover:border-[#2E7D32]/40'
        }
      `}
      style={{
        boxShadow: isSelected
          ? '0 0 0 2px #2E7D32, 0 8px 24px rgba(46,125,50,0.12)'
          : '0 4px 20px rgba(21,52,36,0.04), inset 0 1px 1px rgba(255,255,255,0.95)',
      }}
    >
      {/* Top green bar — appears on select */}
      <div
        className={`h-[3px] rounded-t-2xl transition-all duration-200 ${isSelected ? 'bg-[#2E7D32]' : 'bg-transparent group-hover:bg-[#2E7D32]/20'}`}
      />

      <div className="p-5 flex flex-col gap-4 flex-1">

        {/* ── Row 1: Name + meta ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              {isSelected && (
                <CheckCircle className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
              )}
              <h3 className="font-bold text-[#153424] text-[15px] leading-snug truncate font-['Syne',sans-serif]" style={{ textWrap: 'balance' }}>
                {market.market_name}
              </h3>
            </div>
            <p className="text-[11px] text-stone-500 font-mono flex items-center gap-1 mt-0.5 leading-none">
              <MapPin className="w-3 h-3 shrink-0 text-stone-400" />
              <span className="truncate">{market.district}, {market.state}</span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            {market.distance_km !== null && (
              <span className="text-[11px] font-mono font-semibold text-[#2E7D32] bg-[#F0F7F1] border border-[#C8E6C9] px-2 py-0.5 rounded-md">
                {market.distance_km} km
              </span>
            )}
            <span className="text-[10px] font-mono text-stone-400 flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" />
              {market.freshness}
            </span>
          </div>
        </div>

        {/* ── Row 2: Modal price ── */}
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-stone-400 font-semibold">
              {t.modalPrice}
            </span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onExplainTerm('modal_price'); }}
              className="text-stone-300 hover:text-[#2E7D32] transition-colors cursor-pointer"
              aria-label="Explain Modal Price"
            >
              <HelpCircle className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[32px] font-black text-[#153424] font-mono leading-none tracking-tight">
              ₹{market.modal_price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-stone-400 font-mono">/quintal</span>
          </div>
        </div>

        {/* ── Row 3: Min / Max — inline, glassmorphic ── */}
        <div className="grid grid-cols-2 divide-x divide-white/60 border border-white/70 rounded-xl overflow-hidden glass-card-subtle">
          <div className="px-3.5 py-2.5">
            <div className="flex items-center gap-1 mb-0.5">
              <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-stone-400">{t.minPrice}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onExplainTerm('min_price'); }}
                className="text-stone-300 hover:text-stone-500 cursor-pointer transition-colors"
                aria-label="Explain Min Price"
              >
                <HelpCircle className="w-2.5 h-2.5" />
              </button>
            </div>
            <span className="text-sm font-bold text-stone-700 font-mono">
              ₹{market.min_price.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="px-3.5 py-2.5">
            <div className="flex items-center gap-1 mb-0.5">
              <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-stone-400">{t.maxPrice}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onExplainTerm('max_price'); }}
                className="text-stone-300 hover:text-stone-500 cursor-pointer transition-colors"
                aria-label="Explain Max Price"
              >
                <HelpCircle className="w-2.5 h-2.5" />
              </button>
            </div>
            <span className="text-sm font-bold text-stone-700 font-mono">
              ₹{market.max_price.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* ── Row 4: Pills — variety, grade, arrival ── */}
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] font-mono text-stone-600 bg-white/60 border border-white/80 px-2 py-0.5 rounded-md backdrop-blur-xs">
            {market.variety}
          </span>
          <span className="text-[10px] font-mono text-stone-600 bg-white/60 border border-white/80 px-2 py-0.5 rounded-md backdrop-blur-xs">
            {market.grade}
          </span>
          <span className="text-[10px] font-mono text-stone-700 bg-white/60 border border-white/80 px-2 py-0.5 rounded-md backdrop-blur-xs">
            {t.arrivalQty}: {market.arrival_quantity}q
          </span>
        </div>

        {/* ── Row 5: Arrival bar ── */}
        <div>
          <div className="flex justify-between items-center mb-1.5 text-[10px] font-mono text-stone-400">
            <span>Arrival volume</span>
            <span className="text-[#2E7D32] font-semibold">{arrivalPct}%</span>
          </div>
          <div className="h-1 rounded-full bg-stone-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#2E7D32] transition-all duration-700"
              style={{ width: `${arrivalPct}%`, opacity: 0.75 }}
            />
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="pt-3 mt-auto border-t border-[#F0EDE7] flex items-center justify-between gap-2">
          {isEstimated ? (
            <span className="text-[10px] font-mono text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-1 rounded-lg flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" />
              Estimated
            </span>
          ) : (
            <span className="text-[10px] font-mono text-[#2E7D32] bg-[#F0F7F1] border border-[#C8E6C9] px-2 py-1 rounded-lg flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5" />
              Official Agmarknet
            </span>
          )}

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSelect(market); }}
            className={`text-[11px] font-bold font-mono px-3.5 py-1.5 rounded-lg transition-all duration-150 cursor-pointer active:scale-95 ${
              isSelected
                ? 'bg-[#153424] text-white'
                : 'bg-[#F0F7F1] text-[#2E7D32] border border-[#C8E6C9] hover:bg-[#153424] hover:text-white hover:border-[#153424]'
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
