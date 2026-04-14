import { APP_CONFIG } from '@/config'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export async function resolveMock<T>(
  mockFactory: () => T | Promise<T>,
  realFactory?: () => Promise<T>
): Promise<T> {
  if (!APP_CONFIG.useMock && realFactory) {
    return realFactory()
  }

  await sleep(APP_CONFIG.mockDelay)
  return clone(await mockFactory())
}
