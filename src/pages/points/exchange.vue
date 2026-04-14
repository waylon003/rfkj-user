<template>
  <view class="point-gifts">
    <app-header title="积分兑礼品" :back="true" />

    <view class="point-gifts__content">
      <balance-card
        label="当前积分"
        :value="displayBalance"
        tag="待取礼品"
        @click="openPendingGifts"
      />

      <view class="point-gifts__filters">
        <view
          v-for="item in pageData.categories"
          :key="item.value"
          class="point-gifts__filter"
          :class="{ 'point-gifts__filter--active': activeCategory === item.value }"
          @click="activeCategory = item.value"
        >
          {{ item.label }}
        </view>
      </view>

      <view class="point-gifts__section-head">
        <view class="point-gifts__accent"></view>
        <text class="point-gifts__section-title">{{ currentSectionTitle }}</text>
        <text class="point-gifts__section-meta">共 {{ visibleItems.length }} 件，可兑换 {{ redeemableCount }} 件</text>
      </view>

      <view class="point-gifts__grid">
        <view
          v-for="item in visibleItems"
          :key="item.id"
          class="point-gifts__card"
          @click="openConfirm(item)"
        >
          <view class="point-gifts__thumb"></view>
          <view class="point-gifts__card-body">
            <text class="point-gifts__card-title">{{ item.title }}</text>
            <view class="point-gifts__cost-row">
              <text class="point-gifts__cost">{{ item.cost }}</text>
              <text class="point-gifts__cost-unit">积分</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <t-popup :visible="confirmVisible" placement="bottom" :close-on-overlay-click="true" @visible-change="handlePopupChange">
      <popup-panel :title="confirmData.title" @close="confirmVisible = false">
        <view class="point-gifts__popup-main">
          <view class="point-gifts__popup-thumb"></view>
          <view class="point-gifts__popup-meta">
            <text class="point-gifts__popup-gift">{{ confirmData.giftName }}</text>
            <text class="point-gifts__popup-line">所需积分： {{ confirmData.requiredPoints }}</text>
            <text class="point-gifts__popup-line">可用积分： {{ displayAvailablePoints }}</text>
          </view>
        </view>

        <view class="point-gifts__popup-hint-box">
          <view class="point-gifts__popup-hint-dot"></view>
          <view>
            <text
              v-for="line in confirmData.hint"
              :key="line"
              class="point-gifts__popup-hint"
            >
              {{ line }}
            </text>
          </view>
        </view>

        <template #actions>
          <popup-primary-button label="立即兑换" @click="redeemGift" />
          <text class="point-gifts__popup-cancel" @click="confirmVisible = false">取消</text>
        </template>
      </popup-panel>
    </t-popup>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppHeader from '@/components/common/AppHeader.vue'
import BalanceCard from '@/components/common/layout/BalanceCard.vue'
import PopupPanel from '@/components/common/popup/PopupPanel.vue'
import PopupPrimaryButton from '@/components/common/popup/PopupPrimaryButton.vue'
import {
  getPointGiftConfirmData,
  getPointGiftPageData,
  type PointGiftConfirmData,
  type PointGiftPageData
} from '@/services/points'
import { guardRouteAccess } from '@/utils/auth'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const pageData = reactive<PointGiftPageData>({
  balance: '',
  categories: [],
  items: []
})

const confirmData = reactive<PointGiftConfirmData>({
  title: '',
  giftName: '',
  requiredPoints: '',
  availablePoints: '',
  hint: []
})

const confirmVisible = ref(false)
const activeCategory = ref('all')
const displayBalance = computed(() => (userStore.profile.integral || Number(pageData.balance || 0)).toLocaleString('zh-CN'))
const displayAvailablePoints = computed(() =>
  (userStore.profile.integral || Number(confirmData.availablePoints || 0)).toLocaleString('zh-CN')
)
const currentIntegral = computed(() => userStore.profile.integral || Number(pageData.balance || 0))
const visibleItems = computed(() =>
  activeCategory.value === 'all'
    ? pageData.items
    : pageData.items.filter(item => item.category === activeCategory.value)
)
const currentSectionTitle = computed(() => {
  const currentCategory = pageData.categories.find(item => item.value === activeCategory.value)
  return currentCategory?.label || '全部礼品'
})
const redeemableCount = computed(() =>
  visibleItems.value.filter(item => Number(item.cost) <= currentIntegral.value).length
)

loadPageData()
onShow(() => {
  guardRouteAccess('/pages/points/exchange', '/pages/home/index')
})

