<template>
  <PageLayout class="page-home" tabbar="home" :show-auth-dialog="true">
    <template #header>
    <view class="home-topbar" :style="{ height: `${headerHeight}px` }">
      <view class="home-topbar__fixed" :style="{ height: `${headerHeight}px` }">
        <view
          class="home-topbar__bar"
          :style="{
            top: `${barTop}px`,
            minHeight: `${barHeight}px`
          }"
        >
          <view class="home-store" @click="showStorePicker">
            <TIcon name="location" size="28rpx" color="#ffffff" />
            <text class="home-store__name">{{ currentStore }}</text>
            <TIcon name="chevron-down" size="24rpx" color="#ffffff" />
          </view>
          <text class="home-title">首页</text>
          <view class="home-topbar__placeholder" :style="{ minWidth: `${menuButtonWidth}px` }"></view>
        </view>
      </view>
    </view>
    </template>

    <view class="page-home__content">
      <view class="banner-card">
        <t-swiper
          class="banner-card__swiper"
          :current="0"
          :autoplay="false"
          :duration="300"
          :interval="4000"
          :navigation="{ type: 'dots-bar' }"
          :list="bannerList"
        />
      </view>

      <view class="profile-card">
        <view class="profile-card__head">
          <view class="profile-card__avatar" :style="{ backgroundImage: userStore.profile.avatar ? `url(${userStore.profile.avatar})` : '' }"></view>
          <view class="profile-card__meta">
            <text class="profile-card__name">{{ displayUser.nickname }}</text>
            <text class="profile-card__id">{{ displayUser.memberId }}</text>
          </view>
          <view class="profile-card__actions">
            <view class="profile-card__action profile-card__action--outline" @click="handleScanEntry">
              <TIcon name="scan" size="26rpx" color="#155dfc" />
              <text>扫码</text>
            </view>
            <view class="profile-card__action profile-card__action--primary" @click="handleMemberCodeEntry">
              <TIcon name="qrcode" size="26rpx" color="#ffffff" />
              <text>会员码</text>
            </view>
          </view>
        </view>

        <view class="profile-card__divider"></view>

        <view class="profile-card__stats">
          <view v-for="stat in displayStats" :key="stat.label" class="profile-card__stat">
            <text class="profile-card__stat-label">{{ stat.label }}</text>
            <text class="profile-card__stat-value">{{ stat.value }}</text>
          </view>
        </view>
      </view>

      <view class="shortcut-card">
        <view class="shortcut-card__actions">
          <view
            v-for="action in actionItems"
            :key="action.id"
            class="shortcut-card__item"
            @click="navigate(action.route)"
          >
            <image class="shortcut-card__icon" :src="action.icon" mode="aspectFit" />
            <text class="shortcut-card__label">{{ action.label }}</text>
          </view>
        </view>
      </view>
    </view>

    <QrCodePopup
      :visible="memberQrVisible"
      title="会员二维码"
      :value="memberQrValue"
      :tips="[`当前门店：${currentStore}`, `${qrRefreshCountdown}s 后自动刷新`]"
      @update:visible="memberQrVisible = $event"
    />
  </PageLayout>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onHide, onShow, onUnload } from '@dcloudio/uni-app'
import TIcon from 'tdesign-uniapp/icon/icon.vue'
import PageLayout from '@/components/common/layout/PageLayout.vue'
import QrCodePopup from '@/components/common/popup/QrCodePopup.vue'
import { getHomePageData, type HomePageData } from '@/services/home'
import { useAppStore, useUserStore } from '@/stores'
import { getAuthSceneForRoute, requireLoginForRoute } from '@/utils/auth'
import type { AuthScene } from '@/services/auth'

const STORE_KEY = 'rfkj_current_store'
const appStore = useAppStore()
const userStore = useUserStore()
const qrRefreshCountdown = ref(60)
const qrRefreshSeed = ref(Date.now())
const memberQrVisible = ref(false)
let qrRefreshTimer: ReturnType<typeof setInterval> | undefined
const pageData = reactive<HomePageData>({
  banners: [],
  posterQrValue: '',
  user: {
    nickname: '',
    memberId: '',
    scanLabel: ''
  },
  stats: [],
  quickActions: [],
  modules: [],
  ticker: []
})

const actionIconMap: Record<string, string> = {
  tickets: '/static/demo-page/quick-action-ticket.svg',
  gift: '/static/demo-page/quick-action-gift.svg',
  coin: '/static/demo-page/quick-action-buy.svg',
  points: '/static/demo-page/quick-action-points.svg'
}

