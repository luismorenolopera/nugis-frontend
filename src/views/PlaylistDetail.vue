<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { api, toTrack } from '@/api'
import { usePlayer } from '@/stores/player'
import { usePlaylists } from '@/stores/playlists'
import { toast } from '@/toast'
import { formatTime } from '@/util'
import TrackList from '@/components/TrackList.vue'
import Icon from '@/components/Icon.vue'

const props = defineProps({ id: { type: String, required: true } })
const router = useRouter()
const player = usePlayer()
const store = usePlaylists()
const playlist = ref(null)
const loading = ref(true)
const tracks = computed(() => (playlist.value?.tracks || []).map(toTrack))
const total = computed(() => tracks.value.reduce((s, t) => s + (t.duration || 0), 0))

watchEffect(async () => {
  loading.value = true
  try { playlist.value = await api(`music/playlists/${props.id}/`) } catch { playlist.value = null } finally { loading.value = false }
})

async function remove () {
  if (!confirm(`¿Borrar la playlist “${playlist.value.name}”?`)) return
  try { await store.remove(playlist.value.id); router.push({ name: 'library' }) } catch { toast('No se pudo borrar', 'error') }
}
</script>

<template>
  <div>
    <div v-if="loading" class="loader"><span /><span /><span /><span /></div>
    <p v-else-if="!playlist" class="empty">Esta playlist no existe.</p>
    <template v-else>
      <header class="head">
        <div>
          <div class="mono-label">// playlist · {{ tracks.length }} pistas · {{ formatTime(total) }}</div>
          <h1 class="neon-c">{{ playlist.name }}</h1>
        </div>
        <div class="acts">
          <button class="btn" :disabled="!tracks.length" @click="player.playList(tracks, 0)"><Icon name="play" :size="16" /> Reproducir</button>
          <button class="btn magenta" :disabled="!tracks.length" @click="player.shuffle || player.toggleShuffle(); player.playList(tracks, Math.floor(Math.random() * tracks.length))"><Icon name="shuffle" :size="16" /></button>
          <button class="icon-btn" aria-label="Borrar playlist" title="Borrar playlist" @click="remove"><Icon name="trash" /></button>
        </div>
      </header>
      <p v-if="!tracks.length" class="empty">Vacía. Agrega canciones con <b>+</b> desde Inicio o Buscar.</p>
      <TrackList v-else :tracks="tracks" variant="rows" />
    </template>
  </div>
</template>

<style scoped>
.head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 14px; margin-bottom: 18px; }
.head h1 { margin: 0; word-break: break-word; }
.acts { display: flex; gap: 8px; align-items: center; }
</style>
