<template>
  <view class="policy-page">
    <app-header title="隐私政策" :back="true" />

    <view class="policy-page__content">
      <view class="policy-page__section">
        <text class="policy-page__title">隐私政策</text>
        <text class="policy-page__paragraph">
          本政策用于说明如风科技用户端在提供会员服务、门店选择、礼品兑换、账单查询、互赠记录和门店核销等功能时，如何收集、使用、存储和保护你的个人信息。
        </text>
      </view>

      <view class="policy-page__section">
        <text class="policy-page__section-title">一、我们可能收集的信息</text>
        <view class="policy-page__list">
          <text class="policy-page__list-item">1. 登录信息：微信登录标识、会话标识、手机号。</text>
          <text class="policy-page__list-item">2. 资料信息：昵称、头像、常用地址、当前门店。</text>
          <text class="policy-page__list-item">3. 账户信息：游戏币、彩票、积分、礼品领取记录、账单记录。</text>
          <text class="policy-page__list-item">4. 服务信息：二维码核销、互赠记录、当前设备或门店操作记录。</text>
        </view>
      </view>

      <view class="policy-page__section">
        <text class="policy-page__section-title">二、我们如何使用这些信息</text>
        <view class="policy-page__list">
          <text class="policy-page__list-item">1. 用于生成会员二维码、核销码和礼品领取凭证。</text>
          <text class="policy-page__list-item">2. 用于展示你的游戏币、彩票、积分等资产信息。</text>
          <text class="policy-page__list-item">3. 用于提供账单查询、互赠记录、待取礼品等会员服务。</text>
          <text class="policy-page__list-item">4. 用于根据当前门店展示对应活动、礼品、排行榜和会员权益。</text>
        </view>
      </view>

      <view class="policy-page__section">
        <text class="policy-page__section-title">三、信息共享与保护</text>
        <text class="policy-page__paragraph">
          除法律法规要求或为完成你主动发起的服务所必需外，我们不会向无关第三方提供你的个人信息。我们会采取合理的技术和管理措施，尽力保护你的账户资料和交易记录安全。
        </text>
      </view>

      <view class="policy-page__section">
        <text class="policy-page__section-title">四、你的选择权</text>
        <text class="policy-page__paragraph">
          你可以选择不登录并以游客模式浏览公开内容，但部分会员服务将无法使用。若你不同意本政策中的任一条款，请停止登录或停止使用相关会员服务。
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
