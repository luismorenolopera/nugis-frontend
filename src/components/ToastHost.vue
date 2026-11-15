<script setup>
import { toasts } from '@/toast'
</script>

<template>
  <div class="toasts" aria-live="polite">
    <TransitionGroup name="toast">
      <div v-for="t in toasts" :key="t.id" :class="['toast panel', t.kind]">{{ t.text }}</div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toasts {
  position: fixed;
  z-index: 200;
  left: 50%;
  top: 16px;
  transform: translateX(-50%);
  display: grid;
  gap: 8px;
  width: min(92vw, 420px);
  pointer-events: none;
}
.toast { padding: 12px 16px; border-left: 3px solid var(--cyan); font-size: 0.85rem; }
.toast.error { border-left-color: var(--red); }
.toast.ok { border-left-color: var(--lime); }
.toast-enter-active, .toast-leave-active { transition: all 0.2s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
