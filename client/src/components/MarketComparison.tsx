import React, { useState, useMemo } from 'react';
import type { MarketItem, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { MarketCard } from './MarketCard';
import { Info, Filter, ArrowUpDown, Search, RotateCcw } from 'lucide-react';

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

  // Filter & Sort State
  const [selectedState, setSelectedState] = useState<string>('all');
  const [maxDistance, setMaxDistance] = useState<number>(0); // 0 = all
  const [sortBy, setSortBy] = useState<string>('distance');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique states
  const availableStates = useMemo(() => {
    const states = new Set(markets.map(m => m.state));
    return Array.from(states).sort();
  }, [markets]);

  // Filter and sort the markets
  const processedMarkets = useMemo(() => {
    let result = [...markets];

    // Filter by state
    if (selectedState !== 'all') {
      result = result.filter(m => m.state.toLowerCase() === selectedState.toLowerCase());
    }

    // Filter by max distance
    if (maxDistance > 0) {
      result = result.filter(m => m.distance_km === null || m.distance_km <= maxDistance);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(m => 
        m.market_name.toLowerCase().includes(q) ||
        m.district.toLowerCase().includes(q) ||
        m.state.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price_desc':
          return b.modal_price - a.modal_price;
        case 'price_asc':
          return a.modal_price - b.modal_price;
        case 'arrivals_desc':
          return b.arrival_quantity - a.arrival_quantity;
        case 'spread_asc':
          return a.price_spread - b.price_spread;
        case 'distance':
        default:
          return (a.distance_km ?? 9999) - (b.distance_km ?? 9999);
      }
    });

    return result;
  }, [markets, selectedState, maxDistance, searchQuery, sortBy]);

  // Aggregate Market Stats
  const stats = useMemo(() => {
    if (markets.length === 0) return null;
    const prices = markets.map(m => m.modal_price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length);
    const totalArrivals = markets.reduce((sum, m) => sum + m.arrival_quantity, 0);

    const validDistances = markets.filter(m => m.distance_km !== null);
    let closestMarket: MarketItem | null = null;
    if (validDistances.length > 0) {
      closestMarket = validDistances.reduce((prev, curr) => 
        (curr.distance_km! < prev.distance_km!) ? curr : prev
      );
    }

    return { minPrice, maxPrice, avgPrice, totalArrivals, closestMarket };
  }, [markets]);

  const handleResetFilters = () => {
    setSelectedState('all');
    setMaxDistance(0);
    setSortBy('distance');
    setSearchQuery('');
  };

  if (markets.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2">
            <span>{t.marketComparisonTitle}</span>
            <span className="text-sm font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
              {processedMarkets.length} of {markets.length} {markets.length === 1 ? 'Market' : 'Markets'}
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

      {/* Aggregate Stats Bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs text-stone-800 text-xs">
          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">Lowest Modal Price</span>
            <strong className="text-base text-stone-900">₹{stats.minPrice.toLocaleString('en-IN')}/q</strong>
          </div>
          <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Highest Modal Price</span>
            <strong className="text-base text-emerald-950 font-black">₹{stats.maxPrice.toLocaleString('en-IN')}/q</strong>
          </div>
          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">Regional Average</span>
            <strong className="text-base text-stone-900">₹{stats.avgPrice.toLocaleString('en-IN')}/q</strong>
          </div>
          <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
            <span className="text-[10px] uppercase font-bold text-amber-800 block">Total Mandi Arrivals</span>
            <strong className="text-base text-amber-950 font-black">{stats.totalArrivals.toLocaleString('en-IN')} q</strong>
          </div>
        </div>
      )}

      {/* Interactive Toolbar: Filter, Sort, and Search */}
      <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* State Filter */}
          <div className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1.5 rounded-xl border border-stone-300">
            <Filter className="w-3.5 h-3.5 text-stone-600" />
            <span className="font-semibold text-stone-600 hidden sm:inline">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent font-bold text-stone-900 cursor-pointer focus:outline-hidden"
            >
              <option value="all">All States</option>
              {availableStates.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Distance Radius Filter */}
          <div className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1.5 rounded-xl border border-stone-300">
            <span className="font-semibold text-stone-600">Radius:</span>
            <select
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="bg-transparent font-bold text-stone-900 cursor-pointer focus:outline-hidden"
            >
              <option value={0}>Any Distance</option>
              <option value={50}>Within 50 km</option>
              <option value={100}>Within 100 km</option>
              <option value={200}>Within 200 km</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1.5 rounded-xl border border-stone-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-600" />
            <span className="font-semibold text-stone-600 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-bold text-stone-900 cursor-pointer focus:outline-hidden"
            >
              <option value="distance">Nearest Distance</option>
              <option value="price_desc">Highest Modal Price</option>
              <option value="price_asc">Lowest Modal Price</option>
              <option value="arrivals_desc">Highest Arrivals</option>
              <option value="spread_asc">Tightest Spread (Stable)</option>
            </select>
          </div>

          {/* Reset Filters button if active */}
          {(selectedState !== 'all' || maxDistance > 0 || searchQuery.trim() || sortBy !== 'distance') && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 text-stone-600 hover:text-stone-900 font-semibold rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Quick Search within markets */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter mandi or district..."
            className="w-full pl-8 pr-3 py-1.5 border border-stone-300 rounded-xl bg-stone-50 focus:bg-white text-stone-900 font-medium placeholder:text-stone-400 focus:outline-emerald-700"
          />
        </div>
      </div>

      {/* Grid of market cards */}
      {processedMarkets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {processedMarkets.map((market) => (
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
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-3">
          <p className="text-stone-600 text-sm font-medium">
            No markets match your current filter criteria ({selectedState !== 'all' ? selectedState : ''} {maxDistance ? `< ${maxDistance}km` : ''} {searchQuery ? `"${searchQuery}"` : ''}).
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-900 transition-colors cursor-pointer"
          >
            Show All {markets.length} Markets
          </button>
        </div>
      )}
    </section>
  );
};
