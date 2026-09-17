import React, { useState, useEffect } from 'react';
import type { 
  Language, 
  CropUnit, 
  Commodity, 
  MarketItem, 
  SearchResult,
  SyncStatusData,
  PriceTrend
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
import { SettingsModal } from './components/SettingsModal';
import { 
  saveSearchResultToCache, 
  getCachedSearchResult 
} from './utils/storage';
import { AlertCircle, Sparkles, BookOpen, CheckCircle2, ShieldCheck } from 'lucide-react';

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
  const [activeTrend, setActiveTrend] = useState<PriceTrend | null>(null);
  const [cachedAt, setCachedAt] = useState<string | undefined>();
  const [explanationTerm, setExplanationTerm] = useState<string | null>(null);
  const [isSlipModalOpen, setIsSlipModalOpen] = useState<boolean>(false);

  // Production Sync & Settings state
  const [syncStatus, setSyncStatus] = useState<SyncStatusData | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

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

  // Fetch sync status on mount
  const fetchSyncStatus = async () => {
    try {
      const res = await fetch('/api/sync/status');
      const data = await res.json();
      if (data.success) {
        setSyncStatus(data);
      }
    } catch (e) {
      console.warn("Could not fetch sync status", e);
    }
  };

  useEffect(() => {
    fetchSyncStatus();

    // Fetch user preferences
    async function loadPreferences() {
      try {
        const res = await fetch('/api/preferences');
        const data = await res.json();
        if (data.success && data.preferences) {
          // English is ALWAYS default on initial load per user specification
          if (data.preferences.location) setLocation(data.preferences.location);
          if (data.preferences.preferred_units) setUnit(data.preferences.preferred_units as CropUnit);
        }
      } catch (e) {
        console.warn("Could not load preferences", e);
      }
    }
    loadPreferences();
  }, []);

  // Fetch trend whenever selectedMarket or crop changes
  useEffect(() => {
    if (!selectedMarket || !crop) {
      setActiveTrend(null);
      return;
    }
    const marketId = selectedMarket.market_id;
    async function loadMarketTrend() {
      try {
        const res = await fetch(`/api/trends?crop=${encodeURIComponent(crop)}&market_id=${encodeURIComponent(marketId)}&days=7`);
        const data = await res.json();
        if (data.success && data.has_data) {
          setActiveTrend(data);
        } else {
          setActiveTrend(null);
        }
      } catch {
        setActiveTrend(null);
      }
    }
    loadMarketTrend();
  }, [selectedMarket?.market_id, crop]);

  // Live Sync trigger handler
  const handleTriggerSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSyncToast(`⚡ Successfully synced ${data.records_synced} APMC records into SQLite & Cloud DB!`);
        setTimeout(() => setSyncToast(null), 4500);
        await fetchSyncStatus();
        await handleSearch();
      }
    } catch (err) {
      console.error("Live sync failed", err);
    } finally {
      setIsSyncing(false);
    }
  };

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

    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  const quantityQuintals = searchResult?.normalized_quantity?.in_quintals || (unit === 'kg' ? quantity / 100 : (unit === 'tonne' ? quantity * 10 : quantity));

  return (
    <div className="min-h-screen bg-[#FBFDF9] text-[#162E21] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header with language, sync, settings & online toggle */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        isOnline={isOnline}
        syncStatus={syncStatus}
        onTriggerSync={handleTriggerSync}
        isSyncing={isSyncing}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Live Sync Notification Toast */}
      {syncToast && (
        <div className="bg-[#123826] text-white font-semibold text-xs sm:text-sm px-4 py-2.5 text-center flex items-center justify-center gap-2 shadow-sm animate-in fade-in font-mono">
          <CheckCircle2 className="w-4 h-4 text-[#4CAF50] shrink-0" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Offline / Cached timestamp notification banner */}
      <OfflineBanner
        isOnline={isOnline}
        cachedAt={cachedAt}
        language={language}
        onRefresh={() => handleSearch()}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 space-y-8">
        {/* VerdaAgro Agriculture Hero Section */}
        <div className="verda-card rounded-3xl p-6 sm:p-10 border border-[#E2ECE3] relative overflow-hidden bg-gradient-to-br from-white via-[#F7FBF8] to-[#EBF5ED]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF5ED] border border-[#CCE0D0] text-xs font-semibold text-[#123826]">
                <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                <span>100% Official APMC Rates • Zero Speculation</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-[#123826] font-['Syne',sans-serif] tracking-tight leading-[1.15]">
                Modern Agriculture Intelligence for Farms & Growers
              </h2>
              <p className="text-sm sm:text-base text-stone-600 font-normal leading-relaxed max-w-xl">
                Compare verified wholesale mandi prices across 20 APMC hubs, calculate realistic transport logistics, and receive clear selling advisory in your regional language.
              </p>

              {/* Agricultural Key Stat Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-white p-3.5 rounded-2xl border border-[#E2ECE3] shadow-xs">
                  <span className="text-[11px] text-stone-500 font-medium block">Active Markets</span>
                  <span className="text-[#123826] font-black text-lg sm:text-xl">20 Mandis</span>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-[#E2ECE3] shadow-xs">
                  <span className="text-[11px] text-stone-500 font-medium block">Key Crops</span>
                  <span className="text-[#123826] font-black text-lg sm:text-xl">10 Crops</span>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-[#E2ECE3] shadow-xs">
                  <span className="text-[11px] text-stone-500 font-medium block">Top Spread</span>
                  <span className="text-[#D97706] font-black text-lg sm:text-xl">₹1,400/q</span>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-[#E2ECE3] shadow-xs">
                  <span className="text-[11px] text-stone-500 font-medium block">Sync Status</span>
                  <span className="text-[#2E7D32] font-black text-lg sm:text-xl">Daily Live</span>
                </div>
              </div>
            </div>

            {/* Right Photography Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#D5E7D8] aspect-[4/3] group">
                <img 
                  src="/verda_agro_hero.jpg" 
                  alt="VerdaAgro Agriculture Fields and Crops" 
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* Floating Farm Card */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-white/80 shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#2E7D32] uppercase tracking-wider block">Featured Market Rate</span>
                    <strong className="text-sm text-[#123826]">Ballari APMC • Tomato Hybrid</strong>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-base font-black text-[#123826]">₹2,200</span>
                    <span className="text-xs text-stone-500">/q</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Query Section */}
        <section className="space-y-3">
          {/* Query Mode Toggle Tabs */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`px-5 py-2.5 text-xs font-bold rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-[#123826] text-white border-[#123826] shadow-sm'
                  : 'bg-white text-stone-600 border-[#E2ECE3] hover:border-[#CCE0D0] hover:text-[#123826]'
              }`}
            >
              {t.searchTabForm}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('nlp')}
              className={`px-5 py-2.5 text-xs font-bold rounded-2xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'nlp'
                  ? 'bg-[#123826] text-white border-[#123826] shadow-sm'
                  : 'bg-white text-stone-600 border-[#E2ECE3] hover:border-[#CCE0D0] hover:text-[#123826]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
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

        {/* No-data notice if unverified or missing */}
        {searchResult && !searchResult.verified && (
          <div className="verda-card rounded-3xl border border-amber-200 bg-[#FEF8ED] p-8 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-3 border border-amber-200">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#123826] mb-2 font-['Syne',sans-serif]">
              {t.noDataTitle}
            </h3>
            <p className="text-stone-700 text-xs sm:text-sm mb-4 leading-relaxed">
              {searchResult.message || t.noDataMsg}
            </p>
            <p className="text-[11px] text-stone-500 font-medium">
              Notice: MandiMate only displays official government APMC market prices. When market committees have not filed today's rates, we do not estimate or substitute unverified prices.
            </p>
          </div>
        )}

        {/* Results Section when verified data is available */}
        {searchResult && searchResult.verified && searchResult.markets.length > 0 && (
          <div className="space-y-8">
            {/* Market Comparison Cards */}
            <MarketComparison
              markets={searchResult.markets}
              language={language}
              selectedMarket={selectedMarket}
              onSelectMarket={setSelectedMarket}
              onExplainTerm={setExplanationTerm}
            />

            {/* Selected Market Deep-Dive Section */}
            {selectedMarket && (
              <div className="space-y-8 pt-4 border-t border-[#E2ECE3]">
                <div className="verda-card p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#CCE0D0] shadow-sm">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#2E7D32] font-bold">
                      Selected Mandi Overview
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#123826] font-['Syne',sans-serif]">
                      {selectedMarket.market_name} ({selectedMarket.district})
                    </h3>
                  </div>
                  <div className="text-xs bg-[#F4F8F5] px-4 py-2.5 rounded-2xl border border-[#CCE0D0] self-start sm:self-auto font-mono">
                    Modal Rate: <strong className="text-[#123826] text-base tnum font-black">₹{selectedMarket.modal_price}/quintal</strong>
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

                {/* Row 3: Bedrock & Gemini AI Explanation Narrative (PRD Sec 14, 18, 34) */}
                <AiExplanation
                  market={selectedMarket}
                  trend={activeTrend}
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
          className="bg-[#123826] hover:bg-[#1B4D35] text-white font-bold px-4 py-2.5 rounded-full shadow-lg border border-[#3FA744]/40 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer text-xs sm:text-sm"
        >
          <BookOpen className="w-4 h-4 text-[#A5D6A7]" />
          <span>{t.educationalModalTitle}</span>
        </button>
      </div>

      {/* Farmer Preferences & Profile Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentLanguage={language}
        onLanguageChange={setLanguage}
        currentLocation={location}
        onLocationChange={setLocation}
        currentUnit={unit}
        onUnitChange={setUnit}
        syncStatus={syncStatus}
        onTriggerSync={handleTriggerSync}
        isSyncing={isSyncing}
      />

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

      {/* Educational Term Modal */}
      <ExplainModal
        term={explanationTerm}
        language={language}
        onClose={() => setExplanationTerm(null)}
      />

      {/* VerdaAgro Forest Green Footer */}
      <footer className="bg-[#123826] text-stone-300 text-xs py-10 border-t border-[#1B4D35] mt-16 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌾</span>
              <span className="font-bold text-white text-base font-['Syne',sans-serif]">MandiMate</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#1B4D35] text-[#A5D6A7] border border-[#2E7D32]">
                VerdaAgro Edition
              </span>
            </div>
            <p className="text-emerald-200/80 mt-1 text-xs">
              Official agricultural wholesale pricing and transparent advisory for Indian farmers.
            </p>
          </div>
          <div className="text-center sm:text-right text-[11px] text-emerald-200/70 space-y-1">
            <div>Data Source: Agmarknet • Directorate of Marketing & Inspection, Ministry of Agriculture</div>
            <div>Trilingual Support: English (Default) • ಕನ್ನಡ • हिन्दी</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
