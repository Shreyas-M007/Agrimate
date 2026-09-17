import React, { useState, useEffect } from 'react';
import type { PriceTrend, Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { BarChart2 } from 'lucide-react';

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
      <div className="bg-white rounded-2xl border-2 border-stone-200 p-6 text-center text-stone-600">
        <BarChart2 className="w-8 h-8 mx-auto text-stone-600 mb-2" />
        <p className="text-sm font-medium">No historical price trend records available for this market.</p>
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
    const x = padding + (idx / (history.length - 1)) * (svgWidth - padding * 2);
    const y = svgHeight - padding - ((item.modal_price - minPrice) / priceSpan) * (svgHeight - padding * 2);
    return { x, y, item };
  });

  const polylineStr = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaStr = `${points[0].x},${svgHeight - padding} ` + polylineStr + ` ${points[points.length - 1].x},${svgHeight - padding}`;

  return (
    <div className="bg-white rounded-2xl border-2 border-stone-200 overflow-hidden shadow-sm">
      {/* Header with period toggle */}
      <div className="bg-stone-100 border-b border-stone-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-700" />
            <span>{t.trendsTitle}</span>
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">
            {crop} @ {marketName}
          </p>
        </div>

        {/* Days selector */}
        <div className="flex bg-stone-200/80 p-1 rounded-xl border border-stone-300">
          {[7, 15, 30].map(d => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                days === d ? 'bg-emerald-700 text-white shadow-sm' : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              {d === 7 ? t.period7Days : (d === 15 ? t.period15Days : t.period30Days)}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Trend Direction Highlight with Accessible Text + Symbols (PRD Sec 29) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border-2 bg-stone-50 border-stone-200">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black ${
              direction === 'increasing' ? 'bg-emerald-100 text-emerald-800' :
              direction === 'decreasing' ? 'bg-rose-100 text-rose-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {symbol}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-stone-900">
                  {symbol} {direction === 'increasing' ? 'Increasing' : (direction === 'decreasing' ? 'Decreasing' : 'Stable')}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  direction === 'increasing' ? 'bg-emerald-100 text-emerald-900' :
                  direction === 'decreasing' ? 'bg-rose-100 text-rose-900' :
                  'bg-stone-200 text-stone-800'
                }`}>
                  {percent_change > 0 ? `+${percent_change}%` : `${percent_change}%`}
                </span>
              </div>
              <p className="text-xs text-stone-700 font-medium mt-0.5">
                {descriptive_statement}
              </p>
            </div>
          </div>

          <div className="text-xs text-stone-600 bg-white px-3 py-2 rounded-lg border border-stone-200 shrink-0">
            <div>Net Price Change: <strong>{price_change > 0 ? `+₹${price_change}` : `-₹${Math.abs(price_change)}`}</strong></div>
            <div className="text-[11px] text-stone-600">Over last {days} days</div>
          </div>
        </div>

        {/* Statistical Summary Row */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
            <div className="text-[11px] font-bold text-stone-600 uppercase">{t.periodAvg}</div>
            <div className="text-base sm:text-xl font-black text-stone-800">
              ₹{average_price.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <div className="text-[11px] font-bold text-emerald-700 uppercase">{t.periodHigh}</div>
            <div className="text-base sm:text-xl font-black text-emerald-900">
              ₹{highest_price.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
            <div className="text-[11px] font-bold text-amber-700 uppercase">{t.periodLow}</div>
            <div className="text-base sm:text-xl font-black text-amber-950">
              ₹{lowest_price.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* SVG Sparkline Chart */}
        <div className="relative bg-white rounded-xl border border-stone-200 p-2 overflow-x-auto">
          {isLoading ? (
            <div className="h-48 flex items-center justify-center text-sm text-stone-600">
              Loading trend graph...
            </div>
          ) : (
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 sm:h-56">
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="#f1f5f9" strokeWidth="1" />
              <line x1={padding} y1={svgHeight / 2} x2={svgWidth - padding} y2={svgHeight / 2} stroke="#f1f5f9" strokeWidth="1" />
              <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Area fill */}
              <polygon points={areaStr} fill="url(#trendGradient)" />

              {/* Trend Polyline */}
              <polyline
                fill="none"
                stroke="#047857"
                strokeWidth="3.5"
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
                  r="5"
                  className="fill-emerald-800 stroke-white stroke-2 hover:r-7 transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              ))}

              {/* Y-axis labels */}
              <text x={padding - 5} y={padding + 4} textAnchor="end" className="text-[10px] fill-stone-600 font-mono">
                ₹{maxPrice}
              </text>
              <text x={padding - 5} y={svgHeight - padding + 4} textAnchor="end" className="text-[10px] fill-stone-600 font-mono">
                ₹{minPrice}
              </text>

              {/* X-axis start and end date labels */}
              <text x={points[0].x} y={svgHeight - 15} textAnchor="start" className="text-[10px] fill-stone-600 font-medium">
                {points[0].item.date.slice(5)}
              </text>
              <text x={points[points.length - 1].x} y={svgHeight - 15} textAnchor="end" className="text-[10px] fill-stone-600 font-medium">
                Today ({points[points.length - 1].item.date.slice(5)})
              </text>
            </svg>
          )}

          {/* Point Tooltip */}
          {hoveredPoint && (
            <div className="absolute top-4 right-4 bg-stone-900 text-white text-xs px-3 py-1.5 rounded-lg shadow pointer-events-none">
              <span className="font-bold">Date: {hoveredPoint.item.date}</span> • ₹{hoveredPoint.item.modal_price}/qtl
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
