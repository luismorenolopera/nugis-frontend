<template lang="pug">
  aplayer(
    :music='normalizedTracks[0]'
    :list='normalizedTracks'
  )
</template>
<script>
import Aplayer from 'vue-aplayer'

export default {
  name: 'AppPlaylist',
  components: {
    Aplayer
  },
  props: {
    tracks: Array
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
    }
  }
}
</script>
