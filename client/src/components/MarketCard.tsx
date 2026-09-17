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
      className={`rounded-2xl border-2 transition-all p-5 flex flex-col justify-between ${
        isSelected 
          ? 'bg-emerald-50/50 border-emerald-600 ring-4 ring-emerald-600/20 shadow-lg' 
          : 'bg-white border-stone-200 hover:border-emerald-400 hover:shadow-md'
      }`}
    >
      <div>
        {/* Market Title & Distance/Freshness Badges */}
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-1.5">
              <span>{market.market_name}</span>
              {isSelected && (
                <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0 inline" />
              )}
            </h3>
            <p className="text-xs text-stone-600 font-medium flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-stone-600" />
              <span>{market.district}, {market.state}</span>
              {market.distance_km !== null && (
                <span className="font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded ml-1">
                  ~{market.distance_km} km away
                </span>
              )}
            </p>
          </div>

          {/* Freshness Badge */}
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-700 bg-stone-100 px-2 py-1 rounded-md border border-stone-200">
            <Clock className="w-3 h-3 text-stone-600" />
            <span>{market.freshness}</span>
          </div>
        </div>

        {/* Variety & Grade info */}
        <div className="flex flex-wrap gap-1.5 mb-4 text-xs font-semibold">
          <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
            {market.variety}
          </span>
          <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
            {market.grade}
          </span>
          <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
            {t.arrivalQty}: {market.arrival_quantity} qtl
          </span>
        </div>

        {/* Primary Pricing Grid */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 mb-4">
          {/* Modal Price Highlight */}
          <div className="text-center pb-3 border-b border-stone-200">
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-stone-600 uppercase tracking-wider mb-0.5">
              <span>{t.modalPrice}</span>
              <button
                type="button"
                onClick={() => onExplainTerm('modal_price')}
                className="text-stone-600 hover:text-emerald-700 cursor-pointer"
                title="Explain Modal Price"
                aria-label="Explain Modal Price"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-800 tracking-tight">
              ₹{market.modal_price.toLocaleString('en-IN')}
              <span className="text-sm font-bold text-stone-600 font-sans ml-1">/quintal</span>
            </div>
          </div>

          {/* Min and Max Range */}
          <div className="grid grid-cols-2 gap-2 pt-3 text-center">
            <div className="border-r border-stone-200 pr-2">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-stone-600 uppercase">
                <span>{t.minPrice}</span>
                <button
                  type="button"
                  onClick={() => onExplainTerm('min_price')}
                  className="text-stone-600 hover:text-emerald-700 cursor-pointer"
                  title="Explain Minimum Price"
                  aria-label="Explain Minimum Price"
                >
                  <HelpCircle className="w-3 h-3" />
                </button>
              </div>
              <div className="text-lg font-black text-stone-800">
                ₹{market.min_price.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="pl-2">
              <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-stone-600 uppercase">
                <span>{t.maxPrice}</span>
                <button
                  type="button"
                  onClick={() => onExplainTerm('max_price')}
                  className="text-stone-600 hover:text-emerald-700 cursor-pointer"
                  title="Explain Maximum Price"
                  aria-label="Explain Maximum Price"
                >
                  <HelpCircle className="w-3 h-3" />
                </button>
              </div>
              <div className="text-lg font-black text-stone-800">
                ₹{market.max_price.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Estimated Gross Value Card (PRD Sec 12) */}
        {market.estimated_gross_value > 0 && (
          <div className="bg-emerald-100/60 border border-emerald-300 rounded-xl p-3 mb-3">
            <div className="text-xs font-bold text-emerald-950 flex items-center justify-between mb-0.5">
              <span>{t.grossValueTitle}</span>
              <span className="font-mono text-[11px] text-emerald-800">{market.calculator_formula}</span>
            </div>
            <div className="text-2xl font-black text-emerald-900">
              ₹{market.estimated_gross_value.toLocaleString('en-IN')}
            </div>
            <p className="text-[10px] text-emerald-800 leading-tight mt-1">
              *Estimated gross value based on modal price, not guaranteed earnings.
            </p>
          </div>
        )}

        {/* Source verification footer */}
        <div className="text-[11px] text-stone-600 flex items-center gap-1.5 py-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span className="truncate" title={market.source}>
            {market.source}
          </span>
        </div>
      </div>

      {/* Select Action Button */}
      <div className="mt-4 pt-3 border-t border-stone-200">
        <button
          type="button"
          onClick={() => onSelect(market)}
          className={`w-full py-2.5 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isSelected 
              ? 'bg-emerald-700 text-white shadow' 
              : 'bg-stone-100 hover:bg-emerald-100 text-stone-800 hover:text-emerald-950 border border-stone-300'
          }`}
        >
          <span>{isSelected ? 'Selected for AI Insight & Trends' : 'View Trends & AI Analysis'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
