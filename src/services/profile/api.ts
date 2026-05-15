import { APP_CONFIG } from '@/config'
import type { GiftRecordData, PendingGiftData } from './types'

interface ApiEnvelope<T> {
  code: number
  message: string
  data: T
  timestamp?: number
}

interface UserTransferApiRecord {
  id: number | null
  userId?: number | null
  descId?: number | null
  userPhone?: string | null
  descPhone?: string | null
  stdMode?: number | null
  number?: number | null
  userName?: string | null
  descUserName?: string | null
  createdAt?: string | null
}

interface UserTransferApiResponse {
  total: number
  list: UserTransferApiRecord[]
}

interface UserExpendApiRecord {
  id: number | null
  userId?: number | null
  businessId?: number | null
  integral?: number | null
  coin?: number | null
  ticket?: number | null
  createDateTime?: string | null
  barcodeId?: number | null
  stockId?: number | null
  number?: number | null
  isTakeDelivery?: boolean | null
  barcodeName?: string | null
  imageUrl?: string | null
  phone?: string | null
}

interface UserExpendApiResponse {
  total: number
  list: UserExpendApiRecord[]
}

export async function getGiftRecordDataRequest(): Promise<GiftRecordData> {
  const [sentRecords, receivedRecords] = await Promise.all([
    fetchUserTransferList(true),
    fetchUserTransferList(false)
  ])

  const list = [
    ...sentRecords.map(record => mapTransferItem(record, 'expense')),
    ...receivedRecords.map(record => mapTransferItem(record, 'income'))
  ].sort((a, b) => String(b.time).localeCompare(String(a.time)))

  return {
    title: '互赠记录',
    list
  }
}

export async function getPendingGiftDataRequest(): Promise<PendingGiftData> {
  const result = await fetchUserExpendList()

  const items = result.list.map(record => mapPendingGiftItem(record))

  return {
    tabs: [
      { label: '待领取', value: 'pending' },
      { label: '已领取', value: 'claimed' },
      { label: '已过期', value: 'expired' }
    ],
    items
  }
}

async function fetchUserTransferList(give: boolean) {
  const result = await request<ApiEnvelope<UserTransferApiResponse>>({
    url: `${APP_CONFIG.authBaseUrl}/wechat/member/usertransfer?pageSize=100&pageIndex=1&give=${give ? 'true' : 'false'}`,
    method: 'GET',
    header: withAuthorization()
  })

  return (result.data.list || []).filter(item => item.id !== null)
}

export async function fetchUserExpendList() {
  const result = await request<ApiEnvelope<UserExpendApiResponse>>({
    url: `${APP_CONFIG.authBaseUrl}/wechat/member/userexpends?pageSize=100&pageIndex=1&takeFlag=0`,
    method: 'GET',
    header: withAuthorization()
  })

  return result.data
}

export async function fetchPendingGiftCount(): Promise<number> {
  const result = await request<ApiEnvelope<{ total: number }>>({
    url: `${APP_CONFIG.authBaseUrl}/wechat/member/userexpends?pageSize=1&pageIndex=1&takeFlag=2`,
    method: 'GET',
    header: withAuthorization()
  })

  return result.data.total || 0
}

interface UserBuyApiRecord {
  id: number | null
  memberId?: number | null
  storeId?: number | null
  saleId?: number | null
  amount?: number | null
  coin?: number | null
  created?: string | null
  orderNumber?: string | null
  saleName?: string | null
}

interface UserBuyApiResponse {
  total: number
  list: UserBuyApiRecord[]
}

export async function fetchUserBuysList(phone: string) {
  const result = await request<ApiEnvelope<UserBuyApiResponse>>({
    url: `${APP_CONFIG.authBaseUrl}/api/cashregister/userbuys?pageSize=100&pageIndex=1&phone=${encodeURIComponent(phone)}`,
    method: 'GET',
    header: withAuthorization()
  })

  return result.data
}

