import { defineStore } from 'pinia'
import { api } from '@/api'

export const useAuth = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token'),
    user: null
  }),
  getters: {
    isLogged: (s) => !!s.token
  },
  actions: {
    async login (username, password) {
      const { token } = await api('api-token-auth/', { method: 'POST', body: { username, password } })
      this.token = token
      localStorage.setItem('token', token)
      this.fetchMe()
    },
    async signup (data) {
      await api('users/user', { method: 'POST', body: data })
      await this.login(data.username, data.password)
    },
    async fetchMe () {
      try { this.user = await api('users/me') } catch { /* older backend */ }
    },
    logout () {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    }
  }
})
