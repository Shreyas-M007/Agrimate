import React, { useState, useEffect, useRef } from 'react';
import type { PriceTrend, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { TrendingUp, TrendingDown, Minus, BarChart2 } from 'lucide-react';
import { apiUrl } from '../utils/api';

interface PriceTrendChartProps {
  crop: string;
  marketId: string;
  marketName: string;
  language: Language;
}

/** Build a smooth SVG path from points using cubic bezier control points */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cpX = (prev.x + curr.x) / 2;
    d += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

export const PriceTrendChart: React.FC<PriceTrendChartProps> = ({
  crop,
  marketId,
  marketName,
  language
}) => {
  const t = TRANSLATIONS[language];
  const [days, setDays] = useState<number>(7);
  const [trendData, setTrendData] = useState<PriceTrend | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchTrend() {
      setIsLoading(true);
      try {
        const res = await fetch(apiUrl(`/trends?crop=${encodeURIComponent(crop)}&market_id=${encodeURIComponent(marketId)}&days=${days}`));
        const data = await res.json();
        if (isMounted && data.success) setTrendData(data);
      } catch (err) {
        console.error('Error fetching price trends', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    if (crop && marketId) fetchTrend();
    return () => { isMounted = false; };
  }, [crop, marketId, days]);

  if (!trendData || !trendData.has_data) {
    return (
      <div className="rounded-2xl border border-white/80 p-8 text-center glass-card"
        style={{ boxShadow: '0 4px 20px rgba(21,52,36,0.04), inset 0 1px 1px rgba(255,255,255,0.95)' }}>
        <BarChart2 className="w-8 h-8 mx-auto text-stone-300 mb-2" />
        <p className="text-xs font-mono text-stone-400">No historical data for this market.</p>
      </div>
    );
  }

  const { symbol, direction, percent_change, price_change, average_price, highest_price, lowest_price, descriptive_statement, history } = trendData;

  // Chart geometry
  const W = 600, H = 200, PX = 48, PY = 24;
  const minP = Math.min(...history.map(h => h.modal_price));
  const maxP = Math.max(...history.map(h => h.modal_price));
  const span = Math.max(1, maxP - minP);

  const pts = history.map((item, idx) => ({
    x: PX + (idx / Math.max(1, history.length - 1)) * (W - PX * 2),
    y: PY + (1 - (item.modal_price - minP) / span) * (H - PY * 2),
    item,
  }));

  const linePath = smoothPath(pts);
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${H - PY} L ${pts[0].x} ${H - PY} Z`;

  const isUp = direction === 'increasing';
  const isDown = direction === 'decreasing';
  const accentColor = isUp ? '#2E7D32' : isDown ? '#e11d48' : '#64748b';
  const hovered = hoveredIdx !== null ? pts[hoveredIdx] : null;

  // 3 evenly-spaced Y-axis labels
  const yLabels = [maxP, Math.round((maxP + minP) / 2), minP];

  return (
    <div className="rounded-2xl border border-white/80 overflow-hidden glass-card"
      style={{ boxShadow: '0 8px 32px 0 rgba(21, 52, 36, 0.05), inset 0 1px 1px rgba(255,255,255,0.95)' }}>

      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-4 flex flex-wrap items-start justify-between gap-3 border-b border-stone-200/50">
        <div>
          <h3 className="text-[15px] font-bold text-[#153424] font-['Syne',sans-serif] leading-snug">
            {t.trendsTitle}
          </h3>
          <p className="text-[11px] font-mono text-stone-400 mt-0.5">
            {crop} · {marketName}
          </p>
        </div>

        {/* Period toggle */}
        <div className="flex items-center gap-1 bg-white/60 backdrop-blur-xs border border-white/80 p-1 rounded-xl">
          {[7, 15, 30].map(d => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              className={`px-3 py-1 text-[11px] font-bold font-mono rounded-lg transition-all cursor-pointer ${
                days === d
                  ? 'bg-white text-[#153424] shadow-sm'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {d === 7 ? t.period7Days : d === 15 ? t.period15Days : t.period30Days}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 space-y-5">

        {/* ── Trend summary row ── */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isUp ? 'bg-[#F0F7F1]' : isDown ? 'bg-rose-50' : 'bg-slate-100'
            }`}>
              {isUp
                ? <TrendingUp className="w-4.5 h-4.5 text-[#2E7D32]" />
                : isDown
                  ? <TrendingDown className="w-4.5 h-4.5 text-rose-600" />
                  : <Minus className="w-4.5 h-4.5 text-slate-500" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#153424] font-['Syne',sans-serif]">
                  {symbol} {isUp ? 'Increasing' : isDown ? 'Decreasing' : 'Stable'}
                </span>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  isUp ? 'bg-[#F0F7F1] text-[#2E7D32]' : isDown ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  {percent_change > 0 ? `+${percent_change}%` : `${percent_change}%`}
                </span>
              </div>
              <p className="text-[11px] font-mono text-stone-400 mt-0.5 leading-snug">{descriptive_statement}</p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className={`text-base font-black font-mono ${price_change >= 0 ? 'text-[#2E7D32]' : 'text-rose-600'}`}>
              {price_change > 0 ? `+₹${price_change}` : `-₹${Math.abs(price_change)}`}
            </div>
            <div className="text-[10px] font-mono text-stone-400">{days}d net shift</div>
          </div>
        </div>

        {/* ── 3 stat pills ── */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: t.periodAvg, value: average_price, color: 'text-stone-700' },
            { label: t.periodHigh, value: highest_price, color: 'text-[#2E7D32]' },
            { label: t.periodLow,  value: lowest_price,  color: 'text-rose-600'  },
          ].map(({ label, value, color }) => (
            <div key={label} className="border border-white/70 rounded-xl px-3 py-2.5 glass-card-subtle text-center">
              <div className="text-[9px] font-mono uppercase tracking-[0.1em] text-stone-400 mb-1">{label}</div>
              <div className={`text-sm font-black font-mono ${color}`}>₹{value.toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>

        {/* ── SVG Chart ── */}
        <div className="relative rounded-xl glass-card-subtle border border-white/70 overflow-hidden">
          {isLoading ? (
            <div className="h-[180px] flex items-center justify-center text-[11px] font-mono text-stone-400 animate-pulse">
              Loading…
            </div>
          ) : (
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              style={{ height: 180 }}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity="0.12" />
                  <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid */}
              {yLabels.map((label, i) => {
                const gy = PY + (i / 2) * (H - PY * 2);
                return (
                  <g key={i}>
                    <line x1={PX} y1={gy} x2={W - PX} y2={gy}
                      stroke="#E8E4DF" strokeWidth="1" strokeDasharray={i === 2 ? '0' : '3 4'} />
                    <text x={PX - 6} y={gy + 4} textAnchor="end"
                      style={{ fontSize: 9, fill: '#a8a29e', fontFamily: 'monospace' }}>
                      ₹{label.toLocaleString('en-IN')}
                    </text>
                  </g>
                );
              })}

              {/* Area fill */}
              <path d={areaPath} fill="url(#areaFill)" />

              {/* Smooth line */}
              <path d={linePath} fill="none" stroke={accentColor} strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" />

              {/* Hover line */}
              {hovered && (
                <line x1={hovered.x} y1={PY} x2={hovered.x} y2={H - PY}
                  stroke={accentColor} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
              )}

              {/* Data points — invisible wide hit areas + visible dots */}
              {pts.map((pt, i) => (
                <g key={i} onMouseEnter={() => setHoveredIdx(i)} style={{ cursor: 'pointer' }}>
                  {/* Wide invisible hit area */}
                  <rect x={pt.x - 14} y={PY} width={28} height={H - PY * 2} fill="transparent" />
                  <circle cx={pt.x} cy={pt.y} r={hoveredIdx === i ? 5 : 3.5}
                    fill={accentColor} stroke="white" strokeWidth="2"
                    style={{ transition: 'r 0.1s' }} />
                </g>
              ))}

              {/* X-axis date labels */}
              <text x={pts[0].x} y={H - 6} textAnchor="middle"
                style={{ fontSize: 9, fill: '#a8a29e', fontFamily: 'monospace' }}>
                {pts[0].item.date.slice(5)}
              </text>
              <text x={pts[pts.length - 1].x} y={H - 6} textAnchor="middle"
                style={{ fontSize: 9, fill: accentColor, fontFamily: 'monospace', fontWeight: 700 }}>
                {pts[pts.length - 1].item.date.slice(5)}
              </text>
            </svg>
          )}

          {/* Floating tooltip */}
          {hovered && !isLoading && (
            <div className="absolute top-3 right-3 bg-[#153424] text-white text-[11px] font-mono px-3 py-1.5 rounded-lg shadow-lg pointer-events-none leading-snug">
              <div className="text-[#4ADE80] font-bold">{hovered.item.date}</div>
              <div>₹{hovered.item.modal_price.toLocaleString('en-IN')}/q</div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PriceTrendChart;
