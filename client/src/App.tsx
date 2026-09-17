import React, { useState, useEffect } from 'react';
import type { 
  Language, 
  CropUnit, 
  Commodity, 
  MarketItem, 
  SearchResult 
} from './types';
import { TRANSLATIONS } from './i18n/translations';
import { Header } from './components/Header';
import { OfflineBanner } from './components/OfflineBanner';
import { SearchForm } from './components/SearchForm';
import { NaturalQuery } from './components/NaturalQuery';
import { MarketComparison } from './components/MarketComparison';
import { ValueCalculator } from './components/ValueCalculator';
import { PriceTrendChart } from './components/PriceTrendChart';
import { AiExplanation } from './components/AiExplanation';
import { SellingChecklist } from './components/SellingChecklist';
import { ExplainModal } from './components/ExplainModal';
import { MandiSlipModal } from './components/MandiSlipModal';
import { 
  saveSearchResultToCache, 
  getCachedSearchResult 
} from './utils/storage';
import { AlertCircle, Sparkles, BookOpen } from 'lucide-react';

export const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [activeTab, setActiveTab] = useState<'form' | 'nlp'>('form');

  // Commodities metadata
  const [commodities, setCommodities] = useState<Commodity[]>([]);

  // Search form state
  const [crop, setCrop] = useState<string>('Tomato');
  const [variety, setVariety] = useState<string>('Hybrid');
  const [location, setLocation] = useState<string>('Ballari');
  const [quantity, setQuantity] = useState<number>(500);
  const [unit, setUnit] = useState<CropUnit>('kg');

  // Results state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<MarketItem | null>(null);
  const [cachedAt, setCachedAt] = useState<string | undefined>();
  const [explanationTerm, setExplanationTerm] = useState<string | null>(null);
  const [isSlipModalOpen, setIsSlipModalOpen] = useState<boolean>(false);

  const t = TRANSLATIONS[language];

  // Online / Offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch standardized commodities on mount
  useEffect(() => {
    async function loadCrops() {
      try {
        const res = await fetch('/api/crops');
        const data = await res.json();
        if (data.success && data.commodities) {
          setCommodities(data.commodities);
        }
      } catch (err) {
        console.error("Failed to load commodities", err);
      }
    }
    loadCrops();

    // Auto-run initial search for the end-to-end example (PRD Section 35: Crop=Tomato, Location=Ballari, Quantity=500kg)
    handleSearch();
  }, []);

  // Search handler
  const handleSearch = async (gpsCoords?: { lat: number; lon: number }) => {
    if (!crop) return;
    setIsLoading(true);

    const queryParams = new URLSearchParams({
      crop,
      location,
      quantity: quantity.toString(),
      unit
    });

    if (gpsCoords) {
      queryParams.append('lat', gpsCoords.lat.toString());
      queryParams.append('lon', gpsCoords.lon.toString());
    }

    try {
      if (!navigator.onLine) {
        // Offline mode: load from cache
        const cached = getCachedSearchResult(crop, location);
        if (cached) {
          setSearchResult(cached.data);
          setCachedAt(cached.cachedAt);
          if (cached.data.markets && cached.data.markets.length > 0) {
            setSelectedMarket(cached.data.markets[0]);
          }
          setIsLoading(false);
          return;
        }
      }

      const res = await fetch(`/api/markets?${queryParams.toString()}`);
      const data: SearchResult = await res.json();

      setSearchResult(data);
      setCachedAt(undefined);

      if (data.success && data.verified && data.markets.length > 0) {
        setSelectedMarket(data.markets[0]);
        // Cache successful verified results
        saveSearchResultToCache(crop, location, data);
      } else {
        setSelectedMarket(null);
      }
    } catch (err) {
      console.warn("Network request failed, attempting cache lookup", err);
      const cached = getCachedSearchResult(crop, location);
      if (cached) {
        setSearchResult(cached.data);
        setCachedAt(cached.cachedAt);
        if (cached.data.markets && cached.data.markets.length > 0) {
          setSelectedMarket(cached.data.markets[0]);
        }
      } else {
        setSearchResult({
          success: false,
          verified: false,
          markets: [],
          message: "Unable to retrieve verified market data. Check connection."
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for natural language query parser
  const handleNlpResult = (parsed: { crop: string; location: string; quantity: number; unit: CropUnit }) => {
    setCrop(parsed.crop);
    setLocation(parsed.location);
    setQuantity(parsed.quantity);
    setUnit(parsed.unit);

    // Trigger search with parsed parameters
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  const quantityQuintals = searchResult?.normalized_quantity?.in_quintals || (unit === 'kg' ? quantity / 100 : (unit === 'tonne' ? quantity * 10 : quantity));

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans">
      {/* Header with language & online toggle */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        isOnline={isOnline}
      />

      {/* Offline / Cached timestamp notification banner */}
      <OfflineBanner
        isOnline={isOnline}
        cachedAt={cachedAt}
        language={language}
        onRefresh={() => handleSearch()}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full px-4 py-6 flex-1 space-y-8">
        {/* Search & Query Section */}
        <section className="space-y-3">
          {/* Query Mode Toggle Tabs */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 font-bold text-sm rounded-xl border-2 transition-all cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              {t.searchTabForm}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('nlp')}
              className={`px-4 py-2 font-bold text-sm rounded-xl border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'nlp'
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{t.searchTabNlp}</span>
            </button>
          </div>

          {activeTab === 'nlp' ? (
            <NaturalQuery
              language={language}
              onParsedResult={handleNlpResult}
            />
          ) : (
            <SearchForm
              language={language}
              commodities={commodities}
              selectedCrop={crop}
              onCropChange={setCrop}
              variety={variety}
              onVarietyChange={setVariety}
              location={location}
              onLocationChange={setLocation}
              quantity={quantity}
              onQuantityChange={setQuantity}
              unit={unit}
              onUnitChange={setUnit}
              onSearch={handleSearch}
              isLoading={isLoading}
            />
          )}
        </section>

        {/* No-data notice if unverified or missing (PRD Sec 9 & 26) */}
        {searchResult && !searchResult.verified && (
          <div className="bg-white rounded-2xl border-2 border-stone-200 p-8 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-stone-900 mb-2">
              {t.noDataTitle}
            </h3>
            <p className="text-stone-700 text-sm mb-4 leading-relaxed font-medium">
              {searchResult.message || t.noDataMsg}
            </p>
            <p className="text-xs text-stone-500">
              MandiMate strictly adheres to its data integrity rule: We never invent or hallucinate market prices when official records are not yet filed.
            </p>
          </div>
        )}

        {/* Results Section when verified data is available */}
        {searchResult && searchResult.verified && searchResult.markets.length > 0 && (
          <div className="space-y-8">
            {/* Market Comparison Cards (PRD Sec 10, 11) */}
            <MarketComparison
              markets={searchResult.markets}
              language={language}
              selectedMarket={selectedMarket}
              onSelectMarket={setSelectedMarket}
              onExplainTerm={setExplanationTerm}
            />

            {/* Selected Market Deep-Dive Section */}
            {selectedMarket && (
              <div className="space-y-8 pt-4 border-t-2 border-stone-300">
                <div className="bg-emerald-800 text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                      Currently Focused Market
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black">
                      {selectedMarket.market_name} ({selectedMarket.district})
                    </h3>
                  </div>
                  <div className="text-xs sm:text-sm font-semibold bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-700 self-start sm:self-auto">
                    Modal Rate: <strong className="text-amber-300 text-base">₹{selectedMarket.modal_price}/quintal</strong>
                  </div>
                </div>

                {/* Row 1: Quantity Value Calculator & Net Return Calculator (PRD Sec 12 & 17) */}
                <ValueCalculator
                  market={selectedMarket}
                  quantityQuintals={quantityQuintals}
                  language={language}
                  onOpenSlip={() => setIsSlipModalOpen(true)}
                />

                {/* Row 2: Deterministic Price Trend Chart (PRD Sec 13) */}
                <PriceTrendChart
                  crop={crop}
                  marketId={selectedMarket.market_id}
                  marketName={selectedMarket.market_name}
                  language={language}
                />

                {/* Row 3: Bedrock AI Explanation Narrative (PRD Sec 14, 18, 34) */}
                <AiExplanation
                  market={selectedMarket}
                  trend={null}
                  language={language}
                  quantityQuintals={quantityQuintals}
                />

                {/* Row 4: 11-Step Farmer's Selling Checklist (PRD Sec 16) */}
                <SellingChecklist
                  crop={crop}
                  marketName={selectedMarket.market_name}
                  quantityQuintals={quantityQuintals}
                  language={language}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Educational Terminology Guide Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setExplanationTerm('modal_price')}
          className="bg-stone-900 hover:bg-stone-950 text-white font-bold px-4 py-2.5 rounded-full shadow-xl border-2 border-amber-400 flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer text-xs sm:text-sm"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>{t.educationalModalTitle}</span>
        </button>
      </div>

      {/* Printable Mandi Dispatch Slip Modal */}
      {selectedMarket && (
        <MandiSlipModal
          isOpen={isSlipModalOpen}
          onClose={() => setIsSlipModalOpen(false)}
          market={selectedMarket}
          crop={crop}
          quantityQuintals={quantityQuintals}
          grossValue={Math.round(quantityQuintals * selectedMarket.modal_price)}
          language={language}
        />
      )}

      {/* Educational Term Modal (PRD Sec 15) */}
      <ExplainModal
        term={explanationTerm}
        language={language}
        onClose={() => setExplanationTerm(null)}
      />

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-8 border-t border-stone-800 mt-12 no-print">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-black text-white text-base">🌾 MandiMate</span>
            <p className="text-stone-400 mt-1">
              AI-assisted agricultural market intelligence platform for small & marginal farmers.
            </p>
          </div>
          <div className="text-center sm:text-right text-[11px] text-stone-400 space-y-1">
            <div>Data Source: Agmarknet / Directorate of Marketing & Inspection, Ministry of Agriculture, Govt. of India</div>
            <div>Strict Data Integrity: No AI Price Hallucinations • Offline Capable</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
