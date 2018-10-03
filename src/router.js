import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Library from './views/Library.vue'
import Search from './views/Search.vue'
import Upload from './views/Upload.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
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
    }
  ]
})
