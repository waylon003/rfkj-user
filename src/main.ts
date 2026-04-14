import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { useAppStore, useUserStore } from './stores'

export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  app.use(pinia)

  const userStore = useUserStore(pinia)
  userStore.init()

  const appStore = useAppStore(pinia)
  appStore.init()

  return {
    app,
    pinia
  }
}
