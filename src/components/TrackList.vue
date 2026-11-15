<script setup>
import { ref } from 'vue'
import { usePlayer } from '@/stores/player'
import { formatTime } from '@/util'
import Icon from './Icon.vue'
import Cover from './Cover.vue'
import PlaylistPicker from './PlaylistPicker.vue'

const props = defineProps({
  tracks: { type: Array, required: true },
  variant: { type: String, default: 'grid' } // grid | rows
})
const p = usePlayer()
const picking = ref(null)
const isCurrent = (t) => p.current && p.current.id === t.id
</script>

<template>
  <ul :class="['tracks', variant]">
    <li v-for="(t, i) in tracks" :key="t.id" :class="['track', { now: isCurrent(t) }]">
      <button class="hit" type="button" :aria-label="(isCurrent(t) && p.playing ? 'Pausar ' : 'Reproducir ') + t.title"
              @click="p.playTrack(t, props.tracks)">
        <span v-if="variant === 'rows'" class="idx">{{ String(i + 1).padStart(2, '0') }}</span>
        <div class="art">
          <Cover :track="t" :size="variant === 'grid' ? '64px' : '44px'" />
          <span class="overlay"><Icon :name="isCurrent(t) && p.playing ? 'pause' : 'play'" :size="18" /></span>
        </div>
        <div class="meta">
          <div class="title">{{ t.title }}</div>
          <div class="sub">{{ t.artist }}<template v-if="t.duration"> · {{ formatTime(t.duration) }}</template></div>
        </div>
        <span v-if="isCurrent(t) && p.playing" class="eqbars" aria-hidden="true"><i /><i /><i /></span>
      </button>
      <div class="actions">
        <button class="icon-btn" type="button" title="Agregar a la cola" aria-label="Agregar a la cola" @click="p.enqueue(t)">
          <Icon name="list" :size="18" />
        </button>
        <button class="icon-btn" type="button" title="Guardar en playlist" aria-label="Guardar en playlist" @click="picking = t">
          <Icon name="plus" :size="18" />
        </button>
      </div>
    </li>
  </ul>
  <PlaylistPicker v-if="picking" :track="picking" @close="picking = null" />
</template>

<style scoped>
.tracks { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.tracks.grid { grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr)); }
.tracks.rows { gap: 0; }
.track {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--panel);
  border: 1px solid var(--line);
  transition: border-color 0.15s, background 0.15s, transform 0.15s;
  contain: layout paint;
}
.rows .track { background: transparent; border: 0; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
.grid .track { clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px)); }
.track:hover { border-color: var(--line-strong); background: rgba(0, 240, 255, 0.05); }
.track.now { border-color: var(--magenta); box-shadow: inset 3px 0 0 var(--magenta); }
.hit {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: none;
  border: 0;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.idx { width: 22px; font-size: 0.72rem; color: var(--muted); }
.art { position: relative; }
.overlay {
  position: absolute; inset: 0;
  display: grid; place-items: center;
  background: rgba(0, 0, 0, 0.55);
  color: var(--cyan);
  opacity: 0;
  transition: opacity 0.15s;
}
.track:hover .overlay, .track.now .overlay, .hit:focus-visible .overlay { opacity: 1; }
.meta { min-width: 0; flex: 1; }
.title { font-weight: 700; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.now .title { color: var(--magenta); text-shadow: var(--glow-m); }
.sub { font-size: 0.75rem; color: var(--muted); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
.actions { display: flex; padding-right: 4px; }
.eqbars { display: flex; gap: 2px; align-items: flex-end; height: 14px; }
.eqbars i { width: 3px; background: var(--magenta); animation: bars 0.8s ease-in-out infinite; }
.eqbars i:nth-child(2) { animation-delay: -0.3s; }
.eqbars i:nth-child(3) { animation-delay: -0.6s; }
@keyframes bars { 0%, 100% { height: 3px; } 50% { height: 14px; } }
</style>
