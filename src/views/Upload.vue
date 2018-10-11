<template lang="pug">
  v-tabs(
    centered
    icons-and-text
    grow
  )
    v-tabs-slider
    v-tab(href='#tab-1') YOUTUBE
      v-icon fab fa-youtube
    v-tab(href='#tab-2') ARCHIVO LOCAL
      v-icon fas fa-file-upload
    v-tab-item(id='tab-1')
      youtube-download
    v-tab-item(id='tab-2')
      h1 basic upload
</template>

<script>
import YoutubeDownload from '@/components/YoutubeDownload.vue'

export default {
  name: 'Upload',
  components: {
    YoutubeDownload
  }
}
</script>
