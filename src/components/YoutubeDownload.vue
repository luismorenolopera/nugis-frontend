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
      @keyup.enter='validate()'
      @click:append='validate()'
    )
    //- error
    v-snackbar(
      v-model='error'
      :bottom='true'
      :timeout='5000'
    ) {{ errorMessage }}
      v-btn(
        color='pink'
        flat
        @click='error = false'
      ) Cerrar
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
          v-btn(v-if='!track.file' @click='download()') DESCARGAR
            v-icon(right) fas fa-cloud-download-alt
          audio(v-else controls)
            source(:src='track.file' type='audio/mpeg')
    //- loader
    v-layout(v-else-if='loading' justify-center)
      atom-spinner(
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
    error: false,
    errorMessage: '',
    track: null,
    loading: false
  }),
  methods: {
    download () {
      this.loading = true
      var idVideo = this.track.id
      this.track = null
      HTTP.post('music/yt_upload', {
        id: idVideo
      }).then(response => {
        this.track = response.data
        this.loading = false
        console.log(response)
      }).catch(e => {
        this.error = true
        this.errorMessage = 'No es posible descargar este video en este momento'
        console.log(e)
      })
    },
    validate () {
      let params = this.searchValue.split('https://www.youtube.com/watch')
      let urlSearch = new URLSearchParams(params[1])
      let idVideo = urlSearch.get('v')
      if (idVideo) {
        this.search(idVideo)
      } else {
        this.error = true
        this.errorMessage = 'No es una url valida'
      }
    },
    search (idVideo) {
      this.loading = true
      this.track = null
      let url = `music/yt_upload?id=${idVideo}`
      HTTP.get(url).then(response => {
        console.log(response)
        this.track = response.data
        this.loading = false
      }).catch(e => {
        this.error = true
        this.errorMessage = 'Este video no existe'
        this.loading = false
        console.log(e)
      })
    }
  }
}
</script>
