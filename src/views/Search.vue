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
          xs6 sm4
        )
          v-card
            v-img(
              :src='track.thumbnail'
              aspect-ratio='1'
            )
            v-card-actions
              v-spacer
              v-btn(icon)
                v-icon fas fa-plus
              v-btn(icon)
                v-icon fas fa-heart
</template>

<script>
import { HTTP } from '@/http-common.js'

export default {
  name: 'Search',
  data: () => ({
    searchValue: '',
    tracks: []
  }),
  methods: {
    search () {
      let url = `music/tracks/?search=${this.searchValue}`
      HTTP.get(url).then(response => {
        console.log(response.data)
        this.tracks = response.data.results
      }).catch(e => {
        console.log(e.response)
      })
    }
  }
}
</script>
