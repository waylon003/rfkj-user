<template>
  <PageLayout class="store-select-page" title="选择门店" :back="true">
    <view class="store-select-page__content">
      <template v-if="stores.length > 0">
        <view
          v-for="store in stores"
          :key="store.id"
          class="store-card"
          :class="{ 'store-card--active': store.id === selectedStoreId }"
          @click="selectStore(store)"
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
              <view v-if="store.id === selectedStoreId" class="store-card__check">
                <TIcon name="check" size="28rpx" color="#ffffff" />
              </view>
            </view>

            <view v-if="store.distanceText" class="store-card__distance">
              <TIcon name="location" size="24rpx" color="#155dfc" />
              <text>距我{{ store.distanceText }}</text>
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
      </template>

      <view v-else-if="!loading" class="store-select-page__empty">
        <TIcon name="scan" size="96rpx" color="#c0cddf" />
        <text class="store-select-page__empty-title">暂未注册门店会员</text>
        <text class="store-select-page__empty-desc">扫描门店二维码，注册成为门店会员后即可选择门店</text>
        <t-button
          theme="primary"
          shape="round"
          size="medium"
          @click="handleScanRegister"
        >
          扫码注册门店会员
        </t-button>
      </view>
    </view>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import TButton from 'tdesign-uniapp/button/button.vue'
import TIcon from 'tdesign-uniapp/icon/icon.vue'
import TImage from 'tdesign-uniapp/image/image.vue'
import PageLayout from '@/components/common/layout/PageLayout.vue'
import { useUserStore } from '@/stores'
import { getRegisteredStoreList, type RegisteredStore } from '@/services/store'

const STORE_KEY = 'rfkj_current_store'
const userStore = useUserStore()
const selectedStoreId = ref<number | null>(null)
const stores = ref<RegisteredStore[]>([])
const loading = ref(true)

onShow(async () => {
  selectedStoreId.value = userStore.selectedStoreId
  loading.value = true
  try {
    const result = await getRegisteredStoreList()
    stores.value = result.stores
  } catch {
    stores.value = []
  } finally {
    loading.value = false
  }
})

function selectStore(store: RegisteredStore) {
  selectedStoreId.value = store.id
  uni.setStorageSync(STORE_KEY, store.name)
  userStore.setSelectedStore({ id: store.id, name: store.name })
  uni.showToast({
    title: `已切换到 ${store.name}`,
    icon: 'none'
  })
  setTimeout(() => {
    uni.navigateBack()
  }, 300)
}

function viewStoreDetail(store: RegisteredStore) {
  uni.navigateTo({ url: `/pages/home/store-detail?id=${store.id}` })
}

function openStoreNavigation(store: RegisteredStore) {
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

function handleScanRegister() {
  uni.scanCode({
    onlyFromCamera: false,
    scanType: ['qrCode'],
    success() {
      uni.showToast({
        title: '扫码成功，正在注册门店会员',
        icon: 'none'
      })
    },
    fail() {
      uni.showToast({
        title: '已取消扫码',
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

.store-card__distance {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: $primary;
  line-height: 34rpx;
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

.store-select-page__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 48rpx;
  text-align: center;
}

.store-select-page__empty-title {
  display: block;
  margin-top: 32rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: $text-strong;
}

.store-select-page__empty-desc {
  display: block;
  margin-top: 16rpx;
  font-size: 26rpx;
  color: $text-tertiary;
  line-height: 1.6;
}

.store-select-page__empty :deep(.t-button) {
  margin-top: 40rpx;
}
</style>