<template lang="pug">
  v-container
    app-playlist(:tracks='tracks')
</template>
<script>
import { mapState } from 'vuex'
import AppPlaylist from '@/components/PlayList.vue'

export default {
  name: 'PlayListDetail',
  components: {
    AppPlaylist
  },
  mounted: function () {
    console.log(this.tracks)
  },
  computed: {
    ...mapState(['tracks'])
  }
}
</script>
