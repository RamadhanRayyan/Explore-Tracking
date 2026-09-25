<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Place } from '@/types';
import { useBookmarkStore } from '@/stores/bookmark.store';
import { usePlacesStore } from '@/stores/places.store';
import { formatPriceRange } from '@/utils/formatCurrency';
import { calculateHaversineDistance, formatDistance } from '@/utils/distance';
import SafeImage from '@/components/common/SafeImage.vue';
import { Star, MapPin, Heart, ArrowUpRight } from 'lucide-vue-next';

const props = defineProps<{
  place: Place;
}>();

const router = useRouter();
const bookmarkStore = useBookmarkStore();
const placesStore = usePlacesStore();

const isBookmarked = computed(() => bookmarkStore.isBookmarked(props.place.id));

const distanceText = computed(() => {
  if (!placesStore.userLocation) return null;
  const km = calculateHaversineDistance(
    placesStore.userLocation.latitude,
    placesStore.userLocation.longitude,
    props.place.latitude,
    props.place.longitude
  );
  return formatDistance(km);
});

const formattedPrice = computed(() => {
  return formatPriceRange(props.place.priceMin, props.place.priceMax, true);
});

const handleCardClick = () => {
  router.push(`/places/${props.place.slug}`);
};

const handleToggleBookmark = (e: Event) => {
  e.stopPropagation();
  bookmarkStore.toggleBookmark(props.place.id);
};
</script>

<template>
  <div
    @click="handleCardClick"
    class="group cursor-pointer flex flex-col bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative focus-within:ring-2 focus-within:ring-teal-500"
  >
    <!-- Card Media with Zoom -->
    <div class="relative overflow-hidden aspect-4/3 bg-stone-100 dark:bg-zinc-800">
      <SafeImage
        :src="place.image"
        :alt="place.name"
        :category="place.category"
        aspect-ratio="aspect-4/3"
        container-class="w-full h-full"
      />

      <!-- Category Label Overlay -->
      <div class="absolute top-3 left-3 z-10">
        <span
          class="px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase rounded-lg bg-stone-900/80 dark:bg-zinc-900/90 text-white backdrop-blur-xs shadow-xs"
        >
          {{ place.category }}
        </span>
      </div>

      <!-- Bookmark Button with Heart Animation -->
      <button
        type="button"
        @click="handleToggleBookmark"
        :aria-label="isBookmarked ? 'Hapus dari favorit' : 'Simpan ke favorit'"
        :class="[
          'absolute top-3 right-3 z-10 p-2 rounded-xl backdrop-blur-md transition-all active:scale-90',
          isBookmarked
            ? 'bg-rose-500 text-white shadow-md'
            : 'bg-white/80 dark:bg-zinc-900/80 text-stone-700 dark:text-zinc-200 hover:text-rose-500 hover:bg-white'
        ]"
      >
        <Heart
          :class="[
            'w-4 h-4 transition-transform duration-200',
            isBookmarked ? 'fill-current scale-110' : 'scale-100'
          ]"
        />
      </button>

      <!-- Distance Tag if available -->
      <div
        v-if="distanceText"
        class="absolute bottom-3 left-3 z-10 px-2 py-0.5 rounded-md bg-stone-900/75 backdrop-blur-xs text-[11px] font-medium text-stone-200 flex items-center gap-1"
      >
        <MapPin class="w-3 h-3 text-teal-400" />
        <span>{{ distanceText }} dari lokasimu</span>
      </div>
    </div>

    <!-- Card Content -->
    <div class="flex-1 flex flex-col p-5">
      <!-- Title & Rating -->
      <div class="flex items-start justify-between gap-2 mb-1.5">
        <h3
          class="font-display font-bold text-base sm:text-lg text-stone-900 dark:text-zinc-50 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1"
        >
          {{ place.name }}
        </h3>
      </div>

      <!-- Rating & Reviews meta (No pill, clean typography per constitution) -->
      <div class="flex items-center gap-2 text-xs text-stone-500 dark:text-zinc-400 mb-3">
        <div class="flex items-center gap-1 text-amber-500 font-semibold">
          <Star class="w-3.5 h-3.5 fill-current" />
          <span>{{ place.rating.toFixed(1) }}</span>
        </div>
        <span aria-hidden="true">·</span>
        <span>{{ place.reviewCount.toLocaleString() }} ulasan</span>
        <span aria-hidden="true">·</span>
        <span class="line-clamp-1">{{ place.district }}</span>
      </div>

      <!-- Short Description -->
      <p class="text-xs text-stone-600 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed flex-1">
        {{ place.shortDescription }}
      </p>

      <!-- Bottom Card Metadata: Price & Action -->
      <div
        class="pt-3 border-t border-stone-100 dark:border-zinc-800/80 flex items-center justify-between text-xs"
      >
        <div class="flex flex-col">
          <span class="text-[10px] uppercase font-semibold text-stone-400 dark:text-zinc-500">Estimasi</span>
          <span class="font-bold text-sm text-stone-900 dark:text-zinc-100 tabular-nums">
            {{ formattedPrice }}
          </span>
        </div>

        <span
          class="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 group-hover:translate-x-0.5 transition-transform"
        >
          Lihat Tempat
          <ArrowUpRight class="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  </div>
</template>
