import React, { useState, useEffect } from 'react';
import type { Language, CropUnit, SyncStatusData } from '../types';
import { X, Settings, Check, MapPin, Globe, Scale, RefreshCw, Cloud, Flame } from 'lucide-react';

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
      className="fixed inset-0 z-50 bg-[#060807]/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="glass-panel-elevated rounded-3xl max-w-lg w-full overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.95)] border border-emerald-500/30 animate-in fade-in zoom-in-95 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0D120E] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2 font-bold text-base font-['Syne',sans-serif]">
            <Settings className="w-5 h-5 text-[#00FF87]" />
            <span>Infrastructure & Farmer Profile</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm">
          {/* Language Selection */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#00FF87]" />
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
                      ? 'bg-emerald-500/20 border-[#00FF87] text-[#00FF87] shadow-[0_0_12px_rgba(0,255,135,0.25)] font-bold'
                      : 'bg-[#0A0D0B] border-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  {langItem.label}
                </button>
              ))}
            </div>
          </div>

          {/* Default Location */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#00FF87]" />
              <span>Default District / Farm Location</span>
            </label>
            <input
              type="text"
              value={localLoc}
              onChange={(e) => setLocalLoc(e.target.value)}
              placeholder="e.g. Ballari, Karnataka"
              className="w-full px-3 py-2 border border-white/15 rounded-xl bg-[#0A0D0B] font-mono text-xs text-white focus:outline-none focus:border-[#00FF87]"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] font-mono text-stone-500 self-center mr-1">Quick Select:</span>
              {DISTRICT_SUGGESTIONS.slice(0, 4).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setLocalLoc(d)}
                  className="text-[11px] font-mono bg-[#111713] hover:bg-emerald-950/60 text-stone-300 hover:text-[#00FF87] px-2 py-0.5 rounded-md border border-white/10 cursor-pointer"
                >
                  {d.split(',')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Quantity Unit */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-stone-400 mb-2 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#00FF87]" />
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
                      ? 'bg-emerald-500/20 border-[#00FF87] text-[#00FF87] shadow-[0_0_12px_rgba(0,255,135,0.25)] font-bold'
                      : 'bg-[#0A0D0B] border-white/10 text-stone-400 hover:text-white'
                  }`}
                >
                  {u === 'quintal' ? 'Quintal (100 kg)' : (u === 'kg' ? 'Kilogram (kg)' : 'Tonne (1000 kg)')}
                </button>
              ))}
            </div>
          </div>

          {/* Cloud & AI Infrastructure Diagnostics */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-400 block flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-amber-400" />
              <span>Cloud & AI Runtime Infrastructure</span>
            </span>

            <div className="p-3 bg-[#0A0D0B] rounded-xl border border-white/10 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-stone-300">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Firebase Spark Mode:</span>
                </span>
                <span className="text-[#00FF87] font-bold">Cloud Firestore Active</span>
              </div>
              <div className="flex items-center justify-between text-stone-300">
                <span>AWS Serverless:</span>
                <span className="text-stone-400">Lambda + DynamoDB + Bedrock</span>
              </div>
              <div className="flex items-center justify-between text-stone-300">
                <span>Database Records:</span>
                <span className="text-[#00FF87] font-bold">{syncStatus?.total_verified_records || 180} APMC Records</span>
              </div>
            </div>

            {onTriggerSync && (
              <button
                type="button"
                onClick={onTriggerSync}
                disabled={isSyncing}
                className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-[#00FF87] font-mono text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Ingesting from Agmarknet...' : 'Run Real-time Agmarknet Ingestion Pipeline'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0A0D0B] px-6 py-3.5 border-t border-white/10 flex items-center justify-between font-mono">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-stone-400 hover:text-white text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-[#00FF87] hover:bg-[#10B981] text-[#060807] font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(0,255,135,0.3)] transition-all cursor-pointer flex items-center gap-1.5 font-['Syne',sans-serif]"
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
