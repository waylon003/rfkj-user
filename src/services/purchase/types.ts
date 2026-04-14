export interface CustomAmountData {
  amount: string
  unit: string
  payable: string
  keypad: Array<string>
}

export interface PurchasePackage {
  id: string
  coinText: string
  price: number
  originalPrice?: number
  unitPriceText?: string
  stockText?: string
  badgeText?: string
  selected?: boolean
}

export interface PurchaseOptionRow {
  id: string
  iconClass?: string
  label: string
  valueText: string
  route?: string
  selected?: boolean
  highlight?: 'orange'
}

export interface PurchaseSummary {
  label: string
  amount: string
  buttonText: string
}

export interface PurchaseCenterData {
  balanceLabel: string
  balanceValue: string
  balanceUnit: string
  featuredEndAt: string
  featuredPackages: PurchasePackage[]
  basePackages: PurchasePackage[]
  customAmount: PurchaseOptionRow
  coupon: PurchaseOptionRow
  ticketDeduction: PurchaseOptionRow
  pointPayment: PurchaseOptionRow
  summary: PurchaseSummary
  paymentSheet: PaymentSheetData
}

export interface CouponSelectSection {
  title: string
  countLabel: string
  accent: 'blue' | 'orange'
}

export interface CouponSelectItem {
  id: string
  amount: string
  title: string
  condition: string
  expiry: string
  recommended?: boolean
  selected?: boolean
  disabled?: boolean
}

export interface CouponSelectData {
  availableSection: CouponSelectSection
  unavailableSection: CouponSelectSection
  available: CouponSelectItem[]
  unavailable: CouponSelectItem[]
}

export interface TicketDeductionOption {
  id: string
  title: string
  subtitle?: string
  selected?: boolean
}

export interface TicketDeductionData {
  balance: string
  helper: string
  options: TicketDeductionOption[]
}

export interface PaymentMethodOption {
  id: string
  title: string
  subtitle: string
  badge?: string
  selected?: boolean
}

export interface PaymentSheetData {
  amount: string
  payable: string
  featuredTitle: string
  featuredSubtitle: string
  methods: PaymentMethodOption[]
}

export interface PaymentSuccessData {
  amount: string
  title: string
  subtitle: string
}

export interface PointPaymentData {
  balance: string
  helper: string
  options: TicketDeductionOption[]
}
