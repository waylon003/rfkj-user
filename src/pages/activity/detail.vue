<template>
  <view class="activity-detail">
    <app-header title="活动详情" :back="true" />

    <view class="activity-detail__content">
      <view class="detail-card">
        <view class="detail-card__cover">
          <image class="detail-card__cover-image" :src="detail.coverImage" mode="aspectFill" />
          <view class="detail-card__countdown">
            <view class="detail-card__countdown-dot"></view>
            {{ countdownText }}
          </view>
        </view>
        <view class="detail-card__body">
          <text class="detail-card__title">{{ displayDetail.title }}</text>
          <text class="detail-card__period">{{ displayDetail.period }}</text>
          <text
            v-for="line in displayDetail.description"
            :key="line"
            class="detail-card__desc"
          >
            {{ line }}
          </text>
          <text class="detail-card__note">{{ displayDetail.note }}</text>
        </view>
      </view>

      <bottom-action-bar class="detail-footer" padding-x="32rpx" padding-top="24rpx" padding-bottom="24rpx">
        <text class="detail-footer__link" :class="{ 'detail-footer__link--disabled': !detail.prevId }" @click="goPrev">上一个活动</text>
        <view class="detail-footer__button" @click="goBack">返回列表</view>
        <text class="detail-footer__link detail-footer__link--primary" :class="{ 'detail-footer__link--disabled': !detail.nextId }" @click="goNext">下一个活动</text>
      </bottom-action-bar>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import AppHeader from '@/components/common/AppHeader.vue'
import BottomActionBar from '@/components/common/layout/BottomActionBar.vue'
import { getActivityDetailData, type ActivityDetailData } from '@/services/activity'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const detail = reactive<ActivityDetailData>({
  id: '',
  title: '',
  period: '',
  endAt: '',
  coverImage: '',
  prevId: undefined,
  nextId: undefined,
  description: [],
  note: '',
  rankings: []
})
const now = ref(Date.now())
const countdownText = computed(() => getCountdownText(detail.endAt, now.value))
const currentStoreName = computed(() => userStore.selectedStoreName || '欢乐谷旗舰店')
const displayDetail = computed(() => mapDetailByStore(detail))
let currentId = 'activity-1'
let countdownTimer: ReturnType<typeof setInterval> | undefined

onLoad((query) => {
  currentId = query && typeof query.id === 'string' ? query.id : 'activity-1'
  void loadPageData(currentId)
  countdownTimer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onUnload(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})

async function loadPageData(id: string) {
  Object.assign(detail, await getActivityDetailData(id))
}

function goBack() {
  uni.navigateBack()
}

function goPrev() {
  if (!detail.prevId) {
    return
  }
  currentId = detail.prevId
  uni.redirectTo({ url: `/pages/activity/detail?id=${detail.prevId}` })
}

function goNext() {
  if (!detail.nextId) {
    return
  }
  currentId = detail.nextId
  uni.redirectTo({ url: `/pages/activity/detail?id=${detail.nextId}` })
}

function getCountdownText(endAt: string, currentTime: number) {
  if (!endAt) {
    return '距离结束 00:00:00'
  }

  const diff = new Date(endAt).getTime() - currentTime
  if (diff <= 0) {
    return '距离结束 00:00:00'
  }

  const totalSeconds = Math.floor(diff / 1000)
  const totalDays = Math.floor(totalSeconds / 86400)
  if (totalDays >= 30) {
    const months = Math.floor(totalDays / 30)
    const days = totalDays % 30
    return `距离结束 ${months}个月${days}天`
  }

  if (totalDays >= 1) {
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    return `距离结束 ${totalDays}天${hours}小时`
  }

  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `距离结束 ${hours}:${minutes}:${seconds}`
}

function mapDetailByStore(source: ActivityDetailData) {
  if (currentStoreName.value.includes('额企鹅驱蚊器')) {
    return {
      ...source,
      title: `${source.title} · 额企鹅店`,
      description: [
        '当前活动为额企鹅驱蚊器门店专属积分活动，指定机台参与可获得额外积分。',
        '请以门店实际公告和结算结果为准。'
      ],
      note: '注：额企鹅门店活动数据每小时更新一次。'
    }
  }

  if (currentStoreName.value.includes('大大大大')) {
    return {
      ...source,
      title: `${source.title} · 大大店`,
      description: [
        '当前活动为大大店会员专场，部分机台和礼品兑换规则与其他门店不同。',
        '如遇节假日活动调整，请以门店前台公告为准。'
      ],
      note: '注：大大店活动规则可能按周更新，请留意门店通知。'
    }
  }

  return source
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.activity-detail {
  min-height: 100vh;
  padding-bottom: calc(176rpx + env(safe-area-inset-bottom));
  background: $page-bg;
}

.activity-detail__content {
  padding: 24rpx 24rpx 0;
}

.detail-card {
  overflow: hidden;
  border: 2rpx solid $border-light;
  border-radius: 28rpx;
  background: #fff;
}

.detail-card__cover {
  position: relative;
  height: 360rpx;
}

.detail-card__cover-image {
  width: 100%;
  height: 100%;
}

.detail-card__countdown {
  position: absolute;
  right: 24rpx;
  top: 24rpx;
  display: flex;
  align-items: center;
  padding: 0 16rpx;
  height: 42rpx;
  border-radius: 20rpx;
  border: 2rpx solid #ffedd6;
  background: #fff7ed;
  font-size: 24rpx;
  color: #f97316;
}

.detail-card__countdown-dot {
  width: 12rpx;
  height: 12rpx;
  margin-right: 8rpx;
  background: #d9d9d9;
}

.detail-card__body {
  padding: 28rpx 30rpx;
}

.detail-card__title {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: $text-strong;
}

.detail-card__period {
  display: inline-block;
  margin-top: 18rpx;
  padding: 10rpx 18rpx;
  border-radius: 20rpx;
  background: $primary-soft;
  font-size: 24rpx;
  color: $primary;
}

.detail-card__desc {
  display: block;
  margin-top: 20rpx;
  font-size: 28rpx;
  line-height: 1.45;
  color: $text-primary;
}

.detail-card__note {
  display: block;
  margin-top: 18rpx;
  font-size: 24rpx;
  color: $text-secondary;
}

.detail-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: auto;
}

.detail-footer__link {
  font-size: 24rpx;
  color: $text-tertiary;
}

.detail-footer__link--primary {
  color: $primary;
}

.detail-footer__link--disabled {
  color: $text-tertiary;
  opacity: 0.45;
}

.detail-footer__button {
  width: 136rpx;
  height: 56rpx;
  border-radius: 20rpx;
  background: $surface-avatar;
  text-align: center;
  line-height: 56rpx;
  font-size: 28rpx;
  color: $text-strong;
}
</style>
