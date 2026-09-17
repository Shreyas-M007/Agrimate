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
      <div className="verda-card rounded-2xl border border-[#E2ECE3] p-6 text-center text-stone-600 font-mono">
        <Activity className="w-8 h-8 mx-auto text-[#2E7D32] mb-2" />
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
    <div className="verda-card rounded-2xl border border-[#E2ECE3] overflow-hidden shadow-sm">
      {/* Header with period toggle */}
      <div className="bg-[#F4F8F5] border-b border-[#E2ECE3] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#123826] flex items-center gap-2 font-['Syne',sans-serif]">
            <Activity className="w-5 h-5 text-[#2E7D32]" />
            <span>{t.trendsTitle}</span>
          </h3>
          <p className="text-xs font-mono text-stone-600 mt-0.5">
            {crop} @ {marketName}
          </p>
        </div>

        {/* Days selector */}
        <div className="flex bg-white p-1 rounded-xl border border-[#CCE0D0] font-mono">
          {[7, 15, 30].map(d => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                days === d 
                  ? 'bg-[#2E7D32] text-white shadow-sm font-bold' 
                  : 'text-stone-600 hover:text-[#123826]'
              }`}
            >
              {d === 7 ? t.period7Days : (d === 15 ? t.period15Days : t.period30Days)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Trend Direction Highlight */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border bg-[#F7FAF8] border-[#E2ECE3] shadow-inner">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black ${
              direction === 'increasing' ? 'bg-[#EBF5ED] text-[#2E7D32] border border-[#CCE0D0]' :
              direction === 'decreasing' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
              'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {direction === 'increasing' ? <TrendingUp className="w-6 h-6 text-[#2E7D32]" /> :
               direction === 'decreasing' ? <TrendingDown className="w-6 h-6 text-rose-600" /> :
               <Minus className="w-6 h-6 text-blue-600" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-[#123826] font-['Syne',sans-serif]">
                  {symbol} {direction === 'increasing' ? 'Increasing' : (direction === 'decreasing' ? 'Decreasing' : 'Stable')}
                </span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${
                  direction === 'increasing' ? 'bg-[#EBF5ED] text-[#2E7D32] border-[#CCE0D0]' :
                  direction === 'decreasing' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  'bg-stone-100 text-stone-700 border-stone-200'
                }`}>
                  {percent_change > 0 ? `+${percent_change}%` : `${percent_change}%`}
                </span>
              </div>
              <p className="text-xs font-mono text-stone-600 mt-0.5">
                {descriptive_statement}
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-stone-700 bg-white px-3 py-2 rounded-lg border border-[#CCE0D0] shrink-0">
            <div>Net Shift: <strong className={price_change >= 0 ? "text-[#2E7D32]" : "text-rose-600"}>{price_change > 0 ? `+₹${price_change}` : `-₹${Math.abs(price_change)}`}</strong></div>
            <div className="text-[10px] text-stone-500">Trailing {days} days</div>
          </div>
        </div>

        {/* Statistical Summary Row */}
        <div className="grid grid-cols-3 gap-3 text-center font-mono">
          <div className="verda-card p-3 rounded-xl border border-[#E2ECE3]">
            <div className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">{t.periodAvg}</div>
            <div className="text-base sm:text-xl font-bold text-stone-800 tnum">
              ₹{average_price.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="verda-card p-3 rounded-xl border border-[#A5D6A7] bg-[#F4F8F5]">
            <div className="text-[10px] uppercase tracking-wider text-[#123826] font-semibold">{t.periodHigh}</div>
            <div className="text-base sm:text-xl font-bold text-[#123826] tnum">
              ₹{highest_price.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="verda-card p-3 rounded-xl border border-amber-200 bg-amber-50/50">
            <div className="text-[10px] uppercase tracking-wider text-amber-800 font-semibold">{t.periodLow}</div>
            <div className="text-base sm:text-xl font-bold text-amber-900 tnum">
              ₹{lowest_price.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* SVG Telemetry Chart */}
        <div className="relative bg-white rounded-xl border border-[#E2ECE3] p-2 overflow-x-auto shadow-inner">
          {isLoading ? (
            <div className="h-48 flex items-center justify-center text-xs font-mono text-stone-500">
              Loading price trend chart...
            </div>
          ) : (
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 sm:h-56">
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#2E7D32" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="#E2ECE3" strokeWidth="1" strokeDasharray="3 3" />
              <line x1={padding} y1={svgHeight / 2} x2={svgWidth - padding} y2={svgHeight / 2} stroke="#E2ECE3" strokeWidth="1" strokeDasharray="3 3" />
              <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#CCE0D0" strokeWidth="1.5" />

              {/* Area fill */}
              <polygon points={areaStr} fill="url(#trendGradient)" />

              {/* Trend Polyline */}
              <polyline
                fill="none"
                stroke="#2E7D32"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylineStr}
              />

              {/* Data points */}
              {points.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r="4.5"
                  className="fill-[#2E7D32] stroke-white stroke-2 hover:r-7 transition-all cursor-pointer"
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
              <text x={points[points.length - 1].x} y={svgHeight - 15} textAnchor="end" className="text-[10px] fill-[#2E7D32] font-mono font-bold">
                Today ({points[points.length - 1].item.date.slice(5)})
              </text>
            </svg>
          )}

          {/* Point Tooltip */}
          {hoveredPoint && (
            <div className="absolute top-4 right-4 bg-[#123826] border border-[#2E7D32]/40 text-white text-xs px-3 py-1.5 rounded-lg shadow-md pointer-events-none font-mono">
              <span className="text-emerald-200 font-bold">Date: {hoveredPoint.item.date}</span> • ₹{hoveredPoint.item.modal_price}/q
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceTrendChart;
