<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

const auth = useAuth()
const router = useRouter()
const mode = ref('login')
const loading = ref(false)
const error = ref('')
const show = ref(false)
const f = reactive({ username: '', first_name: '', last_name: '', password: '', confirm: '' })
const errs = reactive({})

function validate () {
  for (const k of Object.keys(errs)) delete errs[k]
  if (!f.username.trim()) errs.username = 'Requerido'
  if (!f.password) errs.password = 'Requerido'
  if (mode.value === 'signup') {
    if (!f.first_name.trim()) errs.first_name = 'Requerido'
    if (!f.last_name.trim()) errs.last_name = 'Requerido'
    if (f.password && f.password.length < 8) errs.password = 'Mínimo 8 caracteres'
    if (f.confirm !== f.password) errs.confirm = 'Las contraseñas no coinciden'
  }
  return !Object.keys(errs).length
}

async function submit () {
  error.value = ''
  if (!validate()) return
  loading.value = true
  try {
    if (mode.value === 'login') {
      await auth.login(f.username.trim(), f.password)
    } else {
      await auth.signup({ username: f.username.trim(), first_name: f.first_name.trim(), last_name: f.last_name.trim(), password: f.password })
    }
    router.push({ name: 'home' })
  } catch (e) {
    if (mode.value === 'login') error.value = 'Las credenciales no coinciden'
    else if (e.data?.username) error.value = 'Este nombre de usuario está en uso'
    else if (e.data?.password) error.value = [].concat(e.data.password).join(' ')
    else error.value = 'No se pudo completar el registro'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="landing">
    <section class="hero">
      <div class="mono-label">// sistema de audio personal · build 2077</div>
      <h1 class="logo glitch" data-text="NUGIS">NUGIS</h1>
      <p class="tag">Tu música. Tu ecualización. <span class="neon-m">Sin límites.</span></p>
      <ul class="feats mono-label">
        <li>EQ 10 bandas</li><li>Visualizador en tiempo real</li><li>Importa desde YouTube</li>
      </ul>
    </section>

    <section class="card panel">
      <div class="tabs" role="tablist">
        <button :class="['tab', { active: mode === 'login' }]" role="tab" :aria-selected="mode === 'login'" @click="mode = 'login'">Iniciar sesión</button>
        <button :class="['tab', { active: mode === 'signup' }]" role="tab" :aria-selected="mode === 'signup'" @click="mode = 'signup'">Regístrate</button>
      </div>
      <form novalidate @submit.prevent="submit">
        <div class="field">
          <label for="u">Usuario</label>
          <input id="u" v-model="f.username" class="input" autocomplete="username" autocapitalize="none">
          <span v-if="errs.username" class="err">{{ errs.username }}</span>
        </div>
        <div v-if="mode === 'signup'" class="row">
          <div class="field">
            <label for="fn">Nombre</label>
            <input id="fn" v-model="f.first_name" class="input" maxlength="30" autocomplete="given-name">
            <span v-if="errs.first_name" class="err">{{ errs.first_name }}</span>
          </div>
          <div class="field">
            <label for="ln">Apellido</label>
            <input id="ln" v-model="f.last_name" class="input" maxlength="30" autocomplete="family-name">
            <span v-if="errs.last_name" class="err">{{ errs.last_name }}</span>
          </div>
        </div>
        <div class="field">
          <label for="pw">Contraseña</label>
          <div class="pw">
            <input id="pw" v-model="f.password" class="input" :type="show ? 'text' : 'password'"
                   :autocomplete="mode === 'login' ? 'current-password' : 'new-password'">
            <button type="button" class="reveal mono-label" @click="show = !show">{{ show ? 'ocultar' : 'ver' }}</button>
          </div>
          <span v-if="errs.password" class="err">{{ errs.password }}</span>
        </div>
        <div v-if="mode === 'signup'" class="field">
          <label for="pc">Confirmar contraseña</label>
          <input id="pc" v-model="f.confirm" class="input" :type="show ? 'text' : 'password'" autocomplete="new-password">
          <span v-if="errs.confirm" class="err">{{ errs.confirm }}</span>
        </div>
        <p v-if="error" class="error" role="alert">{{ error }}</p>
        <button class="btn block" type="submit" :disabled="loading">
          {{ loading ? 'Conectando…' : mode === 'login' ? 'Entrar' : 'Crear cuenta' }}
        </button>
      </form>
    </section>
  </div>
</template>

<style scoped>
.landing {
  min-height: calc(100dvh - 56px);
  display: grid;
  align-items: center;
  gap: 32px;
  max-width: 1100px;
  margin: 0 auto;
}
@media (min-width: 900px) { .landing { grid-template-columns: 1.2fr 1fr; gap: 64px; } }
.logo {
  font-family: var(--font-display);
  font-size: clamp(3.4rem, 13vw, 7.5rem);
  line-height: 1;
  letter-spacing: 0.12em;
  margin: 10px 0 14px;
  color: var(--cyan);
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.8), 0 0 40px rgba(0, 240, 255, 0.4), 4px 4px 0 rgba(255, 43, 214, 0.6);
}
.tag { font-size: 1.1rem; margin: 0 0 18px; }
.feats { display: flex; flex-wrap: wrap; gap: 8px; list-style: none; padding: 0; margin: 0; }
.feats li { border: 1px solid var(--line); padding: 6px 10px; }
.card { padding: 20px 22px 24px; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.pw { position: relative; }
.reveal { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: 0; cursor: pointer; color: var(--cyan); }
.error { color: var(--red); border-left: 2px solid var(--red); padding-left: 10px; font-size: 0.85rem; }
</style>
