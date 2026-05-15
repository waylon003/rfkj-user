<template>
  <PageLayout class="point-gifts" title="积分兑礼品" :back="true">
    <view class="point-gifts__content">
      <balance-card
        label="当前积分"
        :value="displayBalance"
        tag="待取礼品"
        @click="openPendingGifts"
      />

      <view class="point-gifts__search-wrap">
        <t-search
          v-model:value="searchTerm"
          placeholder="搜索礼品名称"
          shape="round"
          :center="false"
          :clearable="true"
        />
      </view>

      <view class="point-gifts__filters">
        <view
          v-for="item in pageData.categories"
          :key="item.value"
          class="point-gifts__filter"
          :class="{ 'point-gifts__filter--active': activeCategory === item.value }"
          @click="activeCategory = item.value"
        >
          {{ item.label }}
        </view>
      </view>

      <view class="point-gifts__section-head">
        <view class="point-gifts__accent"></view>
        <text class="point-gifts__section-title">{{ currentSectionTitle }}</text>
        <text class="point-gifts__section-meta">共 {{ visibleItems.length }} 件，可兑换 {{ redeemableCount }} 件</text>
      </view>

      <view class="point-gifts__grid">
        <view
          v-for="item in visibleItems"
          :key="item.id"
          class="point-gifts__card"
        >
          <view class="point-gifts__thumb">
            <image
              v-if="item.image"
              class="point-gifts__thumb-image"
              :src="item.image"
              mode="aspectFit"
            />
          </view>
          <view class="point-gifts__card-body">
            <text class="point-gifts__card-title">{{ item.title }}</text>
            <view class="point-gifts__cost-row">
              <text class="point-gifts__cost">{{ item.cost }}</text>
              <text class="point-gifts__cost-unit">积分</text>
            </view>
            <view class="point-gifts__meta-row">
              <text class="point-gifts__stock">{{ getProductState(item).stockText }}</text>
              <text class="point-gifts__state" :class="`point-gifts__state--${getProductState(item).tone}`">
                {{ getProductState(item).stateText }}
              </text>
            </view>
            <view
              class="point-gifts__action"
              :class="{ 'point-gifts__action--primary': getProductState(item).canRedeem }"
              @click="openConfirm(item)"
            >
              {{ getProductState(item).actionText }}
            </view>
          </view>
        </view>
        <view v-if="!visibleItems.length" class="point-gifts__empty">
          未找到相关礼品
        </view>
      </view>
    </view>

    <t-popup :visible="confirmVisible" placement="bottom" :close-on-overlay-click="true" @visible-change="handlePopupChange">
      <popup-panel :title="confirmData.title" @close="confirmVisible = false">
        <view class="point-gifts__popup-main">
          <view class="point-gifts__popup-thumb">
            <image
              v-if="activeGiftItem?.image"
              class="point-gifts__popup-thumb-image"
              :src="activeGiftItem.image"
              mode="aspectFit"
            />
          </view>
          <view class="point-gifts__popup-meta">
            <text class="point-gifts__popup-gift">{{ confirmData.giftName }}</text>
            <text class="point-gifts__popup-line">单件积分： {{ activeItemCost }}</text>
            <text class="point-gifts__popup-line">所需积分： {{ requiredTotalPoints }}</text>
            <text class="point-gifts__popup-line">可用积分： {{ displayAvailablePoints }}</text>
          </view>
        </view>

        <view class="point-gifts__stepper">
          <view
            class="point-gifts__stepper-button"
            :class="{ 'point-gifts__stepper-button--disabled': redeemQuantity <= 1 }"
            @click="changeRedeemQuantity(-1)"
          >
            -
          </view>
          <view class="point-gifts__stepper-value">{{ redeemQuantity }}</view>
          <view
            class="point-gifts__stepper-button"
            :class="{ 'point-gifts__stepper-button--disabled': redeemQuantity >= redeemQuantityLimit }"
            @click="changeRedeemQuantity(1)"
          >
            +
          </view>
        </view>

        <view class="point-gifts__popup-hint-box">
          <view class="point-gifts__popup-hint-dot"></view>
          <view>
            <text
              v-for="line in confirmData.hint"
              :key="line"
              class="point-gifts__popup-hint"
            >
              {{ line }}
            </text>
          </view>
        </view>

        <template #actions>
          <popup-primary-button label="立即兑换" @click="redeemGift" />
          <text class="point-gifts__popup-cancel" @click="confirmVisible = false">取消</text>
        </template>
      </popup-panel>
    </t-popup>
  </PageLayout>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import TSearch from 'tdesign-uniapp/search/search.vue'
