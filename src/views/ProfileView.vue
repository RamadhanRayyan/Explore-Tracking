<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { useBookmarkStore } from '@/stores/bookmark.store';
import { useTripStore } from '@/stores/trip.store';
import { useReviewStore } from '@/stores/review.store';
import { usePlannerStore } from '@/stores/planner.store';
import { usePlacesStore } from '@/stores/places.store';
import { useNotificationStore } from '@/stores/notification.store';
import ConfirmModal from '@/components/common/ConfirmModal.vue';
import { CATEGORIES } from '@/data/categories';
import type { PlaceCategory, TransportMode } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';
import {
  User,
  Heart,
  Route,
  MessageSquare,
  Sliders,
  Trash2,
  RotateCcw,
  LogOut,
  LogIn,
  Check,
  ShieldCheck,
} from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const bookmarkStore = useBookmarkStore();
const tripStore = useTripStore();
const reviewStore = useReviewStore();
const plannerStore = usePlannerStore();
const placesStore = usePlacesStore();
const notification = useNotificationStore();

const showClearModal = ref(false);
const showResetPlannerModal = ref(false);

const user = computed(() => authStore.currentUser);

const totalUserReviews = computed(() => {
  let count = 0;
  Object.values(reviewStore.reviewsByPlace).forEach(list => {
    count += list.filter(r => r.isLocalUser).length;
  });
  return count;
});

const defaultTransports: { mode: TransportMode; label: string }[] = [
  { mode: 'motor', label: 'Sepeda Motor' },
  { mode: 'mobil', label: 'Mobil Pribadi' },
  { mode: 'jalan', label: 'Jalan Kaki' },
  { mode: 'public', label: 'Trans Semarang' },
];

const handleSavePreferences = (field: string, value: any) => {
  authStore.updatePreferences({ [field]: value });
  notification.showToast('Preferensi diperbarui.');
};

const togglePreferredCategory = (catName: PlaceCategory) => {
  const current = [...authStore.userPreferences.preferredCategories];
  const idx = current.indexOf(catName);
  if (idx !== -1) {
    if (current.length > 1) current.splice(idx, 1);
  } else {
    current.push(catName);
  }
  handleSavePreferences('preferredCategories', current);
};

const handleClearPlanner = () => {
  plannerStore.clearPlanner();
  showResetPlannerModal.value = false;
  notification.showToast('Data sementara planner berhasil dibersihkan.');
};

const handleClearAllData = () => {
  bookmarkStore.clearAllBookmarks();
  tripStore.clearAllTrips();
  plannerStore.clearPlanner();
  placesStore.resetToDemoData();
  showClearModal.value = false;
  notification.showToast('Semua data lokal aplikasi berhasil direset.', 'info');
};

