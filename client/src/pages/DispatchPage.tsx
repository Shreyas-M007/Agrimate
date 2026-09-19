import React, { useState } from 'react';
import type { Language, NavigationPage } from '../types';
import { 
  FileText, 
  Printer, 
  Share2, 
  ShieldCheck
} from 'lucide-react';

interface DispatchPageProps {
  language: Language;
  onNavigate: (page: NavigationPage) => void;
}

export const DispatchPage: React.FC<DispatchPageProps> = () => {
  // Gate pass state
  const [farmerName, setFarmerName] = useState('Basavaraj Patil');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [village, setVillage] = useState('Hospete, Ballari');
  const [vehicleType, setVehicleType] = useState('Bolero Pickup (407)');
  const [vehicleNumber, setVehicleNumber] = useState('KA-34-M-8821');
  const [driverName, setDriverName] = useState('Ramesh Nayak');
  const [driverPhone, setDriverPhone] = useState('');
  const [commodity, setCommodity] = useState('Tomato (Hybrid)');
  const [packageCount, setPackageCount] = useState(80);
  const [packageType, setPackageType] = useState('Plastic Crates (25kg each)');
  const [grossWeightQuintals, setGrossWeightQuintals] = useState(20);
  const [targetMandi, setTargetMandi] = useState('Ballari APMC Main Yard');
  const [passId] = useState(`AGR-${Math.floor(100000 + Math.random() * 900000)}`);

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = `*AGRIMATE DIGITAL MANDI GATE PASS*%0A*Pass ID:* ${passId}%0A*Farmer:* ${farmerName}${farmerPhone ? ` (${farmerPhone})` : ''}%0A*Village:* ${village}%0A*Vehicle:* ${vehicleType} [${vehicleNumber}]%0A*Commodity:* ${commodity}%0A*Packages:* ${packageCount} ${packageType}%0A*Weight:* ${grossWeightQuintals} Quintals%0A*Destination Mandi:* ${targetMandi}%0A*Statutory:* APMC Act 2026 Certified`;
    const cleanNum = driverPhone.replace(/\D/g, '');
    const url = cleanNum.length === 10 
      ? `https://wa.me/91${cleanNum}?text=${text}`
      : cleanNum.length > 10
      ? `https://wa.me/${cleanNum}?text=${text}`
      : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Page Header */}
      <section className="bg-[#ECE8DE]/60 border-b border-[#E6E1D7] py-12 sm:py-16 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] bg-white px-3 py-1 rounded-full border border-[#E6E1D7]">
              Statutory Consignment Documentation
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-[#153424] font-['Syne',sans-serif] tracking-tight">
              Mandi Dispatch Desk & Gate Slip Station
            </h1>
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-['Outfit',sans-serif]">
              Generate standardized, legally recognized APMC gate entry passes prior to vehicle dispatch. Protects growers against unauthorized dock deductions, arbitrary grading cuts, and weighment disputes.
            </p>
          </div>
        </div>
      </section>

      {/* Main Workstation Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form: Editable Consignment Inputs */}
          <div className="lg:col-span-6 glass-card p-6 sm:p-8 rounded-3xl border border-white/80 shadow-xs space-y-6 print:hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E1D7]">
              <h2 className="text-lg font-bold text-[#153424] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#2E7D32]" />
                <span>Consignment Details</span>
              </h2>
              <span className="text-xs font-mono font-bold text-stone-500">ID: {passId}</span>
            </div>

            {/* Farmer Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#153424] uppercase tracking-wider">Farmer Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Farmer Full Name</label>
                  <input
                    type="text"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E1D7] focus:border-[#2E7D32] outline-none bg-white text-[#153424]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E1D7] focus:border-[#2E7D32] outline-none bg-white text-[#153424]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Village & Taluk</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E1D7] focus:border-[#2E7D32] outline-none bg-white text-[#153424]"
                  />
                </div>
              </div>
            </div>

            {/* Transport & Vehicle Section */}
            <div className="space-y-3 pt-3 border-t border-[#E6E1D7]">
              <h3 className="text-xs font-bold text-[#153424] uppercase tracking-wider">Haulage & Vehicle</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Vehicle Type</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E1D7] focus:border-[#2E7D32] outline-none bg-white text-[#153424]"
                  >
                    <option value="Tata Ace (Chota Hathi)">Tata Ace (Chota Hathi)</option>
                    <option value="Bolero Pickup (407)">Bolero Pickup (407)</option>
                    <option value="Tractor-Trolley">Tractor-Trolley</option>
                    <option value="6-Wheeler Medium Truck">6-Wheeler Medium Truck</option>
                    <option value="Auto Goods Carrier">Auto Goods Carrier</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Vehicle Reg Number</label>
                  <input
                    type="text"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 text-xs font-mono uppercase rounded-xl border border-[#E6E1D7] focus:border-[#2E7D32] outline-none bg-white text-[#153424]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Driver Name</label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E1D7] focus:border-[#2E7D32] outline-none bg-white text-[#153424]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Driver Contact</label>
                  <input
                    type="text"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E1D7] focus:border-[#2E7D32] outline-none bg-white text-[#153424]"
                  />
                </div>
              </div>
            </div>

            {/* Produce & Weight Section */}
            <div className="space-y-3 pt-3 border-t border-[#E6E1D7]">
              <h3 className="text-xs font-bold text-[#153424] uppercase tracking-wider">Consignment Specification</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Commodity / Crop</label>
                  <input
                    type="text"
                    value={commodity}
                    onChange={(e) => setCommodity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E1D7] focus:border-[#2E7D32] outline-none bg-white text-[#153424]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Package Type</label>
                  <input
                    type="text"
                    value={packageType}
                    onChange={(e) => setPackageType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E1D7] focus:border-[#2E7D32] outline-none bg-white text-[#153424]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Crate / Bag Count</label>
                  <input
                    type="number"
                    value={packageCount}
                    onChange={(e) => setPackageCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E1D7] focus:border-[#2E7D32] outline-none bg-white text-[#153424]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Total Weight (Quintals)</label>
                  <input
                    type="number"
                    value={grossWeightQuintals}
                    onChange={(e) => setGrossWeightQuintals(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E1D7] focus:border-[#2E7D32] outline-none bg-white text-[#153424]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Target Mandi Yard</label>
                  <input
                    type="text"
                    value={targetMandi}
                    onChange={(e) => setTargetMandi(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6E1D7] focus:border-[#2E7D32] outline-none bg-white text-[#153424]"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#E6E1D7]">
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl bg-[#153424] hover:bg-[#2E7D32] text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4 text-[#E8A238]" />
                <span>Print Gate Slip</span>
              </button>

              <button
                onClick={handleWhatsAppShare}
                className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Share2 className="w-4 h-4" />
                <span>Send to Driver (WhatsApp)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Printable Digital Gate Slip */}
          <div className="lg:col-span-6 glass-card p-6 sm:p-8 rounded-3xl border-2 border-[#153424] shadow-xl space-y-5 print:border-none print:shadow-none print:p-0">
            {/* Gate Pass Header */}
            <div className="text-center pb-4 border-b-2 border-dashed border-stone-300 space-y-1">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#2E7D32] tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>APMC Act Statutory Form VII</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#153424] font-['Syne',sans-serif] tracking-tight">
                AGRICULTURAL PRODUCE GATE ENTRY PASS
              </h2>
              <p className="text-[11px] text-stone-500">
                AgriMate Official Consignment Tracking • Agmarknet Mandi Network
              </p>
              <p className="text-xs font-mono font-bold text-[#153424] pt-1">
                PASS REF: {passId}
              </p>
            </div>

            {/* Live Data Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="glass-card-subtle p-3 rounded-xl border border-white/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-600 block">Grower / Consignor</span>
                <p className="font-bold text-[#153424] text-sm">{farmerName}</p>
                <p className="text-stone-600 font-mono text-[11px]">{farmerPhone}</p>
                <p className="text-stone-600 text-[11px]">{village}</p>
              </div>

              <div className="glass-card-subtle p-3 rounded-xl border border-white/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-600 block">Vehicle & Hauler</span>
                <p className="font-bold text-[#153424] text-sm">{vehicleType}</p>
                <p className="font-mono text-[11px] font-bold text-[#2E7D32]">{vehicleNumber}</p>
                <p className="text-stone-600 text-[11px]">{driverName} ({driverPhone})</p>
              </div>

              <div className="glass-card-subtle p-3 rounded-xl border border-white/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-600 block">Produce Consignment</span>
                <p className="font-bold text-[#153424] text-sm">{commodity}</p>
                <p className="text-stone-600 text-[11px]">{packageType}</p>
                <p className="font-mono font-bold text-[#153424] text-xs">{packageCount} Packages</p>
              </div>

              <div className="glass-card-subtle p-3 rounded-xl border border-white/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-600 block">Weighbridge & Mandi</span>
                <p className="font-bold text-[#2E7D32] text-sm font-mono">{grossWeightQuintals} Quintals</p>
                <p className="text-stone-600 text-[11px]">Gross Dispatch Weight</p>
                <p className="font-bold text-[#153424] text-xs">{targetMandi}</p>
              </div>
            </div>

            {/* QR Simulation & Statutory Seal */}
            <div className="p-4 rounded-xl glass-card-subtle border border-white/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-white border border-[#E6E1D7] rounded-xl flex items-center justify-center p-1">
                  <div className="w-full h-full bg-stone-900 rounded-sm flex items-center justify-center text-white text-[9px] font-mono p-1 text-center">
                    QR-VERIFIED APMC
                  </div>
                </div>
                <div className="space-y-0.5 text-left">
                  <p className="text-xs font-bold text-[#153424]">Official Gate Verification</p>
                  <p className="text-[10px] text-stone-600">Scan at APMC yard weighbridge for instantaneous digital weigh-in.</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="inline-block border-2 border-[#2E7D32] rounded-lg p-1.5 text-center rotate-3">
                  <span className="block text-[9px] font-black uppercase text-[#2E7D32]">APMC STATUTORY SEAL</span>
                  <span className="block text-[8px] font-mono text-stone-500">SEC 24 COMPLIANT</span>
                </div>
              </div>
            </div>

            {/* Legal Notice */}
            <div className="text-[10px] text-stone-600 leading-relaxed pt-2 border-t border-dashed border-stone-300">
              <p>
                <strong>Statutory Notice:</strong> Under the Agricultural Produce Marketing (Regulation) Act, all charges including market cess, weighing fee, and loading hamali are strictly capped. Commission agents are forbidden from levying unauthorized deduction cuts from the farmer's gross auction price.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DispatchPage;
