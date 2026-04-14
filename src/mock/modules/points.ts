import type { PointGiftConfirmData, PointGiftPageData } from '@/services/points/types'

export function getPointGiftPageData(): PointGiftPageData {
  return {
    balance: '1,250',
    categories: [
      { label: '全部', value: 'all' },
      { label: '毛绒公仔', value: 'plush' },
      { label: '数码周边', value: 'digital' },
      { label: '服装配饰', value: 'fashion' },
      { label: '生活好物', value: 'life' }
    ],
    items: [
      { id: 'gift-1', title: '机器猫毛绒公仔', cost: '500', category: 'plush' },
      { id: 'gift-2', title: '蓝牙耳机', cost: '1800', category: 'digital' },
      { id: 'gift-3', title: '主题帆布包', cost: '900', category: 'fashion' },
      { id: 'gift-4', title: '便携水杯', cost: '650', category: 'life' },
      { id: 'gift-5', title: '限定盲盒公仔', cost: '1200', category: 'plush' },
      { id: 'gift-6', title: '手机支架', cost: '300', category: 'digital' }
    ]
  }
}

export function getPointGiftConfirmData(): PointGiftConfirmData {
  return {
    title: '确认兑换',
    giftName: '经典机器猫毛绒公仔',
    requiredPoints: '100',
    availablePoints: '999',
    hint: ['兑换后请前往“待取礼品”查看核销码。兑换一且', '成功，积分将不予退回。']
  }
}
