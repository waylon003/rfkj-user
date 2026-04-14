<template>
  <t-popup
    :visible="visible"
    placement="center"
    :close-on-overlay-click="true"
    @visible-change="handleVisibleChange"
  >
    <popup-panel :title="panelTitle" mode="center" @close="emit('update:visible', false)">
      <view class="auth-dialog">
        <text class="auth-dialog__desc">{{ sceneConfig.description }}</text>

        <view v-if="step === 'welcome'" class="auth-dialog__section">
          <t-button
            theme="primary"
            shape="round"
            block
            :disabled="!agreed"
            @click="handleWechatLogin"
          >
            {{ sceneConfig.primaryActionText }}
          </t-button>
          <t-button
            v-if="sceneConfig.secondaryActionText"
            variant="outline"
            theme="primary"
            shape="round"
            block
            :disabled="!agreed"
            @click="step = 'phone-input'"
          >
            {{ sceneConfig.secondaryActionText }}
          </t-button>
        </view>

        <view v-else-if="step === 'phone-input'" class="auth-dialog__section">
          <t-input v-model:value="phone" type="number" clearable placeholder="请输入手机号" />
          <t-button theme="primary" shape="round" block :disabled="!canSendCode" @click="handleSendCode">
            发送验证码
          </t-button>
        </view>

        <view v-else-if="step === 'wechat-login'" class="auth-dialog__section">
          <text class="auth-dialog__tip">请先授权微信手机号，用于补全会员身份与绑定当前门店。</text>
          <t-button
            theme="primary"
            shape="round"
            block
            open-type="getPhoneNumber"
            @getphonenumber="handleWechatPhoneNumber"
          >
            微信手机号一键绑定
          </t-button>
        </view>

        <view v-else-if="step === 'code-verify'" class="auth-dialog__section">
          <text class="auth-dialog__tip">验证码已发送至 {{ maskedPhone }}</text>
          <t-input v-model:value="code" type="number" clearable placeholder="请输入验证码" />
          <view class="auth-dialog__row">
            <t-button variant="outline" theme="primary" shape="round" @click="step = 'phone-input'">
              返回上一步
            </t-button>
            <t-button theme="primary" shape="round" :disabled="!canVerifyCode" @click="handleVerifyCode">
              确认登录
            </t-button>
          </view>
          <t-button
            variant="outline"
            theme="primary"
            shape="round"
            block
            :disabled="resendSeconds > 0"
            @click="handleSendCode"
          >
            {{ resendText }}
          </t-button>
        </view>

        <view v-else-if="step === 'profile-complete'" class="auth-dialog__section">
          <t-input v-model:value="nickname" clearable placeholder="请输入昵称" />
          <t-input v-model:value="address" clearable placeholder="请输入常用地址" />
          <t-button theme="primary" shape="round" block :disabled="!canCompleteProfile" @click="handleCompleteProfile">
            保存资料
          </t-button>
        </view>

        <view class="auth-dialog__agreement">
          <view class="auth-dialog__checkbox" @click="agreed = !agreed">
            <view class="auth-dialog__checkbox-icon" :class="{ 'auth-dialog__checkbox-icon--checked': agreed }">
              <t-icon v-if="agreed" name="check" size="20rpx" color="#ffffff" />
            </view>
            <text class="auth-dialog__agreement-text">已阅读并同意</text>
          </view>
          <text class="auth-dialog__link" @click.stop="showPolicy('隐私政策')">《隐私政策》</text>
          <text class="auth-dialog__link" @click.stop="showPolicy('会员条款')">《会员条款》</text>
        </view>
      </view>
    </popup-panel>
  </t-popup>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import TButton from 'tdesign-uniapp/button/button.vue'
import TIcon from 'tdesign-uniapp/icon/icon.vue'
import TInput from 'tdesign-uniapp/input/input.vue'
import PopupPanel from '@/components/common/popup/PopupPanel.vue'
import {
  completeUserProfile,
  getCurrentUserProfile,
  getAuthSceneConfig,
  getWechatPhoneNumber,
  loginWithWechatCode,
  sendPhoneLoginCode,
  verifyPhoneLoginCode,
  type AuthDialogStep,
  type AuthScene,
  type AuthSceneConfig
} from '@/services/auth'
import { useAppStore, useUserStore } from '@/stores'

const props = withDefaults(
  defineProps<{
    visible: boolean
    scene?: AuthScene
  }>(),
  {
    scene: 'generic'
  }
)

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}>()

