<template>
  <view class="page-layout">
    <slot name="header">
      <app-header v-if="title" :title="title" :subtitle="subtitle" :back="back">
        <template #extra>
          <slot name="header-extra"></slot>
        </template>
      </app-header>
    </slot>

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
import AppHeader from '@/components/common/AppHeader.vue'
import AuthDialog from '@/components/common/auth/AuthDialog.vue'
import CustomTabBar from '@/components/common/layout/CustomTabBar.vue'
import { useAppStore } from '@/stores'

withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    back?: boolean
    tabbar?: string
    showAuthDialog?: boolean
  }>(),
  {
    title: '',
    subtitle: '',
    back: false,
    tabbar: '',
    showAuthDialog: false
  }
)

const appStore = useAppStore()
</script>

<style scoped lang="scss">
.page-layout {
  min-height: 100vh;
  position: relative;
}
</style>
