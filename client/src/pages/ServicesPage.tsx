import React, { useState } from 'react';
import type { Language, NavigationPage } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import {
  TrendingUp,
  Truck,
  FileText,
  ThermometerSnowflake,
  Cpu,
  CheckCircle2,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface ServicesPageProps {
  language: Language;
  onNavigate: (page: NavigationPage) => void;
  onOpenTerminologyGuide?: (term?: string) => void;
}

// Bento service cards — each has a real Unsplash photo + content
const BENTO_SERVICES = [
  {
    id: 1,
    tag: 'Auction Terminal',
    badge: '124 APMC Mandis',
    badgeColor: 'bg-white/15 text-white',
    title: 'Wholesale Auction Terminal & Price Depth',
    desc: 'Inspect real-time modal bids, modal price spreads, arrivals, and 7-day price movements across verified APMC yards.',
    photo: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=900&q=80&auto=format&fit=crop',
    page: 'dashboard' as NavigationPage,
    span: 'lg:col-span-7',
    icon: TrendingUp,
  },
  {
    id: 2,
    tag: 'Statutory Rights',
    badge: '₹0 Hidden Cess',
    badgeColor: 'bg-amber-500/90 text-white',
    title: 'Grower Protection & Legal Transparency',
    desc: 'Statutory 11-point seller checklist, regulated weighing oversight, and 24/7 legal grievance contacts.',
    photo: 'https://images.unsplash.com/photo-1589923188651-268a9765e432?w=900&q=80&auto=format&fit=crop',
    page: 'dashboard' as NavigationPage,
    span: 'lg:col-span-5',
    icon: CheckCircle2,
  },
  {
    id: 3,
    tag: 'Logistics & Gate Pass',
    badge: 'Digital Pass Ready',
    badgeColor: 'bg-white/15 text-white',
    title: 'Mandi Gate Pass & Dispatch Workstation',
    desc: 'Generate statutory gate slips with QR codes, weighbridge timestamps, and cess guarantees. Formatted under APMC Act.',
    photo: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=900&q=80&auto=format&fit=crop',
    page: 'dispatch' as NavigationPage,
    span: 'lg:col-span-5',
    icon: FileText,
  },
  {
    id: 4,
    tag: 'Commodity Standards',
    badge: '10 Core Crops',
    badgeColor: 'bg-white/15 text-white',
    title: 'Cold Chain & Staging Warehouses',
    desc: 'Protect perishables from distress selling. Hold produce under controlled atmosphere until prices recover.',
    photo: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=900&q=80&auto=format&fit=crop',
    page: 'dashboard' as NavigationPage,
    span: 'lg:col-span-7',
    icon: ThermometerSnowflake,
  },
];

export const ServicesPage: React.FC<ServicesPageProps> = ({
  language,
  onNavigate,
  onOpenTerminologyGuide
}) => {
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
  const estimatedFuelTransport = Math.round(distanceKm * currentVehicle.baseRateKm + 250);
  const estimatedLoading = Math.round(loadQuintals * currentVehicle.loadingPerQ);
  const totalFreight = estimatedFuelTransport + estimatedLoading;
  const freightPerQuintal = loadQuintals > 0 ? (totalFreight / loadQuintals).toFixed(1) : '0';

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* Page Header */}
      <section className="bg-[#ECE8DE]/60 border-b border-[#E6E1D7] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2E7D32] bg-white px-3 py-1 rounded-full border border-[#E6E1D7]">
              Operational Tools
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-[#153424] font-['Syne',sans-serif] tracking-tight">
              Market Logistics & Gate Infrastructure
            </h1>
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
              Real-time Agmarknet auction tracking, vehicle-matched freight simulators, cold storage guidelines, and official gate slips for Indian farmers.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">

        {/* ── Bento Photo Cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {BENTO_SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className={`${s.span} relative rounded-3xl overflow-hidden group cursor-pointer`}
                style={{ minHeight: '280px' }}
                onClick={() => onNavigate(s.page)}
              >
                {/* Photo */}
                <img
                  src={s.photo}
                  alt={s.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Scrim — slightly lighter green than #153424 */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(160deg, rgba(25,65,42,0.82) 0%, rgba(18,50,32,0.90) 100%)' }}
                />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-5 sm:p-6" style={{ minHeight: '280px' }}>
                  {/* Top row: tag + badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/70 bg-white/10 px-2 py-1 rounded-lg border border-white/10">
                      <Icon className="w-3 h-3" />
                      {s.tag}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${s.badgeColor}`}>
                      {s.badge}
                    </span>
                  </div>

                  {/* Bottom: title + desc + arrow */}
                  <div className="space-y-2">
                    <h2 className="text-lg sm:text-xl font-black text-white font-['Syne',sans-serif] leading-tight">
                      {s.title}
                    </h2>
                    <p className="text-white/65 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {s.desc}
                    </p>
                    <div className="pt-1">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15 border border-white/20 text-white group-hover:bg-white group-hover:text-[#153424] transition-all duration-300">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Interactive Freight Simulator ── */}
        <div className="bg-[#ECE8DE]/40 p-8 rounded-3xl border border-[#E6E1D7] space-y-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8E7] text-[#E8A238] text-xs font-bold">
              <Truck className="w-4 h-4" />
              <span>Service 02 • Logistics Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#153424] font-['Syne',sans-serif]">
              Interactive Haulage & Net-Freight Simulator
            </h2>
            <p className="text-stone-600 text-sm sm:text-base">
              Calculate exact transport and loading deductions before deciding whether to dispatch to a distant mandi.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 rounded-2xl border border-[#E6E1D7]">
            <div className="lg:col-span-7 space-y-5">
              <div>
                <label className="text-xs font-bold text-[#153424] uppercase tracking-wider block mb-2">Select Vehicle Type</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['ace', 'pickup', 'truck', 'tractor'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setVehicle(v)}
                      className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                        vehicle === v
                          ? 'border-[#2E7D32] bg-[#EAEFE9] text-[#153424] font-bold shadow-xs'
                          : 'border-[#E6E1D7] hover:bg-[#FAF8F5] text-stone-700 font-medium'
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
                  <div className="flex justify-between text-xs font-bold text-[#153424] mb-1">
                    <span>Mandi Distance (km)</span>
                    <span className="font-mono text-[#2E7D32]">{distanceKm} km</span>
                  </div>
                  <input type="range" min={10} max={250} step={5} value={distanceKm}
                    onChange={(e) => setDistanceKm(Number(e.target.value))}
                    className="w-full accent-[#2E7D32] cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-[#153424] mb-1">
                    <span>Consignment Load (Quintals)</span>
                    <span className="font-mono text-[#2E7D32]">{loadQuintals} q</span>
                  </div>
                  <input type="range" min={5} max={100} step={5} value={loadQuintals}
                    onChange={(e) => setLoadQuintals(Number(e.target.value))}
                    className="w-full accent-[#2E7D32] cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#FAF8F5] p-6 rounded-2xl border border-[#E6E1D7] space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">Simulated Transport Cost</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Base Haulage & Fuel ({distanceKm} km)</span>
                  <span className="font-mono font-bold text-[#153424]">₹{estimatedFuelTransport}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Hamali & Unloading ({loadQuintals} q)</span>
                  <span className="font-mono font-bold text-[#153424]">₹{estimatedLoading}</span>
                </div>
                <div className="pt-2 border-t border-[#E6E1D7] flex justify-between items-baseline">
                  <span className="font-bold text-[#153424] text-sm">Total Logistics Cost</span>
                  <span className="text-2xl font-black text-[#153424] font-mono">₹{totalFreight.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-[#2E7D32] font-semibold pt-1">
                  <span>Deduction per quintal:</span>
                  <span className="font-mono font-bold">₹{freightPerQuintal} / q</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full py-2.5 rounded-xl bg-[#153424] hover:bg-[#2E7D32] text-white text-xs font-bold transition-all cursor-pointer shadow-xs text-center"
              >
                Apply to Live Market Net Return
              </button>
            </div>
          </div>
        </div>

        {/* ── AI Advisory + 11-Step Protocol ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-7 rounded-3xl border border-[#E6E1D7] shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#EAEFE9] text-[#2E7D32] flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#153424]">Trilingual Voice & Advisory</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Instant speech query and audio readouts in English, Hindi, and Kannada. Powered by browser Web Speech API with strictly grounded Agmarknet market data.
            </p>
            <button onClick={() => onNavigate('dashboard')} className="text-xs font-bold text-[#2E7D32] flex items-center gap-1 hover:underline cursor-pointer">
              <span>Try Speech Query in Terminal →</span>
            </button>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-[#E6E1D7] shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#FFF8E7] text-[#E8A238] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#153424]">Statutory 11-Step Selling Protocol</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Step-by-step checklist covering pre-sorting, vehicle departure, tare weight verification, auction lot bidding, and official receipt collection.
            </p>
            <button onClick={() => onNavigate('dashboard')} className="text-xs font-bold text-[#2E7D32] flex items-center gap-1 hover:underline cursor-pointer">
              <span>View Farmer Checklist →</span>
            </button>
          </div>
        </div>

        {/* ── Terminology Guide CTA ── */}
        <div className="bg-gradient-to-br from-[#FAF8F5] to-[#EAEFE9] p-8 sm:p-10 rounded-3xl border border-[#CCE0D0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAEFE9] text-[#2E7D32] text-xs font-bold">
              <BookOpen className="w-4 h-4" />
              <span>Service 07 • Farmer Education & APMC Literacy</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#153424] font-['Syne',sans-serif]">
              Agricultural Terminology Guide
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Empowering farmers with transparent definitions of wholesale mandi mechanisms — understand <span className="font-bold text-[#153424]">Modal Price</span>, <span className="font-bold text-[#153424]">Minimum & Maximum Bids</span>, and <span className="font-bold text-[#153424]">Arrival Quantities</span> in 10 Indian languages.
            </p>
          </div>
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => { if (onOpenTerminologyGuide) onOpenTerminologyGuide('modal_price'); }}
              className="bg-[#153424] hover:bg-[#1f4a34] text-white font-bold px-6 py-3 rounded-full shadow-md border border-[#3FA744]/40 flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer text-xs sm:text-sm"
            >
              <BookOpen className="w-4 h-4 text-[#A5D6A7]" />
              <span>{TRANSLATIONS[language]?.educationalModalTitle || 'Agricultural Terminology Guide'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
