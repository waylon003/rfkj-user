export interface HomeBanner {
  id: string
  image: string
  title: string
  subtitle?: string
}

export interface HomeStat {
  label: string
  value: string
}

export interface HomeQuickAction {
  id: string
  title: string
  subtitle: string
  iconText: string
  route: string
  accent: string
}

export interface HomeModuleCard {
  id: string
  title: string
  description: string
  route: string
  tag: string
}

export interface HomeUserCard {
  nickname: string
  memberId: string
  scanLabel: string
}

export interface HomePageData {
  banners: HomeBanner[]
  posterQrValue: string
  user: HomeUserCard
  stats: HomeStat[]
  quickActions: HomeQuickAction[]
  modules: HomeModuleCard[]
  ticker: string[]
}
