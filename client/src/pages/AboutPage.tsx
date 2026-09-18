import React from 'react';
import type { Language, NavigationPage } from '../types';
import { 
  Cpu, 
  Database, 
  ArrowRight,
  CheckCircle2,
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
      <section className="bg-[#F4F8F5] border-b border-[#E2ECE3] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] bg-white px-3 py-1 rounded-full border border-[#CCE0D0]">
              About AgriMate Platform
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-[#123826] font-['Syne',sans-serif] tracking-tight">
              Restoring Fair Value to the Hands that Feed the Nation
            </h1>
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed font-['Outfit',sans-serif]">
              AgriMate bridges the generational gap between the farmer's soil and terminal APMC markets. By coupling agronomic stewardship with algorithmic price transparency, we ensure growers capture their rightful margin.
            </p>
          </div>
        </div>
      </section>

      {/* The Agrarian Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">The Market Asymmetry Problem</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#123826] font-['Syne',sans-serif]">
              Why Farmers Lose 20% to 35% of Their Value Before Reaching the Mandi
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Historically, smallholder farmers operate under profound information asymmetry. Local middlemen quote prices arbitrarily, transport operators inflate freight during harvest peaks, and unverified weighbridges lead to unaccounted deductions.
            </p>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              AgriMate was conceived to systematically eliminate these leakage points. By democratizing real-time Agmarknet auction data, standardizing statutory gate passes, and simulating net returns in-hand, farmers enter APMC yards equipped with official market intelligence.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white border border-[#E2ECE3] shadow-xs">
                <p className="text-2xl font-black text-[#123826] font-mono">+19.4%</p>
                <p className="text-xs font-medium text-stone-600 mt-1">Average net return improvement for participating growers</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#E2ECE3] shadow-xs">
                <p className="text-2xl font-black text-[#2E7D32] font-mono">0%</p>
                <p className="text-xs font-medium text-stone-600 mt-1">Tolerance for speculative or fabricated market rates</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-stone-100">
              <img 
                src="/agro_terminal_hero.jpg" 
                alt="AgriMate Agronomy in Action" 
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Architectural Pillars */}
      <section className="bg-[#FAFBF9] py-16 border-y border-[#E2ECE3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] bg-[#EBF5ED] px-3 py-1 rounded-full border border-[#CCE0D0]">
              Operational Framework
            </span>
            <h2 className="text-3xl font-black text-[#123826] font-['Syne',sans-serif]">
              Our Four Pillars of Agricultural Equity
            </h2>
            <p className="text-stone-600 text-sm">
              How AgriMate ensures systematic protection across the harvest lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pillar 1 */}
            <div className="bg-white p-7 rounded-2xl border border-[#E2ECE3] shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#EBF5ED] text-[#2E7D32] flex items-center justify-center text-2xl notranslate" translate="no">
                🌱
              </div>
              <h3 className="text-xl font-bold text-[#123826]">1. Soil & Crop Stewardship</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Healthy soil produces dense, high-grade produce that commands premium modal auctions. We train farmers in regenerative cropping, optimal moisture regimes, and reduced chemical pesticide runoff, improving produce shelf life by up to 48 hours in transit.
              </p>
              <ul className="text-xs text-stone-600 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  Soil organic carbon testing & bio-fertilizer schedules
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  Pre-harvest moisture indexing to avoid post-harvest shrinkage
                </li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-7 rounded-2xl border border-[#E2ECE3] shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFF8E7] text-[#E8A238] flex items-center justify-center text-2xl notranslate" translate="no">
                ⚖️
              </div>
              <h3 className="text-xl font-bold text-[#123826]">2. Guaranteed Price Transparency</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                We ingest authentic arrival and price records straight from APMC market secretaries under the Agmarknet network. Our terminal calculates true modal rates, minimum and maximum spreads, and arrival velocity so growers negotiate with factual parity.
              </p>
              <ul className="text-xs text-stone-600 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  Zero synthetic or predicted prices—strictly reported bids
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  Full historical 7, 15, and 30-day price trend analysis
                </li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-7 rounded-2xl border border-[#E2ECE3] shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#EBF5ED] text-[#2E7D32] flex items-center justify-center text-2xl notranslate" translate="no">
                🚛
              </div>
              <h3 className="text-xl font-bold text-[#123826]">3. Algorithmic Freight Optimization</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                A higher price at a distant mandi is useless if excessive haulage erodes the differential. Our net-return calculator models vehicle fuel consumption, road tolls, and loading costs to tell the farmer whether travelling an extra 60 km is mathematically profitable.
              </p>
              <ul className="text-xs text-stone-600 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  Vehicle matching (Tata Ace, 407, 6-Wheeler, Tractor)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  Accurate km radius calculation from village coordinates
                </li>
              </ul>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white p-7 rounded-2xl border border-[#E2ECE3] shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFF8E7] text-[#E8A238] flex items-center justify-center text-2xl notranslate" translate="no">
                🤝
              </div>
              <h3 className="text-xl font-bold text-[#123826]">4. Fair Remuneration & Settlement</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Under the APMC Act 2026, buyers and commission agents cannot levy unauthorized deductions for grading, unloading, or payment delays. Our digital gate slip and 11-step protocol empower farmers to enforce certified weighment and immediate settlement.
              </p>
              <ul className="text-xs text-stone-600 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  Statutory APMC dispute arbitration guidelines
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                  Printable legal gate slips with unique consignment tracking
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technological Edge */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] bg-[#EBF5ED] px-3 py-1 rounded-full border border-[#CCE0D0]">
            System Architecture
          </span>
          <h2 className="text-3xl font-black text-[#123826] font-['Syne',sans-serif]">
            Engineered for Rural Resiliency
          </h2>
          <p className="text-stone-600 text-sm">
            Built from the ground up to operate reliably across rural edge conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E2ECE3] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#EBF5ED] text-[#2E7D32] flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#123826]">SQLite Edge Storage</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              When farmers lose 4G connectivity at remote farm gates, AgriMate automatically switches to its local-first SQLite cache. You never lose access to previously verified mandi rates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2ECE3] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFF8E7] text-[#E8A238] flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#123826]">Strict Agmarknet Grounding</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Our market intelligence engine evaluates only verifiable APMC arrivals. We enforce zero synthetic hallucinations, ensuring that every rupee quoted reflects a real market transaction.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2ECE3] space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#EBF5ED] text-[#2E7D32] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#123826]">Trilingual Natural Voice</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Farmers can query the terminal using voice in English, Hindi, or Kannada. The system parses produce quantities, units (kg, quintals, tonnes), and locations using native phonetic parsing.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#123826] text-white p-8 sm:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
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
            className="px-6 py-3.5 rounded-xl bg-[#E8A238] hover:bg-[#d4912e] text-[#123826] font-black text-sm flex items-center gap-2 transition-all cursor-pointer shrink-0"
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
