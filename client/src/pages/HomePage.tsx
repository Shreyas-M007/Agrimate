import React from 'react';
import type { Language, NavigationPage, Commodity } from '../types';
import { 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Truck, 
  FileText, 
  Cpu, 
  CheckCircle2, 
  Award, 
  PhoneCall,
  ChevronRight,
  Database,
  ThermometerSnowflake
} from 'lucide-react';

interface HomePageProps {
  language: Language;
  onNavigate: (page: NavigationPage) => void;
  onSelectCropAndNavigate?: (cropName: string) => void;
  commodities?: Commodity[];
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectCropAndNavigate
}) => {
  // Quick live mandi teaser data
  const liveTickers = [
    { crop: 'Tomato', mandi: 'Ballari APMC', state: 'Karnataka', modal: '₹1,850', min: '₹1,500', max: '₹2,200', change: '+₹150', trend: 'up' },
    { crop: 'Tomato', mandi: 'Kolar APMC', state: 'Karnataka', modal: '₹1,920', min: '₹1,600', max: '₹2,350', change: '+₹200', trend: 'up' },
    { crop: 'Onion', mandi: 'Lasalgaon APMC', state: 'Maharashtra', modal: '₹2,100', min: '₹1,750', max: '₹2,400', change: '-₹50', trend: 'down' },
    { crop: 'Onion', mandi: 'Hubballi APMC', state: 'Karnataka', modal: '₹2,050', min: '₹1,700', max: '₹2,350', change: '+₹80', trend: 'up' },
    { crop: 'Potato', mandi: 'Hassan APMC', state: 'Karnataka', modal: '₹1,600', min: '₹1,350', max: '₹1,850', change: '0', trend: 'stable' },
    { crop: 'Green Chilli', mandi: 'Guntur APMC', state: 'Andhra Pradesh', modal: '₹3,400', min: '₹2,900', max: '₹3,900', change: '+₹300', trend: 'up' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* SLIDE 1: EDITORIAL FARM HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F8F4] via-white to-[#FBFDF9] pt-8 sm:pt-14 pb-12 sm:pb-20 border-b border-[#E2ECE3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Editorial Headline & Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF5ED] border border-[#CCE0D0] text-[#123826] text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse"></span>
                <span>VERDAGRO AGRICULTURAL PLATFORM • MANDIMATE TERMINAL</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#123826] tracking-tight font-['Syne',sans-serif] leading-[1.1]">
                Cultivating Tomorrow with <span className="text-[#2E7D32] italic">Integrity</span> & <span className="text-[#E8A238]">Intelligence</span>
              </h1>

              <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl font-['Outfit',sans-serif]">
                India's next-generation agricultural commerce ecosystem. Bringing 100% verified APMC mandi prices, cold-chain haulage optimization, fair settlement rules, and zero-hallucination agronomy intelligence straight to 15,000+ progressive growers.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-6 py-3.5 rounded-xl bg-[#123826] hover:bg-[#1a4a34] text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-lg shadow-[#123826]/20 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Launch Live Terminal</span>
                  <ArrowRight className="w-4 h-4 text-[#E8A238]" />
                </button>

                <button
                  onClick={() => onNavigate('crops')}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-[#F2F8F4] text-[#123826] font-semibold text-sm sm:text-base border border-[#CCE0D0] shadow-xs transition-all cursor-pointer"
                >
                  Explore Crop Portfolio
                </button>

                <button
                  onClick={() => onNavigate('dispatch')}
                  className="px-5 py-3.5 rounded-xl bg-[#EBF5ED] hover:bg-[#d8eedc] text-[#123826] font-semibold text-sm flex items-center gap-2 border border-[#CCE0D0] transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#2E7D32]" />
                  <span>Generate Gate Slip</span>
                </button>
              </div>

              {/* Trust Guarantee Badges */}
              <div className="pt-4 border-t border-[#E2ECE3] flex flex-wrap items-center gap-5 text-xs text-stone-600">
                <div className="flex items-center gap-2 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                  <span>100% Agmarknet APMC Data</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <Award className="w-4 h-4 text-[#E8A238]" />
                  <span>APMC Act 2026 Statutory Standard</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <Database className="w-4 h-4 text-[#2E7D32]" />
                  <span>SQLite Edge-Resilient</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Showcase Image & Live Floating Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto rounded-3xl overflow-hidden border-4 border-white shadow-2xl shadow-[#123826]/15 bg-stone-100">
                <img 
                  src="/verda_agro_hero.jpg" 
                  alt="VerdaAgro Sustainable Farm and Farmers" 
                  className="w-full h-80 sm:h-96 lg:h-[440px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#123826]/80 via-[#123826]/20 to-transparent"></div>

                {/* Overlaid Banner at Bottom of Hero Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E2ECE3] shadow-lg text-[#123826]">
                  <div className="flex items-center justify-between text-xs font-semibold pb-1 border-b border-[#E2ECE3]">
                    <span className="flex items-center gap-1.5 text-[#2E7D32]">
                      <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-ping"></span>
                      Real-Time Agmarknet Stream
                    </span>
                    <span className="font-mono text-stone-500">20 APMC Mandis Active</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-stone-500 uppercase font-bold tracking-wider">Ballari Modal Rate</p>
                      <p className="text-xl font-black text-[#123826] font-mono">₹1,850 <span className="text-xs text-stone-600 font-normal">/ quintal</span></p>
                    </div>
                    <button
                      onClick={() => onNavigate('dashboard')}
                      className="px-3.5 py-1.5 rounded-lg bg-[#123826] text-white text-xs font-bold hover:bg-[#2E7D32] transition-colors cursor-pointer"
                    >
                      Compare Markets
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Badge Top Right */}
              <div className="absolute -top-4 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#CCE0D0] shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EBF5ED] flex items-center justify-center text-xl">
                  📈
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-stone-400">Net Realization</p>
                  <p className="text-sm font-black text-[#123826]">+19.4% Avg Yield</p>
                </div>
              </div>

            </div>
          </div>

          {/* Macro Stats Strip */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-[#E2ECE3] shadow-sm">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-[#123826] font-mono">20</p>
              <p className="text-xs sm:text-sm font-semibold text-stone-700">Verified APMC Mandis</p>
              <p className="text-[11px] text-stone-600">Direct Agmarknet integration</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-[#2E7D32] font-mono">15,000+</p>
              <p className="text-xs sm:text-sm font-semibold text-stone-700">Registered Growers</p>
              <p className="text-[11px] text-stone-600">Across 4 major agricultural states</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-[#E8A238] font-mono">₹48.2 Cr</p>
              <p className="text-xs sm:text-sm font-semibold text-stone-700">Produce Dispatched</p>
              <p className="text-[11px] text-stone-600">Estimated transparent turnover</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-[#123826] font-mono">0%</p>
              <p className="text-xs sm:text-sm font-semibold text-stone-700">AI Price Inventions</p>
              <p className="text-[11px] text-stone-600">Zero-hallucination strict rule</p>
            </div>
          </div>
        </div>
      </section>

      {/* SLIDE 2: ABOUT OUR FARMS & COMPANY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] bg-[#EBF5ED] px-3 py-1 rounded-full border border-[#CCE0D0]">
            Agricultural Heritage & Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#123826] font-['Syne',sans-serif]">
            Four Pillars of VerdaAgro Ecosystem
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Modern agronomy paired with algorithmic precision. We bridge the structural gap between the farmer's soil and terminal consumer markets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2ECE3] hover:border-[#CCE0D0] hover:shadow-lg transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-[#EBF5ED] text-[#2E7D32] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              🌱
            </div>
            <h3 className="text-lg font-bold text-[#123826]">Soil & Crop Stewardship</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Sustainable regenerative farming methods, moisture monitoring, and precision fertilization reducing input overheads by up to 22%.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2ECE3] hover:border-[#CCE0D0] hover:shadow-lg transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-[#FFF8E7] text-[#E8A238] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              ⚖️
            </div>
            <h3 className="text-lg font-bold text-[#123826]">Guaranteed Price Transparency</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Real-time Agmarknet modal auction prices, spread analysis, and daily arrival statistics with zero algorithmic speculation.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2ECE3] hover:border-[#CCE0D0] hover:shadow-lg transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-[#EBF5ED] text-[#2E7D32] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              🚛
            </div>
            <h3 className="text-lg font-bold text-[#123826]">Freight Route Optimization</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Vehicle-matched haulage calculation across Tata Ace, Pickup, and 6-Wheelers to prevent transport gouging before departure.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2ECE3] hover:border-[#CCE0D0] hover:shadow-lg transition-all space-y-3 group">
            <div className="w-12 h-12 rounded-xl bg-[#FFF8E7] text-[#E8A238] flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
              🤝
            </div>
            <h3 className="text-lg font-bold text-[#123826]">Fair Direct Settlement</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Standardized statutory gate passes and weighbridge verification under the APMC Act 2026 to ensure zero illicit commission deductions.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('about')}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#2E7D32] hover:text-[#123826] transition-colors cursor-pointer"
          >
            <span>Learn more about VerdaAgro's agronomy heritage & team</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* SLIDE 3: CORE SERVICES GRID */}
      <section className="bg-[#F4F8F5] py-16 border-y border-[#E2ECE3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] bg-white px-3 py-1 rounded-full border border-[#CCE0D0]">
                VerdaAgro Operational Suite
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#123826] font-['Syne',sans-serif]">
                Core Agricultural Services
              </h2>
              <p className="text-stone-600 text-sm sm:text-base max-w-xl">
                End-to-end technology infrastructure supporting the agricultural supply chain from harvest to APMC yard liquidation.
              </p>
            </div>
            <button
              onClick={() => onNavigate('services')}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#EBF5ED] text-[#123826] font-bold text-xs sm:text-sm border border-[#CCE0D0] transition-all cursor-pointer shadow-xs"
            >
              View Detailed Specifications
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Service 1 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E2ECE3] shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#EBF5ED] flex items-center justify-center text-[#2E7D32]">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#123826]">APMC Price Discovery</h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Live modal prices, min/max price spreads, and daily arrival quantities reported by official APMC market secretaries under Agmarknet.
              </p>
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-xs font-bold text-[#2E7D32] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Launch Search Terminal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Service 2 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E2ECE3] shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFF8E7] flex items-center justify-center text-[#E8A238]">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#123826]">Algorithmic Haulage Optimizer</h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Evaluates transport cost per km, diesel surcharge, loading fees, and road tolls against price differentials at distant mandis.
              </p>
              <button
                onClick={() => onNavigate('services')}
                className="text-xs font-bold text-[#2E7D32] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Run Freight Calculator</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Service 3 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E2ECE3] shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#EBF5ED] flex items-center justify-center text-[#2E7D32]">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#123826]">Digital Mandi Gate Pass</h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Instantly generates standardized consignment entry slips with unique reference IDs, driver logs, crate counts, and statutory seals.
              </p>
              <button
                onClick={() => onNavigate('dispatch')}
                className="text-xs font-bold text-[#2E7D32] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Open Dispatch Desk</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Service 4 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E2ECE3] shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFF8E7] flex items-center justify-center text-[#E8A238]">
                <ThermometerSnowflake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#123826]">Cold Chain & Storage</h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Post-harvest pre-cooling and humidity-regulated warehouse staging to protect perishable solanaceous crops from distress liquidation.
              </p>
              <button
                onClick={() => onNavigate('services')}
                className="text-xs font-bold text-[#2E7D32] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Explore Cold Network</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Service 5 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E2ECE3] shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#EBF5ED] flex items-center justify-center text-[#2E7D32]">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#123826]">Trilingual Agronomy Intelligence</h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Market advisories and audio readouts generated natively in English, Hindi, and Kannada with 100% strict grounding in verified arrivals.
              </p>
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-xs font-bold text-[#2E7D32] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Listen to Live Advisory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Service 6 */}
            <div className="bg-white p-6 rounded-2xl border border-[#E2ECE3] shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFF8E7] flex items-center justify-center text-[#E8A238]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#123826]">Statutory 11-Step Protocol</h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Pre-dispatch moisture audits, weighing oversight, cess caps, and digital settlement receipts to ensure zero unapproved commission deductions.
              </p>
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-xs font-bold text-[#2E7D32] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Review Farmer Protocol</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SLIDE 4: TODAY'S LIVE APMC RATE TICKER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-ping"></span>
              <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">Live Market Ticker</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#123826] font-['Syne',sans-serif]">
              Today's Prevailing APMC Rates
            </h2>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 rounded-xl bg-[#123826] text-white font-bold text-xs sm:text-sm flex items-center gap-2 hover:bg-[#2E7D32] transition-colors cursor-pointer"
          >
            <span>Open Interactive Terminal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveTickers.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white p-5 rounded-2xl border border-[#E2ECE3] hover:border-[#CCE0D0] hover:shadow-md transition-all space-y-3 cursor-pointer"
              onClick={() => {
                if (onSelectCropAndNavigate) onSelectCropAndNavigate(item.crop);
                else onNavigate('dashboard');
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#123826] text-base">{item.crop}</h3>
                  <p className="text-xs text-stone-600">{item.mandi} • {item.state}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  item.trend === 'up' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : item.trend === 'down' 
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-stone-50 text-stone-700 border border-stone-200'
                }`}>
                  {item.change}
                </span>
              </div>

              <div className="pt-2 border-t border-[#E2ECE3] flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-stone-600 block uppercase font-bold">Modal Auction Rate</span>
                  <span className="text-2xl font-black text-[#123826] font-mono">{item.modal}</span>
                  <span className="text-xs text-stone-600 ml-1">/ q</span>
                </div>
                <div className="text-right text-xs text-stone-600 font-mono">
                  <span>Range: {item.min} - {item.max}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SLIDE 5: CROP PORTFOLIO PREVIEW */}
      <section className="bg-[#FAFBF9] py-16 border-y border-[#E2ECE3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] bg-[#EBF5ED] px-3 py-1 rounded-full border border-[#CCE0D0]">
              Agricultural Produce Catalog
            </span>
            <h2 className="text-3xl font-black text-[#123826] font-['Syne',sans-serif]">
              Key Commodity Classifications
            </h2>
            <p className="text-stone-600 text-sm">
              We monitor and model daily APMC auctions across 5 major agrarian categories.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Category 1 */}
            <div 
              onClick={() => onNavigate('crops')}
              className="bg-white p-5 rounded-2xl border border-[#E2ECE3] hover:border-[#2E7D32] hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-2xl flex items-center justify-center">
                🍅
              </div>
              <h3 className="font-bold text-[#123826] text-sm sm:text-base">Solanaceous</h3>
              <p className="text-xs text-stone-600">Tomato, Chilli, Capsicum, Brinjal</p>
              <span className="inline-block text-[11px] font-bold text-[#2E7D32]">View 3 Commodities →</span>
            </div>

            {/* Category 2 */}
            <div 
              onClick={() => onNavigate('crops')}
              className="bg-white p-5 rounded-2xl border border-[#E2ECE3] hover:border-[#2E7D32] hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-2xl flex items-center justify-center">
                🧅
              </div>
              <h3 className="font-bold text-[#123826] text-sm sm:text-base">Alliums & Tubers</h3>
              <p className="text-xs text-stone-600">Onion, Potato, Garlic, Ginger</p>
              <span className="inline-block text-[11px] font-bold text-[#2E7D32]">View 2 Commodities →</span>
            </div>

            {/* Category 3 */}
            <div 
              onClick={() => onNavigate('crops')}
              className="bg-white p-5 rounded-2xl border border-[#E2ECE3] hover:border-[#2E7D32] hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-2xl flex items-center justify-center">
                🌾
              </div>
              <h3 className="font-bold text-[#123826] text-sm sm:text-base">Grains & Pulses</h3>
              <p className="text-xs text-stone-600">Paddy/Rice, Wheat, Maize</p>
              <span className="inline-block text-[11px] font-bold text-[#2E7D32]">View 3 Commodities →</span>
            </div>

            {/* Category 4 */}
            <div 
              onClick={() => onNavigate('crops')}
              className="bg-white p-5 rounded-2xl border border-[#E2ECE3] hover:border-[#2E7D32] hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-2xl flex items-center justify-center">
                🌱
              </div>
              <h3 className="font-bold text-[#123826] text-sm sm:text-base">Cash & Fibres</h3>
              <p className="text-xs text-stone-600">Cotton, Sugarcane</p>
              <span className="inline-block text-[11px] font-bold text-[#2E7D32]">View 1 Commodity →</span>
            </div>

            {/* Category 5 */}
            <div 
              onClick={() => onNavigate('crops')}
              className="bg-white p-5 rounded-2xl border border-[#E2ECE3] hover:border-[#2E7D32] hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-yellow-50 text-2xl flex items-center justify-center">
                🥜
              </div>
              <h3 className="font-bold text-[#123826] text-sm sm:text-base">Oilseeds</h3>
              <p className="text-xs text-stone-600">Soybean, Groundnut</p>
              <span className="inline-block text-[11px] font-bold text-[#2E7D32]">View 2 Commodities →</span>
            </div>
          </div>
        </div>
      </section>

      {/* SLIDE 6: GROWER IMPACT & CASE STUDIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] bg-[#EBF5ED] px-3 py-1 rounded-full border border-[#CCE0D0]">
            Field Impact & Verifiable Results
          </span>
          <h2 className="text-3xl font-black text-[#123826] font-['Syne',sans-serif]">
            Verified Grower Testimonials
          </h2>
          <p className="text-stone-600 text-sm">
            Real outcomes documented across major APMC mandi hubs in Karnataka, Maharashtra, and Andhra Pradesh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Testimonial 1 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2ECE3] shadow-xs space-y-4">
            <div className="flex items-center gap-1 text-[#E8A238] text-sm">
              {'★'.repeat(5)}
            </div>
            <p className="text-stone-700 text-sm leading-relaxed italic">
              "By checking the Kolar vs Ballari spread on MandiMate, I discovered a ₹220/quintal arbitrage. Even after deducting ₹4,500 for the 6-wheeler truck, I made ₹18,200 extra on my 80-quintal tomato lot."
            </p>
            <div className="pt-3 border-t border-[#E2ECE3] flex items-center justify-between">
              <div>
                <p className="font-bold text-[#123826] text-sm">Basavaraj Patil</p>
                <p className="text-xs text-stone-600">Hospete, Ballari • Tomato Grower</p>
              </div>
              <span className="text-xs font-bold text-[#2E7D32] bg-[#EBF5ED] px-2.5 py-1 rounded-full">
                +19.4% Return
              </span>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2ECE3] shadow-xs space-y-4">
            <div className="flex items-center gap-1 text-[#E8A238] text-sm">
              {'★'.repeat(5)}
            </div>
            <p className="text-stone-700 text-sm leading-relaxed italic">
              "The digital gate slip prevented local middlemen from claiming arbitrary weighing discounts. Having the Agmarknet official modal price printed on paper gave me bargaining power with the commission agent."
            </p>
            <div className="pt-3 border-t border-[#E2ECE3] flex items-center justify-between">
              <div>
                <p className="font-bold text-[#123826] text-sm">Sanjay Ghadge</p>
                <p className="text-xs text-stone-600">Niphad, Nashik • Onion Farmer</p>
              </div>
              <span className="text-xs font-bold text-[#2E7D32] bg-[#EBF5ED] px-2.5 py-1 rounded-full">
                Zero Illicit Cess
              </span>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E2ECE3] shadow-xs space-y-4">
            <div className="flex items-center gap-1 text-[#E8A238] text-sm">
              {'★'.repeat(5)}
            </div>
            <p className="text-stone-700 text-sm leading-relaxed italic">
              "The Kannada voice query is phenomenal. My father can simply speak into the phone in Kannada and hear the live audio advisory of Hubballi and Belagavi markets while standing in the field."
            </p>
            <div className="pt-3 border-t border-[#E2ECE3] flex items-center justify-between">
              <div>
                <p className="font-bold text-[#123826] text-sm">Mallikarjun Gowda</p>
                <p className="text-xs text-stone-600">Channagiri, Davanagere • Maize Grower</p>
              </div>
              <span className="text-xs font-bold text-[#2E7D32] bg-[#EBF5ED] px-2.5 py-1 rounded-full">
                Audio Advisory
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SLIDE 7: DATA INTEGRITY & TECHNICAL STANDARDS */}
      <section className="bg-[#F4F8F5] py-16 border-y border-[#E2ECE3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] bg-white px-3 py-1 rounded-full border border-[#CCE0D0]">
              Technical Compliance
            </span>
            <h2 className="text-3xl font-black text-[#123826] font-['Syne',sans-serif]">
              Data Standards & Zero-Hallucination Policy
            </h2>
            <p className="text-stone-600 text-sm">
              How VerdaAgro guarantees 100% computational integrity across all agricultural models.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-[#E2ECE3] space-y-2.5">
              <div className="text-2xl">🏛️</div>
              <h3 className="font-bold text-[#123826] text-base">APMC Act 2026</h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                Full statutory compliance with regulated mandi laws, capping unauthorized trade deductions and assuring certified weighment.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2ECE3] space-y-2.5">
              <div className="text-2xl">🔄</div>
              <h3 className="font-bold text-[#123826] text-base">Automated Agmarknet Sync</h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                Nightly scheduled data ingestion from the Directorate of Marketing & Inspection, caching 20 verified APMC nodes.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2ECE3] space-y-2.5">
              <div className="text-2xl">💾</div>
              <h3 className="font-bold text-[#123826] text-base">SQLite Local-First</h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                Autonomous offline resiliency. If field cellular networks drop in rural mandis, previously verified data remains fully functional.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E2ECE3] space-y-2.5">
              <div className="text-2xl">🛡️</div>
              <h3 className="font-bold text-[#123826] text-base">Zero Hallucination Rule</h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                AI market advisories are strictly constrained to the actual database records. No synthetic or estimated prices are ever fabricated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SLIDE 8: FIELD ACTION CALL-TO-ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#123826] via-[#1a4a34] to-[#123826] text-white p-8 sm:p-14 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E8A238] bg-white/10 px-3 py-1 rounded-full border border-white/20">
              Transform Your Produce Realization
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-['Syne',sans-serif] leading-tight">
              Ready to Discover True Fair-Market APMC Prices?
            </h2>
            <p className="text-stone-200 text-sm sm:text-base leading-relaxed">
              Launch the MandiMate terminal now. Input your crop and location to compare prevailing rates, simulate freight deductions, and generate digital gate slips.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-3.5 rounded-xl bg-[#E8A238] hover:bg-[#d4912e] text-[#123826] font-black text-sm sm:text-base flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <span>Launch Interactive Terminal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="tel:18001801551"
                className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm flex items-center gap-2 border border-white/20 transition-all"
              >
                <PhoneCall className="w-4 h-4 text-[#E8A238]" />
                <span>Kisan Helpline: 1800-180-1551</span>
              </a>
            </div>
          </div>

          {/* Subtle Decorative Pattern */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center text-9xl pointer-events-none select-none">
            🌾
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
