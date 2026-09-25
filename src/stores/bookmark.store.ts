import { defineStore } from 'pinia';
import { useNotificationStore } from './notification.store';

export const useBookmarkStore = defineStore('bookmark', {
  state: () => ({
    bookmarkedPlaceIds: [] as string[],
  }),

  getters: {
    isBookmarked: (state) => {
      return (placeId: string): boolean => {
        return state.bookmarkedPlaceIds.includes(placeId);
      };
    },
    count: (state) => state.bookmarkedPlaceIds.length,
  },

  actions: {
    addBookmark(placeId: string) {
      if (!this.bookmarkedPlaceIds.includes(placeId)) {
        this.bookmarkedPlaceIds.push(placeId);
        const notification = useNotificationStore();
        notification.showToast('Tempat berhasil disimpan ke Favorit');
      }
    },

    removeBookmark(placeId: string) {
      this.bookmarkedPlaceIds = this.bookmarkedPlaceIds.filter(id => id !== placeId);
      const notification = useNotificationStore();
      notification.showToast('Tempat dihapus dari Favorit', 'info');
    },

    toggleBookmark(placeId: string): boolean {
      if (this.isBookmarked(placeId)) {
        this.removeBookmark(placeId);
        return false;
      } else {
        this.addBookmark(placeId);
        return true;
      }
    },

    clearAllBookmarks() {
      this.bookmarkedPlaceIds = [];
    },
  },

  persist: {
    storage: localStorage,
  },
});
