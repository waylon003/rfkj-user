<template>
  <view
    class="bottom-action-bar"
    :class="{ 'bottom-action-bar--bordered': bordered }"
    :style="barStyle"
  >
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    bottomOffset?: string
    paddingX?: string
    paddingTop?: string
    paddingBottom?: string
    background?: string
    bordered?: boolean
  }>(),
  {
    bottomOffset: '0px',
    paddingX: '24rpx',
    paddingTop: '18rpx',
    paddingBottom: '18rpx',
    background: '#fff',
    bordered: true
  }
)

const barStyle = computed(() => ({
  bottom: props.bottomOffset,
  paddingLeft: props.paddingX,
  paddingRight: props.paddingX,
  paddingTop: props.paddingTop,
  paddingBottom: `calc(${props.paddingBottom} + env(safe-area-inset-bottom))`,
  background: props.background
}))
</script>

<style scoped lang="scss">
.bottom-action-bar {
  position: fixed;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bottom-action-bar--bordered {
  border-top: 2rpx solid #e3e8f0;
}
</style>
