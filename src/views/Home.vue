<script setup>
import { onMounted, ref } from 'vue'
import { api, toTrack } from '@/api'
import { useAuth } from '@/stores/auth'
import { usePlayer } from '@/stores/player'
import TrackList from '@/components/TrackList.vue'
import Icon from '@/components/Icon.vue'

const auth = useAuth()
const player = usePlayer()
const tracks = ref([])
const next = ref(null)
const loading = ref(true)
const loadingMore = ref(false)
const failed = ref(false)

async function load (url = 'music/tracks/') {
  const data = await api(url)
  tracks.value.push(...data.results.map(toTrack))
  next.value = data.next
}

onMounted(async () => {
  try { await load() } catch { failed.value = true } finally { loading.value = false }
})

async function more () {
  loadingMore.value = true
  try { await load(next.value.replace(/^https?:\/\/[^/]+\//, '')) } finally { loadingMore.value = false }
}
</script>

<template>
  <div>
    <header class="head">
      <div>
        <div class="mono-label">// feed · últimas subidas</div>
        <h1>Hola<span v-if="auth.user?.first_name">, <span class="neon-m">{{ auth.user.first_name }}</span></span></h1>
      </div>
      <button v-if="tracks.length" class="btn magenta" @click="player.playList(tracks, 0)">
        <Icon name="play" :size="16" /> Reproducir todo
      </button>
    </header>
    <div v-if="loading" class="loader"><span /><span /><span /><span /></div>
    <p v-else-if="failed" class="empty">No se pudo conectar con el servidor.</p>
    <p v-else-if="!tracks.length" class="empty">Todavía no hay canciones. <RouterLink to="/upload">Sube la primera</RouterLink>.</p>
    <template v-else>
      <TrackList :tracks="tracks" />
      <div v-if="next" class="more"><button class="btn" :disabled="loadingMore" @click="more">{{ loadingMore ? 'Cargando…' : 'Cargar más' }}</button></div>
    </template>
  </div>
</template>

<style scoped>
.head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 12px; margin-bottom: 20px; }
.head h1 { margin: 0; }
.more { display: flex; justify-content: center; margin-top: 24px; }
</style>
