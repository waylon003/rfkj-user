<template>
  <view class="policy-page">
    <app-header title="会员条款" :back="true" />

    <view class="policy-page__content">
      <view class="policy-page__section">
        <text class="policy-page__title">会员条款</text>
        <text class="policy-page__paragraph">
          登录后，你将以会员身份使用如风科技用户端中的会员二维码、积分兑换、赠送游戏币、待取礼品、互赠记录、账单查询等服务。
        </text>
      </view>

      <view class="policy-page__section">
        <text class="policy-page__section-title">一、会员服务范围</text>
        <view class="policy-page__list">
          <text class="policy-page__list-item">1. 查看会员二维码、资产信息和门店专属权益。</text>
          <text class="policy-page__list-item">2. 使用游戏币、彩票、积分相关功能。</text>
          <text class="policy-page__list-item">3. 查询待取礼品、互赠记录和账单明细。</text>
          <text class="policy-page__list-item">4. 在当前门店下参与活动、兑换礼品和核销服务。</text>
        </view>
      </view>

      <view class="policy-page__section">
        <text class="policy-page__section-title">二、会员权益与限制</text>
        <text class="policy-page__paragraph">
          会员二维码、礼品核销码、游戏币、彩票、积分及相关记录，均与当前会员身份和当前门店绑定。不同门店的活动规则、礼品库存、排行榜数据和可用权益可能存在差异。
        </text>
        <text class="policy-page__paragraph">
          礼品兑换成功后，请以系统记录和门店核销结果为准；游戏币、彩票、积分的发放和扣减，以实际结算结果为准。
        </text>
      </view>

      <view class="policy-page__section">
        <text class="policy-page__section-title">三、门店与活动说明</text>
        <text class="policy-page__paragraph">
          你可在用户端切换当前门店。切换门店后，首页活动、排行榜、礼品展示、会员二维码及相关记录会按当前门店展示。请在使用前确认当前所选门店是否正确。
        </text>
      </view>

      <view class="policy-page__section">
        <text class="policy-page__section-title">四、条款接受</text>
        <text class="policy-page__paragraph">
          继续登录或使用会员服务，即视为你已阅读并接受本条款。若你不同意本条款内容，请停止登录或停止使用会员相关功能。
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import AppHeader from '@/components/common/AppHeader.vue'
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.policy-page {
  min-height: 100vh;
  background: $page-bg;
}

.policy-page__content {
  padding: 24rpx;
}

.policy-page__section {
  padding: 32rpx;
  border: 2rpx solid $border-light;
  border-radius: 28rpx;
  background: #fff;
}

.policy-page__title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  color: $text-strong;
}

.policy-page__section-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $text-strong;
}

.policy-page__paragraph {
  display: block;
  margin-top: 20rpx;
  font-size: 26rpx;
  line-height: 1.7;
  color: $text-secondary;
}

.policy-page__list {
  margin-top: 18rpx;
}

.policy-page__list-item {
  display: block;
  font-size: 26rpx;
  line-height: 1.8;
  color: $text-secondary;
}
</style>
