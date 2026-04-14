# Mock API 契约：用户端页面模型

本文档用于定义当前小程序用户端在“真实接口未齐全”前提下的前端页面模型与 Mock API 契约。

目标：

- 先按页面需要设计数据结构，而不是被当前真实接口倒推页面
- 后续真实接口补齐后，只需要逐项对比本契约：
  - 能直接映射：直接接入
  - 字段不够：在 service 层转换
  - 模型不匹配：再决定是否调整页面模型

来源参考：

- [API-微信用户端与验证码接口.md](E:/rfkj-user/API-微信用户端与验证码接口.md)
- 当前项目已有页面、mock 模块与游客/会员双态设计

## 一、用户状态模型

### 1. 用户模式

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| mode | `guest \| member` | 游客 / 已登录会员 |
| loginType | `wechat \| phoneCode \| null` | 登录方式 |
| sessionId | string | 登录会话标识 |
| selectedStoreId | number \| null | 当前选中门店 |
| selectedStoreName | string | 当前选中门店名 |
| isProfileCompleted | boolean | 资料是否已补全 |

### 2. 用户资料模型

```ts
interface AuthUserProfile {
  uid: string
  nickname: string
  avatar: string
  phone: string
  address: string
  storeId: number | null
  memberId: string
  coin: number
  integral: number
  ticket: number
  status: boolean
}
```

## 二、登录注册弹窗页面模型

### 1. 弹窗步骤

```ts
type AuthDialogStep =
  | 'welcome'
  | 'wechat-login'
  | 'phone-input'
  | 'code-verify'
  | 'profile-complete'
  | 'success'
```

### 2. 弹窗场景

```ts
type AuthScene =
  | 'generic'
  | 'member-code'
  | 'gift-coin'
  | 'purchase-coin'
  | 'points-exchange'
  | 'ticket-exchange'
  | 'profile'
  | 'bill'
  | 'gift-records'
```

### 3. 场景配置

```ts
interface AuthSceneConfig {
  scene: AuthScene
  title: string
  description: string
  primaryActionText: string
  secondaryActionText?: string
}
```

建议文案：

- `member-code`：登录后查看会员二维码
- `gift-coin`：登录后可赠送游戏币
- `purchase-coin`：登录后可购买游戏币
- `points-exchange`：登录后可兑换礼品
- `ticket-exchange`：登录后可使用彩票兑积分
- `profile`：登录后查看我的资料
- `bill`：登录后查看我的账单

## 三、Mock 服务契约

### 1. 获取登录弹窗场景配置

```ts
getAuthSceneConfig(scene: AuthScene): Promise<AuthSceneConfig>
```

### 2. 微信登录

```ts
loginWithWechatCode(code: string): Promise<{
  sessionId: string
  loginType: 'wechat'
  requiresProfileComplete: boolean
  userInfo: AuthUserProfile
}>
```

说明：

- 页面里仍然通过 `wx.login` 获取 `code`
- 当前阶段先 mock 返回完整登录态
- 未来真实接口对接目标：`/wechat/member/onlogin`

### 3. 发送登录验证码

```ts
sendPhoneLoginCode(phone: string): Promise<{
  phone: string
  maskedPhone: string
  resendAfterSeconds: number
  expireSeconds: number
  message: string
}>
```

未来真实接口对接目标：

- `POST /api/verifyCode/send?phone=...`

### 4. 验证手机验证码并登录

```ts
verifyPhoneLoginCode(phone: string, code: string): Promise<{
  sessionId: string
  loginType: 'phoneCode'
  requiresProfileComplete: boolean
  userInfo: AuthUserProfile
}>
```

未来真实接口对接目标：

- `POST /api/verifyCode/check?phone=...&code=...`

### 5. 补全用户资料

```ts
completeUserProfile(payload: {
  nickname: string
  phone?: string
  address?: string
  avatar?: string
}): Promise<{
  success: boolean
  userInfo: AuthUserProfile
}>
```

未来真实接口对接目标：

- `POST /wechat/member/updateaddress`

### 6. 获取当前登录用户信息

```ts
getCurrentUserProfile(): Promise<AuthUserProfile>
```

未来真实接口对接目标：

- `GET /wechat/member/userinfo`

## 四、游客态与登录后能力边界

### 游客可浏览

- 首页公共内容
- 活动列表 / 活动详情
- 排名页
- 门店选择与门店详情
- 商品分类与商品浏览

### 登录后才可执行

- 会员二维码 / 核销码
- 赠送游戏币
- 购币
- 彩票兑积分
- 礼品兑换提交
- 我的账单
- 待取礼品
- 互赠记录
- 我的资料编辑

## 五、页面模块与 Mock 数据依赖

### 首页

需要依赖：

- `mode`
- `profile`
- `selectedStoreName`
- 登录场景弹窗配置

### 我的页

需要依赖：

- `mode`
- `profile`
- 资产信息
- 登录场景弹窗配置

### 会员二维码卡片

需要依赖：

- `mode`
- 登录态用户 ID / 会员信息
- 当前门店

### 门店选择页

需要依赖：

- 当前门店
- 门店列表

### 赠币 / 购币 / 积分兑换 / 彩票兑积分

需要依赖：

- 登录态
- 用户资产
- 当前门店
- 登录拦截场景配置

## 六、真实接口替换策略

后续真实接口新增后，按以下顺序对比：

1. 先看是否覆盖当前页面行为
2. 再看字段是否能直接映射到 Mock 契约
3. 若真实接口字段不足，在 `services/auth` 层做适配转换
4. 只有当真实业务流和当前页面模型冲突时，才改页面模型

## 七、建议实施顺序

1. `userStore` 扩展为 `guest/member` 双态
2. `services/auth` + `mock/modules/auth`
3. `AuthDialog` 统一登录注册弹窗
4. 首页和我的页先接游客态/登录态
5. 再给“会员码/赠币/购币/积分兑换/账单”接统一登录拦截
