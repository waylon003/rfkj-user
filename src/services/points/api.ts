import { APP_CONFIG } from '@/config'

interface ApiEnvelope<T> {
  code: number
  message: string
  data: T
  timestamp?: number
}

interface PointCategoryApiRecord {
  id: number | null
  name: string | null
  description?: string | null
  order?: number | null
  businessId?: number | null
}

interface PointCategoryApiResponse {
  total: number
  list: PointCategoryApiRecord[]
}

interface PointItemApiRecord {
  id: number | null
  barcodeId?: number | null
  storeId?: number | null
  stockId?: number | null
  name: string | null
  unit?: string | null
  price?: number | null
  integral?: number | null
  inventories?: number | null
  categoryId?: number | null
  image?: string | null
  staging?: number | null
  examine?: number | null
  purchasePrice?: number | null
  barcodePriceId?: number | null
}

interface PointItemApiResponse {
  total: number
  list: PointItemApiRecord[]
}

export interface RealPointGiftCategory {
  label: string
  value: string
}

export interface RealPointGiftItem {
  id: string
  title: string
  cost: string
  category: string
  image?: string
  stock: number
  barcodeId?: number
  storeId?: number
  stockId?: number
}

interface PointRedeemApiResponse {
  flag?: boolean
  returnQuantity?: number
  message?: string
  integral?: number
  coin?: number
  name?: string
  description?: string
  ticket?: number
}

export async function getPointCategoriesRequest(): Promise<RealPointGiftCategory[]> {
  const result = await request<ApiEnvelope<PointCategoryApiResponse>>({
    url: `${APP_CONFIG.authBaseUrl}/wechat/member/shopCategories?pageSize=100&pageIndex=1`,
    method: 'GET',
    header: {
      ...withAuthorization()
    }
  })

  return (result.data.list || [])
    .filter(item => item.id !== null)
    .map(item => ({
      label: item.name || '未命名分类',
      value: String(item.id)
    }))
}

export async function getPointItemsRequest(categoryId: string): Promise<RealPointGiftItem[]> {
  const result = await request<ApiEnvelope<PointItemApiResponse>>({
    url: `${APP_CONFIG.authBaseUrl}/wechat/member/barcodes?pageSize=100&pageIndex=1&categoryId=${encodeURIComponent(categoryId)}`,
    method: 'GET',
    header: {
      ...withAuthorization()
    }
  })

  return (result.data.list || [])
    .filter(item => item.id !== null)
    .map(item => ({
      id: String(item.id),
      title: item.name || '未命名礼品',
      cost: String(item.integral ?? item.price ?? 0),
      category: String(item.categoryId ?? categoryId),
      image: normalizeImageUrl(item.image),
      stock: Number(item.inventories || 0),
      barcodeId: item.barcodeId ?? undefined,
      storeId: item.storeId ?? undefined,
      stockId: item.stockId ?? undefined
    }))
}

export async function submitPointGiftRequest(payload: {
  userUid: string
  barcodeId: number
  storeId: number
  stockId: number
  number: number
}): Promise<{
  success: boolean
  integral?: number
  coin?: number
  ticket?: number
  message?: string
}> {
  const result = await request<ApiEnvelope<PointRedeemApiResponse>>({
    url: `${APP_CONFIG.authBaseUrl}/wechat/member/userexpendcommodity`,
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      userUid: payload.userUid,
      barcodeId: payload.barcodeId,
      storeId: payload.storeId,
      stockId: payload.stockId,
      number: payload.number,
      stag: true
    }
  })

  return {
    success: Boolean(result.data?.flag ?? true),
    integral: result.data?.integral,
    coin: result.data?.coin,
    ticket: result.data?.ticket,
    message: result.data?.message || '兑换完成'
  }
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
