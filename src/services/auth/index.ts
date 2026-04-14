import { APP_CONFIG } from '@/config'
import { withModuleMock } from '@/mock'
import {
  completeUserProfileRequest,
  getCurrentUserProfileRequest,
  getWechatPhoneNumberRequest,
  loginWithWechatCodeRequest,
  sendPhoneLoginCodeRequest,
  verifyPhoneLoginCodeRequest
} from './api'
import type {
  AuthLoginResult,
  AuthScene,
  AuthSceneConfig,
  AuthUserProfile,
  PhoneCodeSendResult,
  ProfileCompletePayload,
  ProfileCompleteResult
} from './types'

export function getAuthSceneConfig(scene: AuthScene) {
  return withModuleMock<'auth', AuthSceneConfig>(
    'auth',
    module => module.getAuthSceneConfig(scene)
  )
}

export function loginWithWechatCode(code: string) {
  if (APP_CONFIG.authUseReal) {
    return loginWithWechatCodeRequest(code)
  }

  return withModuleMock<'auth', AuthLoginResult>(
    'auth',
    module => module.loginWithWechatCode(code)
  )
}

export function sendPhoneLoginCode(phone: string) {
  if (APP_CONFIG.authUseReal) {
    return sendPhoneLoginCodeRequest(phone)
  }

  return withModuleMock<'auth', PhoneCodeSendResult>(
    'auth',
    module => module.sendPhoneLoginCode(phone)
  )
}

export function getWechatPhoneNumber(code: string, storeId: number | null, sessionId?: string) {
  if (APP_CONFIG.authUseReal) {
    return getWechatPhoneNumberRequest(code, storeId, sessionId)
  }

  return withModuleMock<'auth', AuthUserProfile>(
    'auth',
    module => module.getCurrentUserProfile()
  )
}

export function verifyPhoneLoginCode(phone: string, code: string) {
  if (APP_CONFIG.authUseReal) {
    return verifyPhoneLoginCodeRequest(phone, code)
  }

  return withModuleMock<'auth', AuthLoginResult>(
    'auth',
    module => module.verifyPhoneLoginCode(phone, code)
  )
}

export function completeUserProfile(payload: ProfileCompletePayload) {
  if (APP_CONFIG.authUseReal) {
    return completeUserProfileRequest(payload)
  }

  return withModuleMock<'auth', ProfileCompleteResult>(
    'auth',
    module => module.completeUserProfile(payload)
  )
}

export function getCurrentUserProfile() {
  if (APP_CONFIG.authUseReal) {
    return getCurrentUserProfileRequest()
  }

  return withModuleMock<'auth', AuthUserProfile>(
    'auth',
    module => module.getCurrentUserProfile()
  )
}

export type {
  AuthDialogStep,
  AuthLoginResult,
  AuthScene,
  AuthSceneConfig,
  AuthUserProfile,
  LoginType,
  PhoneCodeSendResult,
  ProfileCompletePayload,
  ProfileCompleteResult,
  UserMode
} from './types'
