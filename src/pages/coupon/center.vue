<template>
  <view class="sub-page">
    <app-header title="优惠券中心" subtitle="活动券、充值券统一归 coupon 模块" back />

    <view class="sub-page__inner">
      <view class="focus-card">
        <text class="focus-card__label">可领取权益</text>
        <text class="focus-card__value">2 张新券待领取</text>
        <text class="focus-card__hint">后续接接口时建议单独保留券列表、领券、核销三个能力</text>
      </view>

      <view class="list-card">
        <view class="list-row">
          <text>满 99 减 20</text>
          <text>2026-04-15</text>
        </view>
        <view class="list-row">
          <text>周末体验券</text>
          <text>2026-04-07</text>
        </view>
        <view class="list-row">
          <text>首充礼包券</text>
          <text>长期有效</text>
        </view>
      </view>

      <view class="primary-button">一键领取</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import AppHeader from '@/components/common/AppHeader.vue'
</script>

<style scoped lang="scss">
@import '@/styles/page-common.scss';
</style>
