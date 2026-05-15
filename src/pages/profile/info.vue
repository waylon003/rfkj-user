<template>
  <PageLayout class="profile-info">
    <template #header>
    <profile-hero :back="true" :overflow-visible="true">
      <view class="profile-info__identity">
        <view class="profile-info__avatar-wrap">
          <button class="profile-info__avatar-btn" open-type="chooseAvatar" @chooseavatar="handleChooseAvatar">
            <view class="profile-info__avatar" :style="{ backgroundImage: avatarUrl ? `url(${avatarUrl})` : '' }"></view>
          </button>
          <view v-if="avatarUrl" class="profile-info__avatar-edit">
            <t-icon name="camera" size="32rpx" color="#fff" />
          </view>
        </view>
        <text class="profile-info__name">{{ displayName }}</text>
        <text class="profile-info__id">{{ displayMemberId }}</text>
      </view>
    </profile-hero>
    </template>

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

    <t-popup :visible="phonePopupVisible" placement="bottom" :close-on-overlay-click="true" @visible-change="handlePhonePopupVisibleChange">
      <popup-panel title="修改手机号" @close="phonePopupVisible = false">
        <view class="profile-edit__field-label">当前手机号</view>
        <view class="profile-edit__readonly">{{ maskedCurrentPhone }}</view>

        <view class="profile-edit__field-label profile-edit__field-label--top">新手机号</view>
        <view class="profile-edit__input-wrap">
          <t-input
            v-model:value="phoneValue"
            type="number"
            clearable
            placeholder="请输入新手机号"
            :maxlength="11"
            :borderless="true"
            :custom-style="popupInputStyle"
          />
        </view>

        <view class="profile-edit__field-label profile-edit__field-label--top">验证码</view>
        <view class="profile-edit__code-row">
          <view class="profile-edit__input-wrap profile-edit__input-wrap--code">
            <t-input
              v-model:value="phoneCodeValue"
              class="profile-edit__code-input"
              type="number"
              clearable
              placeholder="请输入验证码"
              :maxlength="6"
              :borderless="true"
              :custom-style="popupInputStyle"
            />
          </view>
          <t-button
            theme="primary"
            variant="outline"
            size="small"
            shape="round"
            :disabled="!canSendPhoneCode"
            @click="sendPhoneCode"
          >
            {{ phoneCodeButtonText }}
          </t-button>
        </view>

        <text class="profile-edit__hint">验证码校验通过后，将同步更新会员手机号。</text>

        <template #actions>
          <popup-primary-button label="确认修改" @click="savePhone" />
        </template>
      </popup-panel>
    </t-popup>

    <t-popup :visible="addressPopupVisible" placement="bottom" :close-on-overlay-click="true" @visible-change="handleAddressPopupVisibleChange">
      <popup-panel title="修改常用地址" @close="addressPopupVisible = false">
        <view class="profile-edit__field-label">所在地区</view>
        <view class="profile-edit__picker-field" @click="addressCascaderVisible = true">
          <text :class="['profile-edit__picker-text', { 'profile-edit__picker-text--placeholder': !addressRegionValue }]">
            {{ addressRegionValue || '请选择省/市/区' }}
          </text>
          <text class="profile-edit__picker-arrow">›</text>
        </view>

        <view class="profile-edit__field-label profile-edit__field-label--top">详细地址</view>
        <view class="profile-edit__textarea-wrap">
          <t-textarea
            v-model:value="addressDetailValue"
            :bordered="false"
            :maxlength="80"
            :indicator="true"
            placeholder="请输入详细地址，如：欢乐谷旗舰店一楼服务台"
            :custom-style="addressTextareaStyle"
          />
        </view>

        <text class="profile-edit__hint">保存后将作为默认联系地址展示。</text>

        <template #actions>
          <popup-primary-button label="确认修改" @click="saveAddress" />
        </template>
      </popup-panel>
    </t-popup>

    <t-cascader
      v-model:visible="addressCascaderVisible"
      v-model:value="addressRegionCode"
      :options="addressOptions"
      title="选择所在地区"
      theme="tab"
      :sub-titles="['请选择省份', '请选择城市', '请选择区县']"
      @change="handleAddressRegionChange"
    />
  </PageLayout>
</template>

