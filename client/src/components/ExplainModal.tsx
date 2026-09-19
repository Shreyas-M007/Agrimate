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
      className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="glass-card rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-white/90 animate-in fade-in zoom-in-95 duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white/40 border-b border-white/60 px-6 py-4 flex items-center justify-between backdrop-blur-xs">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#2E7D32]" />
            <h2 className="text-lg font-bold tracking-tight text-[#123826] font-['Syne',sans-serif]">
              {t.educationalModalTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#EBF5ED] text-stone-500 hover:text-[#123826] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Term Tabs */}
        <div className="flex border-b border-[#E2ECE3] bg-[#F7FAF8] p-2 gap-1.5 overflow-x-auto font-mono text-xs">
          {termsList.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveTab(item.key)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeTab === item.key 
                  ? 'bg-[#2E7D32] text-white shadow-sm font-bold' 
                  : 'text-stone-600 hover:text-[#123826] hover:bg-[#EBF5ED]'
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
                <h3 className="text-xl font-bold text-[#123826] mb-1.5 font-['Syne',sans-serif]">
                  {termData.title}
                </h3>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {termData.definition}
                </p>
              </div>

              {/* Real life analogy */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-800 font-bold mb-1.5">
                  <Compass className="w-4 h-4 text-amber-700" />
                  <span>Farmer Analogy (सरल उदाहरण)</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-mono">
                  {termData.analogy}
                </p>
              </div>

              {/* Actionable Tip */}
              <div className="bg-[#EBF5ED] rounded-2xl p-4 border border-[#A5D6A7]">
                <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#123826] font-bold mb-1.5">
                  <Lightbulb className="w-4 h-4 text-[#2E7D32]" />
                  <span>Field Action Tip</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
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
        <div className="bg-[#F4F8F5] px-6 py-3.5 border-t border-[#E2ECE3] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-mono font-bold rounded-xl transition-all cursor-pointer shadow-sm"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExplainModal;
