import React, { useState } from 'react';
import type { Language, CropUnit } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Mic, MicOff, CornerDownLeft, CheckCircle2, Terminal } from 'lucide-react';

interface NaturalQueryProps {
  language: Language;
  onParsedResult: (parsed: { crop: string; location: string; quantity: number; unit: CropUnit }) => void;
}

export const NaturalQuery: React.FC<NaturalQueryProps> = ({
  language,
  onParsedResult
}) => {
  const t = TRANSLATIONS[language];
  const [queryText, setQueryText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<any>(null);

  // Suggested prompt examples
  const samplePrompts = [
    { en: "500 kg tomato in Ballari", hi: "500 किलो टमाटर बेल्लारी", kn: "ಬಳ್ಳಾರಿಯಲ್ಲಿ 500 ಕೆಜಿ ಟೊಮೆಟೊ" },
    { en: "15 quintals onion in Nashik", hi: "15 क्विंटल प्याज नासिक", kn: "ನಾಸಿಕ್‌ನಲ್ಲಿ 15 ಕ್ವಿಂಟಾಲ್ ಈರುಳ್ಳಿ" },
    { en: "2 tonnes potato in Agra", hi: "2 टन आलू आगरा", kn: "ಆಗ್ರಾದಲ್ಲಿ 2 ಟನ್ ಆಲೂಗಡ್ಡೆ" },
    { en: "5 quintals chilli in Guntur", hi: "5 क्विंटल मिर्च गुंटूर", kn: "ಗುಂಟೂರಿನಲ್ಲಿ 5 ಕ್ವಿಂಟಾಲ್ ಮೆಣಸಿನಕಾಯಿ" }
  ];

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please type your query in the box.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : (language === 'kn' ? 'kn-IN' : 'en-IN');
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQueryText(transcript);
      parseAndApply(transcript);
    };

    recognition.start();
  };

  const parseAndApply = async (text: string) => {
    if (!text.trim()) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/parse-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text })
      });
      const data = await res.json();
      if (data.success && data.parsed) {
        setParsedPreview(data.parsed);
        onParsedResult({
          crop: data.parsed.crop,
          location: data.parsed.location,
          quantity: data.parsed.quantity,
          unit: data.parsed.unit as CropUnit
        });
      }
    } catch (err) {
      console.error("NLP parsing error", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-emerald-500/25 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#00FF87]" />
          <h3 className="font-bold text-white text-base font-['Syne',sans-serif]">
            {t.searchTabNlp} <span className="text-stone-500 font-mono text-xs">(Bedrock NLU Engine)</span>
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#00FF87] bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
          STRICT DETERMINISTIC PARSING
        </span>
      </div>
      <p className="text-xs font-mono text-stone-400 mb-3.5">
        {t.nlpPrompt}
      </p>

      {/* Input bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                parseAndApply(queryText);
              }
            }}
            placeholder={
              language === 'hi' 
                ? "जैसे: 'बेल्लारी में 500 किलो टमाटर बेचना है'" 
                : (language === 'kn' ? "ಉದಾ: 'ಬಳ್ಳಾರಿಯಲ್ಲಿ 500 ಕೆಜಿ ಟೊಮೆಟೊ'" : "e.g. 'I want to sell 500 kg tomato in Ballari'")
            }
            className="w-full pl-4 pr-10 py-3 bg-[#0A0D0B] border border-white/15 rounded-xl text-white font-mono text-sm placeholder:text-stone-600 focus:outline-none focus:border-[#00FF87] focus:ring-1 focus:ring-[#00FF87] transition-all"
          />
        </div>

        {/* Mic button */}
        <button
          type="button"
          onClick={handleVoiceInput}
          title={isListening ? t.nlpListening : t.nlpMicStart}
          className={`px-3.5 py-3 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
            isListening 
              ? 'bg-red-600/90 border-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
              : 'bg-white/5 hover:bg-emerald-500/10 border-white/15 hover:border-emerald-500/30 text-stone-300 hover:text-[#00FF87]'
          }`}
          aria-label={t.nlpMicStart}
        >
          {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Submit button */}
        <button
          type="button"
          onClick={() => parseAndApply(queryText)}
          disabled={isProcessing || !queryText.trim()}
          className="px-5 py-3 bg-[#00FF87] hover:bg-[#10B981] text-[#060807] font-black text-sm rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,255,135,0.25)] font-['Syne',sans-serif]"
        >
          {isProcessing ? (
            <div className="w-4 h-4 border-2 border-[#060807] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <CornerDownLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t.nlpSubmit}</span>
            </>
          )}
        </button>
      </div>

      {/* Sample Quick Prompts */}
      <div className="flex flex-wrap gap-2 mt-3.5 items-center">
        <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">Quick Prompt:</span>
        {samplePrompts.map((prompt, idx) => {
          const label = language === 'hi' ? prompt.hi : (language === 'kn' ? prompt.kn : prompt.en);
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQueryText(label);
                parseAndApply(label);
              }}
              className="text-xs font-mono bg-[#111713] hover:bg-emerald-950/60 border border-white/10 hover:border-emerald-500/40 text-stone-300 hover:text-[#00FF87] px-2.5 py-1 rounded-lg transition-all cursor-pointer"
            >
              "{label}"
            </button>
          );
        })}
      </div>

      {/* Structured parsed preview verification */}
      {parsedPreview && (
        <div className="mt-3.5 p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-stone-200 font-mono shadow-inner">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#00FF87] shrink-0" />
            <span>
              <strong className="text-[#00FF87]">Validated:</strong> {parsedPreview.crop} • {parsedPreview.location} • {parsedPreview.quantity} {parsedPreview.unit}
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-700/50">
            PRD Sec 18 Validated
          </span>
        </div>
      )}
    </div>
  );
};

export default NaturalQuery;
