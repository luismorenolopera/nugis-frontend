// Thin fetch wrapper around nugis-backend.
const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000/').replace(/\/?$/, '/')

export class ApiError extends Error {
  constructor (status, data) {
    super(typeof data?.detail === 'string' ? data.detail : `HTTP ${status}`)
    this.status = status
    this.data = data
  }
}

let onUnauthorized = () => {}
export function setUnauthorizedHandler (fn) { onUnauthorized = fn }

export function getToken () {
  return localStorage.getItem('token')
}

export async function api (path, { method = 'GET', body, signal } = {}) {
  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Token ${token}`
  let payload = body
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }
  const res = await fetch(BASE + path.replace(/^\//, ''), { method, headers, body: payload, signal })
  const text = await res.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { data = text }
  if (res.status === 401 && token) onUnauthorized()
  if (!res.ok) throw new ApiError(res.status, data)
  return data
}

// Normalise a backend track into what the player needs.
export function toTrack (t) {
  const artist = t.artists?.[0]?.alias || t.artists?.[0]?.first_name || 'Desconocido'
  return {
    id: t.id,
    title: t.title,
    artist,
    src: t.file,
    cover: t.thumbnail || t.album?.image || null,
    duration: t.duration || 0,
    uploadBy: typeof t.upload_by === 'object' ? t.upload_by?.id : t.upload_by
  }
}
