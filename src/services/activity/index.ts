import { withModuleMock } from '@/mock'
import type { ActivityDetailData, ActivityHubData } from './types'

export function getActivityHubData() {
  return withModuleMock<'activity', ActivityHubData>(
    'activity',
    module => module.getActivityHubData()
  )
}

export function getActivityDetailData(id?: string) {
  return withModuleMock<'activity', ActivityDetailData>(
    'activity',
    module => module.getActivityDetailData(id)
  )
}

export type {
  ActivityCard,
  ActivityCategory,
  ActivityDetailData,
  ActivityHubData,
  ActivityRankingItem
} from './types'
