// Audio engine: <audio> element -> preamp -> 10 biquad filters -> analyser -> speakers.
//
// Web Audio can only process cross-origin audio served with CORS headers.
// If the server does not send them, we fall back to a plain <audio> element
// (music still plays, the equalizer and visualizer are disabled).
import { BANDS } from './eq'

const FORWARDED = ['timeupdate', 'durationchange', 'loadedmetadata', 'play', 'pause',
  'ended', 'waiting', 'playing', 'canplay', 'error', 'volumechange']

const dbToGain = (db) => Math.pow(10, db / 20)

class AudioEngine extends EventTarget {
  constructor () {
    super()
    this.graphed = this._makeElement(true)
    this.plain = null
    this.el = this.graphed
    this.ctx = null
    this.filters = []
    this.preampNode = null
    this.analyser = null
    this.eqAvailable = true
    this.settings = { enabled: true, preamp: 0, gains: BANDS.map(() => 0) }
  }

  _makeElement (cors) {
    const el = new Audio()
    if (cors) el.crossOrigin = 'anonymous'
    el.preload = 'metadata'
    for (const type of FORWARDED) {
      el.addEventListener(type, () => {
        if (el !== this.el) return
        if (type === 'error' && cors && this._tryFallback()) return
        this.dispatchEvent(new Event(type))
      })
    }
    return el
  }

  // CORS (or decoding) failed on the graphed element: retry without CORS once.
  _tryFallback () {
    const src = this.graphed.currentSrc || this.graphed.src
    if (!src || this._fallbackTried === src) return false
    this._fallbackTried = src
    if (!this.plain) this.plain = this._makeElement(false)
    this.plain.volume = this.graphed.volume
    this.el = this.plain
    this.eqAvailable = false
    this.dispatchEvent(new Event('eqavailability'))
    this.plain.src = src
    this.plain.play().catch(() => {})
    return true
  }

  _ensureGraph () {
    if (this.ctx) return
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) { this.eqAvailable = false; return }
    const ctx = new Ctx()
    const source = ctx.createMediaElementSource(this.graphed)
    this.preampNode = ctx.createGain()
    this.filters = BANDS.map((freq, i) => {
      const f = ctx.createBiquadFilter()
      f.type = i === 0 ? 'lowshelf' : i === BANDS.length - 1 ? 'highshelf' : 'peaking'
      f.frequency.value = freq
      f.Q.value = 1.41
      return f
    })
    this.analyser = ctx.createAnalyser()
    this.analyser.fftSize = 512
    this.analyser.smoothingTimeConstant = 0.8
    let node = source.connect(this.preampNode)
    for (const f of this.filters) node = node.connect(f)
    node.connect(this.analyser).connect(ctx.destination)
    this.ctx = ctx
    this._apply()
  }

  _apply () {
    if (!this.ctx) return
    const { enabled, preamp, gains } = this.settings
    const t = this.ctx.currentTime
    this.preampNode.gain.setTargetAtTime(enabled ? dbToGain(preamp) : 1, t, 0.02)
    this.filters.forEach((f, i) => f.gain.setTargetAtTime(enabled ? gains[i] : 0, t, 0.02))
  }

  setEq (settings) {
    this.settings = { ...settings, gains: [...settings.gains] }
    this._apply()
  }

  load (src) {
    this._fallbackTried = null
    if (this.el !== this.graphed) {
      this.plain.pause()
      this.el = this.graphed
      this.eqAvailable = !!(window.AudioContext || window.webkitAudioContext)
      this.dispatchEvent(new Event('eqavailability'))
    }
    this.graphed.src = src
    this.graphed.load()
  }

  async play () {
    if (this.el === this.graphed) {
      this._ensureGraph()
      if (this.ctx && this.ctx.state === 'suspended') await this.ctx.resume()
    }
    return this.el.play()
  }

  pause () { this.el.pause() }
  seek (t) { if (Number.isFinite(t)) this.el.currentTime = t }
  get currentTime () { return this.el.currentTime }
  get duration () { return this.el.duration }
  get paused () { return this.el.paused }
  set volume (v) { this.graphed.volume = v; if (this.plain) this.plain.volume = v }
  get volume () { return this.graphed.volume }

  // Fills `out` (Uint8Array) with frequency data; returns false when unavailable.
  spectrum (out) {
    if (!this.analyser || this.el !== this.graphed) return false
    this.analyser.getByteFrequencyData(out)
    return true
  }
}

let instance = null
export function getEngine () {
  if (!instance) instance = new AudioEngine()
  return instance
}
