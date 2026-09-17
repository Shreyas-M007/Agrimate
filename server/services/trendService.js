import { getCommodities, getAllPriceRecords, getMarkets } from './marketService.js';

export function getPriceTrends({ crop, market_id, days = 7 }) {
  if (!crop) {
    return { success: false, error: "Crop is required for trend analysis." };
  }

  const normalizedCrop = crop.trim().toLowerCase();
  const commodities = getCommodities();
  const matchedCommodity = commodities.find(c => 
    c.name.toLowerCase() === normalizedCrop ||
    c.commodity_id.toLowerCase() === normalizedCrop ||
    (c.localNames?.hi && c.localNames.hi.toLowerCase() === normalizedCrop) ||
    (c.localNames?.kn && c.localNames.kn.toLowerCase() === normalizedCrop)
  );

  if (!matchedCommodity) {
    return { success: false, error: "Commodity not found." };
  }

  // Filter records for this commodity and (optionally) market
  const allRecords = getAllPriceRecords();
  let records = allRecords.filter(r => r.commodity_id === matchedCommodity.commodity_id);
  
  if (market_id) {
    records = records.filter(r => r.market_id === market_id);
  }

  if (records.length === 0) {
    return {
      success: true,
      has_data: false,
      message: "No historical verified price data available for the requested period."
    };
  }

  // Sort ascending by arrival_date
  records.sort((a, b) => new Date(a.arrival_date).getTime() - new Date(b.arrival_date).getTime());

  // Take the last N days
  const periodDays = Math.min(Math.max(Number(days) || 7, 3), 30);
  const slicedRecords = records.slice(-periodDays);

  if (slicedRecords.length < 2) {
    return {
      success: true,
      has_data: false,
      message: "Insufficient historical data points to calculate trend."
    };
  }

  const startRecord = slicedRecords[0];
  const endRecord = slicedRecords[slicedRecords.length - 1];

  const startPrice = startRecord.modal_price;
  const endPrice = endRecord.modal_price;
  const priceChange = endPrice - startPrice;
  const percentChange = Number(((priceChange / startPrice) * 100).toFixed(1));

  const prices = slicedRecords.map(r => r.modal_price);
  const highestPrice = Math.max(...prices);
  const lowestPrice = Math.min(...prices);
  const averagePrice = Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length);

  // Direction symbol according to PRD Section 29
  // "Use symbols and text such as ↑ Increasing, → Stable and ↓ Decreasing"
  let direction = "stable";
  let symbol = "→";
  let statusText = "Stable";

  if (percentChange > 1.5) {
    direction = "increasing";
    symbol = "↑";
    statusText = "Increasing";
  } else if (percentChange < -1.5) {
    direction = "decreasing";
    symbol = "↓";
    statusText = "Decreasing";
  }

  const descriptiveStatement = `The reported modal price ${
    direction === "increasing" ? `increased by ${percentChange}%` :
    direction === "decreasing" ? `decreased by ${Math.abs(percentChange)}%` :
    "remained steady (within 1.5%)"
  } over the selected ${periodDays}-day period.`;

  return {
    success: true,
    has_data: true,
    commodity: matchedCommodity.name,
    market_name: market_id ? (slicedRecords[0].market_name || getMarkets().find(m => m.market_id === market_id)?.market_name || "APMC Yard") : "Regional Average",
    period_days: periodDays,
    start_date: startRecord.arrival_date,
    end_date: endRecord.arrival_date,
    start_price: startPrice,
    latest_price: endPrice,
    price_change: priceChange,
    percent_change: percentChange,
    highest_price: highestPrice,
    lowest_price: lowestPrice,
    average_price: averagePrice,
    direction: direction,
    symbol: symbol,
    status_text: statusText,
    accessible_label: `${symbol} ${statusText} (${percentChange > 0 ? '+' : ''}${percentChange}%)`,
    descriptive_statement: descriptiveStatement,
    history: slicedRecords.map(r => ({
      date: r.arrival_date,
      modal_price: r.modal_price,
      min_price: r.min_price,
      max_price: r.max_price,
      arrival_quantity: r.arrival_quantity
    }))
  };
}
