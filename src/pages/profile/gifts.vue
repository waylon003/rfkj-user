<template>
  <view class="pending-gifts">
    <app-header title="待取礼品" :back="true" />

    <sticky-page-top :height-rpx="104">
      <top-tabs v-model="activeTab" :items="displayTabs" />
    </sticky-page-top>

    <view class="pending-gifts__list">
      <view
        v-for="item in visibleItems"
        :key="item.id"
        class="pending-gifts__card"
        :class="{ 'pending-gifts__card--expired': item.tab === 'expired' }"
      >
        <view class="pending-gifts__thumb"></view>
        <view class="pending-gifts__content">
          <text class="pending-gifts__title">{{ item.title }}</text>
          <text
            class="pending-gifts__time"
            :class="{ 'pending-gifts__time--orange': activeTab === 'pending' }"
          >
            {{ item.timeLabel }}
          </text>
          <text class="pending-gifts__store">{{ currentStoreName }}</text>
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
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppHeader from '@/components/common/AppHeader.vue'
import QrCodePopup from '@/components/common/popup/QrCodePopup.vue'
import StickyPageTop from '@/components/common/layout/StickyPageTop.vue'
import TopTabs from '@/components/common/layout/TopTabs.vue'
import { getPendingGiftData, type PendingGiftData, type PendingGiftItem, type PendingGiftTab } from '@/services/profile'
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
const currentStoreName = computed(() => `领取门店：${userStore.selectedStoreName || '未选择门店'}`)

loadPageData()
onShow(() => {
  guardRouteAccess('/pages/profile/gifts', '/pages/profile/index')
})

async function loadPageData() {
  Object.assign(pageData, await getPendingGiftData())
}

function handleAction(item: PendingGiftItem) {
  if (item.tab !== 'pending' || !item.qrValue) {
    return
  }

  activeGiftId.value = item.id
  activeQrValue.value = item.qrValue
  qrVisible.value = true
}

function confirmPickup() {
  const current = pageData.items.find(item => item.id === activeGiftId.value)
  if (!current) {
    return
  }

  current.tab = 'claimed'
  current.timeLabel = `领取时间: ${new Date().getFullYear()}.4.13`
  current.actionLabel = '已领取'
  qrVisible.value = false
  activeTab.value = 'claimed'
  uni.showToast({
    title: '礼品已领取',
    icon: 'none'
  })
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
  display: flex;
  align-items: center;
  min-height: 206rpx;
  margin-bottom: 24rpx;
  padding: 32rpx;
  border-radius: 28rpx;
  background: #fff;
}

.pending-gifts__card--expired {
  opacity: 0.76;
  border: 2rpx dashed #d6dde8;
}

.pending-gifts__thumb {
  width: 150rpx;
  height: 142rpx;
  border-radius: 20rpx;
  background: #dfe5f0;
}

.pending-gifts__content {
  flex: 1;
  margin-left: 20rpx;
}

.pending-gifts__title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: $text-primary;
}

.pending-gifts__time {
  display: block;
  margin-top: 18rpx;
  font-size: 24rpx;
  color: $text-secondary;
}

.pending-gifts__time--orange {
  color: #f97316;
}

.pending-gifts__store {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  line-height: 1.5;
  color: $text-tertiary;
}

.pending-gifts__action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 104rpx;
  height: 104rpx;
  border-radius: 50%;
  background: $primary;
  font-size: 26rpx;
  color: #fff;
}

.pending-gifts__action--claimed,
.pending-gifts__action--expired {
  width: 132rpx;
  height: 90rpx;
  border-radius: 24rpx;
  background: $surface-avatar;
  color: $text-strong;
}
</style>
