<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useBookmarkStore } from '@/stores/bookmark.store';
import { Home, Compass, Map, Route, Heart } from 'lucide-vue-next';

const route = useRoute();
const bookmarkStore = useBookmarkStore();

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Explore', path: '/explore', icon: Compass },
  { name: 'Map', path: '/map', icon: Map },
  { name: 'Planner', path: '/planner', icon: Route },
  { name: 'Saved', path: '/saved', icon: Heart },
];

const isActive = (path: string) => {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};
</script>

<template>
  <nav
    class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-stone-200/80 dark:border-zinc-800/80 px-2 py-1 transition-colors safe-area-bottom"
    aria-label="Navigasi bawah seluler"
  >
    <div class="flex items-center justify-around max-w-md mx-auto">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :class="[
          'flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 px-2 rounded-xl transition-all relative',
          isActive(item.path)
            ? 'text-teal-600 dark:text-teal-400 font-semibold'
            : 'text-stone-500 dark:text-zinc-400 hover:text-stone-800 dark:hover:text-zinc-200'
        ]"
      >
        <div class="relative">
          <component
            :is="item.icon"
            :class="[
              'w-5 h-5 transition-transform',
              isActive(item.path) ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'
            ]"
          />
          <span
            v-if="item.name === 'Saved' && bookmarkStore.count > 0"
            class="absolute -top-1 -right-2 px-1 text-[9px] font-bold rounded-full bg-teal-500 text-white min-w-[14px] text-center"
          >
            {{ bookmarkStore.count }}
          </span>
        </div>
        <span class="text-[11px] mt-1 tracking-tight">
          {{ item.name }}
        </span>
      </RouterLink>
    </div>
  </nav>
</template>
