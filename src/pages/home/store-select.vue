<template>
  <view class="store-select-page">
    <app-header title="选择门店" :back="true" />

    <sticky-page-top :height-rpx="112">
      <view class="store-select-page__search-wrap">
        <t-search
          v-model:value="keyword"
          placeholder="搜索门店名称 / 地区 / 地址 / 电话"
          shape="round"
          :center="false"
          :clearable="true"
        />
      </view>
    </sticky-page-top>

    <view class="store-select-page__content">
      <view
        v-for="store in visibleStores"
        :key="store.name"
        class="store-card"
        :class="{ 'store-card--active': store.name === selectedStore }"
        @click="selectStore(store.name)"
      >
        <TImage
          class="store-card__cover"
          :src="store.cover"
          width="176rpx"
          height="176rpx"
          mode="aspectFill"
          shape="round"
        />

        <view class="store-card__main">
          <view class="store-card__title-row">
            <text class="store-card__name">{{ store.name }}</text>
            <view v-if="store.name === selectedStore" class="store-card__check">
              <TIcon name="check" size="28rpx" color="#ffffff" />
            </view>
          </view>

          <view class="store-card__line">
            <TIcon name="location" size="28rpx" color="#6b7c93" />
            <text>{{ store.region }}</text>
          </view>
          <view class="store-card__line">
            <TIcon name="map-location" size="28rpx" color="#6b7c93" />
            <text>{{ store.address }}</text>
          </view>
          <view class="store-card__line">
            <TIcon name="call" size="28rpx" color="#6b7c93" />
            <text>{{ store.phone }}</text>
          </view>

          <view class="store-card__actions">
            <t-button
              size="small"
              variant="base"
              shape="round"
              theme="primary"
              @click.stop="viewStoreDetail(store)"
            >
              门店详情
            </t-button>
            <t-button
              size="small"
              variant="base"
              shape="round"
              theme="primary"
              @click.stop="openStoreNavigation(store)"
            >
              门店导航
            </t-button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import TButton from 'tdesign-uniapp/button/button.vue'
import TIcon from 'tdesign-uniapp/icon/icon.vue'
import TImage from 'tdesign-uniapp/image/image.vue'
import TSearch from 'tdesign-uniapp/search/search.vue'
import AppHeader from '@/components/common/AppHeader.vue'
import StickyPageTop from '@/components/common/layout/StickyPageTop.vue'
import { useUserStore } from '@/stores'

const STORE_KEY = 'rfkj_current_store'
const defaultStore = '欢乐谷旗舰店'
const userStore = useUserStore()
const selectedStore = ref(defaultStore)
const keyword = ref('')
type StoreItem = {
  name: string
  region: string
  address: string
  phone: string
  cover: string
  latitude: number
  longitude: number
}

const stores = [
  {
    name: '欢乐谷旗舰店',
    region: '广东省 中山市 南区',
    address: '欢乐谷商业中心一楼 101 服务台',
    phone: '0760-8888 0001',
    cover: '/static/demo-page/activity-rollercoaster.png',
    latitude: 22.5176,
    longitude: 113.3928
  },
  {
    name: '额企鹅驱蚊器',
    region: '广东省 中山市 石岐区',
    address: '兴中广场 2 号楼三层 302 号',
    phone: '0760-8888 0002',
    cover: '/static/demo-page/activity-rollercoaster.png',
    latitude: 22.5312,
    longitude: 113.3839
  },
  {
    name: '大大大大',
    region: '广东省 中山市 东区',
    address: '远洋广场 B 馆二层 218 号',
    phone: '0760-8888 0003',
    cover: '/static/demo-page/activity-rollercoaster.png',
    latitude: 22.5287,
    longitude: 113.4232
  }
]

const visibleStores = computed(() => {
  const value = keyword.value.trim()
  if (!value) {
    return stores
  }

  return stores.filter(store =>
    [store.name, store.region, store.address, store.phone].some(field => field.includes(value))
  )
})

onShow(() => {
  selectedStore.value = userStore.selectedStoreName || uni.getStorageSync(STORE_KEY) || defaultStore
})

function selectStore(name: string) {
  selectedStore.value = name
  uni.setStorageSync(STORE_KEY, name)
  userStore.setSelectedStore({ name })
  uni.showToast({
    title: `已切换到 ${name}`,
    icon: 'none'
  })
  setTimeout(() => {
    uni.navigateBack()
  }, 300)
}

function viewStoreDetail(store: StoreItem) {
  uni.navigateTo({ url: `/pages/home/store-detail?name=${encodeURIComponent(store.name)}` })
}

function openStoreNavigation(store: StoreItem) {
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

.store-select-page {
  min-height: 100vh;
  background: $page-bg;
}

.store-select-page__search-wrap {
  padding: 16rpx 24rpx;
  background: #fff;
}

.store-select-page__search-wrap :deep(.t-search) {
  --td-search-height: 80rpx;
  --td-search-bg-color: #f3f6fb;
  --td-search-placeholder-color: #9aa8bc;
}

.store-select-page__content {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  padding: 28rpx 32rpx 40rpx;
}

.store-card {
  display: flex;
  align-items: stretch;
  gap: 24rpx;
  min-height: 216rpx;
  padding: 28rpx;
  border: 2rpx solid $border-light;
  border-radius: 28rpx;
  background: #fff;
}

.store-card--active {
  border-color: $primary;
  background: $primary-soft;
  box-shadow: inset 0 0 0 2rpx rgba(21, 93, 252, 0.04);
}

.store-card__cover {
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: 20rpx;
  background: $surface-avatar;
}

.store-card__main {
  flex: 1;
  min-width: 0;
}

.store-card__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  min-height: 44rpx;
}

.store-card__name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 32rpx;
  font-weight: 700;
  color: $text-strong;
  line-height: 44rpx;
}

.store-card--active .store-card__name {
  color: $primary;
}

.store-card__line {
  display: flex;
  align-items: flex-start;
  gap: 10rpx;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: $text-secondary;
  line-height: 34rpx;
}

.store-card__line text {
  flex: 1;
}

.store-card__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8rpx;
  margin-top: 18rpx;
  padding-top: 18rpx;
  border-top: 2rpx solid $border-light;
}

.store-card__actions :deep(.t-button) {
  width: auto;
  min-width: 0;
  margin: 0;
  height: 52rpx;
  padding: 0 16rpx;
  border-radius: 26rpx;
  font-size: 24rpx;
  background: $primary;
  border-color: $primary;
  color: #fff;
}

.store-card__actions :deep(.t-button__text) {
  color: #fff;
}

.store-card__check {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 44rpx;
  height: 44rpx;
  border-radius: 50%;
  background: $primary;
}
</style>
