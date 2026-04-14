<template>
  <view class="page-layout">
    <slot name="header">
      <app-header v-if="title" :title="title" :subtitle="subtitle" :back="back">
        <template #extra>
          <slot name="header-extra"></slot>
        </template>
      </app-header>
    </slot>

    <view
      v-if="hasFixedHeader"
      class="page-layout__fixed-header"
      :style="{
        top: `${headerHeight}px`,
        zIndex: `${fixedHeaderZIndex}`,
        background: fixedHeaderBackground
      }"
    >
      <slot name="fixed-header"></slot>
    </view>
    <view
      v-if="hasFixedHeader"
      class="page-layout__fixed-header-placeholder"
      :style="{ height: `${fixedHeaderHeightPx}px` }"
    ></view>

    <slot name="sticky"></slot>
    <slot></slot>
    <slot name="overlay"></slot>

    <AuthDialog
      v-if="showAuthDialog"
      :visible="appStore.authDialogVisible"
      :scene="appStore.authDialogScene"
      @update:visible="appStore.setAuthDialogVisible"
    />

    <CustomTabBar v-if="tabbar" :model-value="tabbar" />
  </view>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import AuthDialog from '@/components/common/auth/AuthDialog.vue'
import CustomTabBar from '@/components/common/layout/CustomTabBar.vue'
import { useAppStore } from '@/stores'

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    back?: boolean
    tabbar?: string
    showAuthDialog?: boolean
    fixedHeaderHeight?: number
    fixedHeaderBackground?: string
    fixedHeaderZIndex?: number
  }>(),
  {
    title: '',
    subtitle: '',
    back: false,
    tabbar: '',
    showAuthDialog: false,
    fixedHeaderHeight: 0,
    fixedHeaderBackground: '#ffffff',
    fixedHeaderZIndex: 90
  }
)

const slots = useSlots()
const appStore = useAppStore()
const hasFixedHeader = computed(() => Boolean(slots['fixed-header']) && props.fixedHeaderHeight > 0)
const fixedHeaderHeightPx = computed(() => uni.upx2px(props.fixedHeaderHeight))
const headerHeight = computed(() => {
  const topGap = Math.max(appStore.menuButtonTop - appStore.statusBarHeight, 6)
  return appStore.statusBarHeight + topGap * 2 + appStore.menuButtonHeight
})
</script>

<style scoped lang="scss">
.page-layout {
  min-height: 100vh;
  position: relative;
}

.page-layout__fixed-header {
  position: fixed;
  left: 0;
  right: 0;
}

.page-layout__fixed-header-placeholder {
  width: 100%;
}
</style>
