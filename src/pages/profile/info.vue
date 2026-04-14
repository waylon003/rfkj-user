<template>
  <view class="profile-info">
    <profile-hero :back="true">
      <view class="profile-info__identity">
        <view class="profile-info__avatar"></view>
        <text class="profile-info__name">{{ displayName }}</text>
        <text class="profile-info__id">{{ displayMemberId }}</text>
      </view>
    </profile-hero>

    <view
      v-for="section in displaySections"
      :key="section.title"
      class="profile-info__section-wrap"
    >
      <section-card :title="section.title" class="profile-info__section">
        <view
          v-for="item in section.items"
          :key="item.label"
          class="profile-info__row"
          @click="handleRowClick(item.label)"
        >
          <text class="profile-info__row-label">{{ item.label }}</text>
          <view class="profile-info__row-value-wrap">
            <view v-if="item.badge" class="profile-info__badge">{{ item.badge }}</view>
            <text class="profile-info__row-value">{{ item.value }}</text>
            <text class="profile-info__row-arrow">›</text>
          </view>
        </view>
      </section-card>
    </view>

    <t-popup :visible="nicknamePopupVisible" placement="bottom" :close-on-overlay-click="true" @visible-change="handlePopupVisibleChange">
      <popup-panel title="修改昵称" @close="nicknamePopupVisible = false">
        <view class="nickname-popup__field-label">新昵称</view>
        <view class="nickname-popup__field">
          <t-input
            v-model:value="nicknameValue"
            class="nickname-popup__input"
            clearable
            :borderless="true"
            :custom-style="nicknameInputStyle"
            :maxlength="20"
            placeholder="请输入昵称"
          />
          <text class="nickname-popup__count">{{ nicknameValue.length }}/20</text>
        </view>
        <text class="nickname-popup__hint">提示：昵称支持中英文，数字，每30天可修改一次。</text>
        <template #actions>
          <popup-primary-button label="确认修改" @click="saveNickname" />
        </template>
      </popup-panel>
    </t-popup>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import TInput from 'tdesign-uniapp/input/input.vue'
import ProfileHero from '@/components/common/layout/ProfileHero.vue'
import SectionCard from '@/components/common/layout/SectionCard.vue'
import PopupPanel from '@/components/common/popup/PopupPanel.vue'
import PopupPrimaryButton from '@/components/common/popup/PopupPrimaryButton.vue'
import { getProfileInfoData, type ProfileInfoData } from '@/services/profile'
import { completeUserProfile } from '@/services/auth'
import { guardRouteAccess } from '@/utils/auth'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const pageData = reactive<ProfileInfoData>({
  brandName: '',
  memberId: '',
  sections: []
})

const nicknamePopupVisible = ref(false)
const nicknameValue = ref('')
const nicknameInputStyle = {
  '--td-input-bg-color': 'transparent',
  '--td-input-vertical-padding': '0'
}

loadPageData()
onShow(() => {
  guardRouteAccess('/pages/profile/info', '/pages/profile/index')
})

async function loadPageData() {
  Object.assign(pageData, await getProfileInfoData())
}

const displayName = computed(() => userStore.profile.nickname || pageData.brandName)
const displayMemberId = computed(() => userStore.profile.memberId || pageData.memberId)
const displaySections = computed(() =>
  pageData.sections.map(section => ({
    ...section,
    items: section.items.map(item => {
      if (item.label === '会员名称') {
        return { ...item, value: displayName.value }
      }

      if (item.label === '账号ID') {
        return { ...item, value: displayMemberId.value.replace(/^ID:/, '') }
      }

      if (item.label === '手机号') {
        return { ...item, value: userStore.profile.phone || item.value }
      }

      if (item.label === '常用地址') {
        return { ...item, value: userStore.profile.address || item.value }
      }

      return item
    })
  }))
)

function handleRowClick(label: string) {
  if (label === '会员名称') {
    nicknameValue.value = displayName.value
    nicknamePopupVisible.value = true
  }
}

function handlePopupVisibleChange(context: { visible: boolean }) {
  nicknamePopupVisible.value = context.visible
}

async function saveNickname() {
  const value = nicknameValue.value.trim()
  if (value.length < 2) {
    uni.showToast({
      title: '昵称至少 2 个字符',
      icon: 'none'
    })
    return
  }

  await completeUserProfile({
    nickname: value,
    address: userStore.profile.address || undefined,
    phone: userStore.profile.phone || undefined
  })

  userStore.updateProfile({ nickname: value })
  nicknamePopupVisible.value = false
  uni.showToast({
    title: '昵称已更新',
    icon: 'none'
  })
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.profile-info {
  min-height: 100vh;
  background: $page-bg;
  position: relative;
}

.profile-info__identity {
  position: absolute;
  left: 50%;
  top: 196rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-50%);
  z-index: 2;
}

.profile-info__avatar {
  width: 144rpx;
  height: 144rpx;
  border-radius: 50%;
  @include public-cover($public-demo-image-2);
}

.profile-info__name {
  margin-top: 8rpx;
  font-size: 32rpx;
  font-weight: 700;
  color: #fff;
}

.profile-info__id {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: rgba(239, 246, 255, 0.95);
}

.profile-info__section-wrap {
  margin: 0 24rpx 24rpx;
  position: relative;
  z-index: 2;
}

.profile-info__section-wrap:first-of-type {
  margin-top: -240rpx;
}

.profile-info__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 104rpx;
  padding: 0 28rpx;
  border-top: 2rpx solid #f6f6f6;
}

.profile-info__row-label {
  font-size: 28rpx;
  color: #314158;
}

.profile-info__row-value-wrap {
  display: flex;
  align-items: center;
}

.profile-info__badge {
  width: 48rpx;
  height: 48rpx;
  margin-right: 12rpx;
  border-radius: 50%;
  background: #ff1010;
  box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.2);
  text-align: center;
  line-height: 48rpx;
  font-size: 24rpx;
  font-weight: 700;
  color: #fff;
}

.profile-info__row-value {
  font-size: 24rpx;
  color: $text-strong;
}

.profile-info__row-arrow {
  margin-left: 10rpx;
  font-size: 30rpx;
  color: #c9d2e0;
}

.nickname-popup__field-label {
  font-size: 24rpx;
  color: $text-strong;
}

.nickname-popup__field {
  display: flex;
  align-items: center;
  margin-top: 18rpx;
  padding: 0 16rpx;
  min-height: 112rpx;
  border-radius: 28rpx;
  background: $page-bg;
}

.nickname-popup__input {
  flex: 1;
}

.nickname-popup__count {
  margin-left: 16rpx;
  font-size: 24rpx;
  color: $text-tertiary;
}

.nickname-popup__hint {
  display: block;
  margin-top: 18rpx;
  font-size: 24rpx;
  color: $primary;
}

</style>
