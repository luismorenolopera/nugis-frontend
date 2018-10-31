import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.token,
    tracks: [],
    playlists: []
  },
  mutations: {
    setToken (state, payload) {
      state.token = payload.token
    },
    setTracks (state, payload) {
      state.tracks = payload.tracks
    },
    setPlaylists (state, payload) {
      state.playlists = payload.playlists
    },
    addPlaylist (state, payload) {
      state.playlists.push(payload.playlist)
    }
  },
  actions: {

  }
})
