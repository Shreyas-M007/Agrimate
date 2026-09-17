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
          if (data.preferences.language) setLanguage(data.preferences.language as Language);
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
    <div className="min-h-screen bg-[#060807] text-stone-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
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
        <div className="bg-[#00FF87] text-[#060807] font-bold text-xs sm:text-sm px-4 py-2.5 text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,135,0.4)] animate-in fade-in font-mono">
          <CheckCircle2 className="w-4 h-4 text-[#060807] shrink-0" />
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
        {/* Hero Visual Graphic Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-emerald-500/25 shadow-[0_12px_45px_rgba(0,0,0,0.85)] group">
          <div className="absolute inset-0">
            <img 
              src="/agro_terminal_hero.jpg" 
              alt="MandiMate Agro-Financial Intelligence Terminal" 
              className="w-full h-full object-cover object-center opacity-40 group-hover:scale-102 transition-all duration-700 filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#060807] via-[#060807]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060807] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-mono text-[#00FF87]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>STRICT AGMARKNET VERIFICATION • ZERO HALLUCINATION</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-['Syne',sans-serif] tracking-tight leading-tight">
              Agro-Financial Intelligence Terminal
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-medium leading-relaxed">
              Institutional-grade market telemetry for Indian farmers. Real-time APMC mandi modal rates, transport logistics yield simulation, and deterministic Kannada, Hindi & English advisory.
            </p>

            {/* Live Metrics Telemetry Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 font-mono text-xs">
              <div className="bg-[#0A0D0B]/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-stone-500 block">Active Hubs</span>
                <span className="text-[#00FF87] font-bold">20 Mandis</span>
              </div>
              <div className="bg-[#0A0D0B]/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-stone-500 block">Coverage</span>
                <span className="text-stone-200 font-bold">10 Crops</span>
              </div>
              <div className="bg-[#0A0D0B]/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-stone-500 block">Daily Spread</span>
                <span className="text-[#F59E0B] font-bold">₹1,400/q</span>
              </div>
              <div className="bg-[#0A0D0B]/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-stone-500 block">Cloud Status</span>
                <span className="text-[#00FF87] font-bold">Firebase/AWS</span>
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
              className={`px-4 py-2 font-mono text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-emerald-500/20 text-[#00FF87] border-[#00FF87]/40 shadow-[0_0_15px_rgba(0,255,135,0.2)]'
                  : 'bg-[#0A0D0B] text-stone-400 border-white/10 hover:text-white'
              }`}
            >
              {t.searchTabForm}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('nlp')}
              className={`px-4 py-2 font-mono text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'nlp'
                  ? 'bg-emerald-500/20 text-[#00FF87] border-[#00FF87]/40 shadow-[0_0_15px_rgba(0,255,135,0.2)]'
                  : 'bg-[#0A0D0B] text-stone-400 border-white/10 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00FF87]" />
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
          <div className="glass-panel rounded-2xl border border-amber-500/30 p-8 text-center max-w-2xl mx-auto shadow-2xl">
            <div className="w-12 h-12 bg-amber-950/60 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-amber-500/30">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-['Syne',sans-serif]">
              {t.noDataTitle}
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm mb-4 leading-relaxed font-mono">
              {searchResult.message || t.noDataMsg}
            </p>
            <p className="text-[11px] font-mono text-stone-500">
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
              <div className="space-y-8 pt-4 border-t border-white/10">
                <div className="glass-panel-elevated p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-emerald-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#00FF87] font-bold">
                      Currently Focused Market Telemetry
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-['Syne',sans-serif]">
                      {selectedMarket.market_name} ({selectedMarket.district})
                    </h3>
                  </div>
                  <div className="text-xs font-mono bg-[#0A0D0B] px-3.5 py-2 rounded-xl border border-white/15 self-start sm:self-auto">
                    Modal Rate: <strong className="text-[#00FF87] text-base tnum font-bold">₹{selectedMarket.modal_price}/quintal</strong>
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
          className="bg-[#0A0D0B] hover:bg-[#111713] text-white font-mono font-bold px-4 py-2.5 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.3)] border border-amber-400/80 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer text-xs sm:text-sm"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
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

      {/* Educational Term Modal (PRD Sec 15) */}
      <ExplainModal
        term={explanationTerm}
        language={language}
        onClose={() => setExplanationTerm(null)}
      />

      {/* Footer */}
      <footer className="bg-[#0A0D0B] text-stone-500 text-xs py-8 border-t border-white/10 mt-12 no-print font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white text-sm font-['Syne',sans-serif]">🌾 MandiMate Terminal</span>
            <p className="text-stone-500 mt-0.5 text-[11px]">
              AI-assisted agro-financial intelligence platform for small & marginal farmers.
            </p>
          </div>
          <div className="text-center sm:text-right text-[10px] text-stone-500 space-y-0.5">
            <div>Data Source: Agmarknet / Directorate of Marketing & Inspection, Ministry of Agriculture</div>
            <div>Strict Data Invariant: 100% Deterministic Ground Truth • Firebase Spark & AWS Cloud Ready</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
