import type { RegisteredStore } from './types'

export function getMockRegisteredStores(): RegisteredStore[] {
  return [
    {
      id: 1,
      name: '欢乐谷旗舰店',
      region: '广东省 中山市 南区',
      address: '欢乐谷商业中心一楼 101 服务台',
      phone: '0760-8888 0001',
      cover: '/static/demo-page/activity-rollercoaster.png',
      latitude: 22.5176,
      longitude: 113.3928,
      distance: null,
      distanceText: ''
    },
    {
      id: 2,
      name: '额企鹅驱蚊器',
      region: '广东省 中山市 石岐区',
      address: '兴中广场 2 号楼三层 302 号',
      phone: '0760-8888 0002',
      cover: '/static/demo-page/activity-rollercoaster.png',
      latitude: 22.5312,
      longitude: 113.3839,
      distance: null,
      distanceText: ''
    },
    {
      id: 3,
      name: '大大大大',
      region: '广东省 中山市 东区',
      address: '远洋广场 B 馆二层 218 号',
      phone: '0760-8888 0003',
      cover: '/static/demo-page/activity-rollercoaster.png',
      latitude: 22.5287,
      longitude: 113.4232,
      distance: null,
      distanceText: ''
    }
  ]
}
