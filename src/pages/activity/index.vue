<template>
  <view class="page-activity">
    <app-header title="活动" />

    <view class="activity-list">
      <view
        v-for="item in displayCards"
        :key="item.id"
        class="activity-card"
        @click="openDetail(item.id)"
      >
        <view class="activity-card__cover">
          <image class="activity-card__cover-image" :src="item.coverImage" mode="aspectFill" />
          <view
            class="activity-card__tag"
            :class="`activity-card__tag--${item.status}`"
          >
            {{ item.tagText }}
          </view>
        </view>
        <view class="activity-card__body">
          <text class="activity-card__title">{{ item.title }}</text>
          <view class="activity-card__meta">
            <view class="activity-card__meta-dot"></view>
            <text class="activity-card__meta-text">活动时间：{{ item.period }}</text>
            <view v-if="item.badgeCount" class="activity-card__badge">{{ item.badgeCount }}</view>
          </view>
        </view>
      </view>
    </view>

    <CustomTabBar model-value="activity" />
  </view>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import CustomTabBar from '@/components/common/layout/CustomTabBar.vue'
import {
  getActivityHubData,
  type ActivityHubData
} from '@/services/activity'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const pageData = reactive<ActivityHubData>({
  categories: [],
  cards: []
})
const currentStoreName = computed(() => userStore.selectedStoreName || '欢乐谷旗舰店')
const displayCards = computed(() =>
  pageData.cards.map(item => mapActivityByStore(item))
)

loadPageData()

async function loadPageData() {
  Object.assign(pageData, await getActivityHubData())
}

function openDetail(id: string) {
  uni.navigateTo({ url: `/pages/activity/detail?id=${id}` })
}

function mapActivityByStore(item: ActivityHubData['cards'][number]) {
  if (currentStoreName.value.includes('额企鹅驱蚊器')) {
    if (item.id === 'activity-1') {
      return {
        ...item,
        title: '额企鹅周末双倍积分赛',
        period: '2026.04.08-2026.04.30'
      }
    }
    if (item.id === 'activity-2') {
      return {
        ...item,
        title: '抓娃娃连胜挑战'
      }
    }
  }

  if (currentStoreName.value.includes('大大大大')) {
    if (item.id === 'activity-1') {
      return {
        ...item,
        title: '大大店会员冲分周',
        period: '2026.04.10-2026.05.05'
      }
    }
    if (item.id === 'activity-3') {
      return {
        ...item,
        title: '限定礼品返场活动'
      }
    }
  }

  return item
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.page-activity {
  min-height: 100vh;
  background: $page-bg;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 24rpx;
}

.activity-card {
  overflow: hidden;
  border: 2rpx solid $border-light;
  border-radius: 28rpx;
  background: #fff;
  min-height: 522rpx;
}

.activity-card__cover {
  position: relative;
  height: 360rpx;
  background: $surface-avatar;
}

.activity-card__cover-image {
  width: 100%;
  height: 100%;
}

.activity-card__tag {
  position: absolute;
  right: 16rpx;
  top: 16rpx;
  min-width: 124rpx;
  height: 42rpx;
  padding: 0 14rpx;
  border-radius: 8rpx;
  text-align: center;
  line-height: 42rpx;
  font-size: 24rpx;
  color: #fff;
}

.activity-card__tag--ongoing {
  background: $primary;
}

.activity-card__tag--upcoming {
  background: #f97316;
}

.activity-card__tag--ended {
  background: $text-tertiary;
}

.activity-card__body {
  padding: 30rpx 32rpx;
}

.activity-card__title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: $text-strong;
}

.activity-card__meta {
  display: flex;
  align-items: center;
  margin-top: 24rpx;
}

.activity-card__meta-dot {
  width: 12rpx;
  height: 12rpx;
  background: #d9d9d9;
}

.activity-card__meta-text {
  margin-left: 10rpx;
  font-size: 24rpx;
  color: $text-secondary;
}

.activity-card__badge {
  width: 48rpx;
  height: 48rpx;
  margin-left: 10rpx;
  border-radius: 50%;
  background: #ff1010;
  box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.2);
  text-align: center;
  line-height: 48rpx;
  font-size: 24rpx;
  font-weight: 700;
  color: #fff;
}
</style>