async function loadPageData() {
  Object.assign(pageData, await getPointGiftPageData())
  Object.assign(confirmData, await getPointGiftConfirmData())
  activeCategory.value = pageData.categories[0]?.value || 'all'
}

function handlePopupChange(context: { visible: boolean }) {
  confirmVisible.value = context.visible
}

function openPendingGifts() {
  uni.navigateTo({ url: '/pages/profile/gifts' })
}

function openConfirm(item: PointGiftPageData['items'][number]) {
  confirmData.giftName = item.title
  confirmData.requiredPoints = item.cost
  confirmData.availablePoints = String(currentIntegral.value)
  confirmVisible.value = true
}

function redeemGift() {
  const required = Number(confirmData.requiredPoints || 0)
  if (required > currentIntegral.value) {
    uni.showToast({
      title: '当前积分不足',
      icon: 'none'
    })
    return
  }

  userStore.updateProfile({
    integral: currentIntegral.value - required
  })
  confirmVisible.value = false
  uni.showToast({
    title: '兑换成功，已加入待取礼品',
    icon: 'none'
  })
  setTimeout(() => {
    uni.navigateTo({ url: '/pages/profile/gifts' })
  }, 250)
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.point-gifts {
  min-height: 100vh;
  background: $page-bg;
}

.point-gifts__content {
  padding: 24rpx;
}

.point-gifts__filters {
  display: flex;
  gap: 10rpx;
  margin-top: 24rpx;
  overflow-x: auto;
}

.point-gifts__filter {
  flex: none;
  padding: 12rpx 24rpx;
  border: 2rpx solid $border-light;
  border-radius: 20rpx;
  background: #fff;
  text-align: center;
  font-size: 13px;
  color: $text-strong;
  line-height: 1;
}

.point-gifts__filter--active {
  border-color: $primary;
  background: $primary;
  color: #fff;
}

.point-gifts__section-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 26rpx;
}

.point-gifts__accent {
  width: 4rpx;
  height: 24rpx;
  border-radius: 999rpx;
  background: $primary;
  box-shadow: 0 0 8rpx rgba(37, 141, 232, 0.5);
}

.point-gifts__section-title {
  margin-left: 12rpx;
  font-size: 28rpx;
  color: $text-strong;
}

.point-gifts__section-meta {
  width: 100%;
  margin-top: 8rpx;
  margin-left: 16rpx;
  font-size: 22rpx;
  color: $text-tertiary;
}

.point-gifts__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18rpx;
  margin-top: 20rpx;
}

.point-gifts__card {
  overflow: hidden;
  border-radius: 14rpx;
  background: #fff;
  min-height: 220px;
}

.point-gifts__thumb {
  height: 140px;
  background: $surface-avatar;
}

.point-gifts__card-body {
  padding: 16rpx 16rpx 18rpx;
}

.point-gifts__card-title {
  display: block;
  font-size: 14px;
  color: $primary;
}

.point-gifts__cost-row {
  display: flex;
  align-items: baseline;
  margin-top: 10rpx;
}

.point-gifts__cost {
  font-size: 20px;
  font-weight: 700;
  color: #111;
}

.point-gifts__cost-unit {
  margin-left: 6rpx;
  font-size: 12px;
  color: $text-strong;
}

.point-gifts__popup-main {
  display: flex;
}

.point-gifts__popup-thumb {
  width: 180rpx;
  height: 180rpx;
  border-radius: 24rpx;
  background: $page-bg;
}

.point-gifts__popup-meta {
  margin-left: 20rpx;
}

.point-gifts__popup-gift {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: $primary;
}

.point-gifts__popup-line {
  display: block;
  margin-top: 20rpx;
  font-size: 28rpx;
  color: $text-secondary;
}

.point-gifts__popup-hint-box {
  display: flex;
  margin-top: 36rpx;
  padding: 22rpx 20rpx;
  border-radius: 24rpx;
  background: $page-bg;
}

.point-gifts__popup-hint-dot {
  width: 12rpx;
  height: 12rpx;
  margin-top: 6rpx;
  margin-right: 12rpx;
  background: #d9d9d9;
}

.point-gifts__popup-hint {
  display: block;
  font-size: 24rpx;
  line-height: 1.5;
  color: $text-strong;
}

.point-gifts__popup-cancel {
  display: block;
  margin-top: 28rpx;
  text-align: center;
  font-size: 32rpx;
  color: $text-strong;
}
</style>
