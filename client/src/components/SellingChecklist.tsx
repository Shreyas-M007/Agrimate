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

  const storageKey = `mandimate_checklist_${crop}_${marketName}`;

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
      <div className="glass-panel rounded-3xl border border-white/10 p-8 text-center text-xs font-mono text-stone-500">
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
    <div className="glass-panel rounded-3xl border border-emerald-500/20 overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
      {/* Header */}
      <div className="bg-[#0D120E] border-b border-white/10 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5 font-['Syne',sans-serif]">
            <CheckSquare className="w-6 h-6 text-[#00FF87]" />
            <span>{checklist.title}</span>
          </h3>
          <p className="text-xs font-mono text-stone-400 mt-1">
            {t.checklistSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono">
          {completedCount > 0 && (
            <button
              type="button"
              onClick={handleResetChecklist}
              className="no-print flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-semibold rounded-xl border border-white/10 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
          <button
            type="button"
            onClick={handlePrint}
            className="no-print flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-[#00FF87] text-xs font-bold rounded-xl border border-emerald-500/30 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,255,135,0.15)]"
          >
            <Printer className="w-4 h-4" />
            <span>{t.printChecklist}</span>
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Progress Bar & Achievement Banner */}
        <div className="bg-[#0A0D0B] rounded-2xl p-4 border border-white/10 shadow-inner font-mono">
          <div className="flex items-center justify-between text-xs text-stone-300 mb-2">
            <span className="flex items-center gap-1.5">
              <span>{t.checklistProgress}:</span>
              <strong className="text-[#00FF87]">{completedCount} / {totalSteps} Steps Cleared</strong>
            </span>
            <span className="font-bold text-[#00FF87] text-sm">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-emerald-600 to-[#00FF87] transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(0,255,135,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Celebration Banner when 100% */}
          {isAllComplete && (
            <div className="mt-4 p-4 bg-gradient-to-r from-emerald-950 to-[#0D120E] border border-[#00FF87]/60 rounded-xl flex items-center gap-3 text-white shadow-[0_0_25px_rgba(0,255,135,0.2)]">
              <div className="p-2 bg-[#00FF87] text-[#060807] rounded-xl shadow font-black">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-base text-[#00FF87] font-['Syne',sans-serif]">Mandi Clearance Protocol Complete!</h4>
                <p className="text-xs text-stone-300 mt-0.5">
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
                    ? 'bg-emerald-950/30 border-[#00FF87]/40 text-stone-300 shadow-[0_0_15px_rgba(0,255,135,0.08)]' 
                    : 'bg-[#0A0D0B] border-white/10 hover:border-emerald-500/40 hover:bg-[#111713]'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 text-[#00FF87] drop-shadow-[0_0_8px_rgba(0,255,135,0.8)]" />
                  ) : (
                    <Square className="w-5 h-5 text-stone-600 hover:text-stone-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5 font-mono text-[11px]">
                    <span className="font-bold bg-white/10 text-stone-300 px-2 py-0.5 rounded">
                      Step {step.id}
                    </span>
                    <span className="text-stone-400 bg-white/5 px-2 py-0.5 rounded">
                      {step.category}
                    </span>
                    {step.important && (
                      <span className="font-bold uppercase tracking-wider bg-rose-950/80 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded">
                        Critical
                      </span>
                    )}
                  </div>

                  <h4 className={`text-sm sm:text-base font-bold transition-colors ${isChecked ? 'line-through text-stone-500' : 'text-white'}`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">
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
