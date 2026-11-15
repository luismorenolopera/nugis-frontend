<script setup>
import { computed, defineAsyncComponent, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from './stores/auth'
import { usePlayer } from './stores/player'
import { usePlaylists } from './stores/playlists'
import AppNav from './components/AppNav.vue'
import PlayerBar from './components/PlayerBar.vue'
import ToastHost from './components/ToastHost.vue'

const PlayerDeck = defineAsyncComponent(() => import('./components/PlayerDeck.vue'))

const auth = useAuth()
const player = usePlayer()
const playlists = usePlaylists()
const route = useRoute()

const shell = computed(() => auth.isLogged && route.name !== 'landing')

onMounted(() => {
  player.init()
  if (auth.isLogged) auth.fetchMe()
})

watch(() => auth.isLogged, (logged) => {
  if (!logged) { player.stop(); playlists.reset() }
})
</script>

<template>
  <div :class="['app', { shell, 'has-player': shell && player.current }]">
    <AppNav v-if="shell" />
    <main class="main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <PlayerBar v-if="shell && player.current" />
    <PlayerDeck v-if="shell && player.current && player.expanded" />
    <ToastHost />
  </div>
</template>

<style>
.app { min-height: 100dvh; }
.main { padding: 24px clamp(16px, 4vw, 48px) 32px; max-width: 1400px; margin: 0 auto; }

.app.shell { --nav-h: 60px; }
.app.shell .main { padding-bottom: calc(var(--nav-h) + 32px + env(safe-area-inset-bottom)); }
.app.shell.has-player .main { padding-bottom: calc(var(--nav-h) + var(--player-h) + 32px + env(safe-area-inset-bottom)); }

@media (min-width: 900px) {
  .app.shell { --nav-h: 0px; }
  .app.shell .main { margin-left: var(--sidebar-w); max-width: none; }
}

.page-enter-active, .page-leave-active { transition: opacity 0.15s, transform 0.15s; }
.page-enter-from { opacity: 0; transform: translateY(6px); }
.page-leave-to { opacity: 0; }
</style>
