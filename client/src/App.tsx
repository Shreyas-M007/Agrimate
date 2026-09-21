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
import { setSiteLanguage, clearAllTranslateCookies } from './utils/translator';
import { apiUrl } from './utils/api';
import { CheckCircle2, ShieldCheck, MessageSquare } from 'lucide-react';

export const App: React.FC = () => {
  // English is ALWAYS default on initial load / refresh per user instruction
  const [language, setLanguage] = useState<Language>('en');

  // Purge any stale Google Translate cookies on initial mount to guarantee pure English
  useEffect(() => {
    clearAllTranslateCookies();
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setSiteLanguage(newLang);
  };
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [activeTab, setActiveTab] = useState<'form' | 'nlp'>('form');

  // Commodities metadata
  const [commodities, setCommodities] = useState<Commodity[]>([]);

  // Search form state
  const [crop, setCrop] = useState<string>('Tomato');
  const [variety, setVariety] = useState<string>('Hybrid');
  const [location, setLocation] = useState<string>('Bengaluru');
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

  // Initialize page routing from hash and pathname
  useEffect(() => {
    const getPageFromLocation = (): NavigationPage => {
      // 1. Check hash first (e.g. #/dashboard, #dashboard)
      const hashClean = (window.location.hash || '').replace(/^#\/?/, '').split('?')[0].toLowerCase();
      if (['dashboard', 'about', 'services', 'crops', 'dispatch', 'contact'].includes(hashClean)) {
        return hashClean as NavigationPage;
      }
      // 2. Check pathname (e.g. /dashboard or /dashboard.html)
      const pathClean = window.location.pathname.replace(/^\//, '').replace(/\.html$/, '').toLowerCase();
      if (['dashboard', 'about', 'services', 'crops', 'dispatch', 'contact'].includes(pathClean)) {
        return pathClean as NavigationPage;
      }
      return 'home';
    };

    setCurrentPage(getPageFromLocation());

    const handleLocationChange = () => {
      setCurrentPage(getPageFromLocation());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (page: NavigationPage) => {
    setCurrentPage(page);
    // Hash routing guarantees 100% reloadable URLs on S3/static hosting without 403 AccessDenied
    window.location.hash = page === 'home' ? '' : `/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Re-apply site-wide dynamic translation whenever the page route changes
  useEffect(() => {
    if (language !== 'en') {
      const timer = setTimeout(() => {
        setSiteLanguage(language);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      try {
        const hostname = window.location.hostname;
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`;
      } catch {
        // silent
      }
    }
  }, [currentPage, language]);

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
      const res = await fetch(apiUrl('/sync/status'));
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
        const res = await fetch(apiUrl('/preferences'));
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
        const res = await fetch(apiUrl(`/trends?crop=${encodeURIComponent(crop)}&market_id=${encodeURIComponent(marketId)}&days=7`));
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
      const res = await fetch(apiUrl('/sync'), { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSyncToast(`Successfully synced ${data.records_synced} APMC records into SQLite & Cloud DB!`);
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
        const res = await fetch(apiUrl('/crops'));
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
      unit,
      pan_india: 'true'
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

      const res = await fetch(apiUrl(`/markets?${queryParams.toString()}`));
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
    <div 
      className="min-h-screen text-[#153424] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] relative" 
      style={{ background: '#F0EDE6' }}
    >
      {/* Global fixed farmland background — subtle on all pages */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1800&q=80&auto=format&fit=crop')`,
          opacity: 0.07,
          zIndex: 0,
        }}
        aria-hidden="true"
      />
      {/* Editorial Header with multi-page navigation, language switch & sync */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
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
        <div className="bg-[#153424] text-white font-semibold text-xs sm:text-sm px-4 py-2.5 text-center flex items-center justify-center gap-2 shadow-sm animate-in fade-in font-mono">
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

      {/* Main Page Content Router with Smooth Slide Transition */}
      <main key={currentPage} className="relative z-10 flex-1 w-full animate-slide-up">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
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
            onOpenTerminologyGuide={(term) => setExplanationTerm(term || 'modal_price')}
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



      {/* Farmer Preferences & Profile Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
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
      <footer className="relative z-10 bg-[#153424] text-stone-300 text-xs py-14 border-t border-[#1f4a34] mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10 pb-10 border-b border-[#1f4a34]">
            
            {/* Column 1: Brand & Identity */}
            <div className="space-y-3 max-w-lg">
              <div className="flex items-center gap-2.5 notranslate select-none" translate="no">
                <span className="text-2xl notranslate select-none" translate="no">🌾</span>
                <span className="font-black text-white text-xl font-['Syne',sans-serif] notranslate" translate="no">AgriMate</span>
              </div>
              <p className="text-emerald-100/70 text-xs sm:text-sm leading-relaxed font-['Outfit',sans-serif]">
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

            {/* Column 2: Farmer Helpline & Community */}
            <div className="space-y-2.5 shrink-0">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">Farmer Helpline & Community</h4>
              <div className="space-y-2 text-xs text-emerald-100/70">
                <a 
                  href="#whatsapp-group" 
                  onClick={(e) => {
                    e.preventDefault();
                    alert('AgriMate Farmers Community WhatsApp Group link will be active shortly.');
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#25D366] text-white font-bold text-xs hover:bg-[#20ba59] transition-colors shadow-xs cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Join Farmer WhatsApp Group</span>
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
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
