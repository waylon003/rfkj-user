import { APP_CONFIG } from '@/config'
import { withModuleMock } from '@/mock'
import { submitGiftRequest, submitRedeemRequest, getUserTransferListRequest } from './api'
import type {
  GiftCoinPageData,
  SubmitGiftPayload,
  SubmitGiftResult,
  SubmitRedeemPayload,
  SubmitRedeemResult,
  UserTransferListData,
  UserTransferRecord
} from './types'

export function getGiftCoinPageData() {
  return withModuleMock<'member', GiftCoinPageData>(
    'member',
    module => module.getGiftCoinPageData()
  )
}

export function submitGift(payload: SubmitGiftPayload) {
  if (APP_CONFIG.authUseReal) {
    return submitGiftRequest(payload)
  }

  return Promise.resolve<SubmitGiftResult>({
    success: true
  })
}

export function submitRedeem(payload: SubmitRedeemPayload) {
  if (APP_CONFIG.authUseReal) {
    return submitRedeemRequest(payload)
  }

  return Promise.resolve<SubmitRedeemResult>({
    success: true,
    message: '兑换完成'
  })
}

export function getUserTransferList(give: boolean, pageIndex?: number, pageSize?: number) {
  if (APP_CONFIG.authUseReal) {
    return getUserTransferListRequest(give, pageIndex, pageSize)
  }

  return Promise.resolve<UserTransferListData>({
    total: 0,
    list: []
  })
}

export type {
  GiftAssetType,
  GiftCoinPageData,
  SubmitGiftPayload,
  SubmitGiftResult,
  SubmitRedeemPayload,
  SubmitRedeemResult,
  UserTransferListData,
  UserTransferRecord
} from './types'
