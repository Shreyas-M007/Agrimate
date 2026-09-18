import type { Language } from '../types';

/**
 * Maps AgriMate language codes to Google Translate language codes
 */
const GOOGLE_LANG_MAP: Record<Language, string> = {
  en: 'en',
  hi: 'hi',
  kn: 'kn',
  te: 'te',
  ta: 'ta',
  mr: 'mr',
  bn: 'bn',
  gu: 'gu',
  pa: 'pa',
  ml: 'ml'
};

/**
 * Triggers full-site dynamic DOM translation without manual dictionary hardcoding.
 * Automatically translates 100% of all pages, cards, modals, headers, footers, and dynamic content.
 */
export function setSiteLanguage(targetLang: Language): void {
  const googleLang = GOOGLE_LANG_MAP[targetLang] || 'en';

  try {
    const hostname = window.location.hostname;

    if (googleLang === 'en') {
      // Clear translation cookies to restore original English text
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${hostname};`;

      const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (combo) {
        combo.value = 'en';
        combo.dispatchEvent(new Event('change'));
      }
      return;
    }

    // Set Google Translate cookie for /en/<targetLang>
    const cookieValue = `/en/${googleLang}`;
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${hostname};`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=.${hostname};`;

    // Trigger translation via the Google Translate combo element
    const triggerCombo = () => {
      const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (combo) {
        combo.value = googleLang;
        combo.dispatchEvent(new Event('change'));
        return true;
      }
      return false;
    };

    if (!triggerCombo()) {
      // If the Google element hasn't mounted yet, poll for it
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (triggerCombo() || attempts > 25) {
          clearInterval(interval);
        }
      }, 150);
    }
  } catch (err) {
    console.warn('[Translator] Error applying site translation:', err);
  }
}
