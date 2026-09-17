import React from 'react';
import type { Language, SyncStatusData } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { ShieldCheck, Wifi, WifiOff, Globe, RefreshCw, Settings, Database } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isOnline: boolean;
  syncStatus?: SyncStatusData | null;
  onTriggerSync?: () => void;
  isSyncing?: boolean;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  isOnline,
  syncStatus,
  onTriggerSync,
  isSyncing = false,
  onOpenSettings
}) => {
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

      {/* Main Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative w-11 h-11 rounded-2xl bg-[#EBF5ED] border border-[#CCE0D0] flex items-center justify-center text-2xl shadow-xs shrink-0">
            🌾
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#2E7D32] rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#123826] font-['Syne',sans-serif] flex items-center gap-2">
              <span>{t.appTitle}</span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#EBF5ED] text-[#123826] px-2 py-0.5 rounded-full border border-[#D5E7D8]">
                VerdaAgro Edition
              </span>
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm font-medium mt-0.5">
              {t.appTagline}
            </p>
          </div>
        </div>

        {/* Clean trust badge */}
        <div className="hidden md:flex items-center gap-3 text-xs">
          {syncStatus && syncStatus.total_verified_records > 0 && (
            <div className="flex items-center gap-1.5 bg-[#F4F8F5] border border-[#E2ECE3] px-3 py-1.5 rounded-xl text-stone-600 font-mono">
              <Database className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>{syncStatus.total_verified_records.toLocaleString('en-IN')} Records</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 bg-[#F4F8F5] border border-[#E2ECE3] px-3.5 py-1.5 rounded-xl text-stone-700">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
            <span className="font-semibold text-[#123826]">Official APMC Verified Data</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
