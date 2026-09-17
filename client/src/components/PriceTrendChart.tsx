import React, { useState, useEffect } from 'react';
import type { PriceTrend, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PriceTrendChartProps {
  crop: string;
  marketId: string;
  marketName: string;
  language: Language;
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
  const [hoveredPoint, setHoveredPoint] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchTrend() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/trends?crop=${encodeURIComponent(crop)}&market_id=${encodeURIComponent(marketId)}&days=${days}`);
        const data = await res.json();
        if (isMounted && data.success) {
          setTrendData(data);
        }
      } catch (err) {
        console.error("Error fetching price trends", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    if (crop && marketId) {
      fetchTrend();
    }
    return () => { isMounted = false; };
  }, [crop, marketId, days]);

  if (!trendData || !trendData.has_data) {
    return (
      <div className="glass-panel rounded-2xl border border-white/10 p-6 text-center text-stone-400 font-mono">
        <Activity className="w-8 h-8 mx-auto text-stone-500 mb-2" />
        <p className="text-xs">No historical price records found for this market.</p>
      </div>
    );
  }

  const {
    symbol,
    direction,
    percent_change,
    price_change,
    average_price,
    highest_price,
    lowest_price,
    descriptive_statement,
    history
  } = trendData;

  const svgWidth = 600;
  const svgHeight = 220;
  const padding = 40;

  const minPrice = Math.min(...history.map(h => h.modal_price));
  const maxPrice = Math.max(...history.map(h => h.modal_price));
  const priceSpan = Math.max(1, maxPrice - minPrice);

  const points = history.map((item, idx) => {
    const x = padding + (idx / Math.max(1, history.length - 1)) * (svgWidth - padding * 2);
    const y = svgHeight - padding - ((item.modal_price - minPrice) / priceSpan) * (svgHeight - padding * 2);
    return { x, y, item };
  });

  const polylineStr = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaStr = `${points[0].x},${svgHeight - padding} ` + polylineStr + ` ${points[points.length - 1].x},${svgHeight - padding}`;

  return (
    <div className="glass-panel rounded-2xl border border-emerald-500/20 overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
      {/* Header with period toggle */}
      <div className="bg-[#0D120E] border-b border-white/10 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-['Syne',sans-serif]">
            <Activity className="w-5 h-5 text-[#00FF87]" />
            <span>{t.trendsTitle}</span>
          </h3>
          <p className="text-xs font-mono text-stone-400 mt-0.5">
            {crop} @ {marketName}
          </p>
        </div>

        {/* Days selector */}
        <div className="flex bg-[#060807] p-1 rounded-xl border border-white/10 font-mono">
          {[7, 15, 30].map(d => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                days === d 
                  ? 'bg-emerald-500/20 text-[#00FF87] border border-[#00FF87]/40 shadow-[0_0_12px_rgba(0,255,135,0.2)] font-bold' 
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {d === 7 ? t.period7Days : (d === 15 ? t.period15Days : t.period30Days)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Trend Direction Highlight */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border bg-[#0A0D0B] border-white/10 shadow-inner">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black ${
              direction === 'increasing' ? 'bg-emerald-950/80 text-[#00FF87] border border-emerald-500/30' :
              direction === 'decreasing' ? 'bg-rose-950/80 text-rose-400 border border-rose-500/30' :
              'bg-blue-950/80 text-blue-400 border border-blue-500/30'
            }`}>
              {direction === 'increasing' ? <TrendingUp className="w-6 h-6 text-[#00FF87]" /> :
               direction === 'decreasing' ? <TrendingDown className="w-6 h-6 text-rose-400" /> :
               <Minus className="w-6 h-6 text-blue-400" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-white font-['Syne',sans-serif]">
                  {symbol} {direction === 'increasing' ? 'Increasing' : (direction === 'decreasing' ? 'Decreasing' : 'Stable')}
                </span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${
                  direction === 'increasing' ? 'bg-emerald-950/90 text-[#00FF87] border-emerald-500/40' :
                  direction === 'decreasing' ? 'bg-rose-950/90 text-rose-300 border-rose-500/40' :
                  'bg-white/10 text-stone-300 border-white/20'
                }`}>
                  {percent_change > 0 ? `+${percent_change}%` : `${percent_change}%`}
                </span>
              </div>
              <p className="text-xs font-mono text-stone-400 mt-0.5">
                {descriptive_statement}
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-stone-300 bg-[#111713] px-3 py-2 rounded-lg border border-white/10 shrink-0">
            <div>Net Shift: <strong className={price_change >= 0 ? "text-[#00FF87]" : "text-rose-400"}>{price_change > 0 ? `+₹${price_change}` : `-₹${Math.abs(price_change)}`}</strong></div>
            <div className="text-[10px] text-stone-500">Trailing {days} days</div>
          </div>
        </div>

        {/* Statistical Summary Row */}
        <div className="grid grid-cols-3 gap-3 text-center font-mono">
          <div className="glass-panel p-3 rounded-xl border border-white/10">
            <div className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">{t.periodAvg}</div>
            <div className="text-base sm:text-xl font-bold text-stone-200 tnum">
              ₹{average_price.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="glass-panel p-3 rounded-xl border border-emerald-500/30">
            <div className="text-[10px] uppercase tracking-wider text-[#00FF87] font-semibold">{t.periodHigh}</div>
            <div className="text-base sm:text-xl font-bold text-[#00FF87] tnum">
              ₹{highest_price.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="glass-panel p-3 rounded-xl border border-amber-500/30">
            <div className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold">{t.periodLow}</div>
            <div className="text-base sm:text-xl font-bold text-amber-300 tnum">
              ₹{lowest_price.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* SVG Sparkline Telemetry Chart */}
        <div className="relative bg-[#0A0D0B] rounded-xl border border-white/10 p-2 overflow-x-auto shadow-inner">
          {isLoading ? (
            <div className="h-48 flex items-center justify-center text-xs font-mono text-stone-500">
              Loading price trend chart...
            </div>
          ) : (
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 sm:h-56">
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00FF87" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#00FF87" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Grid lines */}
              <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1={padding} y1={svgHeight / 2} x2={svgWidth - padding} y2={svgHeight / 2} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

              {/* Area fill */}
              <polygon points={areaStr} fill="url(#trendGradient)" />

              {/* Trend Polyline */}
              <polyline
                fill="none"
                stroke="#00FF87"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylineStr}
                filter="url(#glow)"
              />

              {/* Data points */}
              {points.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r="4.5"
                  className="fill-[#00FF87] stroke-[#060807] stroke-2 hover:r-7 transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}

              {/* Y-axis labels */}
              <text x={padding - 8} y={padding + 4} textAnchor="end" className="text-[10px] fill-stone-500 font-mono">
                ₹{maxPrice}
              </text>
              <text x={padding - 8} y={svgHeight - padding + 4} textAnchor="end" className="text-[10px] fill-stone-500 font-mono">
                ₹{minPrice}
              </text>

              {/* X-axis start and end date labels */}
              <text x={points[0].x} y={svgHeight - 15} textAnchor="start" className="text-[10px] fill-stone-500 font-mono">
                {points[0].item.date.slice(5)}
              </text>
              <text x={points[points.length - 1].x} y={svgHeight - 15} textAnchor="end" className="text-[10px] fill-[#00FF87] font-mono font-bold">
                Today ({points[points.length - 1].item.date.slice(5)})
              </text>
            </svg>
          )}

          {/* Point Tooltip */}
          {hoveredPoint && (
            <div className="absolute top-4 right-4 bg-[#0F1411] border border-[#00FF87]/40 text-white text-xs px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(0,255,135,0.2)] pointer-events-none font-mono">
              <span className="text-[#00FF87] font-bold">Date: {hoveredPoint.item.date}</span> • ₹{hoveredPoint.item.modal_price}/q
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceTrendChart;
