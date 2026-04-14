export type ActivityCategory = 'all' | 'limited' | 'resident'

export interface ActivityCard {
  id: string
  title: string
  period: string
  endAt: string
  status: 'ongoing' | 'upcoming' | 'ended'
  tagText: string
  badgeCount?: number
  coverImage: string
}

export interface ActivityHubData {
  categories: Array<{
    label: string
    value: ActivityCategory
  }>
  cards: ActivityCard[]
}

export interface ActivityRankingItem {
  rank: number
  name: string
  score: string
  note?: string
  highlight?: boolean
  trophy?: 'gold' | 'silver' | 'bronze'
}

export interface ActivityDetailData {
  id: string
  title: string
  period: string
  endAt: string
  coverImage: string
  prevId?: string
  nextId?: string
  description: string[]
  note: string
  rankings: ActivityRankingItem[]
}
