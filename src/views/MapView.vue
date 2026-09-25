<script setup lang="ts">
import ExploreMap from '@/components/map/ExploreMap.vue';
import { Map, Info } from 'lucide-vue-next';
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
    <!-- Map Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h1 class="font-display font-extrabold text-2xl sm:text-3xl text-stone-900 dark:text-zinc-50 tracking-tight flex items-center gap-2.5">
          <Map class="w-6 h-6 text-teal-600 dark:text-teal-400" />
          <span>Peta Interaktif Semarang</span>
        </h1>
        <p class="text-xs sm:text-sm text-stone-500 dark:text-zinc-400 mt-0.5">
          Jelajahi sebaran tempat wisata, cafe, dan kuliner langsung di atas peta kota.
        </p>
      </div>

      <div class="flex items-center gap-2 text-xs text-stone-500 dark:text-zinc-400 bg-stone-100 dark:bg-zinc-800/80 px-3 py-1.5 rounded-xl border border-stone-200/60 dark:border-zinc-700/60">
        <Info class="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
        <span>Klik marker untuk info singkat & rute</span>
      </div>
    </div>

    <!-- Map Component (near full screen) -->
    <div class="w-full">
      <ExploreMap
        height-class="h-[calc(100vh-230px)] min-h-[500px]"
        :show-category-filters="true"
      />
    </div>
  </div>
</template>
