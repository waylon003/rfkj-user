<template>
  <view class="popup-primary-button" @click="$emit('click')">
    {{ label }}
  </view>
</template>

<script setup lang="ts">
defineProps<{
  label: string
}>()

defineEmits<{
  (e: 'click'): void
}>()
</script>

<style scoped lang="scss">
.popup-primary-button {
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
