import React, { useState, useRef, useEffect } from 'react';
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
  CheckCircle2,
  ChevronDown,
  Compass,
  LayoutDashboard,
  Info,
  Sparkles,
  Sprout,
  Truck,
  Headphones
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

const LANGUAGES: { code: Language; label: string; name: string }[] = [
  { code: 'en', label: 'English', name: 'EN' },
  { code: 'hi', label: 'हिन्दी', name: 'HI' },
  { code: 'kn', label: 'ಕನ್ನಡ', name: 'KN' },
  { code: 'te', label: 'తెలుగు', name: 'TE' },
  { code: 'ta', label: 'தமிழ்', name: 'TA' },
  { code: 'mr', label: 'मराठी', name: 'MR' },
  { code: 'bn', label: 'বাংলা', name: 'BN' },
  { code: 'gu', label: 'ગુજરાતી', name: 'GU' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', name: 'PA' },
  { code: 'ml', label: 'മലയാളം', name: 'ML' }
];

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
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language];

  // Close language dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    if (langDropdownOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [langDropdownOpen]);

  const navItems: { id: NavigationPage; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: t.navHome, icon: Compass },
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'about', label: t.navAbout, icon: Info },
    { id: 'services', label: t.navServices, icon: Sparkles },
    { id: 'crops', label: t.navCrops, icon: Sprout },
    { id: 'dispatch', label: t.navDispatch, icon: Truck },
    { id: 'contact', label: t.navContact, icon: Headphones },
  ];

  const handleNavClick = (pageId: NavigationPage) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  const SEARCH_LABELS: Record<Language, string> = {
    en: 'Search',
    hi: 'खोजें',
    kn: 'ಹುಡುಕಿ',
    te: 'శోధించండి',
    ta: 'தேடு',
    mr: 'शोधा',
    bn: 'অনুসন্ধান',
    gu: 'શોધો',
    pa: 'ਖੋਜੋ',
    ml: 'തിരയുക'
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] print:hidden">
      {/* Main Brand & Multi-Page Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo & Name (Clean Cultivo Style - No Cluttered Tagline) */}
        <div 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className="w-9 h-9 rounded-full bg-[#153424] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Sprout className="w-4.5 h-4.5 text-[#4ADE80]" />
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-[#153424] font-['Syne',sans-serif] notranslate" translate="no">
            AgriMate
          </span>
        </div>

        {/* Center: Floating Dark Pill Capsule Navigation (Cultivo Reference) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#181F1C] p-1.5 rounded-full border border-stone-800 shadow-md notranslate" translate="no">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-all duration-200 cursor-pointer flex items-center gap-1.5 select-none ${
                  isActive
                    ? 'bg-white text-[#153424] font-bold shadow-xs'
                    : 'text-stone-300 hover:text-white hover:bg-white/10 font-medium'
                }`}
              >
                {isActive && <Icon className="w-3.5 h-3.5 text-[#153424] shrink-0" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Mobile Hamburger (Cultivo Outlined Pill & Search) */}
        <div className="flex items-center gap-2 relative shrink-0">
          {/* Quick Search Button (Cultivo style text/icon link) */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full hover:bg-stone-100 text-stone-700 hover:text-[#153424] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold notranslate"
            translate="no"
            title={SEARCH_LABELS[language] || 'Search'}
          >
            <Search className="w-4 h-4 text-stone-600" />
            <span className="hidden sm:inline notranslate" translate="no">
              {SEARCH_LABELS[language] || 'Search'}
            </span>
          </button>

          {/* Notifications Bell with unread counter */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-full bg-white hover:bg-stone-100 text-[#153424] border border-stone-300 transition-colors cursor-pointer shadow-xs flex items-center justify-center"
              title="Mandi Live Broadcast Alerts"
              aria-label="Mandi Notifications"
            >
              <Bell className="w-4 h-4 text-[#153424]" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E8A238] text-[#123826] text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                3
              </span>
            </button>

            {/* Notification Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-xs font-bold text-[#153424] uppercase tracking-wider">
                    APMC Live Feeds
                  </span>
                  <span className="text-[10px] text-[#2E7D32] font-semibold bg-[#EAEFE9] px-2 py-0.5 rounded-full border border-[#D6DFD4] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Real-Time
                  </span>
                </div>

                <div className="py-2 space-y-2">
                  <div 
                    onClick={() => { handleNavClick('dashboard'); setNotificationsOpen(false); }}
                    className="p-2.5 rounded-xl bg-stone-50 hover:bg-[#EAEFE9] transition-colors cursor-pointer border border-stone-200/80"
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-[#153424]">
                      <span className="flex items-center gap-1.5"><span className="notranslate" translate="no">🌽</span> Davanagere Mandi</span>
                      <span className="text-emerald-700 font-mono">+4.2%</span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-0.5">Maize rate firm at ₹2,150/q with 3,400 bags arrived today.</p>
                  </div>

                  <div 
                    onClick={() => { handleNavClick('dashboard'); setNotificationsOpen(false); }}
                    className="p-2.5 rounded-xl bg-stone-50 hover:bg-[#EAEFE9] transition-colors cursor-pointer border border-stone-200/80"
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-[#153424]">
                      <span className="flex items-center gap-1.5"><span className="notranslate" translate="no">🍅</span> Kolar APMC</span>
                      <span className="text-emerald-700 font-mono">+2.6%</span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-0.5">Tomato modal auction ₹1,850/q. High grade arrivals fetching ₹2,100.</p>
                  </div>

                  <div 
                    onClick={() => { handleNavClick('dashboard'); setNotificationsOpen(false); }}
                    className="p-2.5 rounded-xl bg-stone-50 hover:bg-[#EAEFE9] transition-colors cursor-pointer border border-stone-200/80"
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-[#153424]">
                      <span className="flex items-center gap-1.5"><span className="notranslate" translate="no">🧅</span> Lasalgaon Mandi</span>
                      <span className="text-emerald-700 font-mono">+1.9%</span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-0.5">Onion trading stable at ₹1,650/q. Export inquiries active.</p>
                  </div>
                </div>

                <button
                  onClick={() => { handleNavClick('dashboard'); setNotificationsOpen(false); }}
                  className="w-full py-2 rounded-xl bg-[#153424] text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#1f4a34] transition-colors cursor-pointer"
                >
                  <span>Open Full Dashboard Terminal</span>
                  <ArrowRight className="w-3 h-3 text-[#E8A238]" />
                </button>
              </div>
            )}
          </div>

          {/* Language Switcher — Rounded Pill (Cultivo pill style) */}
          <div
            ref={langDropdownRef}
            className="relative flex items-center bg-white px-3 py-1.5 rounded-full border border-stone-300 hover:border-stone-400 shadow-xs gap-1.5 notranslate cursor-pointer select-none transition-colors"
            translate="no"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={langDropdownOpen}
            aria-label="Select language"
          >
            <Globe className="w-3.5 h-3.5 text-[#2E7D32] shrink-0" />
            <span className="text-xs font-bold text-[#153424] notranslate whitespace-nowrap">
              {LANGUAGES.find(l => l.code === language)?.label ?? 'English'} ({LANGUAGES.find(l => l.code === language)?.name ?? 'EN'})
            </span>
            <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform shrink-0 ${langDropdownOpen ? 'rotate-180' : ''}`} />

            {langDropdownOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl border border-stone-200 shadow-xl z-50 py-1.5 max-h-72 overflow-y-auto notranslate"
                translate="no"
                role="listbox"
                onClick={(e) => e.stopPropagation()}
              >
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    role="option"
                    aria-selected={language === lang.code}
                    onClick={() => { onLanguageChange(lang.code); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer notranslate ${
                      language === lang.code
                        ? 'bg-[#EBF5ED] text-[#123826] font-bold'
                        : 'text-stone-700 hover:bg-[#F4F8F5]'
                    }`}
                    translate="no"
                  >
                    {lang.label} <span className="text-stone-400 font-normal">({lang.name})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Outlined Pill CTA Button (Cultivo "Sign up free" style) */}
          <button
            onClick={() => handleNavClick('dashboard')}
            className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-stone-800 hover:bg-[#153424] hover:text-white hover:border-[#153424] text-stone-900 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <span>Terminal</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          {/* Settings Button */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 transition-all cursor-pointer shadow-xs hidden sm:flex items-center justify-center"
              title="Preferences & Data Sync"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4 text-[#123826]" />
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-full border border-stone-300 bg-white text-[#123826] hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-3 shadow-lg animate-slide-down">
          <div className="grid grid-cols-2 gap-2 notranslate" translate="no">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold text-left transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#153424] text-white shadow-xs'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Language Switcher */}
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 notranslate" translate="no">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#123826] mb-2">
              <Globe className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Language</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => { onLanguageChange(lang.code); setMobileMenuOpen(false); }}
                  className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer notranslate ${
                    language === lang.code
                      ? 'bg-[#123826] text-white'
                      : 'bg-white text-stone-700 border border-[#E2ECE3] hover:bg-[#EBF5ED]'
                  }`}
                  translate="no"
                >
                  {lang.label} <span className={language === lang.code ? 'text-emerald-300' : 'text-stone-400'}>({lang.name})</span>
                </button>
              ))}
            </div>
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
                        <span className="text-xl notranslate" translate="no">{item.icon}</span>
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
