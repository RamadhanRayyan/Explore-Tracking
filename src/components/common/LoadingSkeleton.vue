<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'card' | 'detail' | 'timeline' | 'row';
    count?: number;
  }>(),
  {
    type: 'card',
    count: 3,
  }
);
</script>

<template>
  <div v-if="type === 'card'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="i in count"
      :key="i"
      class="bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs animate-pulse"
    >
      <div class="aspect-4/3 bg-stone-200 dark:bg-zinc-800" />
      <div class="p-5 space-y-3">
        <div class="flex justify-between items-center">
          <div class="h-3 w-20 bg-stone-200 dark:bg-zinc-800 rounded" />
          <div class="h-3 w-12 bg-stone-200 dark:bg-zinc-800 rounded" />
        </div>
        <div class="h-5 w-3/4 bg-stone-300 dark:bg-zinc-700 rounded" />
        <div class="h-4 w-1/2 bg-stone-200 dark:bg-zinc-800 rounded" />
        <div class="pt-2 flex justify-between items-center border-t border-stone-100 dark:border-zinc-800/80">
          <div class="h-4 w-24 bg-stone-200 dark:bg-zinc-800 rounded" />
          <div class="h-8 w-24 bg-stone-200 dark:bg-zinc-800 rounded-xl" />
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="type === 'timeline'" class="space-y-6">
    <div
      v-for="i in count"
      :key="i"
      class="flex gap-4 p-5 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl animate-pulse"
    >
      <div class="w-12 h-12 bg-stone-200 dark:bg-zinc-800 rounded-2xl shrink-0" />
      <div class="flex-1 space-y-2.5">
        <div class="h-4 w-1/3 bg-stone-300 dark:bg-zinc-700 rounded" />
        <div class="h-3 w-2/3 bg-stone-200 dark:bg-zinc-800 rounded" />
        <div class="h-3 w-1/2 bg-stone-100 dark:bg-zinc-850 rounded" />
      </div>
    </div>
  </div>

  <div v-else-if="type === 'detail'" class="space-y-8 animate-pulse">
    <div class="aspect-21/9 bg-stone-200 dark:bg-zinc-800 rounded-3xl" />
    <div class="space-y-4">
      <div class="h-8 w-2/3 bg-stone-300 dark:bg-zinc-700 rounded" />
      <div class="h-4 w-1/3 bg-stone-200 dark:bg-zinc-800 rounded" />
      <div class="h-20 w-full bg-stone-100 dark:bg-zinc-850 rounded-2xl" />
    </div>
  </div>
</template>
