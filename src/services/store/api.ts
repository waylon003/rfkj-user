import type { RegisteredStore } from './types'

export async function getRegisteredStoresRequest(): Promise<RegisteredStore[]> {
  throw new Error('当前缺少“用户已注册门店列表”真实接口，store 模块暂不接真')
}
