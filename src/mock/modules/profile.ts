import type {
  BillPageData,
  GiftRecordData,
  PendingGiftData,
  ProfileCenterData,
  ProfileInfoData
} from '@/services/profile/types'

export function getProfileCenterData(): ProfileCenterData {
  return {
    brandName: '如风科技',
    memberId: 'ID:123213213',
    summaries: [
      { label: '礼品兑换', value: '1', accent: 'orange', route: '/pages/profile/gifts' },
      { label: '优惠卷', value: '10', route: '/pages/coupon/select' },
      { label: '我的账单', value: '¥', accent: 'dark', route: '/pages/profile/bill' }
    ],
    menus: [
      {
        id: 'info',
        title: '我的资料',
        iconClass: 'icon-ic_mod_member',
        route: '/pages/profile/info'
      },
      {
        id: 'record',
        title: '互赠记录',
        iconClass: 'icon-ic_action_rename',
        route: '/pages/profile/gift-records'
      },
      {
        id: 'feedback',
        title: '帮助反馈',
        iconClass: 'icon-ic_mem_gift_service',
        route: '/pages/profile/info'
      },
      {
        id: 'service',
        title: '客服电话',
        iconClass: 'icon-ic_contact_tel',
        route: '/pages/profile/info'
      }
    ],
    lastLogin: '2026.01.02 10:30:20'
  }
}

export function getProfileInfoData(): ProfileInfoData {
  return {
    brandName: '如风科技',
    memberId: 'ID:3213213113',
    sections: [
      {
        title: '基础信息',
        items: [
          { label: '会员名称', value: '小乐圆手' },
          { label: '账号ID', value: '321312321' }
        ]
      },
      {
        title: '联系方式',
        items: [
          { label: '手机号', value: '321312321' },
          { label: '常用地址', value: '广东省中山市区' }
        ]
      }
    ]
  }
}

export function getGiftRecordData(): GiftRecordData {
  return {
    title: '互赠记录',
    list: [
      {
        id: 'record-1',
        type: 'income',
        title: '收到赠送游戏币',
        amount: '+100',
        time: '2026.02.03 10:02',
        method: '微信扫码 / 朋友赠送'
      },
      {
        id: 'record-2',
        type: 'expense',
        title: '赠送游戏币',
        amount: '-100',
        time: '2026.02.03 10:02',
        method: '微信扫码 / 朋友赠送',
        statusText: '好友“张三”已领取'
      },
      {
        id: 'record-3',
        type: 'expense',
        title: '赠送游戏币',
        amount: '-100',
        time: '2026.02.03 10:02',
        method: '微信扫码 / 朋友赠送',
        statusText: '好友“张三”已领取',
        actionText: '查看二维码',
        qrValue: 'https://rfkj.example.com/gift/redeem?scene=record&amount=100&recordId=record-3'
      },
      {
        id: 'record-4',
        type: 'expense',
        title: '赠送游戏币',
        amount: '-100',
        time: '2026.02.03 10:02',
        method: '微信扫码 / 朋友赠送',
        statusText: '链接未点击',
        actionText: '重发链接'
      },
      {
        id: 'record-5',
        type: 'returned',
        title: '赠送超时退回',
        amount: '-100',
        time: '2026.02.03 10:02',
        method: '微信扫码 / 朋友赠送',
        statusText: '超过24小时未领，额度已退回'
      }
    ]
  }
}

export function getPendingGiftData(): PendingGiftData {
  return {
    tabs: [
      { label: '待领取', value: 'pending' },
      { label: '已领取', value: 'claimed' },
      { label: '已过期', value: 'expired' }
    ],
    items: [
      {
        id: 'gift-1',
        title: '机器猫毛绒公仔',
        timeLabel: '有效期至: 2026.1.31',
        actionLabel: '核销码',
        tab: 'pending',
        qrValue: 'https://rfkj.example.com/gift/pickup?giftId=gift-1'
      },
      {
        id: 'gift-2',
        title: '机器猫毛绒公仔',
        timeLabel: '领取时间: 2026.1.31',
        actionLabel: '已领取',
        tab: 'claimed'
      },
      {
        id: 'gift-3',
        title: '机器猫毛绒公仔',
        timeLabel: '有效期至: 2026.1.31',
        actionLabel: '已过期',
        tab: 'expired'
      }
    ]
  }
}

export function getBillPageData(): BillPageData {
  return {
    tabs: [
      { label: '全部', value: 'all' },
      { label: '购币', value: 'coin' },
      { label: '彩票兑积分', value: 'ticket' },
      { label: '积分兑换', value: 'gift' }
    ],
    monthLabel: '本月',
    monthRecords: [
      {
        id: 'bill-1',
        title: '购买游戏币',
        time: '01-31 10:00',
        amount: '+100',
        status: '交易成功',
        tab: 'coin'
      },
      {
        id: 'bill-2',
        title: '彩票兑换积分',
        time: '01-31 10:00',
        amount: '+500',
        status: '积分入账',
        tab: 'ticket'
      },
      {
        id: 'bill-3',
        title: '积分兑换礼品',
        time: '01-31 10:00',
        amount: '-200',
        status: '积分',
        tab: 'gift'
      }
    ],
    historyLabel: '1月',
    historyRecords: [
      {
        id: 'bill-4',
        title: '游戏投币消费',
        time: '01-31 10:00',
        amount: '-100',
        status: '游戏币',
        tab: 'all'
      }
    ]
  }
}