interface RedeemRecordApiItem {
  id: number | null
  userId?: number | null
  number?: number | null
  category?: number | null
  redeemNumber?: number | null
  description?: string | null
}

interface RedeemRecordApiResponse {
  total: number
  list: RedeemRecordApiItem[]
}

export async function fetchRedeemRecordList() {
  const result = await request<ApiEnvelope<RedeemRecordApiResponse>>({
    url: `${APP_CONFIG.authBaseUrl}/wechat/member/redeem?pageSize=100&pageIndex=1`,
    method: 'GET',
    header: withAuthorization()
  })

  return result.data
}

export async function confirmGiftPickupRequest(orderIds: number[]): Promise<void> {
  await request<ApiEnvelope<boolean>>({
    url: `${APP_CONFIG.authBaseUrl}/wechat/member/userpickup`,
    method: 'POST',
    header: {
      ...withAuthorization(),
      'Content-Type': 'application/json'
    },
    data: orderIds.map(id => ({ id }))
  })
}

export function mapUserBuyToBillRecord(record: UserBuyApiRecord): import('./types').BillRecord {
  const amountYuan = (record.amount || 0) / 100
  return {
    id: `buy-${record.id}`,
    title: record.saleName || '购买游戏币',
    time: formatTime(record.created),
    amount: `+${record.coin || 0}`,
    status: `¥${amountYuan.toFixed(2)}`,
    tab: 'coin'
  }
}

export function mapRedeemToBillRecord(record: RedeemRecordApiItem): import('./types').BillRecord {
  const desc = record.description || getCategoryText(record.category)
  return {
    id: `redeem-${record.id}`,
    title: desc,
    time: '',
    amount: `-${record.number || 0}`,
    status: `换得 ${record.redeemNumber || 0}`,
    tab: 'ticket'
  }
}

function getCategoryText(category?: number | null): string {
  switch (category) {
    case 0: return '彩票换积分'
    case 1: return '彩票换币'
    case 2: return '积分换币'
    default: return '兑换'
  }
}

export function mapExpendToBillRecord(record: UserExpendApiRecord): import('./types').BillRecord {
  return {
    id: `expend-${record.id}`,
    title: record.barcodeName || '积分兑换礼品',
    time: formatTime(record.createDateTime),
    amount: `-${record.integral || 0}`,
    status: record.isTakeDelivery ? '已提货' : '待提货',
    tab: 'gift'
  }
}

function mapTransferItem(
  record: UserTransferApiRecord,
  type: 'income' | 'expense'
): GiftRecordData['list'][number] {
  const amount = Number(record.number || 0)
  const otherName =
    type === 'income'
      ? record.userName || record.userPhone || '对方'
      : record.descUserName || record.descPhone || '对方'

  return {
    id: String(record.id),
    type,
    title: type === 'income' ? `收到 ${otherName} 赠送` : `赠送给 ${otherName}`,
    amount: `${type === 'income' ? '+' : '-'}${amount}`,
    time: formatTime(record.createdAt),
    method: '微信转账',
    statusType: type === 'income' ? 'received' : 'pending',
    statusText: type === 'income' ? '已收到' : '已转出'
  }
}

function mapPendingGiftItem(record: UserExpendApiRecord): PendingGiftData['items'][number] {
  const isClaimed = Boolean(record.isTakeDelivery)
  return {
    id: String(record.id),
    title: record.barcodeName || '未命名礼品',
    timeLabel: isClaimed
      ? `领取时间: ${formatTime(record.createDateTime)}`
      : `创建时间: ${formatTime(record.createDateTime)}`,
    actionLabel: isClaimed ? '已领取' : '待领取',
    tab: isClaimed ? 'claimed' : 'pending',
    image: normalizeImageUrl(record.imageUrl),
    pickupAddress: '当前门店领取'
  }
}

function formatTime(value?: string | null) {
  const text = (value || '').trim()
  return text || '暂无时间'
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
    throw new Error('当前缺少登录会话，无法请求用户接口')
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
