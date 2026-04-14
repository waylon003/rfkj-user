<template>
  <view class="point-payment">
    <app-header title="积分付" :back="true" />

    <balance-card label="当前积分余额" :value="pageData.balance" unit="张" />

    <view class="point-payment__panel">
      <view
        v-for="item in pageData.options"
        :key="item.id"
        class="point-payment__option"
        @click="handleSelectOption(item.id)"
      >
        <view>
          <view class="point-payment__option-title-wrap">
            <text class="point-payment__option-title">{{ item.title }}</text>
            <view v-if="item.id === 'minus-10'" class="point-payment__tag">推荐</view>
          </view>
          <text v-if="item.subtitle" class="point-payment__option-subtitle">{{ item.subtitle }}</text>
        </view>
        <view
          class="point-payment__radio"
          :class="{ 'point-payment__radio--selected': item.selected }"
        >
          <view v-if="item.selected" class="point-payment__radio-dot"></view>
        </view>
      </view>
    </view>

    <text class="point-payment__helper">{{ pageData.helper }}</text>

    <bottom-action-bar class="point-payment__footer" padding-top="16rpx" padding-bottom="16rpx">
      <view class="point-payment__button" @click="handleConfirm">确定</view>
    </bottom-action-bar>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import BalanceCard from '@/components/common/layout/BalanceCard.vue'
import BottomActionBar from '@/components/common/layout/BottomActionBar.vue'
import {
  confirmPointPayment,
  getPointPaymentData,
  selectPointPayment,
  type PointPaymentData
} from '@/services/purchase'

const pageData = reactive<PointPaymentData>({
  balance: '',
  helper: '',
  options: []
})

loadPageData()

async function loadPageData() {
  Object.assign(pageData, await getPointPaymentData())
}

async function handleSelectOption(id: string) {
  Object.assign(pageData, await selectPointPayment(id))
}

async function handleConfirm() {
  await confirmPointPayment()
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.point-payment {
  min-height: 100vh;
  background: $page-bg;
  padding-bottom: 140rpx;
}

:deep(.balance-card) {
  margin: 24rpx 24rpx 0;
  min-height: 102rpx;
  padding: 16rpx 24rpx;
}

:deep(.balance-card__label) {
  font-size: 20rpx;
}

:deep(.balance-card__value-row) {
  margin-top: 8rpx;
}

:deep(.balance-card__value) {
  font-size: 54rpx;
}

:deep(.balance-card__unit) {
  margin-left: 6rpx;
  font-size: 24rpx;
}

:deep(.balance-card__avatar) {
  width: 76rpx;
  height: 76rpx;
  margin-top: 2rpx;
}

.point-payment__panel {
  margin: 24rpx;
  border: 2rpx solid $border-light;
  border-radius: 28rpx;
  background: #fff;
}

.point-payment__panel {
  overflow: hidden;
  padding: 0;
}

.point-payment__option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 106rpx;
  padding: 24rpx;
  border-top: 2rpx solid $border-light;
}

.point-payment__option:first-child {
  border-top: none;
}

.point-payment__option-title-wrap {
  display: flex;
  align-items: center;
}

.point-payment__option-title {
  font-size: 28rpx;
  color: $text-strong;
}

.point-payment__tag {
  width: 86rpx;
  height: 38rpx;
  margin-left: 18rpx;
  border-radius: 10rpx;
  background: $primary;
  text-align: center;
  line-height: 38rpx;
  font-size: 22rpx;
  color: #fff;
}

.point-payment__option-subtitle {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: $text-tertiary;
}

.point-payment__radio {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid $surface-avatar;
  border-radius: 50%;
}

.point-payment__radio--selected {
  border-color: $primary;
}

.point-payment__radio-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #fff;
}

.point-payment__helper {
  display: block;
  margin-top: 56rpx;
  text-align: center;
  font-size: 24rpx;
  color: $primary;
}

.point-payment__footer {
}

.point-payment__button {
  width: 100%;
  height: 106rpx;
  border-radius: 28rpx;
  background: #245cf0;
  text-align: center;
  line-height: 106rpx;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
}
</style>
