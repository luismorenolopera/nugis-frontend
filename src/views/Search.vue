<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api, toTrack } from '@/api'
import TrackList from '@/components/TrackList.vue'
import Icon from '@/components/Icon.vue'

const route = useRoute()
const router = useRouter()
const q = ref(route.query.q || '')
const tracks = ref([])
const loading = ref(false)
const searched = ref(false)
let timer = 0
let ctrl = null

async function search () {
  const term = q.value.trim()
  router.replace({ query: term ? { q: term } : {} })
  if (!term) { tracks.value = []; searched.value = false; return }
  ctrl?.abort()
  ctrl = new AbortController()
  loading.value = true
  try {
    const data = await api(`music/tracks/?search=${encodeURIComponent(term)}`, { signal: ctrl.signal })
    tracks.value = data.results.map(toTrack)
    searched.value = true
  } catch (e) {
    if (e.name !== 'AbortError') tracks.value = []
  } finally {
    loading.value = false
  }
}

watch(q, () => { clearTimeout(timer); timer = setTimeout(search, 300) })
if (q.value) search()
</script>

<template>
  <div>
    <div class="mono-label">// consulta</div>
    <h1>Buscar</h1>
    <form class="bar" role="search" @submit.prevent="search">
      <Icon name="search" class="ic" />
      <input v-model="q" class="input" type="search" placeholder="Título de la canción…" aria-label="Buscar canciones" autofocus>
    </form>
    <div v-if="loading" class="loader"><span /><span /><span /><span /></div>
    <p v-else-if="searched && !tracks.length" class="empty">Sin resultados para “{{ q }}”.</p>
    <TrackList v-else :tracks="tracks" />
  </div>
</template>

<style scoped>
.bar { position: relative; margin-bottom: 20px; }
.bar .input { padding-left: 46px; min-height: 54px; font-size: 1rem; }
.ic { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--cyan); }
</style>
