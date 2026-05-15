import { getHomePageData as getMockHomePageData } from '@/mock/modules/home'
import { getHomeBannersRequest, getMemberQrcodeRequest } from './api'
import type { HomePageData } from './types'

function getSelectedStoreId() {
  const cached = uni.getStorageSync('rfkj-user-session')
  return cached?.selectedStoreId ?? cached?.profile?.storeId ?? null
}

function hasSession(): boolean {
  const cached = uni.getStorageSync('rfkj-user-session')
  return Boolean(cached?.sessionId)
}

export async function getHomePageData(): Promise<HomePageData> {
  const mockData = getMockHomePageData()
  const storeId = getSelectedStoreId()
  const banners = await getHomeBannersRequest(storeId)

  let posterQrValue = mockData.posterQrValue

  // 已登录用户获取真实二维码
  if (hasSession()) {
    try {
      const qrcode = await getMemberQrcodeRequest()
      if (qrcode) {
        posterQrValue = qrcode
      }
    } catch (error) {
      console.warn('获取会员二维码失败，使用默认值', error)
    }
  }

  return {
    ...mockData,
    posterQrValue,
    banners
  }
}

export type {
  HomeBanner,
  HomeModuleCard,
  HomePageData,
  HomeQuickAction,
  HomeStat,
  HomeUserCard
} from './types'
