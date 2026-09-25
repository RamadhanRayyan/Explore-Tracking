<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { ItineraryItem } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDurationHuman } from '@/utils/time';
import SafeImage from '@/components/common/SafeImage.vue';
import {
  Clock,
  Coins,
  MapPin,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  Compass,
} from 'lucide-vue-next';

const props = defineProps<{
  items: ItineraryItem[];
  transportMode?: string;
}>();

const router = useRouter();

const navigateToPlace = (slug: string) => {
  router.push(`/places/${slug}`);
};
</script>

<template>
  <div class="space-y-6">
    <div
      v-for="(item, index) in items"
      :key="item.place.id"
      class="relative"
    >
      <!-- Travel Transit Step Indicator (Between stops) -->
      <div
        v-if="index > 0"
        class="flex items-center gap-3 py-4 pl-4 sm:pl-6 my-1 border-l-2 border-dashed border-teal-500/40 ml-4 sm:ml-6 text-xs text-stone-500 dark:text-zinc-400"
      >
        <div class="w-2 h-2 rounded-full bg-teal-500 -ml-[5px]" />
        <div class="flex items-center gap-2 bg-stone-100 dark:bg-zinc-800/80 px-3 py-1.5 rounded-xl border border-stone-200/60 dark:border-zinc-700/60">
          <Compass class="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span class="font-medium">
            Perjalanan ~{{ item.travelTimeFromPreviousMinutes }} mnt ({{ item.distanceFromPreviousKm }} km)
          </span>
        </div>
      </div>

      <!-- Itinerary Spot Card -->
      <div
        class="bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xs hover:border-teal-500/40 transition-colors"
      >
        <div class="flex flex-col sm:flex-row gap-5">
          <!-- Thumbnail Media -->
          <div
            @click="navigateToPlace(item.place.slug)"
            class="relative w-full sm:w-44 aspect-4/3 rounded-2xl overflow-hidden shrink-0 cursor-pointer group"
          >
            <SafeImage
              :src="item.place.image"
              :alt="item.place.name"
              :category="item.place.category"
              aspect-ratio="aspect-4/3"
              container-class="w-full h-full"
            />
            <div class="absolute top-2.5 left-2.5 z-10 w-7 h-7 rounded-xl bg-teal-600 text-white font-black text-xs flex items-center justify-center shadow-md">
              {{ item.order }}
            </div>
          </div>

          <!-- Spot Info & Schedule -->
          <div class="flex-1 flex flex-col justify-between">
            <div>
              <!-- Time & Category -->
              <div class="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div class="flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
                  <Clock class="w-3.5 h-3.5" />
                  <span class="font-mono text-sm tabular-nums">
                    {{ item.arrivalTime }} - {{ item.departureTime }}
                  </span>
                  <span class="text-stone-400 dark:text-zinc-600">·</span>
                  <span class="text-stone-500 dark:text-zinc-400 font-normal">
                    ({{ formatDurationHuman(item.visitDurationMinutes) }})
                  </span>
                </div>

                <span class="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300">
                  {{ item.place.category }}
                </span>
              </div>

              <!-- Title -->
              <h4
                @click="navigateToPlace(item.place.slug)"
                class="font-display font-bold text-lg text-stone-900 dark:text-zinc-50 hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer transition-colors"
              >
                {{ item.place.name }}
              </h4>

              <!-- Address line -->
              <p class="text-xs text-stone-500 dark:text-zinc-400 flex items-center gap-1 mt-1 mb-3">
                <MapPin class="w-3.5 h-3.5 shrink-0 text-stone-400" />
                <span class="line-clamp-1">{{ item.place.address }}</span>
              </p>

              <!-- Recommendation Reason Pill/Note -->
              <div class="p-3 bg-teal-50/70 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/40 rounded-xl text-xs text-teal-900 dark:text-teal-200 flex items-start gap-2 mb-3">
                <Sparkles class="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <span class="leading-relaxed">{{ item.recommendationReason }}</span>
              </div>
            </div>

            <!-- Cost & Details Link -->
            <div class="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-zinc-800/80 text-xs">
              <div class="flex items-center gap-1.5 font-medium text-stone-700 dark:text-zinc-300">
                <Coins class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Est. Biaya:</span>
                <span class="font-bold text-stone-900 dark:text-zinc-100 tabular-nums">
                  {{ item.estimatedCost === 0 ? 'Gratis' : formatCurrency(item.estimatedCost) }}
                </span>
              </div>

              <button
                type="button"
                @click="navigateToPlace(item.place.slug)"
                class="inline-flex items-center gap-1 font-semibold text-teal-600 dark:text-teal-400 hover:underline"
              >
                <span>Lihat Detail</span>
                <ArrowUpRight class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