import PageLayout from '@/components/common/layout/PageLayout.vue'
import BalanceCard from '@/components/common/layout/BalanceCard.vue'
import PopupPanel from '@/components/common/popup/PopupPanel.vue'
import PopupPrimaryButton from '@/components/common/popup/PopupPrimaryButton.vue'
import {
  getPointGiftConfirmData,
  getPointGiftPageData,
  submitPointGift,
  type PointGiftConfirmData,
  type PointGiftItem,
  type PointGiftPageData
} from '@/services/points'
import { guardRouteAccess } from '@/utils/auth'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const pageData = reactive<PointGiftPageData>({
  balance: '',
  categories: [],
  items: []
})

const confirmData = reactive<PointGiftConfirmData>({
  title: '',
  giftName: '',
  requiredPoints: '',
  availablePoints: '',
  hint: []
})

const confirmVisible = ref(false)
const activeCategory = ref('all')
const searchTerm = ref('')
const redeemQuantity = ref(1)
const activeGiftId = ref('')
const displayBalance = computed(() => parsePointsValue(userStore.profile.integral, pageData.balance).toLocaleString('zh-CN'))
const displayAvailablePoints = computed(() =>
  parsePointsValue(userStore.profile.integral, confirmData.availablePoints).toLocaleString('zh-CN')
)
const currentIntegral = computed(() => parsePointsValue(userStore.profile.integral, pageData.balance))
const activeGiftItem = computed(() => pageData.items.find(item => item.id === activeGiftId.value) || null)
const activeItemCost = computed(() => formatPoints(activeGiftItem.value?.cost || '0'))
const requiredTotalPoints = computed(() =>
  formatPoints(String((Number(activeGiftItem.value?.cost || 0) || 0) * redeemQuantity.value))
)
const redeemQuantityLimit = computed(() => {
  if (!activeGiftItem.value) {
    return 1
  }

  const stock = Math.max(0, Number(activeGiftItem.value.stock) || 0)
  const unitCost = Number(activeGiftItem.value.cost || 0)
  if (stock <= 0 || unitCost <= 0) {
    return 1
  }

  const pointsLimit = Math.floor(currentIntegral.value / unitCost)
  return Math.max(1, Math.min(stock, pointsLimit || 1))
})
const visibleItems = computed(() =>
  pageData.items.filter(item => {
    const matchCategory = activeCategory.value === 'all' || item.category === activeCategory.value
    const keyword = searchTerm.value.trim().toLowerCase()
    const matchKeyword = !keyword || item.title.toLowerCase().includes(keyword)
    return matchCategory && matchKeyword
  })
)
const currentSectionTitle = computed(() => {
  const currentCategory = pageData.categories.find(item => item.value === activeCategory.value)
  return currentCategory?.label || '全部礼品'
})
const redeemableCount = computed(() =>
  visibleItems.value.filter(item => getProductState(item).canRedeem).length
)

void loadPageData().catch(showError)
onShow(() => {
  guardRouteAccess('/pages/points/exchange', '/pages/home/index')
})

async function loadPageData() {
  Object.assign(pageData, await getPointGiftPageData())
  Object.assign(confirmData, await getPointGiftConfirmData())
  activeCategory.value = pageData.categories[0]?.value || 'all'
  searchTerm.value = ''
}

function handlePopupChange(context: { visible: boolean }) {
  confirmVisible.value = context.visible
}

function openPendingGifts() {
  uni.navigateTo({ url: '/pages/profile/gifts' })
}

function openConfirm(item: PointGiftPageData['items'][number]) {
  const productState = getProductState(item)
  if (!productState.canRedeem) {
    uni.showToast({
      title: productState.actionText,
      icon: 'none'
    })
    return
  }

  activeGiftId.value = item.id
  redeemQuantity.value = 1
  confirmData.giftName = item.title
  confirmData.requiredPoints = item.cost
  confirmData.availablePoints = String(currentIntegral.value)
  confirmVisible.value = true
}

function changeRedeemQuantity(step: number) {
  const nextValue = redeemQuantity.value + step
  redeemQuantity.value = Math.max(1, Math.min(redeemQuantityLimit.value, nextValue))
}

