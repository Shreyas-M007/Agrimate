import React from 'react';
import { ArrowUpRight, TrendingUp, ShieldCheck, Truck, BookOpen } from 'lucide-react';
import type { NavigationPage } from '../types';

interface ContinentalMosaicProps {
  onNavigate: (page: NavigationPage) => void;
  onSelectCrop?: (crop: string) => void;
}

export const ContinentalMosaic: React.FC<ContinentalMosaicProps> = ({
  onNavigate
}) => {
  return (
    <section className="py-12 bg-[#ECE8DE]/60 border-y border-[#E6E1D7] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Section Header: Corporate Editorial Style */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E6E1D7] pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#2E7D32]"></span>
              <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-[#2E7D32]">
                Agricultural Operations & Intelligence
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#153424] tracking-tight font-['Syne',sans-serif]">
              Cultivating Integrity Across the Agro Supply Chain
            </h2>
          </div>
        </div>

        {/* Asymmetrical 4-Card Photographic Mosaic Grid — Real Unsplash Photos, Vivid Natural Color & Lighter Green Scrim */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Card 1: Wholesale Auction Terminal (Span 7 cols) */}
          <div
            onClick={() => onNavigate('dashboard')}
            className="lg:col-span-7 group relative rounded-3xl overflow-hidden min-h-[360px] sm:min-h-[400px] border border-[#CCE0D0] cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 bg-[#163D28] flex flex-col justify-between p-6 sm:p-8"
          >
            {/* Real Photo: Authentic Indian APMC Mandi Wholesale Auction Yard */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-85"
              style={{ backgroundImage: `url('/mandi_auction_yard.jpg')` }}
            />
            {/* Lighter Green Scrim Overlay */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(12, 38, 24, 0.88) 0%, rgba(18, 54, 34, 0.45) 55%, rgba(12, 38, 24, 0.20) 100%)'
              }}
            />

            {/* Top Row: Tag & Live Indicator */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold tracking-wider text-[#FCD34D] uppercase">
                <TrendingUp className="w-3 h-3 text-[#FCD34D]" />
                Auction Terminal
              </span>
              <span className="text-[11px] font-mono text-emerald-200 bg-emerald-900/70 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                124 APMC Mandis Live
              </span>
            </div>

            {/* Bottom Content & Circular Arrow Button */}
            <div className="relative z-10 pt-16 flex items-end justify-between gap-4">
              <div className="space-y-2 max-w-md">
                <h3 className="text-xl sm:text-2xl font-black text-white font-['Syne',sans-serif] tracking-tight group-hover:text-emerald-200 transition-colors">
                  Wholesale Auction Terminal & Price Depth
                </h3>
                <p className="text-stone-200 text-xs sm:text-sm font-['Outfit',sans-serif] leading-relaxed line-clamp-2">
                  Inspect real-time modal bids, modal price spreads, arrivals, and 7-day price movements across verified APMC yards.
                </p>
              </div>

              <div className="shrink-0 w-12 h-12 rounded-full border border-white/40 bg-white/15 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 group-hover:bg-[#FCD34D] group-hover:border-[#FCD34D] group-hover:text-[#123826] group-hover:scale-110 shadow-lg">
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>

          {/* Card 2: Statutory Compliance & Farmer Rights (Span 5 cols) */}
          <div
            onClick={() => onNavigate('services')}
            className="lg:col-span-5 group relative rounded-3xl overflow-hidden min-h-[360px] sm:min-h-[400px] border border-[#CCE0D0] cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 bg-[#163D28] flex flex-col justify-between p-6 sm:p-8"
          >
            {/* Real Photo: Authentic Indian Farmer in Crop Field */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-85"
              style={{ backgroundImage: `url('/farmer_field.jpg')` }}
            />
            {/* Lighter Green Scrim Overlay */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(12, 38, 24, 0.88) 0%, rgba(18, 54, 34, 0.45) 55%, rgba(12, 38, 24, 0.20) 100%)'
              }}
            />

            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold tracking-wider text-[#FCD34D] uppercase">
                <ShieldCheck className="w-3 h-3 text-[#FCD34D]" />
                Statutory Rights
              </span>
              <span className="text-[11px] font-mono text-amber-200 bg-amber-900/70 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                ₹0 Hidden Cess
              </span>
            </div>

            <div className="relative z-10 pt-16 flex items-end justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-white font-['Syne',sans-serif] tracking-tight group-hover:text-amber-200 transition-colors">
                  Grower Protection & Legal Transparency
                </h3>
                <p className="text-stone-200 text-xs sm:text-sm font-['Outfit',sans-serif] leading-relaxed line-clamp-2">
                  Statutory 11-point seller checklist, regulated weighing oversight, and 24/7 legal grievance contacts.
                </p>
              </div>

              <div className="shrink-0 w-12 h-12 rounded-full border border-white/40 bg-white/15 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 group-hover:bg-[#FCD34D] group-hover:border-[#FCD34D] group-hover:text-[#123826] group-hover:scale-110 shadow-lg">
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>

          {/* Card 3: Logistics & Dispatch Desk (Span 5 cols) */}
          <div
            onClick={() => onNavigate('dispatch')}
            className="lg:col-span-5 group relative rounded-3xl overflow-hidden min-h-[340px] sm:min-h-[380px] border border-[#CCE0D0] cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 bg-[#163D28] flex flex-col justify-between p-6 sm:p-8"
          >
            {/* Real Photo: Authentic Indian Mandi Produce Logistics & Transport */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-85"
              style={{ backgroundImage: `url('/logistics_truck.jpg')` }}
            />
            {/* Lighter Green Scrim Overlay */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(12, 38, 24, 0.88) 0%, rgba(18, 54, 34, 0.45) 55%, rgba(12, 38, 24, 0.20) 100%)'
              }}
            />

            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold tracking-wider text-[#FCD34D] uppercase">
                <Truck className="w-3 h-3 text-[#FCD34D]" />
                Logistics & Gate Pass
              </span>
              <span className="text-[11px] font-mono text-emerald-200 bg-emerald-900/70 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                Digital Pass Ready
              </span>
            </div>

            <div className="relative z-10 pt-16 flex items-end justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-white font-['Syne',sans-serif] tracking-tight group-hover:text-emerald-200 transition-colors">
                  Pre-Dispatch Gate Vouchers & Freight
                </h3>
                <p className="text-stone-200 text-xs sm:text-sm font-['Outfit',sans-serif] leading-relaxed line-clamp-2">
                  Generate official printable APMC vouchers, compute truck freight deductions, and access weighment terminals.
                </p>
              </div>

              <div className="shrink-0 w-12 h-12 rounded-full border border-white/40 bg-white/15 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 group-hover:bg-[#FCD34D] group-hover:border-[#FCD34D] group-hover:text-[#123826] group-hover:scale-110 shadow-lg">
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>

          {/* Card 4: Crop Directory & Agronomy (Span 7 cols) */}
          <div
            onClick={() => onNavigate('crops')}
            className="lg:col-span-7 group relative rounded-3xl overflow-hidden min-h-[340px] sm:min-h-[380px] border border-[#CCE0D0] cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 bg-[#163D28] flex flex-col justify-between p-6 sm:p-8"
          >
            {/* Real Photo: Authentic Indian Agricultural Cold Storage & Commodity Grading Facility */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-85"
              style={{ backgroundImage: `url('/cold_storage.jpg')` }}
            />
            {/* Lighter Green Scrim Overlay */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(12, 38, 24, 0.88) 0%, rgba(18, 54, 34, 0.45) 55%, rgba(12, 38, 24, 0.20) 100%)'
              }}
            />

            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold tracking-wider text-[#FCD34D] uppercase">
                <BookOpen className="w-3 h-3 text-[#FCD34D]" />
                Commodity Standards
              </span>
              <span className="text-[11px] font-mono text-emerald-200 bg-emerald-900/70 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                104 Indian Crops in DB
              </span>
            </div>

            <div className="relative z-10 pt-16 flex items-end justify-between gap-4">
              <div className="space-y-2 max-w-md">
                <h3 className="text-xl sm:text-2xl font-black text-white font-['Syne',sans-serif] tracking-tight group-hover:text-emerald-200 transition-colors">
                  Pan-India Agricultural Crop Directory
                </h3>
                <p className="text-stone-200 text-xs sm:text-sm font-['Outfit',sans-serif] leading-relaxed line-clamp-2">
                  Standardized moisture criteria, peak harvest windows, and modal price benchmarks across 104 verified crops in database.
                </p>
              </div>

              <div className="shrink-0 w-12 h-12 rounded-full border border-white/40 bg-white/15 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 group-hover:bg-[#FCD34D] group-hover:border-[#FCD34D] group-hover:text-[#123826] group-hover:scale-110 shadow-lg">
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ContinentalMosaic;
