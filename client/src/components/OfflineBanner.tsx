import React from 'react';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import type { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface OfflineBannerProps {
  isOnline: boolean;
  cachedAt?: string;
  language: Language;
  onRefresh?: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOnline,
  cachedAt,
  language,
  onRefresh
}) => {
  const t = TRANSLATIONS[language];

  if (isOnline && !cachedAt) {
    return null;
  }

  const formattedTime = cachedAt 
    ? new Date(cachedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null;

  return (
    <div 
      className="bg-amber-100 border-b-2 border-amber-300 px-4 py-3 text-amber-900 text-sm flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner"
      role="alert"
    >
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-amber-200 rounded-lg text-amber-800">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold block sm:inline mr-2">
            {!isOnline ? t.offlineWarning : t.offlineCachedNotice}
          </span>
          {formattedTime && (
            <span className="inline-flex items-center gap-1 font-mono text-xs bg-amber-200/80 px-2 py-0.5 rounded text-amber-950 font-semibold">
              <Clock className="w-3 h-3" />
              {formattedTime}
            </span>
          )}
        </div>
      </div>

      {isOnline && onRefresh && (
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Fetch Live Data</span>
        </button>
      )}
    </div>
  );
};
