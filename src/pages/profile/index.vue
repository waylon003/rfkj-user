<template>
  <view class="page-profile">
    <view class="my-hero">
      <view class="my-hero__glow my-hero__glow--left"></view>
      <view class="my-hero__glow my-hero__glow--right"></view>
      <text class="my-title">我的</text>
      <view class="my-identity">
        <view class="my-avatar"></view>
        <view class="my-identity__copy">
          <text class="my-identity__name">{{ isGuest ? '登录会员后享受更多权益' : displayName }}</text>
          <text class="my-identity__id">
            {{ isGuest ? '' : displayMemberId }}
          </text>
        </view>
      </view>

      <view class="my-quick-grid">
        <view class="my-quick-card" @click="handlePrimaryCardClick">
          <view class="my-quick-card__copy">
            <text class="my-quick-card__title">{{ isGuest ? '立即登录' : '待领取礼品' }}</text>
            <view v-if="isGuest" class="my-quick-card__subtitle">登录会员后享受更多权益</view>
            <view v-else class="my-quick-card__meta">
              <text class="my-quick-card__number">23</text>
              <text>件待领取</text>
            </view>
          </view>
          <text class="my-quick-card__arrow">›</text>
        </view>
        <view class="my-quick-card" @click="handleSecondaryCardClick">
          <view class="my-quick-card__copy">
            <text class="my-quick-card__title">{{ isGuest ? '选择门店' : '我的账单' }}</text>
            <text class="my-quick-card__subtitle">
              {{ isGuest ? '查看门店详情与门店导航' : '查看消费明细' }}
            </text>
          </view>
          <text class="my-quick-card__arrow">›</text>
        </view>
      </view>
    </view>

    <view class="menu-card">
      <view
        v-for="item in visibleMenus"
        :key="item.id"
        class="menu-card__row"
        @click="handleMenuClick(item)"
      >
        <view class="menu-card__icon-wrap">
          <text class="iconfont menu-card__icon" :class="item.iconClass"></text>
        </view>
        <text class="menu-card__label">{{ item.title }}</text>
        <text class="menu-card__arrow">›</text>
      </view>

      <view class="menu-card__footer">
        <text>{{ isGuest ? '' : '上次登录时间' }}</text>
        <text>{{ isGuest ? '' : displayLastLogin }}</text>
      </view>
    </view>

    <AuthDialog
      :visible="appStore.authDialogVisible"
      :scene="appStore.authDialogScene"
      @update:visible="appStore.setAuthDialogVisible"
    />

    <CustomTabBar model-value="profile" />
  </view>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import AuthDialog from '@/components/common/auth/AuthDialog.vue'
import CustomTabBar from '@/components/common/layout/CustomTabBar.vue'
import { getProfileCenterData, type ProfileCenterData } from '@/services/profile'
import { useAppStore, useUserStore } from '@/stores'
import { getAuthSceneForRoute, requireLogin } from '@/utils/auth'
import { handlePublicAction, type PublicAction } from '@/utils/public-actions'

const appStore = useAppStore()
const userStore = useUserStore()
const pageData = reactive<ProfileCenterData>({
  brandName: '',
  memberId: '',
  summaries: [],
  menus: [],
  lastLogin: ''
})

loadPageData()

async function loadPageData() {
  Object.assign(pageData, await getProfileCenterData())
}

const isGuest = computed(() => userStore.isGuest)
const displayName = computed(() => userStore.profile.nickname || pageData.brandName)
const displayMemberId = computed(() => userStore.profile.memberId || pageData.memberId)
const displayLastLogin = computed(() => userStore.lastLoginTime || pageData.lastLogin)
const visibleMenus = computed(() => {
  if (!isGuest.value) {
    return pageData.menus
  }

  return [
    {
      id: 'store',
      title: '选择门店',
      iconClass: 'icon-ic_mod_marketing',
      route: '',
      action: 'select-store' as PublicAction
    },
    {
      id: 'feedback',
      title: '帮助反馈',
      iconClass: 'icon-ic_mem_gift_service',
      route: '',
      action: 'feedback' as PublicAction
    },
    {
      id: 'service',
      title: '客服电话',
      iconClass: 'icon-ic_contact_tel',
      route: '',
      action: 'service' as PublicAction
    }
  ]
})

