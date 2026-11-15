<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'
import Icon from './Icon.vue'

const auth = useAuth()
const router = useRouter()
const links = [
  { to: '/home', label: 'Inicio', icon: 'home' },
  { to: '/search', label: 'Buscar', icon: 'search' },
  { to: '/library', label: 'Biblioteca', icon: 'library' },
  { to: '/upload', label: 'Agregar', icon: 'upload' }
]

function logout () {
  auth.logout()
  router.push({ name: 'landing' })
}
</script>

<template>
  <nav class="nav" aria-label="Principal">
    <RouterLink to="/home" class="brand">
      <span class="glitch neon-c" data-text="NUGIS">NUGIS</span>
      <small class="mono-label">v2.077</small>
    </RouterLink>
    <RouterLink v-for="l in links" :key="l.to" :to="l.to" class="link" active-class="active">
      <Icon :name="l.icon" />
      <span>{{ l.label }}</span>
    </RouterLink>
    <div class="spacer" />
    <div v-if="auth.user" class="user mono-label">// {{ auth.user.username }}</div>
    <button class="link logout" type="button" @click="logout">
      <Icon name="logout" />
      <span>Salir</span>
    </button>
  </nav>
</template>

<style scoped>
/* Mobile: bottom tab bar */
.nav {
  position: fixed;
  z-index: 50;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(var(--nav-h) + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  background: rgba(5, 6, 10, 0.92);
  border-top: 1px solid var(--line-strong);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.brand, .spacer, .user { display: none; }
.link {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: var(--muted);
  background: none;
  border: 0;
  font: inherit;
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
}
.link.active { color: var(--cyan); text-shadow: var(--glow-c); }
.link.active svg { filter: drop-shadow(0 0 5px var(--cyan)); }

/* Desktop: sidebar */
@media (min-width: 900px) {
  .nav {
    top: 0;
    right: auto;
    width: var(--sidebar-w);
    height: auto;
    flex-direction: column;
    padding: 28px 16px calc(var(--player-h) + 20px);
    border-top: 0;
    border-right: 1px solid var(--line);
    background: rgba(5, 6, 10, 0.7);
  }
  .brand {
    display: flex;
    align-items: baseline;
    gap: 10px;
    padding: 0 12px 28px;
    font-family: var(--font-display);
    font-size: 1.7rem;
    font-weight: 700;
    letter-spacing: 0.18em;
  }
  .spacer { display: block; flex: 1; }
  .user { display: block; padding: 0 14px 8px; }
  .link {
    flex: none;
    flex-direction: row;
    justify-content: flex-start;
    gap: 14px;
    min-height: 48px;
    padding: 0 14px;
    font-size: 0.8rem;
    border-left: 2px solid transparent;
  }
  .link:hover { color: var(--text); background: rgba(0, 240, 255, 0.05); }
  .link.active { border-left-color: var(--cyan); background: linear-gradient(90deg, rgba(0, 240, 255, 0.14), transparent); }
}
</style>
