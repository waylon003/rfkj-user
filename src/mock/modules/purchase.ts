import type {
  CouponSelectData,
  CustomAmountData,
  PaymentMethodOption,
  PurchaseCenterData,
  PurchasePackage,
  PaymentSheetData,
  PaymentSuccessData,
  PointPaymentData,
  TicketDeductionOption,
  TicketDeductionData
} from '@/services/purchase/types'

type PurchaseMode = 'featured' | 'base' | 'custom'

const featuredPackageSeeds: ReadonlyArray<Omit<PurchasePackage, 'selected'>> = [
  {
    id: 'featured-200-a',
    coinText: '200 游戏币',
    price: 168,
    originalPrice: 198,
    stockText: '剩余库存：1000',
    badgeText: '限购'
  },
  {
    id: 'featured-200-b',
    coinText: '200 游戏币',
    price: 168,
    originalPrice: 198,
    stockText: '剩余库存：1000',
    badgeText: '限购'
  }
]

const basePackageSeeds: ReadonlyArray<Omit<PurchasePackage, 'selected'>> = [
  {
    id: 'pkg-50',
    coinText: '50枚',
    price: 50,
    unitPriceText: '¥1.0/枚'
  },
  {
    id: 'pkg-100',
    coinText: '100枚',
    price: 90,
    unitPriceText: '¥0.9/枚',
    badgeText: '热门'
  },
  {
    id: 'pkg-200',
    coinText: '200枚',
    price: 170,
    unitPriceText: '¥0.85/枚'
  },
  {
    id: 'pkg-500',
    coinText: '500枚',
    price: 400,
    unitPriceText: '¥0.8/枚'
  }
]

const couponAvailableSeeds = [
  {
    id: 'coupon-1',
    amount: '10',
    title: '充值游戏币优惠卷',
    condition: '满¥100可用',
    expiry: '2025.12.31',
    recommended: true
  },
  {
    id: 'coupon-2',
    amount: '10',
    title: '充值游戏币优惠卷',
    condition: '满¥100可用',
    expiry: '2025.12.31'
  },
  {
    id: 'coupon-3',
    amount: '10',
    title: '充值游戏币优惠卷',
    condition: '满¥100可用',
    expiry: '2025.12.31'
  }
]

const couponUnavailableSeeds = [
  {
    id: 'coupon-4',
    amount: '10',
    title: '充值游戏币优惠卷',
    condition: '满¥100可用',
    expiry: '2025.12.31',
    disabled: true
  }
]

const ticketDeductionSeeds: ReadonlyArray<TicketDeductionOption & { discount: number }> = [
  { id: 'none', title: '暂不用彩票抵扣', discount: 0 },
  { id: 'full-85', title: '抵扣全额¥8.5元', subtitle: '使用850张彩票', discount: 8.5 },
  { id: 'minus-10', title: '抵扣¥10元', subtitle: '使用1000张彩票', discount: 10 },
  { id: 'full-5', title: '抵扣全额¥5元', subtitle: '使用500张彩票', discount: 5 }
]

const pointPaymentSeeds: ReadonlyArray<TicketDeductionOption & { discount: number }> = [
  { id: 'none', title: '暂不用积分', discount: 0 },
  { id: 'minus-10', title: '抵扣¥10元', subtitle: '使用100积分', discount: 10 },
  { id: 'minus-5', title: '抵扣¥5元', subtitle: '使用50积分', discount: 5 }
]

const purchaseState = {
  activeMode: 'base' as PurchaseMode,
  selectedFeaturedId: 'featured-200-a',
  selectedBaseId: 'pkg-50',
  customAmount: '100',
  selectedCouponId: '',
  selectedTicketDeductionId: 'none',
  selectedPointPaymentId: 'minus-5'
}

export function getCustomAmountData(): CustomAmountData {
  return {
    amount: purchaseState.customAmount || '0',
    unit: '枚',
    payable: formatPrice(getCustomAmountPrice()),
    keypad: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'delete']
  }
}