const appStore = useAppStore()
const userStore = useUserStore()
const step = ref<AuthDialogStep>('welcome')
const agreed = ref(false)
const phone = ref('')
const code = ref('')
const nickname = ref('')
const address = ref('')
const maskedPhone = ref('')
const resendSeconds = ref(0)
const pendingSessionId = ref('')
const pendingLoginType = ref<'wechat' | 'phoneCode'>('wechat')
const sceneConfig = ref<AuthSceneConfig>({
  scene: 'generic',
  title: '登录后继续',
  description: '登录后可同步会员信息、资产和门店权益。',
  primaryActionText: '微信快捷登录',
  secondaryActionText: '手机号验证码登录'
})
let resendTimer: ReturnType<typeof setInterval> | undefined

const panelTitle = computed(() => {
  if (step.value === 'wechat-login') return '绑定手机号'
  if (step.value === 'phone-input') return '手机号登录'
  if (step.value === 'code-verify') return '验证码验证'
  if (step.value === 'profile-complete') return '补全资料'
  return sceneConfig.value.title
})
const canSendCode = computed(() => agreed.value && /^1\d{10}$/.test(phone.value) && resendSeconds.value === 0)
const canVerifyCode = computed(() => agreed.value && /^1\d{10}$/.test(phone.value) && /^\d{4,6}$/.test(code.value))
const canCompleteProfile = computed(() => agreed.value && nickname.value.trim().length >= 2)
const resendText = computed(() =>
  resendSeconds.value > 0 ? `重新发送(${resendSeconds.value}s)` : '重新发送'
)

watch(
  () => props.visible,
  async visible => {
    if (!visible) {
      resetDialog()
      return
    }

    sceneConfig.value = await getAuthSceneConfig(props.scene)
    step.value = 'welcome'
  },
  { immediate: true }
)

function resetDialog() {
  step.value = 'welcome'
  agreed.value = false
  phone.value = ''
  code.value = ''
  nickname.value = ''
  address.value = ''
  maskedPhone.value = ''
  pendingSessionId.value = ''
  pendingLoginType.value = 'wechat'
  stopResendTimer()
}

function handleVisibleChange(context: { visible: boolean }) {
  emit('update:visible', context.visible)
}

async function handleWechatLogin() {
  if (!agreed.value) {
    remindAgreement()
    return
  }

  try {
    const code = await getWechatLoginCode()
    const result = await loginWithWechatCode(code)
    let userInfo = result.userInfo
    try {
      userInfo = await getCurrentUserProfile()
    } catch (error) {
      console.warn('getCurrentUserProfile fallback to login payload', error)
    }
    if (!userInfo.phone) {
      pendingSessionId.value = result.sessionId
      pendingLoginType.value = result.loginType
      step.value = 'wechat-login'
      return
    }
    userStore.login({
      sessionId: result.sessionId,
      loginType: result.loginType,
      userInfo,
      isProfileCompleted: !result.requiresProfileComplete
    })
    if (result.requiresProfileComplete) {
      nickname.value = userInfo.nickname
      address.value = userInfo.address
      step.value = 'profile-complete'
      return
    }
    finishAuth()
  } catch (error) {
    showError(error)
  }
}

async function handleSendCode() {
  if (!agreed.value) {
    remindAgreement()
    return
  }

  if (!/^1\d{10}$/.test(phone.value)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none'
    })
    return
  }

  try {
    const result = await sendPhoneLoginCode(phone.value)
    maskedPhone.value = result.maskedPhone
    startResendTimer(result.resendAfterSeconds)
    step.value = 'code-verify'
  } catch (error) {
    showError(error)
  }
}

async function handleWechatPhoneNumber(event: any) {
  const wxCode = event?.detail?.code
  if (!wxCode || wxCode === 'the code is a mock one') {
    uni.showToast({
      title: '未获取到微信手机号授权码',
      icon: 'none'
    })
    return
  }

  try {
    const userInfo = await getWechatPhoneNumber(
      wxCode,
      userStore.selectedStoreId,
      pendingSessionId.value || undefined
    )

    userStore.login({
      sessionId: pendingSessionId.value,
      loginType: pendingLoginType.value,
      userInfo,
      isProfileCompleted: Boolean(userInfo.nickname)
    })
    if (!userInfo.nickname) {
      nickname.value = userInfo.nickname
      address.value = userInfo.address
      phone.value = userInfo.phone
      step.value = 'profile-complete'
      return
    }

    try {
      const refreshedUserInfo = await getCurrentUserProfile()
      userStore.updateProfile({
        nickname: refreshedUserInfo.nickname,
        memberId: refreshedUserInfo.memberId,
        avatar: refreshedUserInfo.avatar,
        phone: refreshedUserInfo.phone,
        address: refreshedUserInfo.address,
        storeId: refreshedUserInfo.storeId,
        coin: refreshedUserInfo.coin,
        integral: refreshedUserInfo.integral,
        ticket: refreshedUserInfo.ticket,
        status: refreshedUserInfo.status
      })
    } catch (error) {
      console.warn('getCurrentUserProfile after phone bind failed', error)
    }

    finishAuth()
  } catch (error) {
    showError(error)
  }
}

