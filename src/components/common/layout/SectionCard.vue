<template>
  <view class="section-card" :class="{ 'section-card--flush': flush }">
    <view v-if="title" class="section-card__head">
      <view class="section-card__head-left">
        <view class="section-card__accent" :class="accentClass"></view>
        <text class="section-card__title">{{ title }}</text>
      </view>
      <text v-if="meta" class="section-card__meta">{{ meta }}</text>
    </view>
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    meta?: string
    accent?: 'blue' | 'orange'
    flush?: boolean
  }>(),
  {
    title: '',
    meta: '',
    accent: 'blue',
    flush: false
  }
)

const accentClass = computed(() =>
  props.accent === 'orange' ? 'section-card__accent--orange' : ''
)
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.section-card {
  overflow: hidden;
  border: 2rpx solid $border-light;
  border-radius: 28rpx;
  background: #fff;
}

.section-card--flush {
  padding: 0;
}

.section-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 28rpx 22rpx;
}

.section-card__head-left {
  display: flex;
  align-items: center;
}

.section-card__accent {
  width: 4rpx;
  height: 24rpx;
  border-radius: 999rpx;
  background: $primary;
  box-shadow: 0 0 8rpx rgba(37, 141, 232, 0.5);
}

.section-card__accent--orange {
  background: #f97316;
  box-shadow: 0 0 8rpx rgba(249, 115, 22, 0.5);
}

.section-card__title {
  margin-left: 12rpx;
  font-size: 28rpx;
  color: $text-strong;
}

.section-card__meta {
  font-size: 24rpx;
  color: $text-tertiary;
}
</style>
