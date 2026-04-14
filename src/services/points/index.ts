import { withModuleMock } from '@/mock'
import type { PointGiftConfirmData, PointGiftPageData } from './types'

export function getPointGiftPageData() {
  return withModuleMock<'points', PointGiftPageData>(
    'points',
    module => module.getPointGiftPageData()
  )
}

export function getPointGiftConfirmData() {
  return withModuleMock<'points', PointGiftConfirmData>(
    'points',
    module => module.getPointGiftConfirmData()
  )
}

export type {
  PointGiftCategory,
  PointGiftConfirmData,
  PointGiftItem,
  PointGiftPageData
} from './types'
