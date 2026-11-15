import { defineStore } from 'pinia'
import { getEngine } from '@/audio/engine'
import { loadEqSettings, saveEqSettings, clampDb, PRESETS, matchPreset } from '@/audio/eq'

const VOL_KEY = 'nugis.volume'

export const usePlayer = defineStore('player', {
  state: () => ({
    queue: [],
    order: [], // indexes into queue, shuffled or not
    pos: -1, // position in `order`
    playing: false,
    buffering: false,
    currentTime: 0,
    duration: 0,
    volume: Number(localStorage.getItem(VOL_KEY) ?? 0.9),
    shuffle: false,
    repeat: 'off', // off | all | one
    eq: loadEqSettings(),
    eqAvailable: true,
    error: null,
    expanded: false
  }),
  getters: {
    current: (s) => (s.pos >= 0 ? s.queue[s.order[s.pos]] : null),
    hasNext: (s) => s.pos < s.order.length - 1 || s.repeat === 'all',
    hasPrev: (s) => s.pos > 0 || s.currentTime > 3,
    eqPreset: (s) => matchPreset(s.eq.gains)
  },
  actions: {
    init () {
      const e = getEngine()
      e.volume = this.volume
      e.setEq(this.eq)
      e.addEventListener('timeupdate', () => { this.currentTime = e.currentTime })
      e.addEventListener('durationchange', () => {
        if (Number.isFinite(e.duration)) this.duration = e.duration
      })
      e.addEventListener('play', () => { this.playing = true; this.error = null })
      e.addEventListener('pause', () => { this.playing = false })
      e.addEventListener('waiting', () => { this.buffering = true })
      e.addEventListener('playing', () => { this.buffering = false })
      e.addEventListener('canplay', () => { this.buffering = false })
      e.addEventListener('ended', () => this.onEnded())
      e.addEventListener('error', () => {
        this.buffering = false
        this.playing = false
        this.error = 'No se pudo reproducir esta pista'
      })
      e.addEventListener('eqavailability', () => { this.eqAvailable = e.eqAvailable })
      this.setupMediaSession()
    },

    playList (tracks, start = 0) {
      this.queue = tracks.slice()
      this.order = tracks.map((_, i) => i)
      if (this.shuffle) this.shuffleOrder(start)
      this.pos = this.shuffle ? 0 : start
      this.loadCurrent(true)
    },

    playTrack (track, context) {
      const list = context && context.length ? context : [track]
      const idx = Math.max(0, list.findIndex(t => t.id === track.id))
      if (this.current && this.current.id === track.id) return this.toggle()
      this.playList(list, idx)
    },

    enqueue (track) {
      this.queue.push(track)
      this.order.push(this.queue.length - 1)
      if (this.pos === -1) { this.pos = 0; this.loadCurrent(true) }
    },

    loadCurrent (autoplay) {
      const t = this.current
      if (!t) return
      const e = getEngine()
      this.currentTime = 0
      this.duration = t.duration || 0
      this.error = null
      this.buffering = true
      e.load(t.src)
      this.updateMetadata()
      if (autoplay) e.play().catch(() => { this.buffering = false })
    },

    toggle () {
      const e = getEngine()
      if (!this.current) return
      if (e.paused) e.play().catch(() => {})
      else e.pause()
    },

    next (auto = false) {
      if (this.repeat === 'one' && auto) { getEngine().seek(0); getEngine().play(); return }
      if (this.pos < this.order.length - 1) this.pos++
      else if (this.repeat === 'all') this.pos = 0
      else { if (!auto) return; this.playing = false; return }
      this.loadCurrent(true)
    },

    prev () {
      if (this.currentTime > 3 || this.pos <= 0) { this.seek(0); return }
      this.pos--
      this.loadCurrent(true)
    },

    onEnded () { this.next(true) },

    seek (t) { getEngine().seek(t); this.currentTime = t },

    setVolume (v) {
      this.volume = Math.max(0, Math.min(1, v))
      getEngine().volume = this.volume
      localStorage.setItem(VOL_KEY, String(this.volume))
    },

    toggleShuffle () {
      this.shuffle = !this.shuffle
      const curIdx = this.order[this.pos]
      if (this.shuffle) this.shuffleOrder(curIdx)
      else this.order = this.queue.map((_, i) => i)
      this.pos = curIdx === undefined ? -1 : this.order.indexOf(curIdx)
    },

    // Shuffle the order, keeping `first` at the front.
    shuffleOrder (first) {
      const rest = this.queue.map((_, i) => i).filter(i => i !== first)
      for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]]
      }
      this.order = first === undefined || first < 0 ? rest : [first, ...rest]
    },

    cycleRepeat () {
      this.repeat = { off: 'all', all: 'one', one: 'off' }[this.repeat]
    },

    // Equalizer
    setBand (i, db) {
      const gains = [...this.eq.gains]
      gains[i] = clampDb(db)
      this.updateEq({ gains })
    },
    setPreamp (db) { this.updateEq({ preamp: clampDb(db) }) },
    setEqEnabled (enabled) { this.updateEq({ enabled }) },
    applyPreset (key) {
      if (PRESETS[key]) this.updateEq({ gains: [...PRESETS[key].gains] })
    },
    updateEq (patch) {
      this.eq = { ...this.eq, ...patch }
      getEngine().setEq(this.eq)
      saveEqSettings(this.eq)
    },

    stop () {
      getEngine().pause()
      this.queue = []
      this.order = []
      this.pos = -1
      this.expanded = false
    },

    // Lock screen / headphone controls
    setupMediaSession () {
      if (!('mediaSession' in navigator)) return
      const ms = navigator.mediaSession
      const h = {
        play: () => getEngine().play(),
        pause: () => getEngine().pause(),
        previoustrack: () => this.prev(),
        nexttrack: () => this.next(),
        seekto: (d) => this.seek(d.seekTime)
      }
      for (const [action, fn] of Object.entries(h)) {
        try { ms.setActionHandler(action, fn) } catch { /* unsupported */ }
      }
    },
    updateMetadata () {
      const t = this.current
      if (!t || !('mediaSession' in navigator) || typeof window.MediaMetadata !== 'function') return
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: t.title,
        artist: t.artist,
        album: 'Nugis',
        artwork: t.cover ? [{ src: t.cover, sizes: '512x512' }] : []
      })
    }
  }
})
