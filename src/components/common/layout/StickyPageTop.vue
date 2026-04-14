<template>
  <view class="sticky-page-top" :style="{ marginTop: `-${overlapPx}px` }">
    <view
      class="sticky-page-top__fixed"
      :style="{
        top: `${topOffset}px`,
        height: `${heightPx}px`,
        zIndex: `${zIndex}`,
        background
      }"
    >
      <slot />
    </view>
    <view class="sticky-page-top__placeholder" :style="{ height: `${heightPx}px` }"></view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores'

const props = withDefaults(
  defineProps<{
    heightRpx: number
    overlapRpx?: number
    zIndex?: number
    background?: string
  }>(),
  {
    overlapRpx: 40,
    zIndex: 90,
    background: '#ffffff'
  }
)

const appStore = useAppStore()
const headerBodyHeightPx = computed(() => uni.upx2px(104))
const topOffset = computed(() => appStore.statusBarHeight + headerBodyHeightPx.value)
const heightPx = computed(() => uni.upx2px(props.heightRpx))
const overlapPx = computed(() => uni.upx2px(props.overlapRpx))
</script>

<style scoped lang="scss">
.sticky-page-top {
  position: relative;
}

.sticky-page-top__fixed {
  position: fixed;
  left: 0;
  right: 0;
}

.sticky-page-top__placeholder {
  width: 100%;
}
</style>
