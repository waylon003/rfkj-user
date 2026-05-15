import { APP_CONFIG } from '@/config'
import type {
  SubmitGiftPayload,
  SubmitGiftResult,
  SubmitRedeemPayload,
  SubmitRedeemResult,
  UserTransferListData
} from './types'

interface ApiEnvelope<T> {
  code: number
  message: string
  data: T
  timestamp?: number
}

export async function submitGiftRequest(payload: SubmitGiftPayload): Promise<SubmitGiftResult> {
  const body = {
    receivePhone: payload.receivePhone,
    coin: payload.assetType === 'coin' ? payload.quantity : 0,
    integral: payload.assetType === 'points' ? payload.quantity : 0,
    ticket: payload.assetType === 'ticket' ? payload.quantity : 0
  }

  await request<ApiEnvelope<boolean>>({
    url: `${APP_CONFIG.authBaseUrl}/wechat/member/usertransfer`,
    method: 'POST',
    header: {
      ...withAuthorization(),
      'Content-Type': 'application/json'
    },
    data: body
  })

  return {
    success: true
  }
}

export async function submitRedeemRequest(payload: SubmitRedeemPayload): Promise<SubmitRedeemResult> {
  const body = {
    number: payload.number,
    category: payload.category,
    catetory: payload.category
  }

  const result = await request<ApiEnvelope<string>>({
    url: `${APP_CONFIG.authBaseUrl}/wechat/member/redeem`,
    method: 'POST',
    header: {
      ...withAuthorization(),
      'Content-Type': 'application/json'
    },
    data: body
  })

  return {
    success: true,
    message: result.data || result.message || '兑换完成'
  }
}

/**
 * 查询转账记录
 * @param give true=我转出的, false=我收到的
 * @param pageIndex 页码
 * @param pageSize 页长
 */
export async function getUserTransferListRequest(
  give: boolean,
  pageIndex = 1,
  pageSize = 20
): Promise<UserTransferListData> {
  const result = await request<ApiEnvelope<UserTransferListData>>({
    url: `${APP_CONFIG.authBaseUrl}/wechat/member/usertransfer?give=${give}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
    method: 'GET',
    header: {
      ...withAuthorization()
    }
  })

  return result.data || { total: 0, list: [] }
}

function withAuthorization() {
  const sessionId = getSessionId()
  if (!sessionId) {
    throw new Error('当前缺少登录会话，无法提交赠送请求')
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
