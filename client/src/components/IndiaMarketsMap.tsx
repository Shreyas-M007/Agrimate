import React, { useState, useMemo } from 'react';
import { ArrowRight, Sparkles, Orbit, Radio } from 'lucide-react';
import type { NavigationPage } from '../types';
import { VERIFIED_MANDI_PINS, type MandiPin } from '../data/allStateMarketsData';

export type { MandiPin };
export { VERIFIED_MANDI_PINS };

interface IndiaMarketsMapProps {
  onNavigate?: (page: NavigationPage) => void;
  onSearchAndNavigate?: (crop?: string, mandi?: string) => void;
}

// Major Pan-India Trade Arcs connecting key agricultural corridors
const TRADE_ARCS = [
  { fromId: 'MKT-KA-001', toId: 'MKT-DL-001', color: '#FCD34D', lift: 60, label: 'South-North Grain Corridor' },
  { fromId: 'MKT-MH-001', toId: 'MKT-WB-001', color: '#38BDF8', lift: 55, label: 'West-East Onion Transit' },
  { fromId: 'MKT-KA-001', toId: 'MKT-MH-001', color: '#F59E0B', lift: 40, label: 'Deccan Solanaceous Link' },
  { fromId: 'MKT-AP-001', toId: 'MKT-GJ-001', color: '#38BDF8', lift: 65, label: 'Spice & Seed Expressway' },
  { fromId: 'MKT-PB-001', toId: 'MKT-MH-001', color: '#FCD34D', lift: 55, label: 'Wheat & Basmati Artery' },
  { fromId: 'MKT-MP-001', toId: 'MKT-DL-001', color: '#FBBF24', lift: 35, label: 'Central Pulse Artery' },
];

