<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { useSettingsStore } from '@/stores/settings.store';
import { useBookmarkStore } from '@/stores/bookmark.store';
import {
  MapPin,
  Search,
  Sun,
  Moon,
  User,
  Heart,
  Calendar,
  X,
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();
const bookmarkStore = useBookmarkStore();

const isSearchOpen = ref(false);
const localSearchQuery = ref('');

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Explore', path: '/explore' },
  { name: 'Map', path: '/map' },
  { name: 'Planner', path: '/planner' },
  { name: 'Saved', path: '/saved' },
];

const handleSearchSubmit = () => {
  if (localSearchQuery.value.trim()) {
    router.push({
      path: '/explore',
      query: { q: localSearchQuery.value.trim() },
    });
    isSearchOpen.value = false;
  }
};

const isActive = (path: string) => {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};
</script>

<template>
  <header
    class="sticky top-0 z-40 bg-stone-50/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-stone-200/80 dark:border-zinc-800/80 transition-colors"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Zone 1: Brand Wordmark -->
        <RouterLink
          to="/"
          class="flex items-center gap-2.5 group focus-visible:outline-teal-500 rounded-lg"
        >
          <div
            class="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform"
          >
            <MapPin class="w-5 h-5 stroke-[2.2]" />
          </div>
          <div class="flex flex-col">
            <span class="font-display font-extrabold text-lg sm:text-xl tracking-tight text-stone-900 dark:text-zinc-50 leading-none">
              Explore Semarang
            </span>
          </div>
        </RouterLink>

        <!-- Zone 2: Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-1 sm:gap-2">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            :class="[
              'px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors relative',
              isActive(link.path)
                ? 'text-teal-700 dark:text-teal-400 font-semibold'
                : 'text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-stone-200/50 dark:hover:bg-zinc-900'
            ]"
          >
            {{ link.name }}
            <!-- Saved counter pill badge only when > 0 -->
            <span
              v-if="link.name === 'Saved' && bookmarkStore.count > 0"
              class="ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300"
            >
              {{ bookmarkStore.count }}
            </span>
            <span
              v-if="isActive(link.path)"
              class="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-teal-600 dark:bg-teal-400 rounded-full"
            />
          </RouterLink>
        </nav>

        <!-- Zone 3: Actions -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Search button toggle -->
          <button
            @click="isSearchOpen = !isSearchOpen"
            class="p-2 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-stone-200/60 dark:hover:bg-zinc-900 rounded-xl transition-colors"
            aria-label="Cari tempat di Semarang"
          >
            <Search class="w-5 h-5 stroke-[1.8]" />
          </button>

          <!-- Dark Mode Toggle -->
          <button
            @click="settingsStore.toggleDarkMode"
            class="p-2 text-stone-600 dark:text-zinc-400 hover:text-stone-900 dark:hover:text-zinc-100 hover:bg-stone-200/60 dark:hover:bg-zinc-900 rounded-xl transition-colors"
            aria-label="Ganti mode tampilan"
          >
            <Sun v-if="settingsStore.darkMode" class="w-5 h-5 text-amber-400 stroke-[1.8]" />
            <Moon v-else class="w-5 h-5 stroke-[1.8]" />
          </button>

          <!-- Profile / Auth Button -->
          <RouterLink
            to="/profile"
            class="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-stone-200 dark:border-zinc-800 hover:border-teal-500/50 hover:bg-stone-100/60 dark:hover:bg-zinc-900 transition-all text-xs font-medium text-stone-700 dark:text-zinc-300"
          >
            <div
              class="w-6 h-6 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs"
            >
              <User class="w-3.5 h-3.5" />
            </div>
            <span class="hidden sm:inline">
              {{ authStore.currentUser ? authStore.currentUser.name : 'Profil' }}
            </span>
          </RouterLink>

          <!-- Quick Action CTA -->
          <RouterLink
            to="/planner"
            class="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Calendar class="w-3.5 h-3.5" />
            <span>Susun Trip</span>
          </RouterLink>
        </div>
      </div>

      <!-- Expandable Search Bar Drawer -->
      <div
        v-if="isSearchOpen"
        class="pb-4 pt-1 border-t border-stone-100 dark:border-zinc-850"
      >
        <form @submit.prevent="handleSearchSubmit" class="relative flex items-center">
          <Search class="absolute left-3.5 w-4 h-4 text-stone-400" />
          <input
            v-model="localSearchQuery"
            type="text"
            autofocus
            placeholder="Cari tempat, kuliner, atau aktivitas di Semarang..."
            class="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-stone-800 dark:text-zinc-100 placeholder:text-stone-400"
          />
          <button
            type="button"
            @click="isSearchOpen = false"
            class="absolute right-3 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-zinc-200"
            aria-label="Tutup pencarian"
          >
            <X class="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  </header>
</template>
