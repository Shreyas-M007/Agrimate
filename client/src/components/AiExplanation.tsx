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
      // Stop speech if speaking
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

    // Set voice/lang
    if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (language === 'kn') {
      utterance.lang = 'kn-IN';
    } else {
      utterance.lang = 'en-IN';
    }
    utterance.rate = 0.92; // Slightly slower for clarity

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
      <div className="bg-gradient-to-br from-emerald-900 to-stone-900 text-white rounded-3xl p-6 shadow-xl border-2 border-emerald-700 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-base font-bold text-emerald-200">
            Generating Bedrock AI market intelligence in {language === 'hi' ? 'हिन्दी' : (language === 'kn' ? 'ಕನ್ನಡ' : 'English')}...
          </span>
        </div>
      </div>
    );
  }

  if (!explanation) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-emerald-700/80">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with audio and action controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-emerald-800/80 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-500 text-emerald-950 rounded-2xl shadow-lg border border-amber-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow">
              {explanation.title}
            </h3>
            <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5 mt-0.5">
              <span>{t.aiExplanationBadge}</span>
            </span>
          </div>
        </div>

        {/* Action Controls: Audio Voice Output, Copy, WhatsApp */}
        <div className="flex items-center gap-2">
          {/* Voice Text-to-Speech Button (PRD Sec 32) */}
          <button
            type="button"
            onClick={handleSpeak}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md ${
              isSpeaking 
                ? 'bg-amber-400 text-emerald-950 animate-bounce' 
                : 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100 border border-emerald-600'
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
            className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-emerald-200 border border-stone-700 transition-colors cursor-pointer"
            title="Copy Insights"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* WhatsApp Share Button */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
            title="Share to WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Narrative Cards */}
      <div className="relative z-10 space-y-4 text-sm sm:text-base leading-relaxed text-emerald-50">
        <div className="bg-emerald-900/50 p-5 rounded-2xl border border-emerald-700/60 shadow-inner">
          <p className="font-semibold text-emerald-100 text-base sm:text-lg">
            {explanation.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-stone-900/70 p-4.5 rounded-2xl border border-stone-700/80">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
              Price Range & Volume Details
            </div>
            <p className="text-stone-300 text-sm">{explanation.priceDetails}</p>
          </div>

          <div className="bg-stone-900/70 p-4.5 rounded-2xl border border-stone-700/80">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">
              Historical Trend Insight
            </div>
            <p className="text-stone-300 text-sm">{explanation.trendExplanation}</p>
          </div>
        </div>

        {explanation.estimatedValueNote && (
          <div className="bg-amber-950/60 p-4 rounded-2xl border border-amber-600/60 text-xs sm:text-sm text-amber-200">
            <strong className="font-bold text-amber-300">Produce Estimate Note:</strong> {explanation.estimatedValueNote}
          </div>
        )}

        <div className="bg-gradient-to-r from-emerald-900/80 to-emerald-950/80 p-5 rounded-2xl border border-emerald-600/70 flex items-start gap-3.5">
          <div className="p-2 bg-emerald-800 text-amber-300 rounded-xl shrink-0 mt-0.5 shadow">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-amber-300 mb-1">
              Field Action Advice
            </div>
            <p className="text-emerald-100 font-medium">{explanation.advice}</p>
          </div>
        </div>
      </div>

      {/* Verified Notice Footer */}
      <div className="relative z-10 mt-6 pt-4 border-t border-emerald-800/80 text-xs text-emerald-300 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{explanation.verifiedNotice}</span>
        </div>
        <span className="text-[11px] font-mono bg-emerald-900/60 px-2.5 py-1 rounded-md border border-emerald-700 text-emerald-200">
          Bedrock Architecture • Deterministic Grounding
        </span>
      </div>
    </div>
  );
};
