<template>
  <view class="custom-tabbar">
    <view class="custom-tabbar__placeholder" :style="{ height: `${placeholderHeight}px` }"></view>

    <view class="custom-tabbar__fixed">
      <t-tab-bar
        :value="modelValue"
        @change="handleTabChange"
        class="custom-tabbar__bar"
      >
        <t-tab-bar-item
          v-for="item in items"
          :key="item.value"
          :value="item.value"
          :icon="currentIcon(item)"
        >
          {{ item.text }}
        </t-tab-bar-item>
      </t-tab-bar>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores'

interface TabItem {
  value: string
  text: string
  path: string
  icon: string
  selectedIcon: string
}

const props = defineProps<{
  modelValue: string
}>()

const appStore = useAppStore()

const items: TabItem[] = [
  {
    value: 'home',
    text: '首页',
    path: '/pages/home/index',
    icon: '/static/demo-page/nav-home-inactive.png',
    selectedIcon: '/static/demo-page/nav-home.png'
  },
  {
    value: 'ranking',
    text: '排名',
    path: '/pages/ranking/index',
    icon: '/static/demo-page/nav-ranking.png',
    selectedIcon: '/static/demo-page/nav-ranking-active.png'
  },
  {
    value: 'activity',
    text: '活动',
    path: '/pages/activity/index',
    icon: '/static/demo-page/nav-activity.png',
    selectedIcon: '/static/demo-page/nav-activity-active.png'
  },
  {
    value: 'profile',
    text: '我的',
    path: '/pages/profile/index',
    icon: '/static/demo-page/nav-profile.png',
    selectedIcon: '/static/demo-page/nav-profile-active.png'
  }
]

const placeholderHeight = computed(() => 56 + appStore.safeAreaBottom)

function currentIcon(item: TabItem) {
  return {
    name: props.modelValue === item.value ? item.selectedIcon : item.icon,
    size: '60rpx'
  }
}

function handleTabChange(context: { value: string | number }) {
  const value = String(context.value)
  const target = items.find(item => item.value === value)
  if (!target) {
    return
  }

  const pages = getCurrentPages()
  const currentRoute = pages.length > 0 ? `/${pages[pages.length - 1].route}` : ''
  if (currentRoute === target.path) {
    return
  }

  uni.redirectTo({ url: target.path })
}
</script>

<style scoped lang="scss">
.custom-tabbar__placeholder {
  width: 100%;
}

.custom-tabbar__fixed {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.custom-tabbar__bar {
  z-index: 999;
}

:deep(.t-tab-bar) {
  z-index: 999 !important;
  --td-tab-bar-height: 104rpx;
}

:deep(.t-tab-bar-item__text--small) {
  font-size: 22rpx;
  line-height: 1.4;
}
</style>
