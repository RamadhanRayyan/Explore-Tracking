<script setup lang="ts">
import { onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settings.store';
import Navbar from '@/components/layout/Navbar.vue';
import MobileBottomNav from '@/components/layout/MobileBottomNav.vue';
import Footer from '@/components/layout/Footer.vue';
import Toast from '@/components/common/Toast.vue';
import OnboardingModal from '@/components/common/OnboardingModal.vue';

const settingsStore = useSettingsStore();

onMounted(() => {
  settingsStore.applyTheme();
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-stone-50 dark:bg-zinc-950 text-stone-800 dark:text-zinc-100 transition-colors duration-200">
    <!-- Desktop & Mobile Top Bar -->
    <Navbar />

    <!-- Main View Content Area -->
    <main class="flex-1 pb-16 md:pb-0">
      <RouterView v-slot="{ Component }">
        <Transition
          name="fade"
          mode="out-in"
        >
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- Global Footer -->
    <Footer />

    <!-- Mobile Bottom Navigation (Visible on phones) -->
    <MobileBottomNav />

    <!-- Global Toast Notifications -->
    <Toast />

    <!-- Optional First-Time Onboarding Modal -->
    <OnboardingModal />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
