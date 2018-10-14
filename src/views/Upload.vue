<template lang="pug">
  v-tabs(
    centered
    icons-and-text
    grow
  )
    v-tabs-slider
    //- tabs ui
    v-tab(href='#upload/youtube') YOUTUBE
      v-icon fab fa-youtube
    v-tab(href='#upload/localfile') ARCHIVO LOCAL
      v-icon fas fa-file-upload
    //- tabs views
    v-tab-item(id='upload/youtube')
      youtube-download
    v-tab-item(id='upload/localfile')
      upload-local-file
</template>

<script>
import YoutubeDownload from '@/views/YoutubeDownload.vue'
import UploadLocalFile from '@/views/UploadLocalFile.vue'

export default {
  name: 'Upload',
  components: {
    YoutubeDownload,
    UploadLocalFile
  }
}
</script>
