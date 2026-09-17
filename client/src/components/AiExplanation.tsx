import React, { useState, useEffect } from 'react';
import type { MarketItem, PriceTrend, Language, AiExplanationData } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Sparkles, Bot, ShieldCheck, Volume2, VolumeX, Share2, Check, Copy } from 'lucide-react';

interface AiExplanationProps {
  market: MarketItem;
  trend: PriceTrend | null;
  language: Language;
  quantityQuintals: number;
}

export const AiExplanation: React.FC<AiExplanationProps> = ({
  market,
  trend,
  language,
  quantityQuintals
}) => {
  const t = TRANSLATIONS[language];
  const [explanation, setExplanation] = useState<AiExplanationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchExplanation() {
      setLoading(true);
      try {
        const res = await fetch('/api/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            market,
            trend,
            language,
            quantityQuintals
          })
        });
        const data = await res.json();
        if (isMounted && data.success) {
          setExplanation(data.explanation);
        }
      } catch (err) {
        console.error("Error fetching AI explanation", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (market) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      fetchExplanation();
    }
    return () => { 
      isMounted = false; 
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [market, trend, language, quantityQuintals]);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window) || !explanation) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const fullText = `${explanation.title}. ${explanation.summary} ${explanation.priceDetails} ${explanation.trendExplanation} ${explanation.advice}`;
    const utterance = new SpeechSynthesisUtterance(fullText);

    if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (language === 'kn') {
      utterance.lang = 'kn-IN';
    } else {
      utterance.lang = 'en-IN';
    }
    utterance.rate = 0.92;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    if (!explanation) return;
    const text = `${explanation.title}\n\n${explanation.summary}\n\n${explanation.priceDetails}\n${explanation.trendExplanation}\n\nTip: ${explanation.advice}\n\nVerified by MandiMate`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!explanation) return;
    const text = `🌾 *${explanation.title}*\n\n${explanation.summary}\n\n${explanation.priceDetails}\n${explanation.trendExplanation}\n\n💡 *Farmer Tip:* ${explanation.advice}\n\n_Source: ${market.source}_`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="glass-panel-elevated rounded-3xl p-6 border border-emerald-500/30 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#00FF87] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-emerald-300">
            Generating market analysis in {language === 'hi' ? 'हिन्दी' : (language === 'kn' ? 'ಕನ್ನಡ' : 'English')}...
          </span>
        </div>
      </div>
    );
  }

  if (!explanation) return null;

  return (
    <div className="relative overflow-hidden glass-panel-elevated text-white rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-[0_16px_50px_rgba(0,0,0,0.9)]">
      {/* Background glowing telemetry gradients */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 bg-[#00FF87]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with audio and action controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-br from-emerald-500/30 to-emerald-950 border border-emerald-500/40 text-[#00FF87] rounded-2xl shadow-[0_0_20px_rgba(0,255,135,0.25)]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Syne',sans-serif]">
              {explanation.title}
            </h3>
            <span className="text-xs font-mono text-[#00FF87] flex items-center gap-1.5 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.aiExplanationBadge}</span>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Voice Text-to-Speech Button */}
          <button
            type="button"
            onClick={handleSpeak}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              isSpeaking 
                ? 'bg-amber-400 text-stone-950 animate-bounce shadow-[0_0_15px_rgba(245,158,11,0.5)]' 
                : 'bg-emerald-950/80 hover:bg-emerald-900 text-[#00FF87] border border-emerald-500/40 hover:shadow-[0_0_15px_rgba(0,255,135,0.2)]'
            }`}
            title={isSpeaking ? "Stop Voice Narration" : "Listen in Selected Language"}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isSpeaking ? "Speaking..." : (language === 'kn' ? "ಧ್ವನಿ ಕೇಳಿ" : (language === 'hi' ? "आवाज़ में सुनें" : "Listen Voice"))}</span>
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Copy Insights"
          >
            {copied ? <Check className="w-4 h-4 text-[#00FF87]" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* WhatsApp Share Button */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            title="Share to WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Narrative Cards */}
      <div className="relative z-10 space-y-4 text-sm sm:text-base leading-relaxed">
        <div className="bg-[#0A0D0B] p-5 rounded-2xl border border-emerald-500/20 shadow-inner">
          <p className="font-semibold text-emerald-100 text-base sm:text-lg">
            {explanation.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="bg-[#0A0D0B] p-4.5 rounded-2xl border border-white/10">
            <div className="text-[10px] uppercase tracking-wider text-amber-400 font-bold mb-1.5">
              Price Range & Arrival Volume
            </div>
            <p className="text-stone-300 leading-normal">{explanation.priceDetails}</p>
          </div>

          <div className="bg-[#0A0D0B] p-4.5 rounded-2xl border border-white/10">
            <div className="text-[10px] uppercase tracking-wider text-[#00FF87] font-bold mb-1.5">
              Historical Trend Insight
            </div>
            <p className="text-stone-300 leading-normal">{explanation.trendExplanation}</p>
          </div>
        </div>

        {explanation.estimatedValueNote && (
          <div className="bg-amber-950/40 p-4 rounded-2xl border border-amber-500/30 text-xs font-mono text-amber-200">
            <strong className="text-amber-300">Produce Estimate Note:</strong> {explanation.estimatedValueNote}
          </div>
        )}

        <div className="bg-[#0D120E] p-5 rounded-2xl border border-emerald-500/30 flex items-start gap-3.5 shadow-inner">
          <div className="p-2 bg-emerald-950 text-[#00FF87] border border-emerald-500/30 rounded-xl shrink-0 mt-0.5">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#00FF87] font-bold mb-1">
              Field Action Advice
            </div>
            <p className="text-stone-200 font-medium">{explanation.advice}</p>
          </div>
        </div>
      </div>

      {/* Telemetry Footer */}
      <div className="relative z-10 mt-6 pt-4 border-t border-white/10 text-xs font-mono text-stone-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#00FF87] shrink-0" />
          <span>{explanation.verifiedNotice}</span>
        </div>
        <span className="text-[10px] bg-white/5 px-2.5 py-1 rounded-md border border-white/10 text-stone-400">
          Official APMC Market Advisory • Ministry of Agriculture
        </span>
      </div>
    </div>
  );
};

export default AiExplanation;
