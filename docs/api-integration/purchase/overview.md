# 购币模块总览

## 当前范围

- `src/pages/coin/recharge.vue`
- `src/pages/coin/custom-amount.vue`
- `src/pages/coin/ticket-deduction.vue`
- `src/pages/coin/point-payment.vue`
- `src/pages/coin/success.vue`
- `src/services/purchase/*`

## 当前状态

- `coin/recharge.vue` 基础套餐列表已真实接入 `GET /wechat/member/coinsales`
- 其余页面仍由 mock facade 驱动
- 最新微信用户端文档能覆盖“套餐列表”和“套餐购买记录”两类能力
- 但页面模型包含优惠券、彩票抵扣、积分付、支付面板、自定义数量等组合能力，接口能力明显不足

## 候选真实接口

- `GET /wechat/member/coinsales`
- `GET /api/cashregister/userbuys`
- `GET /wechat/member/userinfo`

## 可直接接入的地方

- `coin/recharge.vue` 顶部余额：可复用 `userinfo.coin`
- 套餐列表基础字段：可由 `coinsales` 映射出 `id / 名称 / 金额 / 币数`
- 购买记录页若后续新增：可用 `userbuys`

## 可部分接入但建议暂不替换整页模型的地方

- `基础套餐` 区块：可从 `coinsales` 映射
- `限时特惠` 区块：理论上也可从 `coinsales` 里挑选部分套餐填充，但后端未提供“限时特惠”语义

## 继续保持 mock 的地方

- `coin/recharge.vue` 整体页面模型（限时特惠已取消，优惠券已取消）
- `coin/custom-amount.vue`
- `coin/ticket-deduction.vue`
- `coin/point-payment.vue`
- `coin/success.vue`

## 不符合原因归类

- 缺少字段：
  - `summary`
  - `paymentSheet`
  - `ticketDeduction.options`
  - `pointPayment.options`
- 缺少接口：
  - 彩票抵扣选项接口
  - 积分支付选项接口
  - 购币下单 / 支付提交接口
  - 支付结果查询接口
  - 自定义数量计价规则接口

## 页面级判断

- `coin/recharge.vue`
  - 可局部接：余额、套餐列表
  - 保持 mock：抵扣项、支付面板、实付汇总
  - 原因：页面是复合支付模型，当前接口只覆盖套餐列表
- `coin/custom-amount.vue`
  - 保持 mock
  - 原因：缺少自定义数量报价 / 下单接口
- `coin/ticket-deduction.vue`
  - 保持 mock
  - 原因：缺少抵扣规则接口
- `coin/point-payment.vue`
  - 保持 mock
  - 原因：缺少积分抵扣规则接口
- `coin/success.vue`
  - 保持 mock
  - 原因：缺少支付结果确认接口

## 接入策略

- `coin/recharge.vue` 基础套餐列表已真实接入
- 限时特惠已取消、优惠券功能已移除
- 抵扣、支付等仍用 mock，不动当前复合支付页面结构
- 在缺少支付闭环前，不建议把 `purchase` 整体切成真实接口
