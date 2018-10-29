<template lang="pug">
  v-container
    v-list
      div(
        v-for='playlist in playlists'
        :key='playlist.id'
        class='pointer'
        @click='openPlaylist(playlist.tracks)'
      )
        v-list-tile
          v-list-tile-action
            v-icon fas fa-play
          v-list-tile-content {{ playlist.name }}
        v-divider
</template>

<script>
import { HTTP } from '@/http-common'

export default {
  name: 'Library',
  data: () => ({
    playlists: []
  }),
  created: function () {
    let url = 'music/playlists/'
    HTTP.get(url).then(response => {
      this.playlists = response.data
    }).catch(e => {
      console.log(e.response)
    })
  },
  methods: {
    openPlaylist (tracks) {
      this.$store.commit('setTracks', { tracks: tracks })
      this.$router.push('/playlist')
    }
  }
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
