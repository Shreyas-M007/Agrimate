import React, { useState } from 'react';
import type { Language, SyncStatusData, NavigationPage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { 
  Wifi, 
  WifiOff, 
  Globe, 
  RefreshCw, 
  Settings, 
  Menu, 
  X, 
  ArrowRight
} from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isOnline: boolean;
  syncStatus?: SyncStatusData | null;
  onTriggerSync?: () => void;
  isSyncing?: boolean;
  onOpenSettings?: () => void;
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  isOnline,
  syncStatus,
  onTriggerSync,
  isSyncing = false,
  onOpenSettings,
  currentPage,
  onNavigate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[language];

  const formatLastSync = (ts?: string) => {
    if (!ts) return 'Live Daily Base';
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Today';
    }
  };

  const navItems: { id: NavigationPage; label: string }[] = [
    { id: 'home', label: t.navHome },
    { id: 'dashboard', label: t.navDashboard },
    { id: 'about', label: t.navAbout },
    { id: 'services', label: t.navServices },
    { id: 'crops', label: t.navCrops },
    { id: 'dispatch', label: t.navDispatch },
    { id: 'contact', label: t.navContact },
  ];

  const handleNavClick = (pageId: NavigationPage) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-[#E2ECE3] sticky top-0 z-50 shadow-[0_4px_20px_-4px_rgba(18,56,38,0.06)]">
      {/* Top Agricultural Telemetry & Advisory Bar */}
      <div className="bg-[#EBF5ED] border-b border-[#D5E7D8] text-xs text-[#123826] py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-[#123826] font-bold text-[11px] shadow-xs border border-[#CCE0D0]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E7D32] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2E7D32]"></span>
              </span>
              <span>Live Daily Feed</span>
            </span>
            <span className="hidden sm:inline text-[#23583C] text-[11px]">
              Official APMC Market Rates • Directorate of Marketing & Inspection, Ministry of Agriculture
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Sync trigger button */}
            {onTriggerSync && (
              <button
                onClick={onTriggerSync}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white hover:bg-[#F2F8F4] text-[#123826] border border-[#CCE0D0] text-[11px] font-medium transition-all cursor-pointer shadow-xs disabled:opacity-50"
                title="Refresh latest Agmarknet market rates"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-[#2E7D32]' : 'text-[#2E7D32]'}`} />
                <span>{isSyncing ? 'Updating...' : 'Refresh Rates'}</span>
                {syncStatus && (
                  <span className="text-stone-500 hidden md:inline ml-1 font-mono text-[10px]">
                    ({formatLastSync(syncStatus.last_sync?.timestamp)})
                  </span>
                )}
              </button>
            )}

            {/* Online/Offline status */}
            <div 
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                isOnline 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3 h-3 text-[#2E7D32]" />
                  <span className="hidden xs:inline">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-600 animate-pulse" />
                  <span>Offline</span>
                </>
              )}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-white p-0.5 rounded-lg border border-[#CCE0D0] shadow-xs">
              <Globe className="w-3 h-3 ml-1.5 mr-1 text-stone-500" />
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  language === 'en' 
                    ? 'bg-[#123826] text-white shadow-xs font-bold' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  language === 'hi' 
                    ? 'bg-[#123826] text-white shadow-xs font-bold' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => onLanguageChange('kn')}
                className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  language === 'kn' 
                    ? 'bg-[#123826] text-white shadow-xs font-bold' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>

            {/* Settings Button */}
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="p-1 rounded-lg bg-white hover:bg-stone-50 text-stone-700 border border-[#CCE0D0] transition-all cursor-pointer shadow-xs"
                title="Preferences & Data Sync"
                aria-label="Settings"
              >
                <Settings className="w-3.5 h-3.5 text-[#123826]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Brand & Multi-Page Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-2xl bg-[#EBF5ED] border border-[#CCE0D0] flex items-center justify-center text-xl shadow-xs shrink-0 group-hover:scale-105 transition-transform">
            🌾
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#2E7D32] rounded-full border-2 border-white"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#123826] font-['Syne',sans-serif]">
                VerdaAgro
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#EBF5ED] text-[#123826] px-2 py-0.5 rounded-full border border-[#D5E7D8]">
                MandiMate
              </span>
            </div>
            <p className="text-stone-600 text-[11px] font-medium hidden sm:block">
              {t.appTagline}
            </p>
          </div>
        </div>

        {/* Desktop Multi-Page Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#F4F8F5] p-1 rounded-2xl border border-[#E2ECE3]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentPage === item.id
                  ? 'bg-[#123826] text-white shadow-xs'
                  : 'text-stone-600 hover:text-[#123826] hover:bg-white/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Button & Mobile Hamburger */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer ${
              currentPage === 'dashboard'
                ? 'bg-[#2E7D32] text-white'
                : 'bg-[#123826] hover:bg-[#1a4a34] text-white'
            }`}
          >
            <span>{t.openDashboard}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E8A238]" />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-[#CCE0D0] bg-white text-[#123826] hover:bg-[#F2F8F4] transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2ECE3] bg-white px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full p-2.5 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
                  currentPage === item.id
                    ? 'bg-[#123826] text-white shadow-xs'
                    : 'bg-[#F4F8F5] text-stone-700 hover:bg-[#E2ECE3]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#E2ECE3]">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="w-full py-3 rounded-xl bg-[#123826] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>{t.openDashboard}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E8A238]" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
