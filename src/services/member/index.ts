import { withModuleMock } from '@/mock'
import type { GiftCoinPageData } from './types'

export function getGiftCoinPageData() {
  return withModuleMock<'member', GiftCoinPageData>(
    'member',
    module => module.getGiftCoinPageData()
  )
}

export type { GiftCoinPageData } from './types'
