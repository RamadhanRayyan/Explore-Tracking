<script setup lang="ts">
import { computed } from 'vue';
import { usePlannerStore } from '@/stores/planner.store';
import { CATEGORIES } from '@/data/categories';
import type { PlaceCategory, TransportMode, TravelStyle } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';
import {
  Wallet,
  Clock,
  Compass,
  Bike,
  Car,
  Footprints,
  Bus,
  Sparkles,
  Check,
} from 'lucide-vue-next';

const plannerStore = usePlannerStore();

const budgetPresets = [
  { label: 'Rp25K', val: 25000 },
  { label: 'Rp50K', val: 50000 },
  { label: 'Rp100K', val: 100000 },
  { label: 'Rp200K', val: 200000 },
  { label: 'Rp500K', val: 500000 },
];

const durationPresets = [
  { label: '2 Jam', val: 120 },
  { label: '4 Jam', val: 240 },
  { label: '6 Jam', val: 360 },
  { label: '8 Jam', val: 480 },
  { label: '12 Jam', val: 720 },
];

const transportOptions: { mode: TransportMode; label: string; icon: any; speed: string }[] = [
  { mode: 'motor', label: 'Motor', icon: Bike, speed: '25 km/jam' },
  { mode: 'mobil', label: 'Mobil', icon: Car, speed: '20 km/jam' },
  { mode: 'jalan', label: 'Jalan Kaki', icon: Footprints, speed: '4 km/jam' },
  { mode: 'public', label: 'Trans Semarang', icon: Bus, speed: '15 km/jam' },
];

const travelStyleOptions: { style: TravelStyle; label: string; desc: string }[] = [
  { style: 'santai', label: 'Santai', desc: 'Waktu santai lebih lama di setiap tempat' },
  { style: 'balanced', label: 'Seimbang', desc: 'Ritme ideal antara jalan dan santai' },
  { style: 'padat', label: 'Padat', desc: 'Maksimal mengunjungi banyak tempat' },
];

const formattedCurrentBudget = computed(() => {
  return formatCurrency(plannerStore.input.budget);
});

const formattedCurrentDuration = computed(() => {
  const hrs = Math.round(plannerStore.input.durationMinutes / 60);
  return `${hrs} Jam`;
});

const isInterestSelected = (catName: PlaceCategory) => {
  return plannerStore.input.interests.includes(catName);
};

const handleGenerate = () => {
  plannerStore.generateTrip();
};
</script>

