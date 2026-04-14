<template>
  <view class="coin-page">
    <app-header title="购币中心" :back="true" />

    <view class="coin-page__content">
      <balance-card
        :label="pageData.balanceLabel"
        :value="displayBalance"
        :unit="pageData.balanceUnit"
      />

      <view class="section-block">
        <view class="section-head">
          <view class="section-head__left">
            <view class="section-head__accent section-head__accent--orange"></view>
            <text class="section-head__title">限时特惠</text>
          </view>
          <text class="section-head__meta section-head__meta--orange">{{ featuredCountdownText }}</text>
        </view>
        <view class="special-grid">
          <view
            v-for="item in pageData.featuredPackages"
            :key="item.id"
            class="package-card package-card--special"
            :class="{ 'package-card--selected': item.selected }"
            @click="selectFeaturedPackage(item.id)"
          >
            <text v-if="item.badgeText" class="package-card__corner">{{ item.badgeText }}</text>
            <text class="package-card__coin">{{ item.coinText }}</text>
            <view class="package-card__price-row">
              <text class="package-card__price">{{ formatMoney(item.price) }}</text>
              <text v-if="item.originalPrice" class="package-card__origin">{{ formatMoney(item.originalPrice) }}</text>
            </view>
            <view class="package-card__stock">
              <text class="iconfont package-card__stock-icon icon-ic_input_calendar"></text>
              <text>{{ item.stockText }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="section-block">
        <view class="section-head">
          <view class="section-head__left">
            <view class="section-head__accent"></view>
            <text class="section-head__title">基础套餐</text>
          </view>
        </view>
        <view class="base-grid">
          <view
            v-for="item in pageData.basePackages"
            :key="item.id"
            class="package-card"
            :class="{ 'package-card--selected': item.selected }"
            @click="selectBasePackage(item.id)"
          >
            <text v-if="item.badgeText" class="package-card__hot">{{ item.badgeText }}</text>
            <text class="package-card__coin package-card__coin--base">{{ item.coinText }}</text>
            <text class="package-card__price package-card__price--base">
              {{ formatMoney(item.price) }}
            </text>
            <text class="package-card__unit">{{ item.unitPriceText }}</text>
          </view>
        </view>
      </view>

      <view class="option-card option-card--single">
        <view class="option-card__row">
          <view class="option-card__left">
            <view class="option-card__radio" :class="{ 'option-card__radio--selected': pageData.customAmount.selected }"></view>
            <text class="option-card__label">{{ pageData.customAmount.label }}</text>
          </view>
          <view class="option-card__right" @click="goRoute(pageData.customAmount.route)">
            <text class="option-card__action">{{ pageData.customAmount.valueText }}</text>
            <text class="option-card__arrow">›</text>
          </view>
        </view>
      </view>

      <view class="option-card">
        <view class="option-card__row">
          <view class="option-card__left">
            <text class="iconfont option-card__icon" :class="pageData.coupon.iconClass"></text>
            <text class="option-card__label">{{ pageData.coupon.label }}</text>
          </view>
          <view class="option-card__right" @click="goRoute(pageData.coupon.route)">
            <text class="option-card__action">{{ pageData.coupon.valueText }}</text>
            <text class="option-card__arrow">›</text>
          </view>
        </view>
        <view class="option-card__row">
          <view class="option-card__left">
            <text class="iconfont option-card__icon" :class="pageData.ticketDeduction.iconClass"></text>
            <text class="option-card__label">{{ pageData.ticketDeduction.label }}</text>
          </view>
          <view class="option-card__right" @click="goRoute(pageData.ticketDeduction.route)">
            <text class="option-card__action">{{ pageData.ticketDeduction.valueText }}</text>
            <text class="option-card__arrow">›</text>
          </view>
        </view>
        <view class="option-card__row">
          <view class="option-card__left">
            <text class="iconfont option-card__icon" :class="pageData.pointPayment.iconClass"></text>
            <text class="option-card__label">{{ pageData.pointPayment.label }}</text>
          </view>
          <view class="option-card__right" @click="goRoute(pageData.pointPayment.route)">
            <text class="option-card__price-off">{{ pageData.pointPayment.valueText }}</text>
          </view>
        </view>
      </view>
    </view>

    <bottom-action-bar class="pay-bar">
      <view class="pay-bar__summary">
        <text class="pay-bar__label">{{ pageData.summary.label }}</text>
        <view class="pay-bar__amount">
          <text class="pay-bar__symbol">¥</text>
          <text class="pay-bar__value">{{ pageData.summary.amount }}</text>
        </view>
      </view>
      <view class="pay-bar__button" @click="paymentVisible = true">{{ pageData.summary.buttonText }}</view>
    </bottom-action-bar>

    <t-popup :visible="paymentVisible" placement="bottom" :close-on-overlay-click="true" @visible-change="handlePopupChange">
      <popup-panel title="应付总额" @close="paymentVisible = false">
        <view class="payment-sheet__amount-line">
          <text class="payment-sheet__currency">¥</text>
          <text class="payment-sheet__amount">{{ pageData.paymentSheet.amount }}</text>
        </view>

        <view class="payment-sheet__product">
          <view class="payment-sheet__product-icon"></view>
          <view class="payment-sheet__product-meta">
            <text class="payment-sheet__product-title">{{ pageData.paymentSheet.featuredTitle }}</text>
            <text class="payment-sheet__product-subtitle">{{ pageData.paymentSheet.featuredSubtitle }}</text>
          </view>
        </view>

        <text class="payment-sheet__section-label">支付方式</text>
        <view
          v-for="method in pageData.paymentSheet.methods"
          :key="method.id"
          class="payment-sheet__method"
        >
          <view class="payment-sheet__method-icon"></view>
          <view class="payment-sheet__method-meta">
            <text class="payment-sheet__method-title">{{ method.title }}</text>
            <text class="payment-sheet__method-subtitle">{{ method.subtitle }}</text>
          </view>
          <view v-if="method.badge" class="payment-sheet__method-badge">{{ method.badge }}</view>
          <view
            class="payment-sheet__method-radio"
            :class="{ 'payment-sheet__method-radio--selected': method.selected }"
          >
            <view v-if="method.selected" class="payment-sheet__method-dot"></view>
          </view>
        </view>
        <template #actions>
          <popup-primary-button label="立即支付" @click="goSuccess" />
        </template>
      </popup-panel>
    </t-popup>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onHide, onShow, onUnload } from '@dcloudio/uni-app'
