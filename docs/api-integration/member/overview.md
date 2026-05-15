# 会员辅助模块总览

## 当前范围

- `src/pages/member/gift.vue`
- `src/pages/member/tickets.vue`
- `src/services/member/*`

## 当前状态

- 两个页面都还没有真实接口接入
- 最新微信用户端文档已经提供赠送与兑换能力接口
- 但页面模型和接口能力并不完全一致，需要拆开判断
- `member/gift.vue` 已完成真实赠送提交接入
- `member/tickets.vue` 已完成真实兑换提交接入
- `GET /wechat/member/usertransfer` 查询转账信息已接入，用于 `profile/gift-records.vue`

## 候选真实接口

- `POST /wechat/member/usertransfer`
- `GET /wechat/member/usertransfer`
- `POST /wechat/member/redeem`
- `GET /wechat/member/redeem`
- `GET /wechat/member/userinfo`

## 可直接接入的地方

- `member/gift.vue` 当前资产余额：可复用 `userinfo`
- `member/gift.vue` 提交赠送动作：可用 `POST /wechat/member/usertransfer`
- `member/gift.vue` 当前已真实接入赠送提交，页面仍保留 mock 文案与项目选择模型
- `member/tickets.vue` 提交"彩票兑积分"动作：可用 `POST /wechat/member/redeem` 且固定兑换类型为 `0`
- `member/tickets.vue` 兑换后的真实资产结果：可通过兑换后刷新 `userinfo` 获取
- `profile/gift-records.vue` 互赠记录列表：已接入 `GET /wechat/member/usertransfer`（give=true/false）

## 继续保持 mock 的地方

- `member/gift.vue` 的赠送后二维码与提示模型
- `member/tickets.vue` 的“兑换前精确预估值”

## 不符合原因归类

- 缺少字段：
  - `member/gift.vue` 的 `secondaryBadge`
  - `member/gift.vue` 的 `qrAmount`
  - `member/gift.vue` 的 `qrValue`
  - `member/gift.vue` 的 `qrTipLines`
  - `member/tickets.vue` 的兑换前精确预估积分
- 缺少接口：
  - 赠送后二维码或领取凭证接口
  - 彩票兑换前的预估 / 规则接口

## 页面级判断

- `member/gift.vue`
  - 可接：余额展示、手机号赠送提交
  - 保持 mock：赠送成功后的二维码展示能力
  - 原因：主动作接口已存在，但页面的二维码凭证模型无后端来源
- `member/tickets.vue`
  - 可接：提交“彩票兑积分”动作，兑换后刷新真实余额并展示本次实际到账数量
  - 保留前端说明：兑换前不再使用本地固定比例冒充后端规则
  - 原因：接口可支撑真实提交，但未提供稳定的“兑换前预估值”

## 接入策略

- `gift.vue` 可作为下一批最容易接真的页面之一，优先只改 `services/member`
- `tickets.vue` 已切真；若后端后续补出预估 / 规则接口，再补足兑换前文案
