<template>
  <view class="ranking-page">
    <app-header title="排名" />

    <sticky-page-top :height-rpx="104">
      <view class="ranking-tabs">
        <t-tabs
          v-model:value="activeTab"
          theme="line"
          bottom-line-mode="fixed"
          :swipeable="false"
          :split="false"
        >
          <t-tab-panel
            v-for="tab in tabs"
            :key="tab.value"
            :label="tab.label"
            :value="tab.value"
          />
        </t-tabs>
      </view>
    </sticky-page-top>

    <view v-if="machineSelectOpen" class="ranking-filter-mask" @click="machineSelectOpen = false"></view>

    <view class="ranking-page__body">
      <view class="ranking-control-row">
        <view class="ranking-filter-wrap">
          <view
            class="ranking-filter"
            :class="{ 'ranking-filter--active': machineSelectOpen }"
            @click="machineSelectOpen = !machineSelectOpen"
          >
            <text>{{ selectedMachineType }}</text>
            <TIcon
              :name="machineSelectOpen ? 'chevron-up' : 'chevron-down'"
              size="28rpx"
              color="#155dfc"
            />
          </view>

          <view v-if="machineSelectOpen" class="ranking-filter__panel">
            <view
              v-for="item in machineTypeOptions"
              :key="item.value"
              class="ranking-filter__option"
              :class="{ 'ranking-filter__option--active': selectedMachineValue === item.value }"
              @click.stop="handleMachineTypeChange(item.value)"
            >
              <text>{{ item.label }}</text>
              <TIcon
                v-if="selectedMachineValue === item.value"
                name="check"
                size="32rpx"
                color="#155dfc"
              />
            </view>
          </view>
        </view>
        <view class="ranking-my-rank">
          <text>我的排名</text>
          <text class="ranking-my-rank__chip">{{ currentDataset?.myRank || '#--' }}</text>
        </view>
      </view>

      <view class="ranking-podium-card">
        <view class="ranking-podium-card__head">
          <text class="ranking-podium-card__tag">排名前三</text>
          <text class="ranking-podium-card__note">{{ currentDataset?.note }}</text>
        </view>

        <view class="ranking-podium">
          <view
            v-for="item in currentDataset?.podium || []"
            :key="item.rank"
            class="ranking-podium__item"
            :class="`ranking-podium__item--${item.trophy}`"
          >
            <text class="ranking-podium__badge" :class="`ranking-podium__badge--${item.trophy}`">
              NO.{{ item.rank }}
            </text>
            <view class="ranking-podium__avatar" :class="`ranking-podium__avatar--${item.trophy}`">
              {{ item.avatar }}
            </view>
            <text class="ranking-podium__name">{{ item.name }}</text>
            <text class="ranking-podium__score">{{ item.value }}{{ item.unit }}</text>
            <view class="ranking-podium__base" :class="`ranking-podium__base--${item.trophy}`">
              {{ item.baseLabel }}
            </view>
          </view>
        </view>
      </view>

      <view class="ranking-list-card">
        <view v-for="item in currentDataset?.list || []" :key="item.rank" class="ranking-list-row">
          <view class="ranking-list-row__user">
            <text class="ranking-list-row__rank">{{ item.rank }}</text>
            <text class="ranking-list-row__avatar" :class="item.avatarClass">{{ item.avatar }}</text>
            <text class="ranking-list-row__name">{{ item.name }}</text>
          </view>
          <view class="ranking-list-row__value">
            <text class="ranking-list-row__score">{{ item.value }}</text>
            <text>{{ item.unit }}</text>
          </view>
        </view>
      </view>
    </view>

    <CustomTabBar model-value="ranking" />
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import AppHeader from '@/components/common/AppHeader.vue'
import CustomTabBar from '@/components/common/layout/CustomTabBar.vue'
import StickyPageTop from '@/components/common/layout/StickyPageTop.vue'
import TIcon from 'tdesign-uniapp/icon/icon.vue'
import {
  getRankingPageData,
  type RankingMachineType,
  type RankingPageData,
  type RankingTab
} from '@/services/ranking'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const pageData = reactive<RankingPageData>({
  tabs: [],
  machineTypes: [],
  rankings: {
    machine: {
      entertainment: { myRank: '', note: '', podium: [], list: [] },
      claw: { myRank: '', note: '', podium: [], list: [] },
      gashapon: { myRank: '', note: '', podium: [], list: [] },
      pinball: { myRank: '', note: '', podium: [], list: [] }
    },
    points: {
      entertainment: { myRank: '', note: '', podium: [], list: [] },
      claw: { myRank: '', note: '', podium: [], list: [] },
      gashapon: { myRank: '', note: '', podium: [], list: [] },
      pinball: { myRank: '', note: '', podium: [], list: [] }
    }
  }
})

