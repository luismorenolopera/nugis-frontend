<script setup>
import { ref } from 'vue'
import { api, toTrack } from '@/api'
import { toast } from '@/toast'
import TrackList from '@/components/TrackList.vue'
import Icon from '@/components/Icon.vue'
import { parseYoutubeId } from '@/youtube'

const MAX = 10 * 1024 * 1024
const tab = ref('youtube')
const result = ref(null)

// YouTube
const url = ref('')
const preview = ref(null)
const ytLoading = ref(false)

async function lookup () {
  const id = parseYoutubeId(url.value)
  result.value = null
  preview.value = null
  if (!id) return toast('No es un enlace de YouTube válido', 'error')
  ytLoading.value = true
  try {
    const data = await api(`music/yt_upload?id=${id}`)
    if (data.file) result.value = toTrack(data)
    else preview.value = data
  } catch {
    toast('Este video no existe o no está disponible', 'error')
  } finally {
    ytLoading.value = false
  }
}

async function download () {
  ytLoading.value = true
  try {
    const data = await api('music/yt_upload', { method: 'POST', body: { id: preview.value.id } })
    result.value = toTrack(data)
    preview.value = null
    url.value = ''
    toast('Pista importada', 'ok')
  } catch {
    toast('No es posible descargar este video en este momento', 'error')
  } finally {
    ytLoading.value = false
  }
}

// Local file
const title = ref('')
const thumb = ref('')
const file = ref(null)
const fileInput = ref(null)
const upLoading = ref(false)
const dragging = ref(false)

function pick (f) {
  if (!f) return
  const isMp3 = /audio\/(mpeg|mp3)/.test(f.type) || /\.mp3$/i.test(f.name)
  if (!isMp3) return toast('Solo se permiten archivos MP3', 'error')
  if (f.size > MAX) return toast('El archivo no puede superar los 10 MB', 'error')
  file.value = f
  if (!title.value) title.value = f.name.replace(/\.mp3$/i, '').slice(0, 100)
}
function onDrop (e) { dragging.value = false; pick(e.dataTransfer.files[0]) }

async function upload () {
  if (!file.value || !title.value.trim()) return
  if (thumb.value && !/^https?:\/\//.test(thumb.value)) return toast('La imagen debe ser una URL', 'error')
  upLoading.value = true
  const body = new FormData()
  body.append('title', title.value.trim())
  if (thumb.value) body.append('thumbnail', thumb.value.trim())
  body.append('file', file.value, file.value.name)
  try {
    result.value = toTrack(await api('music/tracks/', { method: 'POST', body }))
    title.value = ''; thumb.value = ''; file.value = null
    toast('Pista subida', 'ok')
  } catch {
    toast('No se pudo subir el archivo', 'error')
  } finally {
    upLoading.value = false
  }
}
</script>

<template>
  <div class="wrap">
    <div class="mono-label">// ingesta de audio</div>
    <h1>Agregar música</h1>
    <div class="tabs" role="tablist">
      <button :class="['tab', { active: tab === 'youtube' }]" role="tab" :aria-selected="tab === 'youtube'" @click="tab = 'youtube'">
        <Icon name="youtube" :size="16" /> YouTube
      </button>
      <button :class="['tab', { active: tab === 'file' }]" role="tab" :aria-selected="tab === 'file'" @click="tab = 'file'">
        <Icon name="file" :size="16" /> Archivo local
      </button>
    </div>

    <section v-if="tab === 'youtube'">
      <form class="row" @submit.prevent="lookup">
        <input v-model="url" class="input" type="url" inputmode="url" placeholder="https://youtu.be/…" aria-label="Enlace de YouTube">
        <button class="btn" type="submit" :disabled="ytLoading || !url">Buscar</button>
      </form>
      <div v-if="ytLoading" class="loader"><span /><span /><span /><span /></div>
      <article v-else-if="preview" class="preview panel">
        <img v-if="preview.thumbnail" :src="preview.thumbnail" alt="" loading="lazy">
        <div class="pmeta">
          <h2>{{ preview.title }}</h2>
          <button class="btn magenta" @click="download"><Icon name="upload" :size="16" /> Importar</button>
        </div>
      </article>
    </section>

    <section v-else>
      <form @submit.prevent="upload">
        <label :class="['drop', { dragging, has: file }]"
               @dragover.prevent="dragging = true" @dragleave="dragging = false" @drop.prevent="onDrop">
          <input ref="fileInput" type="file" accept="audio/mpeg,.mp3" class="sr-only" @change="pick($event.target.files[0])">
          <Icon name="file" :size="32" />
          <span v-if="file">{{ file.name }} · {{ (file.size / 1048576).toFixed(1) }} MB</span>
          <span v-else>Arrastra un MP3 o <b class="neon-c">toca para elegir</b> (máx. 10 MB)</span>
        </label>
        <div class="field">
          <label for="t">Título</label>
          <input id="t" v-model="title" class="input" maxlength="100" required>
        </div>
        <div class="field">
          <label for="i">Imagen (URL, opcional)</label>
          <input id="i" v-model="thumb" class="input" type="url" maxlength="500" placeholder="https://…">
        </div>
        <button class="btn block" type="submit" :disabled="!file || !title.trim() || upLoading">
          {{ upLoading ? 'Subiendo…' : 'Subir' }}
        </button>
      </form>
    </section>

    <section v-if="result" class="result">
      <h2 class="mono-label">// listo</h2>
      <TrackList :tracks="[result]" />
    </section>
  </div>
</template>

<style scoped>
.wrap { max-width: 720px; }
.tab { display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
.row { display: flex; gap: 10px; }
.preview { display: grid; grid-template-columns: 1fr; margin-top: 20px; }
@media (min-width: 600px) { .preview { grid-template-columns: 240px 1fr; } }
.preview img { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }
.pmeta { padding: 16px; display: grid; align-content: space-between; gap: 12px; }
.pmeta h2 { text-transform: none; letter-spacing: 0.02em; font-size: 1rem; }
.drop {
  display: grid;
  place-items: center;
  gap: 10px;
  min-height: 150px;
  margin-bottom: 18px;
  padding: 20px;
  text-align: center;
  border: 1px dashed var(--line-strong);
  color: var(--muted);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.drop.dragging, .drop:hover { border-color: var(--cyan); background: rgba(0, 240, 255, 0.05); }
.drop.has { border-style: solid; border-color: var(--magenta); color: var(--text); }
.result { margin-top: 28px; }
</style>
