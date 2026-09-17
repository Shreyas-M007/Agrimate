import React, { useState, useMemo } from 'react';
import type { MarketItem, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { MarketCard } from './MarketCard';
import { Info, Filter, ArrowUpDown, Search, RotateCcw, TrendingUp, BarChart2 } from 'lucide-react';

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

    return { minPrice, maxPrice, avgPrice, totalArrivals };
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3.5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5 font-['Syne',sans-serif]">
            <span>{t.marketComparisonTitle}</span>
            <span className="text-xs font-mono font-bold bg-emerald-950/80 text-[#00FF87] border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              {processedMarkets.length} of {markets.length} Mandis
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-3xl">
            {t.marketComparisonSubtitle}
          </p>
        </div>

        {/* PRD Principle Notice */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-stone-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 self-start sm:self-auto">
          <Info className="w-3.5 h-3.5 text-[#00FF87] shrink-0" />
          <span>Factual Comparative Telemetry • Zero Fabricated Ranks</span>
        </div>
      </div>

      {/* Aggregate Stats Matrix */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass-panel p-3 rounded-xl border border-white/10">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">Floor Price</span>
            <strong className="text-base text-stone-200 font-mono tnum">₹{stats.minPrice.toLocaleString('en-IN')}/q</strong>
          </div>
          <div className="glass-panel p-3 rounded-xl border border-emerald-500/30 shadow-[0_0_15px_rgba(0,255,135,0.08)]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#00FF87] block flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Ceiling Modal Price
            </span>
            <strong className="text-base text-[#00FF87] font-mono font-black tnum">₹{stats.maxPrice.toLocaleString('en-IN')}/q</strong>
          </div>
          <div className="glass-panel p-3 rounded-xl border border-white/10">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">Regional Average</span>
            <strong className="text-base text-stone-200 font-mono tnum">₹{stats.avgPrice.toLocaleString('en-IN')}/q</strong>
          </div>
          <div className="glass-panel p-3 rounded-xl border border-amber-500/30">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block flex items-center gap-1">
              <BarChart2 className="w-3 h-3" />
              Total Recorded Arrivals
            </span>
            <strong className="text-base text-amber-300 font-mono font-bold tnum">{stats.totalArrivals.toLocaleString('en-IN')} q</strong>
          </div>
        </div>
      )}

      {/* Interactive Toolbar */}
      <div className="glass-panel p-3 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* State Filter */}
          <div className="flex items-center gap-1.5 bg-[#0A0D0B] px-2.5 py-1.5 rounded-lg border border-white/10 font-mono">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-stone-400 hidden sm:inline">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent text-white font-semibold cursor-pointer focus:outline-none"
            >
              <option value="all" className="bg-[#0A0D0B] text-white">All States</option>
              {availableStates.map(st => (
                <option key={st} value={st} className="bg-[#0A0D0B] text-white">{st}</option>
              ))}
            </select>
          </div>

          {/* Distance Radius Filter */}
          <div className="flex items-center gap-1.5 bg-[#0A0D0B] px-2.5 py-1.5 rounded-lg border border-white/10 font-mono">
            <span className="text-stone-400">Radius:</span>
            <select
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="bg-transparent text-white font-semibold cursor-pointer focus:outline-none"
            >
              <option value={0} className="bg-[#0A0D0B] text-white">Any Distance</option>
              <option value={50} className="bg-[#0A0D0B] text-white">&lt; 50 km</option>
              <option value={100} className="bg-[#0A0D0B] text-white">&lt; 100 km</option>
              <option value={200} className="bg-[#0A0D0B] text-white">&lt; 200 km</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-[#0A0D0B] px-2.5 py-1.5 rounded-lg border border-white/10 font-mono">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-stone-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white font-semibold cursor-pointer focus:outline-none"
            >
              <option value="distance" className="bg-[#0A0D0B] text-white">Nearest Distance</option>
              <option value="price_desc" className="bg-[#0A0D0B] text-white">Highest Modal Price</option>
              <option value="price_asc" className="bg-[#0A0D0B] text-white">Lowest Modal Price</option>
              <option value="arrivals_desc" className="bg-[#0A0D0B] text-white">Highest Arrivals</option>
              <option value="spread_asc" className="bg-[#0A0D0B] text-white">Tightest Spread</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {(selectedState !== 'all' || maxDistance > 0 || searchQuery.trim() || sortBy !== 'distance') && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-2 py-1 text-stone-400 hover:text-white font-mono rounded hover:bg-white/5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-52">
          <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter mandi..."
            className="w-full pl-8 pr-3 py-1.5 border border-white/10 rounded-lg bg-[#0A0D0B] text-white font-mono text-xs placeholder:text-stone-600 focus:outline-none focus:border-[#00FF87]"
          />
        </div>
      </div>

      {/* Grid of market cards */}
      {processedMarkets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="glass-panel rounded-2xl border border-white/10 p-8 text-center space-y-3">
          <p className="text-stone-400 text-sm font-mono">
            No markets match your current filter parameters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-[#00FF87] text-[#060807] text-xs font-bold rounded-xl hover:bg-[#10B981] transition-colors cursor-pointer font-mono"
          >
            Show All {markets.length} Markets
          </button>
        </div>
      )}
    </section>
  );
};

export default MarketComparison;
