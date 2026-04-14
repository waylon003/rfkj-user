<template>
  <view class="coin-success">
    <view class="coin-success__icon">✓</view>
    <text class="coin-success__title">{{ pageData.title }}</text>
    <view class="coin-success__amount-line">
      <text class="coin-success__currency">¥</text>
      <text class="coin-success__amount">{{ pageData.amount }}</text>
    </view>
    <text class="coin-success__subtitle">{{ pageData.subtitle }}</text>

    <view class="coin-success__button" @click="goBack">确定</view>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { getPaymentSuccessData, type PaymentSuccessData } from '@/services/purchase'

const pageData = reactive<PaymentSuccessData>({
  amount: '',
  title: '',
  subtitle: ''
})

loadPageData()

async function loadPageData() {
  Object.assign(pageData, await getPaymentSuccessData())
}

function goBack() {
  uni.navigateBack()
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.coin-success {
  min-height: 100vh;
  padding-top: 220rpx;
  text-align: center;
  background: #fff;
}

.coin-success__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160rpx;
  height: 160rpx;
  margin: 0 auto;
  border-radius: 50%;
  background: #245cf0;
  font-size: 80rpx;
  font-weight: 700;
  color: #fff;
}

.coin-success__title {
  display: block;
  margin-top: 34rpx;
  font-size: 40rpx;
  font-weight: 700;
  color: $text-strong;
}

.coin-success__amount-line {
  display: flex;
  justify-content: center;
  align-items: baseline;
  margin-top: 28rpx;
}

.coin-success__currency {
  font-size: 42rpx;
  font-weight: 700;
  color: $text-strong;
}

.coin-success__amount {
  margin-left: 8rpx;
  font-size: 84rpx;
  font-weight: 700;
  color: $text-strong;
}

.coin-success__subtitle {
  display: block;
  margin-top: 16rpx;
  font-size: 28rpx;
  color: $text-secondary;
}

.coin-success__button {
  width: calc(100% - 48rpx);
  height: 106rpx;
  margin: 420rpx 24rpx 0;
  border-radius: 28rpx;
  background: #245cf0;
  text-align: center;
  line-height: 106rpx;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
}
</style>
