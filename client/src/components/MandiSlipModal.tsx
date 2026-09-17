import React, { useState } from 'react';
import type { MarketItem, Language } from '../types';
import { Printer, X, ShieldCheck, FileText, User, Truck, Package, Phone, MapPin, Edit3 } from 'lucide-react';

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

  // Editable Farmer & Dispatch Details
  const [farmerName, setFarmerName] = useState('Ramesh Gowda');
  const [farmerVillage, setFarmerVillage] = useState('Siruguppa, Ballari');
  const [farmerPhone, setFarmerPhone] = useState('+91 98450 12345');
  const [vehicleNo, setVehicleNo] = useState('KA-34-T-4912');
  const [packagingDetails, setPackagingDetails] = useState(`${Math.round(quantityQuintals * 2)} Crates / Bags`);
  const [showEditForm, setShowEditForm] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const slipId = `MND-${Math.floor(100000 + Math.random() * 900000)}`;
  const todayStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div 
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border-2 border-stone-300 animate-in fade-in zoom-in-95 cursor-default my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Actions bar (hidden in print) */}
        <div className="no-print bg-stone-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2 text-sm font-bold">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Mandi Dispatch Gate Slip</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEditForm(!showEditForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>{showEditForm ? 'Hide Details' : 'Edit Details'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
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

        {/* Editable Details Panel (hidden in print) */}
        {showEditForm && (
          <div className="no-print p-4 bg-amber-50/60 border-b border-amber-200 text-xs space-y-3">
            <div className="font-bold text-stone-800 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-amber-700" />
              <span>Customize Farmer & Vehicle Info for Gate Entry</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Farmer Name</label>
                <input
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Village / District</label>
                <input
                  type="text"
                  value={farmerVillage}
                  onChange={(e) => setFarmerVillage(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Vehicle / Tractor Reg No</label>
                <input
                  type="text"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg font-bold"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-stone-600 font-semibold mb-1">Packaging / Bags / Crates</label>
                <input
                  type="text"
                  value={packagingDetails}
                  onChange={(e) => setPackagingDetails(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Printable Voucher Slip */}
        <div className="p-7 sm:p-8 space-y-5 text-stone-900" id="printable-voucher">
          {/* Slip Header */}
          <div className="border-b-2 border-dashed border-stone-400 pb-4 text-center relative">
            <div className="text-2xl font-black tracking-tight text-emerald-900 flex items-center justify-center gap-1.5">
              <span>🌾 AgriMate Gate Entry Voucher</span>
            </div>
            <p className="text-xs text-stone-600 font-medium mt-0.5">
              Official Agricultural Produce Market Dispatch Slip (APMC Yard Inward)
            </p>
            <div className="flex justify-between items-center text-[11px] font-mono text-stone-500 mt-2.5 pt-2 border-t border-stone-200">
              <span>SLIP NO: <strong>{slipId}</strong></span>
              <span>DATE: <strong>{todayStr}</strong></span>
            </div>
          </div>

          {/* Farmer & Transport Info Block */}
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1">
                <User className="w-3 h-3 text-stone-400" />
                <span>Farmer / Consignor</span>
              </span>
              <strong className="text-sm text-stone-900 block mt-0.5">{farmerName}</strong>
              <span className="text-stone-600 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-stone-400" />
                <span>{farmerVillage}</span>
              </span>
              <span className="text-stone-500 text-[11px] flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-stone-400" />
                <span>{farmerPhone}</span>
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1">
                <Truck className="w-3 h-3 text-stone-400" />
                <span>Dispatch Logistics</span>
              </span>
              <strong className="text-sm text-stone-900 block mt-0.5">Vehicle: {vehicleNo}</strong>
              <span className="text-stone-600 flex items-center gap-1 mt-0.5">
                <Package className="w-3 h-3 text-stone-400" />
                <span>{packagingDetails}</span>
              </span>
              <span className="text-stone-500 text-[11px] block mt-0.5">
                Distance: ~{market.distance_km ? `${market.distance_km} km` : 'Local Mandi'}
              </span>
            </div>
          </div>

          {/* Market & Crop Information */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
              <span className="text-[10px] font-bold text-stone-500 uppercase block">Target Mandi Yard</span>
              <strong className="text-sm text-stone-900 block mt-0.5">{market.market_name}</strong>
              <span className="text-stone-600">{market.district}, {market.state}</span>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
              <span className="text-[10px] font-bold text-stone-500 uppercase block">Produce Details</span>
              <strong className="text-sm text-stone-900 block mt-0.5">{crop} ({market.variety})</strong>
              <span className="text-stone-600">Grade: {market.grade}</span>
            </div>
          </div>

          {/* Pricing & Estimation Breakdown */}
          <div className="bg-emerald-50/80 rounded-2xl p-4 border-2 border-emerald-200 space-y-2.5 text-xs">
            <div className="flex justify-between items-center border-b border-emerald-200/80 pb-1.5">
              <span className="text-stone-700">Verified Modal Price:</span>
              <strong className="text-emerald-950 font-black text-sm">₹{market.modal_price.toLocaleString('en-IN')}/quintal</strong>
            </div>

            <div className="flex justify-between items-center border-b border-emerald-200/80 pb-1.5">
              <span className="text-stone-700">Dispatched Quantity:</span>
              <strong className="text-stone-900 font-bold">{quantityQuintals} Quintals ({quantityQuintals * 100} kg)</strong>
            </div>

            <div className="flex justify-between items-center border-b border-emerald-200/80 pb-1.5">
              <span className="text-stone-700">Official Daily Range:</span>
              <span className="font-mono text-stone-800">₹{market.min_price} - ₹{market.max_price}</span>
            </div>

            <div className="flex justify-between items-center pt-1 text-sm">
              <span className="font-bold text-emerald-950">Estimated Gross Value:</span>
              <span className="text-xl font-black text-emerald-900">₹{grossValue.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Verification source watermark */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs text-stone-600">
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

          {/* Signatures & Disclaimers */}
          <div className="pt-4 border-t border-dashed border-stone-300 grid grid-cols-2 gap-4 text-xs text-stone-500 items-end">
            <div>
              <p className="text-[9px] leading-tight text-stone-400">
                *Estimated gross value based on verified APMC modal price. Final auction settlements depend on weighbridge verification and lot grading.
              </p>
            </div>
            <div className="text-right space-y-6">
              <div className="border-t border-stone-400 pt-1">
                <span className="text-[10px] font-bold text-stone-700">Farmer Signature</span>
              </div>
              <div className="border-t border-stone-400 pt-1">
                <span className="text-[10px] font-bold text-stone-700">APMC Gate Inspector</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
