<template>
  <t-popup
    :visible="visible"
    placement="center"
    :close-on-overlay-click="true"
    @visible-change="handleVisibleChange"
  >
    <view class="qr-code-popup">
      <text class="qr-code-popup__title">{{ title }}</text>

      <view v-if="amount" class="qr-code-popup__amount">
        <text class="qr-code-popup__amount-value">{{ amount }}</text>
        <text v-if="amountUnit" class="qr-code-popup__amount-unit">{{ amountUnit }}</text>
      </view>

      <view class="qr-code-popup__code">
        <TQRCode
          class="qr-code-popup__code-inner"
          :size="156"
          borderless
          color="#1F2A3A"
          bg-color="#FFFFFF"
          :value="value"
        />
      </view>

      <text
        v-for="line in tips"
        :key="line"
        class="qr-code-popup__tip"
      >
        {{ line }}
      </text>

      <view v-if="actionText" class="qr-code-popup__action-wrap">
        <view class="qr-code-popup__action" @click="$emit('action')">{{ actionText }}</view>
      </view>
    </view>
  </t-popup>
</template>

<script setup lang="ts">
import TQRCode from 'tdesign-uniapp/qrcode/qrcode.vue'

withDefaults(
  defineProps<{
    visible: boolean
    title: string
    value: string
    tips?: string[]
    amount?: string
    amountUnit?: string
    actionText?: string
  }>(),
  {
    tips: () => [],
    amount: '',
    amountUnit: '',
    actionText: ''
  }
)

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'action'): void
}>()

function handleVisibleChange(context: { visible: boolean }) {
  emit('update:visible', context.visible)
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.qr-code-popup {
  width: 600rpx;
  padding: 40rpx 32rpx 44rpx;
  border-radius: 28rpx;
  background: #fff;
}

.qr-code-popup__title {
  display: block;
  text-align: center;
  font-size: 32rpx;
  font-weight: 700;
  color: $text-strong;
}

.qr-code-popup__amount {
  display: flex;
  justify-content: center;
  align-items: baseline;
  margin-top: 44rpx;
}

.qr-code-popup__amount-value {
  font-size: 72rpx;
  font-weight: 700;
  color: $primary;
}

.qr-code-popup__amount-unit {
  margin-left: 10rpx;
  font-size: 40rpx;
  font-weight: 700;
  color: $primary;
}

.qr-code-popup__code {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 360rpx;
  height: 360rpx;
  margin: 30rpx auto 0;
  border-radius: 20rpx;
  background: #f7f9fc;
}

.qr-code-popup__code-inner {
  transform: scale(0.96);
}

.qr-code-popup__tip {
  display: block;
  margin-top: 16rpx;
  text-align: center;
  font-size: 24rpx;
  color: $text-secondary;
}

.qr-code-popup__action-wrap {
  margin-top: 28rpx;
}

.qr-code-popup__action {
  width: 100%;
  height: 52rpx;
  border: 2rpx solid $primary;
  border-radius: 28rpx;
  text-align: center;
  line-height: 48rpx;
  font-size: 24rpx;
  color: $primary;
}
</style>