function navigate(url: string) {
  uni.navigateTo({ url })
}

function handlePrimaryCardClick() {
  if (isGuest.value) {
    appStore.openAuthDialog('generic')
    return
  }

  navigate('/pages/profile/gifts')
}

function handleSecondaryCardClick() {
  if (isGuest.value) {
    handlePublicAction('select-store')
    return
  }

  navigate('/pages/profile/bill')
}

function handleMenuClick(item: { id: string; route: string; action?: PublicAction }) {
  if (isGuest.value) {
    if (item.action) {
      handlePublicAction(item.action)
      return
    }
  }

  const scene = getAuthSceneForRoute(item.route)
  if (isGuest.value && scene) {
    requireLogin(scene, () => navigate(item.route))
    return
  }

  navigate(item.route)
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.page-profile {
  min-height: 100vh;
  background: $page-bg;
  position: relative;
}

.my-hero {
  position: relative;
  min-height: 506rpx;
  padding: 104rpx 24rpx 0;
  overflow: hidden;
  background: linear-gradient(178.95deg, $primary-dark 15%, $primary-light 50%, $page-bg 85%);
}

.my-hero__glow {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
}

.my-hero__glow--left {
  left: -104rpx;
  top: 168rpx;
  width: 192rpx;
  height: 192rpx;
}

.my-hero__glow--right {
  right: -96rpx;
  top: -112rpx;
  width: 320rpx;
  height: 320rpx;
}

.my-title {
  position: relative;
  z-index: 1;
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  line-height: 56rpx;
}

.my-identity {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 32rpx;
  margin-top: 24rpx;
}

.my-avatar {
  width: 120rpx;
  height: 120rpx;
  flex: 0 0 auto;
  border: 4rpx solid #fff;
  border-radius: 50%;
  @include public-cover($public-demo-image-2);
}

.my-identity__copy {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  min-width: 0;
}

.my-identity__name {
  font-size: 40rpx;
  font-weight: 700;
  color: #fff;
  line-height: 56rpx;
}

.my-identity__id {
  font-size: 24rpx;
  color: rgba(239, 246, 255, 0.95);
  line-height: 36rpx;
}

.my-quick-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 26rpx;
  margin-top: 48rpx;
}

.my-quick-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 154rpx;
  padding: 30rpx 28rpx 30rpx 32rpx;
  border: 2rpx solid $border-light;
  border-radius: 28rpx;
  background: #fff;
}

.my-quick-card__copy {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  min-width: 0;
}

.my-quick-card__title {
  font-size: 28rpx;
  color: $text-strong;
  line-height: 40rpx;
}

.my-quick-card__meta,
.my-quick-card__subtitle {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
  font-size: 24rpx;
  color: $text-tertiary;
  line-height: 36rpx;
}

.my-quick-card__number {
  font-size: 28rpx;
  font-weight: 700;
  color: #f97316;
}

.my-quick-card__arrow {
  flex: 0 0 auto;
  font-size: 36rpx;
  color: #c7d2e2;
}

.menu-card {
  position: relative;
  z-index: 2;
  border-radius: 28rpx;
  border: 2rpx solid $border-light;
  background: #fff;
}

.menu-card {
  margin: 24rpx 24rpx 0;
  overflow: hidden;
}

.menu-card__row {
  display: flex;
  align-items: center;
  height: 116rpx;
  padding: 0 28rpx;
  border-top: 2rpx solid #f6f6f6;
}

.menu-card__row:first-of-type {
  border-top: none;
}

.menu-card__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 68rpx;
  height: 68rpx;
  border-radius: 12rpx;
  background: $primary-soft;
}

.menu-card__icon {
  font-size: 36rpx;
  color: $primary;
}

.menu-card__label {
  margin-left: 24rpx;
  font-size: 28rpx;
  color: #314158;
}

.menu-card__arrow {
  margin-left: auto;
  font-size: 32rpx;
  color: #c9d2e0;
}

.menu-card__footer {
  display: flex;
  justify-content: space-between;
  padding: 24rpx 28rpx 26rpx;
  border-top: 2rpx solid #f6f6f6;
  font-size: 24rpx;
  color: $text-tertiary;
}
</style>
