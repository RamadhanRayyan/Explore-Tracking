<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePlacesStore } from '@/stores/places.store';
import PlaceCard from '@/components/places/PlaceCard.vue';
import PlaceFilters from '@/components/places/PlaceFilters.vue';
import SearchBar from '@/components/common/SearchBar.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import { SlidersHorizontal, MapPin, SearchX, RotateCcw } from 'lucide-vue-next';

const route = useRoute();
const placesStore = usePlacesStore();

const isMobileFilterOpen = ref(false);

onMounted(() => {
  if (route.query.q) {
    placesStore.setSearchQuery(String(route.query.q));
  }
  if (route.query.category) {
    placesStore.setCategory(route.query.category as any);
  }
});

watch(
  () => route.query.q,
  (newQ) => {
    if (newQ !== undefined) {
      placesStore.setSearchQuery(String(newQ));
    }
  }
);
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header & Top Search -->
    <div class="space-y-4">
      <div>
        <h1 class="font-display font-extrabold text-3xl sm:text-4xl text-stone-900 dark:text-zinc-50 tracking-tight">
          Temukan tempat favoritmu.
        </h1>
        <p class="text-sm text-stone-500 dark:text-zinc-400 mt-1">
          Jelajahi {{ placesStore.allPlaces.length }} destinasi pilihan di seluruh penjuru kota Semarang.
        </p>
      </div>

      <!-- Search & Mobile Filter Toggle -->
      <div class="flex items-center gap-3">
        <div class="flex-1">
          <SearchBar
            v-model="placesStore.searchQuery"
            placeholder="Cari berdasarkan nama, kategori, kecamatan, atau tag..."
          />
        </div>

        <button
          type="button"
          @click="isMobileFilterOpen = true"
          class="lg:hidden flex items-center gap-2 px-4 py-3.5 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl text-xs font-semibold text-stone-800 dark:text-zinc-200 shadow-xs"
        >
          <SlidersHorizontal class="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Filter</span>
        </button>
      </div>
    </div>

    <!-- Main Content Layout (Sidebar + Grid) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Desktop Sidebar Filter (3 cols) -->
      <aside class="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-24">
        <PlaceFilters />
      </aside>

      <!-- Main Places Grid (9 cols) -->
      <main class="lg:col-span-8 xl:col-span-9 space-y-6">
        <!-- Results Counter & Active Category Badge -->
        <div class="flex items-center justify-between text-xs text-stone-500 dark:text-zinc-400">
          <span>
            Menampilkan <strong class="text-stone-900 dark:text-zinc-100">{{ placesStore.filteredPlaces.length }}</strong> tempat
          </span>

          <span v-if="placesStore.selectedCategory !== 'All'" class="font-medium text-teal-600 dark:text-teal-400">
            Kategori: {{ placesStore.selectedCategory }}
          </span>
        </div>

        <!-- Place Cards Grid -->
        <div
          v-if="placesStore.filteredPlaces.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <PlaceCard
            v-for="place in placesStore.filteredPlaces"
            :key="place.id"
            :place="place"
          />
        </div>

        <!-- Empty State if no match -->
        <div v-else class="bg-white dark:bg-zinc-900 rounded-3xl border border-stone-200/80 dark:border-zinc-800 p-12">
          <EmptyState
            :icon="SearchX"
            title="Tempat yang kamu cari belum ditemukan."
            description="Tidak ada tempat yang cocok dengan kombinasi filter dan kata kunci pencarianmu saat ini."
            action-label="Reset Semua Filter"
            @action="placesStore.resetFilters"
          />
        </div>
      </main>
    </div>

    <!-- Mobile Filter Bottom Sheet / Modal -->
    <Teleport to="body">
      <div
        v-if="isMobileFilterOpen"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs"
        @click.self="isMobileFilterOpen = false"
      >
        <div
          class="w-full sm:max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
        >
          <PlaceFilters
            :is-mobile-drawer="true"
            @close="isMobileFilterOpen = false"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>
