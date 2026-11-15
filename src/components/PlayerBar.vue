<script setup>
import { computed } from 'vue'
import { usePlayer } from '@/stores/player'
import { formatTime } from '@/util'
import Icon from './Icon.vue'
import Cover from './Cover.vue'

const p = usePlayer()
const pct = computed(() => (p.duration ? (p.currentTime / p.duration) * 100 : 0))
const volPct = computed(() => `${p.volume * 100}%`)

function onSeek (e) { p.seek(Number(e.target.value)) }
</script>

<template>
  <section class="bar" aria-label="Reproductor">
    <div class="progress" :style="{ '--w': pct + '%' }" />
    <button class="info" type="button" aria-label="Abrir reproductor" @click="p.expanded = true">
      <Cover :track="p.current" size="52px" />
      <div class="meta">
        <div class="title">{{ p.current.title }}</div>
        <div class="artist">{{ p.error || p.current.artist }}</div>
      </div>
    </button>

    <div class="center">
      <div class="controls">
        <button class="icon-btn hide-sm" :class="{ active: p.shuffle }" aria-label="Aleatorio" @click="p.toggleShuffle()"><Icon name="shuffle" :size="18" /></button>
        <button class="icon-btn hide-sm" aria-label="Anterior" @click="p.prev()"><Icon name="prev" :size="20" /></button>
        <button class="play" :class="{ buffering: p.buffering }" :aria-label="p.playing ? 'Pausar' : 'Reproducir'" @click="p.toggle()">
          <Icon :name="p.playing ? 'pause' : 'play'" :size="22" />
        </button>
        <button class="icon-btn" aria-label="Siguiente" :disabled="!p.hasNext" @click="p.next()"><Icon name="next" :size="20" /></button>
        <button class="icon-btn hide-sm" :class="{ active: p.repeat !== 'off' }" :aria-label="'Repetir: ' + p.repeat" @click="p.cycleRepeat()">
          <Icon name="repeat" :size="18" /><sup v-if="p.repeat === 'one'">1</sup>
        </button>
      </div>
      <div class="seek hide-sm">
        <span>{{ formatTime(p.currentTime) }}</span>
        <input type="range" min="0" :max="p.duration || 0" step="0.1" :value="p.currentTime"
               :style="{ '--pct': pct + '%' }" aria-label="Posición" @input="onSeek">
        <span>{{ formatTime(p.duration) }}</span>
      </div>
    </div>

    <div class="right hide-sm">
      <button class="icon-btn" :class="{ active: p.expanded }" aria-label="Ecualizador" title="Ecualizador" @click="p.expanded = !p.expanded">
        <Icon name="eq" />
      </button>
      <button class="icon-btn" :aria-label="p.volume ? 'Silenciar' : 'Activar sonido'" @click="p.setVolume(p.volume ? 0 : 0.9)">
        <Icon :name="p.volume ? 'volume' : 'mute'" />
      </button>
      <input class="vol" type="range" min="0" max="1" step="0.01" :value="p.volume" :style="{ '--pct': volPct }"
             aria-label="Volumen" @input="p.setVolume(Number($event.target.value))">
    </div>
  </section>
</template>

<style scoped>
.bar {
  position: fixed;
  z-index: 60;
  left: 0;
  right: 0;
  bottom: calc(var(--nav-h) + env(safe-area-inset-bottom));
  height: var(--player-h);
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 0 12px;
  background: rgba(8, 10, 18, 0.94);
  border-top: 1px solid var(--line-strong);
  box-shadow: 0 -10px 40px rgba(0, 240, 255, 0.08);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}
.progress {
  position: absolute;
  top: -1px;
  left: 0;
  height: 2px;
  width: var(--w);
  background: linear-gradient(90deg, var(--magenta), var(--cyan));
  box-shadow: var(--glow-c);
}
.info { display: flex; align-items: center; gap: 12px; min-width: 0; background: none; border: 0; color: inherit; font: inherit; text-align: left; cursor: pointer; padding: 0; }
.meta { min-width: 0; }
.title { font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.artist { font-size: 0.78rem; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.controls { display: flex; align-items: center; gap: 4px; }
.controls sup { position: absolute; font-size: 0.6rem; margin: -10px 0 0 14px; }
.play {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid var(--cyan);
  background: rgba(0, 240, 255, 0.1);
  color: var(--cyan);
  cursor: pointer;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  box-shadow: inset 0 0 12px rgba(0, 240, 255, 0.3);
}
.play:hover { background: var(--cyan); color: #000; }
.play.buffering { animation: pulse 0.8s ease-in-out infinite alternate; }
@keyframes pulse { to { border-color: var(--magenta); color: var(--magenta); } }
.center, .right { display: flex; align-items: center; }
.hide-sm { display: none; }

@media (min-width: 900px) {
  .bar { grid-template-columns: minmax(200px, 1fr) minmax(360px, 2fr) minmax(200px, 1fr); padding: 0 24px; }
  .hide-sm { display: flex; }
  .center { flex-direction: column; gap: 2px; }
  .seek { display: flex; align-items: center; gap: 10px; width: 100%; font-size: 0.72rem; color: var(--muted); }
  .seek input { flex: 1; }
  .right { justify-content: flex-end; gap: 4px; }
  .vol { width: 110px; }
}
</style>
