import type { AuthScene } from '@/services/auth'
import { useAppStore, useUserStore } from '@/stores'

export const protectedRouteSceneMap: Record<string, AuthScene> = {
  '/pages/member/tickets': 'ticket-exchange',
  '/pages/member/gift': 'gift-coin',
  '/pages/coin/recharge': 'purchase-coin',
  '/pages/points/exchange': 'points-exchange',
  '/pages/profile/info': 'profile',
  '/pages/profile/bill': 'bill',
  '/pages/profile/gifts': 'profile',
  '/pages/profile/gift-records': 'gift-records'
}

export function requireLogin(scene: AuthScene, onPass: () => void) {
  const userStore = useUserStore()
  const appStore = useAppStore()

  if (userStore.isLoggedIn) {
    onPass()
    return
  }

  appStore.openAuthDialog(scene)
}

export function requireLoginForRoute(scene: AuthScene, route: string, onPass: () => void) {
  const userStore = useUserStore()
  const appStore = useAppStore()

  if (userStore.isLoggedIn) {
    onPass()
    return
  }

  appStore.setPendingAuthRoute(route)
  appStore.openAuthDialog(scene)
}

export function getAuthSceneForRoute(url: string) {
  return protectedRouteSceneMap[url]
}

export function guardMemberPage(scene: AuthScene, fallbackUrl = '/pages/home/index') {
  const userStore = useUserStore()
  const appStore = useAppStore()

  if (userStore.isLoggedIn) {
    return true
  }

  const pages = getCurrentPages()
  const currentRoute = pages.length > 0 ? `/${pages[pages.length - 1].route}` : ''
  if (currentRoute) {
    appStore.setPendingAuthRoute(currentRoute)
  }
  appStore.openAuthDialog(scene)
  if (pages.length > 1) {
    uni.navigateBack()
    return false
  }

  uni.redirectTo({ url: fallbackUrl })
  return false
}

export function guardRouteAccess(route: string, fallbackUrl = '/pages/home/index') {
  const scene = getAuthSceneForRoute(route)
  if (!scene) {
    return true
  }

  return guardMemberPage(scene, fallbackUrl)
}
