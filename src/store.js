import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.token
  },
  mutations: {
    setToken (state, payload) {
      state.token = payload.token
    }
  },
  actions: {

  }
})
