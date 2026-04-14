import { withModuleMock } from '@/mock'
import type { HomePageData } from './types'

export function getHomePageData() {
  return withModuleMock<'home', HomePageData>(
    'home',
    module => module.getHomePageData()
  )
}

export type {
  HomeBanner,
  HomeModuleCard,
  HomePageData,
  HomeQuickAction,
  HomeStat,
  HomeUserCard
} from './types'
