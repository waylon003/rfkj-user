<template>
  <view class="balance-card">
    <view>
      <text class="balance-card__label">{{ label }}</text>
      <view class="balance-card__value-row">
        <text class="balance-card__value">{{ value }}</text>
        <text v-if="unit" class="balance-card__unit">{{ unit }}</text>
      </view>
    </view>
    <view v-if="tag" class="balance-card__tag" @click="$emit('click')">{{ tag }}</view>
    <view v-else class="balance-card__avatar"></view>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    value: string
    unit?: string
    tag?: string
  }>(),
  {
    unit: '',
    tag: ''
  }
)

defineEmits<{
  (e: 'click'): void
}>()
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.balance-card {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24rpx;
  border: 2rpx solid $border-light;
  border-radius: 28rpx;
  background: #fff;
}

.balance-card__label {
  display: block;
  font-size: 24rpx;
  color: $text-tertiary;
}

.balance-card__value-row {
  display: flex;
  align-items: baseline;
  margin-top: 12rpx;
}

.balance-card__value {
  font-size: 48rpx;
  font-weight: 700;
  color: $primary;
}

.balance-card__unit {
  margin-left: 8rpx;
  font-size: 28rpx;
  color: $primary;
}

.balance-card__avatar {
  width: 94rpx;
  height: 94rpx;
  border-radius: 50%;
  @include public-cover($public-demo-image-1);
}

.balance-card__tag {
  min-width: 124rpx;
  height: 42rpx;
  border-radius: 8rpx;
  background: $primary;
  text-align: center;
  line-height: 42rpx;
  font-size: 24rpx;
  color: #fff;
}
</style>
