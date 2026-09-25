<script setup lang="ts">
import { useRouter } from 'vue-router';
import { usePlacesStore } from '@/stores/places.store';
import { CATEGORIES } from '@/data/categories';
import type { PlaceCategory } from '@/types';
import SearchBar from '@/components/common/SearchBar.vue';
import PlaceCard from '@/components/places/PlaceCard.vue';
import SafeImage from '@/components/common/SafeImage.vue';
import {
  Compass,
  Sparkles,
  Route,
  ArrowRight,
  MapPin,
  Calendar,
  Heart,
  ChevronRight,
} from 'lucide-vue-next';

const router = useRouter();
const placesStore = usePlacesStore();

const handleSelectCategory = (catName: PlaceCategory) => {
  placesStore.setCategory(catName);
  router.push('/explore');
};

const handleSearch = (query: string) => {
  placesStore.setSearchQuery(query);
  router.push('/explore');
};
</script>

<template>
  <div class="space-y-16 sm:space-y-24 pb-12">
    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-6 sm:pt-12">
      <!-- Background subtle atmospheric decorative elements -->
      <div
        class="absolute -top-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"
      />
      <div
        class="absolute top-1/2 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"
      />

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <!-- Hero Text & Search Column -->
          <div class="lg:col-span-7 space-y-6 sm:space-y-8">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-900/60 text-teal-800 dark:text-teal-300 text-xs font-semibold">
              <Sparkles class="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Smart Travel Companion Kota Semarang</span>
            </div>

            <h1
              class="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-stone-900 dark:text-zinc-50 tracking-tight leading-[1.1] text-balance"
            >
              Jelajahi Semarang,<br />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400">
                dengan caramu.
              </span>
            </h1>

            <p class="text-base sm:text-lg text-stone-600 dark:text-zinc-300 max-w-xl leading-relaxed">
              Temukan tempat menarik, kuliner legendaris, spot foto tersembunyi, dan susun perjalanan otomatis sesuai budget serta waktumu.
            </p>

            <!-- Search Bar Component -->
            <div class="max-w-xl">
              <span class="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400 mb-2">
                Ke mana kamu ingin pergi?
              </span>
              <SearchBar
                placeholder="Cari tempat, kuliner, atau aktivitas..."
                @search="handleSearch"
                :auto-navigate="true"
              />
            </div>

            <!-- Quick Trust metrics -->
            <div class="flex flex-wrap items-center gap-6 pt-2 text-xs text-stone-500 dark:text-zinc-400">
              <div class="flex items-center gap-2">
                <span class="font-bold text-stone-900 dark:text-zinc-100 text-sm tabular-nums">30+</span>
                <span>Destinasi Terkurasi</span>
              </div>
              <span aria-hidden="true" class="text-stone-300 dark:text-zinc-700">·</span>
              <div class="flex items-center gap-2">
                <span class="font-bold text-stone-900 dark:text-zinc-100 text-sm tabular-nums">100%</span>
                <span>Client-Side & Offline Ready</span>
              </div>
              <span aria-hidden="true" class="text-stone-300 dark:text-zinc-700">·</span>
              <div class="flex items-center gap-2">
                <span class="font-bold text-stone-900 dark:text-zinc-100 text-sm tabular-nums">Instant</span>
                <span>Algoritma Rute Otomatis</span>
              </div>
            </div>
          </div>

          <!-- Hero Media Card Column -->
          <div class="lg:col-span-5 relative">
            <div
              class="relative rounded-3xl overflow-hidden border border-stone-200/90 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-900 p-2 sm:p-3"
            >
              <div class="aspect-4/3 sm:aspect-5/4 rounded-2xl overflow-hidden relative group">
                <SafeImage
                  src="https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1000&q=80"
                  alt="Kota Lama Semarang"
                  category="Heritage"
                  aspect-ratio="aspect-4/3 sm:aspect-5/4"
                  container-class="w-full h-full"
                />

                <!-- Floating badge on photo -->
                <div class="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-stone-900/85 backdrop-blur-md text-white border border-white/10 shadow-lg">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-[11px] font-semibold text-teal-300 uppercase tracking-wider">
                      Featured Destination
                    </span>
                    <span class="text-xs font-bold text-amber-400">⭐ 4.8</span>
                  </div>
                  <h3 class="font-display font-bold text-base text-white">
                    Kota Lama Semarang
                  </h3>
                  <p class="text-xs text-stone-300 line-clamp-1 mt-0.5">
                    "Little Netherland" peninggalan abad ke-18 dengan jalan pedestrian berbatu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Category: "Explore by mood" -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="font-display font-bold text-2xl text-stone-900 dark:text-zinc-100 tracking-tight">
            Explore by mood
          </h2>
          <p class="text-xs sm:text-sm text-stone-500 dark:text-zinc-400 mt-0.5">
            Pilih suasana petualangan yang kamu cari hari ini
          </p>
        </div>

        <RouterLink
          to="/explore"
          class="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center gap-1"
        >
          <span>Lihat Semua</span>
          <ChevronRight class="w-4 h-4" />
        </RouterLink>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <button
          v-for="cat in CATEGORIES"
          :key="cat.id"
          type="button"
          @click="handleSelectCategory(cat.name)"
          class="group p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 hover:border-teal-500/50 hover:shadow-md transition-all flex flex-col items-center justify-center text-center focus-visible:outline-teal-500"
        >
          <span class="text-3xl mb-2 group-hover:scale-110 transition-transform">
            {{ cat.emoji }}
          </span>
          <span class="text-xs font-bold text-stone-800 dark:text-zinc-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {{ cat.name }}
          </span>
        </button>
      </div>
    </section>

    <!-- Featured Places: "Tempat yang lagi menarik" -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="font-display font-bold text-2xl text-stone-900 dark:text-zinc-100 tracking-tight">
            Tempat yang lagi menarik
          </h2>
          <p class="text-xs sm:text-sm text-stone-500 dark:text-zinc-400 mt-0.5">
            Destinasi paling digemari wisatawan lokal maupun mancanegara
          </p>
        </div>

        <RouterLink
          to="/explore"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 dark:border-zinc-800 text-xs font-semibold hover:border-teal-500 text-stone-700 dark:text-zinc-300 transition-colors"
        >
          <span>Semua Tempat</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </RouterLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <PlaceCard
          v-for="place in placesStore.featuredPlaces"
          :key="place.id"
          :place="place"
        />
      </div>
    </section>

    <!-- Big Home CTA Section (Requirement 42) -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="relative rounded-3xl overflow-hidden bg-gradient-to-r from-teal-900 via-stone-900 to-zinc-950 p-8 sm:p-12 text-white shadow-xl"
      >
        <div class="relative z-10 max-w-2xl space-y-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-teal-300 text-xs font-semibold">
            <Route class="w-3.5 h-3.5" />
            <span>Interactive Itinerary Engine</span>
          </div>

          <h3 class="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-white leading-tight">
            Bingung mau ke mana?<br />
            Beri tahu kami budget dan waktumu.
          </h3>

          <p class="text-sm sm:text-base text-stone-300 leading-relaxed max-w-lg">
            Sistem kami akan menghitung kombinasi tempat, estimasi biaya tiket dan kuliner, serta rute efisien tanpa melebihi kantongmu.
          </p>

          <div class="pt-4 flex flex-wrap items-center gap-4">
            <RouterLink
              to="/planner"
              class="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold text-sm shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
            >
              <span>Plan My Trip Sekarang</span>
              <ArrowRight class="w-4 h-4 stroke-[2.2]" />
            </RouterLink>

            <RouterLink
              to="/map"
              class="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md transition-colors"
            >
              <Compass class="w-4 h-4" />
              <span>Buka Peta Interaktif</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Smart Recommendation Section (Requirement 43) -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <div class="flex items-center gap-2">
            <Sparkles class="w-4 h-4 text-amber-500" />
            <h2 class="font-display font-bold text-2xl text-stone-900 dark:text-zinc-100 tracking-tight">
              Recommended for you
            </h2>
          </div>
          <p class="text-xs sm:text-sm text-stone-500 dark:text-zinc-400 mt-0.5">
            Disesuaikan berdasarkan reputasi tempat dan preferensi aktivitasmu
          </p>
        </div>

        <RouterLink
          to="/explore"
          class="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
        >
          Lihat lainnya
        </RouterLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <PlaceCard
          v-for="place in placesStore.smartRecommendedPlaces"
          :key="place.id"
          :place="place"
        />
      </div>
    </section>
  </div>
</template>
