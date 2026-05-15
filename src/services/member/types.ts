export interface GiftCoinPageData {
  balance: string
  amount: string
  secondaryBadge: string
  qrAmount: string
  qrValue: string
  qrTipLines: string[]
}

export type GiftAssetType = 'coin' | 'ticket' | 'points'

export interface SubmitGiftPayload {
  assetType: GiftAssetType
  receivePhone: string
  quantity: number
}

export interface SubmitGiftResult {
  success: boolean
}

export interface SubmitRedeemPayload {
  number: number
  category: 0 | 1 | 2
}

export interface SubmitRedeemResult {
  success: boolean
  message: string
}

/** 转账记录 */
export interface UserTransferRecord {
  id: number
  userId: number
  descId: number
  userPhone: string
  descPhone: string
  /** 资产类型：1=金币, 2=积分, 3=彩票 */
  stdMode: 1 | 2 | 3
  number: number
  userName: string
  descUserName: string
  createdAt: string
}

/** 转账记录列表响应 */
export interface UserTransferListData {
  total: number
  list: UserTransferRecord[]
}
