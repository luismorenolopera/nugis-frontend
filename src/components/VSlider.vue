<script setup>
// Vertical slider (drag, wheel and keyboard), centered at 0 dB.
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  min: { type: Number, default: -12 },
  max: { type: Number, default: 12 },
  step: { type: Number, default: 0.5 },
  label: { type: String, default: '' },
  disabled: Boolean
})
const emit = defineEmits(['update:modelValue'])
const track = ref(null)

const pct = computed(() => (props.modelValue - props.min) / (props.max - props.min))
const zero = computed(() => (0 - props.min) / (props.max - props.min))
const fill = computed(() => {
  const a = Math.min(pct.value, zero.value)
  const b = Math.max(pct.value, zero.value)
  return { bottom: `${a * 100}%`, height: `${(b - a) * 100}%` }
})

function set (v) {
  const s = Math.round(v / props.step) * props.step
  emit('update:modelValue', Math.max(props.min, Math.min(props.max, Number(s.toFixed(2)))))
}
function fromPointer (e) {
  const r = track.value.getBoundingClientRect()
  const ratio = 1 - (e.clientY - r.top) / r.height
  set(props.min + Math.max(0, Math.min(1, ratio)) * (props.max - props.min))
}
function down (e) {
  if (props.disabled) return
  e.currentTarget.setPointerCapture(e.pointerId)
  fromPointer(e)
}
function move (e) {
  if (e.currentTarget.hasPointerCapture?.(e.pointerId)) fromPointer(e)
}
function key (e) {
  const big = (props.max - props.min) / 8
  const map = {
    ArrowUp: props.step, ArrowRight: props.step, ArrowDown: -props.step, ArrowLeft: -props.step,
    PageUp: big, PageDown: -big
  }
  if (e.key in map) { e.preventDefault(); set(props.modelValue + map[e.key]) }
  else if (e.key === 'Home') { e.preventDefault(); set(props.min) }
  else if (e.key === 'End') { e.preventDefault(); set(props.max) }
  else if (e.key === '0' || e.key === 'Delete') { e.preventDefault(); set(0) }
}
</script>

<template>
  <div
    class="vs" :class="{ disabled }" role="slider" tabindex="0"
    :aria-label="label" :aria-valuemin="min" :aria-valuemax="max" :aria-valuenow="modelValue"
    :aria-valuetext="`${modelValue > 0 ? '+' : ''}${modelValue} dB`" :aria-disabled="disabled"
    @pointerdown="down" @pointermove="move" @keydown="key" @dblclick="set(0)"
  >
    <div ref="track" class="track">
      <div class="zero" :style="{ bottom: zero * 100 + '%' }" />
      <div class="fill" :class="{ neg: modelValue < 0 }" :style="fill" />
      <div class="thumb" :style="{ bottom: pct * 100 + '%' }" />
    </div>
  </div>
</template>

<style scoped>
.vs { height: 100%; width: 100%; display: flex; justify-content: center; touch-action: none; cursor: ns-resize; outline: none; }
.vs.disabled { opacity: 0.35; cursor: default; }
.track {
  position: relative;
  width: 6px;
  height: 100%;
  background: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.1) 0 2px, transparent 2px 6px);
}
.zero { position: absolute; left: -6px; right: -6px; height: 1px; background: rgba(255, 255, 255, 0.35); }
.fill { position: absolute; left: 0; right: 0; background: linear-gradient(0deg, var(--magenta), var(--cyan)); box-shadow: var(--glow-c); }
.fill.neg { background: var(--magenta); box-shadow: var(--glow-m); }
.thumb {
  position: absolute;
  left: 50%;
  width: 22px;
  height: 10px;
  transform: translate(-50%, 50%);
  background: var(--bg);
  border: 2px solid var(--cyan);
  box-shadow: var(--glow-c);
}
.vs:focus-visible .thumb { border-color: var(--yellow); box-shadow: 0 0 10px var(--yellow); }
</style>
