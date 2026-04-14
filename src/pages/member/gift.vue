<template>
  <view class="gift-page">
    <app-header title="赠送游戏币" :back="true" />

    <view class="gift-page__content">
      <view class="gift-page__balance">
        <text class="gift-page__balance-label">当前可用游戏币</text>
        <view class="gift-page__balance-line">
          <text class="gift-page__balance-value">{{ displayBalance }}</text>
          <text class="gift-page__balance-unit">张</text>
        </view>
        <view class="gift-page__balance-avatar"></view>
      </view>

      <view class="gift-page__amount-card">
        <text class="gift-page__amount-label">赠送数量（枚）</text>
        <text class="gift-page__amount-value">{{ pageData.amount }}</text>
        <view class="gift-page__amount-line"></view>
      </view>

      <view class="gift-page__primary" @click="qrVisible = true">生成二维码（面对面）</view>

      <view class="gift-page__secondary" @click="sendToWechat">
        <text class="gift-page__secondary-text">发送给微信好友</text>
        <view v-if="pageData.secondaryBadge" class="gift-page__secondary-badge">{{ pageData.secondaryBadge }}</view>
      </view>
    </view>

    <QrCodePopup
      :visible="qrVisible"
      title="扫码领取游戏币"
      :amount="displayQrAmount"
      amount-unit="币"
      :value="displayQrValue"
      :tips="pageData.qrTipLines"
      action-text="撤销赠送"
      @update:visible="qrVisible = $event"
      @action="qrVisible = false"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppHeader from '@/components/common/AppHeader.vue'
import QrCodePopup from '@/components/common/popup/QrCodePopup.vue'
import { getGiftCoinPageData, type GiftCoinPageData } from '@/services/member'
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

const qrVisible = ref(false)
const displayBalance = computed(() => Number(userStore.profile.coin || Number(pageData.balance)).toLocaleString('zh-CN'))
const displayQrAmount = computed(() => pageData.qrAmount || pageData.amount)
const displayQrValue = computed(() => {
  const memberId = userStore.profile.memberId || 'guest'
  return `${pageData.qrValue || 'https://rfkj.example.com/gift/redeem'}&memberId=${encodeURIComponent(memberId)}`
})

loadPageData()
onShow(() => {
  guardRouteAccess('/pages/member/gift', '/pages/home/index')
})

async function loadPageData() {
  Object.assign(pageData, await getGiftCoinPageData())
}

function sendToWechat() {
  uni.showToast({
    title: '已模拟发送给微信好友',
    icon: 'none'
  })
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
.gift-page__amount-card {
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
.gift-page__amount-label {
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

.gift-page__amount-card {
  min-height: 214rpx;
  text-align: center;
}

.gift-page__amount-label {
  display: block;
  text-align: left;
}

.gift-page__amount-value {
  display: block;
  margin-top: 20rpx;
  font-size: 72rpx;
}

.gift-page__amount-line {
  height: 2rpx;
  margin-top: 22rpx;
  background: $border-light;
}

.gift-page__primary {
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

.gift-page__secondary {
  position: relative;
  margin-top: 54rpx;
  width: 100%;
  height: 106rpx;
  border-radius: 28rpx;
  background: $primary-soft;
  text-align: center;
  line-height: 106rpx;
}

.gift-page__secondary-text {
  font-size: 36rpx;
  font-weight: 700;
  color: $primary;
}

.gift-page__secondary-badge {
  position: absolute;
  right: 104rpx;
  top: 18rpx;
  width: 48rpx;
  height: 48rpx;
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
