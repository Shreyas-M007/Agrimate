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
 * Actively suppresses and purges Google Translate top banner, iframe bars, and top padding
 */
export function cleanGoogleTranslateBanner(): void {
  if (typeof document === 'undefined') return;

  // Reset body & html top style
  if (document.body) {
    if (document.body.style.top && document.body.style.top !== '0px') {
      document.body.style.setProperty('top', '0px', 'important');
    }
    if (document.body.style.position === 'relative') {
      document.body.style.setProperty('position', 'static', 'important');
    }
  }

  // Remove or hide injected iframes and Google toolbars
  const frames = document.querySelectorAll<HTMLElement>(
    'iframe.skiptranslate, iframe.goog-te-banner-frame, iframe[class*="goog"], iframe[class*="VIpgJd"], iframe[id*=":1.container"], iframe[id*=":2.container"], .VIpgJd-ZVi9od-OR9Pa-bKo6Fe, .VIpgJd-ZVi9od-aZ2wEe-wOHMy'
  );
  frames.forEach(frame => {
    frame.style.setProperty('display', 'none', 'important');
    frame.style.setProperty('visibility', 'hidden', 'important');
    frame.style.setProperty('height', '0px', 'important');
    frame.style.setProperty('width', '0px', 'important');
    frame.style.setProperty('opacity', '0', 'important');
    frame.style.setProperty('pointer-events', 'none', 'important');
    if (frame.parentNode && (frame.classList.contains('VIpgJd-ZVi9od-OR9Pa-bKo6Fe') || frame.classList.contains('goog-te-banner-frame'))) {
      try {
        frame.parentNode.removeChild(frame);
      } catch {
        // Silent catch
      }
    }
  });
}

// Continuous background watcher to kill any Google banners the instant they mount
if (typeof window !== 'undefined') {
  setInterval(cleanGoogleTranslateBanner, 100);

  if (document.documentElement) {
    const observer = new MutationObserver(() => {
      cleanGoogleTranslateBanner();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      childList: true,
      subtree: true
    });
  }
}

/**
 * Safely unwrap any lingering Google Translate <font> nodes to prevent stuck text
 */
export function purgeLingeringTranslateNodes(): void {
  if (typeof document === 'undefined') return;
  try {
    const fonts = document.querySelectorAll<HTMLElement>(
      'font.VIpgJd-ZVi9od-aZ2wEe-wOHMy, font[class*="VIpgJd"], font[style*="vertical-align"]'
    );
    fonts.forEach(f => {
      const parent = f.parentNode;
      if (parent) {
        while (f.firstChild) {
          parent.insertBefore(f.firstChild, f);
        }
        try {
          parent.removeChild(f);
        } catch {
          // ignore
        }
      }
    });
  } catch {
    // Non-critical DOM cleanup
  }
}

/**
 * Triggers full-site dynamic DOM translation without manual dictionary hardcoding.
 * Automatically translates 100% of all pages, cards, modals, headers, footers, and dynamic content.
 */
export function setSiteLanguage(targetLang: Language): void {
  const googleLang = GOOGLE_LANG_MAP[targetLang] || 'en';

  try {
    cleanGoogleTranslateBanner();
    const hostname = window.location.hostname;
    const domains = ['', hostname, `.${hostname}`];
    const paths = ['/', window.location.pathname];

    const clearTransCookies = () => {
      domains.forEach(d => {
        paths.forEach(p => {
          document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${p};${d ? ` domain=${d};` : ''}`;
        });
      });
    };

    if (googleLang === 'en') {
      clearTransCookies();
      const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (combo) {
        combo.value = ''; // Empty string restores original English in Google Translate
        combo.dispatchEvent(new Event('change'));
      }
      setTimeout(() => {
        purgeLingeringTranslateNodes();
        cleanGoogleTranslateBanner();
      }, 100);
      return;
    }

    // First clear old language cookies to prevent stale language collisions
    clearTransCookies();

    // Set Google Translate cookie for /en/<targetLang>
    const cookieValue = `/en/${googleLang}`;
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    if (hostname) {
      document.cookie = `googtrans=${cookieValue}; path=/; domain=${hostname};`;
      document.cookie = `googtrans=${cookieValue}; path=/; domain=.${hostname};`;
    }

    // Trigger translation via the Google Translate combo element
    const triggerCombo = () => {
      cleanGoogleTranslateBanner();
      const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (combo) {
        // Reset to base first to avoid translation cascades (e.g. Kannada -> Hindi)
        combo.value = '';
        combo.dispatchEvent(new Event('change'));

        // Wait 120ms for DOM unwrap to settle cleanly before applying new language
        setTimeout(() => {
          combo.value = googleLang;
          combo.dispatchEvent(new Event('change'));
          cleanGoogleTranslateBanner();
        }, 120);
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
          cleanGoogleTranslateBanner();
        }
      }, 150);
    }
  } catch (err) {
    console.warn('[Translator] Error applying site translation:', err);
  }
}
