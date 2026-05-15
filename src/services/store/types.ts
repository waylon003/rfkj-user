export interface RegisteredStore {
  id: number
  name: string
  region: string
  address: string
  phone: string
  cover: string
  latitude: number
  longitude: number
  distance: number | null
  distanceText: string
}

export interface StoreListData {
  stores: RegisteredStore[]
}
