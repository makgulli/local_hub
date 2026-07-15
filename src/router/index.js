import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/board',
    name: 'board-list',
    component: () => import('@/views/BoardListView.vue'),
  },
  {
    path: '/board/write',
    name: 'board-write',
    component: () => import('@/views/BoardWriteView.vue'),
  },
  {
    path: '/board/:id',
    name: 'board-detail',
    component: () => import('@/views/BoardDetailView.vue'),
    props: true,
  },
  {
    path: '/board/:id/edit',
    name: 'board-edit',
    component: () => import('@/views/BoardWriteView.vue'),
    props: true,
  },
  {
    path: '/weather',
    name: 'weather',
    component: () => import('@/views/WeatherView.vue'),
  },
  {
  path: '/category/:slug',
  name: 'category',
  component: () => import('@/views/CategoryView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
