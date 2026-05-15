# 我的模块总览

## 当前范围

- `src/pages/profile/index.vue`
- `src/pages/profile/info.vue`
- `src/pages/profile/gifts.vue`
- `src/pages/profile/gift-records.vue`
- `src/pages/profile/bill.vue`
- `src/services/profile/*`

## 当前状态

- `profile/info.vue` 已完成真实接入
- `profile/index.vue` 身份区已真实接入（昵称、会员号），待领取礼品数量已由真实 API（userexpends?takeFlag=2）提供
- `profile/bill.vue` 账单三类记录已真实接入（购币 / 兑换 / 积分兑换礼品）
- `profile/gifts.vue` 列表层和领取确认已真实接入（userexpends + userpickup）
- `profile/gift-records.vue` 互赠记录列表已真实接入（usertransfer give=true/false）
- `我的首页` 菜单结构仍由 mock facade 提供
- 最新微信用户端文档已经覆盖一批可作为候选来源的接口，但暂未形成完整页面闭环

## 候选真实接口

- `GET /wechat/member/userinfo`
- `POST /wechat/member/updateaddress`
- `GET /wechat/member/userexpends`
- `GET /wechat/member/usertransfer?give=true|false`
- `GET /wechat/member/redeem`
- `GET /api/cashregister/userbuys`
- `GET /wechat/member/qrcode`
- `POST /wechat/member/userpickup`

## 可直接接入的地方

- `profile/info.vue` 的昵称、手机号、地址、会员卡号、资产信息：可用 `userinfo`
- `profile/info.vue` 的昵称 / 地址 / 头像保存：可用 `updateaddress`
- `profile/index.vue` 顶部会员身份信息：可由 `userinfo` 直接支撑
- `profile/info.vue` 现已真实接入
- `profile/gifts.vue` 的列表层：可由 `userexpends` 支撑
- `profile/gifts.vue` 的领取确认动作：可由 `userpickup` 支撑
- `profile/gift-records.vue` 的列表层：已接入 `usertransfer`（give=true/false）

## 可部分接入但建议暂不替换整页模型的地方

- `profile/index.vue` 待领取礼品数量：已由 `userexpends?takeFlag=2` 提供真实计数
- `profile/bill.vue` 购币记录：可由 `userbuys` 提供一部分
- `profile/bill.vue` 彩票兑换记录：可由 `redeem` 提供一部分
- `profile/bill.vue` 礼品兑换记录：可由 `userexpends` 提供一部分
- `profile/gifts.vue` 的核销码 / 确认领取动作：仍缺少明确接口返回或闭环
- `profile/gift-records.vue` 的二维码与重发链接：仍缺少接口

## 继续保持 mock 的地方

- `profile/gift-records.vue` 状态 / 二维码 / 重发链接
- `profile/bill.vue` 游戏币消费流水（缺接口）
- `profile/index.vue` 菜单区结构（静态配置，无后端接口）

## 不符合原因归类

- 缺少字段：
  - `profile/gifts.vue` 的 `pickupAddress`
  - `profile/gifts.vue` 的 `qrValue`
  - `profile/gifts.vue` 的 `expired` 独立状态来源
  - `profile/gift-records.vue` 的 `statusType`
  - `profile/gift-records.vue` 的 `statusText`
  - `profile/gift-records.vue` 的 `actionText`
  - `profile/gift-records.vue` 的 `qrValue`
  - `profile/bill.vue` 的统一 `amount/status/tab` 聚合结果
- 缺少接口：
  - 互赠记录缺少"退回 / 超时未领取 / 重发链接"能力接口
  - 账单缺少统一聚合接口，尤其缺少"游戏投币消费"记录接口

## 页面级判断

- `profile/index.vue`
  - 可接：会员昵称、会员号、待领取礼品数量（userexpends?takeFlag=2）
  - 保持 mock：菜单区结构（静态配置）
  - 原因：菜单无后端接口，待领取数量已由真实 API 提供
- `profile/info.vue`
  - 可接：整页基础资料展示与资料保存
  - 保持 mock：手机号验证码修改体验中的倒计时与流程包装
  - 原因：严格按 `微信用户端` 章节看，缺少验证码接口；按全量总文档则已有接口但仍需前端包装字段
- `profile/gifts.vue`
  - 可接：待领 / 已领列表、领取确认动作
  - 保持 mock：过期态、核销码
  - 原因：部分字段仍由 mock 填充（pickupAddress、qrValue、expired 独立状态）
- `profile/gift-records.vue`
  - 已接：我赠出的、我收到的基础流水（usertransfer give=true/false）
  - 保持 mock：领取状态、二维码、重发链接、退回态
  - 原因：缺字段 + 缺接口并存
- `profile/bill.vue`
  - 可局部接：购币、彩票兑换、礼品兑换三类记录
  - 保持 mock：统一账单、时间分组、游戏币消费流水
  - 原因：缺少统一账单接口

## 接入策略

- `profile/info.vue` 继续优先使用真实接口
- `profile/index.vue` 身份区+待领取数量已真实接入，菜单仍用 mock（静态配置）
- `profile/bill.vue` 账单三类记录已真实接入，游戏币消费流水缺接口仍空
- `profile/gifts.vue` 列表层和领取确认已真实接入（userexpends + userpickup），核销码和过期态仍由 mock 填充
- `profile/gift-records.vue` 列表层已真实接入（usertransfer give=true/false），领取状态、二维码、重发链接仍 mock
- 列表请求失败时直接暴露真实接口问题，不再回退 mock
- 只有当 `userexpends / usertransfer / userbuys / redeem` 四组接口可以稳定拼出页面模型时，才替换对应子页面的剩余动作层
