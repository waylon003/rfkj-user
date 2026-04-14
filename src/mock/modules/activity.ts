import type { ActivityDetailData, ActivityHubData } from '@/services/activity/types'

const activityCards = [
  {
    id: 'activity-1',
    title: '奇幻午夜大巡演',
    period: '2026.04.01-2026.04.30',
    endAt: '2026-04-30T12:30:20+08:00',
    status: 'ongoing' as const,
    tagText: '进行中',
    coverImage: 'https://tdesign.gtimg.com/mobile/demos/swiper1.png'
  },
  {
    id: 'activity-2',
    title: '奇幻午夜大巡演',
    period: '2026.05.01-2026.05.28',
    endAt: '2026-05-28T12:30:20+08:00',
    status: 'upcoming' as const,
    tagText: '即将开始',
    coverImage: 'https://tdesign.gtimg.com/mobile/demos/swiper2.png'
  },
  {
    id: 'activity-3',
    title: '奇幻午夜大巡演',
    period: '2026.03.01-2026.03.28',
    endAt: '2026-03-28T12:30:20+08:00',
    status: 'ended' as const,
    tagText: '已结束',
    coverImage: 'https://tdesign.gtimg.com/mobile/demos/swiper3.png'
  }
]

export function getActivityHubData(): ActivityHubData {
  return {
    categories: [
      { label: '全部', value: 'all' },
      { label: '限时活动', value: 'limited' },
      { label: '常驻', value: 'resident' }
    ],
    cards: activityCards
  }
}

export function getActivityDetailData(id = 'activity-1'): ActivityDetailData {
  const currentIndex = activityCards.findIndex(item => item.id === id)
  const current = activityCards[currentIndex >= 0 ? currentIndex : 0]
  const prev = currentIndex > 0 ? activityCards[currentIndex - 1] : undefined
  const next = currentIndex >= 0 && currentIndex < activityCards.length - 1 ? activityCards[currentIndex + 1] : undefined

  return {
    id: current.id,
    title: `2026 ${current.title}`,
    period: current.period.replace('-', ' - '),
    endAt: current.endAt,
    coverImage: current.coverImage,
    prevId: prev?.id,
    nextId: next?.id,
    description: [
      '本次活动旨在激励全员销售热情，冲刺季度目标排',
      '名前三的员工将获得公司提供的丰厚奖励。'
    ],
    note: '注：每小时更新一次，请以最终结算为准。',
    rankings: [
      {
        rank: 100,
        name: '我自己（张三）',
        score: '8500',
        note: '距离上一名还差 150',
        highlight: true,
        trophy: 'gold'
      },
      {
        rank: 2,
        name: '哒哒哒',
        score: '8500',
        trophy: 'silver'
      },
      {
        rank: 3,
        name: '哒哒阿打算哒',
        score: '8400',
        trophy: 'bronze'
      },
      {
        rank: 4,
        name: '哒哒阿打算哒',
        score: '8300'
      },
      {
        rank: 5,
        name: '哒哒阿打算哒',
        score: '8200'
      },
      {
        rank: 6,
        name: '哒哒阿打算哒',
        score: '8100'
      }
    ]
  }
}
