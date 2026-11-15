<script setup>
// Tiny inline icon set (stroke icons, 24x24) — no icon font to download.
defineProps({ name: { type: String, required: true }, size: { type: [Number, String], default: 22 } })

const P = {
  home: 'M3 11 12 3l9 8M5 9.5V21h5v-6h4v6h5V9.5',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 17-4.35-4.35',
  library: 'M4 4v16M9 4v16M14 4l6 16',
  upload: 'M12 16V4m0 0-5 5m5-5 5 5M4 20h16',
  logout: 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11',
  play: 'M7 4v16l13-8z',
  pause: 'M7 4h3v16H7zM14 4h3v16h-3z',
  next: 'M5 5v14l10-7zM18 5v14',
  prev: 'M19 5v14L9 12zM6 5v14',
  shuffle: 'M3 6h4l10 12h4M3 18h4l3-3.6M14 9.6 17 6h4M18 3l3 3-3 3M18 15l3 3-3 3',
  repeat: 'M4 11V8h14l-3-3M20 13v3H6l3 3M15 11l3-3',
  volume: 'M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11',
  mute: 'M4 9v6h4l5 4V5L8 9zM17 9l5 6M22 9l-5 6',
  eq: 'M5 4v7M5 15v5M12 4v3M12 11v9M19 4v9M19 17v3M3 13h4M10 9h4M17 15h4',
  plus: 'M12 5v14M5 12h14',
  close: 'M6 6l12 12M18 6 6 18',
  up: 'M6 15l6-6 6 6',
  down: 'M6 9l6 6 6-6',
  youtube: 'M3 8c0-2 1-3 3-3h12c2 0 3 1 3 3v8c0 2-1 3-3 3H6c-2 0-3-1-3-3zM10 9v6l5-3z',
  file: 'M6 3h8l4 4v14H6zM14 3v4h4M9 17a2 2 0 1 0 0-.01M11 17V11l4-1',
  check: 'M5 12l5 5 9-10',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  music: 'M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01'
}
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">
    <path :d="P[name]" />
  </svg>
</template>
