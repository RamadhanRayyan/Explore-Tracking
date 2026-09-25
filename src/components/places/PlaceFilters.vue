<script setup lang="ts">
import { computed } from 'vue';
import { usePlacesStore, type BudgetFilterType, type SortOptionType } from '@/stores/places.store';
import { CATEGORIES } from '@/data/categories';
import type { PlaceCategory } from '@/types';
import { RotateCcw, X, SlidersHorizontal, Check } from 'lucide-vue-next';

defineProps<{
  isMobileDrawer?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const placesStore = usePlacesStore();

const budgetOptions: { label: string; value: BudgetFilterType }[] = [
  { label: 'Semua Budget', value: 'all' },
  { label: '< Rp25K', value: 'under25' },
  { label: 'Rp25K - Rp50K', value: '25to50' },
  { label: 'Rp50K - Rp100K', value: '50to100' },
  { label: 'Rp100K+', value: 'over100' },
];

const ratingOptions = [
  { label: 'Semua Rating', value: 0 },
  { label: '⭐ 4.5 ke atas', value: 4.5 },
  { label: '⭐ 4.0 ke atas', value: 4.0 },
  { label: '⭐ 3.5 ke atas', value: 3.5 },
];

const sortOptions: { label: string; value: SortOptionType }[] = [
  { label: 'Rekomendasi', value: 'recommended' },
  { label: 'Rating Tertinggi', value: 'rating' },
  { label: 'Paling Populer', value: 'popular' },
  { label: 'Paling Hemat', value: 'cheapest' },
  { label: 'Terdekat', value: 'nearest' },
];

const hasActiveFilters = computed(() => {
  return (
    placesStore.selectedCategory !== 'All' ||
    placesStore.selectedBudget !== 'all' ||
    placesStore.selectedMinRating > 0 ||
    placesStore.selectedDistrict !== 'All' ||
    placesStore.openNowOnly ||
    placesStore.sortBy !== 'recommended'
  );
});

const handleReset = () => {
  placesStore.resetFilters();
};
</script>

<template>
  <div
    :class="[
      'flex flex-col bg-white dark:bg-zinc-900',
      isMobileDrawer
        ? 'p-6 max-h-[85vh] overflow-y-auto'
        : 'p-5 rounded-2xl border border-stone-200/80 dark:border-zinc-800 shadow-xs'
    ]"
  >
    <!-- Header -->
    <div class="flex items-center justify-between pb-4 mb-5 border-b border-stone-100 dark:border-zinc-800">
      <div class="flex items-center gap-2">
        <SlidersHorizontal class="w-4 h-4 text-teal-600 dark:text-teal-400" />
        <h3 class="font-display font-bold text-base text-stone-900 dark:text-zinc-100">
          Filter Tempat
        </h3>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="hasActiveFilters"
          @click="handleReset"
          class="flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
        >
          <RotateCcw class="w-3 h-3" />
          Reset
        </button>

        <button
          v-if="isMobileDrawer"
          @click="emit('close')"
          class="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-zinc-200 rounded-lg"
          aria-label="Tutup filter"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Sort By -->
      <div>
        <label class="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-2.5">
          Urutkan
        </label>
        <div class="grid grid-cols-2 gap-1.5">
          <button
            v-for="opt in sortOptions"
            :key="opt.value"
            type="button"
            @click="placesStore.setSortBy(opt.value)"
            :class="[
              'px-3 py-2 text-xs font-medium rounded-xl text-left transition-all truncate',
              placesStore.sortBy === opt.value
                ? 'bg-teal-600 text-white font-semibold shadow-xs'
                : 'bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-700'
            ]"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- Category Filter -->
      <div>
        <label class="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-2.5">
          Kategori Mood
        </label>
        <div class="flex flex-wrap gap-1.5">
          <button
            type="button"
            @click="placesStore.setCategory('All')"
            :class="[
              'px-3 py-1.5 text-xs font-medium rounded-xl transition-all',
              placesStore.selectedCategory === 'All'
                ? 'bg-stone-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold'
                : 'bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100'
            ]"
          >
            Semua
          </button>

          <button
            v-for="cat in CATEGORIES"
            :key="cat.id"
            type="button"
            @click="placesStore.setCategory(cat.name)"
            :class="[
              'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl transition-all',
              placesStore.selectedCategory === cat.name
                ? 'bg-teal-600 text-white font-semibold shadow-xs'
                : 'bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100'
            ]"
          >
            <span>{{ cat.emoji }}</span>
            <span>{{ cat.name }}</span>
          </button>
        </div>
      </div>

      <!-- Budget Range Filter -->
      <div>
        <label class="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-2.5">
          Rentang Budget
        </label>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="b in budgetOptions"
            :key="b.value"
            type="button"
            @click="placesStore.setBudget(b.value)"
            :class="[
              'px-3 py-1.5 text-xs font-medium rounded-xl transition-all',
              placesStore.selectedBudget === b.value
                ? 'bg-teal-600 text-white font-semibold shadow-xs'
                : 'bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100'
            ]"
          >
            {{ b.label }}
          </button>
        </div>
      </div>

      <!-- Min Rating Filter -->
      <div>
        <label class="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-2.5">
          Minimal Rating
        </label>
        <div class="grid grid-cols-2 gap-1.5">
          <button
            v-for="r in ratingOptions"
            :key="r.value"
            type="button"
            @click="placesStore.setMinRating(r.value)"
            :class="[
              'px-3 py-1.5 text-xs font-medium rounded-xl text-left transition-all',
              placesStore.selectedMinRating === r.value
                ? 'bg-teal-600 text-white font-semibold shadow-xs'
                : 'bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100'
            ]"
          >
            {{ r.label }}
          </button>
        </div>
      </div>

      <!-- District Selector -->
      <div>
        <label class="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-2.5">
          Kecamatan / Wilayah
        </label>
        <select
          v-model="placesStore.selectedDistrict"
          class="w-full px-3 py-2 bg-stone-100 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-xs font-medium text-stone-800 dark:text-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
        >
          <option value="All">Semua Wilayah Semarang</option>
          <option v-for="d in placesStore.districts" :key="d" :value="d">
            {{ d }}
          </option>
        </select>
      </div>

      <!-- Open Now Toggle -->
      <div class="pt-2">
        <label class="flex items-center justify-between cursor-pointer select-none">
          <span class="text-xs font-semibold text-stone-800 dark:text-zinc-200">
            Buka Sekarang Saja
          </span>
          <input
            v-model="placesStore.openNowOnly"
            type="checkbox"
            class="sr-only peer"
          />
          <div
            class="w-10 h-6 bg-stone-200 peer-focus:outline-hidden rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-teal-600 relative"
          />
        </label>
      </div>

      <!-- Mobile Apply CTA -->
      <div v-if="isMobileDrawer" class="pt-4">
        <button
          type="button"
          @click="emit('close')"
          class="w-full py-3 rounded-xl bg-teal-600 text-white font-semibold text-sm shadow-xs flex items-center justify-center gap-2"
        >
          <Check class="w-4 h-4" />
          Terapkan Filter ({{ placesStore.filteredPlaces.length }} Tempat)
        </button>
      </div>
    </div>
  </div>
</template>
