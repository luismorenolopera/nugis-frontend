// Extract an 11-char YouTube video id from a URL or a bare id.
export function parseYoutubeId (input) {
  const s = (input || '').trim()
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s
  try {
    const u = new URL(s)
    if (u.hostname.endsWith('youtu.be')) return u.pathname.slice(1, 12) || null
    if (u.hostname.includes('youtube.com')) {
      if (u.searchParams.get('v')) return u.searchParams.get('v')
      const m = u.pathname.match(/\/(shorts|embed|live)\/([A-Za-z0-9_-]{11})/)
      if (m) return m[2]
    }
  } catch { /* not a URL */ }
  return null
}
