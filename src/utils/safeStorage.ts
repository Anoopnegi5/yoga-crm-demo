// Safe LocalStorage wrapper for iOS Safari, WebViews, and Private Browsing modes
// Prevents QuotaExceededError and SecurityError crashes across all mobile & desktop browsers

const memoryStore: Record<string, string> = {};

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn(`[safeStorage] getItem error for "${key}":`, e);
    }
    return memoryStore[key] || null;
  },

  setItem: (key: string, value: string): boolean => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return true;
      }
    } catch (e) {
      console.warn(`[safeStorage] setItem error for "${key}" (falling back to memory):`, e);
    }
    memoryStore[key] = value;
    return false;
  },

  removeItem: (key: string): boolean => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        delete memoryStore[key];
        return true;
      }
    } catch (e) {
      console.warn(`[safeStorage] removeItem error for "${key}":`, e);
    }
    delete memoryStore[key];
    return false;
  },

  clear: (): boolean => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch (e) {
      console.warn('[safeStorage] clear error:', e);
    }
    for (const k in memoryStore) {
      delete memoryStore[k];
    }
    return true;
  }
};
