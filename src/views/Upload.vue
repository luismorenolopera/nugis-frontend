<template lang="pug">
  v-tabs(
    centered
    icons-and-text
    grow
  )
    v-tabs-slider
    //- tabs ui
    v-tab(href='#tab-1') YOUTUBE
      v-icon fab fa-youtube
    v-tab(href='#tab-2') ARCHIVO LOCAL
      v-icon fas fa-file-upload
    //- tabs views
    v-tab-item(id='tab-1')
      youtube-download
    v-tab-item(id='tab-2')
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
