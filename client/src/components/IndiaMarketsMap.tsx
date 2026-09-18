import React, { useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import type { NavigationPage } from '../types';

export interface MandiPin {
  id: string;
  name: string;
  fullName: string;
  district: string;
  state: string;
  region: 'karnataka' | 'maharashtra' | 'ap_ts' | 'north';
  lat: number;
  lon: number;
  crop: string;
  cropIcon: string;
  modalPrice: string;
  change: string;
  arrivals: string;
  type: string;
  isMega?: boolean;
}

export const VERIFIED_MANDI_PINS: MandiPin[] = [
  // Karnataka (10)
  {
    id: "MKT-KA-001",
    name: "Ballari APMC",
    fullName: "Ballari Wholesale APMC Yard",
    district: "Ballari",
    state: "Karnataka",
    region: "karnataka",
    lat: 15.1394,
    lon: 76.9214,
    crop: "Tomato Hybrid",
    cropIcon: "🍅",
    modalPrice: "₹1,850/q",
    change: "+2.6%",
    arrivals: "140 qtls",
    type: "Primary Yard"
  },
  {
    id: "MKT-KA-002",
    name: "Kudligi APMC",
    fullName: "Kudligi APMC Market Sub-Yard",
    district: "Ballari",
    state: "Karnataka",
    region: "karnataka",
    lat: 14.9011,
    lon: 76.3872,
    crop: "Groundnut",
    cropIcon: "🥜",
    modalPrice: "₹5,800/q",
    change: "+1.2%",
    arrivals: "75 qtls",
    type: "Sub-Yard"
  },
  {
    id: "MKT-KA-003",
    name: "Hospet APMC",
    fullName: "Hospet APMC Yard",
    district: "Ballari",
    state: "Karnataka",
    region: "karnataka",
    lat: 15.2689,
    lon: 76.3909,
    crop: "Maize",
    cropIcon: "🌽",
    modalPrice: "₹2,180/q",
    change: "+0.8%",
    arrivals: "190 qtls",
    type: "Regional Yard"
  },
  {
    id: "MKT-KA-004",
    name: "Kolar APMC",
    fullName: "Kolar APMC (Asia's 2nd Largest Tomato Market)",
    district: "Kolar",
    state: "Karnataka",
    region: "karnataka",
    lat: 13.1367,
    lon: 78.1291,
    crop: "Tomato",
    cropIcon: "🍅",
    modalPrice: "₹2,200/q",
    change: "+3.8%",
    arrivals: "850 qtls",
    type: "Mega Mandi",
    isMega: true
  },
  {
    id: "MKT-KA-005",
    name: "Chintamani APMC",
    fullName: "Chintamani APMC Yard",
    district: "Chikkaballapur",
    state: "Karnataka",
    region: "karnataka",
    lat: 13.4007,
    lon: 78.0566,
    crop: "Tomato Sona",
    cropIcon: "🍅",
    modalPrice: "₹2,100/q",
    change: "+1.4%",
    arrivals: "320 qtls",
    type: "Sub-Yard"
  },
  {
    id: "MKT-KA-006",
    name: "Bangalore APMC",
    fullName: "Bangalore Yeshwanthpur APMC Yard",
    district: "Bangalore Urban",
    state: "Karnataka",
    region: "karnataka",
    lat: 13.0280,
    lon: 77.5409,
    crop: "Potato / Onion",
    cropIcon: "🥔",
    modalPrice: "₹2,350/q",
    change: "+1.5%",
    arrivals: "1,200 qtls",
    type: "Apex Terminal",
    isMega: true
  },
  {
    id: "MKT-KA-007",
    name: "Belagavi APMC",
    fullName: "Belagavi APMC Market",
    district: "Belagavi",
    state: "Karnataka",
    region: "karnataka",
    lat: 15.8497,
    lon: 74.4977,
    crop: "Vegetables",
    cropIcon: "🥬",
    modalPrice: "₹1,950/q",
    change: "+0.9%",
    arrivals: "410 qtls",
    type: "Regional Mandi"
  },
  {
    id: "MKT-KA-008",
    name: "Mysuru APMC",
    fullName: "Mysuru Bandipalya APMC Yard",
    district: "Mysuru",
    state: "Karnataka",
    region: "karnataka",
    lat: 12.2782,
    lon: 76.6747,
    crop: "Paddy / Rice",
    cropIcon: "🍚",
    modalPrice: "₹2,450/q",
    change: "+2.1%",
    arrivals: "530 qtls",
    type: "Terminal Yard"
  },
  {
    id: "MKT-KA-009",
    name: "Davanagere APMC",
    fullName: "Davanagere APMC Market",
    district: "Davanagere",
    state: "Karnataka",
    region: "karnataka",
    lat: 14.4644,
    lon: 75.9218,
    crop: "Maize Commercial",
    cropIcon: "🌽",
    modalPrice: "₹2,150/q",
    change: "+4.2%",
    arrivals: "670 qtls",
    type: "Grain Hub",
    isMega: true
  },
  {
    id: "MKT-KA-010",
    name: "Hubballi APMC",
    fullName: "Hubballi Amaragol APMC Yard",
    district: "Dharwad",
    state: "Karnataka",
    region: "karnataka",
    lat: 15.3949,
    lon: 75.1240,
    crop: "Cotton Medium",
    cropIcon: "☁️",
    modalPrice: "₹7,200/q",
    change: "+1.4%",
    arrivals: "390 qtls",
    type: "Cotton Terminal"
  },

  // Maharashtra (4)
  {
    id: "MKT-MH-001",
    name: "Lasalgaon APMC",
    fullName: "Lasalgaon APMC (Asia's Largest Onion Market)",
    district: "Nashik",
    state: "Maharashtra",
    region: "maharashtra",
    lat: 20.1472,
    lon: 74.2255,
    crop: "Onion Red",
    cropIcon: "🧅",
    modalPrice: "₹2,100/q",
    change: "+1.9%",
    arrivals: "2,400 qtls",
    type: "Mega Mandi",
    isMega: true
  },
  {
    id: "MKT-MH-002",
    name: "Nashik APMC",
    fullName: "Nashik APMC Yard",
    district: "Nashik",
    state: "Maharashtra",
    region: "maharashtra",
    lat: 19.9975,
    lon: 73.7898,
    crop: "Tomato Local",
    cropIcon: "🍅",
    modalPrice: "₹1,920/q",
    change: "-1.1%",
    arrivals: "610 qtls",
    type: "Regional Mandi"
  },
  {
    id: "MKT-MH-003",
    name: "Pimpalgaon APMC",
    fullName: "Pimpalgaon Baswant APMC",
    district: "Nashik",
    state: "Maharashtra",
    region: "maharashtra",
    lat: 20.1697,
    lon: 73.9858,
    crop: "Tomato / Grapes",
    cropIcon: "🍇",
    modalPrice: "₹2,050/q",
    change: "+3.2%",
    arrivals: "780 qtls",
    type: "Horticulture Hub"
  },
  {
    id: "MKT-MH-004",
    name: "Pune APMC",
    fullName: "Pune Gultekdi Market Yard",
    district: "Pune",
    state: "Maharashtra",
    region: "maharashtra",
    lat: 18.4967,
    lon: 73.8647,
    crop: "Paddy & Vegetables",
    cropIcon: "🍚",
    modalPrice: "₹2,300/q",
    change: "+0.5%",
    arrivals: "1,500 qtls",
    type: "Apex Terminal",
    isMega: true
  },

  // Andhra Pradesh & Telangana (3)
  {
    id: "MKT-AP-001",
    name: "Guntur APMC",
    fullName: "Guntur APMC (Asia's Largest Chilli Market)",
    district: "Guntur",
    state: "Andhra Pradesh",
    region: "ap_ts",
    lat: 16.3067,
    lon: 80.4365,
    crop: "Green / Red Chilli",
    cropIcon: "🌶️",
    modalPrice: "₹3,400/q",
    change: "+5.2%",
    arrivals: "1,800 qtls",
    type: "Mega Mandi",
    isMega: true
  },
  {
    id: "MKT-AP-002",
    name: "Kurnool APMC",
    fullName: "Kurnool APMC Market Yard",
    district: "Kurnool",
    state: "Andhra Pradesh",
    region: "ap_ts",
    lat: 15.8281,
    lon: 78.0373,
    crop: "Groundnut Pods",
    cropIcon: "🥜",
    modalPrice: "₹5,650/q",
    change: "+0.7%",
    arrivals: "440 qtls",
    type: "Oilseeds Yard"
  },
  {
    id: "MKT-TS-001",
    name: "Warangal APMC",
    fullName: "Warangal Enumamula APMC Yard",
    district: "Warangal",
    state: "Telangana",
    region: "ap_ts",
    lat: 17.9689,
    lon: 79.5941,
    crop: "Cotton / Chilli",
    cropIcon: "☁️",
    modalPrice: "₹7,150/q",
    change: "+2.4%",
    arrivals: "920 qtls",
    type: "Apex Mandi",
    isMega: true
  },

  // North & Central India (3)
  {
    id: "MKT-PB-001",
    name: "Khanna APMC",
    fullName: "Khanna APMC (Asia's Largest Grain Market)",
    district: "Ludhiana",
    state: "Punjab",
    region: "north",
    lat: 30.7071,
    lon: 76.2167,
    crop: "Wheat Sharbati",
    cropIcon: "🌾",
    modalPrice: "₹2,275/q",
    change: "+1.1%",
    arrivals: "3,100 qtls",
    type: "Mega Mandi",
    isMega: true
  },
  {
    id: "MKT-UP-001",
    name: "Agra APMC",
    fullName: "Agra APMC Market Yard",
    district: "Agra",
    state: "Uttar Pradesh",
    region: "north",
    lat: 27.1767,
    lon: 78.0081,
    crop: "Potato Kufri",
    cropIcon: "🥔",
    modalPrice: "₹1,480/q",
    change: "-0.5%",
    arrivals: "1,100 qtls",
    type: "Potato Belt Terminal"
  },
  {
    id: "MKT-MP-001",
    name: "Indore APMC",
    fullName: "Indore APMC Yard",
    district: "Indore",
    state: "Madhya Pradesh",
    region: "north",
    lat: 22.7196,
    lon: 75.8577,
    crop: "Soybean / Wheat",
    cropIcon: "🌱",
    modalPrice: "₹4,600/q",
    change: "+1.8%",
    arrivals: "890 qtls",
    type: "Central Hub",
    isMega: true
  }
];

interface IndiaMarketsMapProps {
  onNavigate?: (page: NavigationPage) => void;
  onSearchAndNavigate?: (crop?: string, mandi?: string) => void;
}

export const IndiaMarketsMap: React.FC<IndiaMarketsMapProps> = ({
  onNavigate,
  onSearchAndNavigate
}) => {
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'karnataka' | 'maharashtra' | 'ap_ts' | 'north'>('all');
  const [activePin, setActivePin] = useState<MandiPin>(VERIFIED_MANDI_PINS[0]);

  // Geographic projection bounds for India
  // Longitude: 68.0E to 97.2E, Latitude: 8.0N to 37.0N
  const projectCoords = (lat: number, lon: number) => {
    const minLon = 68.0;
    const maxLon = 97.2;
    const minLat = 8.0;
    const maxLat = 37.0;
    const padX = 28;
    const padY = 24;
    const usableW = 440 - padX * 2;
    const usableH = 500 - padY * 2;

    const x = padX + ((lon - minLon) / (maxLon - minLon)) * usableW;
    const y = padY + ((maxLat - lat) / (maxLat - minLat)) * usableH;
    return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
  };

  const filteredPins = selectedRegion === 'all'
    ? VERIFIED_MANDI_PINS
    : VERIFIED_MANDI_PINS.filter(p => p.region === selectedRegion);

  const handlePinClick = (pin: MandiPin) => {
    setActivePin(pin);
  };

  const handleInspectTerminal = (pin: MandiPin) => {
    if (onSearchAndNavigate) {
      onSearchAndNavigate(pin.crop.split(' ')[0], pin.name);
    } else if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border-2 border-[#E6E1D7] shadow-lg bg-gradient-to-b from-[#F6F4EE] via-[#F2EFE8] to-[#EAE6DD] flex flex-col justify-between p-4 sm:p-5 transition-all">
      {/* Top Header & Live Telemetry Badge */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E6E1D7]/80">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E7D32] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2E7D32]"></span>
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#2E7D32]">
              National Mandi Grid
            </span>
          </div>
          <h3 className="text-xs sm:text-sm font-black text-[#153424] font-['Syne',sans-serif] tracking-tight">
            20 Verified APMC Mandis
          </h3>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAEFE9] border border-[#D6DFD4] text-[10px] font-mono font-bold text-[#153424]">
          <ShieldCheck className="w-3 h-3 text-[#2E7D32]" />
          <span>Agmarknet Live</span>
        </div>
      </div>

      {/* Region Filter Chips */}
      <div className="pt-2.5 pb-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar notranslate" translate="no">
        {[
          { id: 'all', label: 'All (20)' },
          { id: 'karnataka', label: 'Karnataka (10)' },
          { id: 'maharashtra', label: 'Maharashtra (4)' },
          { id: 'ap_ts', label: 'AP & TS (3)' },
          { id: 'north', label: 'North & MP (3)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              const r = tab.id as any;
              setSelectedRegion(r);
              const firstInRegion = VERIFIED_MANDI_PINS.find(p => r === 'all' || p.region === r);
              if (firstInRegion) setActivePin(firstInRegion);
            }}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-tight whitespace-nowrap transition-all cursor-pointer ${
              selectedRegion === tab.id
                ? 'bg-[#153424] text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-stone-600 border border-[#E6E1D7]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Interactive India Map SVG Canvas */}
      <div className="relative w-full h-72 sm:h-80 my-2 flex items-center justify-center select-none overflow-hidden">
        <svg
          viewBox="0 0 440 500"
          className="w-full h-full max-h-[320px] drop-shadow-sm transition-transform duration-300"
        >
          <defs>
            {/* Soft Linen Gradients */}
            <linearGradient id="indiaLandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F9F7F2" />
              <stop offset="60%" stopColor="#F2ECE1" />
              <stop offset="100%" stopColor="#E9E2D4" />
            </linearGradient>

            <linearGradient id="highlightRegionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EBF5ED" />
              <stop offset="100%" stopColor="#D9ECDD" />
            </linearGradient>

            <radialGradient id="pinRadarGrad">
              <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#2E7D32" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Coordinates Dotted Lat/Lon Guides */}
          <g stroke="#E3DDD1" strokeWidth="0.75" strokeDasharray="3 3">
            <line x1="30" y1="120" x2="410" y2="120" />
            <line x1="30" y1="230" x2="410" y2="230" />
            <line x1="30" y1="340" x2="410" y2="340" />
            <line x1="30" y1="430" x2="410" y2="430" />
            <line x1="120" y1="30" x2="120" y2="470" />
            <line x1="210" y1="30" x2="210" y2="470" />
            <line x1="310" y1="30" x2="310" y2="470" />
          </g>

          {/* India Boundary Path: Smooth Authentic Contour */}
          <path
            d="
              M 152 42
              C 165 38, 178 50, 185 64
              C 192 78, 196 92, 206 102
              C 218 114, 238 128, 252 135
              C 268 142, 290 148, 308 152
              C 324 156, 342 165, 356 178
              C 370 190, 395 198, 412 205
              C 418 214, 415 228, 404 235
              C 392 242, 375 240, 365 248
              C 355 256, 350 268, 342 276
              C 334 285, 318 290, 310 302
              C 300 316, 290 334, 275 348
              C 260 362, 242 376, 228 395
              C 215 412, 198 435, 185 455
              C 178 466, 172 478, 168 488
              C 165 484, 160 468, 156 455
              C 150 435, 142 418, 134 398
              C 125 376, 116 355, 108 335
              C 98 310, 88 295, 74 282
              C 62 272, 48 266, 38 255
              C 32 248, 35 238, 45 232
              C 58 225, 75 220, 88 208
              C 102 195, 114 178, 122 160
              C 130 142, 138 120, 142 98
              C 145 78, 146 54, 152 42
              Z
            "
            fill="url(#indiaLandGrad)"
            stroke="#CFC4B2"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />

          {/* Internal Regional Ribbons (Subtle demarcations for agro belts) */}
          <g fill="none" stroke="#DFD6C9" strokeWidth="1" strokeDasharray="2 2">
            {/* Northern Belt Border */}
            <path d="M 108 175 Q 165 185 245 195" />
            {/* Central Heart (Madhya Pradesh) */}
            <path d="M 95 250 Q 155 260 270 270" />
            {/* Deccan Plateau (Maharashtra - Karnataka) */}
            <path d="M 112 335 Q 165 345 250 355" />
            {/* South Karnataka - Coromandel */}
            <path d="M 134 420 Q 170 428 205 435" />
          </g>

          {/* Plotted Verified APMC Mandi Pins */}
          {filteredPins.map((pin) => {
            const { x, y } = projectCoords(pin.lat, pin.lon);
            const isSelected = activePin.id === pin.id;

            return (
              <g
                key={pin.id}
                onClick={() => handlePinClick(pin)}
                className="cursor-pointer group/pin"
                style={{ transformOrigin: `${x}px ${y}px` }}
              >
                {/* Active radar ping for selected pin */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="12"
                    fill="url(#pinRadarGrad)"
                    className="animate-ping"
                  />
                )}

                {/* Outer Glow Halo */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? "9" : pin.isMega ? "7" : "5.5"}
                  fill={isSelected ? "#2E7D32" : pin.isMega ? "#E8A238" : "#153424"}
                  fillOpacity={isSelected ? "0.2" : "0.15"}
                  className="transition-all duration-300"
                />

                {/* Main Pin Dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? "5.5" : pin.isMega ? "4.5" : "3.5"}
                  fill={isSelected ? "#2E7D32" : pin.isMega ? "#E8A238" : "#153424"}
                  stroke="#FFFFFF"
                  strokeWidth={isSelected ? "2" : "1.2"}
                  className="transition-all duration-300 group-hover/pin:scale-125"
                />

                {/* Center Accent Pip */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? "2" : "1.2"}
                  fill="#FFFFFF"
                />

                {/* Clean Label for Mega Mandis or Selected Pin */}
                {(isSelected || pin.isMega) && (
                  <g className="transition-all duration-300 pointer-events-none">
                    <rect
                      x={x + 7}
                      y={y - 12}
                      width={pin.name.length * 6.2 + 10}
                      height="17"
                      rx="4"
                      fill={isSelected ? "#153424" : "rgba(255, 255, 255, 0.95)"}
                      stroke={isSelected ? "#2E7D32" : "#D6DFD4"}
                      strokeWidth="0.8"
                    />
                    <text
                      x={x + 12}
                      y={y}
                      fill={isSelected ? "#FFFFFF" : "#153424"}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="system-ui, sans-serif"
                    >
                      {pin.name.replace(' APMC', '')}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend Overlay at Map Top-Right */}
        <div className="absolute top-2 right-2 p-2 rounded-xl bg-white/85 backdrop-blur-xs border border-[#E6E1D7] text-[9px] font-mono text-stone-600 space-y-1 shadow-xs pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E8A238]"></span>
            <span>Mega Mandi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#153424]"></span>
            <span>Regional Yard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32]"></span>
            <span>Selected</span>
          </div>
        </div>
      </div>

      {/* Dynamic Active Mandi Slide-Up Card */}
      <div 
        className="mt-1 p-3.5 rounded-2xl bg-white border border-[#E6E1D7] shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up notranslate"
        translate="no"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#EAEFE9] text-[#2E7D32] border border-[#D6DFD4]">
                {activePin.type}
              </span>
              <span className="text-[10px] text-stone-500 font-medium">
                {activePin.district}, {activePin.state}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-[#153424] truncate">
              {activePin.fullName}
            </h4>

            <div className="flex items-center gap-2 pt-0.5 text-[11px]">
              <span className="flex items-center gap-1 font-semibold text-stone-700">
                <span className="notranslate" translate="no">{activePin.cropIcon}</span>
                <span>{activePin.crop}</span>
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-stone-500 font-mono text-[10px]">
                Arrivals: {activePin.arrivals}
              </span>
            </div>
          </div>

          {/* Price & Action Button */}
          <div className="text-right shrink-0 space-y-1">
            <span className="text-sm sm:text-base font-black font-mono text-[#153424] block">
              {activePin.modalPrice}
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono inline-block ${
              activePin.change.startsWith('+') ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
            }`}>
              {activePin.change} Modal
            </span>

            <div>
              <button
                type="button"
                onClick={() => handleInspectTerminal(activePin)}
                className="mt-1 px-3 py-1 rounded-xl bg-[#153424] hover:bg-[#1f4a34] text-white text-[10px] font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
              >
                <span>Terminal</span>
                <ArrowRight className="w-3 h-3 text-[#E8A238]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
