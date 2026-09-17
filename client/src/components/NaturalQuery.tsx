import React, { useState } from 'react';
import type { Language, CropUnit } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { Mic, MicOff, Sparkles, CornerDownLeft, CheckCircle2 } from 'lucide-react';

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
    <div className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-2xl p-5 border-2 border-emerald-300 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-amber-600" />
        <h3 className="font-black text-stone-900 text-base">
          {t.searchTabNlp} (Bedrock NLP Layer)
        </h3>
      </div>
      <p className="text-xs text-stone-600 mb-3">
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
            className="w-full pl-4 pr-10 py-3 bg-white border-2 border-emerald-400 rounded-xl text-stone-900 font-medium text-sm focus:outline-none focus:ring-4 focus:ring-emerald-600/30"
          />
        </div>

        {/* Mic button */}
        <button
          type="button"
          onClick={handleVoiceInput}
          title={isListening ? t.nlpListening : t.nlpMicStart}
          className={`px-3.5 py-3 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer ${
            isListening 
              ? 'bg-red-600 border-red-700 text-white animate-pulse' 
              : 'bg-emerald-700 hover:bg-emerald-800 border-emerald-800 text-white'
          }`}
          aria-label={t.nlpMicStart}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Submit button */}
        <button
          type="button"
          onClick={() => parseAndApply(queryText)}
          disabled={isProcessing || !queryText.trim()}
          className="px-4 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
      <div className="flex flex-wrap gap-2 mt-3 items-center">
        <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">Try:</span>
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
              className="text-xs bg-white hover:bg-emerald-100/70 border border-emerald-300 text-emerald-950 font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              "{label}"
            </button>
          );
        })}
      </div>

      {/* Structured parsed preview verification */}
      {parsedPreview && (
        <div className="mt-3 p-2.5 bg-emerald-100/70 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Parsed:</strong> {parsedPreview.crop} • {parsedPreview.location} • {parsedPreview.quantity} {parsedPreview.unit}
            </span>
          </div>
          <span className="text-[11px] font-bold text-emerald-800">
            Validated by Backend
          </span>
        </div>
      )}
    </div>
  );
};
