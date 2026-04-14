import type { HomePageData } from '@/services/home/types'

export function getHomePageData(): HomePageData {
  return {
    banners: [
      {
        id: 'banner-1',
        image: 'https://tdesign.gtimg.com/mobile/demos/swiper1.png',
        title: '新用户首充立减',
        subtitle: '首单购币享限时优惠'
      },
      {
        id: 'banner-2',
        image: 'https://tdesign.gtimg.com/mobile/demos/swiper2.png',
        title: '积分礼品限时兑换',
        subtitle: '热门礼品本周优先上新'
      },
      {
        id: 'banner-3',
        image: 'https://tdesign.gtimg.com/mobile/demos/swiper3.png',
        title: '周末活动持续更新',
        subtitle: '门店活动与排行榜实时联动'
      }
    ],
    posterQrValue: 'https://rfkj.example.com/home-entry?scene=poster&memberId=23132112312',
    user: {
      nickname: '用户昵称',
      memberId: 'ID:23132112312',
      scanLabel: '扫码'
    },
    stats: [
      { label: '游戏币', value: '12,123' },
      { label: '彩票', value: '456' },
      { label: '剩余积分', value: '12,123' }
    ],
    quickActions: [
      {
        id: 'tickets',
        title: '彩票兑积分',
        subtitle: '快速兑换到账',
        iconText: '票',
        route: '/pages/member/tickets',
        accent: '#2F8CFF'
      },
      {
        id: 'gift',
        title: '赠币',
        subtitle: '好友互送更灵活',
        iconText: '赠',
        route: '/pages/member/gift',
        accent: '#5B8BFF'
      },
      {
        id: 'coin',
        title: '购币',
        subtitle: '热门套餐直充',
        iconText: '购',
        route: '/pages/coin/recharge',
        accent: '#FF8A00'
      },
      {
        id: 'points',
        title: '积分兑换',
        subtitle: '礼品实时可兑',
        iconText: '兑',
        route: '/pages/points/exchange',
        accent: '#00A870'
      }
    ],
    modules: [
      {
        id: 'coupon',
        title: '优惠券中心',
        description: '折扣券、体验券统一领取',
        route: '/pages/coupon/center',
        tag: '可领取'
      },
      {
        id: 'activity',
        title: '本周活动',
        description: '周末双倍积分，热门活动持续更新',
        route: '/pages/activity/index',
        tag: '限时'
      }
    ],
    ticker: [
      '周末会员日，指定机台双倍积分',
      '游戏币充值套餐已上新，最高立省 38%',
      '积分商城新增蓝牙耳机、周边盲盒'
    ]
  }
}
