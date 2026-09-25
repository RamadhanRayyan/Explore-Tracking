import { defineStore } from 'pinia';
import type { User, UserPreferences } from '@/types';

// NOTE: This client-side authentication is strictly for DEMO/portfolio evaluation
// and does NOT replace a production authentication backend.

const DEFAULT_PREFERENCES: UserPreferences = {
  defaultTransport: 'motor',
  preferredCategories: ['Wisata', 'Kuliner', 'Heritage'],
  budgetPreference: 100000,
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: null as User | null,
    // Demo registered users stored locally for login test
    registeredUsers: [
      {
        id: 'user-demo-1',
        name: 'Wisatawan Semarang',
        email: 'traveler@semarang.id',
        preferences: DEFAULT_PREFERENCES,
      },
    ] as User[],
  }),
  getters: {
    isAuthenticated: (state) => !!state.currentUser,
    userPreferences: (state): UserPreferences => {
      return state.currentUser?.preferences || DEFAULT_PREFERENCES;
    },
  },
  actions: {
    login(email: string, _password?: string): { success: boolean; message: string } {
      const trimmedEmail = email.trim().toLowerCase();
      const existing = this.registeredUsers.find(u => u.email.toLowerCase() === trimmedEmail);
      
      if (existing) {
        this.currentUser = existing;
        return { success: true, message: `Selamat datang kembali, ${existing.name}!` };
      }

      // If user logs in with new email, create quick profile for demo convenience
      const newUser: User = {
        id: 'user-' + Date.now(),
        name: trimmedEmail.split('@')[0],
        email: trimmedEmail,
        preferences: { ...DEFAULT_PREFERENCES },
      };
      this.registeredUsers.push(newUser);
      this.currentUser = newUser;
      return { success: true, message: `Akun demo berhasil dibuat. Selamat datang, ${newUser.name}!` };
    },

    register(name: string, email: string, _password?: string): { success: boolean; message: string } {
      const trimmedEmail = email.trim().toLowerCase();
      const exists = this.registeredUsers.some(u => u.email.toLowerCase() === trimmedEmail);
      if (exists) {
        return { success: false, message: 'Email ini sudah terdaftar. Silakan login.' };
      }

      const newUser: User = {
        id: 'user-' + Date.now(),
        name: name.trim() || 'Pengelana Semarang',
        email: trimmedEmail,
        preferences: { ...DEFAULT_PREFERENCES },
      };

      this.registeredUsers.push(newUser);
      this.currentUser = newUser;
      return { success: true, message: 'Registrasi berhasil! Selamat menjelajah Semarang.' };
    },

    logout() {
      this.currentUser = null;
    },

    updatePreferences(newPreferences: Partial<UserPreferences>) {
      if (this.currentUser) {
        this.currentUser.preferences = {
          ...this.currentUser.preferences,
          ...newPreferences,
        };
      }
    },
  },
  persist: {
    storage: localStorage,
  },
});
