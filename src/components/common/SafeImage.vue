<script setup lang="ts">
import { ref } from 'vue';
import { ImageOff, Compass } from 'lucide-vue-next';

const props = withDefaults(
  defineProps<{
    src?: string;
    alt?: string;
    aspectRatio?: string;
    containerClass?: string;
    category?: string;
  }>(),
  {
    alt: 'Foto tempat Semarang',
    aspectRatio: 'aspect-4/3',
    containerClass: '',
    category: 'Wisata',
  }
);

const isLoaded = ref(false);
const hasError = ref(false);

const handleLoad = () => {
  isLoaded.value = true;
};

const handleError = () => {
  hasError.value = true;
};
</script>

<template>
  <div :class="['relative overflow-hidden bg-stone-100 dark:bg-zinc-800', aspectRatio, containerClass]">
    <!-- Loading placeholder shimmer -->
    <div
      v-if="!isLoaded && !hasError"
      class="absolute inset-0 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800 animate-pulse"
    />

    <!-- Real Image -->
    <img
      v-if="src && !hasError"
      :src="src"
      :alt="alt"
      loading="lazy"
      referrerpolicy="no-referrer"
      @load="handleLoad"
      @error="handleError"
      :class="[
        'w-full h-full object-cover transition-all duration-500 ease-out',
        isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
      ]"
    />

    <!-- Styled Aesthetic Graphic Fallback if image fails or not provided -->
    <div
      v-if="hasError || !src"
      class="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-teal-900/10 via-stone-100 to-emerald-900/10 dark:from-zinc-900 dark:via-zinc-800 dark:to-teal-950/40 text-stone-600 dark:text-zinc-400 select-none text-center"
    >
      <div class="w-12 h-12 rounded-2xl bg-white/80 dark:bg-zinc-700/80 shadow-xs flex items-center justify-center mb-2 text-teal-600 dark:text-teal-400">
        <Compass class="w-6 h-6 stroke-[1.5]" />
      </div>
      <span class="text-xs font-semibold tracking-wide uppercase text-teal-700 dark:text-teal-300">
        {{ category || 'Semarang' }}
      </span>
      <span class="text-xs text-stone-500 dark:text-zinc-400 line-clamp-1 max-w-[85%] mt-0.5">
        {{ alt }}
      </span>
    </div>
  </div>
</template>
