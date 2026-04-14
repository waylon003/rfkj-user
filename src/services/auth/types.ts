export type UserMode = 'guest' | 'member'
export type LoginType = 'wechat' | 'phoneCode' | null

export type AuthScene =
  | 'generic'
  | 'member-code'
  | 'gift-coin'
  | 'purchase-coin'
  | 'points-exchange'
  | 'ticket-exchange'
  | 'profile'
  | 'bill'
  | 'gift-records'

export type AuthDialogStep =
  | 'welcome'
  | 'wechat-login'
  | 'wechat-phone'
  | 'phone-input'
  | 'code-verify'
  | 'profile-complete'
  | 'success'

export interface AuthSceneConfig {
  scene: AuthScene
  title: string
  description: string
  primaryActionText: string
  secondaryActionText?: string
}

export interface AuthUserProfile {
  uid: string
  nickname: string
  memberId: string
  avatar: string
  phone: string
  address: string
  storeId: number | null
  coin: number
  integral: number
  ticket: number
  status: boolean
}

export interface AuthLoginResult {
  sessionId: string
  loginType: Exclude<LoginType, null>
  requiresProfileComplete: boolean
  userInfo: AuthUserProfile
}

export interface PhoneCodeSendResult {
  phone: string
  maskedPhone: string
  resendAfterSeconds: number
  expireSeconds: number
  message: string
}

export interface ProfileCompletePayload {
  nickname: string
  phone?: string
  address?: string
  avatar?: string
}

export interface ProfileCompleteResult {
  success: boolean
  userInfo: AuthUserProfile
}