async function redeemGift() {
  if (!activeGiftItem.value) {
    return
  }

  const required = Number(activeGiftItem.value.cost || 0) * redeemQuantity.value
  if (required > currentIntegral.value) {
    uni.showToast({
      title: '当前积分不足',
      icon: 'none'
    })
    return
  }

  if (!userStore.profile.uid) {
    uni.showToast({
      title: '缺少用户标识，请重新登录',
      icon: 'none'
    })
    return
  }

  if (!activeGiftItem.value.barcodeId || !activeGiftItem.value.storeId || !activeGiftItem.value.stockId) {
    uni.showToast({
      title: '商品信息不完整，暂无法兑换',
      icon: 'none'
    })
    return
  }

  try {
    const result = await submitPointGift({
      userUid: userStore.profile.uid,
      barcodeId: activeGiftItem.value.barcodeId,
      storeId: activeGiftItem.value.storeId,
      stockId: activeGiftItem.value.stockId,
      number: redeemQuantity.value
    })

    userStore.updateProfile({
      integral: typeof result.integral === 'number' ? result.integral : currentIntegral.value - required,
      coin: typeof result.coin === 'number' ? result.coin : userStore.profile.coin,
      ticket: typeof result.ticket === 'number' ? result.ticket : userStore.profile.ticket
    })

    activeGiftItem.value.stock = Math.max(0, activeGiftItem.value.stock - redeemQuantity.value)
    if (activeGiftItem.value.stock <= 0) {
      activeGiftItem.value.stateMode = 'soldout'
    }

    confirmVisible.value = false
    uni.showToast({
      title: result.message || '兑换成功，已加入待取礼品',
      icon: 'none'
    })
    setTimeout(() => {
      uni.navigateTo({ url: '/pages/profile/gifts' })
    }, 250)
  } catch (error) {
    const message = error instanceof Error ? error.message : '兑换失败'
    uni.showToast({
      title: message,
      icon: 'none'
    })
  }
}

function getProductState(item: PointGiftItem) {
  const stock = Math.max(0, Number(item.stock) || 0)
  const cost = Number(item.cost || 0)

  if (item.stateMode === 'available') {
    return {
      canRedeem: true,
      tone: 'available',
      stockText: stock <= 3 ? `仅剩${stock}件` : `库存${stock}件`,
      stateText: '可兑换',
      actionText: '立即兑换'
    }
  }

  if (item.stateMode === 'insufficient') {
    return {
      canRedeem: false,
      tone: 'insufficient',
      stockText: stock <= 3 ? `仅剩${stock}件` : `库存${stock}件`,
      stateText: '积分不足',
      actionText: item.shortfallText || '积分不足'
    }
  }

  if (item.stateMode === 'soldout' || stock <= 0) {
    return {
      canRedeem: false,
      tone: 'soldout',
      stockText: '库存不足',
      stateText: '已兑完',
      actionText: '已兑完'
    }
  }

  if (currentIntegral.value >= cost) {
    return {
      canRedeem: true,
      tone: 'available',
      stockText: stock <= 3 ? `仅剩${stock}件` : `库存${stock}件`,
      stateText: '可兑换',
      actionText: '立即兑换'
    }
  }

  const diff = cost - currentIntegral.value
  return {
    canRedeem: false,
    tone: 'insufficient',
    stockText: stock <= 3 ? `仅剩${stock}件` : `库存${stock}件`,
    stateText: '积分不足',
    actionText: `还差${formatPoints(String(diff))}积分`
  }
}

function formatPoints(value: string) {
  return Number(value || 0).toLocaleString('zh-CN')
}

function parsePointsValue(primaryValue: number, fallbackValue: string) {
  if (Number.isFinite(primaryValue) && primaryValue > 0) {
    return primaryValue
  }

  const normalizedFallback = Number(String(fallbackValue || '').replace(/,/g, ''))
  if (Number.isFinite(normalizedFallback) && normalizedFallback > 0) {
    return normalizedFallback
  }

  return 0
}

function showError(error: unknown) {
  const message = error instanceof Error ? error.message : '积分兑换数据加载失败'
  uni.showToast({
    title: message,
    icon: 'none'
  })
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.point-gifts {
  min-height: 100vh;
  background: $page-bg;
}

.point-gifts__content {
  padding: 24rpx;
}

.point-gifts__search-wrap {
  margin-top: 24rpx;
}

.point-gifts__search-wrap :deep(.t-search) {
  --td-search-height: 80rpx;
  --td-search-bg-color: #ffffff;
  --td-search-placeholder-color: #9aa8bc;
  border: 2rpx solid $border-light;
  border-radius: 20rpx;
}

.point-gifts__filters {
  display: flex;
  gap: 10rpx;
  margin-top: 24rpx;
  overflow-x: auto;
}

.point-gifts__filter {
  flex: none;
  padding: 12rpx 24rpx;
  border: 2rpx solid $border-light;
  border-radius: 20rpx;
  background: #fff;
  text-align: center;
  font-size: 13px;
  color: $text-strong;
  line-height: 1;
}

.point-gifts__filter--active {
  border-color: $primary;
  background: $primary;
  color: #fff;
}

.point-gifts__section-head {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 26rpx;
}

.point-gifts__accent {
  width: 4rpx;
  height: 24rpx;
  border-radius: 999rpx;
  background: $primary;
  box-shadow: 0 0 8rpx rgba(37, 141, 232, 0.5);
}

.point-gifts__section-title {
  margin-left: 12rpx;
  font-size: 28rpx;
  color: $text-strong;
}

.point-gifts__section-meta {
  width: 100%;
  margin-top: 8rpx;
  margin-left: 16rpx;
  font-size: 22rpx;
  color: $text-tertiary;
}

.point-gifts__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18rpx;
  margin-top: 20rpx;
}

