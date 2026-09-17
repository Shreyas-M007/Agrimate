import React from 'react';
import type { MarketItem, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { MarketCard } from './MarketCard';
import { Info } from 'lucide-react';

interface MarketComparisonProps {
  markets: MarketItem[];
  language: Language;
  selectedMarket: MarketItem | null;
  onSelectMarket: (market: MarketItem) => void;
  onExplainTerm: (term: string) => void;
}

export const MarketComparison: React.FC<MarketComparisonProps> = ({
  markets,
  language,
  selectedMarket,
  onSelectMarket,
  onExplainTerm
}) => {
  const t = TRANSLATIONS[language];

  if (markets.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2">
            <span>{t.marketComparisonTitle}</span>
            <span className="text-sm font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
              {markets.length} {markets.length === 1 ? 'Market' : 'Markets'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
            {t.marketComparisonSubtitle}
          </p>
        </div>

        {/* PRD Principle Notice: No single "best market" oversimplification */}
        <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200 self-start sm:self-auto">
          <Info className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Factual side-by-side comparison without algorithmic bias</span>
        </div>
      </div>

      {/* Grid of market cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {markets.map((market) => (
          <MarketCard
            key={market.market_id}
            market={market}
            language={language}
            isSelected={selectedMarket?.market_id === market.market_id}
            onSelect={onSelectMarket}
            onExplainTerm={onExplainTerm}
          />
        ))}
      </div>
    </section>
  );
};
