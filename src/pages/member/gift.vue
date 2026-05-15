<template>
  <PageLayout class="gift-page" title="赠送游戏币" :back="true">
    <view class="gift-page__content">
      <view class="gift-page__balance">
        <text class="gift-page__balance-label">{{ currentBalanceLabel }}</text>
        <view class="gift-page__balance-line">
          <text class="gift-page__balance-value">{{ displayBalance }}</text>
          <text class="gift-page__balance-unit">{{ currentBalanceUnit }}</text>
        </view>
        <view class="gift-page__balance-avatar"></view>
      </view>

      <view class="gift-page__project-card">
        <text class="gift-page__section-label">赠送项目</text>
        <view class="gift-page__project-grid">
          <view
            v-for="project in giftProjects"
            :key="project.value"
            class="gift-page__project-item"
            :class="{ 'gift-page__project-item--active': activeProject === project.value }"
            @click="activeProject = project.value"
          >
            <image class="gift-page__project-icon" :src="currentProjectIcon(project.value)" mode="aspectFit" />
            <text class="gift-page__project-text">{{ project.label }}</text>
          </view>
        </view>
      </view>

      <view class="gift-page__field-card">
        <text class="gift-page__section-label">赠予账号</text>
        <view class="gift-page__account-row">
          <image class="gift-page__account-icon" src="/static/demo-page/gift-account-phone.svg" mode="aspectFit" />
          <t-input
            v-model:value="giftAccount"
            class="gift-page__account-input"
            type="number"
            placeholder="请输入手机号"
            :maxlength="11"
            :borderless="true"
            :custom-style="giftAccountInputStyle"
          />
        </view>
      </view>

      <view class="gift-page__field-card">
        <text class="gift-page__section-label">赠送数量（{{ currentQuantityUnit }}）</text>
        <view class="gift-page__stepper">
          <view
            class="gift-page__stepper-button"
            :class="{ 'gift-page__stepper-button--disabled': giftQuantity <= 1 }"
            @click="changeGiftQuantity(-1)"
          >
            -
          </view>
          <view class="gift-page__stepper-value">{{ giftQuantity }}</view>
          <view class="gift-page__stepper-button" @click="changeGiftQuantity(1)">+</view>
        </view>
      </view>

      <view class="gift-page__primary" @click="submitGift">确认赠送</view>
    </view>
  </PageLayout>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import TInput from 'tdesign-uniapp/input/input.vue'
import PageLayout from '@/components/common/layout/PageLayout.vue'
import { getCurrentUserProfile } from '@/services/auth'
import { getGiftCoinPageData, submitGift as submitGiftRequest, type GiftCoinPageData } from '@/services/member'
import { guardRouteAccess } from '@/utils/auth'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const pageData = reactive<GiftCoinPageData>({
  balance: '',
  amount: '',
  secondaryBadge: '',
  qrAmount: '',
  qrValue: '',
  qrTipLines: []
})

const giftAccount = ref('')
const giftQuantity = ref(100)
const activeProject = ref<'coin' | 'ticket' | 'points'>('coin')
const giftProjects = [
  { value: 'coin', label: '游戏币' },
  { value: 'ticket', label: '彩票' },
  { value: 'points', label: '积分' }
] as const
const currentBalanceValue = computed(() => {
  if (activeProject.value === 'coin') {
    return resolveAssetValue(userStore.profile.coin, pageData.balance, 1250)
  }

  if (activeProject.value === 'ticket') {
    return resolveAssetValue(userStore.profile.ticket, '', 456)
  }

  return resolveAssetValue(userStore.profile.integral, '', 12123)
})
const currentBalanceLabel = computed(() => {
  if (activeProject.value === 'coin') return '当前可用游戏币'
  if (activeProject.value === 'ticket') return '当前可用彩票'
  return '当前可用积分'
})
const currentBalanceUnit = computed(() => {
  if (activeProject.value === 'coin') return '枚'
  if (activeProject.value === 'points') return '分'
  return '张'
})
const currentQuantityUnit = computed(() => {
  if (activeProject.value === 'coin') return '枚'
  if (activeProject.value === 'points') return '分'
  return '张'
})
const displayBalance = computed(() => currentBalanceValue.value.toLocaleString('zh-CN'))
const giftAccountInputStyle = {
  '--td-input-bg-color': 'transparent',
  '--td-input-vertical-padding': '0'
}

loadPageData()
onShow(() => {
  guardRouteAccess('/pages/member/gift', '/pages/home/index')
})

async function loadPageData() {
  Object.assign(pageData, await getGiftCoinPageData())
  giftQuantity.value = Number(pageData.amount || 100)
}

function changeGiftQuantity(step: number) {
  const nextValue = giftQuantity.value + step
  giftQuantity.value = Math.max(1, Math.min(9999, nextValue))
}

function currentProjectIcon(value: 'coin' | 'ticket' | 'points') {
  if (value === 'coin') {
    return activeProject.value === value
      ? '/static/demo-page/gift-project-coin.svg'
      : '/static/demo-page/gift-project-coin-inactive.svg'
  }

  if (value === 'ticket') {
    return activeProject.value === value
      ? '/static/demo-page/gift-project-ticket-active.svg'
      : '/static/demo-page/gift-project-ticket.svg'
  }

  return activeProject.value === value
    ? '/static/demo-page/gift-project-points-active.svg'
    : '/static/demo-page/gift-project-points.svg'
}

