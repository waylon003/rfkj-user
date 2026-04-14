<template>
  <view class="store-detail-page">
    <app-header title="门店详情" :back="true" />

    <view class="store-detail-page__content">
      <view class="store-detail-card">
        <image class="store-detail-card__cover" :src="store.cover" mode="aspectFill" />
        <text class="store-detail-card__title">{{ store.name }}</text>
        <text class="store-detail-card__region">{{ store.region }}</text>
        <text class="store-detail-card__address">{{ store.address }}</text>
        <text class="store-detail-card__phone">联系电话：{{ store.phone }}</text>
      </view>

      <view class="store-detail-panel">
        <text class="store-detail-panel__title">门店介绍</text>
        <text class="store-detail-panel__desc">{{ store.description }}</text>
      </view>

      <view class="store-detail-panel">
        <text class="store-detail-panel__title">营业信息</text>
        <text class="store-detail-panel__desc">营业时间：{{ store.businessHours }}</text>
        <text class="store-detail-panel__desc">推荐机台：{{ store.recommendMachines }}</text>
        <text class="store-detail-panel__desc">当前活动：{{ store.recommendActivity }}</text>
      </view>

      <view class="store-detail-actions">
        <t-button theme="primary" shape="round" block @click="openNavigation">门店导航</t-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import TButton from 'tdesign-uniapp/button/button.vue'
import AppHeader from '@/components/common/AppHeader.vue'

interface StoreDetail {
  name: string
  region: string
  address: string
  phone: string
  cover: string
  latitude: number
  longitude: number
  description: string
  businessHours: string
  recommendMachines: string
  recommendActivity: string
}

const store = reactive<StoreDetail>({
  name: '',
  region: '',
  address: '',
  phone: '',
  cover: '',
  latitude: 0,
  longitude: 0,
  description: '',
  businessHours: '',
  recommendMachines: '',
  recommendActivity: ''
})

const storeMap: Record<string, StoreDetail> = {
  欢乐谷旗舰店: {
    name: '欢乐谷旗舰店',
    region: '广东省 中山市 南区',
    address: '欢乐谷商业中心一楼 101 服务台',
    phone: '0760-8888 0001',
    cover: '/static/demo-page/activity-rollercoaster.png',
    latitude: 22.5176,
    longitude: 113.3928,
    description: '欢乐谷旗舰店是当前用户端的主门店，支持会员二维码、礼品兑换、排行榜、活动和账单等完整会员服务。',
    businessHours: '10:00 - 22:00',
    recommendMachines: '星际战车、音速摩托、抓娃娃专区',
    recommendActivity: '会员双倍积分日、限时礼品兑换'
  },
  额企鹅驱蚊器: {
    name: '额企鹅驱蚊器',
    region: '广东省 中山市 石岐区',
    address: '兴中广场 2 号楼三层 302 号',
    phone: '0760-8888 0002',
    cover: '/static/demo-page/activity-rollercoaster.png',
    latitude: 22.5312,
    longitude: 113.3839,
    description: '额企鹅驱蚊器门店以抓娃娃和限定礼品活动为主，当前门店排行榜和活动看板会展示专属内容。',
    businessHours: '10:30 - 21:30',
    recommendMachines: '奇趣抓抓乐、甜梦熊屋、潮玩盲盒站',
    recommendActivity: '抓娃娃连胜挑战、周边限时兑换'
  },
  大大大大: {
    name: '大大大大',
    region: '广东省 中山市 东区',
    address: '远洋广场 B 馆二层 218 号',
    phone: '0760-8888 0003',
    cover: '/static/demo-page/activity-rollercoaster.png',
    latitude: 22.5287,
    longitude: 113.4232,
    description: '大大大大门店主打会员冲分、周末购币礼遇和限定礼品返场，适合查看活动详情和排行榜差异。',
    businessHours: '09:30 - 22:00',
    recommendMachines: '霓虹弹射王、银河碰碰乐、极限冲分台',
    recommendActivity: '会员冲分周、礼品返场活动'
  }
}

onLoad(query => {
  const name = typeof query?.name === 'string' ? decodeURIComponent(query.name) : '欢乐谷旗舰店'
  Object.assign(store, storeMap[name] || storeMap['欢乐谷旗舰店'])
})

function openNavigation() {
  uni.openLocation({
    latitude: store.latitude,
    longitude: store.longitude,
    name: store.name,
    address: `${store.region} ${store.address}`,
    fail() {
      uni.showToast({
        title: '当前环境暂不支持打开地图',
        icon: 'none'
      })
    }
  })
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.store-detail-page {
  min-height: 100vh;
  background: $page-bg;
}

.store-detail-page__content {
  padding: 24rpx;
}

.store-detail-card,
.store-detail-panel {
  padding: 28rpx;
  border: 2rpx solid $border-light;
  border-radius: 28rpx;
  background: #fff;
}

.store-detail-panel {
  margin-top: 24rpx;
}

.store-detail-card__cover {
  width: 100%;
  height: 320rpx;
  border-radius: 24rpx;
  background: $surface-avatar;
}

.store-detail-card__title {
  display: block;
  margin-top: 24rpx;
  font-size: 36rpx;
  font-weight: 700;
  color: $text-strong;
}

.store-detail-card__region,
.store-detail-card__address,
.store-detail-card__phone,
.store-detail-panel__desc {
  display: block;
  margin-top: 14rpx;
  font-size: 26rpx;
  line-height: 1.7;
  color: $text-secondary;
}

.store-detail-panel__title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-strong;
}

.store-detail-actions {
  margin-top: 24rpx;
}
</style>