const activeTab = ref<RankingTab>('machine')
const machineSelectOpen = ref(false)
const selectedMachineValue = ref<RankingMachineType>('entertainment')

const tabs = computed(() => pageData.tabs)
const machineTypeOptions = computed(() => pageData.machineTypes)
const selectedMachineType = computed(() => {
  const currentOption = pageData.machineTypes.find(item => item.value === selectedMachineValue.value)
  return currentOption?.label || '机台类型'
})
const currentStoreName = computed(() => userStore.selectedStoreName || '欢乐谷旗舰店')
const currentDataset = computed(
  () => mapRankingByStore(pageData.rankings[activeTab.value]?.[selectedMachineValue.value])
)

loadPageData()

async function loadPageData() {
  Object.assign(pageData, await getRankingPageData())
}

function handleMachineTypeChange(value: string | number) {
  const currentValue = value as RankingMachineType
  selectedMachineValue.value = currentValue
  machineSelectOpen.value = false
}

function mapRankingByStore(dataset?: RankingPageData['rankings'][RankingTab][RankingMachineType]) {
  if (!dataset) {
    return dataset
  }

  if (currentStoreName.value.includes('额企鹅驱蚊器')) {
    return {
      ...dataset,
      myRank: dataset.myRank === '#--' ? dataset.myRank : '#8',
      note: dataset.note.replace('排序', `排序 · ${currentStoreName.value}`),
      podium: dataset.podium.map((item, index) =>
        index === 0 ? { ...item, name: `${item.name}·额企鹅` } : item
      ),
      list: dataset.list.map((item, index) =>
        index === 0 ? { ...item, name: `${item.name}·额企鹅店` } : item
      )
    }
  }

  if (currentStoreName.value.includes('大大大大')) {
    return {
      ...dataset,
      myRank: dataset.myRank === '#--' ? dataset.myRank : '#5',
      note: dataset.note.replace('排序', `排序 · ${currentStoreName.value}`),
      podium: dataset.podium.map((item, index) =>
        index === 1 ? { ...item, name: `${item.name}·大大店` } : item
      ),
      list: dataset.list.map((item, index) =>
        index === 1 ? { ...item, name: `${item.name}·大大店` } : item
      )
    }
  }

  return dataset
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.ranking-page {
  min-height: 100vh;
  background: $page-bg;
  position: relative;
}

.ranking-tabs {
  background: #fff;
  --td-tab-item-height: 104rpx;
  --td-tab-font-size: 28rpx;
  --td-tab-item-color: #6b7c93;
  --td-tab-item-active-color: #155dfc;
  --td-tab-track-width: 116rpx;
  --td-tab-track-thickness: 4rpx;
  --td-tab-track-radius: 999rpx;
  --td-tab-track-color: #155dfc;
}

.ranking-tabs :deep(.t-tabs__content) {
  display: none;
}

.ranking-page__body {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 24rpx;
  position: relative;
  z-index: 20;
}

.ranking-control-row {
  display: grid;
  grid-template-columns: 296rpx 1fr;
  gap: 24rpx;
  position: relative;
  z-index: 30;
}

.ranking-filter-wrap {
  position: relative;
}

.ranking-filter-mask {
  position: fixed;
  inset: 0;
  z-index: 10;
  background: transparent;
}

.ranking-filter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 88rpx;
  padding: 0 28rpx;
  border: 2rpx solid $border-light;
  border-radius: 20rpx;
  box-sizing: border-box;
  background: #fff;
  color: $text-strong;
  font-size: 28rpx;
  line-height: 40rpx;
  font-weight: 600;
}

.ranking-filter--active {
  border-color: #cfe0ff;
}

.ranking-filter__panel {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 8rpx);
  overflow: hidden;
  border: 2rpx solid $border-light;
  border-radius: 20rpx;
  background: #fff;
  box-shadow: 0 12rpx 24rpx rgba(15, 23, 42, 0.08);
}

.ranking-filter__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 88rpx;
  padding: 0 28rpx;
  font-size: 28rpx;
  color: $text-strong;
  background: #fff;
}

.ranking-filter__option + .ranking-filter__option {
  border-top: 2rpx solid $border-light;
}

.ranking-filter__option--active {
  color: $primary;
}

.ranking-my-rank {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  border-radius: 20rpx;
  padding: 0 24rpx;
  background: linear-gradient(90deg, $primary-dark 0%, $primary-light 100%);
  color: #fff;
  font-size: 28rpx;
  line-height: 40rpx;
  font-weight: 700;
}