export function getPurchaseCenterData(): PurchaseCenterData {
  const activePackage = getActivePackage()
  const payable = getPayable()
  const selectedCoupon = couponAvailableSeeds.find(item => item.id === purchaseState.selectedCouponId)
  const selectedTicket = ticketDeductionSeeds.find(item => item.id === purchaseState.selectedTicketDeductionId)
  const selectedPoint = pointPaymentSeeds.find(item => item.id === purchaseState.selectedPointPaymentId)
  const paymentSheet: PaymentSheetData = buildPaymentSheet(activePackage, payable)

  return {
    balanceLabel: '当前游戏币余额',
    balanceValue: '1,250',
    balanceUnit: '枚',
    featuredEndAt: '2026-04-30T12:30:20+08:00',
    featuredPackages: featuredPackageSeeds.map(item => ({
      ...item,
      selected: purchaseState.activeMode === 'featured' && item.id === purchaseState.selectedFeaturedId
    })),
    basePackages: basePackageSeeds.map(item => ({
      ...item,
      selected: purchaseState.activeMode === 'base' && item.id === purchaseState.selectedBaseId
    })),
    customAmount: {
      id: 'custom-amount',
      label: '自定义数量',
      valueText: purchaseState.activeMode === 'custom' ? `${purchaseState.customAmount}枚` : '输入游戏币',
      route: '/pages/coin/custom-amount',
      selected: purchaseState.activeMode === 'custom'
    },
    coupon: {
      id: 'coupon',
      iconClass: 'icon-ic_mod_marketing',
      label: '优惠卷',
      valueText: selectedCoupon ? `-¥${selectedCoupon.amount}.00` : '共有一张优惠卷可以用',
      route: '/pages/coupon/select',
      selected: Boolean(selectedCoupon)
    },
    ticketDeduction: {
      id: 'ticket-deduction',
      iconClass: 'icon-ic_mem_deposit',
      label: '彩票抵扣',
      valueText: selectedTicket && selectedTicket.discount > 0 ? `-¥${formatDiscount(selectedTicket.discount)}` : '请选择',
      route: '/pages/coin/ticket-deduction',
      selected: Boolean(selectedTicket && selectedTicket.discount > 0)
    },
    pointPayment: {
      id: 'point-payment',
      iconClass: 'icon-ic_mem_card',
      label: '积分付',
      valueText: selectedPoint && selectedPoint.discount > 0 ? `-¥${formatDiscount(selectedPoint.discount)}` : '请选择',
      route: '/pages/coin/point-payment',
      highlight: selectedPoint && selectedPoint.discount > 0 ? 'orange' : undefined,
      selected: Boolean(selectedPoint && selectedPoint.discount > 0)
    },
    summary: {
      label: '实付金额：',
      amount: formatPrice(payable),
      buttonText: '确认支付'
    },
    paymentSheet
  }
}

export function selectFeaturedPackage(id: string): PurchaseCenterData {
  purchaseState.selectedFeaturedId = id
  purchaseState.activeMode = 'featured'
  return getPurchaseCenterData()
}

export function selectBasePackage(id: string): PurchaseCenterData {
  purchaseState.selectedBaseId = id
  purchaseState.activeMode = 'base'
  return getPurchaseCenterData()
}

export function appendCustomAmountKey(key: string): CustomAmountData {
  if (key === 'delete') {
    purchaseState.customAmount = purchaseState.customAmount.slice(0, -1)
  } else if (/\d/.test(key)) {
    const nextValue = `${purchaseState.customAmount}${key}`.replace(/^0+/, '')
    purchaseState.customAmount = nextValue.slice(0, 4)
  }

  if (!purchaseState.customAmount) {
    purchaseState.customAmount = '0'
  }

  return getCustomAmountData()
}

export function confirmCustomAmount(): PurchaseCenterData {
  if (Number(purchaseState.customAmount) <= 0) {
    purchaseState.customAmount = '1'
  }
  purchaseState.activeMode = 'custom'
  return getPurchaseCenterData()
}