import AppHeader from '@/components/common/AppHeader.vue'
import BalanceCard from '@/components/common/layout/BalanceCard.vue'
import BottomActionBar from '@/components/common/layout/BottomActionBar.vue'
import PopupPanel from '@/components/common/popup/PopupPanel.vue'
import PopupPrimaryButton from '@/components/common/popup/PopupPrimaryButton.vue'
import {
  getPurchaseCenterData,
  selectBasePackage as selectBasePackageAction,
  selectFeaturedPackage as selectFeaturedPackageAction,
  type PurchaseCenterData
} from '@/services/purchase'
import { formatMoney } from '@/utils/format'
import { guardRouteAccess } from '@/utils/auth'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const pageData = reactive<PurchaseCenterData>({
  balanceLabel: '',
  balanceValue: '',
  balanceUnit: '',
  featuredEndAt: '',
  featuredPackages: [],
  basePackages: [],
  customAmount: {
    id: '',
    label: '',
    valueText: ''
  },
  coupon: {
    id: '',
    label: '',
    valueText: ''
  },
  ticketDeduction: {
    id: '',
    label: '',
    valueText: ''
  },
  pointPayment: {
    id: '',
    label: '',
    valueText: ''
  },
  summary: {
    label: '',
    amount: '',
    buttonText: ''
  },
  paymentSheet: {
    amount: '',
    payable: '',
    featuredTitle: '',
    featuredSubtitle: '',
    methods: []
  }
})
const paymentVisible = ref(false)
const now = ref(Date.now())
const featuredCountdownText = computed(() => getCountdownText(pageData.featuredEndAt, now.value))
const displayBalance = computed(() =>
  (userStore.profile.coin || Number(pageData.balanceValue || 0)).toLocaleString('zh-CN')
)
let countdownTimer: ReturnType<typeof setInterval> | undefined

loadPageData()
onShow(() => {
  if (!guardRouteAccess('/pages/coin/recharge', '/pages/home/index')) {
    return
  }
  startCountdown()
  void loadPageData()
})
onHide(() => {
  stopCountdown()
})
onUnload(() => {
  stopCountdown()
})

