<script setup>
import { onMounted, ref } from 'vue'
import { usePlaylists } from '@/stores/playlists'
import { toast } from '@/toast'
import Icon from './Icon.vue'

const props = defineProps({ track: { type: Object, required: true } })
const emit = defineEmits(['close'])
const store = usePlaylists()
const selected = ref([])
const loading = ref(true)
const saving = ref(false)
const newName = ref('')

onMounted(async () => {
  try {
    await store.load()
    selected.value = await store.membership(props.track.id)
  } catch {
    toast('No se pudieron cargar tus playlists', 'error')
  } finally {
    loading.value = false
  }
})

async function create () {
  const name = newName.value.trim()
  if (!name) return
  try {
    const p = await store.create(name.slice(0, 50))
    selected.value.push(p.id)
    newName.value = ''
  } catch { toast('No se pudo crear la playlist', 'error') }
}

async function save () {
  saving.value = true
  try {
    await store.setMembership(props.track.id, selected.value)
    toast('Playlists actualizadas', 'ok')
    emit('close')
  } catch {
    toast('No se pudo guardar', 'error')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="scrim" @click="emit('close')" />
    <div class="sheet panel" role="dialog" aria-modal="true" aria-labelledby="pp-title">
      <header>
        <h2 id="pp-title" class="neon-c">Guardar en</h2>
        <button class="icon-btn" aria-label="Cerrar" @click="emit('close')"><Icon name="close" /></button>
      </header>
      <p class="muted track">{{ track.title }}</p>
      <div v-if="loading" class="loader"><span /><span /><span /><span /></div>
      <template v-else>
        <label v-for="pl in store.items" :key="pl.id" class="opt">
          <input v-model="selected" type="checkbox" :value="pl.id">
          <span class="box"><Icon name="check" :size="14" /></span>
          <span>{{ pl.name }}</span>
        </label>
        <p v-if="!store.items.length" class="muted">Aún no tienes playlists.</p>
        <form class="new" @submit.prevent="create">
          <input v-model="newName" class="input" maxlength="50" placeholder="Nueva playlist" aria-label="Nueva playlist">
          <button class="btn magenta" type="submit" :disabled="!newName.trim()"><Icon name="plus" :size="16" /></button>
        </form>
        <button class="btn block" :disabled="saving" @click="save">Guardar</button>
      </template>
    </div>
  </Teleport>
</template>

<style scoped>
.scrim { position: fixed; inset: 0; z-index: 90; background: rgba(0, 0, 0, 0.6); }
.sheet {
  position: fixed;
  z-index: 100;
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 80dvh;
  overflow-y: auto;
  padding: 16px 18px calc(18px + env(safe-area-inset-bottom));
  background: var(--panel-solid);
  animation: up 0.2s ease-out;
}
@keyframes up { from { transform: translateY(40px); opacity: 0; } }
@media (min-width: 700px) {
  .sheet { left: 50%; right: auto; bottom: auto; top: 50%; width: 420px; transform: translate(-50%, -50%); animation: none; }
}
header { display: flex; align-items: center; justify-content: space-between; }
header h2 { margin: 0; }
.track { margin: 0 0 12px; font-size: 0.85rem; }
.opt { display: flex; align-items: center; gap: 12px; min-height: 44px; cursor: pointer; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
.opt input { position: absolute; opacity: 0; }
.box { width: 20px; height: 20px; display: grid; place-items: center; border: 1px solid var(--line-strong); color: transparent; }
.opt input:checked + .box { background: var(--cyan); color: #000; box-shadow: var(--glow-c); }
.opt input:focus-visible + .box { outline: 1px dashed var(--yellow); outline-offset: 2px; }
.new { display: flex; gap: 8px; margin: 14px 0; }
</style>
