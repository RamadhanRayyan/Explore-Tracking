<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useBookmarkStore } from '@/stores/bookmark.store';
import { useTripStore } from '@/stores/trip.store';
import { usePlacesStore } from '@/stores/places.store';
import PlaceCard from '@/components/places/PlaceCard.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDurationHuman } from '@/utils/time';
import {
  Heart,
  Route,
  Clock,
  Coins,
  MapPin,
  Trash2,
  ArrowRight,
  Compass,
} from 'lucide-vue-next';

const router = useRouter();
const bookmarkStore = useBookmarkStore();
const tripStore = useTripStore();
const placesStore = usePlacesStore();

const activeTab = ref<'places' | 'trips'>('places');

const bookmarkedPlaces = computed(() => {
  return placesStore.allPlaces.filter(p => bookmarkStore.isBookmarked(p.id));
});

const savedTrips = computed(() => tripStore.savedTrips);

const navigateToTrip = (id: string) => {
  router.push(`/trips/${id}`);
};

const handleDeleteTrip = (e: Event, id: string) => {
  e.stopPropagation();
  tripStore.deleteTrip(id);
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header -->
    <div class="space-y-1">
      <h1 class="font-display font-extrabold text-3xl sm:text-4xl text-stone-900 dark:text-zinc-50 tracking-tight">
        Koleksi Tersimpan
      </h1>
      <p class="text-sm text-stone-500 dark:text-zinc-400">
        Daftar destinasi favorit dan rencana perjalanan yang telah kamu simpan di peramban ini.
      </p>
    </div>

    <!-- Segmented Tabs per Frontend Design Constitution -->
    <div class="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-zinc-800/80 rounded-2xl w-fit border border-stone-200/60 dark:border-zinc-700/60">
      <button
        type="button"
        @click="activeTab = 'places'"
        :class="[
          'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all',
          activeTab === 'places'
            ? 'bg-white dark:bg-zinc-900 text-stone-900 dark:text-zinc-100 shadow-xs'
            : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100'
        ]"
      >
        <Heart class="w-4 h-4 text-rose-500" />
        <span>Tempat Favorit ({{ bookmarkedPlaces.length }})</span>
      </button>

      <button
        type="button"
        @click="activeTab = 'trips'"
        :class="[
          'flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all',
          activeTab === 'trips'
            ? 'bg-white dark:bg-zinc-900 text-stone-900 dark:text-zinc-100 shadow-xs'
            : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100'
        ]"
      >
        <Route class="w-4 h-4 text-teal-600 dark:text-teal-400" />
        <span>Rencana Perjalanan ({{ savedTrips.length }})</span>
      </button>
    </div>

    <!-- Tab 1: Bookmarked Places -->
    <div v-if="activeTab === 'places'">
      <div
        v-if="bookmarkedPlaces.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <PlaceCard
          v-for="p in bookmarkedPlaces"
          :key="p.id"
          :place="p"
        />
      </div>

      <div v-else class="bg-white dark:bg-zinc-900 rounded-3xl border border-stone-200/80 dark:border-zinc-800 p-12">
        <EmptyState
          :icon="Heart"
          title="Belum ada tempat tersimpan."
          description="Kamu belum menandai tempat favorit. Jelajahi katalog tempat Semarang dan klik ikon hati untuk menyimpan destinasi impianmu."
          action-label="Mulai Eksplorasi Tempat"
          action-route="/explore"
        />
      </div>
    </div>

    <!-- Tab 2: Saved Trips -->
    <div v-else-if="activeTab === 'trips'">
      <div
        v-if="savedTrips.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="trip in savedTrips"
          :key="trip.id"
          @click="navigateToTrip(trip.id)"
          class="group cursor-pointer bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-start justify-between gap-3 mb-3">
              <span class="text-[11px] font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Disimpan {{ trip.createdAt }}
              </span>

              <button
                type="button"
                @click="handleDeleteTrip($event, trip.id)"
                class="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg transition-colors"
                title="Hapus trip"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>

            <h3 class="font-display font-bold text-lg text-stone-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors mb-2">
              {{ trip.title }}
            </h3>

            <!-- Stops overview -->
            <div class="flex flex-wrap gap-1 mb-4">
              <span
                v-for="item in trip.items.slice(0, 3)"
                :key="item.place.id"
                class="text-[11px] text-stone-600 dark:text-zinc-400"
              >
                {{ item.place.name }} ·
              </span>
              <span v-if="trip.items.length > 3" class="text-[11px] text-stone-400">
                +{{ trip.items.length - 3 }} lainnya
              </span>
            </div>
          </div>

          <!-- Trip Stats -->
          <div class="pt-4 border-t border-stone-100 dark:border-zinc-800/80 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span class="text-[10px] text-stone-400 block uppercase font-medium">Biaya</span>
              <span class="font-bold text-stone-900 dark:text-zinc-100 tabular-nums">
                {{ formatCurrency(trip.totalCost) }}
              </span>
            </div>
            <div>
              <span class="text-[10px] text-stone-400 block uppercase font-medium">Durasi</span>
              <span class="font-bold text-stone-900 dark:text-zinc-100 tabular-nums">
                {{ formatDurationHuman(trip.totalDurationMinutes) }}
              </span>
            </div>
            <div>
              <span class="text-[10px] text-stone-400 block uppercase font-medium">Destinasi</span>
              <span class="font-bold text-stone-900 dark:text-zinc-100 tabular-nums">
                {{ trip.items.length }} Tempat
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white dark:bg-zinc-900 rounded-3xl border border-stone-200/80 dark:border-zinc-800 p-12">
        <EmptyState
          :icon="Route"
          title="Belum ada rencana perjalanan."
          description="Kamu belum memiliki trip tersimpan. Gunakan Trip Planner untuk menyusun rute otomatis sesuai budgetmu lalu simpan ke sini."
          action-label="Susun Perjalanan Sekarang"
          action-route="/planner"
        />
      </div>
    </div>
  </div>
</template>