export const IndiaMarketsMap: React.FC<IndiaMarketsMapProps> = ({
  onNavigate,
  onSearchAndNavigate
}) => {
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'north' | 'west' | 'south' | 'east' | 'central_ne'>('all');
  const [selectedStateId, setSelectedStateId] = useState<string>('all');
  const [activePin, setActivePin] = useState<MandiPin>(VERIFIED_MANDI_PINS[0]);
  const [hoveredPin, setHoveredPin] = useState<MandiPin | null>(null);

  // Exact perspective mapping onto 16:9 orbital Earth view (viewBox 0 0 1000 562.5)
  const projectGlobeCoords = (lat: number, lon: number) => {
    const lon0 = 78.5;
    const lat0 = 8.0;
    const dLon = lon - lon0;
    const dLat = lat - lat0;

    // Foreshortening towards north horizon
    const yPercent = 74.0 - (dLat * 2.02) + (dLat * dLat * 0.0072);
    
    // Perspective convergence toward upper vanishing point
    const k = 1.0 - (dLat * 0.0125);
    const xPercent = 48.2 + (dLon * 1.08 * k);

    const x = Math.round((xPercent / 100) * 1000 * 10) / 10;
    const y = Math.round((yPercent / 100) * 562.5 * 10) / 10;
    return { x, y };
  };

  const availableStates = useMemo(() => {
    const map = new Map<string, { id: string; name: string; count: number }>();
    for (const p of VERIFIED_MANDI_PINS) {
      const existing = map.get(p.stateId);
      if (existing) existing.count++;
      else map.set(p.stateId, { id: p.stateId, name: p.state, count: 1 });
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const filteredPins = useMemo(() => {
    return VERIFIED_MANDI_PINS.filter((p) => {
      if (selectedRegion !== 'all' && p.region !== selectedRegion) return false;
      if (selectedStateId !== 'all' && p.stateId !== selectedStateId) return false;
      return true;
    });
  }, [selectedRegion, selectedStateId]);

  const handleInspectTerminal = (pin: MandiPin) => {
    if (onSearchAndNavigate) onSearchAndNavigate(pin.crop.split(' ')[0], pin.name);
    else if (onNavigate) onNavigate('dashboard');
  };

  const activeStateName = selectedStateId !== 'all'
    ? availableStates.find(s => s.id === selectedStateId)?.name || 'State'
    : selectedRegion !== 'all'
      ? selectedRegion.toUpperCase().replace('_', ' & ')
      : 'All India';

  // Resolved arc coordinates
  const resolvedArcs = useMemo(() => {
    return TRADE_ARCS.map(arc => {
      const fromPin = VERIFIED_MANDI_PINS.find(p => p.id === arc.fromId) || VERIFIED_MANDI_PINS[0];
      const toPin = VERIFIED_MANDI_PINS.find(p => p.id === arc.toId) || VERIFIED_MANDI_PINS[1];
      const p1 = projectGlobeCoords(fromPin.lat, fromPin.lon);
      const p2 = projectGlobeCoords(toPin.lat, toPin.lon);
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2 - arc.lift;
      const pathD = `M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`;
      return { ...arc, p1, p2, pathD };
    });
  }, []);

  return (
    <div
      className="relative rounded-3xl overflow-hidden flex flex-col justify-between p-4 sm:p-5 transition-all select-none border border-white/10"
      style={{
        background: 'linear-gradient(175deg, #020408 0%, #050B14 50%, #03070F 100%)',
        boxShadow: '0 32px 64px rgba(0,0,0,0.70), 0 0 0 1px rgba(255,255,255,0.06) inset',
      }}
    >
      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between gap-2.5 pb-2.5 border-b border-white/10">
        <h3 className="text-xs sm:text-sm font-black text-white font-['Syne',sans-serif] tracking-tight flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
          </span>
          <span className="flex items-center gap-1.5">
            <Orbit className="w-3.5 h-3.5 text-cyan-400" />
            <span>Orbital Mandi Network • {activeStateName}</span>
          </span>
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
            <Radio className="w-2.5 h-2.5 animate-pulse text-cyan-400" />
            <span>{filteredPins.length} Active Nodes</span>
          </span>
        </div>
      </div>

      {/* Region Filter Chips — Sleek Dark Obsidian Pills */}
      <div className="relative z-10 pt-2.5 pb-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar notranslate" translate="no">
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
              const first = VERIFIED_MANDI_PINS.find(p => r === 'all' || p.region === r);
              if (first) setActivePin(first);
            }}
            className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-tight whitespace-nowrap transition-all cursor-pointer ${
              selectedRegion === tab.id && selectedStateId === 'all'
                ? 'bg-amber-400 text-stone-950 font-black shadow-lg shadow-amber-400/25 scale-102'
                : 'bg-white/5 hover:bg-white/12 text-white/70 border border-white/10 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Photographic Night Globe Canvas ── */}
      <div className="relative w-full aspect-[16/9] min-h-[300px] sm:min-h-[360px] my-2 overflow-hidden rounded-2xl border border-white/10 bg-[#020408]">
        {/* Photorealistic Orbital Satellite Earth at Night */}
        <img
          src="/india_globe_night.jpg"
          alt="Planet Earth from Space at Night — India Subcontinent"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Soft edge vignette to integrate seamlessly into dark card */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(2,4,8,0.65) 100%)',
          }}
        />

        {/* Interactive SVG Overlay with Glowing Arcs & Mandi Pins */}
        <svg
          viewBox="0 0 1000 562.5"
          className="absolute inset-0 w-full h-full"
          style={{ display: 'block' }}
        >
          <defs>
            {/* Pin pulse gradient */}
            <radialGradient id="globePinPulse">
              <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>

            {/* Cyan glow for trade routes */}
            <filter id="arcGlowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Gold glow for pins */}
            <filter id="goldPinGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ── Orbital Supply-Chain Arcs ── */}
          <g className="pointer-events-none opacity-80">
            {resolvedArcs.map((arc, i) => (
              <g key={i}>
                {/* Outer halo arc */}
                <path
                  d={arc.pathD}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth="2.5"
                  strokeOpacity="0.25"
                  filter="url(#arcGlowCyan)"
                />
                {/* Core bright arc */}
                <path
                  d={arc.pathD}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth="1.2"
                  strokeOpacity="0.75"
                  strokeDasharray="6 4"
                />
                {/* Animated light photon pulse travelling along the arc */}
                <circle r="3" fill="#FFFFFF">
                  <animateMotion
                    path={arc.pathD}
                    dur={`${4.5 + i * 0.8}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            ))}
          </g>

          {/* ── Verified APMC Mandi Pins plotted onto Earth at Night ── */}
          {filteredPins.map((pin) => {
            const { x, y } = projectGlobeCoords(pin.lat, pin.lon);
            const isSelected = activePin.id === pin.id;
            const isHovered = hoveredPin?.id === pin.id;

            return (
              <g
                key={pin.id}
                onClick={() => {
                  setActivePin(pin);
                  setSelectedStateId(pin.stateId);
                }}
                onMouseEnter={() => setHoveredPin(pin)}
                onMouseLeave={() => setHoveredPin(null)}
                style={{ cursor: 'pointer' }}
                className="group/pin transition-transform"
              >
                {/* Selected Pulsing Radar Waves */}
                {isSelected && (
                  <>
                    <circle
                      cx={x}
                      cy={y}
                      r="20"
                      fill="url(#globePinPulse)"
                      className="animate-ping pointer-events-none"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r="12"
                      fill="none"
                      stroke="#FCD34D"
                      strokeWidth="1.2"
                      strokeOpacity="0.6"
                    />
                  </>
                )}

                {/* Soft ambient stellar glow */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 10 : isHovered ? 8 : pin.isMega ? 6.5 : 4.5}
                  fill={isSelected ? '#FCD34D' : pin.isMega ? '#F97316' : '#FBBF24'}
                  fillOpacity={isSelected ? 0.45 : isHovered ? 0.35 : 0.22}
                  filter="url(#goldPinGlow)"
                />

                {/* Core Luminous Star Pin */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 5.5 : isHovered ? 4.5 : pin.isMega ? 3.5 : 2.5}
                  fill={isSelected ? '#FFFFFF' : pin.isMega ? '#FFA500' : '#FDE047'}
                  stroke={isSelected ? '#F59E0B' : 'rgba(255,255,255,0.7)'}
                  strokeWidth={isSelected ? 2 : 0.8}
                  className="transition-all duration-200"
                />

                {/* Center diamond spark */}
                <circle cx={x} cy={y} r={isSelected ? 2 : 1} fill="#FFFFFF" />

                {/* Pin Name Badge for Selected or Hovered Pin */}
                {(isSelected || isHovered) && (
                  <g className="pointer-events-none">
                    <rect
                      x={x + 9}
                      y={y - 12}
                      width={pin.name.replace(' APMC', '').length * 6.5 + 16}
                      height="18"
                      rx="5"
                      fill="#050B14"
                      stroke={isSelected ? '#FCD34D' : '#38BDF8'}
                      strokeWidth="1"
                      fillOpacity="0.92"
                    />
                    <text
                      x={x + 15}
                      y={y + 1}
                      fill={isSelected ? '#FCD34D' : '#FFFFFF'}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="system-ui, -apple-system, sans-serif"
                    >
                      {pin.name.replace(' APMC', '')}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend Overlay at Top-Right */}
        <div
          className="absolute top-2.5 right-2.5 p-2 rounded-xl text-[9px] font-mono text-white/80 space-y-1 pointer-events-none"
          style={{
            background: 'rgba(5, 11, 20, 0.85)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FFA500] shadow-xs shadow-orange-500/50"></span>
            <span>Mega Terminal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FDE047] shadow-xs shadow-yellow-500/50"></span>
            <span>Regional APMC</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-xs shadow-cyan-500/50"></span>
            <span>Trade Corridor</span>
          </div>
        </div>
      </div>

      {/* Dynamic Active Mandi Slide-Up Card — Frosted Obsidian Glass */}
      <div
        className="relative z-10 mt-1 p-3.5 rounded-2xl transition-all duration-300 notranslate"
        translate="no"
        style={{
          background: 'rgba(5, 11, 20, 0.82)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400/15 text-amber-300 border border-amber-400/30">
                {activePin.type}
              </span>
              <span className="text-[10px] text-white/55 font-medium">
                {activePin.district}, {activePin.state}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-white truncate flex items-center gap-1.5">
              <span>{activePin.fullName}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </h4>

            <div className="flex items-center gap-2 pt-0.5 text-[11px]">
              <span className="flex items-center gap-1 font-semibold text-white/90">
                <span className="notranslate" translate="no">{activePin.cropIcon}</span>
                <span>{activePin.crop}</span>
              </span>
              <span className="text-white/25">•</span>
              <span className="text-white/50 font-mono text-[10px]">
                Arrivals: {activePin.arrivals}
              </span>
            </div>
          </div>

          {/* Price & Action Button */}
          <div className="text-right shrink-0 space-y-1">
            <span className="text-sm sm:text-base font-black font-mono text-white block">
              {activePin.modalPrice}
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono inline-block ${
              activePin.change.startsWith('+') ? 'text-amber-300 bg-amber-400/15' : 'text-rose-400 bg-rose-500/15'
            }`}>
              {activePin.change} Modal
            </span>

            <div>
              <button
                type="button"
                onClick={() => handleInspectTerminal(activePin)}
                className="mt-1 px-3 py-1 rounded-xl bg-amber-400/90 hover:bg-amber-300 text-stone-950 text-[10px] font-black flex items-center gap-1 shadow-md shadow-amber-400/20 transition-all cursor-pointer"
              >
                <span>Terminal</span>
                <ArrowRight className="w-3 h-3 text-stone-950" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndiaMarketsMap;