<template>
  <div class="bg-white dark:bg-zinc-900 border border-stone-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
    <!-- Step 1: Budget -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <label class="text-sm font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Wallet class="w-4 h-4" />
          </div>
          <span>1. Berapa budget liburanmu?</span>
        </label>
        <span class="text-base font-extrabold text-teal-600 dark:text-teal-400 font-mono">
          {{ formattedCurrentBudget }}
        </span>
      </div>

      <!-- Presets -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="b in budgetPresets"
          :key="b.val"
          type="button"
          @click="plannerStore.setBudget(b.val)"
          :class="[
            'px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all',
            plannerStore.input.budget === b.val
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-700'
          ]"
        >
          {{ b.label }}
        </button>
      </div>

      <!-- Slider -->
      <input
        type="range"
        min="20000"
        max="1000000"
        step="10000"
        :value="plannerStore.input.budget"
        @input="plannerStore.setBudget(Number(($event.target as HTMLInputElement).value))"
        class="w-full accent-teal-600 h-2 bg-stone-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
      />
    </div>

    <!-- Step 2: Duration -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <label class="text-sm font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock class="w-4 h-4" />
          </div>
          <span>2. Berapa lama kamu punya waktu?</span>
        </label>
        <span class="text-base font-extrabold text-amber-600 dark:text-amber-400 font-mono">
          {{ formattedCurrentDuration }}
        </span>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="d in durationPresets"
          :key="d.val"
          type="button"
          @click="plannerStore.setDuration(d.val)"
          :class="[
            'px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all',
            plannerStore.input.durationMinutes === d.val
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-700'
          ]"
        >
          {{ d.label }}
        </button>
      </div>
    </div>

    <!-- Step 3: Start Time -->
    <div class="space-y-2">
      <label class="text-sm font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <Clock class="w-4 h-4" />
        </div>
        <span>3. Mulai jam berapa?</span>
      </label>

      <input
        type="time"
        :value="plannerStore.input.startTime"
        @input="plannerStore.setStartTime(($event.target as HTMLInputElement).value)"
        class="w-full sm:w-48 px-4 py-2.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-sm font-mono font-bold text-stone-800 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
      />
    </div>

    <!-- Step 4: Interests Multi-Select -->
    <div class="space-y-3">
      <label class="text-sm font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
          <Compass class="w-4 h-4" />
        </div>
        <span>4. Apa yang ingin kamu lakukan? (Pilih satu atau lebih)</span>
      </label>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          v-for="cat in CATEGORIES"
          :key="cat.id"
          type="button"
          @click="plannerStore.toggleInterest(cat.name)"
          :class="[
            'p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all text-xs font-semibold',
            isInterestSelected(cat.name)
              ? 'bg-teal-500/10 border-teal-500 text-teal-700 dark:text-teal-300 ring-1 ring-teal-500 shadow-xs'
              : 'bg-stone-50 dark:bg-zinc-850 border-stone-200 dark:border-zinc-800 text-stone-700 dark:text-zinc-300 hover:border-stone-300'
          ]"
        >
          <span class="text-base">{{ cat.emoji }}</span>
          <span class="flex-1 truncate">{{ cat.name }}</span>
          <Check v-if="isInterestSelected(cat.name)" class="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
        </button>
      </div>
    </div>

    <!-- Step 5: Transportation -->
    <div class="space-y-3">
      <label class="text-sm font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <Bike class="w-4 h-4" />
        </div>
        <span>5. Transportasi yang kamu gunakan</span>
      </label>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          v-for="t in transportOptions"
          :key="t.mode"
          type="button"
          @click="plannerStore.setTransport(t.mode)"
          :class="[
            'p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition-all',
            plannerStore.input.transport === t.mode
              ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
              : 'bg-stone-50 dark:bg-zinc-850 border-stone-200 dark:border-zinc-800 text-stone-700 dark:text-zinc-300 hover:border-stone-300'
          ]"
        >
          <component :is="t.icon" class="w-5 h-5 mb-1" />
          <span class="text-xs font-bold">{{ t.label }}</span>
          <span
            :class="[
              'text-[10px]',
              plannerStore.input.transport === t.mode ? 'text-teal-100' : 'text-stone-400 dark:text-zinc-500'
            ]"
          >
            Est. {{ t.speed }}
          </span>
        </button>
      </div>
    </div>

    <!-- Step 6: Travel Style -->
    <div class="space-y-3">
      <label class="text-sm font-bold text-stone-900 dark:text-zinc-100 flex items-center gap-2">
        <div class="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <Sparkles class="w-4 h-4" />
        </div>
        <span>6. Gaya perjalanan (Travel style)</span>
      </label>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <button
          v-for="s in travelStyleOptions"
          :key="s.style"
          type="button"
          @click="plannerStore.setTravelStyle(s.style)"
          :class="[
            'p-3.5 rounded-2xl border text-left flex flex-col gap-1 transition-all',
            plannerStore.input.travelStyle === s.style
              ? 'bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-stone-900 dark:border-zinc-100 shadow-xs'
              : 'bg-stone-50 dark:bg-zinc-850 border-stone-200 dark:border-zinc-800 text-stone-700 dark:text-zinc-300 hover:border-stone-300'
          ]"
        >
          <span class="text-xs font-bold">{{ s.label }}</span>
          <span
            :class="[
              'text-[11px] leading-relaxed',
              plannerStore.input.travelStyle === s.style ? 'opacity-80' : 'text-stone-500 dark:text-zinc-400'
            ]"
          >
            {{ s.desc }}
          </span>
        </button>
      </div>
    </div>

    <!-- Generate Action CTA -->
    <div class="pt-4 border-t border-stone-100 dark:border-zinc-800">
      <button
        type="button"
        @click="handleGenerate"
        :disabled="plannerStore.isGenerating"
        class="w-full py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 active:scale-99 text-white font-bold text-base shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
      >
        <Sparkles class="w-5 h-5" />
        <span>{{ plannerStore.isGenerating ? 'Menyusun Rute Otomatis...' : 'Generate My Itinerary' }}</span>
      </button>
    </div>
  </div>
</template>
