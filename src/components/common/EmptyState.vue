<script setup lang="ts">
import type { Component } from 'vue';
import { Compass } from 'lucide-vue-next';

withDefaults(
  defineProps<{
    icon?: Component;
    title: string;
    description: string;
    actionLabel?: string;
    actionRoute?: string;
  }>(),
  {
    icon: Compass,
    actionLabel: '',
    actionRoute: '',
  }
);

const emit = defineEmits<{
  (e: 'action'): void;
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-6 text-center max-w-md mx-auto">
    <div class="w-16 h-16 mb-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
      <component :is="icon" class="w-8 h-8 stroke-[1.75]" />
    </div>

    <h3 class="text-lg font-semibold text-stone-900 dark:text-zinc-100 mb-1">
      {{ title }}
    </h3>

    <p class="text-sm text-stone-500 dark:text-zinc-400 mb-6 leading-relaxed">
      {{ description }}
    </p>

    <div v-if="actionLabel">
      <RouterLink
        v-if="actionRoute"
        :to="actionRoute"
        class="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-xs transition-colors"
      >
        {{ actionLabel }}
      </RouterLink>

      <button
        v-else
        @click="emit('action')"
        class="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-xs transition-colors"
      >
        {{ actionLabel }}
      </button>
    </div>
  </div>
</template>
