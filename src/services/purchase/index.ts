import { withModuleMock } from '@/mock'
import { fetchCoinSalesRequest } from './api'
import type {
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

export async function getPurchaseCenterData(): Promise<PurchaseCenterData> {
  const mockData = await withModuleMock<'purchase', PurchaseCenterData>(
    'purchase',
    module => module.getPurchaseCenterData()
  )

  // Replace basePackages with real coin sales data (only when logged in)
  const cached = uni.getStorageSync('rfkj-user-session')
  if (cached?.sessionId) {
    try {
      const realPackages = await fetchCoinSalesRequest()
      if (realPackages.length > 0) {
        mockData.basePackages = realPackages.map((pkg, index) => ({
          ...pkg,
          selected: index === 0
        }))
      }
    } catch {
      // If API fails, keep mock basePackages
    }
  }

  return mockData
}

export function selectBasePackage(id: string) {
  return withModuleMock<'purchase', PurchaseCenterData>(
    'purchase',
    module => module.selectBasePackage(id)
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
