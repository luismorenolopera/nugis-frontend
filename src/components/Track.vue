<template lang="pug">
  v-card
    aplayer(:music='normalizedTrack')
    v-card-actions(class='pa-0')
      v-spacer
      v-bottom-sheet(
        v-model='sheet'
        scrollable
      )
        v-btn(slot='activator' icon @click='showPlaylists')
          v-icon(size='18') fas fa-plus
        v-list
          v-subheader(class='subheading') Guardar en
          v-divider
          v-container(fluid)
            v-checkbox(
              v-for='playlist in playlists'
              :key='playlist.id'
              :label='playlist.name'
            )
          v-divider
          v-btn(block @click='sheet = !sheet') CERRAR
</template>

<script>
import { mapState } from 'vuex'
import Aplayer from 'vue-aplayer'

export default {
  name: 'AppTrack',
  components: {
    Aplayer
  },
  data: () => ({
    sheet: false
  }),
  props: {
    track: Object
  },
  computed: {
    normalizedTrack () {
      var artist = ''
      try {
        artist = this.track.artists[0].alias
      } catch (err) {
        artist = 'Desconocido'
      }
      let {
        file: src,
        thumbnail: pic,
        title
      } = { ...this.track }
      return Object.assign({}, { src, pic, title, artist })
    },
    ...mapState(['playlists'])
  },
  methods: {
    showPlaylists () {
      this.sheet = true
    }
  }
}
</script>
