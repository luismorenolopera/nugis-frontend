import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fontsource/orbitron/latin-700.css'
import './styles/main.css'
import App from './App.vue'
import router from './router'
import { setUnauthorizedHandler } from './api'
import { useAuth } from './stores/auth'

const app = createApp(App)
app.use(createPinia())
app.use(router)

setUnauthorizedHandler(() => {
  useAuth().logout()
  router.push({ name: 'landing' })
})

app.mount('#app')
