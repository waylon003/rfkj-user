<template>
  <view class="coupon-select">
    <app-header title="选择优惠卷" :back="true" />

    <view class="coupon-section">
      <view class="coupon-section__head">
        <view class="coupon-section__head-left">
          <view class="coupon-section__accent"></view>
          <text class="coupon-section__title">{{ pageData.availableSection.title }}</text>
        </view>
        <view
          class="coupon-section__toggle"
          :class="{ 'coupon-section__toggle--disabled': pageData.available.length <= collapseThreshold }"
          @click="toggleAvailable"
        >
          <text class="coupon-section__count">{{ availableToggleText }}</text>
          <text
            class="iconfont coupon-section__arrow icon-ic_arrow_down1"
            :class="{ 'coupon-section__arrow--expanded': availableExpanded }"
          ></text>
        </view>
      </view>

      <view
        class="coupon-section__list"
        :class="{ 'coupon-section__list--expanded': availableExpanded || pageData.available.length <= collapseThreshold }"
      >
        <view
          v-for="item in visibleAvailable"
          :key="item.id"
          class="coupon-card"
          :class="{ 'coupon-card--selected': item.selected }"
          @click="handleSelectCoupon(item.id)"
        >
          <view class="coupon-card__left" :class="{ 'coupon-card__left--disabled': item.disabled }">
            <text class="coupon-card__currency">¥</text>
            <text class="coupon-card__amount">{{ item.amount }}</text>
          </view>
          <view class="coupon-card__right">
            <view v-if="item.recommended" class="coupon-card__tag">推荐</view>
            <text class="coupon-card__title">{{ item.title }}</text>
            <text class="coupon-card__condition">{{ item.condition }}</text>
            <text class="coupon-card__expiry">有效期： {{ item.expiry }}</text>
            <view v-if="item.selected" class="coupon-card__check">
              <text class="iconfont icon-ic_action_confirm"></text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="coupon-section coupon-section--secondary">
      <view class="coupon-section__head">
        <view class="coupon-section__head-left">
          <view class="coupon-section__accent coupon-section__accent--orange"></view>
          <text class="coupon-section__title">{{ pageData.unavailableSection.title }}</text>
        </view>
        <view
          class="coupon-section__toggle"
          :class="{ 'coupon-section__toggle--disabled': pageData.unavailable.length <= collapseThreshold }"
          @click="toggleUnavailable"
        >
          <text class="coupon-section__count">{{ unavailableToggleText }}</text>
          <text
            class="iconfont coupon-section__arrow icon-ic_arrow_down1"
            :class="{ 'coupon-section__arrow--expanded': unavailableExpanded }"
          ></text>
        </view>
      </view>

      <view
        class="coupon-section__list"
        :class="{ 'coupon-section__list--expanded': unavailableExpanded || pageData.unavailable.length <= collapseThreshold }"
      >
        <view
          v-for="item in visibleUnavailable"
          :key="item.id"
          class="coupon-card coupon-card--disabled"
        >
          <view class="coupon-card__left coupon-card__left--disabled">
            <text class="coupon-card__currency">¥</text>
            <text class="coupon-card__amount">{{ item.amount }}</text>
          </view>
          <view class="coupon-card__right">
            <text class="coupon-card__title coupon-card__title--disabled">{{ item.title }}</text>
            <text class="coupon-card__condition">{{ item.condition }}</text>
            <text class="coupon-card__expiry">有效期： {{ item.expiry }}</text>
          </view>
        </view>
      </view>
    </view>

    <bottom-action-bar class="coupon-select__footer" padding-top="16rpx" padding-bottom="16rpx">
      <view class="coupon-select__button" @click="handleConfirm">确定使用</view>
    </bottom-action-bar>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import BottomActionBar from '@/components/common/layout/BottomActionBar.vue'
import {
  confirmCouponSelection,
  getCouponSelectData,
  selectCoupon,
  type CouponSelectData
} from '@/services/purchase'

const pageData = reactive<CouponSelectData>({
  availableSection: {
    title: '',
    countLabel: '',
    accent: 'blue'
  },
  unavailableSection: {
    title: '',
    countLabel: '',
    accent: 'orange'
  },
  available: [],
  unavailable: []
})
const collapseThreshold = 2
const availableExpanded = ref(false)
const unavailableExpanded = ref(false)

const visibleAvailable = computed(() =>
  availableExpanded.value || pageData.available.length <= collapseThreshold
    ? pageData.available
    : pageData.available.slice(0, collapseThreshold)
)

