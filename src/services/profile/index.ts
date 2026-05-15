import { withModuleMock } from '@/mock'
import { getCurrentUserProfile } from '@/services/auth'
import {
  confirmGiftPickupRequest,
  fetchPendingGiftCount,
  fetchRedeemRecordList,
  fetchUserBuysList,
  fetchUserExpendList,
  getGiftRecordDataRequest,
  getPendingGiftDataRequest,
  mapExpendToBillRecord,
  mapRedeemToBillRecord,
  mapUserBuyToBillRecord
} from './api'
import type {
  BillPageData,
  BillRecord,
  GiftRecordData,
  PendingGiftData,
  ProfileCenterData,
  ProfileInfoData
} from './types'

function hasSession(): boolean {
  const cached = uni.getStorageSync('rfkj-user-session')
  return Boolean(cached?.sessionId)
}

export async function getProfileCenterData(): Promise<ProfileCenterData> {
  // Menus still come from mock (no backend config API)
  const mockData = await withModuleMock<'profile', ProfileCenterData>(
    'profile',
    module => module.getProfileCenterData()
  )

  // Only call real APIs when user has a valid session
  if (hasSession()) {
    // Overwrite identity fields with real user data
    try {
      const currentUser = await getCurrentUserProfile()
      mockData.brandName = currentUser.nickname || mockData.brandName
      mockData.memberId = currentUser.memberId || mockData.memberId
    } catch {
      // If userinfo fails, keep mock identity
    }

    // Fetch pending gift count from real API (takeFlag=2 = 未提货)
    try {
      const pendingCount = await fetchPendingGiftCount()
      const giftSummary = mockData.summaries.find(s => s.label === '礼品兑换')
      if (giftSummary) {
        giftSummary.value = String(pendingCount)
      }
    } catch {
      // If API fails, default to 0
      const giftSummary = mockData.summaries.find(s => s.label === '礼品兑换')
      if (giftSummary) {
        giftSummary.value = '0'
      }
    }
  } else {
    // Guest: show 0 for pending gifts
    const giftSummary = mockData.summaries.find(s => s.label === '礼品兑换')
    if (giftSummary) {
      giftSummary.value = '0'
    }
  }

  return mockData
}

export function getProfileInfoData() {
  return getProfileInfoDataResolved()
}

export function getGiftRecordData() {
  return getGiftRecordDataResolved()
}

export function getPendingGiftData() {
  return getPendingGiftDataResolved()
}

export function confirmGiftPickup(orderIds: number[]) {
  return confirmGiftPickupRequest(orderIds)
}

export async function getBillPageData(): Promise<BillPageData> {
  const tabs: BillPageData['tabs'] = [
    { label: '全部', value: 'all' },
    { label: '购币', value: 'coin' },
    { label: '彩票兑积分', value: 'ticket' },
    { label: '积分兑换', value: 'gift' }
  ]

  const allRecords: BillRecord[] = []

  // Only call real APIs when user has a valid session
  if (hasSession()) {
    // Fetch purchase records (userbuys)
    try {
      const cached = uni.getStorageSync('rfkj-user-session')
      const phone = cached?.profile?.phone || ''
      if (phone) {
        const buys = await fetchUserBuysList(phone)
        allRecords.push(...(buys.list || []).map(mapUserBuyToBillRecord))
      }
    } catch {
      // userbuys failed, skip this category
    }

    // Fetch redeem records (ticket exchange)
    try {
      const redeems = await fetchRedeemRecordList()
      allRecords.push(...(redeems.list || []).map(mapRedeemToBillRecord))
    } catch {
      // redeem records failed, skip
    }

    // Fetch gift exchange records (userexpends)
    try {
      const expends = await fetchUserExpendList()
      allRecords.push(...(expends.list || []).map(mapExpendToBillRecord))
    } catch {
      // userexpends failed, skip
    }
  }

  // Sort all records by time descending
  allRecords.sort((a, b) => String(b.time).localeCompare(String(a.time)))

  // Split into month vs history — use current month as divider
  const now = new Date()
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthRecords = allRecords.filter(r => r.time.startsWith(currentMonthPrefix))
  const historyRecords = allRecords.filter(r => !r.time.startsWith(currentMonthPrefix))

  return {
    tabs,
    monthLabel: `${now.getMonth() + 1}月`,
    monthRecords: monthRecords.length > 0 ? monthRecords : allRecords.slice(0, 3),
    historyLabel: '更早',
    historyRecords: historyRecords.length > 0 ? historyRecords : []
  }
}

async function getProfileInfoDataResolved(): Promise<ProfileInfoData> {
  const currentUser = await getCurrentUserProfile()

  return {
    brandName: currentUser.nickname || '如风科技',
    memberId: currentUser.memberId || 'ID:--',
    sections: [
      {
        title: '基础信息',
        items: [
          { label: '会员名称', value: currentUser.nickname || '未设置' },
          { label: '账号ID', value: (currentUser.memberId || '').replace(/^ID:/, '') || '未设置' }
        ]
      },
      {
        title: '联系方式',
        items: [
          { label: '手机号', value: currentUser.phone || '未绑定' },
          { label: '常用地址', value: currentUser.address || '未设置' }
        ]
      }
    ]
  }
}

async function getGiftRecordDataResolved(): Promise<GiftRecordData> {
  return getGiftRecordDataRequest()
}

async function getPendingGiftDataResolved(): Promise<PendingGiftData> {
  return getPendingGiftDataRequest()
}

export type {
  BillTab,
  BillPageData,
  GiftRecordData,
  GiftRecordItem,
  PendingGiftData,
  PendingGiftItem,
  PendingGiftTab,
  ProfileCenterData,
  ProfileCenterMenu,
  ProfileCenterSummary,
  ProfileInfoData,
  ProfileInfoSection,
  ProfileInfoSectionItem
} from './types'

