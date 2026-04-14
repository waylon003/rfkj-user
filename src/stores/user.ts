import { defineStore } from 'pinia'
import type { AuthUserProfile, LoginType, UserMode } from '@/services/auth'

const STORAGE_KEY = 'rfkj-user-session'

export interface UserProfile {
  nickname: string
  memberId: string
  avatar: string
  city: string
  phone: string
  address: string
  storeId: number | null
  coin: number
  integral: number
  ticket: number
  status: boolean
}

const defaultProfile: UserProfile = {
  nickname: '游客',
  memberId: '',
  avatar: '',
  city: '',
  phone: '',
  address: '',
  storeId: null,
  coin: 0,
  integral: 0,
  ticket: 0,
  status: false
}

function toUserProfile(profile?: Partial<AuthUserProfile>): UserProfile {
  return {
    nickname: profile?.nickname || defaultProfile.nickname,
    memberId: profile?.memberId || defaultProfile.memberId,
    avatar: profile?.avatar || defaultProfile.avatar,
    city: profile?.address?.split(' ')?.[1] || '',
    phone: profile?.phone || defaultProfile.phone,
    address: profile?.address || defaultProfile.address,
    storeId: profile?.storeId ?? defaultProfile.storeId,
    coin: profile?.coin ?? defaultProfile.coin,
    integral: profile?.integral ?? defaultProfile.integral,
    ticket: profile?.ticket ?? defaultProfile.ticket,
    status: profile?.status ?? defaultProfile.status
  }
}

export const useUserStore = defineStore('user', {
  state: () => ({
    mode: 'guest' as UserMode,
    loginType: null as LoginType,
    sessionId: '',
    selectedStoreId: null as number | null,
    selectedStoreName: '欢乐谷旗舰店',
    isProfileCompleted: false,
    lastLoginTime: '',
    profile: { ...defaultProfile }
  }),
  getters: {
    isLoggedIn: state => state.mode === 'member' && !!state.sessionId,
    isGuest: state => state.mode === 'guest'
  },
  actions: {
    init() {
      const cached = uni.getStorageSync(STORAGE_KEY)
      if (!cached) {
        this.enterGuest()
        return
      }

      this.mode = cached.mode || 'guest'
      this.loginType = cached.loginType || null
      this.sessionId = cached.sessionId || ''
      this.selectedStoreId = cached.selectedStoreId ?? null
      this.selectedStoreName = cached.selectedStoreName || '欢乐谷旗舰店'
      this.isProfileCompleted = !!cached.isProfileCompleted
      this.lastLoginTime = cached.lastLoginTime || (cached.mode === 'member' ? formatDateTime(new Date()) : '')
      this.profile = {
        ...defaultProfile,
        ...(cached.profile || {})
      }
      this.persist()
    },
    persist() {
      uni.setStorageSync(STORAGE_KEY, {
        mode: this.mode,
        loginType: this.loginType,
        sessionId: this.sessionId,
        selectedStoreId: this.selectedStoreId,
        selectedStoreName: this.selectedStoreName,
        isProfileCompleted: this.isProfileCompleted,
        lastLoginTime: this.lastLoginTime,
        profile: this.profile
      })
    },
    enterGuest() {
      this.mode = 'guest'
      this.loginType = null
      this.sessionId = ''
      this.isProfileCompleted = false
      this.lastLoginTime = ''
      this.profile = { ...defaultProfile }
      this.persist()
    },
    login(payload: {
      sessionId: string
      loginType: Exclude<LoginType, null>
      userInfo: AuthUserProfile
      isProfileCompleted?: boolean
    }) {
      this.mode = 'member'
      this.loginType = payload.loginType
      this.sessionId = payload.sessionId
      this.profile = toUserProfile(payload.userInfo)
      this.selectedStoreId = payload.userInfo.storeId ?? null
      this.isProfileCompleted = payload.isProfileCompleted ?? true
      this.lastLoginTime = formatDateTime(new Date())
      this.persist()
    },
    logout() {
      this.enterGuest()
    },
    resetToGuestForMock() {
      this.enterGuest()
    },
    updateProfile(profile: Partial<UserProfile>) {
      this.profile = {
        ...this.profile,
        ...profile
      }
      this.isProfileCompleted = true
      this.persist()
    },
    setSelectedStore(store: { id?: number | null; name: string }) {
      this.selectedStoreId = store.id ?? null
      this.selectedStoreName = store.name
      this.persist()
    }
  }
})

function formatDateTime(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`
}
