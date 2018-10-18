<template lang="pug">
  v-container
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
    //- loader
    atom-spinner(
      v-if='loading'
      :size='150'
      :animation-duration='800'
      color='#ff1d5e'
      class='centered'
    )
    //- form
    v-layout(row wrap v-if='!loading')
      v-flex(xs12)
        v-text-field(
          v-model='title'
          name='titulo'
          label='Titulo'
          counter
          maxlength='100'
          v-validate="'required|max:100'"
          :error-messages="errors.collect('titulo')"
        )
      v-flex(xs12)
        v-text-field(
          v-model='thumbnail'
          name='imagen'
          label='Imagen'
          counter
          maxlength='200'
          placeholder='https://image.ibb.co/n8C5De/image-1.png'
          v-validate="'max:200|url'"
          :error-messages="errors.collect('imagen')"
        )
      v-flex(xs12)
        v-btn(
          @click='openFileDialog'
          block
          round
        ) SELECCIONAR ARCHIVO
          v-icon(right) fas fa-file
      v-flex(xs12)
        p(v-if='file' class='title') {{ file.name }}
      input(
        type='file'
        ref='file'
        @change='updateFile'
        style='display:none'
      )
      v-flex(xs12)
        v-btn(
          type='submit'
          @click.stop.prevent='validate'
          block
          round
        ) SUBIR
          v-icon(right) fas fa-upload
</template>

<script>
import { HTTP } from '@/http-common.js'
import { AtomSpinner } from 'epic-spinners'

export default {
  name: 'UploadLocalFile',
  components: {
    AtomSpinner
  },
  data: () => ({
    title: '',
    thumbnail: '',
    file: null,
    snackbar: false,
    snackbarMessage: '',
    loading: false
  }),
  methods: {
    openFileDialog () {
      this.$refs.file.click()
    },
    updateFile (e) {
      this.file = e.target.files[0]
      if (this.file.type !== 'audio/mp3') {
        this.snackbar = true
        this.snackbarMessage = 'Solo se permiten archivos mp3'
        this.file = null
      } else if (this.file.size > 10000000) {
        this.snackbar = true
        this.snackbarMessage = 'El archivo no puede superar los 10MB'
        this.file = null
      }
    },
    validate () {
      if (this.errors.items.length > 0) return
      return this.$validator.validateAll().then((result) => {
        if (!result) return
        this.saveTrack()
      })
    },
    saveTrack () {
      this.loading = true
      let body = new FormData()
      let url = 'music/tracks/'
      body.append('title', this.title)
      body.append('thumbnail', this.thumbnail)
      body.append('file', this.file)
      HTTP.post(url, body).then(response => {
        this.loading = false
        console.log(response)
      }).catch(e => {
        this.loading = false
        console.log(e)
      })
    }
  }
}
</script>
