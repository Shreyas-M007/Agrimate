import type { SearchResult } from '../types';

const CACHE_KEY_PREFIX = 'agrimate_cache_';
const LAST_SEARCH_KEY = 'agrimate_last_search';

export function saveSearchResultToCache(crop: string, location: string, data: SearchResult): void {
  try {
    const key = `${CACHE_KEY_PREFIX}${crop.toLowerCase()}_${(location || 'all').toLowerCase()}`;
    const cachedObject = {
      timestamp: new Date().toISOString(),
      crop,
      location,
      data: {
        ...data,
        cached_at: new Date().toISOString()
      }
    };
    localStorage.setItem(key, JSON.stringify(cachedObject));
    localStorage.setItem(LAST_SEARCH_KEY, key);
  } catch (err) {
    console.warn("Unable to save to localStorage cache", err);
  }
}

export function getCachedSearchResult(crop: string, location: string): { data: SearchResult; cachedAt: string } | null {
  try {
    const key = `${CACHE_KEY_PREFIX}${crop.toLowerCase()}_${(location || 'all').toLowerCase()}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      data: parsed.data,
      cachedAt: parsed.timestamp
    };
  } catch (err) {
    console.warn("Unable to parse cache", err);
    return null;
  }
}

export function getLastCachedSearch(): { data: SearchResult; cachedAt: string; crop: string; location: string } | null {
  try {
    const lastKey = localStorage.getItem(LAST_SEARCH_KEY);
    if (!lastKey) return null;
    const raw = localStorage.getItem(lastKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      data: parsed.data,
      cachedAt: parsed.timestamp,
      crop: parsed.crop,
      location: parsed.location
    };
  } catch {
    return null;
  }
}