const handleLogout = () => {
  authStore.logout();
  notification.showToast('Kamu telah keluar dari akun demo.', 'info');
  router.push('/');
};
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header -->
    <div class="space-y-1">
      <h1 class="font-display font-extrabold text-3xl sm:text-4xl text-stone-900 dark:text-zinc-50 tracking-tight">
        Profil & Preferensi
      </h1>
      <p class="text-sm text-stone-500 dark:text-zinc-400">
        Kelola preferensi petualangan, lihat ringkasan aktivitas, dan atur penyimpanan lokal aplikasi.
      </p>
    </div>

    <!-- User Card -->
    <div
      class="p-6 sm:p-8 bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 rounded-3xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6"
    >
      <div class="flex items-center gap-4">
        <div
          class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white font-black text-2xl flex items-center justify-center shadow-md uppercase"
        >
          {{ user ? user.name.charAt(0) : 'G' }}
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h2 class="font-display font-bold text-xl text-stone-900 dark:text-zinc-100">
              {{ user ? user.name : 'Penjelajah Tamu (Guest)' }}
            </h2>
            <span class="px-2 py-0.5 text-[10px] font-semibold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 rounded-md">
              Demo User
            </span>
          </div>
          <p class="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
            {{ user ? user.email : 'Belum masuk akun. Data tersimpan di peramban ini.' }}
          </p>
        </div>
      </div>

      <!-- Auth Action -->
      <div class="flex items-center gap-3">
        <RouterLink
          v-if="!user"
          to="/login"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <LogIn class="w-4 h-4" />
          <span>Masuk / Daftar Akun</span>
        </RouterLink>

        <button
          v-else
          type="button"
          @click="handleLogout"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-700 dark:text-zinc-300 text-xs font-semibold transition-colors"
        >
          <LogOut class="w-4 h-4" />
          <span>Keluar</span>
        </button>
      </div>
    </div>

    <!-- Stats 3-Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <RouterLink
        to="/saved"
        class="p-5 bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 rounded-2xl shadow-xs hover:border-teal-500/50 transition-colors flex items-center gap-4"
      >
        <div class="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 flex items-center justify-center">
          <Heart class="w-6 h-6 fill-current" />
        </div>
        <div>
          <span class="font-display font-extrabold text-2xl text-stone-900 dark:text-zinc-100 tabular-nums block">
            {{ bookmarkStore.count }}
          </span>
          <span class="text-xs text-stone-500 dark:text-zinc-400">Tempat Favorit</span>
        </div>
      </RouterLink>

      <RouterLink
        to="/trips"
        class="p-5 bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 rounded-2xl shadow-xs hover:border-teal-500/50 transition-colors flex items-center gap-4"
      >
        <div class="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center">
          <Route class="w-6 h-6" />
        </div>
        <div>
          <span class="font-display font-extrabold text-2xl text-stone-900 dark:text-zinc-100 tabular-nums block">
            {{ tripStore.count }}
          </span>
          <span class="text-xs text-stone-500 dark:text-zinc-400">Rencana Disimpan</span>
        </div>
      </RouterLink>

      <div class="p-5 bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 rounded-2xl shadow-xs flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center">
          <MessageSquare class="w-6 h-6" />
        </div>
        <div>
          <span class="font-display font-extrabold text-2xl text-stone-900 dark:text-zinc-100 tabular-nums block">
            {{ totalUserReviews }}
          </span>
          <span class="text-xs text-stone-500 dark:text-zinc-400">Ulasan Lokal</span>
        </div>
      </div>
    </div>

    <!-- Travel Preferences Form -->
    <div class="p-6 sm:p-8 bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 rounded-3xl shadow-xs space-y-6">
      <div class="flex items-center gap-2 pb-4 border-b border-stone-100 dark:border-zinc-800">
        <Sliders class="w-5 h-5 text-teal-600 dark:text-teal-400" />
        <h3 class="font-display font-bold text-lg text-stone-900 dark:text-zinc-100">
          Preferensi Perjalanan Default
        </h3>
      </div>

      <!-- Default Transport -->
      <div>
        <label class="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-2">
          Moda Transportasi Utama
        </label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            v-for="t in defaultTransports"
            :key="t.mode"
            type="button"
            @click="handleSavePreferences('defaultTransport', t.mode)"
            :class="[
              'px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left',
              authStore.userPreferences.defaultTransport === t.mode
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-stone-200'
            ]"
          >
            {{ t.label }}
          </button>
        </div>
      </div>

      <!-- Preferred Categories -->
      <div>
        <label class="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-2">
          Kategori Favorit
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in CATEGORIES"
            :key="cat.id"
            type="button"
            @click="togglePreferredCategory(cat.name)"
            :class="[
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
              authStore.userPreferences.preferredCategories.includes(cat.name)
                ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500 shadow-2xs'
                : 'bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400'
            ]"
          >
            <span>{{ cat.emoji }}</span>
            <span>{{ cat.name }}</span>
            <Check v-if="authStore.userPreferences.preferredCategories.includes(cat.name)" class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Default Budget -->
      <div>
        <label class="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-2">
          Budget Acuan Harian ({{ formatCurrency(authStore.userPreferences.budgetPreference) }})
        </label>
        <input
          type="range"
          min="50000"
          max="500000"
          step="25000"
          :value="authStore.userPreferences.budgetPreference"
          @input="handleSavePreferences('budgetPreference', Number(($event.target as HTMLInputElement).value))"
          class="w-full accent-teal-600 h-2 bg-stone-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
        />
      </div>
    </div>

    <!-- Storage Management & Data Wipe Actions -->
    <div class="p-6 sm:p-8 bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 rounded-3xl shadow-xs space-y-4">
      <h3 class="font-display font-bold text-lg text-stone-900 dark:text-zinc-100">
        Penyimpanan & Manajemen Data Lokal
      </h3>
      <p class="text-xs text-stone-500 dark:text-zinc-400 leading-relaxed">
        Seluruh data favorit, preferensi, riwayat pencarian, dan itinerary tersimpan di peramban lokal perangkatmu (localStorage & sessionStorage) tanpa server backend.
      </p>

      <div class="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="button"
          @click="showResetPlannerModal = true"
          class="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 hover:bg-stone-100 dark:hover:bg-zinc-800 text-stone-700 dark:text-zinc-300 text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <RotateCcw class="w-4 h-4 text-amber-500" />
          <span>Hapus Sesi Planner Sementara</span>
        </button>

        <button
          type="button"
          @click="showClearModal = true"
          class="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <Trash2 class="w-4 h-4" />
          <span>Reset Semua Data Aplikasi</span>
        </button>
      </div>
    </div>

    <!-- Confirm Modal for Reset Planner -->
    <ConfirmModal
      :show="showResetPlannerModal"
      title="Bersihkan Data Planner Sementara?"
      message="Ini akan menghapus form dan rute yang sedang kamu susun di sesi saat ini."
      confirm-text="Bersihkan"
      @confirm="handleClearPlanner"
      @cancel="showResetPlannerModal = false"
    />

    <!-- Confirm Modal for Wipe All Data -->
    <ConfirmModal
      :show="showClearModal"
      :is-destructive="true"
      title="Hapus Semua Data Aplikasi?"
      message="Tindakan ini akan menghapus semua bookmark tempat tersimpan, riwayat My Trips, dan mengembalikan data demo ke awal. Apakah kamu yakin?"
      confirm-text="Hapus Semua Data"
      @confirm="handleClearAllData"
      @cancel="showClearModal = false"
    />
  </div>
</template>
