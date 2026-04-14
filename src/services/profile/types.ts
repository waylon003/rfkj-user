export interface ProfileCenterSummary {
  label: string
  value: string
  accent?: 'orange' | 'dark'
  route?: string
}

export interface ProfileCenterMenu {
  id: string
  title: string
  iconClass: string
  route: string
}

export interface ProfileCenterData {
  brandName: string
  memberId: string
  summaries: ProfileCenterSummary[]
  menus: ProfileCenterMenu[]
  lastLogin: string
}

export interface ProfileInfoSectionItem {
  label: string
  value: string
  badge?: string
}

export interface ProfileInfoSection {
  title: string
  items: ProfileInfoSectionItem[]
}

export interface ProfileInfoData {
  brandName: string
  memberId: string
  sections: ProfileInfoSection[]
}

export interface GiftRecordItem {
  id: string
  type: 'income' | 'expense' | 'returned'
  title: string
  amount: string
  time: string
  method: string
  statusText?: string
  actionText?: string
  qrValue?: string
}

export interface GiftRecordData {
  title: string
  list: GiftRecordItem[]
}

export type PendingGiftTab = 'pending' | 'claimed' | 'expired'

export interface PendingGiftItem {
  id: string
  title: string
  timeLabel: string
  actionLabel: string
  tab: PendingGiftTab
  qrValue?: string
}

export interface PendingGiftData {
  tabs: Array<{
    label: string
    value: PendingGiftTab
  }>
  items: PendingGiftItem[]
}

export type BillTab = 'all' | 'coin' | 'ticket' | 'gift'

export interface BillRecord {
  id: string
  title: string
  time: string
  amount: string
  status: string
  tab: BillTab
}

export interface BillPageData {
  tabs: Array<{
    label: string
    value: BillTab
  }>
  monthLabel: string
  monthRecords: BillRecord[]
  historyLabel: string
  historyRecords: BillRecord[]
}
