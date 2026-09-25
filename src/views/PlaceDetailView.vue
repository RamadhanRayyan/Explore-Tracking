<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePlacesStore } from '@/stores/places.store';
import { useBookmarkStore } from '@/stores/bookmark.store';
import { usePlannerStore } from '@/stores/planner.store';
import { useNotificationStore } from '@/stores/notification.store';
import { formatPriceRange } from '@/utils/formatCurrency';
import { calculateHaversineDistance } from '@/utils/distance';
import PlaceGallery from '@/components/places/PlaceGallery.vue';
import PlaceReview from '@/components/places/PlaceReview.vue';
import PlaceCard from '@/components/places/PlaceCard.vue';
import ExploreMap from '@/components/map/ExploreMap.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import {
  MapPin,
  Star,
  Clock,
  Coins,
  Heart,
  Share2,
  CalendarPlus,
  Navigation,
  CheckCircle2,
  Tag,
  ArrowLeft,
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const placesStore = usePlacesStore();
const bookmarkStore = useBookmarkStore();
const plannerStore = usePlannerStore();
const notification = useNotificationStore();

const place = computed(() => {
  const slug = String(route.params.slug);
  return placesStore.getPlaceBySlug(slug);
});

const isBookmarked = computed(() => {
  return place.value ? bookmarkStore.isBookmarked(place.value.id) : false;
});

const formattedPrice = computed(() => {
  if (!place.value) return '';
  return formatPriceRange(place.value.priceMin, place.value.priceMax);
});

