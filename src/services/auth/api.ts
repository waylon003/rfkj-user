import { APP_CONFIG } from '@/config'
import type {
  AuthLoginResult,
  AuthUserProfile,
  PhoneCodeSendResult,
  ProfileCompletePayload,
  ProfileCompleteResult
} from './types'

interface ApiEnvelope<T> {
  code: number
  message: string
  data: T
  timestamp?: number
}

interface WechatLoginRawUserInfo {
  phone?: string | null
  uid?: string | null
  uuid?: string | null
  avatar?: string | null
  nickname?: string | null
  address?: string | null
  status?: boolean | null
  storeId?: number | null
  cardFactorySerial?: string | null
  coin?: number | null
  integral?: number | null
  ticket?: number | null
}

let latestProfile: AuthUserProfile | null = null

export async function loginWithWechatCodeRequest(code: string): Promise<AuthLoginResult> {
  const result = await request<ApiEnvelope<{ sessionId: string; userInfo: WechatLoginRawUserInfo }>>({
    url: `${APP_CONFIG.authBaseUrl}/wechat/member/onlogin?code=${encodeURIComponent(code)}`,
    method: 'POST'
  })

  const userInfo = mapUserProfile(result.data.userInfo)
  latestProfile = userInfo

  return {
    sessionId: result.data.sessionId,
    loginType: 'wechat',
    requiresProfileComplete: !userInfo.nickname || !userInfo.phone,
    userInfo
  }
}

export async function getWechatPhoneNumberRequest(code: string, storeId: number | null, sessionId?: string): Promise<AuthUserProfile> {
  const header = sessionId
    ? {
        Authorization: `Bearer ${sessionId}`
      }
    : undefined

  const result = await request<ApiEnvelope<WechatLoginRawUserInfo>>({
    url: `${APP_CONFIG.authBaseUrl}/wechat/member/GetUserPhoneNumber?code=${encodeURIComponent(code)}&storeId=${storeId || 0}`,
    method: 'GET',
    header
  })

  const profile = mapUserProfile({
    ...result.data,
    storeId: result.data?.storeId ?? storeId ?? null
  })
  latestProfile = profile
  return profile
}

export async function sendPhoneLoginCodeRequest(phone: string): Promise<PhoneCodeSendResult> {
  ensureVerifyCodeApiKey()

  const result = await request<ApiEnvelope<{ code?: string | number }>>({
    url: `${APP_CONFIG.authBaseUrl}/api/verifyCode/send?phone=${encodeURIComponent(phone)}`,
    method: 'POST',
    header: {
      'x-api-key': APP_CONFIG.verifyCodeApiKey
    }
  })

  return {
    phone,
    maskedPhone: `${phone.slice(0, 3)}****${phone.slice(-4)}`,
    resendAfterSeconds: 60,
    expireSeconds: 300,
    message: result.message || '验证码已发送'
  }
}

export async function verifyPhoneLoginCodeRequest(phone: string, code: string): Promise<AuthLoginResult> {
  ensureVerifyCodeApiKey()

  await request<ApiEnvelope<null>>({
    url: `${APP_CONFIG.authBaseUrl}/api/verifyCode/check?phone=${encodeURIComponent(phone)}&code=${encodeURIComponent(code)}`,
    method: 'POST',
    header: {
      'x-api-key': APP_CONFIG.verifyCodeApiKey
    }
  })

  const profile = latestProfile || {
    uid: `phone-${phone}`,
    nickname: '用户昵称',
    memberId: '',
    avatar: '',
    phone,
    address: '',
    storeId: null,
    coin: 0,
    integral: 0,
    ticket: 0,
    status: true
  }

  latestProfile = {
    ...profile,
    phone
  }

  return {
    sessionId: `phone-verified-${phone}`,
    loginType: 'phoneCode',
    requiresProfileComplete: !latestProfile.nickname,
    userInfo: latestProfile
  }
}

export async function getCurrentUserProfileRequest(): Promise<AuthUserProfile> {
  const result = await request<ApiEnvelope<WechatLoginRawUserInfo>>({
    url: `${APP_CONFIG.authBaseUrl}/wechat/member/userinfo`,
    method: 'GET',
    header: withAuthorization()
  })

  const profile = mapUserProfile(result.data)
  latestProfile = profile
  return profile
}

export async function completeUserProfileRequest(payload: ProfileCompletePayload): Promise<ProfileCompleteResult> {
  await request<ApiEnvelope<boolean>>({
    url: `${APP_CONFIG.authBaseUrl}/wechat/member/updateaddress`,
    method: 'POST',
    header: {
      ...withAuthorization(),
      'Content-Type': 'application/json'
    },
    data: {
      contacts: payload.nickname,
      tel: payload.phone,
      address: payload.address,
      nickname: payload.nickname,
      avatar: payload.avatar
    }
  })

  const profile = latestProfile
    ? {
        ...latestProfile,
        nickname: payload.nickname || latestProfile.nickname,
        phone: payload.phone || latestProfile.phone,
        address: payload.address || latestProfile.address,
        avatar: payload.avatar || latestProfile.avatar
      }
    : mapUserProfile({
        nickname: payload.nickname,
        phone: payload.phone,
        address: payload.address,
        avatar: payload.avatar,
        status: true
      })

  latestProfile = profile

  return {
    success: true,
    userInfo: profile
  }
}

function mapUserProfile(raw?: WechatLoginRawUserInfo | null): AuthUserProfile {
  const uid = raw?.uid || raw?.uuid || ''
  const memberIdBase = raw?.cardFactorySerial || uid.slice(-12) || '000000000000'

  return {
    uid,
    nickname: raw?.nickname || '用户昵称',
    memberId: `ID:${memberIdBase}`,
    avatar: raw?.avatar || '',
    phone: raw?.phone || '',
    address: raw?.address || '',
    storeId: raw?.storeId ?? null,
    coin: Number(raw?.coin || 0),
    integral: Number(raw?.integral || 0),
    ticket: Number(raw?.ticket || 0),
    status: Boolean(raw?.status ?? true)
  }
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

function ensureVerifyCodeApiKey() {
  if (!APP_CONFIG.verifyCodeApiKey) {
    throw new Error('未配置验证码接口 x-api-key，请设置 VITE_VERIFY_CODE_API_KEY')
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