<script setup lang="ts">
import { computed, onUnmounted, reactive, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import TButton from 'tdesign-uniapp/button/button.vue'
import TCascader from 'tdesign-uniapp/cascader/cascader.vue'
import TInput from 'tdesign-uniapp/input/input.vue'
import TTextarea from 'tdesign-uniapp/textarea/textarea.vue'
import PageLayout from '@/components/common/layout/PageLayout.vue'
import ProfileHero from '@/components/common/layout/ProfileHero.vue'
import SectionCard from '@/components/common/layout/SectionCard.vue'
import PopupPanel from '@/components/common/popup/PopupPanel.vue'
import PopupPrimaryButton from '@/components/common/popup/PopupPrimaryButton.vue'
import { getProfileInfoData, type ProfileInfoData } from '@/services/profile'
import {
  completeUserProfile,
  getCurrentUserProfile,
  sendPhoneLoginCode,
  verifyPhoneLoginCode
} from '@/services/auth'
import { guardRouteAccess } from '@/utils/auth'
import { useUserStore } from '@/stores'
import { APP_CONFIG } from '@/config'

const userStore = useUserStore()
const pageData = reactive<ProfileInfoData>({
  brandName: '',
  memberId: '',
  sections: []
})

const nicknamePopupVisible = ref(false)
const phonePopupVisible = ref(false)
const addressPopupVisible = ref(false)
const addressCascaderVisible = ref(false)
const nicknameValue = ref('')
const phoneValue = ref('')
const phoneCodeValue = ref('')
const resendSeconds = ref(0)
const addressRegionCode = ref('')
const addressRegionValue = ref('')
const addressDetailValue = ref('')
const avatarUrl = ref('')
const nicknameInputStyle = {
  '--td-input-bg-color': 'transparent',
  '--td-input-vertical-padding': '0'
}
const popupInputStyle = {
  '--td-input-bg-color': 'transparent',
  '--td-input-vertical-padding': '0'
}
const addressTextareaStyle = {
  width: '100%',
  '--td-textarea-background-color': 'transparent',
  '--td-textarea-padding': '24rpx'
}
const addressOptions = [
  {
    label: '广东省',
    value: '440000',
    children: [
      {
        label: '中山市',
        value: '442000',
        children: [
          { label: '东区', value: '442000001' },
          { label: '西区', value: '442000002' },
          { label: '南区', value: '442000003' },
          { label: '石岐区', value: '442000004' }
        ]
      }
    ]
  },
  {
    label: '湖南省',
    value: '430000',
    children: [
      {
        label: '长沙市',
        value: '430100',
        children: [
          { label: '芙蓉区', value: '430102' },
          { label: '天心区', value: '430103' },
          { label: '岳麓区', value: '430104' }
        ]
      }
    ]
  }
] as const
let resendTimer: ReturnType<typeof setInterval> | undefined

void loadPageData().catch(showError)
onShow(async () => {
  guardRouteAccess('/pages/profile/info', '/pages/profile/index')
  try {
    await syncCurrentProfile()
  } catch (error) {
    showError(error)
  }
})

async function loadPageData() {
  Object.assign(pageData, await getProfileInfoData())
  avatarUrl.value = userStore.profile.avatar || ''
}

const displayName = computed(() => userStore.profile.nickname || pageData.brandName)
const displayMemberId = computed(() => userStore.profile.memberId || pageData.memberId)
const maskedCurrentPhone = computed(() => maskPhone(userStore.profile.phone))
const canSendPhoneCode = computed(() => /^1\d{10}$/.test(phoneValue.value) && resendSeconds.value === 0)
const phoneCodeButtonText = computed(() =>
  resendSeconds.value > 0 ? `${resendSeconds.value}s后重试` : '发送验证码'
)
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
    return
  }

  if (label === '手机号') {
    phoneValue.value = userStore.profile.phone || ''
    phoneCodeValue.value = ''
    phonePopupVisible.value = true
    return
  }

  if (label === '常用地址') {
    const { region, detail } = splitAddress(userStore.profile.address || '')
    addressRegionValue.value = region
    addressDetailValue.value = detail
    addressRegionCode.value = findRegionCodeByLabels(region)
    addressPopupVisible.value = true
  }
}

function handlePopupVisibleChange(context: { visible: boolean }) {
  nicknamePopupVisible.value = context.visible
}

