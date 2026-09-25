<script setup lang="ts">
import { ref } from 'vue';
import { usePlacesStore } from '@/stores/places.store';
import { useNotificationStore } from '@/stores/notification.store';
import { CATEGORIES } from '@/data/categories';
import type { Place, PlaceCategory } from '@/types';
import { formatCurrency } from '@/utils/formatCurrency';
import ConfirmModal from '@/components/common/ConfirmModal.vue';
import {
  Database,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  ShieldAlert,
  X,
  Check,
} from 'lucide-vue-next';

const placesStore = usePlacesStore();
const notification = useNotificationStore();

const isModalOpen = ref(false);
const editingPlaceId = ref<string | null>(null);
const showResetModal = ref(false);

const form = ref<Partial<Place>>({
  name: '',
  category: 'Wisata',
  description: '',
  shortDescription: '',
  image: '',
  address: '',
  district: 'Semarang Tengah',
  priceMin: 0,
  priceMax: 25000,
  rating: 4.5,
  reviewCount: 50,
  averageVisitMinutes: 60,
  tags: ['wisata', 'semarang'],
  openingHours: {
    open: '08:00',
    close: '21:00',
    days: 'Setiap Hari',
  },
  facilities: ['Toilet', 'Parkir'],
  popularityScore: 85,
  whyPeopleLikeIt: ['Spot menarik di pusat kota'],
});

const openAddModal = () => {
  editingPlaceId.value = null;
  form.value = {
    name: '',
    category: 'Wisata',
    description: '',
    shortDescription: '',
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1000&q=80',
    address: 'Jl. Pemuda No. 1, Semarang',
    district: 'Semarang Tengah',
    latitude: -6.9800,
    longitude: 110.4200,
    priceMin: 0,
    priceMax: 25000,
    rating: 4.5,
    reviewCount: 10,
    averageVisitMinutes: 60,
    tags: ['semarang', 'eksplorasi'],
    openingHours: { open: '08:00', close: '21:00', days: 'Setiap Hari' },
    facilities: ['Toilet', 'Parkir', 'Musholla'],
    popularityScore: 85,
    whyPeopleLikeIt: ['Suasana menyenangkan dan akses mudah'],
  };
  isModalOpen.value = true;
};

const openEditModal = (place: Place) => {
  editingPlaceId.value = place.id;
  form.value = JSON.parse(JSON.stringify(place));
  isModalOpen.value = true;
};

const handleSave = () => {
  if (!form.value.name || !form.value.category) {
    notification.showToast('Nama dan kategori wajib diisi.', 'warning');
    return;
  }

  const slug = form.value.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  if (editingPlaceId.value) {
    placesStore.updatePlace({
      ...form.value as Place,
      id: editingPlaceId.value,
      slug,
    });
    notification.showToast('Tempat berhasil diperbarui.');
  } else {
    const newPlace: Place = {
      ...form.value as Place,
      id: 'place-' + Date.now(),
      slug,
      gallery: [form.value.image || ''],
    };
    placesStore.addPlace(newPlace);
    notification.showToast('Tempat baru berhasil ditambahkan ke data lokal.');
  }

  isModalOpen.value = false;
};

const handleDelete = (id: string) => {
  if (confirm('Yakin ingin menghapus tempat ini?')) {
    placesStore.deletePlace(id);
    notification.showToast('Tempat dihapus.', 'info');
  }
};