const actionItems = computed(() =>
  pageData.quickActions.map(item => ({
    id: item.id,
    label: item.title,
    route: item.route,
    icon: actionIconMap[item.id] || '/static/demo-page/quick-action-buy.svg',
    locked: Boolean(getAuthSceneForRoute(item.route))
  }))
)
const isGuest = computed(() => userStore.isGuest)
const currentStore = computed(() => userStore.selectedStoreName || '未注册门店')
const barTop = computed(() => appStore.menuButtonTop)
const barHeight = computed(() => appStore.menuButtonHeight)
const menuButtonWidth = computed(() => appStore.menuButtonWidth)
const headerHeight = computed(() => {
  const topGap = Math.max(appStore.menuButtonTop - appStore.statusBarHeight, 6)
  return appStore.statusBarHeight + topGap * 2 + appStore.menuButtonHeight
})
const displayUser = computed(() =>
  isGuest.value
    ? {
        nickname: '登录会员后享受更多权益',
        memberId: ''
      }
    : {
        nickname: userStore.profile.nickname || pageData.user.nickname,
        memberId: userStore.profile.memberId || pageData.user.memberId
      }
)
const displayStats = computed(() =>
  pageData.stats.map(stat => {
    if (isGuest.value) {
      return { ...stat, value: '--' }
    }

    if (stat.label === '游戏币') {
      return { ...stat, value: formatCount(userStore.profile.coin, stat.value) }
    }

    if (stat.label === '彩票') {
      return { ...stat, value: formatCount(userStore.profile.ticket, stat.value) }
    }

    if (stat.label === '剩余积分') {
      return { ...stat, value: formatCount(userStore.profile.integral, stat.value) }
    }

    return stat
  })
)
const memberQrValue = computed(() => {
  if (isGuest.value) {
    return ''
  }

  const memberId = userStore.profile.memberId || pageData.user.memberId
  const storeName = currentStore.value
  return `https://rfkj.example.com/member-code?memberId=${encodeURIComponent(memberId)}&store=${encodeURIComponent(storeName)}&refresh=${qrRefreshSeed.value}`
})

const bannerList = computed(() =>
  pageData.banners.map(item => {
    const banner = mapBannerByStore(item)
    return {
      value: banner.image,
      ariaLabel: `${banner.title}${banner.subtitle ? `，${banner.subtitle}` : ''}`
    }
  })
)
void loadPageData().catch(showError)
onShow(() => {
  const cachedStore = uni.getStorageSync(STORE_KEY)
  if (!userStore.selectedStoreName && userStore.selectedStoreId && cachedStore) {
    userStore.setSelectedStore({ id: userStore.selectedStoreId, name: cachedStore })
  }
  void loadPageData().catch(showError)
  startQrRefreshTimer()
})
onHide(() => {
  stopQrRefreshTimer()
})
onUnload(() => {
  stopQrRefreshTimer()
})

async function loadPageData() {
  Object.assign(pageData, await getHomePageData())
}

function navigate(url: string) {
  const scene = getAuthSceneForRoute(url)
  if (scene) {
    requireLoginForRoute(scene, url, () => openUrl(url))
    return
  }

  openUrl(url)
}

function openUrl(url: string) {
  if (
    url === '/pages/activity/index' ||
    url === '/pages/profile/index' ||
    url === '/pages/ranking/index' ||
    url === '/pages/home/index'
  ) {
    uni.redirectTo({ url })
    return
  }

  uni.navigateTo({ url })
}

function showStorePicker() {
  if (isGuest.value) {
    appStore.openAuthDialog('generic')
    return
  }

  uni.navigateTo({ url: '/pages/home/store-select' })
}

function handleScanEntry() {
  if (isGuest.value) {
    appStore.openAuthDialog('generic')
    return
  }

  handleScan()
}

function handleMemberCodeEntry() {
  if (isGuest.value) {
    appStore.openAuthDialog('member-code')
    return
  }

  memberQrVisible.value = true
}

function openLogin(scene: AuthScene) {
  appStore.openAuthDialog(scene)
}

function handleScan() {
  if (isGuest.value) {
    appStore.openAuthDialog('member-code')
    return
  }

  uni.scanCode({
    onlyFromCamera: false,
    scanType: ['qrCode'],
    success(res) {
      uni.showToast({
        title: res.result ? `扫码成功: ${res.result}` : '扫码成功',
        icon: 'none'
      })
    },
    fail() {
      uni.showToast({
        title: '已取消扫码',
        icon: 'none'
      })
    }
  })
}

function mapBannerByStore(item: HomePageData['banners'][number]) {
  if (currentStore.value.includes('额企鹅驱蚊器')) {
    if (item.id === 'banner-1') {
      return {
        ...item,
        title: '额企鹅店首充礼遇',
        subtitle: '指定机台购币享受双倍积分'
      }
    }
    if (item.id === 'banner-2') {
      return {
        ...item,
        title: '抓娃娃周边限时兑换',
        subtitle: '额企鹅门店热门礼品优先供应'
      }
    }
  }

  if (currentStore.value.includes('大大大大')) {
    if (item.id === 'banner-1') {
      return {
        ...item,
        title: '大大店会员专享购币',
        subtitle: '新会员开卡即送体验券'
      }
    }
    if (item.id === 'banner-3') {
      return {
        ...item,
        title: '大大店周末活动持续更新',
        subtitle: '当前门店专属活动和排行榜同步展示'
      }
    }
  }

  return item
}

