export interface PointGiftCategory {
  label: string
  value: string
}

export interface PointGiftItem {
  id: string
  title: string
  cost: string
  category: string
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
