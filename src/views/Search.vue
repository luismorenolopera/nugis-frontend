<template lang="pug">
  v-container
    //- search input
    v-text-field(
      v-model='searchValue'
      box
      label='Buscar'
      append-icon='fas fa-search'
      clearable
      clear-icon='fas fa-times'
      @keyup.enter='search'
      @click:append='search'
    )
    v-container(fluid grid-list-md)
      //- results
      v-layout(row wrap v-if='!loading')
        v-flex(
          v-for='track in tracks'
          :key='track.id'
          xs12 sm6
        )
          app-track(:track='track')
      //- loader
      atom-spinner(
        v-else
        :size='150'
        :animation-duration='800'
        color='#ff1d5e'
        class='centered'
      )
</template>

<script>
import { HTTP } from '@/http-common.js'
import AppTrack from '@/components/Track.vue'
import { AtomSpinner } from 'epic-spinners'

export default {
  name: 'Search',
  components: {
    AppTrack,
    AtomSpinner
  },
  data: () => ({
    searchValue: '',
    tracks: [],
    loading: false
  }),
  methods: {
    search () {
      this.loading = true
      let url = `music/tracks/?search=${this.searchValue}`
      HTTP.get(url).then(response => {
        this.tracks = response.data.results
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    }
  }
}
</script>