function formatCount(value: number, fallback: string) {
  if (!Number.isFinite(value)) {
    return fallback
  }

  return value.toLocaleString('zh-CN')
}

function startQrRefreshTimer() {
  stopQrRefreshTimer()
  qrRefreshCountdown.value = 60
  qrRefreshTimer = setInterval(() => {
    if (isGuest.value) {
      qrRefreshCountdown.value = 60
      return
    }

    if (qrRefreshCountdown.value <= 1) {
      qrRefreshSeed.value = Date.now()
      qrRefreshCountdown.value = 60
      return
    }

    qrRefreshCountdown.value -= 1
  }, 1000)
}

function stopQrRefreshTimer() {
  if (qrRefreshTimer) {
    clearInterval(qrRefreshTimer)
    qrRefreshTimer = undefined
  }
}

function showError(error: unknown) {
  const message = error instanceof Error ? error.message : '首页数据加载失败'
  uni.showToast({
    title: message,
    icon: 'none'
  })
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.page-home {
  min-height: 100vh;
  background: $page-bg;
}

.home-topbar {
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
}

.home-topbar__fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(180deg, $primary-dark 0%, $primary-light 100%);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.home-topbar__bar {
  position: absolute;
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16rpx;
  padding: 0 24rpx;
}

.home-store {
  display: inline-flex;
  align-items: center;
  min-height: 100%;
  min-width: 0;
  color: #fff;
}

.home-store__name {
  max-width: 180rpx;
  margin: 0 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 28rpx;
  font-weight: 700;
  line-height: 40rpx;
}

.home-title {
  justify-self: center;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  line-height: 56rpx;
}

.home-topbar__placeholder {
  height: 100%;
}

.page-home__content {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 24rpx 24rpx 36rpx;
}

.banner-card {
  position: relative;
  height: 320rpx;
  border: 2rpx solid $border-light;
  border-radius: 28rpx;
  background: #fff;
  overflow: hidden;
}

:deep(.t-swiper) {
  width: 100%;
  height: 100%;
}

:deep(.t-swiper__content-item) {
  background: linear-gradient(135deg, #4aa8ff 0%, #2b6dff 100%);
}

:deep(.t-swiper__pagination) {
  bottom: 12rpx;
}

:deep(.t-swiper__pagination-item) {
  width: 10rpx;
  height: 10rpx;
  margin: 0 4rpx;
  background: rgba(255, 255, 255, 0.92);
  opacity: 1;
}

:deep(.t-swiper__pagination-item--active) {
  width: 10rpx;
}

.profile-card {
  padding: 24rpx 28rpx 28rpx;
  background: $card-bg;
  border: 2rpx solid $border-light;
  border-radius: 28rpx;
}

.profile-card__head {
  display: flex;
  align-items: center;
  gap: 12rpx;
  min-height: 82rpx;
}

.profile-card__avatar {
  width: 82rpx;
  height: 82rpx;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #eef4ff;
  @include public-cover($public-demo-image-2);
}

.profile-card__meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.profile-card__name {
  display: block;
  font-size: 26rpx;
  font-weight: 700;
  color: $text-strong;
  line-height: 1.2;
}

.profile-card__id {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: $text-tertiary;
  line-height: 1;
}

.profile-card__actions {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.profile-card__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  min-width: 94rpx;
  height: 54rpx;
  padding: 0 14rpx;
  border-radius: 10rpx;
  text-align: center;
  line-height: 50rpx;
  font-size: 22rpx;
  font-weight: 600;
}

.profile-card__action--outline {
  border: 2rpx solid #6badff;
  color: $primary;
  background: transparent;
}

.profile-card__action--primary {
  border: 2rpx solid $primary;
  color: #fff;
  background: $primary;
}

.profile-card__divider {
  height: 2rpx;
  margin-top: 28rpx;
  background: $border-light;
}

.profile-card__stats {
  display: flex;
  justify-content: space-between;
  padding-top: 24rpx;
}

.profile-card__stat {
  flex: 1;
  position: relative;
  text-align: center;
}

.profile-card__stat-label {
  display: block;
  font-size: 24rpx;
  color: $text-secondary;
  line-height: 1;
}

.profile-card__stat-value {
  display: block;
  margin-top: 20rpx;
  font-size: 42rpx;
  font-weight: 700;
  color: $text-primary;
  line-height: 1;
}

.profile-card__stat + .profile-card__stat::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8rpx;
  width: 2rpx;
  height: 72rpx;
  background: $border-light;
}

.shortcut-card {
  margin: 0;
  padding: 24rpx;
  background: $card-bg;
  border: 2rpx solid $border-light;
  border-radius: 28rpx;
}

.shortcut-card__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.shortcut-card__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14rpx;
  min-height: 136rpx;
  justify-content: center;
  border-radius: 20rpx;
  background: #f6f8fc;
}

.shortcut-card__icon {
  width: 48rpx;
  height: 48rpx;
}

.shortcut-card__label {
  font-size: 24rpx;
  color: $text-secondary;
  line-height: 1;
}
</style>
