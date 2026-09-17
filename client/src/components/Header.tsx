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
    <header className="bg-[#0A0D0B]/90 backdrop-blur-xl border-b border-emerald-500/15 sticky top-0 z-50 shadow-[0_8px_30px_rgba(0,0,0,0.7)]">
      {/* Top Telemetry & Operational Bar */}
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-white/5">
        <div className="flex items-center gap-3 font-medium">
          {/* Live Pulse Dot */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF87] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF87]"></span>
            </span>
            <span className="text-[11px] tracking-wide text-[#00FF87] font-semibold">Live Market Rates</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-stone-400 text-[11px]">
            <span className="text-stone-300">{t.dataIntegrityBadge}</span>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Live Sync Trigger & Badge */}
          {onTriggerSync && (
            <button
              onClick={onTriggerSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 hover:text-[#00FF87] border border-emerald-500/20 text-xs font-mono transition-all cursor-pointer disabled:opacity-50 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(0,255,135,0.15)]"
              title="Refresh latest Agmarknet market rates"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#00FF87]' : 'text-emerald-400'}`} />
              <span className="font-semibold">{isSyncing ? 'Updating...' : 'Refresh Rates'}</span>
              {syncStatus && (
                <span className="text-[10px] text-stone-400 hidden md:inline ml-1 font-mono">
                  ({formatLastSync(syncStatus.last_sync?.timestamp)})
                </span>
              )}
            </button>
          )}

          {/* Records Indicator */}
          {syncStatus && syncStatus.total_verified_records > 0 && (
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-emerald-300/80 bg-white/5 px-2 py-1 rounded-lg border border-white/10">
              <Database className="w-3 h-3 text-[#00FF87]" />
              <span>{syncStatus.total_verified_records.toLocaleString('en-IN')} Records</span>
            </div>
          )}

          {/* Online/Offline status indicator */}
          <div 
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium ${
              isOnline 
                ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}
            aria-live="polite"
          >
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3 text-[#00FF87]" />
                <span className="hidden xs:inline">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-amber-400 animate-pulse" />
                <span>Offline</span>
              </>
            )}
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-[#060807] p-0.5 rounded-lg border border-white/10">
            <Globe className="w-3 h-3 ml-2 mr-1 text-stone-400" />
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                language === 'en' 
                  ? 'bg-emerald-500/20 text-[#00FF87] border border-[#00FF87]/40 shadow-[0_0_12px_rgba(0,255,135,0.2)] font-bold' 
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                language === 'hi' 
                  ? 'bg-emerald-500/20 text-[#00FF87] border border-[#00FF87]/40 shadow-[0_0_12px_rgba(0,255,135,0.2)] font-bold' 
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => onLanguageChange('kn')}
              className={`px-2 py-0.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                language === 'kn' 
                  ? 'bg-emerald-500/20 text-[#00FF87] border border-[#00FF87]/40 shadow-[0_0_12px_rgba(0,255,135,0.2)] font-bold' 
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              ಕನ್ನಡ
            </button>
          </div>

          {/* Settings Button */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/10 text-stone-400 hover:text-[#00FF87] border border-white/10 hover:border-emerald-500/30 transition-all cursor-pointer"
              title="Preferences & Data Sync"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Brand Terminal Row */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600/30 to-emerald-950 border border-emerald-500/30 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(0,255,135,0.15)] shrink-0">
            🌾
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#00FF87] rounded-full border-2 border-[#060807]"></div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-['Syne',sans-serif]">
              {t.appTitle}
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm font-medium mt-0.5">
              {t.appTagline}
            </p>
          </div>
        </div>

        {/* Clean trust badge */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-[#0F1411] border border-white/10 px-3.5 py-1.5 rounded-xl text-stone-300">
            <ShieldCheck className="w-4 h-4 text-[#00FF87]" />
            <span className="font-medium">Official Government APMC Data</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
