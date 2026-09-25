<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification.store';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-vue-next';

const notificationStore = useNotificationStore();

const getIcon = (type: string) => {
  switch (type) {
    case 'success': return CheckCircle2;
    case 'error': return AlertCircle;
    case 'warning': return AlertTriangle;
    default: return Info;
  }
};

const getStyle = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-emerald-950 text-emerald-100 border-emerald-800/80';
    case 'error':
      return 'bg-rose-950 text-rose-100 border-rose-800/80';
    case 'warning':
      return 'bg-amber-950 text-amber-100 border-amber-800/80';
    default:
      return 'bg-zinc-900 text-zinc-100 border-zinc-700/80';
  }
};
</script>

<template>
  <div class="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-4 opacity-0 scale-95"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform translate-y-2 opacity-0 scale-95"
    >
      <div
        v-for="toast in notificationStore.toasts"
        :key="toast.id"
        :class="[
          'pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md text-sm font-medium',
          getStyle(toast.type)
        ]"
      >
        <div class="flex items-center gap-2.5">
          <component :is="getIcon(toast.type)" class="w-4 h-4 shrink-0" />
          <span class="leading-snug">{{ toast.message }}</span>
        </div>
        <button
          @click="notificationStore.removeToast(toast.id)"
          class="text-current opacity-60 hover:opacity-100 p-0.5 rounded transition-opacity"
          aria-label="Tutup notifikasi"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
