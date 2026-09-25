/**
 * Safe client-side storage wrappers that guard against disabled storage or SSR contexts
 */

export const safeLocalStorage = {
  getItem<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  setItem<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

export const safeSessionStorage = {
  getItem<T>(key: string, fallback: T): T {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  setItem<T>(key: string, value: T): boolean {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};
