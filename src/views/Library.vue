<script setup>
import { onMounted, ref } from 'vue'
import { usePlaylists } from '@/stores/playlists'
import { toast } from '@/toast'
import { coverGradient } from '@/util'
import Icon from '@/components/Icon.vue'

const store = usePlaylists()
const loading = ref(!store.loaded)
const name = ref('')
const creating = ref(false)

onMounted(async () => {
  try { await store.load(true) } catch { toast('No se pudieron cargar tus playlists', 'error') } finally { loading.value = false }
})

async function create () {
  const n = name.value.trim()
  if (!n) return
  creating.value = true
  try { await store.create(n.slice(0, 50)); name.value = '' } catch { toast('No se pudo crear la playlist', 'error') } finally { creating.value = false }
}
</script>

<template>
  <div>
    <div class="mono-label">// memoria</div>
    <h1>Tu biblioteca</h1>
    <form class="new" @submit.prevent="create">
      <input v-model="name" class="input" maxlength="50" placeholder="Nombre de la nueva playlist" aria-label="Nombre de la nueva playlist">
      <button class="btn magenta" type="submit" :disabled="!name.trim() || creating"><Icon name="plus" :size="16" /> Crear</button>
    </form>
    <div v-if="loading" class="loader"><span /><span /><span /><span /></div>
    <p v-else-if="!store.items.length" class="empty">Aún no tienes playlists. Crea una arriba o usa <b>+</b> en cualquier canción.</p>
    <ul v-else class="grid">
      <li v-for="pl in store.items" :key="pl.id">
        <RouterLink :to="{ name: 'playlist', params: { id: pl.id } }" class="pl panel">
          <div class="art" :style="{ background: coverGradient(pl.name) }">
            <span class="count">{{ pl.tracks.length }}</span>
          </div>
          <div class="meta">
            <div class="name">{{ pl.name }}</div>
            <div class="mono-label">{{ pl.tracks.length }} {{ pl.tracks.length === 1 ? 'canción' : 'canciones' }}</div>
          </div>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.new { display: flex; gap: 10px; margin-bottom: 24px; max-width: 560px; }
.grid { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr)); }
.pl { display: block; color: inherit; transition: transform 0.15s, border-color 0.15s; }
.pl:hover { transform: translateY(-3px); border-color: var(--line-strong); }
.art { aspect-ratio: 16 / 10; display: grid; place-items: end start; padding: 12px; }
.count { font-family: var(--font-display); font-size: 2rem; color: #fff; text-shadow: 0 0 12px rgba(0, 0, 0, 0.6); }
.meta { padding: 10px 14px 14px; }
.name { font-weight: 700; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
@media (max-width: 520px) {
  .grid { grid-template-columns: 1fr 1fr; }
}
</style>
