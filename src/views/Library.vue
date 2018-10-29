<template lang="pug">
  v-container
    //- list of playlists
    v-list
      div(
        v-for='playlist in playlists'
        :key='playlist.id'
        class='pointer'
        @click='openPlaylist(playlist)'
      )
        v-list-tile
          v-list-tile-action
            v-icon fas fa-play
          v-list-tile-content
            v-list-tile-title {{ playlist.name }}
            v-list-tile-sub-title {{playlist.tracks.length}} canciones
        v-divider
    //-dialog add playlist
    v-dialog(
      v-model='dialog'
      max-width='500px'
    )
      v-card
        v-card-title(
          class='headline grey darken-4'
          primary-title
        ) Nueva playlist
        v-card-text
          v-text-field(
            v-model='playlist'
            label='playlist'
            v-validate="'required'"
            :error-messages="errors.collect('playlist')"
            name='playlist'
            @keyup.enter='validate'
          )
        v-card-actions
          v-spacer
          v-btn(flat color='primary' @click.native='validate') Crear
    //- button add playlist
    v-btn(
      absolute
      fab
      bottom
      right
      color="primary"
      @click="dialog = !dialog"
    )
      span(class='display-1 font-weight-bold') +

</template>

<script>
import { HTTP } from '@/http-common'

export default {
  name: 'Library',
  data: () => ({
    playlists: [],
    dialog: false,
    playlist: ''
  }),
  created: function () {
    let url = 'music/playlists/'
    HTTP.get(url).then(response => {
      this.playlists = response.data
    }).catch(e => {
      console.log(e.response)
    })
  },
  methods: {
    openPlaylist (playlist) {
      this.$store.commit('setTracks', { tracks: playlist.tracks })
      this.$router.push({ path: '/playlist', query: { id: playlist.id } })
    },
    validate () {
      if (this.errors.items.length > 0) return
      return this.$validator.validateAll().then((result) => {
        if (!result) return
        this.addPlaylist()
      })
    },
    addPlaylist () {
      this.dialog = false
      let url = 'music/playlists/'
      HTTP.post(url, {
        name: this.playlist
      }).then(response => {
        console.log(response)
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
