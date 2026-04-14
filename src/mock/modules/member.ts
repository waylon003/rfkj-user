import type { GiftCoinPageData } from '@/services/member/types'

export function getGiftCoinPageData(): GiftCoinPageData {
  return {
    balance: '1,250',
    amount: '100',
    secondaryBadge: '',
    qrAmount: '100',
    qrValue: 'https://rfkj.example.com/gift/redeem?scene=face&amount=100&giftId=gift-100',
    qrTipLines: ['请让好友使用微信“扫一扫”', '二维码有效期 5 分钟']
  }
}
