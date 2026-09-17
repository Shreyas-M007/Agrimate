import React from 'react';
import type { MarketItem, Language } from '../types';
import { Printer, X, ShieldCheck, FileText } from 'lucide-react';

interface MandiSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  market: MarketItem;
  crop: string;
  quantityQuintals: number;
  grossValue: number;
  language: Language;
}

export const MandiSlipModal: React.FC<MandiSlipModalProps> = ({
  isOpen,
  onClose,
  market,
  crop,
  quantityQuintals,
  grossValue
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const slipId = `MND-${Math.floor(100000 + Math.random() * 900000)}`;
  const todayStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border-2 border-stone-300 animate-in fade-in zoom-in-95">
        {/* Actions bar (hidden in print) */}
        <div className="no-print bg-stone-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2 text-sm font-bold">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>MandiMate Farmer Dispatch Voucher</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Slip */}
        <div className="p-8 space-y-6 text-stone-900" id="printable-voucher">
          {/* Slip Header */}
          <div className="border-b-2 border-dashed border-stone-400 pb-5 text-center relative">
            <div className="text-2xl font-black tracking-tight text-emerald-900 flex items-center justify-center gap-1.5">
              <span>🌾 MandiMate Farmer Slip</span>
            </div>
            <p className="text-xs text-stone-600 font-medium mt-0.5">
              Verified Agricultural Produce Market Intelligence Voucher
            </p>
            <div className="flex justify-between items-center text-[11px] font-mono text-stone-500 mt-3 pt-2 border-t border-stone-200">
              <span>SLIP NO: <strong>{slipId}</strong></span>
              <span>DATE: <strong>{todayStr}</strong></span>
            </div>
          </div>

          {/* Market & Crop Information */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
              <span className="text-[10px] font-bold text-stone-500 uppercase block">Target Mandi Yard</span>
              <strong className="text-base text-stone-900 block mt-0.5">{market.market_name}</strong>
              <span className="text-stone-600">{market.district}, {market.state}</span>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
              <span className="text-[10px] font-bold text-stone-500 uppercase block">Produce Details</span>
              <strong className="text-base text-stone-900 block mt-0.5">{crop} ({market.variety})</strong>
              <span className="text-stone-600">Grade: {market.grade}</span>
            </div>
          </div>

          {/* Pricing & Estimation Breakdown */}
          <div className="bg-emerald-50 rounded-2xl p-5 border-2 border-emerald-200 space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-emerald-200/80 pb-2">
              <span className="text-stone-700">Reported Modal Price:</span>
              <strong className="text-emerald-950 font-black text-base">₹{market.modal_price.toLocaleString('en-IN')}/quintal</strong>
            </div>

            <div className="flex justify-between items-center text-sm border-b border-emerald-200/80 pb-2">
              <span className="text-stone-700">Dispatched Quantity:</span>
              <strong className="text-stone-900 font-bold">{quantityQuintals} Quintals ({quantityQuintals * 100} kg)</strong>
            </div>

            <div className="flex justify-between items-center text-sm border-b border-emerald-200/80 pb-2">
              <span className="text-stone-700">Official Daily Range:</span>
              <span className="font-mono text-stone-800">₹{market.min_price} - ₹{market.max_price}</span>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="font-bold text-emerald-950 text-base">Estimated Gross Value:</span>
              <span className="text-2xl font-black text-emerald-900">₹{grossValue.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Verification source watermark */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <span className="font-bold block text-stone-800">Verified Agmarknet Source</span>
                <span className="text-[10px] text-stone-500">{market.source}</span>
              </div>
            </div>
            <div className="text-right font-mono text-[10px] text-stone-500">
              {market.freshness}
            </div>
          </div>

          {/* Farmer signature & disclaimer */}
          <div className="pt-4 border-t border-dashed border-stone-300 flex justify-between items-end text-xs text-stone-500">
            <div>
              <p className="text-[10px] max-w-xs leading-tight text-stone-400">
                *Estimated gross value based on verified APMC modal price. Final auction settlements depend on weighbridge verification and lot grading.
              </p>
            </div>
            <div className="text-right border-t border-stone-400 pt-1 px-4">
              <span className="text-[10px] font-bold text-stone-700">Farmer Signature</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
