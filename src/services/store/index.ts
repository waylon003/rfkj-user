import { getMockRegisteredStores } from './mock'
import type { RegisteredStore, StoreListData } from './types'

interface CachedSession {
  mode?: string
  selectedStoreId?: number | null
  profile?: {
    storeId?: number | null
  }
}

function getSessionCache(): CachedSession | null {
  const cached = uni.getStorageSync('rfkj-user-session') as CachedSession | null
  return cached || null
}

function getRegisteredStoreIds() {
  const cached = getSessionCache()
  if (!cached || cached.mode !== 'member') {
    return [] as number[]
  }

  const ids = [cached.profile?.storeId, cached.selectedStoreId].filter(
    (id): id is number => typeof id === 'number' && id > 0
  )

  return Array.from(new Set(ids))
}

async function getUserLocation(): Promise<{ latitude: number; longitude: number } | null> {
  return new Promise(resolve => {
    uni.getLocation({
      type: 'gcj02',
      success(res) {
        resolve({ latitude: res.latitude, longitude: res.longitude })
      },
      fail() {
        resolve(null)
      }
    })
  })
}

function calcDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`
  }
  return `${(meters / 1000).toFixed(1)}km`
}

export async function getRegisteredStoreList(): Promise<StoreListData> {
  const registeredStoreIds = getRegisteredStoreIds()

  let stores: RegisteredStore[] = registeredStoreIds.length
    ? getMockRegisteredStores().filter(store => registeredStoreIds.includes(store.id))
    : []

  const location = await getUserLocation()

  if (location) {
    stores = stores.map(store => {
      if (!store.latitude || !store.longitude) {
        return { ...store, distance: null, distanceText: '' }
      }
      const meters = calcDistance(
        location.latitude,
        location.longitude,
        store.latitude,
        store.longitude
      )
      return {
        ...store,
        distance: meters,
        distanceText: formatDistance(meters)
      }
    })

    stores.sort((a, b) => {
      if (a.distance === null && b.distance === null) return 0
      if (a.distance === null) return 1
      if (b.distance === null) return -1
      return a.distance - b.distance
    })
  }

  return { stores }
}

export type { RegisteredStore, StoreListData } from './types'
