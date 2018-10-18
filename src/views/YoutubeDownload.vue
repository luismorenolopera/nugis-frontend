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
    //- snackbar
    v-snackbar(
      v-model='snackbar'
      :bottom='true'
      :timeout='5000'
    ) {{ snackbarMessage }}
      v-btn(
        color='pink'
        flat
        @click='snackbar = false'
      ) Cerrar
    //- result video
    v-flex(xs12)
      v-card(v-if='track && !track.file')
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
          v-btn(@click='download()') DESCARGAR
            v-icon(right) fas fa-cloud-download-alt
      app-track(
        v-else-if='track && track.file'
        :track='track'
      )
    //- loader
    atom-spinner(
      v-if='loading'
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
  name: 'YoutubeDownload',
  components: {
    AppTrack,
    AtomSpinner
  },
  data: () => ({
    searchValue: '',
    snackbar: false,
    snackbarMessage: '',
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
        this.snackbar = true
        this.snackbarMessage = 'No es posible descargar este video en este momento'
        console.log(e)
      })
    },
    validate () {
      var idVideo = null
      if (this.searchValue.includes('https://www.youtube.com/watch')) {
        let params = this.searchValue.split('https://www.youtube.com/watch')
        let urlSearch = new URLSearchParams(params[1])
        idVideo = urlSearch.get('v')
      } else if (this.searchValue.includes('https://youtu.be/')) {
        idVideo = this.searchValue.split('https://youtu.be/')[1]
      }
      if (idVideo) {
        this.search(idVideo)
      } else {
        this.snackbar = true
        this.snackbarMessage = 'No es una url valida'
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
        this.snackbar = true
        this.snackbarMessage = 'Este video no existe'
        this.loading = false
        console.log(e)
      })
    }
  }
}
</script>
