import { APP_CONFIG } from '@/config'
import type { PurchasePackage } from './types'

interface ApiEnvelope<T> {
  code: number
  message: string
  data: T
  timestamp?: number
}

interface CoinSaleApiRecord {
  id: number
  name: string
  description: string
  amount: number
  coin: number
  storeId: number
  order: number
}

interface CoinSaleApiResponse {
  total: number
  list: CoinSaleApiRecord[]
}

export async function fetchCoinSalesRequest(): Promise<PurchasePackage[]> {
  const result = await request<ApiEnvelope<CoinSaleApiResponse>>({
    url: `${APP_CONFIG.authBaseUrl}/wechat/member/coinsales?pageSize=20&pageIndex=1`,
    method: 'GET',
    header: withAuthorization()
  })

  const list = result.data.list || []
  return list
    .sort((a, b) => a.order - b.order)
    .map(item => ({
      id: `sale-${item.id}`,
      coinText: `${item.coin}枚`,
      price: item.amount / 100,
      unitPriceText: item.coin > 0 ? `¥${(item.amount / 100 / item.coin).toFixed(2)}/枚` : undefined
    }))
}

function withAuthorization() {
  const sessionId = getSessionId()
  if (!sessionId) {
    throw new Error('当前缺少登录会话，无法请求套餐接口')
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
