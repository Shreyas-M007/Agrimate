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

  if (!term) return null;

  const termsList = [
    { key: 'modal_price', label: t.modalPrice },
    { key: 'min_price', label: t.minPrice },
    { key: 'max_price', label: t.maxPrice },
    { key: 'arrival_quantity', label: t.arrivalQty }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-2 border-stone-300 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-black tracking-tight">
              {t.educationalModalTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-emerald-700 text-emerald-200 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Term Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-50 p-1.5 gap-1 overflow-x-auto">
          {termsList.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveTab(item.key)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                activeTab === item.key 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'text-stone-700 hover:bg-stone-200'
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
                <h3 className="text-xl font-black text-stone-900 mb-1">
                  {termData.title}
                </h3>
                <p className="text-sm text-stone-700 leading-relaxed font-medium">
                  {termData.definition}
                </p>
              </div>

              {/* Real life analogy */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-900 mb-1.5">
                  <Compass className="w-4 h-4 text-amber-700" />
                  <span>Farmer Analogy (सरल उदाहरण)</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                  {termData.analogy}
                </p>
              </div>

              {/* Actionable Tip */}
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-900 mb-1.5">
                  <Lightbulb className="w-4 h-4 text-emerald-700" />
                  <span>Practical Selling Advice</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
                  {termData.farmerTip}
                </p>
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-sm text-stone-600">
              Loading definition...
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-100 px-6 py-3 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-black rounded-xl transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
