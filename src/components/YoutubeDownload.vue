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
    //- result video
    v-flex(v-if='track' xs12)
      v-card
        v-layout
          v-flex(xs5)
            v-img(
              :src='track.thumbnail'
              height='125px'
              contain
            )
          v-flex(xs7)
            v-card-title
              div(class='subheading') {{track.title}}
        v-divider(light)
        v-card-actions
          v-spacer
          v-btn DESCARGAR
            v-icon(right) fas fa-cloud-download-alt
    //- loader
    v-layout(v-else justify-center)
      atom-spinner(
        v-if='loading'
        :size='60'
        :animation-duration='800'
        color='#ff1d5e'
      )
</template>

<script>
import { HTTP } from '@/http-common.js'
import { AtomSpinner } from 'epic-spinners'

export default {
  name: 'YoutubeDownload',
  components: {
    AtomSpinner
  },
  data: () => ({
    searchValue: '',
    track: null,
    loading: false
  }),
  methods: {
    validate () {

    },
    search () {
      this.loading = true
      this.track = null
      let url = `music/yt_upload?id=${this.searchValue}`
      HTTP.get(url).then(response => {
        this.loading = false
        console.log(response)
        this.track = response.data
      }).catch(e => {
        this.loading = false
        console.log(e)
      })
    }
  }
}
</script>
