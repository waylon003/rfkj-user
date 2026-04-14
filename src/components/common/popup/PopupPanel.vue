<template>
  <view class="popup-panel" :class="panelClass">
    <view class="popup-panel__header">
      <text class="popup-panel__title">{{ title }}</text>
      <text v-if="closable" class="popup-panel__close" @click="$emit('close')">×</text>
    </view>

    <view class="popup-panel__body">
      <slot />
    </view>

    <view v-if="$slots.actions" class="popup-panel__actions">
      <slot name="actions" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    mode?: 'bottom' | 'center'
    closable?: boolean
  }>(),
  {
    mode: 'bottom',
    closable: true
  }
)

defineEmits<{
  (e: 'close'): void
}>()

const panelClass = computed(() =>
  props.mode === 'center' ? 'popup-panel--center' : 'popup-panel--bottom'
)
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.popup-panel {
  position: relative;
  background: #fff;
}

.popup-panel--bottom {
  padding: 20rpx 16rpx 28rpx;
  border-radius: 28rpx 28rpx 0 0;
}

.popup-panel--center {
  width: 600rpx;
  padding: 32rpx;
  border-radius: 28rpx;
}

.popup-panel__header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56rpx;
}

.popup-panel__title {
  font-size: 32rpx;
  font-weight: 700;
  color: $text-strong;
}

.popup-panel__close {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 48rpx;
  line-height: 1;
  color: $text-strong;
}

.popup-panel__body {
  margin-top: 24rpx;
}

.popup-panel__actions {
  margin-top: 32rpx;
}
</style>
