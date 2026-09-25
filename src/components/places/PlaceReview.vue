<script setup lang="ts">
import { ref, computed } from 'vue';
import { useReviewStore } from '@/stores/review.store';
import { useAuthStore } from '@/stores/auth.store';
import { Star, MessageSquarePlus, Trash2, ShieldAlert } from 'lucide-vue-next';

const props = defineProps<{
  placeId: string;
  baseRating: number;
  baseReviewCount: number;
}>();

const reviewStore = useReviewStore();
const authStore = useAuthStore();

const showWriteForm = ref(false);
const newRating = ref(5);
const newComment = ref('');
const customUserName = ref('');

const reviews = computed(() => reviewStore.getPlaceReviews(props.placeId));
const stats = computed(() => reviewStore.getRatingStats(props.placeId, props.baseRating, props.baseReviewCount));

const handleStarClick = (val: number) => {
  newRating.value = val;
};

const submitReview = () => {
  if (!newComment.value.trim()) return;

  const author = customUserName.value.trim() || authStore.currentUser?.name || 'Wisatawan Lokal';
  const authorId = authStore.currentUser?.id || 'local-guest';

  reviewStore.addReview(
    props.placeId,
    newRating.value,
    newComment.value.trim(),
    author,
    authorId
  );

  newComment.value = '';
  showWriteForm.value = false;
};

const handleDeleteReview = (reviewId: string) => {
  reviewStore.deleteReview(props.placeId, reviewId);
};
</script>

