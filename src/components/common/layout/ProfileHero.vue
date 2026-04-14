<template>
  <view class="profile-hero" :class="{ 'profile-hero--tall': tall }">
    <view class="profile-hero__orb profile-hero__orb--left"></view>
    <view class="profile-hero__orb profile-hero__orb--right"></view>
    <text v-if="back" class="profile-hero__back" @click="goBack">‹</text>
    <text v-if="title" class="profile-hero__title">{{ title }}</text>

    <slot />
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    back?: boolean
    tall?: boolean
  }>(),
  {
    title: '',
    back: false,
    tall: false
  }
)

function goBack() {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.profile-hero {
  position: relative;
  height: 778rpx;
  background: linear-gradient(180deg, $primary-dark 0%, $primary-light 52%, $page-bg 100%);
  overflow: hidden;
}

.profile-hero--tall {
  height: 940rpx;
  background: linear-gradient(180deg, $primary-dark 0%, $primary-light 100%);
}

.profile-hero__orb {
  position: absolute;
  border-radius: 50%;
}

.profile-hero__orb--left {
  left: -116rpx;
  top: 158rpx;
  width: 204rpx;
  height: 204rpx;
  background: rgba(138, 207, 255, 0.46);
}

.profile-hero__orb--right {
  right: -72rpx;
  top: -69rpx;
  width: 356rpx;
  height: 356rpx;
  background: rgba(118, 180, 255, 0.32);
}

.profile-hero__title {
  position: absolute;
  left: 24rpx;
  top: 104rpx;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
}

.profile-hero__back {
  position: absolute;
  left: 24rpx;
  top: 98rpx;
  font-size: 48rpx;
  line-height: 1;
  color: #fff;
}
</style>
