import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../data/verified_markets.json');
const dataset = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Haversine distance in kilometers
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Normalize quantities internally to Quintals
// 1 quintal = 100 kg, 1 tonne = 1000 kg = 10 quintals
export function normalizeToQuintals(quantity, unit = 'quintal') {
  const q = Number(quantity);
  if (isNaN(q) || q <= 0) return 0;
  const u = unit.toLowerCase().trim();
  if (u === 'kg' || u === 'kilogram' || u === 'kgs') {
    return q / 100;
  }
  if (u === 'tonne' || u === 'ton' || u === 'tonnes' || u === 'tons') {
    return q * 10;
  }
  // Default is quintal
  return q;
}

// Format human-friendly data freshness
export function formatDataFreshness(timestampIso) {
  if (!timestampIso) return "Unknown";
  const now = new Date("2026-09-17T15:52:00Z"); // PRD baseline clock
  const ts = new Date(timestampIso);
  const diffHours = Math.max(1, Math.round((now.getTime() - ts.getTime()) / (1000 * 60 * 60)));
  if (diffHours < 24) {
    return `Reported ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }
  const diffDays = Math.round(diffHours / 24);
  return `Reported ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// Known coordinates for Indian districts/towns for distance estimation when GPS is not provided
const DISTRICT_COORDS = {
  "ballari": { lat: 15.1394, lon: 76.9214 },
  "bellary": { lat: 15.1394, lon: 76.9214 },
  "kolar": { lat: 13.1367, lon: 78.1291 },
  "chikkaballapur": { lat: 13.4355, lon: 77.7315 },
  "bangalore": { lat: 12.9716, lon: 77.5946 },
  "bengaluru": { lat: 12.9716, lon: 77.5946 },
  "belagavi": { lat: 15.8497, lon: 74.4977 },
  "belgaum": { lat: 15.8497, lon: 74.4977 },
  "mysuru": { lat: 12.2958, lon: 76.6394 },
  "mysore": { lat: 12.2958, lon: 76.6394 },
  "davanagere": { lat: 14.4644, lon: 75.9218 },
  "dharwad": { lat: 15.4589, lon: 75.0078 },
  "hubli": { lat: 15.3647, lon: 75.1240 },
  "nashik": { lat: 19.9975, lon: 73.7898 },
  "nasik": { lat: 19.9975, lon: 73.7898 },
  "pune": { lat: 18.5204, lon: 73.8567 },
  "guntur": { lat: 16.3067, lon: 80.4365 },
  "kurnool": { lat: 15.8281, lon: 78.0373 },
  "warangal": { lat: 17.9689, lon: 79.5941 },
  "agra": { lat: 27.1767, lon: 78.0081 },
  "ludhiana": { lat: 30.9010, lon: 75.8573 },
  "karnal": { lat: 29.6857, lon: 76.9905 },
  "indore": { lat: 22.7196, lon: 75.8577 }
};

export function getCommodities() {
  return dataset.commodities;
}

export function getMarkets() {
  return dataset.markets;
}

export function searchMarkets({ crop, location, quantity, unit = 'quintal', lat, lon }) {
  if (!crop) {
    return {
      success: false,
      error: "Crop selection is required.",
      code: "INVALID_CROP"
    };
  }

  const normalizedCrop = crop.trim().toLowerCase();
  const matchedCommodity = dataset.commodities.find(c => 
    c.name.toLowerCase() === normalizedCrop ||
    c.commodity_id.toLowerCase() === normalizedCrop ||
    c.localNames.hi.toLowerCase() === normalizedCrop ||
    c.localNames.kn.toLowerCase() === normalizedCrop
  );

  if (!matchedCommodity) {
    return {
      success: false,
      error: `No verified records found for "${crop}". Please select a supported crop like Tomato, Onion, Potato, Groundnut, Maize, Paddy, Wheat, Cotton, or Chilli.`,
      code: "UNSUPPORTED_CROP"
    };
  }

  const normQuantity = normalizeToQuintals(quantity, unit);

  // Resolve user location coordinates
  let userLat = lat ? Number(lat) : null;
  let userLon = lon ? Number(lon) : null;

  if ((!userLat || !userLon) && location) {
    const locClean = location.trim().toLowerCase();
    for (const [key, coords] of Object.entries(DISTRICT_COORDS)) {
      if (locClean.includes(key)) {
        userLat = coords.lat;
        userLon = coords.lon;
        break;
      }
    }
  }

  // Get the latest records for this commodity
  // Today's records are marked is_today = true
  const latestRecords = dataset.price_records.filter(r => 
    r.commodity_id === matchedCommodity.commodity_id && r.is_today
  );

  if (latestRecords.length === 0) {
    return {
      success: true,
      verified: false,
      message: "No verified market data is currently available for this crop and location.",
      commodity: matchedCommodity,
      markets: []
    };
  }

  // Process market comparison cards
  const enrichedMarkets = latestRecords.map(record => {
    const marketMeta = dataset.markets.find(m => m.market_id === record.market_id);
    const distanceKm = (userLat && userLon) 
      ? calculateDistanceKm(userLat, userLon, record.latitude, record.longitude)
      : null;

    // Gross value estimation (PRD Section 12)
    // "500 kg = 5 quintals. If the reported modal price is ₹2,200/quintal, estimated gross value = 5 × ₹2,200 = ₹11,000"
    const estimatedGrossValue = normQuantity > 0 ? Math.round(normQuantity * record.modal_price) : 0;

    return {
      market_id: record.market_id,
      market_name: record.market_name,
      district: record.district,
      state: record.state,
      commodity_id: record.commodity_id,
      commodity_name: record.commodity_name,
      variety: record.variety,
      grade: record.grade,
      arrival_date: record.arrival_date,
      min_price: record.min_price,
      modal_price: record.modal_price,
      max_price: record.max_price,
      price_spread: record.max_price - record.min_price,
      arrival_quantity: record.arrival_quantity,
      unit: record.unit,
      source: record.source,
      source_timestamp: record.source_timestamp,
      freshness: formatDataFreshness(record.source_timestamp),
      distance_km: distanceKm,
      estimated_gross_value: estimatedGrossValue,
      calculator_formula: normQuantity > 0 
        ? `${normQuantity} quintals × ₹${record.modal_price.toLocaleString('en-IN')}` 
        : null
    };
  });

  // Sort by location if available (proximity), else by modal price descending
  if (userLat && userLon) {
    enrichedMarkets.sort((a, b) => (a.distance_km ?? 9999) - (b.distance_km ?? 9999));
  } else {
    enrichedMarkets.sort((a, b) => b.modal_price - a.modal_price);
  }

  return {
    success: true,
    verified: true,
    commodity: matchedCommodity,
    normalized_quantity: {
      input_value: quantity,
      input_unit: unit,
      in_quintals: normQuantity,
      in_kg: normQuantity * 100,
      in_tonnes: normQuantity / 10
    },
    user_location: {
      query: location,
      resolved_lat: userLat,
      resolved_lon: userLon
    },
    disclaimer: "Estimated gross value is based on the verified reported modal price, not guaranteed earnings. Prices fluctuate based on quality and arrival timings.",
    markets: enrichedMarkets
  };
}
