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
 * Thoroughly clears all Google Translate cookies across all hostnames, subdomains, and paths.
 */
export function clearAllTranslateCookies(): void {
  if (typeof document === 'undefined') return;
  const hostname = window.location.hostname;
  const cookieNames = ['googtrans', 'googtrans_prev', 'googtrans_bak'];
  const domainParts = hostname.split('.');
  const domains = ['', hostname, `.${hostname}`, 'localhost'];
  if (domainParts.length >= 2) {
    domains.push(`.${domainParts.slice(-2).join('.')}`);
  }
  const paths = ['/', window.location.pathname, '/en', '/kn', '/hi'];

  domains.forEach(domain => {
    paths.forEach(path => {
      cookieNames.forEach(name => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};${domain ? ` domain=${domain};` : ''}`;
      });
    });
  });
}

/**
 * Searches for and clicks the native Google Translate "Show Original" button inside the banner iframe
 */
export function restoreOriginalLanguage(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const iframes = Array.from(document.querySelectorAll<HTMLIFrameElement>('iframe'));
    for (const iframe of iframes) {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          const restoreBtn = doc.querySelector<HTMLElement>(
            'button[id*="restore"], #\\:1\\.restore, #\\:2\\.restore, .goog-te-banner-frame-restore, [id$="restore"], .goog-close-link'
          );
          if (restoreBtn) {
            restoreBtn.click();
            return true;
          }
        }
      } catch {
        // Cross-origin iframe boundary
      }
    }
    const docRestoreBtn = document.querySelector<HTMLElement>(
      'button[id*="restore"], #\\:1\\.restore, .goog-te-banner-frame-restore'
    );
    if (docRestoreBtn) {
      docRestoreBtn.click();
      return true;
    }
  } catch (err) {
    console.warn('Could not click restore button', err);
  }
  return false;
}

/**
 * Actively suppresses Google Translate top banner, iframe bars, and top padding without removing the iframe
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

  // Visually hide injected iframes and Google toolbars without deleting them from DOM
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
    frame.style.setProperty('position', 'absolute', 'important');
    frame.style.setProperty('top', '-9999px', 'important');
    frame.style.setProperty('left', '-9999px', 'important');
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

    if (googleLang === 'en') {
      clearAllTranslateCookies();
      const clickedRestore = restoreOriginalLanguage();

      const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (combo) {
        combo.value = '';
        combo.dispatchEvent(new Event('change'));
      }

      document.documentElement.classList.remove('translated-ltr', 'translated-rtl');
      document.body.classList.remove('translated-ltr', 'translated-rtl');

      // Check if page reverted cleanly. If not, reload with cleared cookies to guarantee 100% pure English
      setTimeout(() => {
        const stillTranslated = document.documentElement.classList.contains('translated-ltr') ||
          document.body.classList.contains('translated-ltr') ||
          document.querySelector('font.VIpgJd-ZVi9od-aZ2wEe-wOHMy, font[class*="VIpgJd"]') !== null;
        if (stillTranslated || !clickedRestore) {
          window.location.reload();
        }
      }, 100);
      return;
    }

    // First clear old language cookies to prevent stale language collisions
    clearAllTranslateCookies();

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

