import React from 'react';
import type { 
  Language, 
  CropUnit, 
  Commodity, 
  MarketItem, 
  SearchResult, 
  PriceTrend, 
  NavigationPage 
} from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { SearchForm } from '../components/SearchForm';
import { NaturalQuery } from '../components/NaturalQuery';
import { MarketComparison } from '../components/MarketComparison';
import { ValueCalculator } from '../components/ValueCalculator';
import { PriceTrendChart } from '../components/PriceTrendChart';
import { AiExplanation } from '../components/AiExplanation';
import { SellingChecklist } from '../components/SellingChecklist';
import { ShieldCheck, Sparkles, AlertCircle, FileText } from 'lucide-react';

interface DashboardPageProps {
  language: Language;
  activeTab: 'form' | 'nlp';
  setActiveTab: (tab: 'form' | 'nlp') => void;
  commodities: Commodity[];
  crop: string;
  setCrop: (crop: string) => void;
  variety: string;
  setVariety: (v: string) => void;
  location: string;
  setLocation: (loc: string) => void;
  quantity: number;
  setQuantity: (q: number) => void;
  unit: CropUnit;
  setUnit: (u: CropUnit) => void;
  isLoading: boolean;
  searchResult: SearchResult | null;
  selectedMarket: MarketItem | null;
  setSelectedMarket: (m: MarketItem | null) => void;
  activeTrend: PriceTrend | null;
  explanationTerm: string | null;
  setExplanationTerm: (t: string | null) => void;
  isSlipModalOpen: boolean;
  setIsSlipModalOpen: (o: boolean) => void;
  handleSearch: (coords?: { lat: number; lon: number }) => Promise<void>;
  handleNlpResult: (parsed: { crop: string; location: string; quantity: number; unit: CropUnit }) => void;
  onNavigate: (page: NavigationPage) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  language,
  activeTab,
  setActiveTab,
  commodities,
  crop,
  setCrop,
  variety,
  setVariety,
  location,
  setLocation,
  quantity,
  setQuantity,
  unit,
  setUnit,
  isLoading,
  searchResult,
  selectedMarket,
  setSelectedMarket,
  activeTrend,
  setExplanationTerm,
  setIsSlipModalOpen,
  handleSearch,
  handleNlpResult,
  onNavigate
}) => {
  const t = TRANSLATIONS[language];

  const quantityQuintals = searchResult?.normalized_quantity?.in_quintals || 
    (unit === 'kg' ? quantity / 100 : (unit === 'tonne' ? quantity * 10 : quantity));

  return (
    <div className="space-y-8 pb-16">
      {/* Terminal Title & Overview Hero */}
      <div className="verda-card rounded-3xl p-6 sm:p-10 border border-[#E2ECE3] relative overflow-hidden bg-gradient-to-br from-white via-[#F7FBF8] to-[#EBF5ED]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF5ED] border border-[#CCE0D0] text-xs font-semibold text-[#123826]">
              <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
              <span>100% Official APMC Rates • Zero Speculation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#123826] font-['Syne',sans-serif] tracking-tight leading-[1.15]">
              MandiMate Terminal Workstation
            </h2>
            <p className="text-sm sm:text-base text-stone-600 font-normal leading-relaxed max-w-xl">
              Compare verified wholesale mandi prices across 20 APMC hubs, calculate realistic transport logistics, and receive clear selling advisory in your regional language.
            </p>

            {/* Quick Action Navigation Strip */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => onNavigate('dispatch')}
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#F2F8F4] text-[#123826] text-xs font-bold border border-[#CCE0D0] flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Go to Dispatch Desk</span>
              </button>
              <button
                onClick={() => onNavigate('crops')}
                className="px-4 py-2 rounded-xl bg-white hover:bg-[#F2F8F4] text-[#123826] text-xs font-bold border border-[#CCE0D0] flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>Browse 10 Standard Crops</span>
              </button>
            </div>

            {/* Agricultural Key Stat Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white p-3.5 rounded-2xl border border-[#E2ECE3] shadow-xs">
                <span className="text-[11px] text-stone-600 font-medium block">Active Markets</span>
                <span className="text-[#123826] font-black text-lg sm:text-xl">20 Mandis</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#E2ECE3] shadow-xs">
                <span className="text-[11px] text-stone-600 font-medium block">Key Crops</span>
                <span className="text-[#123826] font-black text-lg sm:text-xl">10 Crops</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#E2ECE3] shadow-xs">
                <span className="text-[11px] text-stone-600 font-medium block">Top Spread</span>
                <span className="text-[#D97706] font-black text-lg sm:text-xl">₹1,400/q</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#E2ECE3] shadow-xs">
                <span className="text-[11px] text-stone-600 font-medium block">Sync Status</span>
                <span className="text-[#2E7D32] font-black text-lg sm:text-xl">Daily Live</span>
              </div>
            </div>
          </div>

          {/* Right Photography Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#D5E7D8] aspect-[4/3] group">
              <img 
                src="/verda_agro_hero.jpg" 
                alt="VerdaAgro Agriculture Fields and Crops" 
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              {/* Floating Farm Card */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-white/80 shadow-md flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#2E7D32] uppercase tracking-wider block">Featured Market Rate</span>
                  <strong className="text-sm text-[#123826]">Ballari APMC • Tomato Hybrid</strong>
                </div>
                <div className="text-right font-mono">
                  <span className="text-base font-black text-[#123826]">₹2,200</span>
                  <span className="text-xs text-stone-600">/q</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Query Section */}
      <section className="space-y-3">
        {/* Query Mode Toggle Tabs */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`px-5 py-2.5 text-xs font-bold rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'form'
                ? 'bg-[#123826] text-white border-[#123826] shadow-sm'
                : 'bg-white text-stone-600 border-[#E2ECE3] hover:border-[#CCE0D0] hover:text-[#123826]'
            }`}
          >
            {t.searchTabForm}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('nlp')}
            className={`px-5 py-2.5 text-xs font-bold rounded-2xl border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'nlp'
                ? 'bg-[#123826] text-white border-[#123826] shadow-sm'
                : 'bg-white text-stone-600 border-[#E2ECE3] hover:border-[#CCE0D0] hover:text-[#123826]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>{t.searchTabNlp}</span>
          </button>
        </div>

        {activeTab === 'nlp' ? (
          <NaturalQuery
            language={language}
            onParsedResult={handleNlpResult}
          />
        ) : (
          <SearchForm
            language={language}
            commodities={commodities}
            selectedCrop={crop}
            onCropChange={setCrop}
            variety={variety}
            onVarietyChange={setVariety}
            location={location}
            onLocationChange={setLocation}
            quantity={quantity}
            onQuantityChange={setQuantity}
            unit={unit}
            onUnitChange={setUnit}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        )}
      </section>

      {/* No-data notice if unverified or missing */}
      {searchResult && !searchResult.verified && (
        <div className="verda-card rounded-3xl border border-amber-200 bg-[#FEF8ED] p-8 text-center max-w-2xl mx-auto shadow-sm">
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-3 border border-amber-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#123826] mb-2 font-['Syne',sans-serif]">
            {t.noDataTitle}
          </h3>
          <p className="text-stone-700 text-xs sm:text-sm mb-4 leading-relaxed">
            {searchResult.message || t.noDataMsg}
          </p>
          <p className="text-[11px] text-stone-600 font-medium">
            Notice: MandiMate only displays official government APMC market prices. When market committees have not filed today's rates, we do not estimate or substitute unverified prices.
          </p>
        </div>
      )}

      {/* Results Section when verified data is available */}
      {searchResult && searchResult.verified && searchResult.markets.length > 0 && (
        <div className="space-y-8">
          {/* Market Comparison Cards */}
          <MarketComparison
            markets={searchResult.markets}
            language={language}
            selectedMarket={selectedMarket}
            onSelectMarket={setSelectedMarket}
            onExplainTerm={setExplanationTerm}
          />

          {/* Selected Market Deep-Dive Section */}
          {selectedMarket && (
            <div className="space-y-8 pt-4 border-t border-[#E2ECE3]">
              <div className="verda-card p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#CCE0D0] shadow-sm">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#2E7D32] font-bold">
                    Selected Mandi Overview
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#123826] font-['Syne',sans-serif]">
                    {selectedMarket.market_name} ({selectedMarket.district})
                  </h3>
                </div>
                <div className="text-xs bg-[#F4F8F5] px-4 py-2.5 rounded-2xl border border-[#CCE0D0] self-start sm:self-auto font-mono">
                  Modal Rate: <strong className="text-[#123826] text-base tnum font-black">₹{selectedMarket.modal_price}/quintal</strong>
                </div>
              </div>

              {/* Row 1: Quantity Value Calculator & Net Return Calculator */}
              <ValueCalculator
                market={selectedMarket}
                quantityQuintals={quantityQuintals}
                language={language}
                onOpenSlip={() => setIsSlipModalOpen(true)}
              />

              {/* Row 2: Deterministic Price Trend Chart */}
              <PriceTrendChart
                crop={crop}
                marketId={selectedMarket.market_id}
                marketName={selectedMarket.market_name}
                language={language}
              />

              {/* Row 3: AI Explanation Advisory Narrative */}
              <AiExplanation
                market={selectedMarket}
                trend={activeTrend}
                language={language}
                quantityQuintals={quantityQuintals}
              />

              {/* Row 4: 11-Step Farmer's Selling Checklist */}
              <SellingChecklist
                crop={crop}
                marketName={selectedMarket.market_name}
                quantityQuintals={quantityQuintals}
                language={language}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
