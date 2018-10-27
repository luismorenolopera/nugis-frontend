<template lang="pug">
  v-app(v-if='token' dark)
    v-navigation-drawer(v-model='drawer' clipped fixed app)
      v-list(dense v-for='(item, index) in items' :key='index')
        router-link(v-if='item.path' :to='item.path')
          v-list-tile
            v-list-tile-action
              v-icon {{item.icon}}
            v-list-tile-content
              v-list-tile-title {{item.title}}
        v-divider(v-else-if='item.divider' :key='index')
    v-toolbar(app fixed clipped-left)
      v-toolbar-side-icon(@click.stop='drawer = !drawer')
      v-toolbar-title Nugis
    v-content
      router-view
    v-footer(app fixed)
      span © Nugis - 2018
  v-app(v-else dark)
    router-view
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  data: () => ({
    drawer: null,
    items: [
      {
        title: 'Buscar',
        icon: 'fas fa-search',
        path: '/search'
      },
      {
        title: 'Inicio',
        icon: 'fas fa-home',
        path: '/home'
      },
      {
        title: 'Tu biblioteca',
        icon: 'fas fa-book',
        path: '/library'
      },
      {
        title: 'Agregar',
        icon: 'fas fa-upload',
        path: '/upload'
      },
      {
        divider: true
      },
      {
        title: 'Salir',
        icon: 'fas fa-sign-out-alt',
        path: '/logout'
      }
    ]
  }),
  computed: {
    ...mapState(['token'])
  }
}

</script>

<style>
a {
  color: inherit !important;
  text-decoration:none;
}

.centered {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
