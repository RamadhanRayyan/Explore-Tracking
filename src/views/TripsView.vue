<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTripStore } from '@/stores/trip.store';
import EmptyState from '@/components/common/EmptyState.vue';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDurationHuman } from '@/utils/time';
import {
  Route,
  Clock,
  Coins,
  MapPin,
  Trash2,
  Plus,
  ArrowRight,
} from 'lucide-vue-next';

type TripFilterType = 'all' | 'recent' | 'budget' | 'long' | 'short';

const router = useRouter();
const tripStore = useTripStore();
const activeFilter = ref<TripFilterType>('all');

const filterOptions: { label: string; value: TripFilterType }[] = [
  { label: 'Semua Trip', value: 'all' },
  { label: 'Terbaru', value: 'recent' },
  { label: 'Paling Hemat', value: 'budget' },
  { label: 'Trip Panjang (6j+)', value: 'long' },
  { label: 'Trip Singkat (<6j)', value: 'short' },
];

const filteredTrips = computed(() => {
  let list = [...tripStore.savedTrips];

  switch (activeFilter.value) {
    case 'budget':
      list.sort((a, b) => a.totalCost - b.totalCost);
      break;
    case 'long':
      list = list.filter(t => t.totalDurationMinutes >= 360);
      break;
    case 'short':
      list = list.filter(t => t.totalDurationMinutes < 360);
      break;
    case 'recent':
    case 'all':
    default:
      // already sorted chronologically
      break;
  }

  return list;
});

const navigateToDetail = (id: string) => {
  router.push(`/trips/${id}`);
};

const handleDelete = (e: Event, id: string) => {
  e.stopPropagation();
  tripStore.deleteTrip(id);
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="font-display font-extrabold text-3xl sm:text-4xl text-stone-900 dark:text-zinc-50 tracking-tight">
          My Trips
        </h1>
        <p class="text-sm text-stone-500 dark:text-zinc-400 mt-1">
          Koleksi semua rencana perjalanan yang telah kamu simpan di Explore Semarang.
        </p>
      </div>

      <RouterLink
        to="/planner"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
      >
        <Plus class="w-4 h-4" />
        <span>Buat Trip Baru</span>
      </RouterLink>
    </div>

    <!-- Filter Buttons Bar -->
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="opt in filterOptions"
        :key="opt.value"
        type="button"
        @click="activeFilter = opt.value"
        :class="[
          'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all',
          activeFilter === opt.value
            ? 'bg-teal-600 text-white shadow-xs'
            : 'bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100'
        ]"
      >
        {{ opt.label }}
      </button>
    </div>

    <!-- Trips Grid -->
    <div
      v-if="filteredTrips.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="trip in filteredTrips"
        :key="trip.id"
        @click="navigateToDetail(trip.id)"
        class="group cursor-pointer bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
      >
        <div>
          <div class="flex items-start justify-between gap-3 mb-2">
            <span class="text-[11px] font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              {{ trip.createdAt }}
            </span>
            <button
              type="button"
              @click="handleDelete($event, trip.id)"
              class="p-1 text-stone-400 hover:text-rose-500 rounded-lg transition-colors"
              title="Hapus rencana ini"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>

          <h3 class="font-display font-bold text-lg text-stone-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors mb-3">
            {{ trip.title }}
          </h3>

          <div class="space-y-1.5 mb-6 text-xs text-stone-600 dark:text-zinc-400">
            <div class="flex items-center gap-2">
              <span class="font-medium text-stone-900 dark:text-zinc-100">Transport:</span>
              <span class="capitalize">{{ trip.input.transport }}</span>
              <span aria-hidden="true">·</span>
              <span class="capitalize">{{ trip.input.travelStyle }}</span>
            </div>
            <div class="flex flex-wrap gap-1 text-[11px] text-stone-500">
              <span v-for="it in trip.items.slice(0, 3)" :key="it.place.id">
                📍 {{ it.place.name }}
              </span>
              <span v-if="trip.items.length > 3">
                (+{{ trip.items.length - 3 }} lagi)
              </span>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-stone-100 dark:border-zinc-800/80 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <span class="text-[10px] text-stone-400 block uppercase font-medium">Pengeluaran</span>
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
            <span class="text-[10px] text-stone-400 block uppercase font-medium">Tempat</span>
            <span class="font-bold text-stone-900 dark:text-zinc-100 tabular-nums">
              {{ trip.items.length }} Spot
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white dark:bg-zinc-900 rounded-3xl border border-stone-200/80 dark:border-zinc-800 p-12">
      <EmptyState
        :icon="Route"
        title="Belum ada rencana perjalanan tersimpan."
        description="Gunakan fitur Trip Planner untuk menyusun rencana otomatis dan simpan untuk diakses kapan saja."
        action-label="Susun Rencana Pertama"
        action-route="/planner"
      />
    </div>
  </div>
</template>
