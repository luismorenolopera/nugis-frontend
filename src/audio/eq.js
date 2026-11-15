// Equalizer definition shared by the audio engine and the UI.
export const BANDS = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]
export const MAX_DB = 12

export const PRESETS = {
  flat: { label: 'Plano', gains: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  bass: { label: 'Bass boost', gains: [7, 6, 5, 3, 1, 0, 0, 0, 0, 0] },
  rock: { label: 'Rock', gains: [5, 4, 2, -1, -2, -1, 2, 4, 5, 5] },
  pop: { label: 'Pop', gains: [-1, 1, 3, 4, 3, 0, -1, -1, 1, 2] },
  electronic: { label: 'Electrónica', gains: [6, 5, 1, 0, -2, 1, 0, 2, 4, 5] },
  vocal: { label: 'Vocal', gains: [-3, -2, -1, 1, 4, 5, 4, 2, 0, -1] },
  synthwave: { label: 'Synthwave', gains: [5, 4, 2, 0, -1, 0, 2, 3, 5, 6] },
  treble: { label: 'Agudos', gains: [0, 0, 0, 0, 0, 1, 3, 5, 7, 8] }
}

export function formatHz (hz) {
  return hz >= 1000 ? `${hz / 1000}k` : `${hz}`
}

export function clampDb (db) {
  const n = Number(db)
  if (!Number.isFinite(n)) return 0
  return Math.max(-MAX_DB, Math.min(MAX_DB, Math.round(n * 10) / 10))
}

// Which preset (if any) matches the given gains.
export function matchPreset (gains) {
  for (const [key, p] of Object.entries(PRESETS)) {
    if (p.gains.every((g, i) => g === gains[i])) return key
  }
  return 'custom'
}

const STORAGE_KEY = 'nugis.eq'

export function loadEqSettings () {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (s && Array.isArray(s.gains) && s.gains.length === BANDS.length) {
      return { enabled: s.enabled !== false, preamp: clampDb(s.preamp), gains: s.gains.map(clampDb) }
    }
  } catch { /* ignore */ }
  return { enabled: true, preamp: 0, gains: [...PRESETS.flat.gains] }
}

export function saveEqSettings (s) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}
