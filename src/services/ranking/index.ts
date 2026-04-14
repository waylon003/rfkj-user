import { withModuleMock } from '@/mock'
import type { RankingPageData } from './types'

export function getRankingPageData() {
  return withModuleMock<'ranking', RankingPageData>(
    'ranking',
    module => module.getRankingPageData()
  )
}

export type {
  RankingDataset,
  RankingListItem,
  RankingMachineType,
  RankingMachineTypeOption,
  RankingPageData,
  RankingPodiumItem,
  RankingTab,
  RankingTabOption
} from './types'
