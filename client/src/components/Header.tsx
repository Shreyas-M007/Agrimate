import React from 'react';
import type { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { ShieldCheck, Wifi, WifiOff, Sparkles, Globe } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  isOnline
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="bg-emerald-800 text-white shadow-md border-b-4 border-emerald-950">
      {/* Top utility row */}
      <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm border-b border-emerald-700/60">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span className="tracking-wide text-emerald-100">{t.dataIntegrityBadge}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Online/Offline status indicator (PRD Sec 25) */}
          <div 
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isOnline ? 'bg-emerald-900/80 text-emerald-200' : 'bg-amber-500 text-amber-950'
            }`}
            aria-live="polite"
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-300" />
                <span>Live Mode</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-950 animate-pulse" />
                <span>Offline (Cached)</span>
              </>
            )}
          </div>

          {/* Language Switcher (PRD Sec 24) */}
          <div className="flex items-center bg-emerald-950/80 p-0.5 rounded-lg border border-emerald-600">
            <Globe className="w-3.5 h-3.5 ml-2 mr-1 text-emerald-300" />
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                language === 'en' ? 'bg-amber-400 text-emerald-950 shadow-sm' : 'text-emerald-200 hover:text-white'
              }`}
              aria-label="Switch to English"
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2.5 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                language === 'hi' ? 'bg-amber-400 text-emerald-950 shadow-sm' : 'text-emerald-200 hover:text-white'
              }`}
              aria-label="हिंदी में बदलें"
            >
              हिन्दी
            </button>
            <button
              onClick={() => onLanguageChange('kn')}
              className={`px-2.5 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                language === 'kn' ? 'bg-amber-400 text-emerald-950 shadow-sm' : 'text-emerald-200 hover:text-white'
              }`}
              aria-label="ಕನ್ನಡಕ್ಕೆ ಬದಲಿಸಿ"
            >
              ಕನ್ನಡ
            </button>
          </div>
        </div>
      </div>

      {/* Main hero brand row */}
      <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-amber-400 text-emerald-950 rounded-2xl flex items-center justify-center font-black text-3xl shadow-inner border-2 border-white/20">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-sm">
                {t.appTitle}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 bg-emerald-700 text-emerald-200 text-xs font-semibold rounded uppercase tracking-wider">
                v1.0 PRD
              </span>
            </div>
            <p className="text-emerald-200 text-sm sm:text-base font-medium mt-0.5">
              {t.appTagline}
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-emerald-900/60 border border-emerald-700/80 px-4 py-2.5 rounded-xl text-xs text-emerald-200">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>Bedrock AI Explanation Layer • Deterministic Calculations</span>
        </div>
      </div>
    </header>
  );
};