.point-gifts__card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-radius: 20rpx;
  background: #fff;
  min-height: 420rpx;
  border: 2rpx solid $border-light;
}

.point-gifts__empty {
  grid-column: 1 / -1;
  min-height: 200rpx;
  border: 2rpx dashed $border-light;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  color: $text-tertiary;
  background: #fff;
}

.point-gifts__thumb {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 220rpx;
  background: #f4f8ff;
}

.point-gifts__thumb-image {
  width: 132rpx;
  height: 132rpx;
}

.point-gifts__card-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12rpx;
  padding: 20rpx 20rpx 22rpx;
}

.point-gifts__card-title {
  display: block;
  color: $text-strong;
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1.4;
}

.point-gifts__cost-row {
  display: flex;
  align-items: baseline;
}

.point-gifts__cost {
  font-size: 44rpx;
  font-weight: 700;
  color: #111827;
}

.point-gifts__cost-unit {
  margin-left: 6rpx;
  font-size: 22rpx;
  color: $text-strong;
}

.point-gifts__meta-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}

.point-gifts__stock {
  font-size: 22rpx;
  color: $text-tertiary;
}

.point-gifts__state {
  flex: 0 0 auto;
  min-width: 96rpx;
  height: 44rpx;
  padding: 0 14rpx;
  border-radius: 22rpx;
  text-align: center;
  line-height: 44rpx;
  font-size: 22rpx;
}

.point-gifts__state--available {
  background: rgba(21, 93, 252, 0.1);
  color: $primary;
}

.point-gifts__state--insufficient {
  background: rgba(247, 144, 9, 0.12);
  color: #c56d00;
}

.point-gifts__state--soldout {
  background: #f2f4f7;
  color: $text-tertiary;
}

.point-gifts__action {
  width: 100%;
  min-height: 76rpx;
  margin-top: auto;
  border: 2rpx solid #d8dee8;
  border-radius: 16rpx;
  background: #f8fafc;
  text-align: center;
  line-height: 72rpx;
  font-size: 24rpx;
  color: $text-tertiary;
}

.point-gifts__action--primary {
  border-color: $primary;
  background: $primary;
  color: #fff;
}

.point-gifts__popup-main {
  display: flex;
}

.point-gifts__popup-thumb {
  width: 180rpx;
  height: 180rpx;
  border-radius: 24rpx;
  background: $page-bg;
  display: flex;
  align-items: center;
  justify-content: center;
}

.point-gifts__popup-thumb-image {
  width: 120rpx;
  height: 120rpx;
}

.point-gifts__popup-meta {
  margin-left: 20rpx;
}

.point-gifts__popup-gift {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: $primary;
}

.point-gifts__popup-line {
  display: block;
  margin-top: 16rpx;
  font-size: 28rpx;
  color: $text-secondary;
}

.point-gifts__stepper {
  display: grid;
  grid-template-columns: 76rpx 1fr 76rpx;
  align-items: center;
  height: 88rpx;
  margin-top: 30rpx;
  overflow: hidden;
  border: 2rpx solid $border-light;
  border-radius: 20rpx;
}

.point-gifts__stepper-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: #f8fafc;
  font-size: 40rpx;
  color: $text-strong;
}

.point-gifts__stepper-button--disabled {
  color: #c5ceda;
}

.point-gifts__stepper-value {
  text-align: center;
  font-size: 30rpx;
  font-weight: 600;
  color: $text-strong;
}

.point-gifts__popup-hint-box {
  display: flex;
  margin-top: 36rpx;
  padding: 22rpx 20rpx;
  border-radius: 24rpx;
  background: $page-bg;
}

.point-gifts__popup-hint-dot {
  width: 12rpx;
  height: 12rpx;
  margin-top: 6rpx;
  margin-right: 12rpx;
  background: #d9d9d9;
}

.point-gifts__popup-hint {
  display: block;
  font-size: 24rpx;
  line-height: 1.5;
  color: $text-strong;
}

.point-gifts__popup-cancel {
  display: block;
  margin-top: 28rpx;
  text-align: center;
  font-size: 32rpx;
  color: $text-strong;
}
</style>
