<template>
  <view class="custom-amount">
    <app-header title="自定义数量" :back="true" />

    <view class="custom-amount__content">
      <view class="custom-amount__display">
        <view class="custom-amount__amount-line" :class="{ 'custom-amount__amount-line--active': isEditing }" @click="focusEditor">
          <text class="custom-amount__amount">{{ pageData.amount }}</text>
          <view class="custom-amount__cursor"></view>
          <text class="custom-amount__unit">{{ pageData.unit }}</text>
        </view>
        <text class="custom-amount__payable">需支付¥ {{ pageData.payable }}</text>
      </view>

      <bottom-action-bar
        class="custom-amount__footer"
        bottom-offset="544rpx"
        padding-top="0"
        padding-bottom="14rpx"
        :bordered="false"
      >
        <view class="custom-amount__confirm" @click="handleConfirm">确认</view>
      </bottom-action-bar>
    </view>

    <view class="custom-amount__keyboard">
      <view
        v-for="key in keypadRows"
        :key="key.join('-')"
        class="custom-amount__row"
      >
        <view
          v-for="item in key"
          :key="item"
          class="custom-amount__key"
          :class="{ 'custom-amount__key--empty': item === '' }"
          @click="handleKeyClick(item)"
        >
          <text v-if="item && item !== 'delete'" class="custom-amount__key-text">{{ item }}</text>
          <text v-else-if="item === 'delete'" class="custom-amount__key-text">⌫</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import BottomActionBar from '@/components/common/layout/BottomActionBar.vue'
import {
  appendCustomAmountKey,
  confirmCustomAmount,
  getCustomAmountData,
  type CustomAmountData
} from '@/services/purchase'

const pageData = reactive<CustomAmountData>({
  amount: '',
  unit: '',
  payable: '',
  keypad: []
})
const isEditing = ref(true)

const keypadRows = computed(() => [
  pageData.keypad.slice(0, 3),
  pageData.keypad.slice(3, 6),
  pageData.keypad.slice(6, 9),
  ['', pageData.keypad[9] || '', pageData.keypad[10] || '']
])

loadPageData()

async function loadPageData() {
  Object.assign(pageData, await getCustomAmountData())
}

async function handleKeyClick(key: string) {
  if (!key) {
    return
  }

  isEditing.value = true
  Object.assign(pageData, await appendCustomAmountKey(key))
}

async function handleConfirm() {
  await confirmCustomAmount()
  uni.navigateBack()
}

function focusEditor() {
  isEditing.value = true
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.custom-amount {
  overflow: hidden;
  min-height: 100vh;
  height: 100vh;
  background: #fff;
  padding-bottom: 560rpx;
}

.custom-amount__content {
  min-height: calc(100vh - 560rpx);
}

.custom-amount__display {
  padding-top: 156rpx;
  text-align: center;
}

.custom-amount__amount-line {
  display: inline-flex;
  align-items: center;
  min-height: 108rpx;
  padding: 0 8rpx;
  border-radius: 16rpx;
}

.custom-amount__amount-line--active {
  background: #fff;
}

.custom-amount__amount {
  font-size: 96rpx;
  font-weight: 700;
  color: $text-strong;
}

.custom-amount__cursor {
  width: 4rpx;
  height: 84rpx;
  margin: 0 12rpx;
  border-radius: 999rpx;
  background: $primary;
  animation: custom-amount-caret 1s steps(1) infinite;
}

.custom-amount__unit {
  margin-top: 18rpx;
  font-size: 40rpx;
  font-weight: 700;
  color: $text-strong;
}

.custom-amount__payable {
  display: block;
  margin-top: 18rpx;
  font-size: 32rpx;
  color: $text-strong;
}

.custom-amount__footer {
}

.custom-amount__confirm {
  width: 100%;
  height: 106rpx;
  border: none;
  border-radius: 28rpx;
  background: #245cf0;
  text-align: center;
  line-height: 106rpx;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
}

.custom-amount__keyboard {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 8rpx 8rpx calc(12rpx + env(safe-area-inset-bottom));
  background: $page-bg;
}

.custom-amount__row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8rpx;
  margin-bottom: 8rpx;
}

.custom-amount__key {
  height: 128rpx;
  border-radius: 16rpx;
  background: #fff;
  text-align: center;
  line-height: 128rpx;
}

.custom-amount__key--empty {
  background: transparent;
}

.custom-amount__key-text {
  font-size: 56rpx;
  font-weight: 700;
  color: #111;
}

@keyframes custom-amount-caret {
  0%,
  50% {
    opacity: 1;
  }

  50.01%,
  100% {
    opacity: 0;
  }
}
</style>
