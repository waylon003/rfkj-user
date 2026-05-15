<template>
  <PageLayout class="gift-records" title="互赠记录" :back="true">
    <view class="gift-records__content">
      <view class="gift-records__summary">
        <text class="gift-records__summary-line">当前会员：{{ displayMemberId }}</text>
        <text class="gift-records__summary-line">当前门店：{{ currentStoreName }}</text>
      </view>

      <view v-if="displayRecords.length === 0" class="gift-records__empty">
        <text class="gift-records__empty-text">暂无互赠记录</text>
        <text class="gift-records__empty-hint">通过赠送功能向好友转赠游戏币、积分或彩票</text>
      </view>

      <view
        v-for="item in displayRecords"
        :key="item.id"
        class="record-card"
      >
        <view class="record-card__top">
          <view class="record-card__tag" :class="`record-card__tag--${item.type}`">
            {{ item.type === 'income' ? '收入' : item.type === 'returned' ? '退回' : '支出' }}
          </view>
          <text class="record-card__title">{{ item.title }}</text>
          <text class="record-card__amount" :class="`record-card__amount--${item.type}`">{{ item.amount }}</text>
        </view>
        <view class="record-card__meta-row">
          <text class="record-card__meta-label">获得时间</text>
          <text class="record-card__meta-value">{{ item.time }}</text>
        </view>
        <view class="record-card__meta-row">
          <text class="record-card__meta-label">获得方式</text>
          <text class="record-card__meta-value">{{ item.method }}</text>
        </view>

        <view v-if="item.statusText" class="record-card__status">
          <view class="record-card__status-main" :class="`record-card__status-main--${item.statusType || 'pending'}`">
            <view class="record-card__status-dot"></view>
            <text>{{ item.statusText }}</text>
          </view>
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
  </PageLayout>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import PageLayout from '@/components/common/layout/PageLayout.vue'
import QrCodePopup from '@/components/common/popup/QrCodePopup.vue'
import { getUserTransferList, type UserTransferRecord } from '@/services/member'
import { guardRouteAccess } from '@/utils/auth'
import { useUserStore } from '@/stores'

interface DisplayRecord {
  id: string
  type: 'income' | 'expense' | 'returned'
  title: string
  amount: string
  time: string
  method: string
  statusText?: string
  statusType?: 'received' | 'pending' | 'returned'
  actionText?: string
  qrValue?: string
}

const userStore = useUserStore()
const records = reactive<DisplayRecord[]>([])
const qrVisible = ref(false)
const activeQrValue = ref('')
const userMemberId = computed(() => userStore.profile.memberId || 'guest')
const displayMemberId = computed(() => userStore.profile.memberId || 'ID:--')
const currentStoreName = computed(() => userStore.selectedStoreName || '未注册门店')
const displayRecords = computed(() =>
  records.map(item => ({
    ...item,
    method: `${item.method} / ${currentStoreName.value}`
  }))
)

void loadPageData().catch(showError)
onShow(() => {
  guardRouteAccess('/pages/profile/gift-records', '/pages/profile/index')
})

async function loadPageData() {
  // 获取我转出的记录
  const [givenData, receivedData] = await Promise.all([
    getUserTransferList(true),
    getUserTransferList(false)
  ])

  const mapped: DisplayRecord[] = []

  // 我转出的记录
  givenData.list.forEach(item => {
    mapped.push(mapTransferRecord(item, 'expense'))
  })

  // 我收到的记录
  receivedData.list.forEach(item => {
    mapped.push(mapTransferRecord(item, 'income'))
  })

  // 按时间倒序排列
  mapped.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

  records.splice(0, records.length, ...mapped)
}

function mapTransferRecord(item: UserTransferRecord, defaultType: 'income' | 'expense'): DisplayRecord {
  const assetName = getAssetName(item.stdMode)
  const isIncome = defaultType === 'income'
  const counterparty = isIncome ? item.userName || item.userPhone : item.descUserName || item.descPhone

  return {
    id: String(item.id),
    type: defaultType,
    title: isIncome ? `收到${counterparty}赠送${assetName}` : `赠送给${counterparty}${assetName}`,
    amount: isIncome ? `+${item.number}` : `-${item.number}`,
    time: item.createdAt,
    method: assetName
  }
}

function getAssetName(stdMode: 1 | 2 | 3): string {
  const names: Record<number, string> = { 1: '游戏币', 2: '积分', 3: '彩票' }
  return names[stdMode] || '未知资产'
}

function openQrPopup(item: DisplayRecord) {
  if (!item.qrValue) {
    return
  }

  activeQrValue.value = `${item.qrValue}&memberId=${encodeURIComponent(userMemberId.value)}`
  qrVisible.value = true
}

function handleRecordAction(item: DisplayRecord) {
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

function showError(error: unknown) {
  const message = error instanceof Error ? error.message : '互赠记录加载失败'
  uni.showToast({
    title: message,
    icon: 'none'
  })
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

.gift-records__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 48rpx;
}

.gift-records__empty-text {
  font-size: 32rpx;
  color: $text-secondary;
  line-height: 44rpx;
}

.gift-records__empty-hint {
  margin-top: 16rpx;
  font-size: 26rpx;
  color: $text-tertiary;
  line-height: 40rpx;
  text-align: center;
}

.record-card {
  margin-bottom: 24rpx;
  padding: 24rpx;
  border-radius: 24rpx;
  background: #fff;
  border: 2rpx solid $border-light;
}

.record-card__top {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.record-card__tag {
  min-width: 80rpx;
  height: 42rpx;
  padding: 0 12rpx;
  border-radius: 10rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

.record-card__tag--income {
  background: #f0fdf4;
  color: #00a63e;
}

.record-card__tag--expense {
  background: #eff6ff;
  color: $primary;
}

.record-card__tag--returned {
  background: #eef2f7;
  color: $text-tertiary;
}

.record-card__title {
  flex: 1;
  min-width: 0;
  font-size: 32rpx;
  color: $text-strong;
}

.record-card__amount {
  flex: 0 0 auto;
  font-size: 30rpx;
  font-weight: 700;
}

.record-card__amount--income {
  color: #00a63e;
}

.record-card__amount--expense {
  color: $primary;
}

.record-card__amount--returned {
  color: $text-tertiary;
}

.record-card__meta-row {
  display: flex;
  justify-content: space-between;
  margin-top: 14rpx;
  font-size: 24rpx;
}

.record-card__meta-label {
  color: $text-secondary;
}

.record-card__meta-value {
  margin-left: auto;
  text-align: right;
  color: $text-strong;
}

.record-card__status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 18rpx;
  padding-top: 18rpx;
  border-top: 2rpx solid $border-light;
  font-size: 24rpx;
  color: $text-secondary;
}

.record-card__status-main {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  min-width: 0;
}

.record-card__status-main--received {
  color: #00a63e;
}

.record-card__status-main--pending {
  color: #f97316;
}

.record-card__status-main--returned {
  color: $text-tertiary;
}

.record-card__status-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: currentColor;
  flex: 0 0 auto;
}

.record-card__action {
  min-width: 132rpx;
  height: 52rpx;
  padding: 0 18rpx;
  border-radius: 16rpx;
  background: #f5f7fb;
  text-align: center;
  line-height: 52rpx;
  color: $text-strong;
}

</style>
