<template>
  <view class="bill-page">
    <app-header title="账单" :back="true" />

    <sticky-page-top :height-rpx="104">
      <top-tabs v-model="activeTab" :items="pageData.tabs" />
    </sticky-page-top>

    <view class="bill-page__content">
      <view class="bill-page__summary">
        <text class="bill-page__summary-line">当前会员：{{ displayMemberId }}</text>
        <text class="bill-page__summary-line">当前门店：{{ currentStoreName }}</text>
        <view class="bill-page__asset-grid">
          <view class="bill-page__asset-item">
            <text class="bill-page__asset-label">游戏币</text>
            <text class="bill-page__asset-value">{{ displayCoin }}</text>
          </view>
          <view class="bill-page__asset-item">
            <text class="bill-page__asset-label">彩票</text>
            <text class="bill-page__asset-value">{{ displayTicket }}</text>
          </view>
          <view class="bill-page__asset-item">
            <text class="bill-page__asset-label">积分</text>
            <text class="bill-page__asset-value">{{ displayIntegral }}</text>
          </view>
        </view>
      </view>

      <section-card class="bill-page__section" :title="pageData.monthLabel">
        <view
          v-for="item in monthRecords"
          :key="item.id"
          class="bill-card"
        >
          <view class="bill-card__avatar"></view>
          <view class="bill-card__content">
            <text class="bill-card__title">{{ item.title }}</text>
            <text class="bill-card__time">{{ item.time }}</text>
          </view>
          <view class="bill-card__amount-group">
            <text class="bill-card__amount" :class="{ 'bill-card__amount--plus': item.amount.startsWith('+') }">
              {{ item.amount }}
            </text>
            <text class="bill-card__status">{{ item.status }}</text>
          </view>
        </view>
      </section-card>

      <section-card class="bill-page__section" :title="pageData.historyLabel">
        <view
          v-for="item in historyRecords"
          :key="item.id"
          class="bill-card"
        >
          <view class="bill-card__avatar"></view>
          <view class="bill-card__content">
            <text class="bill-card__title">{{ item.title }}</text>
            <text class="bill-card__time">{{ item.time }}</text>
          </view>
          <view class="bill-card__amount-group">
            <text class="bill-card__amount">{{ item.amount }}</text>
            <text class="bill-card__status">{{ item.status }}</text>
          </view>
        </view>
      </section-card>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppHeader from '@/components/common/AppHeader.vue'
import SectionCard from '@/components/common/layout/SectionCard.vue'
import StickyPageTop from '@/components/common/layout/StickyPageTop.vue'
import TopTabs from '@/components/common/layout/TopTabs.vue'
import { getBillPageData, type BillPageData, type BillTab } from '@/services/profile'
import { guardRouteAccess } from '@/utils/auth'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const pageData = reactive<BillPageData>({
  tabs: [],
  monthLabel: '',
  monthRecords: [],
  historyLabel: '',
  historyRecords: []
})

const activeTab = ref<BillTab>('all')

const monthRecords = computed(() =>
  pageData.monthRecords
    .filter(item => activeTab.value === 'all' || item.tab === activeTab.value)
    .map(item => mapBillRecordByStore(item))
)

const historyRecords = computed(() =>
  pageData.historyRecords
    .filter(item => activeTab.value === 'all' || item.tab === activeTab.value)
    .map(item => mapBillRecordByStore(item))
)
const displayMemberId = computed(() => userStore.profile.memberId || 'ID:--')
const currentStoreName = computed(() => userStore.selectedStoreName || '未选择门店')
const displayCoin = computed(() => (userStore.profile.coin || 0).toLocaleString('zh-CN'))
const displayTicket = computed(() => (userStore.profile.ticket || 0).toLocaleString('zh-CN'))
const displayIntegral = computed(() => (userStore.profile.integral || 0).toLocaleString('zh-CN'))

loadPageData()
onShow(() => {
  guardRouteAccess('/pages/profile/bill', '/pages/profile/index')
})

async function loadPageData() {
  Object.assign(pageData, await getBillPageData())
}

function mapBillRecordByStore(item: BillPageData['monthRecords'][number]) {
  if (currentStoreName.value.includes('额企鹅驱蚊器')) {
    if (item.id === 'bill-1') {
      return { ...item, title: '购买游戏币（额企鹅驱蚊器店）', amount: '+120' }
    }
    if (item.id === 'bill-2') {
      return { ...item, title: '彩票兑换积分（额企鹅驱蚊器店）', amount: '+680' }
    }
    return { ...item }
  }

  if (currentStoreName.value.includes('大大大大')) {
    if (item.id === 'bill-1') {
      return { ...item, title: '购买游戏币（大大大大店）', amount: '+80' }
    }
    if (item.id === 'bill-3') {
      return { ...item, title: '积分兑换礼品（大大大大店）', amount: '-350' }
    }
    return { ...item }
  }

  return item
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.bill-page {
  min-height: 100vh;
  background: $page-bg;
}

.bill-page__content {
  padding: 24rpx;
}

.bill-page__summary {
  margin-bottom: 24rpx;
  padding: 24rpx 28rpx;
  border-radius: 24rpx;
  background: #fff;
  border: 2rpx solid $border-light;
}

.bill-page__summary-line {
  display: block;
  font-size: 24rpx;
  line-height: 1.6;
  color: $text-secondary;
}

.bill-page__summary-line + .bill-page__summary-line {
  margin-top: 8rpx;
}

.bill-page__asset-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-top: 20rpx;
}

.bill-page__asset-item {
  border-radius: 20rpx;
  background: $page-bg;
  padding: 18rpx 16rpx;
}

.bill-page__asset-label {
  display: block;
  font-size: 22rpx;
  color: $text-tertiary;
}

.bill-page__asset-value {
  display: block;
  margin-top: 10rpx;
  font-size: 28rpx;
  font-weight: 700;
  color: $text-primary;
}

.bill-card {
  display: flex;
  align-items: center;
  min-height: 168rpx;
  margin: 0 24rpx 20rpx;
  padding: 0 24rpx;
  border-radius: 28rpx;
  background: #fff;
}

.bill-card__avatar {
  width: 104rpx;
  height: 104rpx;
  border-radius: 50%;
  @include public-cover($public-demo-image-1);
}

.bill-card__content {
  margin-left: 18rpx;
}

.bill-card__title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: $text-primary;
}

.bill-card__time {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: $text-tertiary;
}

.bill-card__amount-group {
  margin-left: auto;
  text-align: right;
}

.bill-card__amount {
  display: block;
  font-size: 48rpx;
  font-weight: 700;
  color: $text-strong;
}

.bill-card__amount--plus {
  color: $primary;
}

.bill-card__status {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: $text-tertiary;
}
</style>
