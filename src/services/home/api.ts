import { APP_CONFIG } from '@/config'

interface ApiEnvelope<T> {
  code: number
  message: string
  data: T
  timestamp?: number
}

interface HomeBannerApiRecord {
  id: number | null
  businessId: number | null
  sort: number | null
  title: string | null
  imageUrl: string | null
}

interface HomeBannerApiResponse {
  interval?: number | null
  total: number
  list: HomeBannerApiRecord[]
}

export interface HomeBannerRecord {
  id: string
  image: string
  title: string
  subtitle?: string
}

export async function getHomeBannersRequest(storeId?: number | null): Promise<HomeBannerRecord[]> {
  const query = [`pageIndex=1`, `pageSize=6`]
  if (typeof storeId === 'number' && storeId > 0) {
    query.push(`storeId=${storeId}`)
  }

  const result = await request<ApiEnvelope<HomeBannerApiResponse>>({
    url: `${APP_CONFIG.authBaseUrl}/wechat/member/banners?${query.join('&')}`,
    method: 'GET',
    header: {
      ...withAuthorization()
    }
  })

  return (result.data.list || [])
    .filter(item => item.id !== null)
    .map(item => ({
      id: String(item.id),
      image: normalizeImageUrl(item.imageUrl),
      title: item.title || '活动推荐',
      subtitle: item.businessId ? `业务 ${item.businessId}` : undefined
    }))
}

function normalizeImageUrl(value?: string | null) {
  const raw = (value || '').trim()
  if (!raw) {
    return ''
  }

  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('/')) {
    return raw
  }

  if (/^www\./i.test(raw)) {
    return `https://${raw}`
  }

  return raw
}

function withAuthorization() {
  const sessionId = getSessionId()
  if (!sessionId) {
    return {}
  }

  return {
    Authorization: `Bearer ${sessionId}`
  }
}

function getSessionId() {
  const cached = uni.getStorageSync('rfkj-user-session')
  return cached?.sessionId || ''
}

function request<T>(options: UniApp.RequestOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success(res) {
        const data = res.data as ApiEnvelope<any>
        if (res.statusCode !== 200 || !data || data.code !== 200) {
          reject(new Error(data?.message || `请求失败(${res.statusCode})`))
          return
        }
        resolve(data as T)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

export async function getMemberQrcodeRequest(): Promise<string> {
  const result = await request<ApiEnvelope<string>>({
    url: `${APP_CONFIG.authBaseUrl}/wechat/member/qrcode`,
    method: 'GET',
    header: {
      ...withAuthorization()
    }
  })

  return result.data || ''
}
