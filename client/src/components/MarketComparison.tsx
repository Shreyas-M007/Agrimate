import React, { useState, useMemo, useEffect } from 'react';
import type { MarketItem, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { MarketCard } from './MarketCard';
import { 
  Info, 
  Filter, 
  ArrowUpDown, 
  Search, 
  RotateCcw, 
  TrendingUp, 
  BarChart2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const INITIAL_BATCH_SIZE = 6;
const BATCH_INCREMENT = 6;

const SHOW_MORE_LABELS: Record<Language, string> = {
  en: 'Show More Mandis',
  hi: 'और मंडियां देखें',
  kn: 'ಇನ್ನಷ್ಟು ಮಂಡಿಗಳನ್ನು ತೋರಿಸಿ',
  te: 'మరిన్ని మార్కెట్లను చూపించు',
  ta: 'மேலும் சந்தைகளைக் காட்டு',
  mr: 'आणखी मंड्या दाखवा',
  bn: 'আরও মান্ডি দেখুন',
  gu: 'વધુ મંડીઓ જુઓ',
  pa: 'ਹੋਰ ਮੰਡੀਆਂ ਵੇਖੋ',
  ml: 'കൂടുതൽ മണ്ടികൾ കാണിക്കുക'
};

const SHOW_LESS_LABELS: Record<Language, string> = {
  en: 'Show Less',
  hi: 'कम देखें',
  kn: 'ಕಡಿಮೆ ತೋರಿಸಿ',
  te: 'తక్కువ చూపించు',
  ta: 'குறைவாகக் காட்டு',
  mr: 'कमी दाखवा',
  bn: 'কম দেখুন',
  gu: 'ઓછું જુઓ',
  pa: 'ਘੱਟ ਵੇਖੋ',
  ml: 'കുറച്ച് കാണിക്കുക'
};

const SHOW_ALL_LABELS: Record<Language, string> = {
  en: 'Show All',
  hi: 'सभी देखें',
  kn: 'ಎಲ್ಲವನ್ನೂ ತೋರಿಸಿ',
  te: 'అన్నీ చూపించు',
  ta: 'அனைத்தையும் காட்டு',
  mr: 'सर्व दाखवा',
  bn: 'সব দেখুন',
  gu: 'બધા જુઓ',
  pa: 'ਸਾਰੇ ਵੇਖੋ',
  ml: 'എല്ലാം കാണിക്കുക'
};

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
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_BATCH_SIZE);

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

  // Reset visibleCount whenever filters change
  useEffect(() => {
    setVisibleCount(INITIAL_BATCH_SIZE);
  }, [selectedState, maxDistance, sortBy, searchQuery]);

  // If selectedMarket is set and outside the current visible slice, auto-expand to include it
  useEffect(() => {
    if (selectedMarket) {
      const idx = processedMarkets.findIndex(m => m.market_id === selectedMarket.market_id);
      if (idx >= visibleCount) {
        setVisibleCount(Math.ceil((idx + 1) / BATCH_INCREMENT) * BATCH_INCREMENT);
      }
    }
  }, [selectedMarket, processedMarkets, visibleCount]);

  const visibleMarkets = useMemo(() => {
    return processedMarkets.slice(0, visibleCount);
  }, [processedMarkets, visibleCount]);

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
    setVisibleCount(INITIAL_BATCH_SIZE);
  };

  if (markets.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6E1D7] pb-3.5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#153424] flex items-center gap-2.5 font-['Syne',sans-serif]">
            <span>{t.marketComparisonTitle}</span>
            <span className="text-xs font-mono font-bold bg-[#EAEFE9] text-[#153424] border border-[#D6DFD4] px-2.5 py-0.5 rounded-full">
              {processedMarkets.length} of {markets.length} Mandis
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl">
            {t.marketComparisonSubtitle}
          </p>
        </div>

        {/* PRD Principle Notice */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-stone-600 bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#E6E1D7] self-start sm:self-auto">
          <Info className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
          <span>Verified APMC Rates • Sorted by Distance & Arrivals</span>
        </div>
      </div>

      {/* Aggregate Stats Matrix */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-xl border border-[#E6E1D7] shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">Floor Price</span>
            <strong className="text-base text-stone-800 font-mono tnum">₹{stats.minPrice.toLocaleString('en-IN')}/q</strong>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#E6E1D7] shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#153424] font-bold block flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#2E7D32]" />
              Ceiling Modal Price
            </span>
            <strong className="text-base text-[#153424] font-mono font-black tnum">₹{stats.maxPrice.toLocaleString('en-IN')}/q</strong>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#E6E1D7] shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">Regional Average</span>
            <strong className="text-base text-stone-800 font-mono tnum">₹{stats.avgPrice.toLocaleString('en-IN')}/q</strong>
          </div>
          <div className="bg-white p-3 rounded-xl border border-amber-200/80 bg-amber-50/40 shadow-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-bold block flex items-center gap-1">
              <BarChart2 className="w-3 h-3 text-amber-700" />
              Total Recorded Arrivals
            </span>
            <strong className="text-base text-amber-900 font-mono font-bold tnum">{stats.totalArrivals.toLocaleString('en-IN')} q</strong>
          </div>
        </div>
      )}

      {/* Interactive Toolbar */}
      <div className="bg-white p-3.5 rounded-xl border border-[#E6E1D7] flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* State Filter */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-2.5 py-1.5 rounded-lg border border-[#E6E1D7] font-mono">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-stone-600 hidden sm:inline font-medium">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent text-[#153424] font-semibold cursor-pointer focus:outline-none"
            >
              <option value="all" className="bg-white text-stone-900">All States</option>
              {availableStates.map(st => (
                <option key={st} value={st} className="bg-white text-stone-900">{st}</option>
              ))}
            </select>
          </div>

          {/* Distance Radius Filter */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-2.5 py-1.5 rounded-lg border border-[#E6E1D7] font-mono">
            <span className="text-stone-600 font-medium">Radius:</span>
            <select
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="bg-transparent text-[#153424] font-semibold cursor-pointer focus:outline-none"
            >
              <option value={0} className="bg-white text-stone-900">Any Distance</option>
              <option value={50} className="bg-white text-stone-900">&lt; 50 km</option>
              <option value={100} className="bg-white text-stone-900">&lt; 100 km</option>
              <option value={200} className="bg-white text-stone-900">&lt; 200 km</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] px-2.5 py-1.5 rounded-lg border border-[#E6E1D7] font-mono">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
            <span className="text-stone-600 hidden sm:inline font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[#153424] font-semibold cursor-pointer focus:outline-none"
            >
              <option value="distance" className="bg-white text-stone-900">Nearest Distance</option>
              <option value="price_desc" className="bg-white text-stone-900">Highest Modal Price</option>
              <option value="price_asc" className="bg-white text-stone-900">Lowest Modal Price</option>
              <option value="arrivals_desc" className="bg-white text-stone-900">Highest Arrivals</option>
              <option value="spread_asc" className="bg-white text-stone-900">Tightest Spread</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {(selectedState !== 'all' || maxDistance > 0 || searchQuery.trim() || sortBy !== 'distance') && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 text-stone-600 hover:text-[#153424] font-mono rounded-lg hover:bg-[#ECE8DE] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-52">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter mandi..."
            className="w-full pl-8 pr-3 py-1.5 border border-[#CCE0D0] rounded-lg bg-white text-[#162E21] font-mono text-xs placeholder:text-stone-400 focus:outline-none focus:border-[#2E7D32]"
          />
        </div>
      </div>

      {/* Grid of market cards with staggered slide-up animations */}
      {processedMarkets.length > 0 ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleMarkets.map((market, idx) => (
              <div
                key={market.market_id}
                className={`animate-slide-up stagger-${Math.min((idx % 6) + 1, 6)} hover-slide-up`}
              >
                <MarketCard
                  market={market}
                  language={language}
                  isSelected={selectedMarket?.market_id === market.market_id}
                  onSelect={onSelectMarket}
                  onExplainTerm={onExplainTerm}
                />
              </div>
            ))}
          </div>

          {/* Show More / Show Less Pagination Bar */}
          {processedMarkets.length > INITIAL_BATCH_SIZE && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E6E1D7] bg-[#FAF8F5] p-4 rounded-2xl shadow-2xs">
              <div className="text-xs text-stone-600 font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2E7D32]"></span>
                <span>
                  Showing <strong className="text-[#153424] font-bold">{Math.min(visibleCount, processedMarkets.length)}</strong> of{' '}
                  <strong className="text-[#153424] font-bold">{processedMarkets.length}</strong> APMC Mandis
                </span>
                {visibleCount < processedMarkets.length && (
                  <span className="text-[11px] text-stone-500 hidden sm:inline">
                    ({processedMarkets.length - visibleCount} more available)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {visibleCount < processedMarkets.length ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setVisibleCount(prev => Math.min(prev + BATCH_INCREMENT, processedMarkets.length))}
                      className="px-4 py-2 rounded-xl bg-[#153424] hover:bg-[#1f4a34] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{SHOW_MORE_LABELS[language] || 'Show More Mandis'}</span>
                      <span className="text-emerald-300 font-mono text-[11px]">
                        (+{Math.min(BATCH_INCREMENT, processedMarkets.length - visibleCount)})
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
                    </button>

                    {processedMarkets.length - visibleCount > BATCH_INCREMENT && (
                      <button
                        type="button"
                        onClick={() => setVisibleCount(processedMarkets.length)}
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-700 hover:text-[#153424] border border-[#E6E1D7] text-xs font-bold transition-all cursor-pointer shadow-2xs"
                      >
                        <span>{SHOW_ALL_LABELS[language] || 'Show All'}</span>
                        <span className="text-stone-500 font-mono text-[11px] ml-1">({processedMarkets.length})</span>
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setVisibleCount(INITIAL_BATCH_SIZE);
                    }}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-[#E6E1D7] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{SHOW_LESS_LABELS[language] || 'Show Less'}</span>
                    <ChevronUp className="w-3.5 h-3.5 text-stone-600" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="verda-card rounded-2xl border border-[#E2ECE3] p-8 text-center space-y-3">
          <p className="text-stone-600 text-sm font-mono">
            No markets match your current filter parameters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-[#2E7D32] text-white text-xs font-bold rounded-xl hover:bg-[#1B5E20] transition-colors cursor-pointer font-mono shadow-sm"
          >
            Show All {markets.length} Markets
          </button>
        </div>
      )}
    </section>
  );
};

export default MarketComparison;
