<template lang="pug">
  v-card
    aplayer(:music='normalizedTrack')
    v-card-actions(class='pa-0')
      v-spacer
      v-bottom-sheet(
        v-model='sheet'
        scrollable
      )
        v-btn(slot='activator' icon @click='getPlaylists')
          v-icon(size='18') fas fa-plus
        v-list
          v-subheader(class='subheading') Guardar en
          v-divider
          v-container(fluid)
            v-checkbox(
              v-model='selectedPlaylists'
              v-for='playlist in playlists'
              :key='playlist.id'
              :label='playlist.name'
              :value='playlist.id'
            )
          v-divider
          v-btn(block @click='save') CERRAR
</template>

<script>
import { HTTP } from '@/http-common'
import { mapState } from 'vuex'
import Aplayer from 'vue-aplayer'

export default {
  name: 'AppTrack',
  components: {
    Aplayer
  },
  data: () => ({
    sheet: false,
    selectedPlaylists: []
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
    save () {
      this.sheet = false
      console.log(this.selectedPlaylists)
      let url = 'music/playlists/track'
      HTTP.post(url, {
        playlists: this.selectedPlaylists,
        track: this.track.id
      }).then(response => {
        console.log(response)
      }).catch(e => {
        console.log(e.response)
      })
    },
    getPlaylists () {
      this.sheet = true
      let url = `music/playlists/track?id=${this.track.id}`
      HTTP.get(url).then(response => {
        response.data.map(item => {
          this.selectedPlaylists.push(item.playlist)
        })
      }).catch(e => {
        console.log(e.response)
      })
    }
  }
}
</script>
