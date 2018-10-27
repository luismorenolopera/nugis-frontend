<template lang="pug">
  v-card
    aplayer(:music='normalizedTrack')
    v-card-actions(class='pa-0')
      v-spacer
      v-btn(icon)
        v-icon(size='18') fas fa-plus
      v-btn(icon)
        v-icon(size='18') fas fa-heart
</template>

<script>
import Aplayer from 'vue-aplayer'

export default {
  name: 'AppTrack',
  components: {
    Aplayer
  },
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
    }
  }

}
</script>
