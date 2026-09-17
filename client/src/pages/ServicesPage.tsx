import React, { useState } from 'react';
import type { Language, NavigationPage } from '../types';
import { 
  TrendingUp, 
  Truck, 
  FileText, 
  ThermometerSnowflake, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight
} from 'lucide-react';

interface ServicesPageProps {
  language: Language;
  onNavigate: (page: NavigationPage) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigate
}) => {
  // Interactive mini freight calculator state
  const [vehicle, setVehicle] = useState<'ace' | 'pickup' | 'truck' | 'tractor'>('pickup');
  const [distanceKm, setDistanceKm] = useState<number>(65);
  const [loadQuintals, setLoadQuintals] = useState<number>(25);

  const vehicleRates = {
    ace: { name: 'Tata Ace (Chota Hathi)', capacity: '7 - 10 q', baseRateKm: 18, loadingPerQ: 15 },
    pickup: { name: 'Bolero / 407 Pickup', capacity: '20 - 30 q', baseRateKm: 26, loadingPerQ: 14 },
    truck: { name: '6-Wheeler Truck', capacity: '70 - 100 q', baseRateKm: 42, loadingPerQ: 12 },
    tractor: { name: 'Tractor Trolley', capacity: '35 - 50 q', baseRateKm: 24, loadingPerQ: 16 }
  };

  const currentVehicle = vehicleRates[vehicle];
  const estimatedFuelTransport = Math.round(distanceKm * currentVehicle.baseRateKm + 250); // 250 base staging
  const estimatedLoading = Math.round(loadQuintals * currentVehicle.loadingPerQ);
  const totalFreight = estimatedFuelTransport + estimatedLoading;
  const freightPerQuintal = loadQuintals > 0 ? (totalFreight / loadQuintals).toFixed(1) : '0';

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* Services Page Header */}
      <section className="bg-[#F4F8F5] border-b border-[#E2ECE3] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] bg-white px-3 py-1 rounded-full border border-[#CCE0D0]">
              Operational Suite & Tools
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-[#123826] font-['Syne',sans-serif] tracking-tight">
              Enterprise Agronomy & Market Infrastructure
            </h1>
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-['Outfit',sans-serif]">
              From soil-level moisture tracking to statutory APMC gate liquidation, VerdaAgro provides full-spectrum algorithmic and operational tools for India's agricultural supply chain.
            </p>
          </div>
        </div>
      </section>

      {/* Deep Dive into 6 Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Service 1: APMC Price Discovery Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-[#E2ECE3] shadow-xs">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF5ED] text-[#2E7D32] text-xs font-bold">
              <TrendingUp className="w-4 h-4" />
              <span>Service 01 • Market Discovery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#123826] font-['Syne',sans-serif]">
              APMC Price Discovery Engine
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Direct connection into the Agmarknet agricultural reporting grid. We continuously monitor and index modal auction prices, arrival volumes, and min-max spreads across 20+ verified mandis.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                <span>Modal auction price detection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                <span>Daily arrival volume monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                <span>Price spread & arbitrage matrix</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
                <span>0% synthetic hallucinations</span>
              </div>
            </div>
            <div className="pt-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-5 py-2.5 rounded-xl bg-[#123826] hover:bg-[#2E7D32] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Launch Search in Terminal</span>
                <ArrowRight className="w-4 h-4 text-[#E8A238]" />
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 bg-[#FAFBF9] p-6 rounded-2xl border border-[#E2ECE3] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">Sample Agmarknet Matrix</h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2.5 rounded-lg bg-white border border-[#E2ECE3]">
                <span className="font-sans font-bold text-[#123826]">Ballari APMC (Tomato)</span>
                <span className="font-bold text-[#2E7D32]">₹1,850/q</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-white border border-[#E2ECE3]">
                <span className="font-sans font-bold text-[#123826]">Kolar APMC (Tomato)</span>
                <span className="font-bold text-[#2E7D32]">₹1,920/q</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-white border border-[#E2ECE3]">
                <span className="font-sans font-bold text-[#123826]">Lasalgaon APMC (Onion)</span>
                <span className="font-bold text-[#2E7D32]">₹2,100/q</span>
              </div>
            </div>
          </div>
        </div>

        {/* Service 2: Interactive Freight & Haulage Simulator */}
        <div className="bg-[#FAFBF9] p-8 rounded-3xl border border-[#E2ECE3] space-y-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8E7] text-[#E8A238] text-xs font-bold">
              <Truck className="w-4 h-4" />
              <span>Service 02 • Logistics Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#123826] font-['Syne',sans-serif]">
              Interactive Haulage & Net-Freight Simulator
            </h2>
            <p className="text-stone-600 text-sm sm:text-base">
              Calculate exact transport and loading deductions before deciding whether to dispatch to a distant mandi.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 rounded-2xl border border-[#E2ECE3]">
            {/* Controls */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <label className="text-xs font-bold text-[#123826] uppercase tracking-wider block mb-2">
                  Select Vehicle Type
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['ace', 'pickup', 'truck', 'tractor'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setVehicle(v)}
                      className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                        vehicle === v
                          ? 'border-[#2E7D32] bg-[#EBF5ED] text-[#123826] font-bold shadow-xs'
                          : 'border-[#E2ECE3] hover:bg-stone-50 text-stone-700 font-medium'
                      }`}
                    >
                      <p className="text-xs font-bold">{vehicleRates[v].name}</p>
                      <p className="text-[11px] text-stone-600">{vehicleRates[v].capacity}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#123826] mb-1">
                    <span>Mandi Distance (km)</span>
                    <span className="font-mono text-[#2E7D32]">{distanceKm} km</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={250}
                    step={5}
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(Number(e.target.value))}
                    className="w-full accent-[#2E7D32] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-[#123826] mb-1">
                    <span>Consignment Load (Quintals)</span>
                    <span className="font-mono text-[#2E7D32]">{loadQuintals} q</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={100}
                    step={5}
                    value={loadQuintals}
                    onChange={(e) => setLoadQuintals(Number(e.target.value))}
                    className="w-full accent-[#2E7D32] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Freight Output Card */}
            <div className="lg:col-span-5 bg-[#F4F8F5] p-6 rounded-2xl border border-[#CCE0D0] space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">Simulated Transport Cost</h4>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Base Haulage & Fuel ({distanceKm} km)</span>
                  <span className="font-mono font-bold text-[#123826]">₹{estimatedFuelTransport}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Hamali & Unloading ({loadQuintals} q)</span>
                  <span className="font-mono font-bold text-[#123826]">₹{estimatedLoading}</span>
                </div>
                <div className="pt-2 border-t border-[#CCE0D0] flex justify-between items-baseline">
                  <span className="font-bold text-[#123826] text-sm">Total Logistics Cost</span>
                  <span className="text-2xl font-black text-[#123826] font-mono">₹{totalFreight.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-[#2E7D32] font-semibold pt-1">
                  <span>Deduction per quintal:</span>
                  <span className="font-mono font-bold">₹{freightPerQuintal} / q</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full py-2.5 rounded-xl bg-[#123826] hover:bg-[#2E7D32] text-white text-xs font-bold transition-all cursor-pointer shadow-xs text-center"
              >
                Apply to Live Market Net Return
              </button>
            </div>
          </div>
        </div>

        {/* Service 3: Digital Mandi Gate Pass & Consignment Desk */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-[#E2ECE3] shadow-xs">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF5ED] text-[#2E7D32] text-xs font-bold">
              <FileText className="w-4 h-4" />
              <span>Service 03 • Statutory Documentation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#123826] font-['Syne',sans-serif]">
              Digital Mandi Gate Pass & Receipt Desk
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Generate standardized statutory gate slips before departing the farm. Formatted in accordance with APMC Act 2026 regulations to lock in consignment weights, crate counts, and vehicle registration numbers.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('dispatch')}
                className="px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#123826] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Open Dispatch Workstation</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 bg-[#F9FBF9] p-6 rounded-2xl border border-[#CCE0D0] text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EBF5ED] flex items-center justify-center text-3xl">
              📄
            </div>
            <p className="font-bold text-[#123826] text-sm">Official Consignment Entry Pass</p>
            <p className="text-stone-600 text-xs leading-relaxed">
              Equipped with reference QR codes, weighbridge timestamps, and statutory cess guarantees.
            </p>
          </div>
        </div>

        {/* Service 4: Cold Chain & Warehousing Network */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-[#E2ECE3] shadow-xs">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8E7] text-[#E8A238] text-xs font-bold">
              <ThermometerSnowflake className="w-4 h-4" />
              <span>Service 04 • Post-Harvest Infrastructure</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#123826] font-['Syne',sans-serif]">
              Cold Chain & Staging Warehouses
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Protect perishable solanaceous crops from distress selling. When terminal mandis crash due to temporary supply glut, our staging protocols allow farmers to hold produce under 10-12°C controlled atmosphere until prices recover.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs text-stone-700">
              <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#E2ECE3]">
                <p className="font-bold text-[#123826]">Tomatoes & Peppers</p>
                <p className="text-stone-600 mt-0.5">10-12°C • 90-95% RH • 14 days holding</p>
              </div>
              <div className="p-3 bg-[#FAFBF9] rounded-xl border border-[#E2ECE3]">
                <p className="font-bold text-[#123826]">Onions & Tubers</p>
                <p className="text-stone-600 mt-0.5">0-2°C • 65-70% RH • 120 days holding</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-[#E2ECE3] bg-stone-100 p-6 text-center space-y-3">
              <p className="text-3xl">❄️</p>
              <h4 className="font-bold text-[#123826] text-base">Distress Sale Prevention</h4>
              <p className="text-stone-600 text-xs">
                Avoid selling tomatoes at ₹5/kg during peak afternoon arrivals. Hold overnight for morning auction peaks at ₹18-22/kg.
              </p>
            </div>
          </div>
        </div>

        {/* Service 5 & 6: AI Advisory + 11-Step Protocol */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Service 5 */}
          <div className="bg-white p-7 rounded-3xl border border-[#E2ECE3] shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#EBF5ED] text-[#2E7D32] flex items-center justify-center text-xl">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#123826]">Trilingual Voice & Advisory</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Instant speech query and audio readouts in English, Hindi, and Kannada. Powered by browser Web Speech API with strictly grounded Agmarknet market data.
            </p>
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-xs font-bold text-[#2E7D32] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Try Speech Query in Terminal →</span>
            </button>
          </div>

          {/* Service 6 */}
          <div className="bg-white p-7 rounded-3xl border border-[#E2ECE3] shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFF8E7] text-[#E8A238] flex items-center justify-center text-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#123826]">Statutory 11-Step Selling Protocol</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Step-by-step checklist covering pre-sorting, vehicle departure, tare weight verification, auction lot bidding, and official receipt collection.
            </p>
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-xs font-bold text-[#2E7D32] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>View Farmer Checklist →</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
