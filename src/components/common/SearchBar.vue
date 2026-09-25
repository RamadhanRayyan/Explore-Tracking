<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePlacesStore } from '@/stores/places.store';
import { Search, X, History, ArrowRight } from 'lucide-vue-next';

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    modelValue?: string;
    showRecent?: boolean;
    autoNavigate?: boolean;
  }>(),
  {
    placeholder: 'Cari tempat, kuliner, atau aktivitas di Semarang...',
    modelValue: '',
    showRecent: true,
    autoNavigate: false,
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'search', value: string): void;
}>();

const router = useRouter();
const placesStore = usePlacesStore();
const isFocused = ref(false);

const query = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val),
});

const handleSearch = () => {
  if (query.value.trim()) {
    placesStore.addRecentSearch(query.value);
    emit('search', query.value.trim());

    if (props.autoNavigate) {
      router.push({
        path: '/explore',
        query: { q: query.value.trim() },
      });
    }
  }
  isFocused.value = false;
};

const selectRecent = (recent: string) => {
  query.value = recent;
  handleSearch();
};

const clearInput = () => {
  query.value = '';
  emit('update:modelValue', '');
  emit('search', '');
};
</script>

<template>
  <div class="relative w-full">
    <form @submit.prevent="handleSearch" class="relative flex items-center">
      <div class="absolute left-4 text-stone-400 dark:text-zinc-500 pointer-events-none">
        <Search class="w-5 h-5 stroke-[2]" />
      </div>

      <input
        v-model="query"
        type="text"
        :placeholder="placeholder"
        @focus="isFocused = true"
        @blur="setTimeout(() => isFocused = false, 200)"
        class="w-full pl-12 pr-28 py-3.5 sm:py-4 bg-white dark:bg-zinc-900 border border-stone-200/90 dark:border-zinc-800 rounded-2xl shadow-xs hover:border-stone-300 dark:hover:border-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 text-stone-900 dark:text-zinc-100 placeholder:text-stone-400 dark:placeholder:text-zinc-500 text-sm sm:text-base transition-all"
      />

      <div class="absolute right-3 flex items-center gap-1.5">
        <button
          v-if="query"
          type="button"
          @click="clearInput"
          class="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-zinc-300 rounded-lg transition-colors"
          aria-label="Bersihkan pencarian"
        >
          <X class="w-4 h-4" />
        </button>

        <button
          type="submit"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all"
        >
          <span>Explore</span>
          <ArrowRight class="w-3.5 h-3.5 hidden sm:inline" />
        </button>
      </div>
    </form>

    <!-- Recent Searches Dropdown -->
    <div
      v-if="showRecent && isFocused && placesStore.recentSearches.length > 0 && !query"
      class="absolute top-full left-0 right-0 mt-2 p-3 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl shadow-xl z-30"
    >
      <div class="flex items-center justify-between px-2 pb-2 mb-1 border-b border-stone-100 dark:border-zinc-800">
        <span class="text-xs font-semibold text-stone-500 dark:text-zinc-400 flex items-center gap-1.5">
          <History class="w-3.5 h-3.5" />
          Pencarian Terkini
        </span>
        <button
          type="button"
          @click.stop="placesStore.clearRecentSearches"
          class="text-[11px] text-stone-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
        >
          Hapus Semua
        </button>
      </div>

      <div class="flex flex-wrap gap-1.5 pt-1">
        <button
          v-for="item in placesStore.recentSearches"
          :key="item"
          type="button"
          @mousedown.prevent="selectRecent(item)"
          class="px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 hover:bg-teal-50 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-stone-700 hover:text-teal-700 dark:text-zinc-300 dark:hover:text-teal-300 transition-colors"
        >
          {{ item }}
        </button>
      </div>
    </div>
  </div>
</template>
