import React from 'react';
import { PhoneCall, ShieldCheck, TrendingUp, TrendingDown, Radio } from 'lucide-react';
import type { NavigationPage } from '../types';

interface TopUtilityPanelProps {
  onNavigate?: (page: NavigationPage) => void;
  onSelectCrop?: (crop: string) => void;
}

const TICKER_ITEMS = [
  { crop: 'Tomato', rate: '₹1,850/q', change: '+4.2%', up: true },
  { crop: 'Onion', rate: '₹1,420/q', change: '-1.8%', up: false },
  { crop: 'Maize', rate: '₹2,150/q', change: '+2.4%', up: true },
  { crop: 'Potato', rate: '₹1,380/q', change: '0.0%', up: true },
  { crop: 'Green Chilli', rate: '₹3,800/q', change: '+6.1%', up: true },
  { crop: 'Cotton', rate: '₹7,200/q', change: '+1.5%', up: true }
];

export const TopUtilityPanel: React.FC<TopUtilityPanelProps> = ({
  onNavigate,
  onSelectCrop
}) => {
  const handleItemClick = (cropName: string) => {
    if (onSelectCrop) onSelectCrop(cropName);
    if (onNavigate) onNavigate('dashboard');
  };

  return (
    <div className="bg-[#0B2317] text-[#D8EADB] text-[11px] font-medium border-b border-[#18452E] py-1.5 px-4 select-none print:hidden z-40 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Trading Session Pulse Indicator */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 bg-[#123826] px-2.5 py-0.5 rounded-full border border-[#23583C]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 text-emerald-400" />
              Live APMC Trading Session
            </span>
          </div>
          <span className="hidden sm:inline text-stone-400 text-[10px] font-mono">
            06:00 – 18:00 IST • Karnataka & Pan-India
          </span>
        </div>

        {/* Center: Live Rates Ticker Strip */}
        <div className="flex items-center gap-2 overflow-x-auto py-0.5 no-scrollbar max-w-full md:max-w-xl">
          <span className="text-[10px] uppercase font-bold text-emerald-400/80 tracking-wider shrink-0 hidden lg:inline">
            Spot Bids:
          </span>
          {TICKER_ITEMS.map((item) => (
            <button
              key={item.crop}
              onClick={() => handleItemClick(item.crop)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#133323] hover:bg-[#1C4932] border border-[#205036] hover:border-emerald-500/50 transition-colors text-[10px] shrink-0 cursor-pointer"
              title={`View ${item.crop} live market depth`}
            >
              <span className="font-semibold text-white">{item.crop}</span>
              <span className="font-mono text-emerald-200">{item.rate}</span>
              <span className={`inline-flex items-center text-[9px] font-mono ${item.up ? 'text-emerald-400' : 'text-amber-400'}`}>
                {item.up ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                {item.change}
              </span>
            </button>
          ))}
        </div>

        {/* Right: Institutional Support & Statutory Helpline */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden xl:flex items-center gap-1 text-[10px] text-stone-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>APMC Act 2026</span>
          </div>

          <a
            href="tel:18001801551"
            className="flex items-center gap-1 text-[#F2C94C] hover:text-amber-300 font-bold transition-colors bg-[#1A3A29] px-2 py-0.5 rounded-lg border border-[#2B5C3F]"
            title="24x7 Ministry of Agriculture & Farmers Welfare Kisan Call Centre"
          >
            <PhoneCall className="w-3 h-3 text-[#F2C94C]" />
            <span className="font-mono text-[10px]">Helpline: 1800-180-1551</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopUtilityPanel;
