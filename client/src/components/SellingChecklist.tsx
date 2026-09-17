import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { Language, SellingChecklistData } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { CheckSquare, Square, Printer, CheckCircle2, Trophy } from 'lucide-react';

interface SellingChecklistProps {
  crop: string;
  marketName: string;
  quantityQuintals: number;
  language: Language;
}

export const SellingChecklist: React.FC<SellingChecklistProps> = ({
  crop,
  marketName,
  quantityQuintals,
  language
}) => {
  const t = TRANSLATIONS[language];
  const [checklist, setChecklist] = useState<SellingChecklistData | null>(null);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [celebrated, setCelebrated] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchChecklist() {
      setLoading(true);
      try {
        const res = await fetch('/api/checklist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            crop,
            marketName,
            quantityQuintals,
            language
          })
        });
        const data = await res.json();
        if (isMounted && data.success) {
          setChecklist(data.checklist);
        }
      } catch (err) {
        console.error("Error fetching checklist", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (marketName) {
      setCheckedIds([]);
      setCelebrated(false);
      fetchChecklist();
    }
    return () => { isMounted = false; };
  }, [crop, marketName, quantityQuintals, language]);

  const toggleCheck = (id: number) => {
    setCheckedIds(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      if (checklist && next.length === checklist.steps.length && !celebrated) {
        setCelebrated(true);
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore if canvas blocked
        }
      }
      return next;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border-2 border-stone-200 p-8 text-center text-sm text-stone-600">
        Loading 11-step selling checklist...
      </div>
    );
  }

  if (!checklist) return null;

  const totalSteps = checklist.steps.length;
  const completedCount = checkedIds.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);
  const isAllComplete = completedCount === totalSteps;

  return (
    <div className="bg-white rounded-3xl border-2 border-stone-200 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-100 to-stone-50 border-b border-stone-200 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-emerald-700" />
            <span>{checklist.title}</span>
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {t.checklistSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="no-print flex items-center gap-1.5 px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs sm:text-sm font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printChecklist}</span>
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Progress Bar & Achievement Banner */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-stone-700 mb-2">
            <span className="flex items-center gap-1.5">
              <span>{t.checklistProgress}:</span>
              <strong className="text-emerald-800">{completedCount} / {totalSteps} Steps</strong>
            </span>
            <span className="font-mono font-black text-emerald-900 text-base">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-700 transition-all duration-500 rounded-full shadow"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Celebration Banner when 100% */}
          {isAllComplete && (
            <div className="mt-4 p-4 bg-gradient-to-r from-amber-100 to-emerald-100 border-2 border-emerald-400 rounded-xl flex items-center gap-3 text-emerald-950 animate-in fade-in zoom-in-95">
              <div className="p-2 bg-amber-400 text-emerald-950 rounded-xl shadow">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-base">You are 100% Prepared for the Mandi!</h4>
                <p className="text-xs text-emerald-900 mt-0.5">
                  All price verification, loading counts, weighbridge checks, and statutory payment rules are confirmed.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 11 Steps List */}
        <div className="space-y-3.5">
          {checklist.steps.map((step) => {
            const isChecked = checkedIds.includes(step.id);

            return (
              <div
                key={step.id}
                onClick={() => toggleCheck(step.id)}
                className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                  isChecked 
                    ? 'bg-emerald-50/70 border-emerald-400 text-emerald-950 shadow-xs' 
                    : 'bg-white border-stone-200 hover:border-emerald-300 hover:shadow-md'
                }`}
              >
                <div className="mt-0.5 shrink-0 text-emerald-700">
                  {isChecked ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-700 animate-in zoom-in" />
                  ) : (
                    <Square className="w-6 h-6 text-stone-300 hover:text-stone-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-xs font-black bg-stone-200 text-stone-800 px-2.5 py-0.5 rounded-md">
                      Step {step.id}
                    </span>
                    <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-md">
                      {step.category}
                    </span>
                    {step.important && (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md">
                        Critical
                      </span>
                    )}
                  </div>

                  <h4 className={`text-base font-bold transition-colors ${isChecked ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                    {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