// Nearby places within Semarang calculated via Haversine distance
const nearbyPlaces = computed(() => {
  if (!place.value) return [];
  return placesStore.allPlaces
    .filter(p => p.id !== place.value!.id)
    .map(p => ({
      place: p,
      distance: calculateHaversineDistance(
        place.value!.latitude,
        place.value!.longitude,
        p.latitude,
        p.longitude
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map(item => item.place);
});

const handleToggleBookmark = () => {
  if (place.value) {
    bookmarkStore.toggleBookmark(place.value.id);
  }
};

const handleAddToPlanner = () => {
  if (place.value) {
    if (!plannerStore.input.interests.includes(place.value.category)) {
      plannerStore.input.interests.push(place.value.category);
    }
    notification.showToast(`Kategori ${place.value.category} ditambahkan ke preferensi Trip Planner.`);
    router.push('/planner');
  }
};

const handleShare = async () => {
  if (!place.value) return;

  const shareData = {
    title: place.value.name,
    text: `Temukan ${place.value.name} di Semarang: ${place.value.shortDescription}`,
    url: window.location.href,
  };

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
    } catch {
      // User cancelled
    }
  } else {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notification.showToast('Tautan tempat berhasil disalin ke clipboard!');
    } catch {
      notification.showToast('Tidak dapat menyalin tautan.', 'error');
    }
  }
};

const handleDirections = () => {
  if (!place.value) return;
  const url = `https://www.google.com/maps/dir/?api=1&destination=${place.value.latitude},${place.value.longitude}`;
  window.open(url, '_blank');
};
</script>

<template>
  <div v-if="place" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
    <!-- Back button & Breadcrumb -->
    <div>
      <button
        type="button"
        @click="router.back()"
        class="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Kembali ke daftar tempat</span>
      </button>
    </div>

    <!-- Gallery Section -->
    <PlaceGallery
      :images="place.gallery.length > 0 ? place.gallery : [place.image]"
      :place-name="place.name"
      :category="place.category"
    />

    <!-- Header & Action Row -->
    <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-stone-200/80 dark:border-zinc-800">
      <div class="space-y-3">
        <!-- Category & Demo indicator -->
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
            {{ place.category }}
          </span>
          <span class="text-xs text-stone-500 dark:text-zinc-400">
            {{ place.district }}
          </span>
          <span aria-hidden="true" class="text-stone-300 dark:text-zinc-700">·</span>
          <span class="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Data Demo
          </span>
        </div>

        <h1 class="font-display font-extrabold text-3xl sm:text-4xl text-stone-900 dark:text-zinc-50 tracking-tight">
          {{ place.name }}
        </h1>

        <!-- Rating & Location snippet -->
        <div class="flex flex-wrap items-center gap-4 text-xs text-stone-500 dark:text-zinc-400">
          <div class="flex items-center gap-1 text-amber-500 font-semibold">
            <Star class="w-4 h-4 fill-current" />
            <span class="text-sm font-bold">{{ place.rating.toFixed(1) }}</span>
            <span class="text-stone-400 dark:text-zinc-500 font-normal">
              ({{ place.reviewCount.toLocaleString() }} ulasan)
            </span>
          </div>

          <span aria-hidden="true" class="text-stone-300 dark:text-zinc-700">·</span>

          <div class="flex items-center gap-1">
            <MapPin class="w-4 h-4 text-stone-400" />
            <span class="line-clamp-1">{{ place.address }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center gap-2.5 shrink-0">
        <!-- Bookmark Button -->
        <button
          type="button"
          @click="handleToggleBookmark"
          :class="[
            'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold shadow-xs transition-all active:scale-95',
            isBookmarked
              ? 'bg-rose-500 text-white border-rose-500'
              : 'bg-white dark:bg-zinc-900 text-stone-800 dark:text-zinc-200 border-stone-200 dark:border-zinc-800 hover:border-rose-400'
          ]"
        >
          <Heart :class="['w-4 h-4', isBookmarked ? 'fill-current' : '']" />
          <span>{{ isBookmarked ? 'Tersimpan' : 'Simpan' }}</span>
        </button>

        <!-- Add to Planner Button -->
        <button
          type="button"
          @click="handleAddToPlanner"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <CalendarPlus class="w-4 h-4" />
          <span>+ Masukkan ke Trip</span>
        </button>

        <!-- Directions Button -->
        <button
          type="button"
          @click="handleDirections"
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-800 dark:text-zinc-200 text-xs font-semibold transition-colors"
        >
          <Navigation class="w-4 h-4" />
          <span>Petunjuk Arah</span>
        </button>

        <!-- Share Button -->
        <button
          type="button"
          @click="handleShare"
          class="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-stone-700 dark:text-zinc-300 transition-colors"
          aria-label="Bagikan tempat ini"
        >
          <Share2 class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Quick Specs Bar -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-stone-50 dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 rounded-2xl">
      <div>
        <span class="text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-zinc-500 block mb-0.5">
          Estimasi Biaya
        </span>
        <span class="font-bold text-sm sm:text-base text-stone-900 dark:text-zinc-100 tabular-nums">
          {{ formattedPrice }}
        </span>
      </div>

      <div>
        <span class="text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-zinc-500 block mb-0.5">
          Jam Buka
        </span>
        <span class="font-bold text-sm sm:text-base text-stone-900 dark:text-zinc-100">
          {{ place.openingHours.open }} - {{ place.openingHours.close }}
        </span>
      </div>

      <div>
        <span class="text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-zinc-500 block mb-0.5">
          Durasi Kunjungan
        </span>
        <span class="font-bold text-sm sm:text-base text-stone-900 dark:text-zinc-100">
          ~{{ place.averageVisitMinutes }} Menit
        </span>
      </div>

      <div>
        <span class="text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-zinc-500 block mb-0.5">
          Hari Operasional
        </span>
        <span class="font-bold text-sm sm:text-base text-stone-900 dark:text-zinc-100">
          {{ place.openingHours.days }}
        </span>
      </div>
    </div>

    <!-- Main Content & Sidebar -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      <!-- Left Column (Description, Why people like it, Facilities, Reviews) -->
      <div class="lg:col-span-8 space-y-10">
        <!-- Section: About this place -->
        <section class="space-y-3">
          <h3 class="font-display font-bold text-xl text-stone-900 dark:text-zinc-100">
            Tentang Tempat Ini
          </h3>
          <p class="text-sm sm:text-base text-stone-700 dark:text-zinc-300 leading-relaxed">
            {{ place.description }}
          </p>
        </section>

        <!-- Section: Why people like it -->
        <section v-if="place.whyPeopleLikeIt && place.whyPeopleLikeIt.length > 0" class="space-y-3">
          <h3 class="font-display font-bold text-xl text-stone-900 dark:text-zinc-100">
            Mengapa Pengunjung Menyukainya
          </h3>
          <ul class="space-y-2.5">
            <li
              v-for="(point, idx) in place.whyPeopleLikeIt"
              :key="idx"
              class="flex items-start gap-3 p-3.5 bg-stone-50 dark:bg-zinc-850 border border-stone-200/60 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-stone-700 dark:text-zinc-300"
            >
              <CheckCircle2 class="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <span>{{ point }}</span>
            </li>
          </ul>
        </section>

        <!-- Section: Facilities -->
        <section v-if="place.facilities && place.facilities.length > 0" class="space-y-3">
          <h3 class="font-display font-bold text-xl text-stone-900 dark:text-zinc-100">
            Fasilitas Tersedia
          </h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="facility in place.facilities"
              :key="facility"
              class="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-zinc-800 text-xs font-medium text-stone-700 dark:text-zinc-300"
            >
              {{ facility }}
            </span>
          </div>
        </section>

        <!-- Section: Tags -->
        <section v-if="place.tags && place.tags.length > 0" class="space-y-3">
          <div class="flex items-center gap-2 text-stone-400">
            <Tag class="w-4 h-4" />
            <h4 class="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
              Kata Kunci Terkait
            </h4>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="t in place.tags"
              :key="t"
              class="px-2.5 py-1 text-xs rounded-lg bg-stone-100 dark:bg-zinc-850 text-stone-600 dark:text-zinc-400"
            >
              #{{ t }}
            </span>
          </div>
        </section>

        <!-- Section: Reviews System -->
        <section class="space-y-6 pt-4 border-t border-stone-200/80 dark:border-zinc-800">
          <PlaceReview
            :place-id="place.id"
            :base-rating="place.rating"
            :base-review-count="place.reviewCount"
          />
        </section>
      </div>

      <!-- Right Column: Interactive Location Map on Side -->
      <aside class="lg:col-span-4 space-y-6 sticky top-24">
        <div class="bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 rounded-3xl p-5 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="font-display font-bold text-base text-stone-900 dark:text-zinc-100 flex items-center gap-2">
              <MapPin class="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Lokasi di Peta</span>
            </h4>
          </div>

          <!-- Mini Leaflet map focused on this place -->
          <div class="w-full h-56 rounded-2xl overflow-hidden border border-stone-100 dark:border-zinc-800">
            <ExploreMap
              :places="[place]"
              height-class="h-56"
              :show-category-filters="false"
              :initial-center="[place.latitude, place.longitude]"
              :initial-zoom="15"
            />
          </div>

          <div class="text-xs text-stone-500 dark:text-zinc-400 space-y-1">
            <p class="font-medium text-stone-800 dark:text-zinc-200">{{ place.address }}</p>
            <p class="font-mono text-[11px] text-stone-400">
              Koordinat: {{ place.latitude.toFixed(4) }}, {{ place.longitude.toFixed(4) }}
            </p>
          </div>
        </div>
      </aside>
    </div>

    <!-- Section: Nearby Places -->
    <section v-if="nearbyPlaces.length > 0" class="pt-8 border-t border-stone-200/80 dark:border-zinc-800 space-y-6">
      <div>
        <h3 class="font-display font-bold text-2xl text-stone-900 dark:text-zinc-100 tracking-tight">
          Destinasi Terdekat di Sekitar Sini
        </h3>
        <p class="text-xs sm:text-sm text-stone-500 dark:text-zinc-400 mt-0.5">
          Mudah dijangkau dengan jarak singkat untuk memperkaya rute wisatamu
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <PlaceCard
          v-for="np in nearbyPlaces"
          :key="np.id"
          :place="np"
        />
      </div>
    </section>
  </div>

  <!-- Fallback if place not found -->
  <div v-else class="max-w-md mx-auto py-20 px-4">
    <EmptyState
      title="Tempat tidak ditemukan"
      description="Destinasi yang kamu cari mungkin telah diperbarui atau tautan tidak valid."
      action-label="Kembali ke Jelajah"
      action-route="/explore"
    />
  </div>
</template>
