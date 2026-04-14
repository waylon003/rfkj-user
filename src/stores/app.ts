import { defineStore } from 'pinia'
import type { AuthScene } from '@/services/auth'

interface AppState {
  statusBarHeight: number
  safeAreaBottom: number
  menuButtonTop: number
  menuButtonHeight: number
  menuButtonWidth: number
  authDialogVisible: boolean
  authDialogScene: AuthScene
  pendingAuthRoute: string
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    statusBarHeight: 20,
    safeAreaBottom: 0,
    menuButtonTop: 0,
    menuButtonHeight: 32,
    menuButtonWidth: 88,
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

      if (typeof uni.getMenuButtonBoundingClientRect === 'function') {
        const menuRect = uni.getMenuButtonBoundingClientRect()
        this.menuButtonTop = menuRect.top || this.statusBarHeight + 6
        this.menuButtonHeight = menuRect.height || 32
        this.menuButtonWidth = menuRect.width || 88
      } else {
        this.menuButtonTop = this.statusBarHeight + 6
        this.menuButtonHeight = 32
        this.menuButtonWidth = 88
      }
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
