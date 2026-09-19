import React, { useState, useRef } from 'react';
import type { Language, NavigationPage, Commodity } from '../types';
import { 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Award, 
  ChevronRight, 
  ChevronLeft,
  Database, 
  Play, 
  Search, 
  Send, 
  X, 
  MapPin 
} from 'lucide-react';
import { ContinentalMosaic } from '../components/ContinentalMosaic';
import { IndiaMarketsMap } from '../components/IndiaMarketsMap';

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

  // Quick live mandi ticker data (Pan-India APMC coverage)
  const liveTickers = [
    { crop: 'Maize', mandi: 'Davanagere APMC', state: 'Karnataka', modal: '₹2,150', unit: 'q', change: '+4.2%', trend: 'up', icon: '🌽' },
    { crop: 'Tomato', mandi: 'Ballari APMC', state: 'Karnataka', modal: '₹1,850', unit: 'q', change: '+2.6%', trend: 'up', icon: '🍅' },
    { crop: 'Onion', mandi: 'Lasalgaon APMC', state: 'Maharashtra', modal: '₹2,100', unit: 'q', change: '+1.9%', trend: 'up', icon: '🧅' },
    { crop: 'Cumin', mandi: 'Unjha APMC', state: 'Gujarat', modal: '₹28,500', unit: 'q', change: '+4.8%', trend: 'up', icon: '🌿' },
    { crop: 'Mustard', mandi: 'Kota APMC', state: 'Rajasthan', modal: '₹5,450', unit: 'q', change: '+2.1%', trend: 'up', icon: '🌼' },
    { crop: 'Wheat', mandi: 'Khanna APMC', state: 'Punjab', modal: '₹2,275', unit: 'q', change: '+1.1%', trend: 'up', icon: '🌾' },
    { crop: 'Potato', mandi: 'Agra APMC', state: 'Uttar Pradesh', modal: '₹1,480', unit: 'q', change: '-0.5%', trend: 'stable', icon: '🥔' },
    { crop: 'Green Chilli', mandi: 'Guntur APMC', state: 'Andhra Pradesh', modal: '₹3,400', unit: 'q', change: '+5.2%', trend: 'up', icon: '🌶️' },
    { crop: 'Soybean', mandi: 'Indore APMC', state: 'Madhya Pradesh', modal: '₹4,600', unit: 'q', change: '+1.8%', trend: 'up', icon: '🌱' },
    { crop: 'Paddy / Rice', mandi: 'Burdwan APMC', state: 'West Bengal', modal: '₹2,550', unit: 'q', change: '+1.8%', trend: 'up', icon: '🍚' },
    { crop: 'Apple', mandi: 'Sopore Mandi', state: 'Jammu and Kashmir', modal: '₹5,200', unit: 'q', change: '+3.6%', trend: 'up', icon: '🍎' },
    { crop: 'Turmeric', mandi: 'Nizamabad APMC', state: 'Telangana', modal: '₹12,400', unit: 'q', change: '+4.1%', trend: 'up', icon: '🌿' },
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
    { name: 'Unjha', apmc: 'Unjha APMC', state: 'Gujarat', topCrop: 'Cumin & Spices' },
    { name: 'Kota', apmc: 'Kota APMC', state: 'Rajasthan', topCrop: 'Mustard & Soybean' },
    { name: 'Khanna', apmc: 'Khanna APMC', state: 'Punjab', topCrop: 'Wheat & Grain' },
    { name: 'Azadpur', apmc: 'Azadpur Mandi', state: 'Delhi', topCrop: 'All Produce' },
    { name: 'Guntur', apmc: 'Guntur APMC', state: 'Andhra Pradesh', topCrop: 'Red Chilli' },
    { name: 'Indore', apmc: 'Indore APMC', state: 'Madhya Pradesh', topCrop: 'Soybean & Wheat' },
    { name: 'Kolkata', apmc: 'Koley APMC', state: 'West Bengal', topCrop: 'Potato & Rice' },
    { name: 'Gulabbagh', apmc: 'Gulabbagh APMC', state: 'Bihar', topCrop: 'Maize' },
    { name: 'Chennai', apmc: 'Koyambedu APMC', state: 'Tamil Nadu', topCrop: 'Vegetables' },
    { name: 'Kochi', apmc: 'Kochi APMC', state: 'Kerala', topCrop: 'Coconut & Spices' },
    { name: 'Sopore', apmc: 'Sopore Fruit Mandi', state: 'Jammu and Kashmir', topCrop: 'Apple' },
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

  const cropSliderRef = useRef<HTMLDivElement>(null);

  const slideLeft = () => {
    cropSliderRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const slideRight = () => {
    cropSliderRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  };

  const featuredCrops = [
    { name: 'Tomato', icon: '🍅', mandi: 'Ballari APMC', modal: '₹1,850', unit: 'q', change: '+2.6%', note: 'Solanaceous • High Demand' },
    { name: 'Onion', icon: '🧅', mandi: 'Lasalgaon APMC', modal: '₹2,100', unit: 'q', change: '+1.9%', note: 'Allium • Peak Arrivals' },
    { name: 'Maize', icon: '🌽', mandi: 'Davanagere APMC', modal: '₹2,150', unit: 'q', change: '+4.2%', note: 'Cereal • Export Grade' },
    { name: 'Green Chilli', icon: '🌶️', mandi: 'Guntur APMC', modal: '₹3,400', unit: 'q', change: '+5.2%', note: 'Spice • High Realization' },
    { name: 'Potato', icon: '🥔', mandi: 'Hassan APMC', modal: '₹1,600', unit: 'q', change: '+0.8%', note: 'Tuber • Steady Arrivals' },
    { name: 'Paddy / Rice', icon: '🍚', mandi: 'Sindhanur APMC', modal: '₹2,450', unit: 'q', change: '+3.1%', note: 'Staple • MSP Verified' },
    { name: 'Cotton', icon: '☁️', mandi: 'Hubballi APMC', modal: '₹7,200', unit: 'q', change: '+1.4%', note: 'Commercial • Medium Staple' },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* SECTION 1: HERO & LIVE SEARCH */}
      <section className="relative overflow-hidden pt-8 sm:pt-12 pb-12 sm:pb-16">
        {/* Full-bleed background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1800&q=80&auto=format&fit=crop')`,
          }}
          aria-hidden="true"
        />
        {/* Dark green scrim */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(15,35,22,0.72) 0%, rgba(15,35,22,0.60) 60%, rgba(15,35,22,0.85) 100%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          
          {/* Universal Search Bar with Live Autocomplete */}
          <div className="max-w-3xl mx-auto relative z-30">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="bg-white p-2.5 sm:p-3 pl-5 sm:pl-6 rounded-full border-2 border-white/60 focus-within:border-[#2E7D32] shadow-2xl hover:shadow-3xl transition-all flex items-center gap-2.5 sm:gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EAEFE9] flex items-center justify-center text-[#2E7D32] shrink-0">
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
                  placeholder="Search crop (Tomato, Onion, Maize...) or APMC Mandi (Ballari, Lasalgaon, Kolar)..."
                  className="text-xs sm:text-sm text-[#153424] font-semibold flex-1 bg-transparent outline-none placeholder:text-stone-400 placeholder:font-normal"
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
                  className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#153424] hover:bg-[#2E7D32] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 shadow-md flex items-center gap-2"
                >
                  <span>Search Rates</span>
                  <ArrowRight className="w-4 h-4 text-[#E8A238]" />
                </button>
              </div>

              {/* Autocomplete Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-3xl shadow-2xl border border-[#E6E1D7] p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#ECE8DE] text-xs">
                    <span className="font-bold text-[#153424] uppercase tracking-wider text-[11px]">
                      {searchQuery.trim() ? 'Matching Results' : 'Trending Searches Across Mandis'}
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
                            <div className="flex items-center gap-2 notranslate" translate="no">
                              <span className="text-base notranslate" translate="no">{c.icon}</span>
                              <div>
                                <span className="font-bold text-[#123826] block">{c.name}</span>
                                <span className="text-[10px] text-stone-500">{c.hindi} • {c.kannada}</span>
                              </div>
                            </div>
                            <span className="font-mono font-bold text-xs text-[#2E7D32]">{c.modal}</span>
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
                    <span className="text-stone-500">Tip: Click any crop or mandi to inspect price spreads</span>
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

          {/* Hero Editorial Header & Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 space-y-5">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-['Syne',sans-serif] leading-[1.14]">
                Precision Mandi Intelligence for <span className="text-[#6FBF73] italic">Indian Agriculture</span>
              </h1>

              <p className="text-white/75 text-sm sm:text-base leading-relaxed max-w-xl font-['Outfit',sans-serif]">
                Official Agmarknet wholesale auction rates, freight estimators, and statutory digital gate passes across 20+ verified mandis.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-6 py-3.5 rounded-2xl bg-white hover:bg-white/90 text-[#153424] font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <span>Open Terminal</span>
                  <ArrowRight className="w-4 h-4 text-[#2E7D32]" />
                </button>

                <button
                  onClick={() => onNavigate('dispatch')}
                  className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-white/25 transition-all cursor-pointer backdrop-blur-sm"
                >
                  <FileText className="w-4 h-4 text-[#6FBF73]" />
                  <span>Gate Slip Station</span>
                </button>

                <button
                  onClick={() => onNavigate('services')}
                  className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 flex items-center gap-2 transition-all cursor-pointer backdrop-blur-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Interactive Tools</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-3 border-t border-white/15 flex flex-wrap items-center gap-4 text-xs text-white/65">
                <div className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#6FBF73]" />
                  <span>100% Agmarknet APMC Data</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Award className="w-4 h-4 text-[#E8A238]" />
                  <span>APMC Act 2026 Compliant</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Database className="w-4 h-4 text-[#6FBF73]" />
                  <span>Zero Price Hallucination</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive National APMC Mandi Grid Map */}
            <div className="lg:col-span-5 animate-slide-up">
              <IndiaMarketsMap 
                onNavigate={onNavigate} 
                onSearchAndNavigate={onSearchAndNavigate} 
              />
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: SMOOTH SLIDE-MOVING MARQUEE TICKER (Ref: Pinterest 7yRLlPCqL) */}
      <section className="bg-[#ECE8DE]/60 border-y border-[#E6E1D7] py-3.5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#153424]">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse"></span>
            <span className="uppercase tracking-wider text-[11px] font-mono">Live APMC Rate Stream</span>
          </div>
          <span className="text-[11px] text-stone-500 font-mono hidden sm:block">Hover to pause • Click to inspect</span>
        </div>

        {/* Sliding Marquee Track */}
        <div className="overflow-hidden w-full select-none py-1">
          <div className="animate-slide-infinite flex items-center gap-3">
            {/* Duplicated list to create infinite seamless loop */}
            {[...liveTickers, ...liveTickers].map((item, idx) => (
              <div
                key={`${item.crop}-${idx}`}
                onClick={() => {
                  if (onSelectCropAndNavigate) onSelectCropAndNavigate(item.crop);
                  else onNavigate('dashboard');
                }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white border border-[#E6E1D7] hover:border-[#2E7D32] shadow-xs hover:shadow-sm transition-all cursor-pointer shrink-0"
              >
                <span className="text-xl notranslate" translate="no">{item.icon}</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#153424] flex items-center gap-1.5">
                    <span>{item.crop}</span>
                    <span className="text-[10px] text-stone-400 font-normal">({item.mandi})</span>
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-black text-[#153424]">{item.modal}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 rounded font-mono">
                      {item.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: CONTINENTAL FARMERS GROUP ASYMMETRICAL MOSAIC */}
      <ContinentalMosaic
        onNavigate={onNavigate}
        onSelectCrop={onSelectCropAndNavigate}
      />

      {/* SECTION 4: INTERACTIVE SMOOTH SLIDING CROP SHOWCASE (Horizontal Slide Carousel) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase font-mono font-bold tracking-wider text-[#2E7D32] block mb-1">
              Benchmark Commodities
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#153424] font-['Syne',sans-serif]">
              Popular Crops & Prevailing APMC Rates
            </h2>
          </div>

          {/* Slider Prev / Next Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={slideLeft}
              className="w-10 h-10 rounded-full border border-[#E6E1D7] bg-white hover:bg-[#EAEFE9] text-[#153424] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              aria-label="Slide left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={slideRight}
              className="w-10 h-10 rounded-full border border-[#E6E1D7] bg-white hover:bg-[#EAEFE9] text-[#153424] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              aria-label="Slide right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Slide Scroll Container */}
        <div 
          ref={cropSliderRef}
          className="slide-scroll-snap no-scrollbar flex items-stretch gap-4 overflow-x-auto pb-2 pt-1"
        >
          {featuredCrops.map((c) => (
            <div
              key={c.name}
              onClick={() => {
                if (onSelectCropAndNavigate) onSelectCropAndNavigate(c.name);
                else onNavigate('dashboard');
              }}
              className="slide-scroll-item min-w-[280px] sm:min-w-[320px] max-w-[320px] bg-white p-5 rounded-2xl border border-[#E6E1D7] hover:border-[#2E7D32] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] flex items-center justify-center text-3xl notranslate" translate="no">
                    {c.icon}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-mono">
                    {c.change}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#153424]">{c.name}</h3>
                  <p className="text-xs text-stone-500">{c.mandi}</p>
                  <p className="text-[11px] text-stone-400 mt-1">{c.note}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#ECE8DE] flex items-center justify-between">
                <span className="font-mono font-black text-base text-[#153424]">{c.modal} <span className="text-xs font-normal text-stone-500">/{c.unit}</span></span>
                <span className="text-xs font-bold text-[#2E7D32] flex items-center gap-1 hover:underline">
                  <span>Analyze</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: FOUR ECOSYSTEM PILLARS (Clean, Minimalist Layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <span className="text-[11px] uppercase font-mono font-bold tracking-wider text-[#2E7D32] bg-[#EAEFE9] px-3 py-1 rounded-full border border-[#D6DFD4]">
            Core Principles
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#153424] font-['Syne',sans-serif]">
            Four Pillars of AgriMate Ecosystem
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-[#E6E1D7] shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#EAEFE9] text-[#2E7D32] flex items-center justify-center text-lg notranslate" translate="no">🌱</div>
            <h3 className="text-base font-bold text-[#153424]">Soil Stewardship</h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              Regenerative crop management and moisture indexing reducing input overheads.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E6E1D7] shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFF8E7] text-[#E8A238] flex items-center justify-center text-lg notranslate" translate="no">⚖️</div>
            <h3 className="text-base font-bold text-[#153424]">Price Transparency</h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              Real-time Agmarknet modal bids, spreads, and arrivals with zero algorithmic speculation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E6E1D7] shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#EAEFE9] text-[#2E7D32] flex items-center justify-center text-lg notranslate" translate="no">🚛</div>
            <h3 className="text-base font-bold text-[#153424]">Freight Optimization</h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              Vehicle-matched haulage calculation across Tata Ace and 6-Wheelers to avoid transport loss.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E6E1D7] shadow-xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFF8E7] text-[#E8A238] flex items-center justify-center text-lg notranslate" translate="no">🤝</div>
            <h3 className="text-base font-bold text-[#153424]">Fair Direct Settlement</h3>
            <p className="text-stone-600 text-xs leading-relaxed">
              Digital gate passes and certified weighbridge verification under APMC Act 2026.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: MANDI PRICE ALERTS (Concise CTA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#153424] via-[#1c4430] to-[#153424] text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E8A238] bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
              Daily Agmarknet Dispatches
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-['Syne',sans-serif]">
              Subscribe to Real-Time Mandi Price Alerts
            </h3>
            <p className="text-stone-300 text-xs leading-relaxed">
              Receive morning auction opening rates and volume alerts directly on your mobile.
            </p>
          </div>

          <div className="w-full md:w-auto min-w-[280px] sm:min-w-[340px]">
            {alertSubscribed ? (
              <div className="bg-white/15 border border-[#2E7D32] p-3.5 rounded-2xl text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-[#A5D6A7] mx-auto" />
                <p className="font-bold text-white text-xs">Alerts Activated!</p>
                <p className="text-[11px] text-emerald-200">You will receive morning opening bids for your district.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="tel"
                  required
                  placeholder="Enter mobile number"
                  value={alertPhone}
                  onChange={(e) => setAlertPhone(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-white text-[#153424] text-xs font-medium outline-none flex-1 placeholder:text-stone-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#E8A238] hover:bg-[#d4912e] text-[#153424] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Subscribe</span>
                </button>
              </form>
            )}
            <p className="text-[10px] text-emerald-200/60 mt-1.5 text-center sm:text-left">
              Official Agmarknet feed • Zero spam • Free for growers
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
