import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Explore Semarang | Temukan Tempat & Susun Perjalanan' },
  },
  {
    path: '/explore',
    name: 'explore',
    component: () => import('@/views/ExploreView.vue'),
    meta: { title: 'Jelajahi Tempat Menarik di Semarang' },
  },
  {
    path: '/map',
    name: 'map',
    component: () => import('@/views/MapView.vue'),
    meta: { title: 'Peta Interaktif Semarang' },
  },
  {
    path: '/places/:slug',
    name: 'place-detail',
    component: () => import('@/views/PlaceDetailView.vue'),
    meta: { title: 'Detail Tempat Wisata & Kuliner' },
  },
  {
    path: '/planner',
    name: 'planner',
    component: () => import('@/views/PlannerView.vue'),
    meta: { title: 'Trip Planner | Susun Rute Sesuai Budget & Waktu' },
  },
  {
    path: '/saved',
    name: 'saved',
    component: () => import('@/views/SavedView.vue'),
    meta: { title: 'Tempat & Rute Tersimpan' },
  },
  {
    path: '/trips',
    name: 'trips',
    component: () => import('@/views/TripsView.vue'),
    meta: { title: 'My Trips | Riwayat Rencana Perjalanan' },
  },
  {
    path: '/trips/:id',
    name: 'trip-detail',
    component: () => import('@/views/TripDetailView.vue'),
    meta: { title: 'Rincian Perjalanan' },
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { title: 'Profil & Preferensi Pengguna' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Masuk | Explore Semarang' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { title: 'Daftar Akun | Explore Semarang' },
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/AdminView.vue'),
    meta: { title: 'Demo Data Management | Explore Semarang' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
});

router.afterEach((to) => {
  const baseTitle = 'Explore Semarang';
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title}`;
  } else {
    document.title = baseTitle;
  }
});

export default router;
