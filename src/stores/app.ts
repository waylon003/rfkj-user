import { defineStore } from 'pinia'
import type { AuthScene } from '@/services/auth'

interface AppState {
  statusBarHeight: number
  safeAreaBottom: number
  authDialogVisible: boolean
  authDialogScene: AuthScene
  pendingAuthRoute: string
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    statusBarHeight: 20,
    safeAreaBottom: 0,
    authDialogVisible: false,
    authDialogScene: 'generic',
    pendingAuthRoute: ''
  }),
  actions: {
    init() {
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight || 20
      const safeAreaBottom = systemInfo.safeArea?.bottom ?? systemInfo.screenHeight
      this.safeAreaBottom =
        systemInfo.safeAreaInsets?.bottom ||
        Math.max(systemInfo.screenHeight - safeAreaBottom, 0)
    },
    openAuthDialog(scene: AuthScene = 'generic') {
      this.authDialogScene = scene
      this.authDialogVisible = true
    },
    setPendingAuthRoute(route: string) {
      this.pendingAuthRoute = route
    },
    clearPendingAuthRoute() {
      this.pendingAuthRoute = ''
    },
    closeAuthDialog() {
      this.authDialogVisible = false
    },
    setAuthDialogVisible(visible: boolean) {
      this.authDialogVisible = visible
    }
  }
})