export function getCouponSelectData(): CouponSelectData {
  return {
    availableSection: {
      title: '可用优惠卷',
      countLabel: '展开 (3张)',
      accent: 'blue'
    },
    unavailableSection: {
      title: '不可用优惠卷',
      countLabel: '展开 (1张)',
      accent: 'orange'
    },
    available: couponAvailableSeeds.map(item => ({
      ...item,
      selected: item.id === purchaseState.selectedCouponId
    })),
    unavailable: couponUnavailableSeeds.map(item => ({ ...item }))
  }
}

export function selectCoupon(id: string): CouponSelectData {
  purchaseState.selectedCouponId = id
  return getCouponSelectData()
}

export function confirmCouponSelection(): PurchaseCenterData {
  return getPurchaseCenterData()
}

export function getTicketDeductionData(): TicketDeductionData {
  return {
    balance: '1,250',
    helper: '彩票没用？去换积分',
    options: ticketDeductionSeeds.map(item => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      selected: item.id === purchaseState.selectedTicketDeductionId
    }))
  }
}

export function selectTicketDeduction(id: string): TicketDeductionData {
  purchaseState.selectedTicketDeductionId = id
  return getTicketDeductionData()
}

export function confirmTicketDeduction(): PurchaseCenterData {
  return getPurchaseCenterData()
}

export function getPaymentSheetData(): PaymentSheetData {
  return getPurchaseCenterData().paymentSheet
}

export function getPaymentSuccessData(): PaymentSuccessData {
  return {
    amount: '100.00',
    title: '支付成功',
    subtitle: '您的充值已实时到账'
  }
}

export function getPointPaymentData(): PointPaymentData {
  return {
    balance: '1,250',
    helper: '去积分兑换，兑更多好礼',
    options: pointPaymentSeeds.map(item => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      selected: item.id === purchaseState.selectedPointPaymentId
    }))
  }
}

export function selectPointPayment(id: string): PointPaymentData {
  purchaseState.selectedPointPaymentId = id
  return getPointPaymentData()
}

export function confirmPointPayment(): PurchaseCenterData {
  return getPurchaseCenterData()
}

function getActivePackage() {
  if (purchaseState.activeMode === 'featured') {
    return featuredPackageSeeds.find(item => item.id === purchaseState.selectedFeaturedId) || featuredPackageSeeds[0]
  }

  if (purchaseState.activeMode === 'custom') {
    return {
      id: 'custom',
      coinText: `${purchaseState.customAmount}枚`,
      price: getCustomAmountPrice(),
      unitPriceText: '¥1.0/枚'
    }
  }

  return basePackageSeeds.find(item => item.id === purchaseState.selectedBaseId) || basePackageSeeds[0]
}

function getCustomAmountPrice() {
  return Number(purchaseState.customAmount || '0')
}

function getPayable() {
  const packagePrice = getActivePackage().price
  const couponDiscount = Number(couponAvailableSeeds.find(item => item.id === purchaseState.selectedCouponId)?.amount || 0)
  const ticketDiscount = ticketDeductionSeeds.find(item => item.id === purchaseState.selectedTicketDeductionId)?.discount || 0
  const pointDiscount = pointPaymentSeeds.find(item => item.id === purchaseState.selectedPointPaymentId)?.discount || 0
  return Math.max(packagePrice - couponDiscount - ticketDiscount - pointDiscount, 0)
}

function buildPaymentSheet(activePackage: { coinText: string; price: number; unitPriceText?: string }, payable: number): PaymentSheetData {
  return {
    amount: formatPrice(payable),
    payable: formatPrice(payable),
    featuredTitle: `购买${activePackage.coinText.replace(' 游戏币', '')}`,
    featuredSubtitle: `商品单价：${activePackage.unitPriceText || '¥1.0/枚'}`,
    methods: [
      {
        id: 'balance',
        title: '余额支付',
        subtitle: '可用余额：12.50',
        selected: true
      },
      {
        id: 'wechat',
        title: '微信支付',
        subtitle: '推荐使用，安全便捷'
      }
    ] as PaymentMethodOption[]
  }
}

function formatPrice(value: number) {
  return value.toFixed(2)
}

function formatDiscount(value: number) {
  return value.toFixed(2)
}
