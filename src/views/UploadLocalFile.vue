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
    //- form
    v-layout(row wrap)
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
          v-model='image'
          name='imagen'
          label='Imagen'
          counter
          maxlength='200'
          placeholder='https://image.ibb.co/n8C5De/image-1.png'
          v-validate="'required|max:200|url'"
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
export default {
  name: 'UploadLocalFile',
  data: () => ({
    title: '',
    image: '',
    file: null,
    snackbar: false,
    snackbarMessage: ''
  }),
  methods: {
    openFileDialog () {
      this.$refs.file.click()
    },
    updateFile (e) {
      this.file = e.target.files[0]
      if (this.file.type !== 'audio/mp3') {
        this.snackbar = true
        this.snackbarMessage = 'solo se permiten archivos mp3'
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
      console.log('save')
    }
  }
}
</script>
