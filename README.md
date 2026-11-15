# nugis-frontend

Web client for [Nugis](https://github.com/luismorenolopera/nugis-backend), a
personal music streaming app. Neon "2077" interface, global player with a
10-band equalizer and real-time spectrum visualizer, works on desktop and mobile.

## Stack

- Vue 3 + Vite, Pinia, Vue Router
- No UI framework: hand-written CSS and inline SVG icons (initial JS ≈ 55 KB gzip)
- Web Audio API for the equalizer (`src/audio/`)
- Media Session API for lock-screen / headphone controls

## Features

- Sign up / log in (token auth against nugis-backend)
- Home feed of the latest uploads, search by title
- Library: create, open, play and delete playlists; add any track to playlists
- Upload an MP3 (≤ 10 MB, drag & drop) or import audio from a YouTube link
- Global player: queue, shuffle, repeat (all / one), seek, volume, keeps playing while you navigate
- Equalizer: 10 bands (32 Hz – 16 kHz, ±12 dB), preamp, presets
  (Flat, Bass boost, Rock, Pop, Electronic, Vocal, Synthwave, Treble), saved per device
- Responsive: sidebar on desktop, bottom tab bar + full-screen player on mobile
- Respects `prefers-reduced-motion`

## Setup

Requires Node 20.19+ (or 22.12+).

```sh
cp .env.example .env   # set VITE_API_URL to your backend
npm install
npm run dev            # http://localhost:5173
npm test               # unit tests (vitest)
npm run build          # production build in dist/
```

### Equalizer and CORS

Web Audio can only process audio from another origin if the server sends CORS
headers for the audio files. nugis-backend's nginx config adds them on `/media/`.
If they are missing the music still plays, but the equalizer is disabled for that
track and the UI says why.

## Docker

```sh
VITE_API_URL=https://api.example.com/ docker compose up --build -d
```

Serves the built app on port 8080 with SPA routing and long-term caching of assets.