async function handleChooseAvatar(event: any) {
  const tempFilePath = event?.detail?.avatarUrl
  if (!tempFilePath) {
    uni.showToast({
      title: '未获取到头像',
      icon: 'none'
    })
    return
  }

  try {
    uni.showLoading({ title: '上传中...', mask: true })

    // 上传头像到服务器
    const uploadedUrl = await uploadImage(tempFilePath)

    // 更新本地显示
    avatarUrl.value = uploadedUrl

    // 更新用户资料
    await completeUserProfile({
      nickname: displayName.value,
      avatar: uploadedUrl,
      phone: userStore.profile.phone || undefined,
      address: userStore.profile.address || undefined
    })

    userStore.updateProfile({ avatar: uploadedUrl })

    uni.hideLoading()
    uni.showToast({
      title: '头像已更新',
      icon: 'success'
    })
  } catch (error) {
    uni.hideLoading()
    showError(error)
  }
}

function uploadImage(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${APP_CONFIG.authBaseUrl}/api/upload/image`,
      filePath,
      name: 'file',
      header: {
        Authorization: `Bearer ${userStore.sessionId}`
      },
      success(res) {
        try {
          const data = JSON.parse(res.data)
          if (data.code === 200) {
            // 直接返回图片 URL
            resolve(data.data)
          } else {
            reject(new Error(data.message || '上传失败'))
          }
        } catch (e) {
          reject(new Error('解析响应失败'))
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

function handlePhonePopupVisibleChange(context: { visible: boolean }) {
  phonePopupVisible.value = context.visible
  if (!context.visible) {
    phoneCodeValue.value = ''
    stopResendTimer()
  }
}

function handleAddressPopupVisibleChange(context: { visible: boolean }) {
  addressPopupVisible.value = context.visible
  if (!context.visible) {
    addressCascaderVisible.value = false
  }
}

function handleAddressRegionChange(context: { value: string | number; selectedOptions: Array<string | { label?: string }> }) {
  addressRegionCode.value = String(context.value || '')
  addressRegionValue.value = context.selectedOptions
    .map(option => (typeof option === 'string' ? option : option?.label || ''))
    .filter(Boolean)
    .join(' ')
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

async function sendPhoneCode() {
  if (!/^1\d{10}$/.test(phoneValue.value)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    })
    return
  }

  try {
    const result = await sendPhoneLoginCode(phoneValue.value)
    startResendTimer(result.resendAfterSeconds)
    uni.showToast({
      title: result.message,
      icon: 'none'
    })
  } catch (error) {
    showError(error)
  }
}

async function savePhone() {
  if (!/^1\d{10}$/.test(phoneValue.value)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    })
    return
  }

  if (!/^\d{4,6}$/.test(phoneCodeValue.value)) {
    uni.showToast({
      title: '请输入正确的验证码',
      icon: 'none'
    })
    return
  }

  try {
    await verifyPhoneLoginCode(phoneValue.value, phoneCodeValue.value)

    const result = await completeUserProfile({
      nickname: displayName.value,
      phone: phoneValue.value,
      address: buildAddress(addressRegionValue.value, addressDetailValue.value) || userStore.profile.address || undefined
    })

    userStore.updateProfile({
      phone: result.userInfo.phone || phoneValue.value
    })
    await syncCurrentProfile()
    phonePopupVisible.value = false
    stopResendTimer()
    uni.showToast({
      title: '手机号已更新',
      icon: 'none'
    })
  } catch (error) {
    showError(error)
  }
}

async function saveAddress() {
  const address = buildAddress(addressRegionValue.value, addressDetailValue.value)
  if (!address) {
    uni.showToast({
      title: '请输入常用地址',
      icon: 'none'
    })
    return
  }

  try {
    const result = await completeUserProfile({
      nickname: displayName.value,
      phone: userStore.profile.phone || undefined,
      address
    })

    userStore.updateProfile({
      address: result.userInfo.address || address
    })
    await syncCurrentProfile()
    addressPopupVisible.value = false
    uni.showToast({
      title: '地址已更新',
      icon: 'none'
    })
  } catch (error) {
    showError(error)
  }
}

async function syncCurrentProfile() {
  if (!userStore.isLoggedIn) {
    return
  }

  try {
    const profile = await getCurrentUserProfile()
    userStore.updateProfile({
      nickname: profile.nickname,
      memberId: profile.memberId,
      avatar: profile.avatar,
      phone: profile.phone,
      address: profile.address,
      storeId: profile.storeId,
      coin: profile.coin,
      integral: profile.integral,
      ticket: profile.ticket,
      status: profile.status
    })
  } catch (error) {
    console.warn('syncCurrentProfile failed', error)
    throw error
  }
}

function startResendTimer(seconds: number) {
  stopResendTimer()
  resendSeconds.value = seconds
  resendTimer = setInterval(() => {
    if (resendSeconds.value <= 1) {
      stopResendTimer()
      return
    }
    resendSeconds.value -= 1
  }, 1000)
}

function stopResendTimer() {
  if (resendTimer) {
    clearInterval(resendTimer)
    resendTimer = undefined
  }
  resendSeconds.value = 0
}

function buildAddress(region: string, detail: string) {
  return [region.trim(), detail.trim()].filter(Boolean).join(' ')
}

function splitAddress(value: string) {
  const normalized = value.trim()
  if (!normalized) {
    return { region: '', detail: '' }
  }

  const parts = normalized.split(/\s+/)
  if (parts.length <= 1) {
    return { region: '', detail: normalized }
  }

  return {
    region: parts.slice(0, Math.min(3, parts.length - 1)).join(' '),
    detail: parts.slice(Math.min(3, parts.length - 1)).join(' ')
  }
}

function findRegionCodeByLabels(regionText: string) {
  const labels = regionText.trim().split(/\s+/).filter(Boolean)
  if (!labels.length) {
    return ''
  }

  for (const province of addressOptions) {
    if (province.label !== labels[0]) continue
    if (labels.length === 1) return String(province.value)

    for (const city of province.children || []) {
      if (city.label !== labels[1]) continue
      if (labels.length === 2) return String(city.value)

      for (const district of city.children || []) {
        if (district.label === labels[2]) {
          return String(district.value)
        }
      }
    }
  }

  return ''
}

function maskPhone(value: string) {
  if (!/^1\d{10}$/.test(value)) {
    return value || '暂未绑定'
  }

  return `${value.slice(0, 3)}****${value.slice(-4)}`
}

function showError(error: unknown) {
  const message = error instanceof Error ? error.message : '请求失败'
  uni.showToast({
    title: message,
    icon: 'none'
  })
}

onUnmounted(() => {
  stopResendTimer()
})
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

.profile-info__avatar-wrap {
  position: relative;
  width: 144rpx;
  height: 144rpx;
  margin-bottom: 24rpx;
}

.profile-info__avatar {
  width: 144rpx;
  height: 144rpx;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #eef4ff;
  @include public-cover($public-demo-image-2);
}

.profile-info__avatar-edit {
  position: absolute;
  bottom: -18rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-info__avatar-btn {
  position: relative;
  width: 144rpx;
  height: 144rpx;
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  border-radius: 50%;
  line-height: normal;
}

.profile-info__avatar-btn::after {
  border: none;
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

.profile-edit__field-label {
  font-size: 24rpx;
  color: $text-strong;
}

.profile-edit__field-label--top {
  margin-top: 24rpx;
}

.profile-edit__readonly {
  margin-top: 16rpx;
  padding: 24rpx 28rpx;
  border-radius: 24rpx;
  background: $page-bg;
  font-size: 26rpx;
  color: $text-secondary;
}

.profile-edit__code-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-top: 16rpx;
}

.profile-edit__input-wrap {
  margin-top: 16rpx;
  padding: 0 20rpx;
  min-height: 96rpx;
  border-radius: 24rpx;
  background: #f4f8ff;
  display: flex;
  align-items: center;
}

.profile-edit__input-wrap--code {
  flex: 1;
  margin-top: 0;
}

.profile-edit__code-input {
  flex: 1;
}

.profile-edit__hint {
  display: block;
  margin-top: 18rpx;
  font-size: 24rpx;
  line-height: 1.6;
  color: $text-tertiary;
}

.profile-edit__picker-field,
.profile-edit__textarea-wrap {
  margin-top: 16rpx;
  border-radius: 24rpx;
  background: #f4f8ff;
}

.profile-edit__picker-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 96rpx;
  padding: 0 24rpx;
}

.profile-edit__picker-text {
  font-size: 26rpx;
  color: $text-strong;
}

.profile-edit__picker-text--placeholder {
  color: $text-tertiary;
}

.profile-edit__picker-arrow {
  font-size: 32rpx;
  color: #c9d2e0;
}

</style>
