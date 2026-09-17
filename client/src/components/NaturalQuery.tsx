import React, { useState } from 'react';
import type { Language, CropUnit } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Mic, MicOff, CornerDownLeft, CheckCircle2, Sparkles } from 'lucide-react';

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
    <div className="verda-card rounded-2xl p-5 border border-[#E2ECE3] shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#2E7D32]" />
          <h3 className="font-bold text-[#123826] text-base font-['Syne',sans-serif]">
            {t.searchTabNlp}
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[#123826] bg-[#EBF5ED] border border-[#CCE0D0] px-2.5 py-0.5 rounded-full font-medium">
          Voice & Natural Search
        </span>
      </div>
      <p className="text-xs font-mono text-stone-600 mb-3.5">
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
            className="w-full pl-4 pr-10 py-3 bg-white border border-[#CCE0D0] rounded-xl text-[#162E21] font-mono text-sm placeholder:text-stone-400 focus:outline-none focus:border-[#2E7D32] focus:ring-1 focus:ring-[#2E7D32] transition-all"
          />
        </div>

        {/* Mic button */}
        <button
          type="button"
          onClick={handleVoiceInput}
          title={isListening ? t.nlpListening : t.nlpMicStart}
          className={`px-3.5 py-3 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
            isListening 
              ? 'bg-red-600 text-white animate-pulse shadow-md border-red-700' 
              : 'bg-[#F4F8F5] hover:bg-[#EBF5ED] border-[#CCE0D0] hover:border-[#2E7D32] text-[#123826] hover:text-[#2E7D32]'
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
          className="px-5 py-3 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-sm rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md font-['Syne',sans-serif]"
        >
          {isProcessing ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
              className="text-xs font-mono bg-[#F4F8F5] hover:bg-[#EBF5ED] border border-[#CCE0D0] hover:border-[#2E7D32] text-stone-700 hover:text-[#123826] px-2.5 py-1 rounded-lg transition-all cursor-pointer"
            >
              "{label}"
            </button>
          );
        })}
      </div>

      {/* Structured parsed preview verification */}
      {parsedPreview && (
        <div className="mt-3.5 p-3 bg-[#EBF5ED] border border-[#A5D6A7] rounded-xl flex items-center justify-between text-xs text-[#123826] font-mono shadow-inner">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0" />
            <span>
              <strong className="text-[#123826]">Validated:</strong> {parsedPreview.crop} • {parsedPreview.location} • {parsedPreview.quantity} {parsedPreview.unit}
            </span>
          </div>
          <span className="text-[11px] text-[#123826] bg-white px-2.5 py-0.5 rounded border border-[#A5D6A7] font-semibold">
            Search Ready
          </span>
        </div>
      )}
    </div>
  );
};

export default NaturalQuery;
