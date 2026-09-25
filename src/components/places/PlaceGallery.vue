<script setup lang="ts">
import { ref } from 'vue';
import SafeImage from '@/components/common/SafeImage.vue';
import { Eye, ChevronLeft, ChevronRight, X } from 'lucide-vue-next';

const props = defineProps<{
  images: string[];
  placeName: string;
  category: string;
}>();

const activeIndex = ref(0);
const isModalOpen = ref(false);

const openLightbox = (index: number) => {
  activeIndex.value = index;
  isModalOpen.value = true;
};

const nextImage = () => {
  activeIndex.value = (activeIndex.value + 1) % props.images.length;
};

const prevImage = () => {
  activeIndex.value = (activeIndex.value - 1 + props.images.length) % props.images.length;
};
</script>

<template>
  <div class="space-y-3">
    <!-- Main featured banner -->
    <div
      @click="openLightbox(activeIndex)"
      class="relative aspect-16/9 sm:aspect-21/9 rounded-3xl overflow-hidden cursor-pointer group shadow-sm bg-stone-100 dark:bg-zinc-800"
    >
      <SafeImage
        :src="images[activeIndex] || images[0]"
        :alt="placeName"
        :category="category"
        aspect-ratio="aspect-16/9 sm:aspect-21/9"
        container-class="w-full h-full"
      />

      <div
        class="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 text-white"
      >
        <div class="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md text-xs font-medium flex items-center gap-2">
          <Eye class="w-4 h-4" />
          Lihat Foto Penuh ({{ images.length }})
        </div>
      </div>
    </div>

    <!-- Thumbnails if more than 1 -->
    <div v-if="images.length > 1" class="flex gap-2.5 overflow-x-auto pb-1">
      <button
        v-for="(img, idx) in images"
        :key="idx"
        type="button"
        @click="activeIndex = idx"
        :class="[
          'relative w-20 sm:w-24 aspect-4/3 rounded-xl overflow-hidden shrink-0 border-2 transition-all',
          activeIndex === idx
            ? 'border-teal-600 scale-95 shadow-xs'
            : 'border-transparent opacity-70 hover:opacity-100'
        ]"
      >
        <SafeImage
          :src="img"
          :alt="`${placeName} foto ${idx + 1}`"
          :category="category"
          aspect-ratio="aspect-4/3"
          container-class="w-full h-full"
        />
      </button>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        @click.self="isModalOpen = false"
      >
        <button
          @click="isModalOpen = false"
          class="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          aria-label="Tutup foto"
        >
          <X class="w-6 h-6" />
        </button>

        <div class="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center">
          <img
            :src="images[activeIndex]"
            :alt="placeName"
            referrerpolicy="no-referrer"
            class="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl"
          />

          <button
            v-if="images.length > 1"
            @click.stop="prevImage"
            class="absolute left-2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft class="w-6 h-6" />
          </button>

          <button
            v-if="images.length > 1"
            @click.stop="nextImage"
            class="absolute right-2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
            aria-label="Foto berikutnya"
          >
            <ChevronRight class="w-6 h-6" />
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
