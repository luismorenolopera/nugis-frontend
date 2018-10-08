<template lang="pug">
  v-container
    //- search input
    v-text-field(
      v-model='searchValue'
      box label='Buscar'
      append-icon='fas fa-search'
      clearable
      clear-icon='fas fa-times'
      @keyup.enter='search'
      @click:append='search'
    )
    //- results
    v-container(fluid grid-list-md)
      v-layout(row wrap)
        v-flex(
          v-for='track in tracks'
          :key='track.id'
          xs12 sm6
        )
          v-card
            aplayer(:music='track')
            v-card-actions(class='pa-0')
              v-spacer
              v-btn(icon)
                v-icon(size='18') fas fa-plus
              v-btn(icon)
                v-icon(size='18') fas fa-heart
</template>

<script>
import { HTTP } from '@/http-common.js'
import Aplayer from 'vue-aplayer'

export default {
  name: 'Search',
  components: {
    Aplayer
  },
  data: () => ({
    searchValue: '',
    tracks: []
  }),
  methods: {
    search () {
      let url = `music/tracks/?search=${this.searchValue}`
      HTTP.get(url).then(response => {
        console.log(response.data)
        this.tracks = this.setTracks(response.data.results)
      }).catch(e => {
        console.log(e.response)
      })
    },
    setTracks (tracks) {
      var list = []
      tracks.map(track => {
        try {
          track.artistTrack = track.artists[0].alias
        } catch (err) {
          track.artistTrack = 'Desconocido'
        }
        let {
          file: src,
          thumbnail: pic,
          title,
          artistTrack: artist
        } = { ...track }
        let newTrack = Object.assign(
          {},
          {
            src,
            pic,
            title,
            artist
          }
        )
        list.push(newTrack)
      })
      return list
    }
  }
}
</script>