async function handleVerifyCode() {
  if (!agreed.value) {
    remindAgreement()
    return
  }

  if (!canVerifyCode.value) {
    uni.showToast({
      title: '请输入正确的验证码',
      icon: 'none'
    })
    return
  }

  try {
    const result = await verifyPhoneLoginCode(phone.value, code.value)
    userStore.login({
      sessionId: result.sessionId,
      loginType: result.loginType,
      userInfo: result.userInfo,
      isProfileCompleted: !result.requiresProfileComplete
    })
    if (result.requiresProfileComplete) {
      nickname.value = result.userInfo.nickname
      address.value = result.userInfo.address
      step.value = 'profile-complete'
      return
    }
    finishAuth()
  } catch (error) {
    showError(error)
  }
}

async function handleCompleteProfile() {
  if (!agreed.value) {
    remindAgreement()
    return
  }

  if (!canCompleteProfile.value) {
    uni.showToast({
      title: '昵称至少 2 个字符',
      icon: 'none'
    })
    return
  }

  try {
    const result = await completeUserProfile({
      nickname: nickname.value,
      address: address.value,
      phone: phone.value || undefined
    })
    let userInfo = result.userInfo
    try {
      userInfo = await getCurrentUserProfile()
    } catch (error) {
      console.warn('getCurrentUserProfile fallback to complete profile payload', error)
    }
    userStore.updateProfile({
      nickname: userInfo.nickname,
      address: userInfo.address,
      phone: userInfo.phone
    })
    finishAuth()
  } catch (error) {
    showError(error)
  }
}

function finishAuth() {
  emit('update:visible', false)
  emit('success')
  const pendingRoute = appStore.pendingAuthRoute
  appStore.clearPendingAuthRoute()
  if (pendingRoute) {
    uni.redirectTo({ url: pendingRoute })
  }
}

function remindAgreement() {
  uni.showToast({
    title: '请先阅读并同意相关条款',
    icon: 'none'
  })
}

function showError(error: unknown) {
  const message = error instanceof Error ? error.message : '请求失败'
  uni.showToast({
    title: message,
    icon: 'none'
  })
}

function showPolicy(name: string) {
  if (name === '隐私政策') {
    uni.navigateTo({ url: '/pages/auth/privacy-policy' })
    return
  }

  uni.navigateTo({ url: '/pages/auth/member-terms' })
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

onUnmounted(() => {
  stopResendTimer()
})

function getWechatLoginCode() {
  return new Promise<string>((resolve, reject) => {
    uni.login({
      success(res) {
        if (res.code) {
          resolve(res.code)
          return
        }
        reject(new Error(res.errMsg || '未获取到微信登录 code'))
      },
      fail(err) {
        reject(err)
      }
    })
  })
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.auth-dialog__desc {
  display: block;
  font-size: 26rpx;
  line-height: 1.6;
  color: $text-secondary;
  text-align: center;
}

.auth-dialog__section {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-top: 28rpx;
}

.auth-dialog__tip {
  font-size: 26rpx;
  line-height: 1.6;
  color: $text-secondary;
}

.auth-dialog__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}

.auth-dialog__agreement {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 8rpx;
  margin-top: 28rpx;
  min-height: 48rpx;
  font-size: 24rpx;
  line-height: 48rpx;
  color: $text-secondary;
}

.auth-dialog__checkbox {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  min-height: 48rpx;
}

.auth-dialog__checkbox-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid #c9d2e0;
  border-radius: 50%;
  background: #fff;
  box-sizing: border-box;
}

.auth-dialog__checkbox-icon--checked {
  border-color: $primary;
  background: $primary;
}

.auth-dialog__agreement-text {
  display: inline-flex;
  align-items: center;
  line-height: 48rpx;
  color: $text-secondary;
}

.auth-dialog__link {
  display: inline-flex;
  align-items: center;
  line-height: 48rpx;
  color: $primary;
}
</style>
