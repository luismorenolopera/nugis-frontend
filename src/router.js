import Vue from 'vue'
import Router from 'vue-router'
import auth from '@/auth'
import Home from '@/views/Home.vue'
import Library from '@/views/Library.vue'
import Search from '@/views/Search.vue'
import Upload from '@/views/Upload.vue'
import Logout from '@/views/Logout.vue'
import Landing from '@/views/Landing.vue'
import PlayListDetail from '@/views/PlayListDetail.vue'
import PageNotFound from '@/views/PageNotFound.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/library',
      name: 'library',
      component: Library,
      meta: { requiresAuth: true }
    },
    {
      path: '/playlist',
      name: '',
      component: PlayListDetail,
      meta: { requiresAuth: true }
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
      meta: { requiresAuth: true }
    },
    {
      path: '/upload',
      name: 'upload',
      component: Upload,
      meta: { requiresAuth: true }
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout,
      meta: { requiresAuth: true }
    },
    {
      path: '*',
      name: 'not-found',
      component: PageNotFound,
      meta: { requiresAuth: true }
    }
  ]
})

// requiresAuth Guard
router.beforeEach((to, from, next) => {
  var requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth && !auth.isLogged()) {
    // this route requires auth, check if logged in
    // if not, redirect to landing page.
    next({
      path: '/'
    })
  } else if (!requiresAuth && auth.isLogged()) {
    // if is logged but the route not require login
    next({
      path: '/home'
    })
  } else {
    next()
  }
})

export default router
