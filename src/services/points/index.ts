import { getPointGiftConfirmData as getMockPointGiftConfirmData } from '@/mock/modules/points'
import { getPointCategoriesRequest, getPointItemsRequest, submitPointGiftRequest } from './api'
import type { PointGiftConfirmData, PointGiftPageData, SubmitPointGiftPayload, SubmitPointGiftResult } from './types'

export async function getPointGiftPageData(): Promise<PointGiftPageData> {
  const categories = await getPointCategoriesRequest()
  if (!categories.length) {
    return {
      balance: '',
      categories: [{ label: '全部', value: 'all' }],
      items: []
    }
  }

  const categoryItems = await Promise.all(categories.map(category => getPointItemsRequest(category.value)))
  const items = categoryItems.flat()

  return {
    balance: '',
    categories: [{ label: '全部', value: 'all' }, ...categories],
    items
  }
}

export function getPointGiftConfirmData(): PointGiftConfirmData {
  return getMockPointGiftConfirmData()
}

export function submitPointGift(payload: SubmitPointGiftPayload): Promise<SubmitPointGiftResult> {
  return submitPointGiftRequest(payload)
}

export type {
  PointGiftCategory,
  PointGiftConfirmData,
  PointGiftItem,
  PointGiftPageData,
  SubmitPointGiftPayload,
  SubmitPointGiftResult
} from './types'
