import { defineStore } from 'pinia';
import type { ToastNotification } from '@/types';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    toasts: [] as ToastNotification[],
  }),
  actions: {
    showToast(message: string, type: ToastNotification['type'] = 'success', durationMs = 3000) {
      const id = Math.random().toString(36).substring(2, 9);
      const toast: ToastNotification = { id, type, message };
      this.toasts.push(toast);

      setTimeout(() => {
        this.removeToast(id);
      }, durationMs);
    },
    removeToast(id: string) {
      this.toasts = this.toasts.filter(t => t.id !== id);
    },
  },
});
