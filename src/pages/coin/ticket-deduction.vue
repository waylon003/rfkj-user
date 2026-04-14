<template>
  <view class="ticket-deduction">
    <app-header title="彩票抵扣" :back="true" />

    <balance-card label="当前彩票余额" :value="pageData.balance" unit="张" />

    <view class="ticket-deduction__panel">
      <view
        v-for="item in pageData.options"
        :key="item.id"
        class="ticket-deduction__option"
        @click="handleSelectOption(item.id)"
      >
        <view>
          <text class="ticket-deduction__option-title">{{ item.title }}</text>
          <text v-if="item.subtitle" class="ticket-deduction__option-subtitle">{{ item.subtitle }}</text>
        </view>
        <view
          class="ticket-deduction__radio"
          :class="{ 'ticket-deduction__radio--selected': item.selected }"
        >
          <view v-if="item.selected" class="ticket-deduction__radio-dot"></view>
        </view>
      </view>
    </view>

    <text class="ticket-deduction__helper">{{ pageData.helper }}</text>

    <bottom-action-bar class="ticket-deduction__footer" padding-top="16rpx" padding-bottom="16rpx">
      <view class="ticket-deduction__button" @click="handleConfirm">确定</view>
    </bottom-action-bar>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import BalanceCard from '@/components/common/layout/BalanceCard.vue'
import BottomActionBar from '@/components/common/layout/BottomActionBar.vue'
import {
  confirmTicketDeduction,
  getTicketDeductionData,
  selectTicketDeduction,
  type TicketDeductionData
} from '@/services/purchase'

const pageData = reactive<TicketDeductionData>({
  balance: '',
  helper: '',
  options: []
})

loadPageData()

async function loadPageData() {
  Object.assign(pageData, await getTicketDeductionData())
}

async function handleSelectOption(id: string) {
  Object.assign(pageData, await selectTicketDeduction(id))
}

async function handleConfirm() {
  await confirmTicketDeduction()
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.ticket-deduction {
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

.ticket-deduction__panel {
  margin: 24rpx;
  border: 2rpx solid $border-light;
  border-radius: 28rpx;
  background: #fff;
}

.ticket-deduction__panel {
  overflow: hidden;
  padding: 0;
}

.ticket-deduction__option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 106rpx;
  padding: 24rpx;
  border-top: 2rpx solid $border-light;
}

.ticket-deduction__option:first-child {
  border-top: none;
}

.ticket-deduction__option-title {
  display: block;
  font-size: 28rpx;
  color: $text-strong;
}

.ticket-deduction__option-subtitle {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: $text-tertiary;
}

.ticket-deduction__radio {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid $surface-avatar;
  border-radius: 50%;
}

.ticket-deduction__radio--selected {
  border-color: $primary;
}

.ticket-deduction__radio-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #fff;
}

.ticket-deduction__helper {
  display: block;
  margin-top: 56rpx;
  text-align: center;
  font-size: 24rpx;
  color: $primary;
}

.ticket-deduction__footer {
}

.ticket-deduction__button {
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
