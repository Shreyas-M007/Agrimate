import React, { useState, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import type { NavigationPage } from '../types';
import { indiaMapData } from '../data/indiaMapData';
import { VERIFIED_MANDI_PINS, type MandiPin } from '../data/allStateMarketsData';

export type { MandiPin };
export { VERIFIED_MANDI_PINS };

interface IndiaMarketsMapProps {
  onNavigate?: (page: NavigationPage) => void;
  onSearchAndNavigate?: (crop?: string, mandi?: string) => void;
}

export const IndiaMarketsMap: React.FC<IndiaMarketsMapProps> = ({
  onNavigate,
  onSearchAndNavigate
}) => {
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'north' | 'west' | 'south' | 'east' | 'central_ne'>('all');
  const [selectedStateId, setSelectedStateId] = useState<string>('all');
  const [activePin, setActivePin] = useState<MandiPin>(VERIFIED_MANDI_PINS[0]);

  // Exact geographic linear projection onto official SVG viewBox 0 0 612 696
  const projectCoords = (lat: number, lon: number) => {
    const x = Math.round((20.75 * lon - 1416) * 10) / 10;
    const y = Math.round((-22.35 * lat + 848) * 10) / 10;
    return { x, y };
  };

  // Distinct states in the dataset
  const availableStates = useMemo(() => {
    const map = new Map<string, { id: string; name: string; count: number }>();
    for (const p of VERIFIED_MANDI_PINS) {
      const existing = map.get(p.stateId);
      if (existing) {
        existing.count++;
      } else {
        map.set(p.stateId, { id: p.stateId, name: p.state, count: 1 });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Filter pins based on Region and State
  const filteredPins = useMemo(() => {
    return VERIFIED_MANDI_PINS.filter((p) => {
      // Region filter
      if (selectedRegion !== 'all' && p.region !== selectedRegion) return false;
      // State filter
      if (selectedStateId !== 'all' && p.stateId !== selectedStateId) return false;
      return true;
    });
  }, [selectedRegion, selectedStateId]);

  // Check if a state is part of the currently active filter
  const isStateHighlighted = (stateId: string) => {
    if (selectedStateId !== 'all') {
      return stateId === selectedStateId;
    }
    if (selectedRegion === 'all') return true;
    if (selectedRegion === 'north') {
      return ['pb', 'hr', 'dl', 'up', 'hp', 'jk', 'ut', 'ch'].includes(stateId);
    }
    if (selectedRegion === 'west') {
      return ['mh', 'gj', 'rj', 'ga', 'dn', 'dd'].includes(stateId);
    }
    if (selectedRegion === 'south') {
      return ['ka', 'ap', 'tg', 'tn', 'kl', 'py'].includes(stateId);
    }
    if (selectedRegion === 'east') {
      return ['wb', 'br', 'or', 'jh'].includes(stateId);
    }
    if (selectedRegion === 'central_ne') {
      return ['mp', 'ct', 'as', 'ml', 'tr', 'mn', 'nl', 'mz', 'ar', 'sk'].includes(stateId);
    }
    return false;
  };

  const handleInspectTerminal = (pin: MandiPin) => {
    if (onSearchAndNavigate) {
      const cleanCrop = pin.crop.split(' ')[0];
      onSearchAndNavigate(cleanCrop, pin.name);
    } else if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  const activeStateName = selectedStateId !== 'all'
    ? availableStates.find(s => s.id === selectedStateId)?.name || 'State'
    : selectedRegion !== 'all'
      ? selectedRegion.toUpperCase().replace('_', ' & ')
      : 'All India';

  return (
    <div className="relative rounded-3xl overflow-hidden border-2 border-[#E6E1D7] shadow-lg bg-gradient-to-b from-[#F6F4EE] via-[#F2EFE8] to-[#EAE6DD] flex flex-col justify-between p-4 sm:p-5 transition-all">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2.5 pb-2.5 border-b border-[#E6E1D7]/80">
        <h3 className="text-xs sm:text-sm font-black text-[#153424] font-['Syne',sans-serif] tracking-tight flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E7D32] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2E7D32]"></span>
          </span>
          <span>{filteredPins.length} Verified APMC Mandis • {activeStateName}</span>
        </h3>
      </div>

      {/* Region Filter Chips */}
      <div className="pt-2.5 pb-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar notranslate" translate="no">
        {[
          { id: 'all', label: `All India (${VERIFIED_MANDI_PINS.length})` },
          { id: 'south', label: 'South' },
          { id: 'west', label: 'West' },
          { id: 'north', label: 'North' },
          { id: 'east', label: 'East' },
          { id: 'central_ne', label: 'Central & NE' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              const r = tab.id as any;
              setSelectedRegion(r);
              setSelectedStateId('all');
              const firstInRegion = VERIFIED_MANDI_PINS.find(p => r === 'all' || p.region === r);
              if (firstInRegion) setActivePin(firstInRegion);
            }}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-tight whitespace-nowrap transition-all cursor-pointer ${
              selectedRegion === tab.id && selectedStateId === 'all'
                ? 'bg-[#153424] text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-stone-600 border border-[#E6E1D7]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Official India Map SVG Canvas */}
      <div className="relative w-full h-84 sm:h-96 my-2 flex items-center justify-center select-none overflow-hidden">
        <svg
          viewBox={indiaMapData.viewBox || "0 0 612 696"}
          className="w-full h-full max-h-[380px] drop-shadow-sm transition-transform duration-300"
        >
          <defs>
            <radialGradient id="pinPulseGrad">
              <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#2E7D32" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Official India State Outlines */}
          <g className="transition-colors duration-300">
            {indiaMapData.locations.map((loc) => {
              const highlighted = isStateHighlighted(loc.id);
              const hasActiveMandi = activePin.stateId === loc.id;
              const isDirectlySelectedState = selectedStateId === loc.id;

              return (
                <path
                  key={loc.id}
                  id={loc.id}
                  d={loc.path}
                  fill={
                    isDirectlySelectedState || hasActiveMandi
                      ? "#DDEEE0" 
                      : highlighted 
                        ? "#F1ECE3" 
                        : "#E9E3D8"
                  }
                  stroke={
                    isDirectlySelectedState || hasActiveMandi 
                      ? "#2E7D32" 
                      : highlighted 
                        ? "#D0C4B2" 
                        : "#DED6CA"
                  }
                  strokeWidth={isDirectlySelectedState || hasActiveMandi ? "1.4" : highlighted ? "0.9" : "0.5"}
                  strokeLinejoin="round"
                  className="transition-all duration-300 hover:fill-[#E5DFD4] cursor-pointer"
                  onClick={() => {
                    const matchMandi = VERIFIED_MANDI_PINS.find(p => p.stateId === loc.id);
                    if (matchMandi) {
                      setActivePin(matchMandi);
                      setSelectedStateId(loc.id);
                      setSelectedRegion('all');
                    }
                  }}
                >
                  <title>{loc.name}</title>
                </path>
              );
            })}
          </g>

          {/* Plotted Verified APMC Mandi Pins */}
          {filteredPins.map((pin) => {
            const { x, y } = projectCoords(pin.lat, pin.lon);
            const isSelected = activePin.id === pin.id;

            return (
              <g
                key={pin.id}
                onClick={() => setActivePin(pin)}
                className="cursor-pointer group/pin"
                style={{ transformOrigin: `${x}px ${y}px` }}
              >
                {/* Active animated radar pulse */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="14"
                    fill="url(#pinPulseGrad)"
                    className="animate-ping pointer-events-none"
                  />
                )}

                {/* Outer Glow Halo */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? "8.5" : pin.isMega ? "6.5" : "4.5"}
                  fill={isSelected ? "#2E7D32" : pin.isMega ? "#E8A238" : "#153424"}
                  fillOpacity={isSelected ? "0.3" : "0.2"}
                  className="transition-all duration-300"
                />

                {/* Main Pin Dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? "5" : pin.isMega ? "3.8" : "2.8"}
                  fill={isSelected ? "#2E7D32" : pin.isMega ? "#E8A238" : "#153424"}
                  stroke="#FFFFFF"
                  strokeWidth={isSelected ? "1.8" : "0.9"}
                  className="transition-all duration-300 group-hover/pin:scale-125"
                />

                {/* Center Accent Pip */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? "1.8" : "0.9"}
                  fill="#FFFFFF"
                />

                {/* Clean Label for Selected Pin */}
                {isSelected && (
                  <g className="transition-all duration-300 pointer-events-none">
                    <rect
                      x={x + 6}
                      y={y - 10}
                      width={pin.name.length * 6 + 10}
                      height="15"
                      rx="3.5"
                      fill="#153424"
                      stroke="#2E7D32"
                      strokeWidth="0.8"
                    />
                    <text
                      x={x + 10}
                      y={y + 0.5}
                      fill="#FFFFFF"
                      fontSize="8.5"
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
        <div className="absolute top-2 right-2 p-2 rounded-xl glass-card-subtle border border-white/80 text-[9px] font-mono text-stone-600 space-y-1 shadow-xs pointer-events-none">
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
        className="mt-1 p-3.5 rounded-2xl glass-card border border-white/80 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up notranslate"
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
              <span className="font-semibold text-stone-700">
                {activePin.crop}
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