const visibleUnavailable = computed(() =>
  unavailableExpanded.value || pageData.unavailable.length <= collapseThreshold
    ? pageData.unavailable
    : pageData.unavailable.slice(0, collapseThreshold)
)

const availableToggleText = computed(() =>
  `${availableExpanded.value ? '收起' : '展开'} (${pageData.available.length}张)`
)

const unavailableToggleText = computed(() =>
  `${unavailableExpanded.value ? '收起' : '展开'} (${pageData.unavailable.length}张)`
)

loadPageData()

async function loadPageData() {
  Object.assign(pageData, await getCouponSelectData())
}

async function handleSelectCoupon(id: string) {
  Object.assign(pageData, await selectCoupon(id))
}

async function handleConfirm() {
  await confirmCouponSelection()
  uni.navigateBack()
}

function toggleAvailable() {
  if (pageData.available.length <= collapseThreshold) {
    return
  }
  availableExpanded.value = !availableExpanded.value
}

function toggleUnavailable() {
  if (pageData.unavailable.length <= collapseThreshold) {
    return
  }
  unavailableExpanded.value = !unavailableExpanded.value
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.coupon-select {
  min-height: 100vh;
  background: $page-bg;
  padding-bottom: 140rpx;
}

.coupon-section {
  padding: 24rpx;
}

.coupon-section--secondary {
  padding-top: 0;
}

.coupon-section__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.coupon-section__head-left {
  display: flex;
  align-items: center;
}

.coupon-section__accent {
  width: 4rpx;
  height: 24rpx;
  border-radius: 999rpx;
  background: $primary;
  box-shadow: 0 0 8rpx rgba(37, 141, 232, 0.5);
}

.coupon-section__accent--orange {
  background: #f97316;
  box-shadow: 0 0 8rpx rgba(249, 115, 22, 0.5);
}

.coupon-section__title {
  margin-left: 12rpx;
  font-size: 28rpx;
  color: $text-strong;
}

.coupon-section__count {
  font-size: 24rpx;
  color: $text-tertiary;
}

.coupon-section__toggle {
  display: flex;
  align-items: center;
}

.coupon-section__toggle--disabled {
  opacity: 0.6;
}

.coupon-section__arrow {
  margin-left: 6rpx;
  font-size: 20rpx;
  color: $text-tertiary;
  transform: rotate(0deg);
  transition: transform 0.2s ease;
  line-height: 1;
}

.coupon-section__arrow--expanded {
  transform: rotate(180deg);
}

.coupon-section__list {
  overflow: hidden;
  transition: max-height 0.28s ease, opacity 0.2s ease;
  max-height: 340rpx;
  opacity: 0.96;
}

.coupon-section__list--expanded {
  max-height: 1200rpx;
  opacity: 1;
}

.coupon-card {
  display: flex;
  overflow: hidden;
  margin-bottom: 16rpx;
  border: 2rpx solid $border-light;
  border-radius: 24rpx;
  background: #fff;
}

.coupon-card--selected {
  border-color: $primary;
}

.coupon-card--disabled {
  opacity: 0.7;
}

.coupon-card__left {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 232rpx;
  background: $primary;
  color: #fff;
}

.coupon-card__left::after {
  content: '';
  position: absolute;
  right: -12rpx;
  top: 50%;
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background: $page-bg;
  transform: translateY(-50%);
}

.coupon-card__left--disabled {
  background: #cdd6e3;
}

.coupon-card__currency {
  margin-top: 8rpx;
  font-size: 28rpx;
  font-weight: 700;
}

.coupon-card__amount {
  font-size: 68rpx;
  font-weight: 700;
}

.coupon-card__right {
  position: relative;
  flex: 1;
  min-height: 140rpx;
  padding: 18rpx 24rpx 18rpx 28rpx;
}

.coupon-card__tag {
  position: absolute;
  right: 0;
  top: 0;
  width: 88rpx;
  height: 36rpx;
  border-radius: 0 24rpx 0 18rpx;
  background: $primary;
  text-align: center;
  line-height: 36rpx;
  font-size: 20rpx;
  color: #fff;
}

.coupon-card__title {
  display: block;
  font-size: 26rpx;
  font-weight: 700;
  color: $text-primary;
}

.coupon-card__title--disabled {
  color: $text-secondary;
}

.coupon-card__condition {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: $text-secondary;
}

.coupon-card__expiry {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: $text-secondary;
}

.coupon-card__check {
  position: absolute;
  right: 20rpx;
  bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34rpx;
  height: 34rpx;
  text-align: center;
  color: $primary;
  font-size: 30rpx;
}

.coupon-select__footer {
}

.coupon-select__button {
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