<template>
  <div class="space-y-8">
    <!-- Header & Summary Breakdown -->
    <div class="p-6 bg-stone-50 dark:bg-zinc-850 rounded-2xl border border-stone-200/80 dark:border-zinc-800">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <!-- Average Score Column -->
        <div class="md:col-span-4 flex flex-col items-center justify-center text-center sm:border-r sm:border-stone-200 dark:sm:border-zinc-800 sm:pr-6">
          <span class="font-display font-black text-5xl text-stone-900 dark:text-zinc-50 tracking-tight tabular-nums">
            {{ stats.averageRating.toFixed(1) }}
          </span>
          <div class="flex items-center gap-1 my-2 text-amber-500">
            <Star
              v-for="i in 5"
              :key="i"
              :class="[
                'w-4 h-4',
                i <= Math.round(stats.averageRating) ? 'fill-current' : 'text-stone-300 dark:text-zinc-600'
              ]"
            />
          </div>
          <span class="text-xs text-stone-500 dark:text-zinc-400">
            Berdasarkan {{ stats.totalCount.toLocaleString() }} ulasan
          </span>
        </div>

        <!-- Rating Distribution Bars -->
        <div class="md:col-span-8 space-y-2">
          <div
            v-for="(percent, starKey) in [
              { star: 5, val: stats.percentages.star5 },
              { star: 4, val: stats.percentages.star4 },
              { star: 3, val: stats.percentages.star3 },
              { star: 2, val: stats.percentages.star2 },
              { star: 1, val: stats.percentages.star1 },
            ]"
            :key="percent.star"
            class="flex items-center gap-3 text-xs text-stone-600 dark:text-zinc-400"
          >
            <span class="w-8 shrink-0 flex items-center gap-1 font-semibold text-stone-700 dark:text-zinc-300">
              {{ percent.star }} <Star class="w-3 h-3 fill-current text-amber-500" />
            </span>
            <div class="flex-1 h-2 rounded-full bg-stone-200 dark:bg-zinc-700 overflow-hidden">
              <div
                class="h-full bg-amber-400 rounded-full transition-all duration-500"
                :style="{ width: `${percent.val}%` }"
              />
            </div>
            <span class="w-10 text-right text-[11px] font-mono tabular-nums text-stone-500 dark:text-zinc-400">
              {{ percent.val }}%
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Write Review Action -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h4 class="font-display font-bold text-lg text-stone-900 dark:text-zinc-100">
          Ulasan Komunitas
        </h4>
        <p class="text-xs text-stone-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
          <ShieldAlert class="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          Review tersimpan secara lokal di browser kamu.
        </p>
      </div>

      <button
        v-if="!showWriteForm"
        type="button"
        @click="showWriteForm = true"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
      >
        <MessageSquarePlus class="w-4 h-4" />
        Tulis Ulasan
      </button>
    </div>

    <!-- Review Form -->
    <div
      v-if="showWriteForm"
      class="p-5 bg-white dark:bg-zinc-900 border border-teal-200 dark:border-teal-900/60 rounded-2xl shadow-sm space-y-4"
    >
      <h5 class="text-sm font-semibold text-stone-900 dark:text-zinc-100">
        Bagikan Pengalamanmu
      </h5>

      <!-- Star Selector -->
      <div class="flex items-center gap-2">
        <span class="text-xs text-stone-500 dark:text-zinc-400 mr-2">Beri Nilai:</span>
        <button
          v-for="s in 5"
          :key="s"
          type="button"
          @click="handleStarClick(s)"
          class="p-1 focus:outline-hidden hover:scale-110 transition-transform"
        >
          <Star
            :class="[
              'w-6 h-6',
              s <= newRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300 dark:text-zinc-600'
            ]"
          />
        </button>
      </div>

      <!-- Optional Name -->
      <div v-if="!authStore.currentUser">
        <label class="block text-xs font-medium text-stone-600 dark:text-zinc-400 mb-1">
          Nama Kamu (Opsional)
        </label>
        <input
          v-model="customUserName"
          type="text"
          placeholder="Contoh: Rian Traveler"
          class="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <!-- Comment textarea -->
      <div>
        <label class="block text-xs font-medium text-stone-600 dark:text-zinc-400 mb-1">
          Komentar Ulasan
        </label>
        <textarea
          v-model="newComment"
          rows="3"
          placeholder="Ceritakan suasana, tips berkunjung, atau menu favoritmu di sini..."
          class="w-full p-3 text-xs bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-teal-500 resize-none"
        />
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          @click="showWriteForm = false"
          class="px-3.5 py-1.5 text-xs font-medium text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
        >
          Batal
        </button>
        <button
          type="button"
          @click="submitReview"
          :disabled="!newComment.trim()"
          class="px-4 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors"
        >
          Kirim Ulasan
        </button>
      </div>
    </div>

    <!-- Review List -->
    <div class="space-y-4">
      <div
        v-for="r in reviews"
        :key="r.id"
        class="p-4 bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 rounded-2xl shadow-2xs space-y-2"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div
              class="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center uppercase"
            >
              {{ r.userName.charAt(0) }}
            </div>
            <div>
              <span class="text-xs font-bold text-stone-900 dark:text-zinc-100 block">
                {{ r.userName }}
              </span>
              <span class="text-[11px] text-stone-400 dark:text-zinc-500">
                {{ r.date }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <div class="flex text-amber-500 text-xs">
              <Star
                v-for="i in 5"
                :key="i"
                :class="['w-3.5 h-3.5', i <= r.rating ? 'fill-current' : 'text-stone-300 dark:text-zinc-700']"
              />
            </div>

            <!-- Delete if user's own local review -->
            <button
              v-if="r.isLocalUser"
              type="button"
              @click="handleDeleteReview(r.id)"
              class="p-1 text-stone-400 hover:text-rose-500 transition-colors"
              title="Hapus ulasan saya"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <p class="text-xs text-stone-700 dark:text-zinc-300 leading-relaxed pt-1">
          {{ r.comment }}
        </p>
      </div>

      <div
        v-if="reviews.length === 0"
        class="py-8 text-center text-xs text-stone-500 dark:text-zinc-400"
      >
        Belum ada ulasan lokal untuk tempat ini. Jadilah yang pertama memberikan ulasan!
      </div>
    </div>
  </div>
</template>
