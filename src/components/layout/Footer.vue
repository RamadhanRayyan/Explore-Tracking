<script setup lang="ts">
import { MapPin } from 'lucide-vue-next';
</script>

<template>
  <footer
    class="border-t border-stone-200/80 dark:border-zinc-800 bg-stone-100/50 dark:bg-zinc-950 mt-16 transition-colors text-stone-600 dark:text-zinc-400 text-sm"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <!-- Brand Col -->
        <div class="md:col-span-2 space-y-3">
          <div class="flex items-center gap-2">
            <div
              class="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs"
            >
              <MapPin class="w-4 h-4 stroke-[2.2]" />
            </div>
            <span class="font-display font-bold text-lg text-stone-900 dark:text-zinc-100">
              Explore Semarang
            </span>
          </div>
          <p class="text-xs sm:text-sm text-stone-600 dark:text-zinc-400 max-w-sm leading-relaxed">
            Temukan tempat menarik, cicipi kuliner otentik, abadikan spot foto ikonik, dan susun rencana perjalanan kota sesuai budget serta waktumu.
          </p>
          <div class="pt-2 text-xs text-stone-500 dark:text-zinc-400">
            <span class="font-semibold text-stone-700 dark:text-zinc-300">Catatan Simulasi:</span>
            Seluruh data tempat, jam buka, dan harga tiket adalah data demo untuk evaluasi aplikasi client-side.
          </div>
        </div>

        <!-- Quick Links -->
        <div class="space-y-3">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-zinc-200">
            Navigasi Utama
          </h4>
          <ul class="space-y-2 text-xs">
            <li>
              <RouterLink to="/explore" class="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Eksplorasi Tempat
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/map" class="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Peta Interaktif
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/planner" class="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Trip Planner Otomatis
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/saved" class="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Tempat & Rute Favorit
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/trips" class="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Riwayat Rencana (My Trips)
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Explore & Admin Links -->
        <div class="space-y-3">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-zinc-200">
            Pengelolaan Data
          </h4>
          <ul class="space-y-2 text-xs">
            <li>
              <RouterLink to="/admin" class="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Demo Data Management
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/profile" class="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                Preferensi & Akun Demo
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="pt-8 border-t border-stone-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-zinc-400"
      >
        <p>© 2026 Explore Semarang · Dibuat dengan Vue 3, Pinia & Tailwind CSS</p>
        <div class="flex items-center gap-4">
          <span>Client-Side Local Storage</span>
          <span aria-hidden="true">·</span>
          <span>OpenStreetMap Leaflet</span>
        </div>
      </div>
    </div>
  </footer>
</template>
