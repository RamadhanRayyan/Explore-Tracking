import { defineStore } from 'pinia';
import type { Review } from '@/types';
import { useNotificationStore } from './notification.store';

// Initial local sample reviews for places
const INITIAL_REVIEWS: Record<string, Review[]> = {
  'kota-lama-semarang': [
    {
      id: 'rev-1',
      placeId: 'kota-lama-semarang',
      userName: 'Bima Satria',
      rating: 5,
      comment: 'Suasananya mirip banget sama kota tua di Amsterdam! Pedestrian sangat bersih dan nyaman untuk jalan kaki sambil foto-foto.',
      date: '12 Sep 2026',
      isLocalUser: false,
    },
    {
      id: 'rev-2',
      placeId: 'kota-lama-semarang',
      userName: 'Dinda Ayuningtyas',
      rating: 5,
      comment: 'Banyak cafe estetik dan tempat sewa sepeda ontel. Keren banget pas sore hari menuju matahari tenggelam.',
      date: '20 Sep 2026',
      isLocalUser: false,
    },
  ],
  'lawang-sewu': [
    {
      id: 'rev-3',
      placeId: 'lawang-sewu',
      userName: 'Rizky Kurniawan',
      rating: 5,
      comment: 'Kaca patri museumnya sangat megah! Bersih dan terawat sekali. Pemandu wisatanya menjelaskan sejarah perkeretaapian dengan sangat fasih.',
      date: '15 Sep 2026',
      isLocalUser: false,
    },
  ],
  'lumpia-gang-lombok': [
    {
      id: 'rev-4',
      placeId: 'lumpia-gang-lombok',
      userName: 'Mega Pratiwi',
      rating: 5,
      comment: 'Rebungnya sama sekali tidak bau, manis gurihnya pas dan saus kentalnya mantap. Wajib beli yang goreng hangat!',
      date: '18 Sep 2026',
      isLocalUser: false,
    },
  ],
};

export const useReviewStore = defineStore('review', {
  state: () => ({
    reviewsByPlace: { ...INITIAL_REVIEWS } as Record<string, Review[]>,
  }),

  getters: {
    getPlaceReviews: (state) => {
      return (placeId: string): Review[] => {
        return state.reviewsByPlace[placeId] || [];
      };
    },

    getRatingStats: (state) => {
      return (placeId: string, baseRating = 4.7, baseCount = 100) => {
        const localReviews = state.reviewsByPlace[placeId] || [];
        const totalReviewsCount = baseCount + localReviews.length;

        // Compute distribution
        const counts = [0, 0, 0, 0, 0]; // 1-star, 2-star, 3-star, 4-star, 5-star

        // Base distribution approximation
        counts[4] = Math.round(baseCount * 0.75); // 5-star
        counts[3] = Math.round(baseCount * 0.16); // 4-star
        counts[2] = Math.round(baseCount * 0.06); // 3-star
        counts[1] = Math.round(baseCount * 0.02); // 2-star
        counts[0] = Math.round(baseCount * 0.01); // 1-star

        // Add local reviews
        localReviews.forEach(r => {
          const idx = Math.min(5, Math.max(1, Math.round(r.rating))) - 1;
          counts[idx]++;
        });

        const totalCalculated = counts.reduce((a, b) => a + b, 0);
        const percentages = counts.map(c => Math.round((c / Math.max(1, totalCalculated)) * 100));

        let localSum = localReviews.reduce((acc, r) => acc + r.rating, 0);
        const weightedAvg = (baseRating * baseCount + localSum) / Math.max(1, baseCount + localReviews.length);

        return {
          averageRating: Math.round(weightedAvg * 10) / 10,
          totalCount: totalReviewsCount,
          percentages: {
            star5: percentages[4],
            star4: percentages[3],
            star3: percentages[2],
            star2: percentages[1],
            star1: percentages[0],
          },
        };
      };
    },
  },

  actions: {
    addReview(placeId: string, rating: number, comment: string, userName: string, userId?: string) {
      if (!this.reviewsByPlace[placeId]) {
        this.reviewsByPlace[placeId] = [];
      }

      const todayStr = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date());

      const newReview: Review = {
        id: 'rev-' + Date.now(),
        placeId,
        userName: userName || 'Penjelajah Semarang',
        rating,
        comment,
        date: todayStr,
        userId: userId || 'local-guest',
        isLocalUser: true,
      };

      this.reviewsByPlace[placeId].unshift(newReview);
      const notification = useNotificationStore();
      notification.showToast('Ulasanmu berhasil dipublikasikan!');
    },

    deleteReview(placeId: string, reviewId: string) {
      if (this.reviewsByPlace[placeId]) {
        this.reviewsByPlace[placeId] = this.reviewsByPlace[placeId].filter(r => r.id !== reviewId);
        const notification = useNotificationStore();
        notification.showToast('Ulasan berhasil dihapus', 'info');
      }
    },
  },

  persist: {
    storage: localStorage,
  },
});
