<template>
  <PageLayout class="pending-gifts" title="待取礼品" :back="true" :fixed-header-height="104">
    <template #fixed-header>
      <top-tabs v-model="activeTab" :items="displayTabs" />
    </template>

    <view class="pending-gifts__list">
      <view v-if="visibleItems.length === 0" class="pending-gifts__empty">
        <text class="pending-gifts__empty-text">暂无{{ activeTab === 'pending' ? '待领取' : activeTab === 'claimed' ? '已领取' : '已过期' }}的礼品</text>
        <text class="pending-gifts__empty-hint">通过积分兑换或好友赠送获得礼品</text>
      </view>

      <view
        v-for="item in visibleItems"
        :key="item.id"
        class="pending-gifts__card"
        :class="{ 'pending-gifts__card--expired': item.tab === 'expired' }"
      >
        <view class="pending-gifts__main">
          <view class="pending-gifts__thumb">
            <image
              v-if="item.image"
              class="pending-gifts__thumb-image"
              :src="item.image"
              mode="aspectFit"
            />
          </view>
          <view class="pending-gifts__content">
            <text class="pending-gifts__title">{{ item.title }}</text>
            <view
              class="pending-gifts__meta"
              :class="{ 'pending-gifts__meta--orange': activeTab === 'pending' }"
            >
              <TIcon name="time" size="24rpx" color="currentColor" />
              <text>{{ item.timeLabel }}</text>
            </view>
            <view class="pending-gifts__meta">
              <TIcon name="location" size="24rpx" color="#8a97ab" />
              <text>{{ currentStoreName }}</text>
            </view>
            <view class="pending-gifts__meta pending-gifts__meta--address">
              <TIcon name="map-location" size="24rpx" color="#8a97ab" />
              <text>{{ item.pickupAddress }}</text>
            </view>
          </view>
        </view>
        <view
          class="pending-gifts__action"
          :class="{
            'pending-gifts__action--claimed': activeTab === 'claimed',
            'pending-gifts__action--expired': activeTab === 'expired'
          }"
          @click="handleAction(item)"
        >
          {{ item.actionLabel }}
        </view>
      </view>
    </view>

    <QrCodePopup
      :visible="qrVisible"
      title="礼品核销码"
      :value="activeQrValue"
      :tips="['请到店出示核销码完成礼品领取']"
      action-text="确认领取"
      @update:visible="qrVisible = $event"
      @action="confirmPickup"
    />
  </PageLayout>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import TIcon from 'tdesign-uniapp/icon/icon.vue'
import PageLayout from '@/components/common/layout/PageLayout.vue'
import QrCodePopup from '@/components/common/popup/QrCodePopup.vue'
import TopTabs from '@/components/common/layout/TopTabs.vue'
import { getPendingGiftData, confirmGiftPickup, type PendingGiftData, type PendingGiftItem, type PendingGiftTab } from '@/services/profile'
import { guardRouteAccess } from '@/utils/auth'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const pageData = reactive<PendingGiftData>({
  tabs: [],
  items: []
})

const activeTab = ref<PendingGiftTab>('pending')
const qrVisible = ref(false)
const activeQrValue = ref('')
const activeGiftId = ref('')

const visibleItems = computed(() =>
  pageData.items
    .filter(item => item.tab === activeTab.value)
    .map(item => mapGiftByStore(item))
)
const displayTabs = computed(() =>
  pageData.tabs.map(tab => ({
    ...tab,
    label: `${tab.label}(${pageData.items.filter(item => item.tab === tab.value).length})`
  }))
)
const currentStoreName = computed(() => `领取门店：${userStore.selectedStoreName || '未注册门店'}`)

void loadPageData().catch(showError)
onShow(() => {
  guardRouteAccess('/pages/profile/gifts', '/pages/profile/index')
})

async function loadPageData() {
  Object.assign(pageData, await getPendingGiftData())
}

function handleAction(item: PendingGiftItem) {
  if (item.tab !== 'pending') {
    return
  }

  if (!item.qrValue) {
    uni.showToast({
      title: '当前核销码暂未返回',
      icon: 'none'
    })
    return
  }

  activeGiftId.value = item.id
  activeQrValue.value = item.qrValue
  qrVisible.value = true
}

async function confirmPickup() {
  const current = pageData.items.find(item => item.id === activeGiftId.value)
  if (!current) {
    return
  }

  try {
    const orderId = Number(current.id)
    if (isNaN(orderId)) {
      throw new Error('无效的订单ID')
    }

    await confirmGiftPickup([orderId])

    // 成功后更新本地状态
    current.tab = 'claimed'
    current.timeLabel = `领取时间: ${formatDateTime(new Date())}`
    current.actionLabel = '已领取'
    qrVisible.value = false
    activeTab.value = 'claimed'

    uni.showToast({
      title: '礼品已领取',
      icon: 'success'
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : '领取失败'
    uni.showToast({
      title: message,
      icon: 'none'
    })
  }
}

function formatDateTime(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

function mapGiftByStore(item: PendingGiftItem) {
  if (currentStoreName.value.includes('额企鹅驱蚊器')) {
    if (item.id === 'gift-1') {
      return { ...item, title: '额企鹅限定毛绒公仔' }
    }
    return { ...item }
  }

  if (currentStoreName.value.includes('大大大大')) {
    if (item.id === 'gift-1') {
      return { ...item, title: '大大主题公仔礼盒' }
    }
    return { ...item }
  }

  return item
}

function showError(error: unknown) {
  const message = error instanceof Error ? error.message : '待取礼品加载失败'
  uni.showToast({
    title: message,
    icon: 'none'
  })
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.pending-gifts {
  min-height: 100vh;
  background: $page-bg;
}

.pending-gifts__list {
  padding: 24rpx;
}

.pending-gifts__card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 120rpx;
  min-height: 224rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
  border-radius: 28rpx;
  background: #fff;
  border: 2rpx solid $border-light;
}

.pending-gifts__card--expired {
  opacity: 0.76;
  border: 2rpx dashed #d6dde8;
}

.pending-gifts__main {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 28rpx 24rpx;
  min-width: 0;
}

.pending-gifts__thumb {
  width: 150rpx;
  height: 142rpx;
  border-radius: 20rpx;
  background: #eef4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.pending-gifts__thumb-image {
  width: 92rpx;
  height: 92rpx;
}

.pending-gifts__content {
  flex: 1;
  min-width: 0;
}

.pending-gifts__title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: $text-primary;
}

.pending-gifts__meta {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-top: 18rpx;
  font-size: 24rpx;
  color: $text-secondary;
}

.pending-gifts__meta--orange {
  color: #f97316;
}

.pending-gifts__meta--address {
  align-items: flex-start;
  font-size: 22rpx;
  line-height: 1.5;
  color: $text-tertiary;
}

.pending-gifts__action {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 18rpx;
  background: #edf4ff;
  border-left: 2rpx solid #e1ebfb;
  font-size: 26rpx;
  color: $primary;
  text-align: center;
}

.pending-gifts__action--claimed,
.pending-gifts__action--expired {
  background: #f5f7fb;
  color: $text-secondary;
  border-left-color: $border-light;
}

.pending-gifts__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 48rpx;
}

.pending-gifts__empty-text {
  font-size: 32rpx;
  color: $text-secondary;
  line-height: 44rpx;
}

.pending-gifts__empty-hint {
  margin-top: 16rpx;
  font-size: 26rpx;
  color: $text-tertiary;
  line-height: 40rpx;
  text-align: center;
}
</style>
