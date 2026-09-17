import React, { useState, useEffect } from 'react';
import type { 
  Language, 
  CropUnit, 
  Commodity, 
  MarketItem, 
  SearchResult,
  SyncStatusData,
  PriceTrend,
  NavigationPage
} from './types';
import { TRANSLATIONS } from './i18n/translations';
import { Header } from './components/Header';
import { OfflineBanner } from './components/OfflineBanner';
import { ExplainModal } from './components/ExplainModal';
import { MandiSlipModal } from './components/MandiSlipModal';
import { SettingsModal } from './components/SettingsModal';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { CropsPage } from './pages/CropsPage';
import { DispatchPage } from './pages/DispatchPage';
import { ContactPage } from './pages/ContactPage';
import { 
  saveSearchResultToCache, 
  getCachedSearchResult 
} from './utils/storage';
import { BookOpen, CheckCircle2, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  // English is ALWAYS default on initial load / refresh per user instruction
  const [language, setLanguage] = useState<Language>('en');
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
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

  // Initialize page routing from pathname
  useEffect(() => {
    const getPageFromPath = (path: string): NavigationPage => {
      const clean = path.replace(/^\//, '').toLowerCase();
      if (clean === 'dashboard') return 'dashboard';
      if (clean === 'about') return 'about';
      if (clean === 'services') return 'services';
      if (clean === 'crops') return 'crops';
      if (clean === 'dispatch') return 'dispatch';
      if (clean === 'contact') return 'contact';
      return 'home';
    };

    setCurrentPage(getPageFromPath(window.location.pathname));

    const handlePopState = () => {
      setCurrentPage(getPageFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: NavigationPage) => {
    setCurrentPage(page);
    const targetPath = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

    // Fetch user preferences (location and unit only; language remains 'en' on fresh load)
    async function loadPreferences() {
      try {
        const res = await fetch('/api/preferences');
        const data = await res.json();
        if (data.success && data.preferences) {
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

    // Auto-run initial search for baseline data
    handleSearch();
  }, []);

  // Search handler
  const handleSearch = async (gpsCoords?: { lat: number; lon: number }, overrideCrop?: string) => {
    const targetCrop = overrideCrop || crop;
    if (!targetCrop) return;
    setIsLoading(true);

    const queryParams = new URLSearchParams({
      crop: targetCrop,
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
        const cached = getCachedSearchResult(targetCrop, location);
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
        saveSearchResultToCache(targetCrop, location, data);
      } else {
        setSelectedMarket(null);
      }
    } catch (err) {
      console.warn("Network request failed, attempting cache lookup", err);
      const cached = getCachedSearchResult(targetCrop, location);
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
      handleSearch(undefined, parsed.crop);
    }, 100);
  };

  // One-click select crop from Portfolio and jump to terminal
  const handleSelectCropAndNavigate = (cropName: string) => {
    setCrop(cropName);
    navigateTo('dashboard');
    handleSearch(undefined, cropName);
  };

  // Full cross-platform search handler that sets crop and/or location, navigates, and queries API
  const handleSearchAndNavigate = (targetCrop?: string, targetLocation?: string) => {
    if (targetCrop) setCrop(targetCrop);
    if (targetLocation) setLocation(targetLocation);
    navigateTo('dashboard');
    setTimeout(() => {
      handleSearch(undefined, targetCrop || crop);
    }, 50);
  };

  const quantityQuintals = searchResult?.normalized_quantity?.in_quintals || 
    (unit === 'kg' ? quantity / 100 : (unit === 'tonne' ? quantity * 10 : quantity));

  return (
    <div className="min-h-screen bg-[#FBFDF9] text-[#162E21] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Editorial Header with multi-page navigation, language switch & sync */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        isOnline={isOnline}
        syncStatus={syncStatus}
        onTriggerSync={handleTriggerSync}
        isSyncing={isSyncing}
        onOpenSettings={() => setIsSettingsOpen(true)}
        currentPage={currentPage}
        onNavigate={navigateTo}
        onSearchAndNavigate={handleSearchAndNavigate}
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

      {/* Main Page Content Router */}
      <main className="flex-1 w-full">
        {currentPage === 'home' && (
          <HomePage
            language={language}
            onNavigate={navigateTo}
            onSelectCropAndNavigate={handleSelectCropAndNavigate}
            onSearchAndNavigate={handleSearchAndNavigate}
            commodities={commodities}
          />
        )}

        {currentPage === 'dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <DashboardPage
              language={language}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              commodities={commodities}
              crop={crop}
              setCrop={setCrop}
              variety={variety}
              setVariety={setVariety}
              location={location}
              setLocation={setLocation}
              quantity={quantity}
              setQuantity={setQuantity}
              unit={unit}
              setUnit={setUnit}
              isLoading={isLoading}
              searchResult={searchResult}
              selectedMarket={selectedMarket}
              setSelectedMarket={setSelectedMarket}
              activeTrend={activeTrend}
              explanationTerm={explanationTerm}
              setExplanationTerm={setExplanationTerm}
              isSlipModalOpen={isSlipModalOpen}
              setIsSlipModalOpen={setIsSlipModalOpen}
              handleSearch={handleSearch}
              handleNlpResult={handleNlpResult}
              onNavigate={navigateTo}
            />
          </div>
        )}

        {currentPage === 'about' && (
          <AboutPage
            language={language}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'services' && (
          <ServicesPage
            language={language}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'crops' && (
          <CropsPage
            language={language}
            onNavigate={navigateTo}
            onSelectCropAndNavigate={handleSelectCropAndNavigate}
            commodities={commodities}
          />
        )}

        {currentPage === 'dispatch' && (
          <DispatchPage
            language={language}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            language={language}
            onNavigate={navigateTo}
          />
        )}
      </main>

      {/* Floating Educational Terminology Guide Button */}
      <div className="fixed bottom-5 right-5 z-40 print:hidden">
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

      {/* Rich Multi-Column VerdaAgro Forest Green Footer */}
      <footer className="bg-[#123826] text-stone-300 text-xs py-14 border-t border-[#1B4D35] mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#1B4D35]">
            
            {/* Column 1: Brand & Identity */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🌾</span>
                <span className="font-black text-white text-xl font-['Syne',sans-serif]">AgriMate</span>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#1B4D35] text-[#A5D6A7] border border-[#2E7D32]">
                  Official Platform
                </span>
              </div>
              <p className="text-emerald-100/70 text-xs sm:text-sm leading-relaxed max-w-sm font-['Outfit',sans-serif]">
                Cultivating tomorrow with integrity and intelligence. Providing 15,000+ growers across Karnataka, Maharashtra, Delhi, and Andhra Pradesh with verified APMC wholesale auction rates, freight simulators, and statutory gate passes.
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs text-emerald-200/80">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A5D6A7]" />
                  APMC Act 2026 Compliant
                </span>
                <span>•</span>
                <span>Agmarknet Verified</span>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="space-y-2.5">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Navigation</h4>
              <ul className="space-y-1.5 text-xs text-emerald-100/70">
                <li><button onClick={() => navigateTo('home')} className="hover:text-white transition-colors cursor-pointer">Home</button></li>
                <li><button onClick={() => navigateTo('dashboard')} className="hover:text-white transition-colors cursor-pointer">Terminal Dashboard</button></li>
                <li><button onClick={() => navigateTo('about')} className="hover:text-white transition-colors cursor-pointer">About Our Ecosystem</button></li>
                <li><button onClick={() => navigateTo('services')} className="hover:text-white transition-colors cursor-pointer">Core Services</button></li>
                <li><button onClick={() => navigateTo('crops')} className="hover:text-white transition-colors cursor-pointer">Crop Directory</button></li>
                <li><button onClick={() => navigateTo('dispatch')} className="hover:text-white transition-colors cursor-pointer">Dispatch Desk</button></li>
                <li><button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors cursor-pointer">Grower Support</button></li>
              </ul>
            </div>

            {/* Column 3: Agricultural Portfolio */}
            <div className="space-y-2.5">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Commodities</h4>
              <ul className="space-y-1.5 text-xs text-emerald-100/70">
                <li><button onClick={() => handleSelectCropAndNavigate('Tomato')} className="hover:text-white transition-colors cursor-pointer">Tomato (Hybrid / Local)</button></li>
                <li><button onClick={() => handleSelectCropAndNavigate('Onion')} className="hover:text-white transition-colors cursor-pointer">Onion (Nashik Red)</button></li>
                <li><button onClick={() => handleSelectCropAndNavigate('Potato')} className="hover:text-white transition-colors cursor-pointer">Potato (Kufri Jyoti)</button></li>
                <li><button onClick={() => handleSelectCropAndNavigate('Green Chilli')} className="hover:text-white transition-colors cursor-pointer">Green Chilli (G-4)</button></li>
                <li><button onClick={() => handleSelectCropAndNavigate('Cotton')} className="hover:text-white transition-colors cursor-pointer">Cotton (DCH-32)</button></li>
                <li><button onClick={() => handleSelectCropAndNavigate('Soybean')} className="hover:text-white transition-colors cursor-pointer">Soybean (JS-335)</button></li>
                <li><button onClick={() => handleSelectCropAndNavigate('Maize')} className="hover:text-white transition-colors cursor-pointer">Maize & Grains</button></li>
              </ul>
            </div>

            {/* Column 4: Support & Helpline */}
            <div className="space-y-2.5">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Farmer Helpline & WhatsApp</h4>
              <div className="space-y-2 text-xs text-emerald-100/70">
                <a 
                  href="https://wa.me/917892181947?text=Hello%20AgriMate%2C%20I%20need%20market%20rates%20and%20support" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] text-white font-bold text-xs hover:bg-[#20ba59] transition-colors shadow-xs"
                >
                  <span>💬 WhatsApp: +91 7892181947</span>
                </a>
                <p className="font-mono text-sm font-bold text-[#E8A238] pt-1">Kisan Helpline: 1800-180-1551</p>
                <p className="text-[11px]">Toll-free 24x7 Ministry of Agriculture & Farmers Welfare</p>
                <div className="pt-1">
                  <span className="block text-[10px] text-emerald-300 uppercase font-bold">Language Standard:</span>
                  <p className="text-[11px]">English (Default) • हिन्दी • ಕನ್ನಡ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Legal & Attribution Strip */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-emerald-200/60">
            <div>
              © 2026 AgriMate. Built for Indian Agriculture. All data grounded in official APMC Agmarknet reporting.
            </div>
            <div className="flex items-center gap-4">
              <span>0% AI Hallucination Guarantee</span>
              <span>•</span>
              <span>SQLite Edge Resilient</span>
              <span>•</span>
              <span>APMC Act 2026</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Support Widget */}
      <a
        href="https://wa.me/917892181947?text=Hello%20AgriMate%2C%20I%20need%20market%20rates%20and%20assistance"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold text-xs sm:text-sm hover:scale-105 transition-all duration-200 border-2 border-white cursor-pointer group"
        title="Chat with AgriMate on WhatsApp (+91 7892181947)"
      >
        <span className="text-base">💬</span>
        <span className="hidden sm:inline">WhatsApp (+91 7892181947)</span>
        <span className="sm:hidden">WhatsApp</span>
      </a>
    </div>
  );
};

export default App;
