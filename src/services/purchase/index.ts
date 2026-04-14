import { withModuleMock } from '@/mock'
import type {
  CouponSelectData,
  CustomAmountData,
  PurchaseCenterData,
  PaymentSheetData,
  PaymentSuccessData,
  PointPaymentData,
  TicketDeductionData
} from './types'

export function getCustomAmountData() {
  return withModuleMock<'purchase', CustomAmountData>(
    'purchase',
    module => module.getCustomAmountData()
  )
}

export function appendCustomAmountKey(key: string) {
  return withModuleMock<'purchase', CustomAmountData>(
    'purchase',
    module => module.appendCustomAmountKey(key)
  )
}

export function confirmCustomAmount() {
  return withModuleMock<'purchase', PurchaseCenterData>(
    'purchase',
    module => module.confirmCustomAmount()
  )
}

export function getPurchaseCenterData() {
  return withModuleMock<'purchase', PurchaseCenterData>(
    'purchase',
    module => module.getPurchaseCenterData()
  )
}

export function selectFeaturedPackage(id: string) {
  return withModuleMock<'purchase', PurchaseCenterData>(
    'purchase',
    module => module.selectFeaturedPackage(id)
  )
}

export function selectBasePackage(id: string) {
  return withModuleMock<'purchase', PurchaseCenterData>(
    'purchase',
    module => module.selectBasePackage(id)
  )
}

export function getCouponSelectData() {
  return withModuleMock<'purchase', CouponSelectData>(
    'purchase',
    module => module.getCouponSelectData()
  )
}

export function selectCoupon(id: string) {
  return withModuleMock<'purchase', CouponSelectData>(
    'purchase',
    module => module.selectCoupon(id)
  )
}

export function confirmCouponSelection() {
  return withModuleMock<'purchase', PurchaseCenterData>(
    'purchase',
    module => module.confirmCouponSelection()
  )
}

export function getTicketDeductionData() {
  return withModuleMock<'purchase', TicketDeductionData>(
    'purchase',
    module => module.getTicketDeductionData()
  )
}

export function selectTicketDeduction(id: string) {
  return withModuleMock<'purchase', TicketDeductionData>(
    'purchase',
    module => module.selectTicketDeduction(id)
  )
}

export function confirmTicketDeduction() {
  return withModuleMock<'purchase', PurchaseCenterData>(
    'purchase',
    module => module.confirmTicketDeduction()
  )
}

export function getPaymentSheetData() {
  return withModuleMock<'purchase', PaymentSheetData>(
    'purchase',
    module => module.getPaymentSheetData()
  )
}

export function getPaymentSuccessData() {
  return withModuleMock<'purchase', PaymentSuccessData>(
    'purchase',
    module => module.getPaymentSuccessData()
  )
}

export function getPointPaymentData() {
  return withModuleMock<'purchase', PointPaymentData>(
    'purchase',
    module => module.getPointPaymentData()
  )
}

export function selectPointPayment(id: string) {
  return withModuleMock<'purchase', PointPaymentData>(
    'purchase',
    module => module.selectPointPayment(id)
  )
}

export function confirmPointPayment() {
  return withModuleMock<'purchase', PurchaseCenterData>(
    'purchase',
    module => module.confirmPointPayment()
  )
}

export type {
  CouponSelectData,
  CouponSelectItem,
  CouponSelectSection,
  PurchaseCenterData,
  PurchaseOptionRow,
  PurchasePackage,
  PurchaseSummary,
  CustomAmountData,
  PaymentMethodOption,
  PaymentSheetData,
  PaymentSuccessData,
  PointPaymentData,
  TicketDeductionData,
  TicketDeductionOption
} from './types'
