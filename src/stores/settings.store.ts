import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    darkMode: false,
    hasCompletedOnboarding: false,
  }),
  actions: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      this.applyTheme();
    },
    setDarkMode(enabled: boolean) {
      this.darkMode = enabled;
      this.applyTheme();
    },
    applyTheme() {
      if (typeof document !== 'undefined') {
        if (this.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    completeOnboarding() {
      this.hasCompletedOnboarding = true;
    },
    resetOnboarding() {
      this.hasCompletedOnboarding = false;
    },
  },
  persist: {
    storage: localStorage,
  },
});
