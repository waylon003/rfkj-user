import type {
  AuthLoginResult,
  AuthScene,
  AuthSceneConfig,
  AuthUserProfile,
  PhoneCodeSendResult,
  ProfileCompletePayload,
  ProfileCompleteResult
} from '@/services/auth/types'

const defaultUser: AuthUserProfile = {
  uid: '1502312271444528860',
  nickname: '用户昵称',
  memberId: 'ID:23132112312',
  avatar: 'https://sukao.oss-cn-hangzhou.aliyuncs.com/redeem/upload/c491e15e93b441a4955e83c076f0b5a2.jpg',
  phone: '13507342227',
  address: '广东省中山市南区欢乐谷商业中心一楼 101 服务台',
  storeId: 15,
  coin: 12123,
  integral: 12123,
  ticket: 456,
  status: true
}

const sceneMap: Record<AuthScene, AuthSceneConfig> = {
  generic: {
    scene: 'generic',
    title: '登录后继续',
    description: '登录后可同步会员信息、资产和门店权益。',
    primaryActionText: '微信快捷登录',
    secondaryActionText: '手机号验证码登录'
  },
  'member-code': {
    scene: 'member-code',
    title: '登录后查看会员二维码',
    description: '登录会员后享受更多权益',
    primaryActionText: '微信快捷登录',
    secondaryActionText: '手机号验证码登录'
  },
  'gift-coin': {
    scene: 'gift-coin',
    title: '登录后可赠送游戏币',
    description: '赠币记录与领取状态需要绑定当前会员账号。',
    primaryActionText: '微信快捷登录',
    secondaryActionText: '手机号验证码登录'
  },
  'purchase-coin': {
    scene: 'purchase-coin',
    title: '登录后可购买游戏币',
    description: '购币成功后将实时发放到当前会员账户。',
    primaryActionText: '微信快捷登录',
    secondaryActionText: '手机号验证码登录'
  },
  'points-exchange': {
    scene: 'points-exchange',
    title: '登录后可兑换礼品',
    description: '积分、礼品库存与领取记录都需要绑定会员身份。',
    primaryActionText: '微信快捷登录',
    secondaryActionText: '手机号验证码登录'
  },
  'ticket-exchange': {
    scene: 'ticket-exchange',
    title: '登录后可使用彩票兑积分',
    description: '彩票余额和积分入账记录都需要绑定当前会员。',
    primaryActionText: '微信快捷登录',
    secondaryActionText: '手机号验证码登录'
  },
  profile: {
    scene: 'profile',
    title: '登录后查看我的资料',
    description: '昵称、手机号、地址等会员资料需要登录后查看。',
    primaryActionText: '微信快捷登录',
    secondaryActionText: '手机号验证码登录'
  },
  bill: {
    scene: 'bill',
    title: '登录后查看我的账单',
    description: '账单记录属于当前会员的个人资产明细。',
    primaryActionText: '微信快捷登录',
    secondaryActionText: '手机号验证码登录'
  },
  'gift-records': {
    scene: 'gift-records',
    title: '登录后查看互赠记录',
    description: '互赠记录和二维码领取状态需要绑定当前会员身份。',
    primaryActionText: '微信快捷登录',
    secondaryActionText: '手机号验证码登录'
  }
}

let currentUser = { ...defaultUser }

export function getAuthSceneConfig(scene: AuthScene): AuthSceneConfig {
  return sceneMap[scene] || sceneMap.generic
}

export function loginWithWechatCode(code: string): AuthLoginResult {
  return {
    sessionId: `wechat-${code || 'mock'}-session`,
    loginType: 'wechat',
    requiresProfileComplete: false,
    userInfo: { ...currentUser }
  }
}

export function sendPhoneLoginCode(phone: string): PhoneCodeSendResult {
  return {
    phone,
    maskedPhone: `${phone.slice(0, 3)}****${phone.slice(-4)}`,
    resendAfterSeconds: 60,
    expireSeconds: 300,
    message: '验证码已发送'
  }
}

export function verifyPhoneLoginCode(phone: string, code: string): AuthLoginResult {
  return {
    sessionId: `phone-${phone}-${code}-session`,
    loginType: 'phoneCode',
    requiresProfileComplete: false,
    userInfo: {
      ...currentUser,
      phone
    }
  }
}

export function completeUserProfile(payload: ProfileCompletePayload): ProfileCompleteResult {
  currentUser = {
    ...currentUser,
    nickname: payload.nickname || currentUser.nickname,
    phone: payload.phone || currentUser.phone,
    address: payload.address || currentUser.address,
    avatar: payload.avatar || currentUser.avatar
  }

  return {
    success: true,
    userInfo: { ...currentUser }
  }
}

export function getCurrentUserProfile(): AuthUserProfile {
  return { ...currentUser }
}
