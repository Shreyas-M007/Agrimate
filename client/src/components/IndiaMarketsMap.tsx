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

  const projectCoords = (lat: number, lon: number) => {
    const x = Math.round((20.75 * lon - 1416) * 10) / 10;
    const y = Math.round((-22.35 * lat + 848) * 10) / 10;
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

  const isStateHighlighted = (stateId: string) => {
    if (selectedStateId !== 'all') return stateId === selectedStateId;
    if (selectedRegion === 'all') return true;
    if (selectedRegion === 'north') return ['pb','hr','dl','up','hp','jk','ut','ch'].includes(stateId);
    if (selectedRegion === 'west')  return ['mh','gj','rj','ga','dn','dd'].includes(stateId);
    if (selectedRegion === 'south') return ['ka','ap','tg','tn','kl','py'].includes(stateId);
    if (selectedRegion === 'east')  return ['wb','br','or','jh'].includes(stateId);
    if (selectedRegion === 'central_ne') return ['mp','ct','as','ml','tr','mn','nl','mz','ar','sk'].includes(stateId);
    return false;
  };

  const handleInspectTerminal = (pin: MandiPin) => {
    if (onSearchAndNavigate) onSearchAndNavigate(pin.crop.split(' ')[0], pin.name);
    else if (onNavigate) onNavigate('dashboard');
  };

  const activeStateName = selectedStateId !== 'all'
    ? availableStates.find(s => s.id === selectedStateId)?.name || 'State'
    : selectedRegion !== 'all'
      ? selectedRegion.toUpperCase().replace('_', ' & ')
      : 'All India';

  return (
    <div
      className="relative rounded-3xl overflow-hidden flex flex-col justify-between p-4 sm:p-5 transition-all"
      style={{
        background: 'linear-gradient(160deg, #0A1628 0%, #0D1F3C 45%, #091525 100%)',
        boxShadow: '0 32px 64px rgba(0,0,0,0.50), 0 0 0 1px rgba(100,150,255,0.08) inset',
      }}
    >
      {/* Soft ocean ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 48%, rgba(30,80,160,0.18) 0%, transparent 80%)' }}
        aria-hidden="true"
      />

      {/* Top Header */}
      <div className="relative flex items-center justify-between gap-2.5 pb-2.5 border-b border-white/10">
        <h3 className="text-xs sm:text-sm font-black text-white font-['Syne',sans-serif] tracking-tight flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-400"></span>
          </span>
          <span>{filteredPins.length} Verified APMC Mandis • {activeStateName}</span>
        </h3>
      </div>

      {/* Region Filter Chips */}
      <div className="relative pt-2.5 pb-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar notranslate" translate="no">
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
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-tight whitespace-nowrap transition-all cursor-pointer ${
              selectedRegion === tab.id && selectedStateId === 'all'
                ? 'bg-sky-500/80 text-white shadow-sm'
                : 'bg-white/8 hover:bg-white/15 text-white/60 border border-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Satellite-Style Map Canvas */}
      <div className="relative w-full h-84 sm:h-96 my-2 select-none overflow-hidden rounded-xl">
        <svg
          viewBox={indiaMapData.viewBox || '0 0 612 696'}
          className="w-full h-full max-h-[380px]"
          style={{ display: 'block' }}
        >
          <defs>
            {/* Ocean gradient — deep Indian Ocean blue */}
            <radialGradient id="oceanGrad" cx="50%" cy="60%" r="80%">
              <stop offset="0%" stopColor="#1A3A6B" />
              <stop offset="55%" stopColor="#0D2550" />
              <stop offset="100%" stopColor="#07152E" />
            </radialGradient>
            {/* Land terrain gradient — satellite dark green/brown */}
            <linearGradient id="terrainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2D4A1E" />
              <stop offset="100%" stopColor="#1E3214" />
            </linearGradient>
            {/* Active state */}
            <linearGradient id="activeTerrainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A7C35" />
              <stop offset="100%" stopColor="#35601E" />
            </linearGradient>
            {/* Highlighted region */}
            <linearGradient id="highlightTerrainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#385A25" />
              <stop offset="100%" stopColor="#28451A" />
            </linearGradient>
            {/* Pin pulse */}
            <radialGradient id="pinPulseGrad">
              <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FCD34D" stopOpacity="0" />
            </radialGradient>
            {/* Terrain shadow */}
            <filter id="terrainShadow" x="-4%" y="-4%" width="108%" height="108%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Full ocean background */}
          <rect x="0" y="0" width="612" height="696" fill="url(#oceanGrad)" />

          {/* Subtle ocean grid shimmer */}
          {[120, 240, 360, 480, 600].map(y => (
            <line key={`h${y}`} x1="0" y1={y} x2="612" y2={y} stroke="rgba(100,160,255,0.05)" strokeWidth="0.5" />
          ))}
          {[100, 200, 300, 400, 500].map(x => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="696" stroke="rgba(100,160,255,0.05)" strokeWidth="0.5" />
          ))}

          {/* India State Paths — satellite terrain */}
          <g filter="url(#terrainShadow)">
            {indiaMapData.locations.map((loc) => {
              const highlighted = isStateHighlighted(loc.id);
              const hasActiveMandi = activePin.stateId === loc.id;
              const isSelected = selectedStateId === loc.id;
              return (
                <path
                  key={loc.id}
                  id={loc.id}
                  d={loc.path}
                  fill={
                    isSelected || hasActiveMandi ? 'url(#activeTerrainGrad)'
                    : highlighted ? 'url(#highlightTerrainGrad)'
                    : 'url(#terrainGrad)'
                  }
                  stroke={
                    isSelected || hasActiveMandi ? '#F59E0B'
                    : '#4A6830'
                  }
                  strokeWidth={isSelected || hasActiveMandi ? '1.2' : '0.5'}
                  strokeLinejoin="round"
                  style={{ cursor: 'pointer', transition: 'fill 0.25s' }}
                  onClick={() => {
                    const match = VERIFIED_MANDI_PINS.find(p => p.stateId === loc.id);
                    if (match) { setActivePin(match); setSelectedStateId(loc.id); setSelectedRegion('all'); }
                  }}
                >
                  <title>{loc.name}</title>
                </path>
              );
            })}
          </g>

          {/* APMC Mandi Pins — warm gold, satellite-style */}
          {filteredPins.map((pin) => {
            const { x, y } = projectCoords(pin.lat, pin.lon);
            const isActive = activePin.id === pin.id;
            return (
              <g key={pin.id} onClick={() => setActivePin(pin)} style={{ cursor: 'pointer' }}>
                {isActive && <circle cx={x} cy={y} r="16" fill="url(#pinPulseGrad)" className="animate-ping pointer-events-none" />}
                {/* glow ring */}
                <circle cx={x} cy={y} r={isActive ? 9 : pin.isMega ? 7 : 5}
                  fill={isActive ? '#FCD34D' : pin.isMega ? '#F97316' : '#FBBF24'} fillOpacity={isActive ? 0.28 : 0.18} />
                {/* main dot */}
                <circle cx={x} cy={y} r={isActive ? 5 : pin.isMega ? 3.8 : 2.8}
                  fill={isActive ? '#FCD34D' : pin.isMega ? '#F97316' : '#FBBF24'}
                  stroke={isActive ? '#fff' : 'rgba(255,255,255,0.55)'} strokeWidth={isActive ? 1.8 : 0.8} />
                {/* center pip */}
                <circle cx={x} cy={y} r={isActive ? 1.8 : 0.9} fill="rgba(255,255,255,0.95)" />
                {/* label */}
                {isActive && (
                  <g className="pointer-events-none">
                    <rect x={x + 7} y={y - 11} width={pin.name.replace(' APMC', '').length * 5.8 + 14} height={16} rx={4}
                      fill="#07152E" stroke="#FCD34D" strokeWidth={0.9} />
                    <text x={x + 12} y={y + 1} fill="#FCD34D" fontSize={8} fontWeight="bold" fontFamily="system-ui,sans-serif">
                      {pin.name.replace(' APMC', '')}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Satellite legend */}
        <div
          className="absolute top-2 right-2 p-2 rounded-xl text-[9px] font-mono text-white/70 space-y-1 pointer-events-none"
          style={{ background: 'rgba(7,21,46,0.88)', backdropFilter: 'blur(8px)', border: '1px solid rgba(100,150,255,0.18)' }}
        >
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#F97316]"></span><span>Mega Mandi</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#FBBF24]"></span><span>Regional Yard</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#FCD34D]"></span><span>Selected</span></div>
        </div>
      </div>

      {/* Active Mandi Info Card */}
      <div
        className="relative mt-1 p-3.5 rounded-2xl transition-all duration-300 animate-slide-up notranslate"
        translate="no"
        style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.10)' }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {activePin.type}
              </span>
              <span className="text-[10px] text-white/50 font-medium">{activePin.district}, {activePin.state}</span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white truncate">{activePin.fullName}</h4>
            <div className="flex items-center gap-2 pt-0.5 text-[11px]">
              <span className="flex items-center gap-1 font-semibold text-white/80">
                <span className="notranslate" translate="no">{activePin.cropIcon}</span>
                <span>{activePin.crop}</span>
              </span>
              <span className="text-white/20">•</span>
              <span className="text-white/45 font-mono text-[10px]">Arrivals: {activePin.arrivals}</span>
            </div>
          </div>

          <div className="text-right shrink-0 space-y-1">
            <span className="text-sm sm:text-base font-black font-mono text-white block">{activePin.modalPrice}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono inline-block ${
              activePin.change.startsWith('+') ? 'text-[#FCD34D] bg-[#FCD34D]/15' : 'text-rose-400 bg-rose-500/15'
            }`}>
              {activePin.change} Modal
            </span>
            <div>
              <button
                type="button"
                onClick={() => handleInspectTerminal(activePin)}
                className="mt-1 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold flex items-center gap-1 border border-white/15 transition-all cursor-pointer backdrop-blur-sm"
              >
                <span>Terminal</span>
                <ArrowRight className="w-3 h-3 text-[#FCD34D]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
