<script setup lang="ts">
import { AlertTriangle, X } from 'lucide-vue-next';

defineProps<{
  show: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        @click.self="emit('cancel')"
      >
        <div
          class="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-stone-200 dark:border-zinc-800 shadow-2xl p-6 overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          <div class="flex items-start justify-between gap-4 mb-4">
            <div class="flex items-center gap-3">
              <div
                :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                  isDestructive
                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                    : 'bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400'
                ]"
              >
                <AlertTriangle class="w-5 h-5" />
              </div>
              <h3 class="text-base font-semibold text-stone-900 dark:text-zinc-100">
                {{ title }}
              </h3>
            </div>
            <button
              @click="emit('cancel')"
              class="text-stone-400 hover:text-stone-600 dark:hover:text-zinc-300 p-1 rounded-lg"
              aria-label="Tutup"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <p class="text-sm text-stone-600 dark:text-zinc-400 mb-6 leading-relaxed">
            {{ message }}
          </p>

          <div class="flex items-center justify-end gap-3">
            <button
              @click="emit('cancel')"
              class="px-4 py-2 text-sm font-medium text-stone-600 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              {{ cancelText || 'Batal' }}
            </button>
            <button
              @click="emit('confirm')"
              :class="[
                'px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-xs transition-colors',
                isDestructive
                  ? 'bg-rose-600 hover:bg-rose-700'
                  : 'bg-teal-600 hover:bg-teal-700'
              ]"
            >
              {{ confirmText || 'Konfirmasi' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
