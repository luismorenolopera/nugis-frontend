import { defineStore } from 'pinia'
import { api } from '@/api'

export const usePlaylists = defineStore('playlists', {
  state: () => ({ items: [], loaded: false }),
  actions: {
    async load (force = false) {
      if (this.loaded && !force) return
      const data = await api('music/playlists/')
      this.items = Array.isArray(data) ? data : data.results || []
      this.loaded = true
    },
    async create (name) {
      const p = await api('music/playlists/', { method: 'POST', body: { name } })
      this.items.push(p)
      return p
    },
    async remove (id) {
      await api(`music/playlists/${id}/`, { method: 'DELETE' })
      this.items = this.items.filter(p => p.id !== id)
    },
    async membership (trackId) {
      const rows = await api(`music/playlists/track?id=${trackId}`)
      return rows.map(r => r.playlist)
    },
    async setMembership (trackId, playlistIds) {
      await api('music/playlists/track', { method: 'POST', body: { track: trackId, playlists: playlistIds } })
      await this.load(true)
    },
    reset () { this.items = []; this.loaded = false }
  }
})
