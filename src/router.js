import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from './stores/auth'
import Home from './views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: () => import('./views/Landing.vue'), meta: { public: true } },
    { path: '/home', name: 'home', component: Home },
    { path: '/search', name: 'search', component: () => import('./views/Search.vue') },
    { path: '/library', name: 'library', component: () => import('./views/Library.vue') },
    { path: '/playlist/:id', name: 'playlist', component: () => import('./views/PlaylistDetail.vue'), props: true },
    { path: '/upload', name: 'upload', component: () => import('./views/Upload.vue') },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('./views/NotFound.vue'), meta: { public: true } }
  ],
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to) => {
  const auth = useAuth()
  if (!to.meta.public && !auth.isLogged) return { name: 'landing' }
  if (to.name === 'landing' && auth.isLogged) return { name: 'home' }
})

export default router
