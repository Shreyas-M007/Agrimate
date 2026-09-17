import React, { useState } from 'react';
import type { Language, SyncStatusData, NavigationPage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { 
  Globe, 
  Settings, 
  Menu, 
  X, 
  ArrowRight,
  Bell,
  Search,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isOnline?: boolean;
  syncStatus?: SyncStatusData | null;
  onTriggerSync?: () => void;
  isSyncing?: boolean;
  onOpenSettings?: () => void;
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  onSearchAndNavigate?: (crop?: string, location?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onOpenSettings,
  currentPage,
  onNavigate,
  onSearchAndNavigate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const t = TRANSLATIONS[language];

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
                AgriMate
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#EBF5ED] text-[#123826] px-2 py-0.5 rounded-full border border-[#D5E7D8]">
                Intelligence
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
        <div className="flex items-center gap-2 relative">
          {/* Quick Search Button */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="p-2 rounded-xl bg-white hover:bg-[#F2F8F4] text-[#123826] border border-[#CCE0D0] transition-colors cursor-pointer shadow-xs hidden sm:flex items-center gap-1.5 text-xs font-semibold"
            title="Search Mandi Rates"
          >
            <Search className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span className="hidden md:inline">Search</span>
          </button>

          {/* Notifications Bell with unread counter (AgridFlow style) */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl bg-white hover:bg-[#F2F8F4] text-[#123826] border border-[#CCE0D0] transition-colors cursor-pointer shadow-xs"
              title="Mandi Live Broadcast Alerts"
              aria-label="Mandi Notifications"
            >
              <Bell className="w-4 h-4 text-[#123826]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E8A238] text-[#123826] text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                3
              </span>
            </button>

            {/* Notification Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-[#D5E7D8] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2ECE3]">
                  <span className="text-xs font-bold text-[#123826] uppercase tracking-wider">
                    APMC Live Feeds
                  </span>
                  <span className="text-[10px] text-[#2E7D32] font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Real-Time
                  </span>
                </div>

                <div className="py-2 space-y-2">
                  <div 
                    onClick={() => { handleNavClick('dashboard'); setNotificationsOpen(false); }}
                    className="p-2.5 rounded-xl bg-[#F7FBF8] hover:bg-[#EBF5ED] transition-colors cursor-pointer border border-[#E2ECE3]"
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-[#123826]">
                      <span>🌽 Davanagere Mandi</span>
                      <span className="text-emerald-700 font-mono">+4.2%</span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-0.5">Maize rate firm at ₹2,150/q with 3,400 bags arrived today.</p>
                  </div>

                  <div 
                    onClick={() => { handleNavClick('dashboard'); setNotificationsOpen(false); }}
                    className="p-2.5 rounded-xl bg-[#F7FBF8] hover:bg-[#EBF5ED] transition-colors cursor-pointer border border-[#E2ECE3]"
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-[#123826]">
                      <span>🍅 Kolar APMC</span>
                      <span className="text-emerald-700 font-mono">+2.6%</span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-0.5">Tomato modal auction ₹1,850/q. High grade arrivals fetching ₹2,100.</p>
                  </div>

                  <div 
                    onClick={() => { handleNavClick('dashboard'); setNotificationsOpen(false); }}
                    className="p-2.5 rounded-xl bg-[#F7FBF8] hover:bg-[#EBF5ED] transition-colors cursor-pointer border border-[#E2ECE3]"
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-[#123826]">
                      <span>🧅 Lasalgaon Mandi</span>
                      <span className="text-emerald-700 font-mono">+1.9%</span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-0.5">Onion trading stable at ₹1,650/q. Export inquiries active.</p>
                  </div>
                </div>

                <button
                  onClick={() => { handleNavClick('dashboard'); setNotificationsOpen(false); }}
                  className="w-full py-2 rounded-xl bg-[#123826] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#1a4a34] transition-colors cursor-pointer"
                >
                  <span>Open Full Dashboard Terminal</span>
                  <ArrowRight className="w-3 h-3 text-[#E8A238]" />
                </button>
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <div className="hidden sm:flex items-center bg-white p-0.5 rounded-xl border border-[#CCE0D0] shadow-xs">
            <Globe className="w-3.5 h-3.5 ml-2 mr-1 text-stone-500" />
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                language === 'en' 
                  ? 'bg-[#123826] text-white shadow-xs font-bold' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                language === 'hi' 
                  ? 'bg-[#123826] text-white shadow-xs font-bold' 
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => onLanguageChange('kn')}
              className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
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
              className="p-2 rounded-xl bg-white hover:bg-[#F2F8F4] text-stone-700 border border-[#CCE0D0] transition-all cursor-pointer shadow-xs hidden sm:flex items-center justify-center"
              title="Preferences & Data Sync"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4 text-[#123826]" />
            </button>
          )}

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
        <div className="lg:hidden border-t border-[#E2ECE3] bg-white px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
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

          {/* Mobile Language Switcher */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#F4F8F5] border border-[#E2ECE3]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#123826]">
              <Globe className="w-3.5 h-3.5 text-stone-500" />
              <span>Language:</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  language === 'en' ? 'bg-[#123826] text-white' : 'text-stone-600'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  language === 'hi' ? 'bg-[#123826] text-white' : 'text-stone-600'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => onLanguageChange('kn')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  language === 'kn' ? 'bg-[#123826] text-white' : 'text-stone-600'
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>
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

      {/* Global Quick Search Modal Palette */}
      {searchModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150"
          onClick={() => setSearchModalOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#CCE0D0] overflow-hidden p-5 space-y-4 animate-in zoom-in-95 duration-150 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 pb-3 border-b border-[#E2ECE3]">
              <div className="w-10 h-10 rounded-xl bg-[#EBF5ED] text-[#2E7D32] flex items-center justify-center shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                autoFocus
                value={headerSearchQuery}
                onChange={(e) => setHeaderSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (headerSearchQuery.trim()) {
                      if (onSearchAndNavigate) onSearchAndNavigate(headerSearchQuery.trim(), undefined);
                      else handleNavClick('dashboard');
                      setSearchModalOpen(false);
                      setHeaderSearchQuery('');
                    }
                  } else if (e.key === 'Escape') {
                    setSearchModalOpen(false);
                  }
                }}
                placeholder="Type crop name (Tomato, Onion...) or APMC mandi (Kolar, Ballari)..."
                className="w-full text-sm font-semibold text-[#123826] outline-none placeholder:text-stone-400 placeholder:font-normal"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Match List */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block">
                {headerSearchQuery ? 'Matching Commodities & Mandis' : 'Quick Access Commodities'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { name: 'Tomato', icon: '🍅', tag: 'Hybrid / Local', mandi: 'Ballari, Kolar' },
                  { name: 'Onion', icon: '🧅', tag: 'Nashik Red', mandi: 'Lasalgaon, Hubballi' },
                  { name: 'Maize', icon: '🌽', tag: 'Hybrid Yellow', mandi: 'Davanagere, Bellary' },
                  { name: 'Green Chilli', icon: '🌶️', tag: 'G-4 Hot', mandi: 'Guntur, Ballari' },
                  { name: 'Potato', icon: '🥔', tag: 'Kufri Jyoti', mandi: 'Hassan, Agra' },
                  { name: 'Cotton', icon: '☁️', tag: 'DCH-32', mandi: 'Hubballi, Raichur' },
                  { name: 'Paddy / Rice', icon: '🍚', tag: 'Sona Masoori', mandi: 'Sindhanur, Davanagere' },
                  { name: 'Soybean', icon: '🌱', tag: 'JS-335', mandi: 'Latur, Indore' }
                ]
                  .filter(item => 
                    !headerSearchQuery || 
                    item.name.toLowerCase().includes(headerSearchQuery.toLowerCase()) || 
                    item.mandi.toLowerCase().includes(headerSearchQuery.toLowerCase()) ||
                    item.tag.toLowerCase().includes(headerSearchQuery.toLowerCase())
                  )
                  .map((item) => (
                    <div
                      key={item.name}
                      onClick={() => {
                        if (onSearchAndNavigate) onSearchAndNavigate(item.name, undefined);
                        else handleNavClick('dashboard');
                        setSearchModalOpen(false);
                        setHeaderSearchQuery('');
                      }}
                      className="p-2.5 rounded-xl bg-[#F7FBF8] hover:bg-[#EBF5ED] border border-[#E2ECE3] hover:border-[#2E7D32] transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <strong className="text-xs text-[#123826] block">{item.name}</strong>
                          <span className="text-[10px] text-stone-500">{item.tag}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#2E7D32] bg-white px-2 py-0.5 rounded-md border border-[#D5E7D8]">
                        APMC Rates
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2ECE3] flex items-center justify-between text-[11px] text-stone-500">
              <span>Press <kbd className="font-mono bg-stone-100 px-1.5 py-0.5 rounded border border-stone-300">Enter</kbd> to search terminal</span>
              <button
                onClick={() => {
                  if (onSearchAndNavigate) onSearchAndNavigate(headerSearchQuery || 'Tomato', undefined);
                  else handleNavClick('dashboard');
                  setSearchModalOpen(false);
                  setHeaderSearchQuery('');
                }}
                className="font-bold text-[#2E7D32] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Launch Full Terminal</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
