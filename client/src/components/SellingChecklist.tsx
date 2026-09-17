import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { Language, SellingChecklistData } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { CheckSquare, Square, Printer, CheckCircle2, Trophy, RotateCcw } from 'lucide-react';

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

  const storageKey = `agrimate_checklist_${crop}_${marketName}`;

  // Load persisted checklist state on market/crop change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCheckedIds(JSON.parse(saved));
      } else {
        setCheckedIds([]);
      }
    } catch {
      setCheckedIds([]);
    }
  }, [storageKey]);

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
      setCelebrated(false);
      fetchChecklist();
    }
    return () => { isMounted = false; };
  }, [crop, marketName, quantityQuintals, language]);

  const toggleCheck = (id: number) => {
    setCheckedIds(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}

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

  const handleResetChecklist = () => {
    setCheckedIds([]);
    setCelebrated(false);
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="verda-card rounded-3xl border border-[#E2ECE3] p-8 text-center text-xs font-mono text-stone-500">
        Loading 11-step selling protocol checklist...
      </div>
    );
  }

  if (!checklist) return null;

  const totalSteps = checklist.steps.length;
  const completedCount = checkedIds.length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);
  const isAllComplete = completedCount === totalSteps;

  return (
    <div className="verda-card rounded-3xl border border-[#E2ECE3] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-[#F4F8F5] border-b border-[#E2ECE3] px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#123826] flex items-center gap-2.5 font-['Syne',sans-serif]">
            <CheckSquare className="w-6 h-6 text-[#2E7D32]" />
            <span>{checklist.title}</span>
          </h3>
          <p className="text-xs font-mono text-stone-600 mt-1">
            {t.checklistSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono">
          {completedCount > 0 && (
            <button
              type="button"
              onClick={handleResetChecklist}
              className="no-print flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-[#EBF5ED] text-stone-700 text-xs font-semibold rounded-xl border border-[#CCE0D0] transition-all cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
          <button
            type="button"
            onClick={handlePrint}
            className="no-print flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printChecklist}</span>
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Progress Bar & Achievement Banner */}
        <div className="bg-[#F7FAF8] rounded-2xl p-4 border border-[#E2ECE3] shadow-inner font-mono">
          <div className="flex items-center justify-between text-xs text-stone-700 mb-2">
            <span className="flex items-center gap-1.5">
              <span>{t.checklistProgress}:</span>
              <strong className="text-[#123826]">{completedCount} / {totalSteps} Steps Cleared</strong>
            </span>
            <span className="font-bold text-[#2E7D32] text-sm">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-[#E2ECE3] rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-[#2E7D32] to-[#4CAF50] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Celebration Banner when 100% */}
          {isAllComplete && (
            <div className="mt-4 p-4 bg-[#123826] text-white rounded-xl flex items-center gap-3 shadow-md">
              <div className="p-2 bg-[#2E7D32] text-white rounded-xl shadow font-black">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-[#E8A238] font-['Syne',sans-serif]">Mandi Clearance Protocol Complete!</h4>
                <p className="text-xs text-stone-200 mt-0.5">
                  All price verification, gate passes, weighbridge tickets, and statutory APMC payment rules are secured.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 11 Steps List */}
        <div className="space-y-3">
          {checklist.steps.map((step) => {
            const isChecked = checkedIds.includes(step.id);

            return (
              <div
                key={step.id}
                onClick={() => toggleCheck(step.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                  isChecked 
                    ? 'bg-[#F4F8F5] border-[#A5D6A7] text-stone-500 shadow-xs' 
                    : 'bg-white border-[#E2ECE3] hover:border-[#2E7D32] hover:bg-[#FBFDF9]'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />
                  ) : (
                    <Square className="w-5 h-5 text-stone-400 hover:text-stone-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5 font-mono text-[11px]">
                    <span className="font-bold bg-[#EBF5ED] text-[#123826] px-2 py-0.5 rounded border border-[#CCE0D0]">
                      Step {step.id}
                    </span>
                    <span className="text-stone-600 bg-[#F4F8F5] px-2 py-0.5 rounded border border-[#E2ECE3]">
                      {step.category}
                    </span>
                    {step.important && (
                      <span className="font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded">
                        Critical
                      </span>
                    )}
                  </div>

                  <h4 className={`text-sm sm:text-base font-bold transition-colors ${isChecked ? 'line-through text-stone-400' : 'text-[#123826]'}`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
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

export default SellingChecklist;
