# 登录模块总览

## 当前范围

- `src/components/common/auth/AuthDialog.vue`
- `src/pages/profile/info.vue`
- `src/services/auth/*`

## 当前状态

- 微信登录、手机验证码、手机号获取、资料补全、当前用户信息已开始接真实接口
- 认证链路采用页面模型优先策略，服务层负责字段映射与空值补位
- 在“仅以 `API-微信用户端接口.md` 为准”的口径下，微信登录、手机号获取、资料补全、当前用户信息可对齐
- 手机验证码发送 / 校验接口不在 `# 微信用户端` 章节内，属于总文档其他章节能力

## 页面模型与接口匹配情况

- `AuthUserProfile.uid`：接口提供 `uid` / `uuid`，可映射
- `AuthUserProfile.memberId`：接口提供 `cardFactorySerial`，可派生映射
- `AuthUserProfile.avatar`：可直接映射
- `AuthUserProfile.phone`：可直接映射
- `AuthUserProfile.address`：可直接映射
- `AuthUserProfile.storeId`：可直接映射
- `AuthUserProfile.coin`：可直接映射
- `AuthUserProfile.integral`：可直接映射
- `AuthUserProfile.ticket`：可直接映射
- `AuthUserProfile.status`：可直接映射
- `AuthLoginResult.sessionId`：可直接映射
- `AuthLoginResult.loginType`：前端派生字段，接口未显式返回
- `AuthLoginResult.requiresProfileComplete`：前端派生字段，接口未显式返回

## 可直接接入的地方

- `AuthDialog` 微信登录主入口：可用 `POST /wechat/member/onlogin`
- 微信手机号授权补全：可用 `GET /wechat/member/GetUserPhoneNumber`
- 当前用户资料刷新：可用 `GET /wechat/member/userinfo`
- 昵称 / 地址 / 头像等资料保存：可用 `POST /wechat/member/updateaddress`
- `profile/info.vue` 顶部身份信息与资料区：可由 `userinfo` + `updateaddress` 支撑

## 缺失字段清单

- `memberId`：后端未直接返回，需要由 `cardFactorySerial` / `uid` 派生
- `requiresProfileComplete`：后端未返回，需要前端按 `nickname/phone` 派生
- `loginType`：后端未显式返回，需要前端按登录方式补充
- `ProfileCompleteResult.success`：后端仅返回 `data: true`，当前由前端包装
- `PhoneCodeSendResult.maskedPhone` / `resendAfterSeconds` / `expireSeconds`：后端验证码接口未提供，当前由前端补齐

## 继续保留 mock 或前端包装的部分

- 手机验证码登录流程：当前项目可用，但不属于 `微信用户端` 章节范围
- `AuthSceneConfig`：纯前端场景文案模型，后端无对应接口
- `手机号修改` 弹窗里的倒计时、脱敏手机号、过期时间：后端未提供，需要前端包装

## 不符合原因归类

- 缺少字段：
  - `memberId`
  - `requiresProfileComplete`
  - `loginType`
  - 验证码发送后的倒计时与过期时间
- 缺少接口：
  - 无专门的“获取登录弹窗场景配置”接口
  - 若严格限定为 `微信用户端` 章节，则缺少“手机号验证码发送 / 校验”接口

## 接入策略

- 优先保留页面模型字段，不反向要求页面吃后端原始结构
- 服务层只做映射、空值补位、派生字段包装
- 若后端未来补出更完整用户模型，再考虑逐步减少前端派生字段
