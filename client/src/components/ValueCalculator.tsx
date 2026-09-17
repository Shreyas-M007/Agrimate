import React, { useState, useEffect } from 'react';
import type { MarketItem, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Calculator, Truck, Layers, Coins, ChevronDown, ChevronUp, AlertCircle, Fuel, Receipt } from 'lucide-react';

interface ValueCalculatorProps {
  market: MarketItem;
  quantityQuintals: number;
  language: Language;
  onOpenSlip?: () => void;
}

interface VehicleType {
  id: string;
  name: string;
  ratePerKm: number;
  capacityQuintals: number;
}

const VEHICLE_TYPES: VehicleType[] = [
  { id: 'mini_truck', name: 'Tata Ace / Mini Truck (₹22/km)', ratePerKm: 22, capacityQuintals: 15 },
  { id: 'tractor', name: 'Tractor Trolley (₹18/km)', ratePerKm: 18, capacityQuintals: 40 },
  { id: 'auto', name: 'Auto Tipper 3-Wheeler (₹15/km)', ratePerKm: 15, capacityQuintals: 8 },
  { id: 'truck', name: 'Heavy Multi-Axle Truck (₹35/km)', ratePerKm: 35, capacityQuintals: 100 },
];

export const ValueCalculator: React.FC<ValueCalculatorProps> = ({
  market,
  quantityQuintals,
  language,
  onOpenSlip
}) => {
  const t = TRANSLATIONS[language];
  const [showNetCalculator, setShowNetCalculator] = useState(false);

  // Selected vehicle & custom costs
  const [selectedVehicle, setSelectedVehicle] = useState<string>('mini_truck');
  const [transportCost, setTransportCost] = useState<number>(1200);
  const [loadingCost, setLoadingCost] = useState<number>(300);
  const [marketCessPercent, setMarketCessPercent] = useState<number>(1.5);
  const [otherCharges, setOtherCharges] = useState<number>(100);

  // Auto-calibrate transport and loading when market or quantity changes
  useEffect(() => {
    const vehicle = VEHICLE_TYPES.find(v => v.id === selectedVehicle) || VEHICLE_TYPES[0];
    if (market.distance_km && market.distance_km > 0) {
      const estimated = Math.max(350, Math.round(market.distance_km * vehicle.ratePerKm + quantityQuintals * 15));
      setTransportCost(estimated);
    } else {
      setTransportCost(Math.max(400, Math.round(quantityQuintals * 50 + 600)));
    }

    setLoadingCost(Math.max(150, Math.round(quantityQuintals * 30)));
  }, [market.market_id, market.distance_km, quantityQuintals, selectedVehicle]);

  const grossValue = Math.round(quantityQuintals * market.modal_price);
  const marketCess = Math.round((grossValue * marketCessPercent) / 100);
  const totalDeductions = transportCost + loadingCost + marketCess + otherCharges;
  const estimatedNetReturn = Math.max(0, grossValue - totalDeductions);
  const deductionPercentage = grossValue > 0 ? ((totalDeductions / grossValue) * 100).toFixed(1) : '0';

  return (
    <div className="verda-card rounded-2xl border border-[#E2ECE3] overflow-hidden shadow-sm">
      {/* Subheader */}
      <div className="bg-[#F4F8F5] border-b border-[#E2ECE3] px-5 py-3.5 flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold text-[#123826] flex items-center gap-2 font-['Syne',sans-serif]">
          <Calculator className="w-5 h-5 text-[#2E7D32]" />
          <span>{t.grossValueTitle}</span>
        </h3>
        <span className="text-xs font-mono font-bold text-[#123826] bg-[#EBF5ED] border border-[#CCE0D0] px-2.5 py-1 rounded-md">
          {market.market_name}
        </span>
      </div>

      <div className="p-5 sm:p-6">
        {/* Gross Value Formula & Result Card */}
        <div className="bg-[#F7FAF8] rounded-2xl p-5 border border-[#E2ECE3] mb-4 shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
            <div className="text-xs font-mono text-stone-600">
              Estimated Value: <span className="text-[#123826] font-bold">{quantityQuintals} Quintals × ₹{market.modal_price.toLocaleString('en-IN')}/q</span>
            </div>
            <div className="text-[11px] font-mono text-stone-500">
              Prevailing Mandi Modal Rate
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-4xl sm:text-5xl font-bold text-[#123826] tracking-tight font-mono tnum">
              ₹{grossValue.toLocaleString('en-IN')}
            </div>

            {onOpenSlip && (
              <button
                type="button"
                onClick={onOpenSlip}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-mono font-bold text-xs sm:text-sm rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <Receipt className="w-4 h-4" />
                <span>Generate Mandi Gate Slip</span>
              </button>
            )}
          </div>

          {/* Mandatory PRD Disclaimer */}
          <div className="mt-4 flex items-start gap-2 text-xs font-mono text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>{t.grossValueDisclaimer}</strong>
            </p>
          </div>
        </div>

        {/* Toggle Net Return Estimator (PRD Sec 17) */}
        <div className="border-t border-[#E2ECE3] pt-4">
          <button
            type="button"
            onClick={() => setShowNetCalculator(!showNetCalculator)}
            className="w-full flex items-center justify-between text-left p-3.5 rounded-xl bg-[#F4F8F5] hover:bg-[#EBF5ED] transition-all border border-[#E2ECE3] hover:border-[#2E7D32] cursor-pointer"
          >
            <div>
              <div className="font-bold text-sm sm:text-base text-[#123826] flex items-center gap-2 font-['Syne',sans-serif]">
                <span>{t.netReturnTitle}</span>
                <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                  Net in Hand: ₹{estimatedNetReturn.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-xs font-mono text-stone-500 mt-0.5">
                {t.netReturnSubtitle}
              </div>
            </div>
            <div className="text-[#2E7D32]">
              {showNetCalculator ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </button>

          {showNetCalculator && (
            <div className="mt-4 p-4 sm:p-5 bg-[#F7FAF8] rounded-xl border border-[#E2ECE3] space-y-4">
              {/* Vehicle selector */}
              <div>
                <label className="block text-xs font-mono text-stone-600 mb-1 flex items-center gap-1.5">
                  <Fuel className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>Transport Vehicle Mode (auto-calibrated for {market.distance_km ? `${market.distance_km} km` : 'distance'})</span>
                </label>
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="w-full px-3 py-2 border border-[#CCE0D0] rounded-lg bg-white text-[#162E21] font-mono text-xs sm:text-sm focus:outline-none focus:border-[#2E7D32]"
                >
                  {VEHICLE_TYPES.map(v => (
                    <option key={v.id} value={v.id} className="bg-white text-stone-900">{v.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-stone-600 mb-1 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-stone-500" />
                    <span>{t.transportCost} (₹)</span>
                  </label>
                  <input
                    type="number"
                    value={transportCost}
                    onChange={(e) => setTransportCost(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 border border-[#CCE0D0] rounded-lg bg-white text-[#162E21] font-bold focus:outline-none focus:border-[#2E7D32]"
                  />
                  {market.distance_km && (
                    <span className="text-[11px] text-stone-500 mt-0.5 block">
                      Estimated for ~{market.distance_km} km
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-stone-600 mb-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-stone-500" />
                    <span>{t.loadingCost} (₹)</span>
                  </label>
                  <input
                    type="number"
                    value={loadingCost}
                    onChange={(e) => setLoadingCost(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 border border-[#CCE0D0] rounded-lg bg-white text-[#162E21] font-bold focus:outline-none focus:border-[#2E7D32]"
                  />
                  <span className="text-[11px] text-stone-500 mt-0.5 block">
                    ~₹30/q for {quantityQuintals} quintals
                  </span>
                </div>

                <div>
                  <label className="block text-stone-600 mb-1 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-stone-500" />
                    <span>{t.marketCess} (%)</span>
                  </label>
                  <select
                    value={marketCessPercent}
                    onChange={(e) => setMarketCessPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#CCE0D0] rounded-lg bg-white text-[#162E21] font-bold focus:outline-none focus:border-[#2E7D32]"
                  >
                    <option value={1.5} className="bg-white text-stone-900">1.5% Standard APMC Cess</option>
                    <option value={2.0} className="bg-white text-stone-900">2.0% State Cess</option>
                    <option value={1.0} className="bg-white text-stone-900">1.0% Concessional Cess</option>
                    <option value={0.5} className="bg-white text-stone-900">0.5% Special Scheme</option>
                    <option value={0} className="bg-white text-stone-900">0% Direct Farmer Exemption</option>
                  </select>
                  <span className="text-[11px] text-stone-500 mt-0.5 block">
                    Calculated ~₹{marketCess.toLocaleString('en-IN')}
                  </span>
                </div>

                <div>
                  <label className="block text-stone-600 mb-1">
                    Other Deductions (Weighbridge ₹)
                  </label>
                  <input
                    type="number"
                    value={otherCharges}
                    onChange={(e) => setOtherCharges(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full px-3 py-2 border border-[#CCE0D0] rounded-lg bg-white text-[#162E21] font-bold focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>
              </div>

              {/* Net Return Summary Banner */}
              <div className="bg-[#123826] text-white p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-200">
                    {t.estimatedNetReturn} (Estimated In-Hand)
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-[#E8A238] font-mono tnum">
                    ₹{estimatedNetReturn.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="text-xs font-mono text-stone-200 text-right sm:border-l sm:border-white/20 sm:pl-4">
                  <div>Gross: <strong className="text-white">₹{grossValue.toLocaleString('en-IN')}</strong></div>
                  <div>Deductions: <strong className="text-[#E8A238]">-₹{totalDeductions.toLocaleString('en-IN')}</strong> ({deductionPercentage}%)</div>
                  <div className="text-[10px] text-stone-400 mt-1">*Simulation for budgeting only</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValueCalculator;
