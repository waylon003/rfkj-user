export type RankingTab = 'machine' | 'points'

export type RankingMachineType = 'entertainment' | 'claw' | 'gashapon' | 'pinball'

export interface RankingTabOption {
  label: string
  value: RankingTab
}

export interface RankingMachineTypeOption {
  label: string
  value: RankingMachineType
}

export interface RankingPodiumItem {
  rank: number
  name: string
  avatar: string
  value: string
  unit: string
  trophy: 'secondary' | 'champion' | 'third'
  baseLabel: string
}

export interface RankingListItem {
  rank: number
  name: string
  avatar: string
  avatarClass: 'a' | 'b' | 'c'
  value: string
  unit: string
}

export interface RankingDataset {
  myRank: string
  note: string
  podium: RankingPodiumItem[]
  list: RankingListItem[]
}

export interface RankingPageData {
  tabs: RankingTabOption[]
  machineTypes: RankingMachineTypeOption[]
  rankings: Record<RankingTab, Record<RankingMachineType, RankingDataset>>
}