const handleResetDemoData = () => {
  placesStore.resetToDemoData();
  showResetModal.value = false;
  notification.showToast('Data demo berhasil direset ke kondisi awal.');
};
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Header with Demo Notice -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-2">
          <Database class="w-3.5 h-3.5" />
          <span>Demo Data Management (Client-Side)</span>
        </div>

        <h1 class="font-display font-extrabold text-3xl sm:text-4xl text-stone-900 dark:text-zinc-50 tracking-tight">
          Kelola Data Destinasi
        </h1>
        <p class="text-sm text-stone-500 dark:text-zinc-400 mt-1">
          Halaman simulasi manajemen data untuk demonstrasi portfolio. Perubahan disimpan di localStorage.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="showResetModal = true"
          class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-zinc-800 text-stone-700 dark:text-zinc-300 hover:bg-stone-100 dark:hover:bg-zinc-800 text-xs font-semibold transition-colors"
        >
          <RotateCcw class="w-4 h-4 text-amber-500" />
          <span>Reset Demo Data</span>
        </button>

        <button
          type="button"
          @click="openAddModal"
          class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus class="w-4 h-4" />
          <span>Tambah Tempat</span>
        </button>
      </div>
    </div>

    <!-- Table of Places -->
    <div class="bg-white dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-stone-700 dark:text-zinc-300">
          <thead class="bg-stone-50 dark:bg-zinc-850 border-b border-stone-200 dark:border-zinc-800 text-stone-500 dark:text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th class="p-4 pl-6">Nama Tempat</th>
              <th class="p-4">Kategori</th>
              <th class="p-4">Wilayah</th>
              <th class="p-4">Estimasi Biaya</th>
              <th class="p-4">Rating</th>
              <th class="p-4 text-right pr-6">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100 dark:divide-zinc-800/80">
            <tr
              v-for="place in placesStore.allPlaces"
              :key="place.id"
              class="hover:bg-stone-50/60 dark:hover:bg-zinc-850/60 transition-colors"
            >
              <td class="p-4 pl-6 font-bold text-stone-900 dark:text-zinc-100">
                {{ place.name }}
              </td>
              <td class="p-4">
                <span class="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-semibold text-[11px]">
                  {{ place.category }}
                </span>
              </td>
              <td class="p-4">{{ place.district }}</td>
              <td class="p-4 font-mono tabular-nums">
                {{ formatCurrency(place.priceMin) }} - {{ formatCurrency(place.priceMax) }}
              </td>
              <td class="p-4 font-bold text-amber-500">
                ⭐ {{ place.rating.toFixed(1) }}
              </td>
              <td class="p-4 text-right pr-6 space-x-2">
                <button
                  type="button"
                  @click="openEditModal(place)"
                  class="p-1.5 text-stone-500 hover:text-teal-600 rounded-lg transition-colors"
                  title="Edit tempat"
                >
                  <Edit2 class="w-4 h-4" />
                </button>
                <button
                  type="button"
                  @click="handleDelete(place.id)"
                  class="p-1.5 text-stone-500 hover:text-rose-500 rounded-lg transition-colors"
                  title="Hapus tempat"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit/Add Modal -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      >
        <div class="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-stone-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-5 my-8">
          <div class="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-zinc-800">
            <h3 class="font-display font-bold text-lg text-stone-900 dark:text-zinc-100">
              {{ editingPlaceId ? 'Edit Tempat' : 'Tambah Tempat Baru' }}
            </h3>
            <button
              @click="isModalOpen = false"
              class="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-zinc-200 rounded-lg"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="handleSave" class="space-y-4 text-xs">
            <div>
              <label class="block font-semibold mb-1 text-stone-700 dark:text-zinc-300">Nama Tempat</label>
              <input
                v-model="form.name"
                required
                class="w-full p-2.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold mb-1 text-stone-700 dark:text-zinc-300">Kategori</label>
                <select
                  v-model="form.category"
                  class="w-full p-2.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl"
                >
                  <option v-for="c in CATEGORIES" :key="c.id" :value="c.name">
                    {{ c.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block font-semibold mb-1 text-stone-700 dark:text-zinc-300">Wilayah (Kecamatan)</label>
                <input
                  v-model="form.district"
                  class="w-full p-2.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label class="block font-semibold mb-1 text-stone-700 dark:text-zinc-300">Deskripsi Singkat</label>
              <input
                v-model="form.shortDescription"
                class="w-full p-2.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl"
              />
            </div>

            <div>
              <label class="block font-semibold mb-1 text-stone-700 dark:text-zinc-300">Alamat Lengkap</label>
              <input
                v-model="form.address"
                class="w-full p-2.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold mb-1 text-stone-700 dark:text-zinc-300">Harga Min (Rp)</label>
                <input
                  v-model.number="form.priceMin"
                  type="number"
                  class="w-full p-2.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl font-mono"
                />
              </div>

              <div>
                <label class="block font-semibold mb-1 text-stone-700 dark:text-zinc-300">Harga Max (Rp)</label>
                <input
                  v-model.number="form.priceMax"
                  type="number"
                  class="w-full p-2.5 bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 rounded-xl font-mono"
                />
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-4">
              <button
                type="button"
                @click="isModalOpen = false"
                class="px-4 py-2 rounded-xl text-stone-600 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Reset Confirmation Modal -->
    <ConfirmModal
      :show="showResetModal"
      :is-destructive="true"
      title="Reset ke Data Demo Awal?"
      message="Ini akan menghapus seluruh modifikasi lokal pada daftar tempat dan mengembalikannya ke 32 tempat bawaan Explore Semarang."
      confirm-text="Reset Sekarang"
      @confirm="handleResetDemoData"
      @cancel="showResetModal = false"
    />
  </div>
</template>
