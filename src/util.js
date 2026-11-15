export function formatTime (s) {
  if (!Number.isFinite(s) || s < 0) s = 0
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}

// Deterministic neon gradient for tracks without cover art.
export function coverGradient (seed = '') {
  let h = 0
  for (const ch of String(seed)) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  const a = h % 360
  return `linear-gradient(135deg, hsl(${a} 100% 45%), hsl(${(a + 70) % 360} 100% 30%) 60%, #05060a)`
}