async function submitGift() {
  if (!validateGiftForm()) {
    return
  }

  try {
    const targetPhone = giftAccount.value
    const quantity = giftQuantity.value
    const assetLabel = activeProjectLabel.value

    await submitGiftRequest({
      assetType: activeProject.value,
      receivePhone: targetPhone,
      quantity
    })

    try {
      const currentUser = await getCurrentUserProfile()
      userStore.updateProfile({
        nickname: currentUser.nickname,
        memberId: currentUser.memberId,
        avatar: currentUser.avatar,
        phone: currentUser.phone,
        address: currentUser.address,
        storeId: currentUser.storeId,
        coin: currentUser.coin,
        integral: currentUser.integral,
        ticket: currentUser.ticket,
        status: currentUser.status
      })
    } catch (error) {
      console.warn('refresh profile after gift failed', error)
    }

    giftAccount.value = ''
    giftQuantity.value = Number(pageData.amount || 100)
    uni.showToast({
      title: `已向 ${targetPhone} 赠送${quantity}${assetLabel}`,
      icon: 'none'
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : '赠送失败'
    uni.showToast({
      title: message,
      icon: 'none'
    })
  }
}

function validateGiftForm() {
  if (!/^1\d{10}$/.test(giftAccount.value)) {
    uni.showToast({
      title: '请输入正确的赠予账号',
      icon: 'none'
    })
    return false
  }

  if (giftQuantity.value <= 0) {
    uni.showToast({
      title: '请输入赠送数量',
      icon: 'none'
    })
    return false
  }

  if (giftQuantity.value > currentBalanceValue.value) {
    uni.showToast({
      title: '赠送数量不能超过当前可用余额',
      icon: 'none'
    })
    return false
  }

  return true
}

const activeProjectLabel = computed(() => giftProjects.find(item => item.value === activeProject.value)?.label || '游戏币')

function resolveAssetValue(primaryValue: number, fallbackText: string, mockValue: number) {
  if (Number.isFinite(primaryValue) && primaryValue > 0) {
    return primaryValue
  }

  const normalizedFallback = Number(String(fallbackText || '').replace(/,/g, ''))
  if (Number.isFinite(normalizedFallback) && normalizedFallback > 0) {
    return normalizedFallback
  }

  return mockValue
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.gift-page {
  min-height: 100vh;
  background: $page-bg;
}

.gift-page__content {
  padding: 24rpx;
}

.gift-page__balance,
.gift-page__project-card,
.gift-page__field-card {
  margin-bottom: 24rpx;
  padding: 24rpx;
  border: 2rpx solid $border-light;
  border-radius: 28rpx;
  background: #fff;
}

.gift-page__balance {
  position: relative;
}

.gift-page__balance-label,
.gift-page__section-label {
  font-size: 24rpx;
  color: $text-tertiary;
}

.gift-page__balance-line {
  display: flex;
  align-items: baseline;
  margin-top: 12rpx;
}

.gift-page__balance-value,
.gift-page__amount-value {
  font-size: 48rpx;
  font-weight: 700;
  color: $primary;
}

.gift-page__balance-unit {
  margin-left: 8rpx;
  font-size: 28rpx;
  color: $primary;
}

.gift-page__balance-avatar {
  position: absolute;
  right: 24rpx;
  top: 28rpx;
  width: 94rpx;
  height: 94rpx;
  border-radius: 50%;
  @include public-cover($public-demo-image-1);
}

.gift-page__project-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16rpx;
  margin-top: 18rpx;
}

.gift-page__project-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  min-height: 144rpx;
  padding: 20rpx 12rpx;
  border: 2rpx solid $border-light;
  border-radius: 20rpx;
  background: #f9fbff;
}

.gift-page__project-item--active {
  border-color: $primary;
  background: $primary;
}

.gift-page__project-icon {
  width: 44rpx;
  height: 44rpx;
}

.gift-page__project-item--active .gift-page__project-icon {
  filter: brightness(0) invert(1);
}

.gift-page__project-text {
  font-size: 24rpx;
  color: $text-strong;
}

.gift-page__project-item--active .gift-page__project-text {
  color: #fff;
}

.gift-page__account-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-top: 18rpx;
  padding: 0 8rpx 0 20rpx;
  min-height: 92rpx;
  border-radius: 20rpx;
  border: 2rpx solid $border-light;
  background: #fff;
}

.gift-page__account-icon {
  width: 36rpx;
  height: 36rpx;
}

.gift-page__account-input {
  flex: 1;
}

.gift-page__stepper {
  display: grid;
  grid-template-columns: 88rpx 1fr 88rpx;
  align-items: center;
  height: 96rpx;
  margin-top: 18rpx;
  overflow: hidden;
  border-radius: 20rpx;
  background: #f4f8ff;
}

.gift-page__stepper-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 40rpx;
  color: $text-strong;
}

.gift-page__stepper-button--disabled {
  color: #c5ceda;
}

.gift-page__stepper-value {
  text-align: center;
  font-size: 40rpx;
  font-weight: 700;
  color: $primary;
}

.gift-page__primary {
  width: 100%;
  height: 106rpx;
  margin-top: 8rpx;
  border-radius: 28rpx;
  background: #245cf0;
  text-align: center;
  line-height: 106rpx;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
}

</style>
