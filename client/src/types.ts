export type Language = 'en' | 'hi' | 'kn' | 'te' | 'ta' | 'mr' | 'bn' | 'gu' | 'pa' | 'ml';

export type CropUnit = 'kg' | 'quintal' | 'tonne';

export interface Commodity {
  commodity_id: string;
  name: string;
  localNames: {
    hi: string;
    kn: string;
  };
  varieties: string[];
  basePrice: number;
  priceSpread: number;
  typicalArrival: number;
  unit: string;
  category: string;
  icon: string;
}

export interface MarketItem {
  market_id: string;
  market_name: string;
  district: string;
  state: string;
  commodity_id?: string;
  commodity_name?: string;
  variety: string;
  grade: string;
  arrival_date: string;
  min_price: number;
  modal_price: number;
  max_price: number;
  price_spread: number;
  arrival_quantity: number;
  unit: string;
  source: string;
  source_timestamp: string;
  freshness: string;
  distance_km: number | null;
  estimated_gross_value: number;
  calculator_formula: string | null;
}

export interface SearchResult {
  success: boolean;
  verified: boolean;
  message?: string;
  error?: string;
  commodity?: Commodity;
  normalized_quantity?: {
    input_value: number;
    input_unit: string;
    in_quintals: number;
    in_kg: number;
    in_tonnes: number;
  };
  user_location?: {
    query: string;
    resolved_lat: number | null;
    resolved_lon: number | null;
  };
  disclaimer?: string;
  markets: MarketItem[];
  cached_at?: string;
}

export interface TrendHistoryItem {
  date: string;
  modal_price: number;
  min_price: number;
  max_price: number;
  arrival_quantity: number;
}

export interface PriceTrend {
  success: boolean;
  has_data: boolean;
  commodity: string;
  market_name: string;
  period_days: number;
  start_date: string;
  end_date: string;
  start_price: number;
  latest_price: number;
  price_change: number;
  percent_change: number;
  highest_price: number;
  lowest_price: number;
  average_price: number;
  direction: 'increasing' | 'stable' | 'decreasing';
  symbol: '↑' | '→' | '↓';
  status_text: string;
  accessible_label: string;
  descriptive_statement: string;
  history: TrendHistoryItem[];
}

export interface AiExplanationData {
  language: Language;
  title: string;
  summary: string;
  priceDetails: string;
  trendExplanation: string;
  estimatedValueNote: string;
  advice: string;
  verifiedNotice: string;
}

export interface ChecklistStep {
  id: number;
  category: string;
  title: string;
  desc: string;
  important: boolean;
}

export interface SellingChecklistData {
  title: string;
  language: Language;
  steps: ChecklistStep[];
}

export interface SyncStatusData {
  success: boolean;
  last_sync?: {
    id: number;
    source: string;
    records_synced: number;
    timestamp: string;
    status: string;
  };
  total_verified_records: number;
}

export interface UserPreferences {
  user_id?: string;
  language: Language;
  location: string;
  preferred_units: CropUnit;
}

export type NavigationPage = 'home' | 'dashboard' | 'about' | 'services' | 'crops' | 'dispatch' | 'contact';

