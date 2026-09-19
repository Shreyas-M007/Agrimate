import React from 'react';
import type { Language, NavigationPage } from '../types';
import { 
  Cpu, 
  Database, 
  ArrowRight,
  Users
} from 'lucide-react';

interface AboutPageProps {
  language: Language;
  onNavigate: (page: NavigationPage) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigate
}) => {
  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* Editorial Page Header */}
      <section className="bg-[#ECE8DE]/60 border-b border-[#E6E1D7] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] bg-white px-3 py-1 rounded-full border border-[#E6E1D7]">
              About AgriMate Platform
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-[#153424] font-['Syne',sans-serif] tracking-tight">
              Restoring Fair Value to the Hands that Feed the Nation
            </h1>
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-['Outfit',sans-serif]">
              AgriMate bridges the gap between the farmer's soil and terminal APMC markets. By coupling agronomic stewardship with price transparency, we ensure growers capture their rightful margin.
            </p>
          </div>
        </div>
      </section>

      {/* The Agrarian Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-mono font-bold text-[#2E7D32] uppercase tracking-wider">The Market Asymmetry Problem</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#153424] font-['Syne',sans-serif]">
              Eliminating Price Leakage Before the Mandi Gate
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              Smallholder farmers often face arbitrary trader quotes, inflated harvest-peak freight, and undocumented yard deductions.
            </p>
            <p className="text-stone-600 text-sm leading-relaxed">
              AgriMate connects farm-gate decisions directly with official Agmarknet arrivals, vehicle-matched transport math, and standardized gate receipts.
            </p>
            
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-white border border-[#E6E1D7] shadow-xs">
                <p className="text-xl font-black text-[#153424] font-mono">+19.4%</p>
                <p className="text-xs text-stone-600 mt-0.5">Average net return improvement</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#E6E1D7] shadow-xs">
                <p className="text-xl font-black text-[#2E7D32] font-mono">100%</p>
                <p className="text-xs text-stone-600 mt-0.5">Verified Agmarknet prices</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-[#E6E1D7] shadow-lg bg-stone-100">
              <img 
                src="/mandi_gate_trade.jpg" 
                alt="APMC Mandi Weighbridge Gate Settlement" 
                className="w-full h-72 sm:h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Architectural Pillars */}
      <section className="bg-[#ECE8DE]/40 py-12 sm:py-16 border-y border-[#E6E1D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-1.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2E7D32] bg-[#EAEFE9] px-3 py-1 rounded-full border border-[#D6DFD4]">
              Operational Framework
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#153424] font-['Syne',sans-serif]">
              Four Pillars of Fair Settlement
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm">
              Standardized protection from soil preparation to gate liquidation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Pillar 1 */}
            <div className="bg-white p-5 rounded-2xl border border-[#E6E1D7] shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#EAEFE9] text-[#2E7D32] flex items-center justify-center text-lg notranslate" translate="no">
                🌱
              </div>
              <h3 className="text-base font-bold text-[#153424]">Soil Stewardship</h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                Pre-harvest moisture indexing and regenerative cropping to ensure durable shelf life during transit.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-5 rounded-2xl border border-[#E6E1D7] shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#FFF8E7] text-[#E8A238] flex items-center justify-center text-lg notranslate" translate="no">
                ⚖️
              </div>
              <h3 className="text-base font-bold text-[#153424]">Price Transparency</h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                Direct APMC modal bids, spread analysis, and daily arrival statistics with zero algorithmic hallucination.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-5 rounded-2xl border border-[#E6E1D7] shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#EAEFE9] text-[#2E7D32] flex items-center justify-center text-lg notranslate" translate="no">
                🚛
              </div>
              <h3 className="text-base font-bold text-[#153424]">Freight Math</h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                Vehicle-matched haulage calculation across Tata Ace to 6-Wheelers to verify distance economics.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white p-5 rounded-2xl border border-[#E6E1D7] shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#FFF8E7] text-[#E8A238] flex items-center justify-center text-lg notranslate" translate="no">
                🤝
              </div>
              <h3 className="text-base font-bold text-[#153424]">Fair Settlement</h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                Digital entry slips and statutory APMC Act weighbridge validation preventing unauthorized deductions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technological Edge */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] bg-[#EAEFE9] px-3 py-1 rounded-full border border-[#D6DFD4]">
            System Architecture
          </span>
          <h2 className="text-3xl font-black text-[#153424] font-['Syne',sans-serif]">
            Engineered for Rural Resiliency
          </h2>
          <p className="text-stone-600 text-sm">
            Built from the ground up to operate reliably across rural edge conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E6E1D7] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#EAEFE9] text-[#2E7D32] flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#153424]">SQLite Edge Storage</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              When farmers lose 4G connectivity at remote farm gates, AgriMate automatically switches to its local-first SQLite cache. You never lose access to previously verified mandi rates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E6E1D7] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFF8E7] text-[#E8A238] flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#153424]">Strict Agmarknet Grounding</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Our market intelligence engine evaluates only verifiable APMC arrivals. We enforce zero synthetic hallucinations, ensuring that every rupee quoted reflects a real market transaction.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E6E1D7] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#EAEFE9] text-[#2E7D32] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#153424]">Trilingual Natural Voice</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Farmers can query the terminal using voice in English, Hindi, or Kannada. The system parses produce quantities, units (kg, quintals, tonnes), and locations using native phonetic parsing.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#153424] text-white p-8 sm:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-[#1f4a34]">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black font-['Syne',sans-serif]">
              Put AgriMate Intelligence to Work on Your Harvest
            </h3>
            <p className="text-stone-300 text-sm">
              Access real-time APMC mandi prices, run vehicle freight simulations, and download official gate slips.
            </p>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-3.5 rounded-xl bg-[#E8A238] hover:bg-[#d4912e] text-[#153424] font-black text-sm flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-sm"
          >
            <span>Open Interactive Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
