<script setup>
// Real-time spectrum drawn on a canvas. Runs only while playing and visible.
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getEngine } from '@/audio/engine'
import { usePlayer } from '@/stores/player'

const canvas = ref(null)
const p = usePlayer()
const BARS = 48
let raf = 0
let data = null
const smooth = new Float32Array(BARS)

function draw () {
  const c = canvas.value
  if (!c) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = c.clientWidth
  const h = c.clientHeight
  if (c.width !== w * dpr || c.height !== h * dpr) { c.width = w * dpr; c.height = h * dpr }
  const ctx = c.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)
  const e = getEngine()
  if (!data && e.analyser) data = new Uint8Array(e.analyser.frequencyBinCount)
  const live = data && e.spectrum(data)
  const gap = 3
  const bw = (w - gap * (BARS - 1)) / BARS
  const grad = ctx.createLinearGradient(0, h, 0, 0)
  grad.addColorStop(0, '#ff2bd6')
  grad.addColorStop(1, '#00f0ff')
  ctx.fillStyle = grad
  ctx.shadowColor = '#00f0ff'
  ctx.shadowBlur = 8
  for (let i = 0; i < BARS; i++) {
    let v
    if (live) {
      // log-spaced bins so bass doesn't take the whole width
      const idx = Math.min(data.length - 1, Math.floor(Math.pow(data.length * 0.75, i / BARS)))
      v = data[idx] / 255
    } else {
      v = p.playing ? 0.15 + 0.1 * Math.sin(performance.now() / 300 + i / 2) : 0.04
    }
    smooth[i] += (v - smooth[i]) * 0.35
    const bh = Math.max(2, smooth[i] * h)
    ctx.fillRect(i * (bw + gap), h - bh, bw, bh)
  }
  raf = p.playing ? requestAnimationFrame(draw) : 0
}

function start () { if (!raf) raf = requestAnimationFrame(draw) }
watch(() => p.playing, (v) => { if (v) start() })
onMounted(start)
onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <canvas ref="canvas" class="viz" aria-hidden="true" />
</template>

<style scoped>
.viz { display: block; width: 100%; height: 100%; }
</style>
