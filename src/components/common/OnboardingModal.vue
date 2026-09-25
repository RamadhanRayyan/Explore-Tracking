<script setup lang="ts">
import { ref } from 'vue';
import { useSettingsStore } from '@/stores/settings.store';
import { MapPin, Route, Compass, ArrowRight, Check } from 'lucide-vue-next';

const settings = useSettingsStore();

const slides = [
  {
    icon: Compass,
    title: 'Temukan Tempat Menarik',
    desc: 'Eksplorasi destinasi heritage, kuliner legendaris, spot foto tersembunyi, hingga cafe estetik di penjuru kota Semarang.',
    badge: 'Discover',
  },
  {
    icon: Route,
    title: 'Susun Perjalanan Sesuai Budget',
    desc: 'Cukup masukkan dana dan durasi yang kamu punya. Sistem cerdas kami akan menyusun rute terbaik tanpa melebihi estimasi pengeluaranmu.',
    badge: 'Plan',
  },
  {
    icon: MapPin,
    title: 'Jelajahi Semarang dengan Mudah',
    desc: 'Buka peta interaktif, nikmati timeline step-by-step, simpan rencana ke My Trips, dan rasakan atmosfer otentik Kota Atlas.',
    badge: 'Explore',
  },
];

const currentSlide = ref(0);

const nextSlide = () => {
  if (currentSlide.value < slides.length - 1) {
    currentSlide.value++;
  } else {
    finishOnboarding();
  }
};

const finishOnboarding = () => {
  settings.completeOnboarding();
};
</script>

<template>
  <Teleport to="body">
    <div
      v-if="!settings.hasCompletedOnboarding"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
    >
      <div
        class="w-full max-w-lg bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8"
      >
        <div class="flex justify-between items-center mb-6">
          <span class="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-full">
            {{ slides[currentSlide].badge }}
          </span>
          <button
            @click="finishOnboarding"
            class="text-xs font-medium text-stone-400 hover:text-stone-600 dark:hover:text-zinc-300"
          >
            Lewati
          </button>
        </div>

        <div class="flex flex-col items-center text-center my-6">
          <div class="w-16 h-16 rounded-2xl bg-teal-500/10 dark:bg-teal-400/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-5">
            <component :is="slides[currentSlide].icon" class="w-8 h-8 stroke-[1.75]" />
          </div>

          <h3 class="text-xl sm:text-2xl font-bold font-display text-stone-900 dark:text-zinc-100 mb-3 text-balance">
            {{ slides[currentSlide].title }}
          </h3>

          <p class="text-sm text-stone-600 dark:text-zinc-400 leading-relaxed max-w-sm">
            {{ slides[currentSlide].desc }}
          </p>
        </div>

        <!-- Indicators -->
        <div class="flex justify-center gap-1.5 mb-8">
          <div
            v-for="(_, index) in slides"
            :key="index"
            :class="[
              'h-1.5 rounded-full transition-all duration-300',
              currentSlide === index
                ? 'w-6 bg-teal-600 dark:bg-teal-400'
                : 'w-1.5 bg-stone-200 dark:bg-zinc-700'
            ]"
          />
        </div>

        <!-- Buttons -->
        <div class="flex items-center justify-between gap-4">
          <button
            v-if="currentSlide > 0"
            @click="currentSlide--"
            class="px-4 py-2.5 text-sm font-medium text-stone-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
          >
            Kembali
          </button>
          <div v-else class="w-16" />

          <button
            @click="nextSlide"
            class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-xs transition-colors"
          >
            <span>{{ currentSlide === slides.length - 1 ? 'Mulai Eksplorasi' : 'Lanjut' }}</span>
            <Check v-if="currentSlide === slides.length - 1" class="w-4 h-4" />
            <ArrowRight v-else class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
