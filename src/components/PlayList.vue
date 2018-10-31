<template lang="pug">
  aplayer(
    v-if='normalizedTracks.length > 0'
    :music='normalizedTracks[0]'
    :list='normalizedTracks'
  )
</template>
<script>
import { HTTP } from '@/http-common'
import Aplayer from 'vue-aplayer'
import { mapState } from 'vuex'

export default {
  name: 'AppPlaylist',
  components: {
    Aplayer
  },
  props: {
    id: Number
  },
  computed: {
    normalizedTracks () {
      var tracks = []
      var newTrack = {}
      var artist = ''
      this.tracks.map((track) => {
        try {
          artist = track.artists[0].alias
        } catch (err) {
          artist = 'Desconocido'
        }
        let {
          file: src,
          thumbnail: pic,
          title
        } = { ...track }
        newTrack = Object.assign({}, { src, pic, title, artist })
        tracks.push(newTrack)
      })
      return tracks
    },
    ...mapState(['tracks'])
  },
  created: function () {
    if (this.$store.state.tracks.length === 0) {
      let url = `music/playlists/${this.$route.query.id}/`
      HTTP.get(url).then(response => {
        this.$store.commit('setTracks', { tracks: response.data.tracks })
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>
