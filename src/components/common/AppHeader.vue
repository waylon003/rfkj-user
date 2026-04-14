<template>
  <view class="app-header" :style="{ height: `${headerHeight}px` }">
    <view class="app-header__fixed" :style="{ height: `${headerHeight}px` }">
      <view
        class="app-header__bar"
        :style="{
          top: `${barTop}px`,
          minHeight: `${barHeight}px`
        }"
      >
      <view v-if="back" class="app-header__back" @click="goBack">‹</view>
      <view v-else class="app-header__back app-header__back--placeholder"></view>
      <view class="app-header__titles">
        <text class="app-header__title">{{ title }}</text>
        <text v-if="subtitle" class="app-header__subtitle">{{ subtitle }}</text>
      </view>
      <view class="app-header__extra">
        <slot name="extra"></slot>
      </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores'

interface Props {
  title: string
  subtitle?: string
  back?: boolean
}

withDefaults(defineProps<Props>(), {
  subtitle: '',
  back: false
})

const appStore = useAppStore()
const statusBarHeight = computed(() => appStore.statusBarHeight)
const barTop = computed(() => appStore.menuButtonTop)
const barHeight = computed(() => appStore.menuButtonHeight)
const headerHeight = computed(() => {
  const topGap = Math.max(appStore.menuButtonTop - statusBarHeight.value, 6)
  return statusBarHeight.value + topGap * 2 + appStore.menuButtonHeight
})

function goBack() {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.app-header {
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
}

.app-header__fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(180deg, $primary-dark 0%, $primary-light 100%);
  color: #fff;
  box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.1);
}

.app-header__bar {
  position: absolute;
  left: 0;
  right: 0;
  padding: 0 30rpx;
  display: flex;
  align-items: center;
}

.app-header__back {
  width: 56rpx;
  font-size: 48rpx;
  line-height: 1;
  text-align: left;

  &--placeholder {
    opacity: 0;
  }
}

.app-header__titles {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}

.app-header__title {
  font-size: $font-lg;
  font-weight: 700;
}

.app-header__subtitle {
  font-size: $font-xs;
  color: $text-light;
}

.app-header__extra {
  min-width: 56rpx;
  display: flex;
  justify-content: flex-end;
}
</style>
