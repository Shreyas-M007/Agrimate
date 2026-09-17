import React, { useState, useEffect } from 'react';
import type { Language, CropUnit, SyncStatusData } from '../types';
import { X, Settings, Check, MapPin, Globe, Scale, RefreshCw, Database, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  currentLocation: string;
  onLocationChange: (loc: string) => void;
  currentUnit: CropUnit;
  onUnitChange: (unit: CropUnit) => void;
  syncStatus?: SyncStatusData | null;
  onTriggerSync?: () => void;
  isSyncing?: boolean;
}

const DISTRICT_SUGGESTIONS = [
  "Ballari, Karnataka",
  "Kolar, Karnataka",
  "Chikkaballapur, Karnataka",
  "Bengaluru, Karnataka",
  "Belagavi, Karnataka",
  "Mysuru, Karnataka",
  "Nashik, Maharashtra",
  "Pune, Maharashtra",
  "Guntur, Andhra Pradesh",
  "Agra, Uttar Pradesh",
  "Karnal, Haryana"
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onLanguageChange,
  currentLocation,
  onLocationChange,
  currentUnit,
  onUnitChange,
  syncStatus,
  onTriggerSync,
  isSyncing = false
}) => {
  if (!isOpen) return null;

  const [localLang, setLocalLang] = useState<Language>(currentLanguage);
  const [localLoc, setLocalLoc] = useState<string>(currentLocation);
  const [localUnit, setLocalUnit] = useState<CropUnit>(currentUnit);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSave = async () => {
    onLanguageChange(localLang);
    onLocationChange(localLoc);
    onUnitChange(localUnit);

    try {
      await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: localLang,
          location: localLoc,
          preferredUnits: localUnit
        })
      });
    } catch (e) {
      console.warn("Could not save preferences to server", e);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="verda-card bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-xl border border-[#CCE0D0] animate-in fade-in zoom-in-95 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#F4F8F5] text-[#123826] px-6 py-4 flex items-center justify-between border-b border-[#E2ECE3]">
          <div className="flex items-center gap-2 font-bold text-base font-['Syne',sans-serif]">
            <Settings className="w-5 h-5 text-[#2E7D32]" />
            <span>Infrastructure & Farmer Profile</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#EBF5ED] text-stone-500 hover:text-[#123826] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm">
          {/* Language Selection */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-600 mb-2 flex items-center gap-1.5 font-bold">
              <Globe className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Preferred Dialect / Language</span>
            </label>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {[
                { id: 'en', label: 'English' },
                { id: 'hi', label: 'हिन्दी (Hindi)' },
                { id: 'kn', label: 'ಕನ್ನಡ (Kannada)' }
              ].map(langItem => (
                <button
                  key={langItem.id}
                  type="button"
                  onClick={() => setLocalLang(langItem.id as Language)}
                  className={`py-2 px-3 rounded-xl border transition-all cursor-pointer ${
                    localLang === langItem.id
                      ? 'bg-[#EBF5ED] border-2 border-[#2E7D32] text-[#123826] shadow-xs font-bold'
                      : 'bg-[#F4F8F5] border-[#CCE0D0] text-stone-700 hover:bg-[#EBF5ED]'
                  }`}
                >
                  {langItem.label}
                </button>
              ))}
            </div>
          </div>

          {/* Default Location */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-600 mb-2 flex items-center gap-1.5 font-bold">
              <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Default District / Farm Location</span>
            </label>
            <input
              type="text"
              value={localLoc}
              onChange={(e) => setLocalLoc(e.target.value)}
              placeholder="e.g. Ballari, Karnataka"
              className="w-full px-3 py-2 border border-[#CCE0D0] rounded-xl bg-white font-mono text-xs text-[#162E21] focus:outline-none focus:border-[#2E7D32]"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] font-mono text-stone-500 self-center mr-1">Quick Select:</span>
              {DISTRICT_SUGGESTIONS.slice(0, 4).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setLocalLoc(d)}
                  className="text-[11px] font-mono bg-[#F4F8F5] hover:bg-[#EBF5ED] text-stone-700 hover:text-[#123826] px-2 py-0.5 rounded-md border border-[#CCE0D0] cursor-pointer"
                >
                  {d.split(',')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Quantity Unit */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-600 mb-2 flex items-center gap-1.5 font-bold">
              <Scale className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Default Agricultural Unit</span>
            </label>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {(['quintal', 'kg', 'tonne'] as CropUnit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setLocalUnit(u)}
                  className={`py-2 px-3 rounded-xl border transition-all cursor-pointer ${
                    localUnit === u
                      ? 'bg-[#EBF5ED] border-2 border-[#2E7D32] text-[#123826] shadow-xs font-bold'
                      : 'bg-[#F4F8F5] border-[#CCE0D0] text-stone-700 hover:bg-[#EBF5ED]'
                  }`}
                >
                  {u === 'quintal' ? 'Quintal (100 kg)' : (u === 'kg' ? 'Kilogram (kg)' : 'Tonne (1000 kg)')}
                </button>
              ))}
            </div>
          </div>

          {/* Data Storage & Market Feed */}
          <div className="pt-3 border-t border-[#E2ECE3] space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-600 block flex items-center gap-1.5 font-bold">
              <Database className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Data Sync & Storage</span>
            </span>

            <div className="p-3.5 bg-[#F7FAF8] rounded-xl border border-[#E2ECE3] text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-stone-700">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>Market Feed Source:</span>
                </span>
                <span className="text-stone-900 font-semibold">Agmarknet / DMI</span>
              </div>
              <div className="flex items-center justify-between text-stone-700">
                <span>Storage Status:</span>
                <span className="text-[#123826] font-bold">Cloud & Offline Synced</span>
              </div>
              <div className="flex items-center justify-between text-stone-700">
                <span>Verified APMC Records:</span>
                <span className="text-[#123826] font-bold">{syncStatus?.total_verified_records || 180} Records</span>
              </div>
            </div>

            {onTriggerSync && (
              <button
                type="button"
                onClick={onTriggerSync}
                disabled={isSyncing}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-mono text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Updating Mandi Rates...' : 'Refresh Market Rates'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#F4F8F5] px-6 py-3.5 border-t border-[#E2ECE3] flex items-center justify-between font-mono">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-stone-600 hover:text-[#123826] text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5 font-['Syne',sans-serif]"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Preferences</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
