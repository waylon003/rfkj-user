<template>
  <view class="top-tabs" :style="{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }">
    <view
      v-for="item in items"
      :key="item.value"
      class="top-tabs__item"
      :class="{ 'top-tabs__item--active': modelValue === item.value }"
      @click="$emit('update:modelValue', item.value)"
    >
      {{ item.label }}
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
  items: Array<{
    label: string
    value: string
  }>
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.top-tabs {
  display: grid;
  height: 104rpx;
  background: #fff;
}

.top-tabs__item {
  position: relative;
  text-align: center;
  line-height: 104rpx;
  font-size: 28rpx;
  color: $text-secondary;
}

.top-tabs__item--active {
  color: $primary;
}

.top-tabs__item--active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  height: 4rpx;
  width: 112rpx;
  border-radius: 999rpx;
  background: $primary;
  transform: translateX(-50%);
}
</style>
