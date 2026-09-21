import React, { useState, useEffect } from 'react';
import type { MarketItem, PriceTrend, Language, AiExplanationData } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Sparkles, Bot, ShieldCheck, Volume2, VolumeX, Share2, Check, Copy } from 'lucide-react';
import { apiUrl } from '../utils/api';

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
        const res = await fetch(apiUrl('/explain'), {
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

    const langCodeMap: Record<Language, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      kn: 'kn-IN',
      te: 'te-IN',
      ta: 'ta-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
      gu: 'gu-IN',
      pa: 'pa-IN',
      ml: 'ml-IN'
    };
    utterance.lang = langCodeMap[language] || 'en-IN';
    utterance.rate = 0.92;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    if (!explanation) return;
    const text = `${explanation.title}\n\n${explanation.summary}\n\n${explanation.priceDetails}\n${explanation.trendExplanation}\n\nTip: ${explanation.advice}\n\nVerified by AgriMate`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!explanation) return;
    const text = `*${explanation.title}*\n\n${explanation.summary}\n\n${explanation.priceDetails}\n${explanation.trendExplanation}\n\n*Farmer Tip:* ${explanation.advice}\n\n_Source: ${market.source}_\n_Verified by AgriMate Market Intelligence_`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const languageDisplayNames: Record<Language, string> = {
    en: "English",
    hi: "हिन्दी",
    kn: "ಕನ್ನಡ",
    te: "తెలుగు",
    ta: "தமிழ்",
    mr: "मराठी",
    bn: "বাংলা",
    gu: "ગુજરાતી",
    pa: "ਪੰਜਾਬੀ",
    ml: "മലയാളം"
  };

  const listenButtonLabels: Record<Language, string> = {
    en: "Listen Voice",
    hi: "आवाज़ में सुनें",
    kn: "ಧ್ವನಿ ಕೇಳಿ",
    te: "వాయిస్ వినండి",
    ta: "குரல் கேளுங்கள்",
    mr: "आवाज ऐका",
    bn: "ভয়েস শুনুন",
    gu: "અવાજ સાંભળો",
    pa: "ਆਵਾਜ਼ ਸੁਣੋ",
    ml: "ശബ്ദം കേൾക്കൂ"
  };

  if (loading) {
    return (
      <div className="verda-card rounded-3xl p-6 border border-[#CCE0D0] animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#2E7D32] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-[#123826]">
            Generating market analysis in {languageDisplayNames[language]}...
          </span>
        </div>
      </div>
    );
  }

  if (!explanation) return null;

  return (
    <div className="relative overflow-hidden verda-card text-[#162E21] rounded-3xl p-6 sm:p-8 border border-[#CCE0D0] shadow-sm">
      {/* Background subtle nature ambiance */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#EBF5ED] rounded-full blur-3xl pointer-events-none opacity-60" />

      {/* Header with audio and action controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#E2ECE3] pb-5 mb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#EBF5ED] border border-[#CCE0D0] text-[#2E7D32] rounded-2xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#123826] font-['Syne',sans-serif]">
              {explanation.title}
            </h3>
            <span className="text-xs font-mono text-[#2E7D32] flex items-center gap-1.5 mt-0.5 font-medium">
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
                ? 'bg-amber-500 text-white animate-bounce shadow-md' 
                : 'bg-[#2E7D32] hover:bg-[#1B5E20] text-white shadow-sm hover:shadow-md'
            }`}
            title={isSpeaking ? "Stop Voice Narration" : `Listen in ${languageDisplayNames[language]}`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isSpeaking ? "Speaking..." : listenButtonLabels[language]}</span>
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-xl bg-[#F4F8F5] hover:bg-[#EBF5ED] text-stone-700 hover:text-[#123826] border border-[#CCE0D0] transition-colors cursor-pointer"
            title="Copy Insights"
          >
            {copied ? <Check className="w-4 h-4 text-[#2E7D32]" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* WhatsApp Share Button */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
            title="Share to WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Narrative Cards */}
      <div className="relative z-10 space-y-4 text-sm sm:text-base leading-relaxed">
        <div className="bg-[#F4F8F5] p-5 rounded-2xl border border-[#CCE0D0] shadow-inner">
          <p className="font-semibold text-[#123826] text-base sm:text-lg">
            {explanation.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="glass-card-subtle p-4.5 rounded-2xl border border-white/80">
            <div className="text-[10px] uppercase tracking-wider text-amber-800 font-bold mb-1.5">
              Price Range & Arrival Volume
            </div>
            <p className="text-stone-700 leading-normal">{explanation.priceDetails}</p>
          </div>

          <div className="glass-card-subtle p-4.5 rounded-2xl border border-white/80">
            <div className="text-[10px] uppercase tracking-wider text-[#123826] font-bold mb-1.5">
              Historical Trend Insight
            </div>
            <p className="text-stone-700 leading-normal">{explanation.trendExplanation}</p>
          </div>
        </div>

        {explanation.estimatedValueNote && (
          <div className="glass-card-subtle p-4 rounded-2xl border border-amber-200/80 bg-amber-50/40 text-xs font-mono text-amber-900">
            <strong className="text-amber-800">Produce Estimate Note:</strong> {explanation.estimatedValueNote}
          </div>
        )}

        <div className="glass-card-subtle p-5 rounded-2xl border border-[#2E7D32]/25 flex items-start gap-3.5">
          <div className="p-2 bg-[#2E7D32] text-white rounded-xl shrink-0 mt-0.5">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#123826] font-bold mb-1">
              Field Action Advice
            </div>
            <p className="text-stone-800 font-medium">{explanation.advice}</p>
          </div>
        </div>
      </div>

      {/* Telemetry Footer */}
      <div className="relative z-10 mt-6 pt-4 border-t border-[#E2ECE3] text-xs font-mono text-stone-500 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#2E7D32] shrink-0" />
          <span>{explanation.verifiedNotice}</span>
        </div>
        <span className="text-[10px] bg-[#F4F8F5] px-2.5 py-1 rounded-md border border-[#E2ECE3] text-stone-600">
          Official APMC Market Advisory • Ministry of Agriculture
        </span>
      </div>
    </div>
  );
};

export default AiExplanation;
