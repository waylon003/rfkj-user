export interface PointGiftCategory {
  label: string
  value: string
}

export interface PointGiftItem {
  id: string
  title: string
  cost: string
  category: string
  image?: string
  stock: number
  barcodeId?: number
  storeId?: number
  stockId?: number
  stateMode?: 'available' | 'insufficient' | 'soldout'
  shortfallText?: string
}

export interface PointGiftPageData {
  balance: string
  categories: PointGiftCategory[]
  items: PointGiftItem[]
}

export interface PointGiftConfirmData {
  title: string
  giftName: string
  requiredPoints: string
  availablePoints: string
  hint: string[]
}

export interface SubmitPointGiftPayload {
  userUid: string
  barcodeId: number
  storeId: number
  stockId: number
  number: number
}

export interface SubmitPointGiftResult {
  success: boolean
  integral?: number
  coin?: number
  ticket?: number
  message?: string
}
