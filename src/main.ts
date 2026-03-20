import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersistedState from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import { setupNaiveUI } from './plugins/naive-ui'
import './assets/main.css'

const app = createApp(App)

// ─── Pinia ────────────────────────────────────────────────────────
const pinia = createPinia()
pinia.use(piniaPersistedState)
app.use(pinia)

// ─── Restore auth session from localStorage ───────────────────────
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
authStore.initFromStorage()

// ─── Router ───────────────────────────────────────────────────────
app.use(router)

// ─── Naive UI ─────────────────────────────────────────────────────
setupNaiveUI(app)

app.mount('#app')
