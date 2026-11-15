<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { usePlayer } from '@/stores/player'
import { formatTime } from '@/util'
import Icon from './Icon.vue'
import Cover from './Cover.vue'
import Visualizer from './Visualizer.vue'
import Equalizer from './Equalizer.vue'

const p = usePlayer()
const pct = computed(() => (p.duration ? (p.currentTime / p.duration) * 100 : 0))
const close = () => { p.expanded = false }
const onKey = (e) => { if (e.key === 'Escape') close() }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="scrim" @click="close" />
  <aside class="deck" role="dialog" aria-modal="true" aria-label="Reproductor y ecualizador">
    <header class="top">
      <button class="icon-btn" aria-label="Cerrar" @click="close"><Icon name="down" /></button>
      <span class="mono-label">// ahora suena</span>
      <span style="width:44px" />
    </header>

    <div class="hero">
      <Cover :track="p.current" size="min(64vw, 240px)" class="art" />
      <Visualizer class="viz" />
    </div>

    <div class="now">
      <h2 class="neon-c">{{ p.current.title }}</h2>
      <div class="muted">{{ p.current.artist }}</div>
      <div v-if="p.error" class="err">{{ p.error }}</div>
    </div>

    <div class="seek">
      <input type="range" min="0" :max="p.duration || 0" step="0.1" :value="p.currentTime"
             :style="{ '--pct': pct + '%' }" aria-label="Posición" @input="p.seek(Number($event.target.value))">
      <div class="times"><span>{{ formatTime(p.currentTime) }}</span><span>{{ formatTime(p.duration) }}</span></div>
    </div>

    <div class="controls">
      <button class="icon-btn" :class="{ active: p.shuffle }" aria-label="Aleatorio" @click="p.toggleShuffle()"><Icon name="shuffle" /></button>
      <button class="icon-btn" aria-label="Anterior" @click="p.prev()"><Icon name="prev" :size="26" /></button>
      <button class="play" :aria-label="p.playing ? 'Pausar' : 'Reproducir'" @click="p.toggle()"><Icon :name="p.playing ? 'pause' : 'play'" :size="30" /></button>
      <button class="icon-btn" aria-label="Siguiente" :disabled="!p.hasNext" @click="p.next()"><Icon name="next" :size="26" /></button>
      <button class="icon-btn" :class="{ active: p.repeat !== 'off' }" :aria-label="'Repetir: ' + p.repeat" @click="p.cycleRepeat()">
        <Icon name="repeat" /><sup v-if="p.repeat === 'one'">1</sup>
      </button>
    </div>

    <Equalizer />

    <section v-if="p.queue.length > 1" class="queue">
      <h3 class="mono-label">// cola · {{ p.order.length }}</h3>
      <ol>
        <li v-for="(qi, i) in p.order" :key="qi + '-' + i" :class="{ on: i === p.pos }">
          <button type="button" @click="p.pos = i; p.loadCurrent(true)">
            <span class="n">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="t">{{ p.queue[qi].title }}</span>
          </button>
        </li>
      </ol>
    </section>
  </aside>
</template>

<style scoped>
.scrim { position: fixed; inset: 0; z-index: 70; background: rgba(0, 0, 0, 0.55); }
.deck {
  position: fixed;
  z-index: 80;
  inset: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: env(safe-area-inset-top) 18px calc(24px + env(safe-area-inset-bottom));
  background:
    radial-gradient(600px 400px at 50% 0, rgba(255, 43, 214, 0.18), transparent 70%),
    var(--bg);
  animation: up 0.22s ease-out;
}
@keyframes up { from { transform: translateY(30px); opacity: 0; } }
.top { display: flex; align-items: center; justify-content: space-between; height: 56px; }
.hero { position: relative; display: grid; place-items: center; padding: 8px 0 0; }
.art { box-shadow: 0 0 40px rgba(0, 240, 255, 0.25); }
.viz { width: 100%; height: 72px; margin-top: -24px; }
.now { text-align: center; margin: 14px 0 8px; }
.now h2 { font-size: 1.1rem; margin: 0 0 4px; }
.err { color: var(--red); font-size: 0.8rem; margin-top: 6px; }
.seek { margin: 10px 0 0; }
.times { display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--muted); }
.controls { display: flex; align-items: center; justify-content: space-between; max-width: 360px; margin: 8px auto 24px; }
.controls sup { position: absolute; font-size: 0.6rem; margin: -12px 0 0 16px; }
.play {
  display: grid; place-items: center;
  width: 68px; height: 68px;
  border: 1px solid var(--cyan);
  background: var(--cyan);
  color: #000;
  cursor: pointer;
  box-shadow: var(--glow-c);
  clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
}
.queue { margin-top: 28px; }
.queue ol { list-style: none; margin: 0; padding: 0; }
.queue button {
  display: flex; gap: 12px; width: 100%; min-height: 40px; align-items: center;
  background: none; border: 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: var(--text); font: inherit; text-align: left; cursor: pointer;
}
.queue .n { color: var(--muted); font-size: 0.75rem; }
.queue .t { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.queue li.on button { color: var(--magenta); text-shadow: var(--glow-m); }

@media (min-width: 900px) {
  .scrim { bottom: var(--player-h); background: rgba(0, 0, 0, 0.35); }
  .deck {
    left: auto;
    width: 480px;
    bottom: var(--player-h);
    padding-top: 8px;
    border-left: 1px solid var(--line-strong);
    box-shadow: -20px 0 60px rgba(0, 0, 0, 0.6);
    animation: slide 0.22s ease-out;
  }
  @keyframes slide { from { transform: translateX(40px); opacity: 0; } }
  .controls { display: none; }
  .seek { display: none; }
}
</style>
