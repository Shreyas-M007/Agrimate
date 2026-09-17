import React, { useState } from 'react';
import type { MarketItem, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Calculator, Truck, Layers, Coins, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface ValueCalculatorProps {
  market: MarketItem;
  quantityQuintals: number;
  language: Language;
  onOpenSlip?: () => void;
}

export const ValueCalculator: React.FC<ValueCalculatorProps> = ({
  market,
  quantityQuintals,
  language,
  onOpenSlip
}) => {
  const t = TRANSLATIONS[language];
  const [showNetCalculator, setShowNetCalculator] = useState(false);

  // Cost inputs
  const [transportCost, setTransportCost] = useState<number>(1200);
  const [loadingCost, setLoadingCost] = useState<number>(300);
  const [marketCessPercent, setMarketCessPercent] = useState<number>(1.5);
  const [otherCharges, setOtherCharges] = useState<number>(100);

  const grossValue = Math.round(quantityQuintals * market.modal_price);
  const marketCess = Math.round((grossValue * marketCessPercent) / 100);
  const totalDeductions = transportCost + loadingCost + marketCess + otherCharges;
  const estimatedNetReturn = Math.max(0, grossValue - totalDeductions);

  return (
    <div className="bg-white rounded-2xl border-2 border-stone-200 overflow-hidden shadow-sm">
      <div className="bg-stone-100 border-b border-stone-200 px-5 py-3.5 flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-700" />
          <span>{t.grossValueTitle}</span>
        </h3>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
          {market.market_name}
        </span>
      </div>

      <div className="p-5 sm:p-6">
        {/* Gross Value Formula & Result */}
        <div className="bg-gradient-to-r from-emerald-50 to-amber-50 rounded-2xl p-5 border border-emerald-200 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
            <div className="text-sm font-bold text-stone-700">
              Formula: <span className="font-mono text-emerald-950 font-black">{quantityQuintals} Quintals × ₹{market.modal_price.toLocaleString('en-IN')}/q</span>
            </div>
            <div className="text-xs font-semibold text-stone-600">
              Based on today's modal price
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-3xl sm:text-5xl font-black text-emerald-900 tracking-tight">
              ₹{grossValue.toLocaleString('en-IN')}
            </div>

            {onOpenSlip && (
              <button
                type="button"
                onClick={onOpenSlip}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer border border-emerald-700"
              >
                <span>Generate Mandi Gate Slip</span>
              </button>
            )}
          </div>

          {/* Mandatory PRD Disclaimer */}
          <div className="mt-3 flex items-start gap-2 text-xs text-amber-950 bg-amber-100/70 p-2.5 rounded-xl border border-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>{t.grossValueDisclaimer}</strong>
            </p>
          </div>
        </div>

        {/* Toggle Net Return Estimator (PRD Sec 17) */}
        <div className="border-t border-stone-200 pt-4">
          <button
            type="button"
            onClick={() => setShowNetCalculator(!showNetCalculator)}
            className="w-full flex items-center justify-between text-left p-3 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors border border-stone-200 cursor-pointer"
          >
            <div>
              <div className="font-black text-sm sm:text-base text-stone-900">
                {t.netReturnTitle}
              </div>
              <div className="text-xs text-stone-600">
                {t.netReturnSubtitle}
              </div>
            </div>
            <div className="text-emerald-800">
              {showNetCalculator ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </button>

          {showNetCalculator && (
            <div className="mt-4 p-4 sm:p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-stone-600" />
                    <span>{t.transportCost}</span>
                  </label>
                  <input
                    type="number"
                    value={transportCost}
                    onChange={(e) => setTransportCost(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-stone-600" />
                    <span>{t.loadingCost}</span>
                  </label>
                  <input
                    type="number"
                    value={loadingCost}
                    onChange={(e) => setLoadingCost(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-stone-600" />
                    <span>{t.marketCess}</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={marketCessPercent}
                    onChange={(e) => setMarketCessPercent(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-900 font-bold"
                  />
                  <span className="text-[11px] text-stone-600 mt-0.5 block">
                    Calculates ~₹{marketCess.toLocaleString('en-IN')}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Other Mandi Deductions (₹)
                  </label>
                  <input
                    type="number"
                    value={otherCharges}
                    onChange={(e) => setOtherCharges(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white text-stone-900 font-bold"
                  />
                </div>
              </div>

              {/* Net Return Summary Banner */}
              <div className="bg-emerald-900 text-white p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-emerald-200">
                    {t.estimatedNetReturn} (Approx.)
                  </div>
                  <div className="text-3xl font-black text-amber-300">
                    ₹{estimatedNetReturn.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="text-xs text-emerald-100 text-right sm:border-l sm:border-emerald-700 sm:pl-4">
                  <div>Gross Value: ₹{grossValue.toLocaleString('en-IN')}</div>
                  <div>Total Deductions: -₹{totalDeductions.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-emerald-300 mt-1">*Approximation for budgeting only</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
