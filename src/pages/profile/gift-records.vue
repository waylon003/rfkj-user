<template>
  <view class="gift-records">
    <app-header title="互赠记录" :back="true" />

    <view class="gift-records__content">
      <view class="gift-records__summary">
        <text class="gift-records__summary-line">当前会员：{{ displayMemberId }}</text>
        <text class="gift-records__summary-line">当前门店：{{ currentStoreName }}</text>
      </view>

      <view
        v-for="item in displayRecords"
        :key="item.id"
        class="record-card"
      >
        <view class="record-card__body">
          <view class="record-card__head">
            <view class="record-card__head-left">
              <view class="record-card__pill" :class="`record-card__pill--${item.type}`">
                {{ item.type === 'income' ? '收入' : item.type === 'returned' ? '退回' : '支出' }}
              </view>
              <text class="record-card__title">{{ item.title }}</text>
            </view>
            <text class="record-card__amount">{{ item.amount }}</text>
          </view>
          <view class="record-card__meta">
            <text>获得时间</text>
            <text>{{ item.time }}</text>
          </view>
          <view class="record-card__meta">
            <text>获得方式</text>
            <text>{{ item.method }}</text>
          </view>
        </view>

        <view v-if="item.statusText" class="record-card__status">
          <text>{{ item.statusText }}</text>
          <view v-if="item.actionText" class="record-card__action" @click="handleRecordAction(item)">{{ item.actionText }}</view>
        </view>
      </view>
    </view>

    <QrCodePopup
      :visible="qrVisible"
      title="查看二维码"
      :value="activeQrValue"
      :tips="['请让好友使用微信扫一扫领取']"
      action-text="关闭"
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
import { getGiftRecordData, type GiftRecordData, type GiftRecordItem } from '@/services/profile'
import { guardRouteAccess } from '@/utils/auth'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const pageData = reactive<GiftRecordData>({
  title: '',
  list: []
})
const qrVisible = ref(false)
const activeQrValue = ref('')
const userMemberId = computed(() => userStore.profile.memberId || 'guest')
const displayMemberId = computed(() => userStore.profile.memberId || 'ID:--')
const currentStoreName = computed(() => userStore.selectedStoreName || '未选择门店')
const displayRecords = computed(() =>
  pageData.list.map(item => ({
    ...mapRecordByStore(item),
    method: `${mapRecordByStore(item).method} / ${currentStoreName.value}`
  }))
)

loadPageData()
onShow(() => {
  guardRouteAccess('/pages/profile/gift-records', '/pages/profile/index')
})

async function loadPageData() {
  Object.assign(pageData, await getGiftRecordData())
}

function openQrPopup(item: GiftRecordItem) {
  if (!item.qrValue) {
    return
  }

  activeQrValue.value = `${item.qrValue}&memberId=${encodeURIComponent(userMemberId.value)}`
  qrVisible.value = true
}

function handleRecordAction(item: GiftRecordItem) {
  if (item.qrValue) {
    openQrPopup(item)
    return
  }

  if (item.actionText === '重发链接') {
    item.statusText = '已重新发送，请提醒好友查收'
    item.actionText = undefined
    uni.showToast({
      title: '领取链接已重发',
      icon: 'none'
    })
  }
}

function mapRecordByStore(item: GiftRecordItem) {
  if (currentStoreName.value.includes('额企鹅驱蚊器')) {
    if (item.id === 'record-1') {
      return { ...item, title: '收到赠送游戏币（额企鹅驱蚊器店）' }
    }
    if (item.id === 'record-2') {
      return { ...item, statusText: '好友“李四”已领取' }
    }
    return { ...item }
  }

  if (currentStoreName.value.includes('大大大大')) {
    if (item.id === 'record-1') {
      return { ...item, title: '收到赠送游戏币（大大大大店）', amount: '+80' }
    }
    if (item.id === 'record-4') {
      return { ...item, statusText: '链接未点击，等待重新发送' }
    }
    return { ...item }
  }

  return { ...item }
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.gift-records {
  min-height: 100vh;
  background: $page-bg;
}

.gift-records__content {
  padding: 24rpx;
}

.gift-records__summary {
  margin-bottom: 24rpx;
  padding: 24rpx 28rpx;
  border-radius: 24rpx;
  background: #fff;
  border: 2rpx solid $border-light;
}

.gift-records__summary-line {
  display: block;
  font-size: 24rpx;
  line-height: 1.6;
  color: $text-secondary;
}

.gift-records__summary-line + .gift-records__summary-line {
  margin-top: 8rpx;
}

.record-card {
  margin-bottom: 24rpx;
  border-radius: 24rpx;
  background: #fff;
  border: 2rpx solid $border-light;
}

.record-card__pill {
  display: inline-block;
  min-width: 80rpx;
  height: 42rpx;
  margin: 24rpx 0 0 24rpx;
  border-radius: 10rpx;
  text-align: center;
  line-height: 42rpx;
  font-size: 24rpx;
}

.record-card__pill--income {
  background: #eef6ff;
  color: $primary;
}

.record-card__pill--expense {
  background: #fff7ed;
  color: #f97316;
}

.record-card__pill--returned {
  background: #eef2f7;
  color: $text-tertiary;
}

.record-card__body {
  padding: 24rpx 24rpx 22rpx;
}

.record-card__head,
.record-card__meta {
  display: flex;
  justify-content: space-between;
}

.record-card__head {
  align-items: center;
}

.record-card__head-left {
  display: flex;
  align-items: center;
  min-width: 0;
}

.record-card__title {
  margin-left: 16rpx;
  font-size: 32rpx;
  color: $text-strong;
}

.record-card__amount {
  font-size: 30rpx;
  font-weight: 700;
  color: $primary;
}

.record-card__meta {
  margin-top: 12rpx;
  font-size: 24rpx;
  color: $text-secondary;
}

.record-card__status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22rpx 24rpx;
  border-top: 2rpx solid $border-light;
  font-size: 24rpx;
  color: $text-secondary;
}

.record-card__action {
  min-width: 132rpx;
  height: 52rpx;
  border-radius: 16rpx;
  background: $surface-avatar;
  text-align: center;
  line-height: 52rpx;
  color: $text-strong;
}

</style>
