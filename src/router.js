import Vue from 'vue'
import auth from '@/auth'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import Library from '@/views/Library.vue'
import Search from '@/views/Search.vue'
import Upload from '@/views/Upload.vue'
import Login from '@/views/Login.vue'
import Logout from '@/views/Logout.vue'
import SignUp from '@/views/SignUp.vue'
import Landing from '@/views/Landing.vue'

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
      path: '/signup',
      name: 'signup',
      component: SignUp
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth.loggedIn()) {
      // this route requires auth, check if logged in
      // if not, redirect to landing page.
      next({
        path: '/'
      })
    } else {
      next()
    }
  } else {
    // if is logged but the route not require login
    next({
      path: '/home'
    })
  }
})

export default router
