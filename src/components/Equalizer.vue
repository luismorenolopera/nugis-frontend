<script setup>
import { computed } from 'vue'
import { usePlayer } from '@/stores/player'
import { BANDS, PRESETS, MAX_DB, formatHz } from '@/audio/eq'
import VSlider from './VSlider.vue'

const p = usePlayer()
const presetKeys = Object.keys(PRESETS)
const disabled = computed(() => !p.eq.enabled || !p.eqAvailable)
const fmt = (v) => `${v > 0 ? '+' : ''}${Number(v).toFixed(v % 1 ? 1 : 0)}`
</script>

<template>
  <section class="eq panel" aria-labelledby="eq-title">
    <header>
      <h2 id="eq-title" class="neon-m">EQ<span class="muted"> // 10 bandas</span></h2>
      <label class="switch">
        <input type="checkbox" :checked="p.eq.enabled" :disabled="!p.eqAvailable" @change="p.setEqEnabled($event.target.checked)">
        <span class="knob" /><span class="sr-only">Activar ecualizador</span>
        <span class="mono-label">{{ p.eq.enabled ? 'ON' : 'OFF' }}</span>
      </label>
    </header>

    <p v-if="!p.eqAvailable" class="warn">
      El servidor no permite procesar este audio (faltan cabeceras CORS en /media/), así que el ecualizador está desactivado para esta pista.
    </p>

    <div class="presets" role="radiogroup" aria-label="Presets">
      <button v-for="k in presetKeys" :key="k" type="button" role="radio"
              :aria-checked="p.eqPreset === k" :class="['chip', { on: p.eqPreset === k }]"
              :disabled="disabled" @click="p.applyPreset(k)">
        {{ PRESETS[k].label }}
      </button>
      <span v-if="p.eqPreset === 'custom'" class="chip on static">Personalizado</span>
    </div>

    <div class="board">
      <div class="scale mono-label" aria-hidden="true">
        <span>+{{ MAX_DB }}</span><span>0</span><span>-{{ MAX_DB }}</span>
      </div>
      <div class="band pre">
        <span class="val">{{ fmt(p.eq.preamp) }}</span>
        <VSlider :model-value="p.eq.preamp" :min="-MAX_DB" :max="MAX_DB" label="Preamp"
                 :disabled="disabled" @update:model-value="p.setPreamp" />
        <span class="hz">PRE</span>
      </div>
      <div v-for="(hz, i) in BANDS" :key="hz" class="band">
        <span class="val">{{ fmt(p.eq.gains[i]) }}</span>
        <VSlider :model-value="p.eq.gains[i]" :min="-MAX_DB" :max="MAX_DB" :label="`${formatHz(hz)} Hz`"
                 :disabled="disabled" @update:model-value="v => p.setBand(i, v)" />
        <span class="hz">{{ formatHz(hz) }}</span>
      </div>
    </div>
    <p class="hint muted">Doble clic en una banda la regresa a 0 dB. Se guarda en este dispositivo.</p>
  </section>
</template>

<style scoped>
.eq { padding: 16px 14px 12px; }
header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
header h2 { margin: 0; font-size: 0.95rem; }
.switch { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; }
.switch input { position: absolute; opacity: 0; }
.knob { width: 38px; height: 18px; border: 1px solid var(--muted); position: relative; transition: border-color 0.15s; }
.knob::after { content: ''; position: absolute; top: 2px; left: 2px; width: 12px; height: 12px; background: var(--muted); transition: all 0.15s; }
.switch input:checked + .knob { border-color: var(--magenta); box-shadow: var(--glow-m); }
.switch input:checked + .knob::after { left: 22px; background: var(--magenta); }
.switch input:focus-visible + .knob { outline: 1px dashed var(--yellow); outline-offset: 3px; }
.warn { font-size: 0.78rem; color: var(--yellow); border-left: 2px solid var(--yellow); padding-left: 8px; }
.presets { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 8px; scrollbar-width: none; }
.chip {
  flex: none;
  min-height: 32px;
  padding: 0 12px;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--muted);
  font: inherit;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
}
.chip:hover:not(:disabled) { color: var(--text); border-color: var(--line-strong); }
.chip.on { color: #000; background: var(--cyan); border-color: var(--cyan); box-shadow: var(--glow-c); }
.chip.static { cursor: default; background: var(--magenta); border-color: var(--magenta); box-shadow: var(--glow-m); }
.chip:disabled { opacity: 0.4; cursor: default; }
.board {
  display: grid;
  grid-template-columns: 22px 1.2fr repeat(10, 1fr);
  gap: 2px;
  height: 220px;
  padding: 6px 0;
  background:
    linear-gradient(transparent calc(50% - 0.5px), rgba(0, 240, 255, 0.15) calc(50% - 0.5px), rgba(0, 240, 255, 0.15) calc(50% + 0.5px), transparent calc(50% + 0.5px));
}
.scale { display: flex; flex-direction: column; justify-content: space-between; padding: 18px 0 20px; font-size: 0.55rem; letter-spacing: 0; }
.band { display: grid; grid-template-rows: 16px 1fr 18px; justify-items: center; min-width: 0; }
.band.pre { border-right: 1px dashed var(--line); margin-right: 2px; }
.val { font-size: 0.62rem; color: var(--cyan); }
.hz { font-size: 0.6rem; color: var(--muted); }
.hint { font-size: 0.7rem; margin: 8px 0 0; }
@media (max-width: 380px) {
  .board { grid-template-columns: 1.2fr repeat(10, 1fr); }
  .scale { display: none; }
}
</style>
