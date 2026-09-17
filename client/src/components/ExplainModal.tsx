import React, { useState, useEffect } from 'react';
import type { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { X, BookOpen, Lightbulb, Compass } from 'lucide-react';

interface ExplainModalProps {
  term: string | null;
  language: Language;
  onClose: () => void;
}

export const ExplainModal: React.FC<ExplainModalProps> = ({
  term,
  language,
  onClose
}) => {
  const t = TRANSLATIONS[language];
  const [termData, setTermData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>(term || 'modal_price');

  useEffect(() => {
    if (term) {
      setActiveTab(term);
    }
  }, [term]);

  useEffect(() => {
    let isMounted = true;
    async function fetchTerm() {
      try {
        const res = await fetch(`/api/explain-term/${activeTab}?lang=${language}`);
        const data = await res.json();
        if (isMounted && data.success) {
          setTermData(data.data);
        }
      } catch (err) {
        console.error("Error fetching term explanation", err);
      }
    }
    fetchTerm();
    return () => { isMounted = false; };
  }, [activeTab, language]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!term) return null;

  const termsList = [
    { key: 'modal_price', label: t.modalPrice },
    { key: 'min_price', label: t.minPrice },
    { key: 'max_price', label: t.maxPrice },
    { key: 'arrival_quantity', label: t.arrivalQty }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#060807]/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="glass-panel-elevated rounded-3xl max-w-lg w-full overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.95)] border border-emerald-500/30 animate-in fade-in zoom-in-95 duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0D120E] border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#00FF87]" />
            <h2 className="text-lg font-bold tracking-tight text-white font-['Syne',sans-serif]">
              {t.educationalModalTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Term Tabs */}
        <div className="flex border-b border-white/10 bg-[#0A0D0B] p-2 gap-1.5 overflow-x-auto font-mono text-xs">
          {termsList.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveTab(item.key)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeTab === item.key 
                  ? 'bg-emerald-500/20 text-[#00FF87] border border-[#00FF87]/40 shadow-[0_0_12px_rgba(0,255,135,0.2)] font-bold' 
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {termData ? (
            <>
              <div>
                <h3 className="text-xl font-bold text-white mb-1.5 font-['Syne',sans-serif]">
                  {termData.title}
                </h3>
                <p className="text-sm text-stone-300 leading-relaxed">
                  {termData.definition}
                </p>
              </div>

              {/* Real life analogy */}
              <div className="bg-[#0A0D0B] rounded-2xl p-4 border border-amber-500/30">
                <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold mb-1.5">
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>Farmer Analogy (सरल उदाहरण)</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-mono">
                  {termData.analogy}
                </p>
              </div>

              {/* Actionable Tip */}
              <div className="bg-[#0A0D0B] rounded-2xl p-4 border border-emerald-500/30">
                <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#00FF87] font-bold mb-1.5">
                  <Lightbulb className="w-4 h-4 text-[#00FF87]" />
                  <span>Field Action Tip</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                  {termData.farmerTip}
                </p>
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-xs font-mono text-stone-500">
              Loading guide...
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#0A0D0B] px-6 py-3.5 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-white/10 hover:bg-[#00FF87] text-white hover:text-[#060807] text-xs font-mono font-bold rounded-xl transition-all cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExplainModal;
