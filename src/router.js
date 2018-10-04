import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Library from './views/Library.vue'
import Search from './views/Search.vue'
import Upload from './views/Upload.vue'
import Login from './views/Login.vue'
import SignUp from './views/SignUp.vue'
import Landing from './views/Landing.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/library',
      name: 'library',
      component: Library
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/upload',
      name: 'upload',
      component: Upload
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
    }
  ]
})