async function loadPageData() {
  Object.assign(pageData, await getPurchaseCenterData())
}

function goRoute(url?: string) {
  if (!url) {
    return
  }
  uni.navigateTo({ url })
}

async function selectFeaturedPackage(id: string) {
  Object.assign(pageData, await selectFeaturedPackageAction(id))
}

async function selectBasePackage(id: string) {
  Object.assign(pageData, await selectBasePackageAction(id))
}

function handlePopupChange(context: { visible: boolean }) {
  paymentVisible.value = context.visible
}

function goSuccess() {
  paymentVisible.value = false
  uni.navigateTo({ url: '/pages/coin/success' })
}

function startCountdown() {
  stopCountdown()
  now.value = Date.now()
  countdownTimer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
}

function stopCountdown() {
  if (!countdownTimer) {
    return
  }
  clearInterval(countdownTimer)
  countdownTimer = undefined
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
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.coin-page {
  min-height: 100vh;
  padding-bottom: 132rpx;
  background: $page-bg;
}

.coin-page__content {
  padding: 24rpx;
}

:deep(.balance-card) {
  min-height: 102rpx;
  padding: 16rpx 24rpx;
  box-shadow: none;
}

:deep(.balance-card__label) {
  font-size: 20rpx;
}

:deep(.balance-card__value-row) {
  margin-top: 8rpx;
}

:deep(.balance-card__value) {
  font-size: 54rpx;
}

:deep(.balance-card__unit) {
  margin-left: 6rpx;
  font-size: 24rpx;
}

:deep(.balance-card__avatar) {
  width: 76rpx;
  height: 76rpx;
  margin-top: 2rpx;
}

.section-block,
.option-card {
  margin-bottom: 24rpx;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10rpx 4rpx 14rpx;
}

.section-head__left {
  display: flex;
  align-items: center;
}

.section-head__accent {
  width: 4rpx;
  height: 22rpx;
  border-radius: 999rpx;
  background: $primary;
  box-shadow: 0 0 8rpx rgba(37, 141, 232, 0.35);
}

.section-head__accent--orange {
  background: #ff7a00;
  box-shadow: 0 0 8rpx rgba(255, 122, 0, 0.28);
}

.section-head__title {
  margin-left: 10rpx;
  font-size: 26rpx;
  color: $text-strong;
}

.section-head__meta {
  display: inline-flex;
  align-items: center;
  min-height: 34rpx;
  padding: 0 12rpx;
  border-radius: 999rpx;
  font-size: 20rpx;
}

.section-head__meta--orange {
  background: #fff3e7;
  color: #ff9b52;
}

.special-grid,
.base-grid {
  display: grid;
  gap: 14rpx 12rpx;
}

.special-grid {
  grid-template-columns: repeat(2, 1fr);
}

.base-grid {
  grid-template-columns: repeat(2, 1fr);
}

.package-card {
  position: relative;
  min-height: 160rpx;
  padding: 16rpx 16rpx 14rpx;
  border-radius: 22rpx;
  background: #fff;
  border: 2rpx solid #edf2fb;
}

.package-card--special {
  min-height: 150rpx;
}

.package-card--selected {
  border-color: $primary;
  box-shadow: inset 0 0 0 2rpx rgba(21, 93, 252, 0.04);
}

.package-card__corner,
.package-card__hot {
  position: absolute;
  right: 0;
  top: 0;
  padding: 6rpx 14rpx;
  border-radius: 0 24rpx 0 18rpx;
  background: #ff7a00;
  font-size: 20rpx;
  color: #fff;
}

.package-card__hot {
  background: $primary;
}

.package-card__coin {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: $primary;
  line-height: 1.2;
}

.package-card__coin--base {
  text-align: center;
}

.package-card__price-row {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
  margin-top: 10rpx;
}

.package-card__price {
  font-size: 23px;
  font-weight: 700;
  color: $text-primary;
  line-height: 1;
}

.package-card__price--base {
  display: block;
  margin-top: 8rpx;
  text-align: center;
  font-size: 23px;
}

.package-card__origin {
  font-size: 12px;
  text-decoration: line-through;
  color: $text-tertiary;
}

.package-card__stock,
.package-card__unit {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8rpx;
  font-size: 12px;
  color: #8da6d8;
  line-height: 1;
}

.package-card__stock {
  justify-content: flex-start;
  padding: 6rpx 12rpx;
  border-radius: 999rpx;
  background: #f3f7ff;
}

.package-card__stock-icon {
  margin-right: 8rpx;
  font-size: 20rpx;
  color: #8da6d8;
}

.option-card {
  padding: 0 24rpx;
  border: 2rpx solid $border-light;
  border-radius: 28rpx;
  background: #fff;
}

.option-card--single {
  margin-top: 2rpx;
}

.option-card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 92rpx;
}

