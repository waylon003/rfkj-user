import * as home from './modules/home'
import * as activity from './modules/activity'
import * as profile from './modules/profile'
import * as purchase from './modules/purchase'
import * as member from './modules/member'
import * as points from './modules/points'
import * as ranking from './modules/ranking'
import * as auth from './modules/auth'
import { resolveMock } from '@/utils/mock'

const modules = {
  auth,
  home,
  activity,
  profile,
  purchase,
  member,
  points,
  ranking
}

export async function withModuleMock<
  K extends keyof typeof modules,
  T
>(
  moduleKey: K,
  getter: (module: (typeof modules)[K]) => T | Promise<T>,
  realGetter?: () => Promise<T>
) {
  return resolveMock(() => getter(modules[moduleKey]), realGetter)
}
