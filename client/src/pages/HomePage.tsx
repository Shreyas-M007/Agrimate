import React, { useState } from 'react';
import type { Language, NavigationPage, Commodity } from '../types';
import { 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Award, 
  ChevronRight, 
  Database, 
  ThermometerSnowflake, 
  Sun, 
  Wind, 
  Droplets, 
  Sprout, 
  Tractor, 
  Store, 
  BookOpen, 
  Play, 
  Search, 
  Send,
  X,
  MapPin
} from 'lucide-react';

interface HomePageProps {
  language: Language;
  onNavigate: (page: NavigationPage) => void;
  onSelectCropAndNavigate?: (cropName: string) => void;
  onSearchAndNavigate?: (crop?: string, location?: string) => void;
  commodities?: Commodity[];
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectCropAndNavigate,
  onSearchAndNavigate
}) => {
  const [alertPhone, setAlertPhone] = useState('');
  const [alertSubscribed, setAlertSubscribed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Quick live mandi ticker data (AgriHub & VerdaAgro fusion)
  const liveTickers = [
    { crop: 'Maize', mandi: 'Davanagere APMC', state: 'Karnataka', modal: '₹2,150', unit: 'q', change: '+4.2%', trend: 'up', icon: '🌽' },
    { crop: 'Tomato', mandi: 'Ballari APMC', state: 'Karnataka', modal: '₹1,850', unit: 'q', change: '+2.6%', trend: 'up', icon: '🍅' },
    { crop: 'Onion', mandi: 'Lasalgaon APMC', state: 'Maharashtra', modal: '₹2,100', unit: 'q', change: '+1.9%', trend: 'up', icon: '🧅' },
    { crop: 'Paddy / Rice', mandi: 'Sindhanur APMC', state: 'Karnataka', modal: '₹2,450', unit: 'q', change: '+3.1%', trend: 'up', icon: '🍚' },
    { crop: 'Green Chilli', mandi: 'Guntur APMC', state: 'Andhra Pradesh', modal: '₹3,400', unit: 'q', change: '+5.2%', trend: 'up', icon: '🌶️' },
    { crop: 'Potato', mandi: 'Hassan APMC', state: 'Karnataka', modal: '₹1,600', unit: 'q', change: '+0.8%', trend: 'stable', icon: '🥔' },
  ];

  // AgridFlow SaaS Telemetry Metrics
  const telemetryData = [
    { label: 'Ambient Temperature', value: '28.4°C', sub: 'Optimal morning picking', icon: Sun, color: 'text-amber-500 bg-amber-50' },
    { label: 'Soil Moisture Index', value: '44%', sub: 'Adequate root retention', icon: Droplets, color: 'text-blue-500 bg-blue-50' },
    { label: 'Wind Velocity', value: '9.8 km/h', sub: 'Safe for field transport', icon: Wind, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Solar Insolation', value: '7.2 kWh/m²', sub: 'Peak photosynthetic hours', icon: ThermometerSnowflake, color: 'text-orange-500 bg-orange-50' },
    { label: 'Satellite Crop NDVI', value: '0.76', sub: 'Dense vegetative canopy', icon: Sprout, color: 'text-[#2E7D32] bg-[#EBF5ED]' },
  ];

  // AgriHub 5 Quick Categories
  const categoryBadges = [
    { title: 'Quality Seeds', desc: 'Access certified seeds for higher yields', icon: Sprout, bg: 'bg-[#EBF5ED] text-[#2E7D32] border-[#CCE0D0]', link: 'crops' as NavigationPage },
    { title: 'Farm Equipment', desc: 'Find the right haulage tools for your farm', icon: Tractor, bg: 'bg-[#FFF8E7] text-[#E8A238] border-[#FFE0A3]', link: 'services' as NavigationPage },
    { title: 'Weather Updates', desc: 'Plan your harvest with microclimate forecasts', icon: Sun, bg: 'bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]', link: 'dashboard' as NavigationPage },
    { title: 'Market Access', desc: 'Get verified APMC prices for your produce', icon: Store, bg: 'bg-[#F3E8FF] text-[#7C3AED] border-[#DDD6FE]', link: 'dashboard' as NavigationPage },
    { title: 'Expert Advice', desc: 'Learn statutory rules from agronomy experts', icon: BookOpen, bg: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]', link: 'about' as NavigationPage },
  ];

  const cropList = [
    { name: 'Tomato', icon: '🍅', hindi: 'टमाटर', kannada: 'ಟೊಮೆಟೊ', modal: '₹1,850/q' },
    { name: 'Onion', icon: '🧅', hindi: 'प्याज', kannada: 'ಈರುಳ್ಳಿ', modal: '₹2,100/q' },
    { name: 'Potato', icon: '🥔', hindi: 'आलू', kannada: 'ಆಲೂಗಡ್ಡೆ', modal: '₹1,600/q' },
    { name: 'Green Chilli', icon: '🌶️', hindi: 'हरी मिर्च', kannada: 'ಹಸಿಮೆಣಸಿನಕಾಯಿ', modal: '₹3,400/q' },
    { name: 'Cotton', icon: '☁️', hindi: 'कपास', kannada: 'ಹತ್ತಿ', modal: '₹7,200/q' },
    { name: 'Soybean', icon: '🌱', hindi: 'सोयाबीन', kannada: 'ಸೋಯಾಬೀನ್', modal: '₹4,350/q' },
    { name: 'Maize', icon: '🌽', hindi: 'मक्का', kannada: 'ಮೆಕ್ಕೆಜೋಳ', modal: '₹2,150/q' },
    { name: 'Paddy / Rice', icon: '🍚', hindi: 'धान / चावल', kannada: 'ಭತ್ತ / ಅಕ್ಕಿ', modal: '₹2,450/q' },
    { name: 'Wheat', icon: '🌾', hindi: 'गेहूं', kannada: 'ಗೋಧಿ', modal: '₹2,600/q' },
    { name: 'Mustard', icon: '🌼', hindi: 'सरसों', kannada: 'ಸಾಸಿವೆ', modal: '₹5,400/q' },
  ];

  const mandiList = [
    { name: 'Ballari', apmc: 'Ballari APMC', state: 'Karnataka', topCrop: 'Tomato & Chilli' },
    { name: 'Kolar', apmc: 'Kolar APMC', state: 'Karnataka', topCrop: 'Tomato & Veg' },
    { name: 'Lasalgaon', apmc: 'Lasalgaon APMC', state: 'Maharashtra', topCrop: 'Onion' },
    { name: 'Davanagere', apmc: 'Davanagere APMC', state: 'Karnataka', topCrop: 'Maize' },
    { name: 'Azadpur', apmc: 'Azadpur Mandi', state: 'Delhi', topCrop: 'All Produce' },
    { name: 'Guntur', apmc: 'Guntur APMC', state: 'Andhra Pradesh', topCrop: 'Red Chilli' },
    { name: 'Hubballi', apmc: 'Hubballi APMC', state: 'Karnataka', topCrop: 'Cotton & Pulses' },
    { name: 'Belagavi', apmc: 'Belagavi APMC', state: 'Karnataka', topCrop: 'Vegetables' },
    { name: 'Mysuru', apmc: 'Mysuru APMC', state: 'Karnataka', topCrop: 'Paddy & Veg' },
    { name: 'Vashi', apmc: 'Vashi APMC', state: 'Maharashtra', topCrop: 'Grain & Spices' },
  ];

  const filteredCrops = searchQuery.trim() === ''
    ? cropList.slice(0, 4)
    : cropList.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.hindi.includes(searchQuery) || 
        c.kannada.includes(searchQuery)
      );

  const filteredMandis = searchQuery.trim() === ''
    ? mandiList.slice(0, 4)
    : mandiList.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.apmc.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.topCrop.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleExecuteSearch = (targetCrop?: string, targetMandi?: string) => {
    setShowSuggestions(false);
    if (onSearchAndNavigate) {
      onSearchAndNavigate(targetCrop, targetMandi);
    } else if (targetCrop && onSelectCropAndNavigate) {
      onSelectCropAndNavigate(targetCrop);
    } else {
      onNavigate('dashboard');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      onNavigate('dashboard');
      return;
    }
    const foundCrop = cropList.find(c => query.toLowerCase().includes(c.name.toLowerCase()) || c.hindi.includes(query) || c.kannada.includes(query));
    const foundMandi = mandiList.find(m => query.toLowerCase().includes(m.name.toLowerCase()) || query.toLowerCase().includes(m.state.toLowerCase()));
    
    handleExecuteSearch(foundCrop ? foundCrop.name : query, foundMandi ? foundMandi.name : undefined);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (alertPhone.trim()) {
      setAlertSubscribed(true);
      setTimeout(() => setAlertSubscribed(false), 4500);
      setAlertPhone('');
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* SECTION 1: AGRIHUB + VERDAGRO MODERN HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F8F4] via-white to-[#FBFDF9] pt-8 sm:pt-12 pb-12 sm:pb-16 border-b border-[#E2ECE3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          
          {/* Top Fully Functional Search Bar with Live Autocomplete */}
          <div className="max-w-3xl mx-auto relative z-30">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="bg-white p-2 sm:p-2.5 pl-4 rounded-full border-2 border-[#CCE0D0] focus-within:border-[#2E7D32] shadow-md hover:shadow-lg transition-all flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EBF5ED] flex items-center justify-center text-[#2E7D32] shrink-0">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search crop (Tomato, Onion, Maize...) or APMC Mandi (Kolar, Ballari, Lasalgaon)..."
                  className="text-xs sm:text-sm text-[#123826] font-semibold flex-1 bg-transparent outline-none placeholder:text-stone-400 placeholder:font-normal"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setShowSuggestions(false);
                    }}
                    className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 sm:px-6 py-2.5 rounded-full bg-[#123826] hover:bg-[#2E7D32] text-white text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 shadow-sm flex items-center gap-1.5"
                >
                  <span>Search Rates</span>
                  <ArrowRight className="w-4 h-4 text-[#E8A238]" />
                </button>
              </div>

              {/* Autocomplete Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-3xl shadow-2xl border border-[#D5E7D8] p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#F0F5F1] text-xs">
                    <span className="font-bold text-[#123826] uppercase tracking-wider text-[11px]">
                      {searchQuery.trim() ? 'Matching Results' : '🔥 Trending Searches Across APMCs'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowSuggestions(false)}
                      className="text-stone-400 hover:text-stone-600 cursor-pointer p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                    {/* Crops Column */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                        Crops & Commodities
                      </span>
                      {filteredCrops.length === 0 ? (
                        <p className="text-xs text-stone-400 py-1 italic">No direct crop match</p>
                      ) : (
                        filteredCrops.map((c) => (
                          <div
                            key={c.name}
                            onClick={() => handleExecuteSearch(c.name, undefined)}
                            className="p-2 rounded-xl hover:bg-[#EBF5ED] transition-colors cursor-pointer flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base">{c.icon}</span>
                              <div>
                                <span className="font-bold text-[#123826] block">{c.name}</span>
                                <span className="text-[10px] text-stone-500">{c.hindi} • {c.kannada}</span>
                              </div>
                            </div>
                            <span className="font-mono font-black text-xs text-[#2E7D32]">{c.modal}</span>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Mandis Column */}
                    <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-[#F0F5F1] md:pl-4 pt-2 md:pt-0">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                        Verified APMC Mandis
                      </span>
                      {filteredMandis.length === 0 ? (
                        <p className="text-xs text-stone-400 py-1 italic">No direct mandi match</p>
                      ) : (
                        filteredMandis.map((m) => (
                          <div
                            key={m.name}
                            onClick={() => handleExecuteSearch(undefined, m.name)}
                            className="p-2 rounded-xl hover:bg-[#EBF5ED] transition-colors cursor-pointer flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-[#EBF5ED] text-[#2E7D32] flex items-center justify-center text-[10px]">
                                <MapPin className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <span className="font-bold text-[#123826] block">{m.apmc}</span>
                                <span className="text-[10px] text-stone-500">{m.state} • Top: {m.topCrop}</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-[#2E7D32] bg-emerald-50 px-2 py-0.5 rounded-md">Live</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#F0F5F1] flex items-center justify-between text-[11px]">
                    <span className="text-stone-500">Tip: Press Enter or click any item to see full price spread</span>
                    <button
                      type="button"
                      onClick={() => handleExecuteSearch(searchQuery || 'Tomato', undefined)}
                      className="font-bold text-[#2E7D32] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore all 20 Mandis in Terminal</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Editorial Welcome & Copy */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF5ED] border border-[#CCE0D0] text-[#123826] text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse"></span>
                <span>AGRIMATE • SMART FARMING SAAS & APMC INTELLIGENCE</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#123826] tracking-tight font-['Syne',sans-serif] leading-[1.12]">
                Modern Farming for a <span className="text-[#2E7D32] italic">Sustainable</span> Future
              </h1>

              <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl font-['Outfit',sans-serif]">
                Get the latest APMC mandi rates, vehicle haulage estimators, quality seed indices, and expert agronomy advice—all in one unified platform built for India's 15,000+ growers.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-6 py-3.5 rounded-2xl bg-[#123826] hover:bg-[#1a4a34] text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-lg shadow-[#123826]/20 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Explore Terminal Now</span>
                  <ArrowRight className="w-4 h-4 text-[#E8A238]" />
                </button>

                <button
                  onClick={() => onNavigate('services')}
                  className="px-5 py-3.5 rounded-2xl bg-white hover:bg-[#F2F8F4] text-[#123826] font-semibold text-sm border border-[#CCE0D0] shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-[#123826] text-[#123826]" />
                  <span>Interactive Tools</span>
                </button>

                <button
                  onClick={() => onNavigate('dispatch')}
                  className="px-5 py-3.5 rounded-2xl bg-[#EBF5ED] hover:bg-[#d8eedc] text-[#123826] font-semibold text-sm flex items-center gap-2 border border-[#CCE0D0] transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#2E7D32]" />
                  <span>Gate Slip Station</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-3 border-t border-[#E2ECE3] flex flex-wrap items-center gap-5 text-xs text-stone-600">
                <div className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                  <span>100% Agmarknet APMC Data</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Award className="w-4 h-4 text-[#E8A238]" />
                  <span>APMC Act 2026 Compliant</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Database className="w-4 h-4 text-[#2E7D32]" />
                  <span>Zero Price Hallucination</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Farmer Imagery + Side Live Market Prices Card (AgriHub Layout) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-stone-100 group">
                <img 
                  src="/farmer_tablet_field.jpg" 
                  alt="Modern Farmer Inspecting Digital Agricultural Dashboard" 
                  className="w-full h-72 sm:h-80 object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#123826]/70 via-transparent to-transparent"></div>

                {/* Overlaid AgriHub Telemetry Nodes */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-medium border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-ping"></span>
                  <span>Agmarknet Verified 2026</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#CCE0D0] text-[#123826] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#2E7D32] block">Featured Market Yard</span>
                    <p className="text-sm font-black font-['Syne',sans-serif]">Ballari APMC Main Yard</p>
                  </div>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="px-3 py-1.5 rounded-lg bg-[#123826] text-white text-xs font-bold hover:bg-[#2E7D32] transition-colors cursor-pointer"
                  >
                    View Rates →
                  </button>
                </div>
              </div>

              {/* AgriHub Style Side Live Market Prices Card */}
              <div className="bg-white p-5 rounded-3xl border border-[#E2ECE3] shadow-md space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E2ECE3]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🌿</span>
                    <h3 className="font-bold text-[#123826] text-sm font-['Syne',sans-serif]">
                      Live Prevailing Market Prices
                    </h3>
                  </div>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="text-xs font-bold text-[#2E7D32] hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>View All</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  {liveTickers.slice(0, 4).map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        if (onSelectCropAndNavigate) onSelectCropAndNavigate(item.crop);
                        else onNavigate('dashboard');
                      }}
                      className="p-2.5 rounded-xl bg-[#FAFBF9] border border-[#E2ECE3] hover:border-[#2E7D32] transition-all cursor-pointer space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-stone-700 flex items-center gap-1">
                          <span>{item.icon}</span>
                          <span>{item.crop}</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono">
                          {item.change}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="font-mono font-black text-[#123826] text-sm">{item.modal}</span>
                        <span className="text-[10px] text-stone-500 font-mono">/{item.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: AGRIDFLOW SMART SAAS MICROCLIMATE & TELEMETRY STRIP */}
          <div className="pt-4">
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#E2ECE3] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] animate-ping"></div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#123826]">
                    AgridFlow Live Microclimate & Field Telemetry Sensors
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-stone-500">Karnataka & Deccan Basin</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {telemetryData.map((t, i) => {
                  const Icon = t.icon;
                  return (
                    <div key={i} className="p-3 rounded-2xl bg-[#FAFBF9] border border-[#E2ECE3] flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-stone-500 font-semibold truncate">{t.label}</p>
                        <p className="text-base font-black text-[#123826] font-mono leading-tight">{t.value}</p>
                        <p className="text-[10px] text-stone-600 truncate">{t.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION 3: AGRIHUB 5 QUICK CATEGORY BADGES STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {categoryBadges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <div
                  key={i}
                  onClick={() => onNavigate(badge.link)}
                  className="bg-white p-4 rounded-2xl border border-[#E2ECE3] hover:shadow-md hover:border-[#CCE0D0] transition-all cursor-pointer space-y-2.5 group"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center border group-hover:scale-105 transition-transform ${badge.bg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#123826] text-sm leading-tight">{badge.title}</h4>
                    <p className="text-[11px] text-stone-500 leading-snug mt-1">{badge.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 4: AGRIHUB FEATURED CROPS + "HEALTHY SOIL HEALTHY CROPS" CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32]">Agronomy Showcase</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#123826] font-['Syne',sans-serif]">
              Featured Agricultural Produce & Soil Health
            </h2>
          </div>
          <button
            onClick={() => onNavigate('crops')}
            className="text-xs sm:text-sm font-bold text-[#2E7D32] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Crops ({liveTickers.length}+)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* 4 Crop Cards from AgriHub */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Crop 1: Maize */}
            <div 
              onClick={() => { if (onSelectCropAndNavigate) onSelectCropAndNavigate('Maize'); else onNavigate('dashboard'); }}
              className="bg-white p-4 rounded-2xl border border-[#E2ECE3] hover:border-[#2E7D32] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-32 rounded-xl overflow-hidden bg-amber-50 flex items-center justify-center text-5xl">
                  🌽
                </div>
                <div>
                  <h4 className="font-bold text-[#123826] text-base">Maize / Corn</h4>
                  <p className="text-xs text-stone-500">High yield • Drought resistant hybrid</p>
                </div>
              </div>
              <div className="pt-3 mt-2 border-t border-[#E2ECE3] flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-[#123826]">₹2,150 / q</span>
                <span className="text-[#2E7D32] font-bold flex items-center">Analyze →</span>
              </div>
            </div>

            {/* Crop 2: Tomatoes */}
            <div 
              onClick={() => { if (onSelectCropAndNavigate) onSelectCropAndNavigate('Tomato'); else onNavigate('dashboard'); }}
              className="bg-white p-4 rounded-2xl border border-[#E2ECE3] hover:border-[#2E7D32] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-32 rounded-xl overflow-hidden bg-rose-50 flex items-center justify-center text-5xl">
                  🍅
                </div>
                <div>
                  <h4 className="font-bold text-[#123826] text-base">Tomatoes</h4>
                  <p className="text-xs text-stone-500">Rich in nutrients • High market velocity</p>
                </div>
              </div>
              <div className="pt-3 mt-2 border-t border-[#E2ECE3] flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-[#123826]">₹1,850 / q</span>
                <span className="text-[#2E7D32] font-bold flex items-center">Analyze →</span>
              </div>
            </div>

            {/* Crop 3: Potatoes & Alliums */}
            <div 
              onClick={() => { if (onSelectCropAndNavigate) onSelectCropAndNavigate('Potato'); else onNavigate('dashboard'); }}
              className="bg-white p-4 rounded-2xl border border-[#E2ECE3] hover:border-[#2E7D32] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-32 rounded-xl overflow-hidden bg-stone-100 flex items-center justify-center text-5xl">
                  🥔
                </div>
                <div>
                  <h4 className="font-bold text-[#123826] text-base">Potatoes & Tubers</h4>
                  <p className="text-xs text-stone-500">Hardy • Long cold-storage duration</p>
                </div>
              </div>
              <div className="pt-3 mt-2 border-t border-[#E2ECE3] flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-[#123826]">₹1,600 / q</span>
                <span className="text-[#2E7D32] font-bold flex items-center">Analyze →</span>
              </div>
            </div>

            {/* Crop 4: Green Vegetables & Chilli */}
            <div 
              onClick={() => { if (onSelectCropAndNavigate) onSelectCropAndNavigate('Green Chilli'); else onNavigate('dashboard'); }}
              className="bg-white p-4 rounded-2xl border border-[#E2ECE3] hover:border-[#2E7D32] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-32 rounded-xl overflow-hidden bg-emerald-50 flex items-center justify-center text-5xl">
                  🌶️
                </div>
                <div>
                  <h4 className="font-bold text-[#123826] text-base">Green Chilli & Spices</h4>
                  <p className="text-xs text-stone-500">Pungent grade • High commercial arbitrage</p>
                </div>
              </div>
              <div className="pt-3 mt-2 border-t border-[#E2ECE3] flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-[#123826]">₹3,400 / q</span>
                <span className="text-[#2E7D32] font-bold flex items-center">Analyze →</span>
              </div>
            </div>
          </div>

          {/* AgriHub "Healthy Soil Healthy Crops Healthy Future" Showcase Card */}
          <div className="lg:col-span-5 bg-[#123826] text-white p-6 sm:p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden shadow-xl">
            <div className="space-y-4 relative z-10">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-white/15 text-[#E8A238] border border-white/20">
                Regenerative Agriculture
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-['Syne',sans-serif] leading-tight">
                Healthy Soil • Healthy Crops • Healthy Future
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                Sustainable farming practices for greener soil and higher auction grade realization. Our agronomy team assists farmers in bio-fertilizer scheduling, drip moisture indexing, and residue management.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/20 relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/30 shrink-0">
                  <img src="/healthy_soil_hands.jpg" alt="Farmer Hands with Fertile Soil" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Soil Stewardship Protocol</p>
                  <p className="text-[11px] text-stone-300">22% Lower Chemical Input</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('about')}
                className="px-4 py-2 rounded-xl bg-[#E8A238] hover:bg-[#d4912e] text-[#123826] font-bold text-xs transition-colors cursor-pointer"
              >
                Learn More →
              </button>
            </div>

            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <img src="/healthy_soil_hands.jpg" alt="" className="w-full h-full object-cover filter blur-xs" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: LATEST FARMING TIPS & AGRONOMY GUIDES (from AgriHub) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32]">Knowledge Transfer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#123826] font-['Syne',sans-serif]">
              Latest Farming Tips & Agronomy Guides
            </h2>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="text-xs sm:text-sm font-bold text-[#2E7D32] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Tips</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E2ECE3] hover:shadow-md transition-all space-y-3">
            <span className="text-xs font-bold text-[#2E7D32] bg-[#EBF5ED] px-2.5 py-0.5 rounded-full">Crop Care</span>
            <h4 className="font-bold text-[#123826] text-sm leading-snug">How to Improve Soil Fertility Naturally with Bio-Fertilizers</h4>
            <p className="text-xs text-stone-500">Inoculate mycorrhiza and rhizobium cultures before sowing to boost root absorption.</p>
            <span className="block text-[10px] text-stone-400 pt-2 border-t border-[#E2ECE3]">Agronomy Review • Updated Weekly</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2ECE3] hover:shadow-md transition-all space-y-3">
            <span className="text-xs font-bold text-[#0284C7] bg-[#E0F2FE] px-2.5 py-0.5 rounded-full">Pest Control</span>
            <h4 className="font-bold text-[#123826] text-sm leading-snug">Effective Biological Ways to Prevent Common Solanaceous Pests</h4>
            <p className="text-xs text-stone-500">Use yellow sticky traps and neem oil emulsifiers to counter whiteflies and thrips.</p>
            <span className="block text-[10px] text-stone-400 pt-2 border-t border-[#E2ECE3]">Plant Protection Board • Updated</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2ECE3] hover:shadow-md transition-all space-y-3">
            <span className="text-xs font-bold text-[#7C3AED] bg-[#F3E8FF] px-2.5 py-0.5 rounded-full">Smart Irrigation</span>
            <h4 className="font-bold text-[#123826] text-sm leading-snug">Smart Micro-Drip Irrigation for 35% Water Savings</h4>
            <p className="text-xs text-stone-500">Schedule fertigation according to soil tension sensors during peak fruit enlargement.</p>
            <span className="block text-[10px] text-stone-400 pt-2 border-t border-[#E2ECE3]">Deccan Irrigation Hub • Updated</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2ECE3] hover:shadow-md transition-all space-y-3">
            <span className="text-xs font-bold text-[#D97706] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full">Mandi Economics</span>
            <h4 className="font-bold text-[#123826] text-sm leading-snug">How to Maximize APMC Auction Realization Without Middlemen</h4>
            <p className="text-xs text-stone-500">Verify modal rates and enforce standard statutory gate slips to prevent deductions.</p>
            <span className="block text-[10px] text-stone-400 pt-2 border-t border-[#E2ECE3]">APMC Regulatory Guide • Updated</span>
          </div>
        </div>
      </section>

      {/* SECTION 6: VERDAGRO 4 PILLARS & AGRIDFLOW CO-FOUNDER QUOTE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* AgridFlow Co-Founder Editorial Quote Callout */}
        <div className="bg-[#F4F8F5] p-6 sm:p-10 rounded-3xl border border-[#CCE0D0] text-center max-w-4xl mx-auto mb-14 space-y-4">
          <span className="text-3xl text-[#2E7D32]">“</span>
          <p className="text-xl sm:text-2xl font-black text-[#123826] font-['Syne',sans-serif] leading-relaxed">
            We need a simple, intuitive dashboard that helps farmers track tasks, monitor yields, and manage market haulage easily.
          </p>
          <div className="pt-2">
            <p className="font-bold text-[#123826] text-sm">Alexander Bennett & Agronomy Board</p>
            <p className="text-xs text-stone-500">AgridFlow SaaS Architecture • AgriMate Initiative</p>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] bg-[#EBF5ED] px-3 py-1 rounded-full border border-[#CCE0D0]">
            Agricultural Heritage
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#123826] font-['Syne',sans-serif]">
            Four Pillars of AgriMate Ecosystem
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E2ECE3] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#EBF5ED] text-[#2E7D32] flex items-center justify-center text-xl">🌱</div>
            <h3 className="text-lg font-bold text-[#123826]">Soil Stewardship</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Sustainable regenerative farming methods, moisture monitoring, and precision fertilization reducing input overheads by up to 22%.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2ECE3] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FFF8E7] text-[#E8A238] flex items-center justify-center text-xl">⚖️</div>
            <h3 className="text-lg font-bold text-[#123826]">Price Transparency</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Real-time Agmarknet modal auction prices, spread analysis, and daily arrival statistics with zero algorithmic speculation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2ECE3] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#EBF5ED] text-[#2E7D32] flex items-center justify-center text-xl">🚛</div>
            <h3 className="text-lg font-bold text-[#123826]">Freight Optimization</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Vehicle-matched haulage calculation across Tata Ace, Pickup, and 6-Wheelers to prevent transport gouging before departure.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2ECE3] shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FFF8E7] text-[#E8A238] flex items-center justify-center text-xl">🤝</div>
            <h3 className="text-lg font-bold text-[#123826]">Fair Direct Settlement</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Standardized statutory gate passes and weighbridge verification under the APMC Act 2026 to ensure zero illicit deductions.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7: NEWSLETTER & WHATSAPP PRICE ALERTS SUBSCRIPTION BOX (from AgriHub) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#123826] via-[#1a4a34] to-[#123826] text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E8A238] bg-white/10 px-3 py-1 rounded-full border border-white/20">
              Daily Agmarknet Dispatches
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-['Syne',sans-serif]">
              Subscribe to Real-Time Mandi Price Alerts
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Receive morning auction opening rates, volume alerts, and extreme weather warnings directly on your WhatsApp or SMS.
            </p>
          </div>

          <div className="w-full md:w-auto min-w-[300px] sm:min-w-[380px]">
            {alertSubscribed ? (
              <div className="bg-white/15 border border-[#2E7D32] p-4 rounded-2xl text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-[#A5D6A7] mx-auto" />
                <p className="font-bold text-white text-sm">Alerts Activated!</p>
                <p className="text-xs text-emerald-200">You will receive morning opening bids for your district.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="tel"
                  required
                  placeholder="Enter 10-digit mobile number"
                  value={alertPhone}
                  onChange={(e) => setAlertPhone(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white text-[#123826] text-xs sm:text-sm font-medium outline-none flex-1 placeholder:text-stone-400"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-[#E8A238] hover:bg-[#d4912e] text-[#123826] font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Subscribe</span>
                </button>
              </form>
            )}
            <p className="text-[10px] text-emerald-200/60 mt-2 text-center sm:text-left">
              Official Agmarknet feed • Free service for registered Indian farmers • Zero spam
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