.option-card__row + .option-card__row {
  border-top: 2rpx solid $border-light;
}

.option-card__left {
  display: flex;
  align-items: center;
  gap: 14rpx;
}

.option-card__right {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.option-card__radio {
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  background: #e4e9f1;
}

.option-card__radio--selected {
  background: $primary;
}

.option-card__icon {
  font-size: 32rpx;
  color: $primary;
}

.option-card__label {
  font-size: 26rpx;
  color: $text-primary;
}

.option-card__action {
  font-size: 22rpx;
  color: $text-tertiary;
}

.option-card__arrow {
  margin-left: 8rpx;
  font-size: 24rpx;
  color: #c5cfdf;
}

.option-card__price-off {
  font-size: 32rpx;
  font-weight: 700;
  color: #ff7a00;
}

.pay-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 14rpx 24rpx calc(14rpx + env(safe-area-inset-bottom));
  background: #fff;
  box-shadow: 0 -8rpx 18rpx rgba(15, 23, 42, 0.04);
}

.pay-bar__summary {
  display: flex;
  align-items: baseline;
  flex: 1;
}

.pay-bar__label {
  font-size: 22rpx;
  color: $text-primary;
}

.pay-bar__amount {
  display: flex;
  align-items: baseline;
  margin-left: 6rpx;
  color: $primary;
}

.pay-bar__symbol {
  font-size: 32rpx;
  font-weight: 700;
}

.pay-bar__value {
  font-size: 52rpx;
  font-weight: 700;
}

.pay-bar__button {
  width: 188rpx;
  height: 88rpx;
  margin-left: auto;
  border-radius: 24rpx;
  background: linear-gradient(135deg, $primary-dark 0%, $primary 100%);
  text-align: center;
  line-height: 88rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: #fff;
}

.payment-sheet__amount-line {
  display: flex;
  justify-content: center;
  align-items: baseline;
  margin-top: 10rpx;
}

.payment-sheet__currency {
  font-size: 42rpx;
  font-weight: 700;
  color: $text-strong;
}

.payment-sheet__amount {
  margin-left: 8rpx;
  font-size: 84rpx;
  font-weight: 700;
  color: $text-strong;
}

.payment-sheet__product,
.payment-sheet__method {
  display: flex;
  align-items: center;
  min-height: 120rpx;
  margin-top: 24rpx;
  padding: 0 24rpx;
  border-radius: 24rpx;
  background: $page-bg;
}

.payment-sheet__product-icon,
.payment-sheet__method-icon {
  width: 92rpx;
  height: 92rpx;
  border-radius: 20rpx;
  background: #d9e3ff;
}

.payment-sheet__product-meta,
.payment-sheet__method-meta {
  margin-left: 22rpx;
  flex: 1;
}

.payment-sheet__product-title,
.payment-sheet__method-title {
  display: block;
  font-size: 32rpx;
  color: $text-strong;
}

.payment-sheet__product-subtitle,
.payment-sheet__method-subtitle {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: $text-secondary;
}

.payment-sheet__section-label {
  display: block;
  margin-top: 30rpx;
  font-size: 24rpx;
  color: $text-strong;
}

.payment-sheet__method-badge {
  width: 48rpx;
  height: 48rpx;
  margin-right: 16rpx;
  border-radius: 50%;
  background: #ff1010;
  box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.2);
  text-align: center;
  line-height: 48rpx;
  font-size: 24rpx;
  font-weight: 700;
  color: #fff;
}

.payment-sheet__method-radio {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  margin-left: auto;
  border: 4rpx solid $surface-avatar;
  border-radius: 50%;
}

.payment-sheet__method-radio--selected {
  border-color: $primary;
}

.payment-sheet__method-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #fff;
}

</style>
