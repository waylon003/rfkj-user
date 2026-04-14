<template>
  <view class="ticket-exchange">
    <app-header title="彩票兑积分" :back="true" />

    <view class="ticket-exchange__content">
      <view class="ticket-exchange__balance-card">
        <view class="ticket-exchange__balance-block">
          <text class="ticket-exchange__balance-label">当前彩票</text>
          <text class="ticket-exchange__balance-value">{{ displayTickets }}</text>
          <text class="ticket-exchange__balance-unit">张</text>
        </view>
        <view class="ticket-exchange__divider"></view>
        <view class="ticket-exchange__balance-block">
          <text class="ticket-exchange__balance-label">当前积分</text>
          <text class="ticket-exchange__balance-value">{{ displayPoints }}</text>
          <text class="ticket-exchange__balance-unit">分</text>
        </view>
      </view>

      <view class="ticket-exchange__input-card">
        <text class="ticket-exchange__section-label">兑换数量</text>
        <view class="ticket-exchange__input-row">
          <view class="ticket-exchange__input-main">
            <input
              class="ticket-exchange__input"
              type="number"
              :value="String(exchangeAmount)"
              @input="handleAmountInput"
            />
          </view>
          <text class="ticket-exchange__input-unit">张</text>
        </view>
      </view>

      <view class="ticket-exchange__estimate">
        <view class="ticket-exchange__estimate-dot"></view>
        <text>预计可兑换{{ estimatedPoints }}积分</text>
      </view>

      <view class="ticket-exchange__submit" @click="submitExchange">立即兑换</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppHeader from '@/components/common/AppHeader.vue'
import { guardRouteAccess } from '@/utils/auth'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const exchangeAmount = ref(100)
const exchangeRatio = 100

onShow(() => {
  guardRouteAccess('/pages/member/tickets', '/pages/home/index')
})

const currentTickets = computed(() => userStore.profile.ticket || 456)
const currentPoints = computed(() => userStore.profile.integral || 12123)
const displayTickets = computed(() => currentTickets.value.toLocaleString('zh-CN'))
const displayPoints = computed(() => currentPoints.value.toLocaleString('zh-CN'))
const estimatedPoints = computed(() => exchangeAmount.value * exchangeRatio)

function handleAmountInput(event: any) {
  const rawValue = Number(event?.detail?.value)
  updateAmount(Number.isFinite(rawValue) ? rawValue : 1)
}

function updateAmount(value: number) {
  const normalized = Math.trunc(value)
  exchangeAmount.value = Math.min(currentTickets.value, Math.max(1, normalized || 1))
}

function submitExchange() {
  uni.showToast({
    title: `已模拟兑换${estimatedPoints.value}积分`,
    icon: 'none'
  })
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.ticket-exchange {
  min-height: 100vh;
  background: $page-bg;
}

.ticket-exchange__content {
  padding: 24rpx;
}

.ticket-exchange__balance-card,
.ticket-exchange__input-card {
  border-radius: 24rpx;
  background: $page-bg;
  border: 2rpx solid $border-light;
}

.ticket-exchange__balance-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 24rpx;
}

.ticket-exchange__balance-block {
  flex: 1;
  text-align: center;
}

.ticket-exchange__balance-label {
  display: block;
  font-size: 24rpx;
  color: $text-secondary;
}

.ticket-exchange__balance-value {
  display: inline-block;
  margin-top: 10rpx;
  font-size: 40rpx;
  font-weight: 700;
  color: $text-primary;
}

.ticket-exchange__balance-unit {
  margin-left: 8rpx;
  font-size: 24rpx;
  color: $text-secondary;
}

.ticket-exchange__divider {
  width: 2rpx;
  height: 80rpx;
  background: #d9d9d9;
}

.ticket-exchange__input-card {
  margin-top: 24rpx;
  padding: 22rpx 24rpx 24rpx;
}

.ticket-exchange__section-label {
  display: block;
  font-size: 24rpx;
  color: $text-strong;
}

.ticket-exchange__input-row {
  display: flex;
  align-items: baseline;
  margin-top: 26rpx;
  padding-bottom: 18rpx;
  border-bottom: 2rpx solid $border-light;
}

.ticket-exchange__input-main {
  flex: 1;
}

.ticket-exchange__input {
  width: 100%;
  height: 72rpx;
  text-align: left;
  font-size: 60rpx;
  font-weight: 700;
  color: $text-strong;
}

.ticket-exchange__input-unit {
  margin-left: 16rpx;
  font-size: 28rpx;
  color: $text-strong;
}

.ticket-exchange__estimate {
  display: flex;
  align-items: center;
  margin-top: 22rpx;
  font-size: 24rpx;
  color: $text-strong;
}

.ticket-exchange__estimate-dot {
  width: 12rpx;
  height: 12rpx;
  margin-right: 10rpx;
  background: #d9d9d9;
}

.ticket-exchange__submit {
  width: 100%;
  height: 106rpx;
  margin-top: 28rpx;
  border-radius: 28rpx;
  background: #245cf0;
  text-align: center;
  line-height: 106rpx;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
}
</style>
