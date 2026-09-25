<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { useNotificationStore } from '@/stores/notification.store';
import { MapPin, LogIn, ShieldAlert, ArrowRight } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const notification = useNotificationStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = () => {
  if (!email.value.trim()) {
    errorMessage.value = 'Silakan masukkan email kamu.';
    return;
  }

  const res = authStore.login(email.value, password.value);
  if (res.success) {
    notification.showToast(res.message);
    router.push('/profile');
  } else {
    errorMessage.value = res.message;
  }
};

const handleQuickDemoUser = () => {
  email.value = 'traveler@semarang.id';
  password.value = 'demo1234';
  handleLogin();
};
</script>

<template>
  <div class="min-h-[75vh] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md bg-white dark:bg-zinc-900 border border-stone-200/90 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      <!-- Brand & Title -->
      <div class="text-center space-y-2">
        <div class="inline-flex w-12 h-12 rounded-2xl bg-teal-600 text-white items-center justify-center shadow-md mb-2">
          <MapPin class="w-6 h-6 stroke-[2.2]" />
        </div>
        <h1 class="font-display font-extrabold text-2xl text-stone-900 dark:text-zinc-50 tracking-tight">
          Masuk ke Explore Semarang
        </h1>
        <p class="text-xs text-stone-500 dark:text-zinc-400">
          Simpan riwayat perjalanan dan sinkronkan preferensi wisatamu.
        </p>
      </div>

      <!-- Demo Disclaimer Box -->
      <div class="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/40 rounded-xl text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
        <ShieldAlert class="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <span class="leading-relaxed">
          <strong>Demo Auth Mode:</strong> Autentikasi ini berjalan sepenuhnya di peramban (client-side localStorage) untuk simulasi portfolio tanpa backend server.
        </span>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div v-if="errorMessage" class="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs rounded-xl font-medium">
          {{ errorMessage }}
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-zinc-400 mb-1">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="contoh@semarang.id"
            class="w-full px-4 py-2.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-stone-900 dark:text-zinc-100"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-zinc-400 mb-1">
            Kata Sandi (Demo)
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-stone-900 dark:text-zinc-100"
          />
        </div>

        <button
          type="submit"
          class="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <LogIn class="w-4 h-4" />
          <span>Masuk</span>
        </button>

        <button
          type="button"
          @click="handleQuickDemoUser"
          class="w-full py-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 text-xs font-semibold text-stone-700 dark:text-zinc-300 hover:bg-stone-50 dark:hover:bg-zinc-800 transition-colors"
        >
          Gunakan Akun Demo Otomatis
        </button>
      </form>

      <!-- Footer redirect to register -->
      <div class="text-center pt-2 text-xs text-stone-500 dark:text-zinc-400">
        Belum punya akun demo?
        <RouterLink to="/register" class="font-bold text-teal-600 dark:text-teal-400 hover:underline ml-1">
          Daftar sekarang
        </RouterLink>
      </div>
    </div>
  </div>
</template>
