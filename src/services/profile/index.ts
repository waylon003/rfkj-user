import { withModuleMock } from '@/mock'
import type {
  BillPageData,
  GiftRecordData,
  PendingGiftData,
  ProfileCenterData,
  ProfileInfoData
} from './types'

export function getProfileCenterData() {
  return withModuleMock<'profile', ProfileCenterData>(
    'profile',
    module => module.getProfileCenterData()
  )
}

export function getProfileInfoData() {
  return withModuleMock<'profile', ProfileInfoData>(
    'profile',
    module => module.getProfileInfoData()
  )
}

export function getGiftRecordData() {
  return withModuleMock<'profile', GiftRecordData>(
    'profile',
    module => module.getGiftRecordData()
  )
}

export function getPendingGiftData() {
  return withModuleMock<'profile', PendingGiftData>(
    'profile',
    module => module.getPendingGiftData()
  )
}

export function getBillPageData() {
  return withModuleMock<'profile', BillPageData>(
    'profile',
    module => module.getBillPageData()
  )
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