.ranking-my-rank__chip {
  min-width: 96rpx;
  height: 48rpx;
  padding: 0 20rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.2);
  text-align: center;
  line-height: 48rpx;
  font-size: 26rpx;
}

.ranking-podium-card {
  padding: 32rpx;
  border: 2rpx solid $border-light;
  border-radius: 20rpx;
  background: linear-gradient(90deg, #fff 0%, #f4f9ff 100%);
}

.ranking-podium-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32rpx;
}

.ranking-podium-card__tag {
  min-width: 148rpx;
  height: 48rpx;
  padding: 0 24rpx;
  border-radius: 20rpx;
  background: #eaf2ff;
  text-align: center;
  line-height: 48rpx;
  font-size: 28rpx;
  color: $primary;
}

.ranking-podium-card__note {
  font-size: 26rpx;
  color: $text-tertiary;
}

.ranking-podium {
  display: grid;
  grid-template-columns: 184rpx 222rpx 184rpx;
  align-items: end;
  justify-content: center;
  gap: 16rpx;
}

.ranking-podium__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  text-align: center;
}

.ranking-podium__item--secondary,
.ranking-podium__item--third {
  padding-top: 62rpx;
}

.ranking-podium__badge {
  min-width: 100rpx;
  height: 44rpx;
  padding: 0 20rpx;
  border-radius: 999rpx;
  text-align: center;
  line-height: 44rpx;
  font-size: 24rpx;
  font-weight: 700;
}

.ranking-podium__badge--secondary,
.ranking-podium__badge--third {
  background: #f3f6fb;
}

.ranking-podium__badge--secondary {
  color: #70849e;
}

.ranking-podium__badge--champion {
  background: #fff3d9;
  color: #b7791f;
}

.ranking-podium__badge--third {
  color: #b96a4b;
}

.ranking-podium__avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fff;
  font-weight: 500;
  line-height: 1;
}

.ranking-podium__avatar--secondary,
.ranking-podium__avatar--third {
  width: 112rpx;
  height: 112rpx;
  border: 6rpx solid #9aa8bc;
  color: #9aa8bc;
  font-size: 40rpx;
}

.ranking-podium__avatar--champion {
  width: 144rpx;
  height: 144rpx;
  border: 8rpx solid #f2b94b;
  color: #f2b94b;
  font-size: 48rpx;
}

.ranking-podium__avatar--third {
  border-color: #e6a07b;
  color: #e6a07b;
}

.ranking-podium__name {
  font-size: 26rpx;
  color: $text-strong;
}

.ranking-podium__score {
  font-size: 28rpx;
  font-weight: 700;
  color: $primary;
}

.ranking-podium__base {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 152rpx;
  height: 112rpx;
  border-radius: 24rpx;
  font-size: 24rpx;
}

.ranking-podium__base--secondary {
  border: 2rpx solid rgba(154, 168, 188, 0.25);
  background: #f6f8fc;
  color: #70849e;
}

.ranking-podium__base--champion {
  width: 192rpx;
  height: 152rpx;
  border: 2rpx solid rgba(242, 185, 75, 0.25);
  background: #fff8e7;
  color: #b7791f;
}

.ranking-podium__base--third {
  border: 2rpx solid #f9e1d5;
  background: #fff7f3;
  color: #e6a07b;
}

.ranking-list-card {
  overflow: hidden;
  border: 2rpx solid $border-light;
  border-radius: 20rpx;
  background: #fff;
}

.ranking-list-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 126rpx;
  padding: 32rpx;
}

.ranking-list-row + .ranking-list-row {
  border-top: 2rpx solid $border-light;
}

.ranking-list-row__user {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 16rpx;
}

.ranking-list-row__rank {
  width: 40rpx;
  text-align: center;
  font-size: 32rpx;
  color: #000;
}

.ranking-list-row__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  font-size: 24rpx;
  color: #fff;
}

.ranking-list-row__avatar--a {
  background: #7a9bff;
}

.ranking-list-row__avatar--b {
  background: #42a5f5;
}

.ranking-list-row__avatar--c {
  background: #5b8def;
}

.ranking-list-row__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 28rpx;
  color: $text-strong;
}

.ranking-list-row__value {
  display: flex;
  align-items: baseline;
  gap: 16rpx;
  flex: 0 0 auto;
  font-size: 24rpx;
  color: $text-tertiary;
}

.ranking-list-row__score {
  font-size: 28rpx;
  font-weight: 700;
  color: $primary;
}
</style>
