# 后端 API 对接执行台账

## 文档定位

这份文档是当前项目真实接口接入的总索引台账，用于维护：

- 接入顺序
- 模块状态
- 最近批次摘要
- 全局阻塞项
- **页面级缺口清单**（缺字段 / 缺接口）

详细字段差异、接口缺失、页面模型冲突、候选接口分析，统一维护在 `docs/api-integration/` 下的模块文档中。

## 当前基线

### 已成立前提

- 页面主数据大多已经通过 `services/*` 收口
- mock 已统一经 `src/mock` 与 `src/utils/mock.ts` 收口
- 当前配置为 `useMock: true`
- `auth` 模块已开启部分真实接口接入

### 当前执行原则

- 按业务依赖顺序推进，不按页面数量推进
- 页面不直接消费后端原始结构，必须经过 `service / adapter` 映射层
- 行为一致的真实接口才允许接入
- 字段缺失仅允许在 adapter 层补空值或默认值，不允许推导假业务数据
- 接口行为与页面模型不一致时，页面继续保留 mock，并登记接口缺口
- 接口缺失、字段缺失、语义不一致、文档错误，优先登记到模块台账

## 已接入接口清单

| 接口 | 方法 | 模块 | 使用页面 |
| --- | --- | --- | --- |
| `/wechat/member/onlogin` | POST | auth | 登录流程 |
| `/wechat/member/GetUserPhoneNumber` | GET | auth | 登录流程 |
| `/wechat/member/updateaddress` | POST | profile | info.vue |
| `/wechat/member/userinfo` | GET | profile | 多页面复用 |
| `/wechat/member/qrcode` | GET | home | 首页二维码弹窗 |
| `/wechat/member/banners` | GET | home | 首页轮播 |
| `/wechat/member/shopCategories` | GET | points | exchange.vue |
| `/wechat/member/barcodes` | GET | points | exchange.vue |
| `/wechat/member/userexpendcommodity` | POST | points | exchange.vue |
| `/wechat/member/usertransfer` | POST | member | gift.vue |
| `/wechat/member/usertransfer` | GET | profile | gift-records.vue |
| `/wechat/member/redeem` | POST | member | tickets.vue |
| `/wechat/member/redeem` | GET | profile | bill.vue |
| `/wechat/member/userexpends` | GET | profile | gifts.vue, bill.vue |
| `/wechat/member/userpickup` | POST | profile | gifts.vue |
| `/wechat/member/coinsales` | GET | purchase | recharge.vue |
| `/wechat/member/userbuys` | GET | profile | bill.vue |

## 当前状态看板

| 模块 | 页面范围 | 当前状态 | 当前策略 |
| --- | --- | --- | --- |
| `auth` | 登录弹窗、资料补全 | 已完成 | 登录 + 获取手机号已真实接入 |
| `store` | 门店选择、门店详情 | mock facade | 缺少"用户已注册门店列表"接口，继续保留 mock |
| `home` | 首页 | 已完成 | Banner + 会员二维码 + 用户资产统计已真实接入；快捷入口/模块卡片/滚动公告为前端静态配置 |
| `profile` | 我的、资料、账单、礼品记录 | 部分真实 | info.vue 已完成；index.vue 身份区+待领取数量已真实；gifts/bill/gift-records 已部分真实 |
| `purchase` | 购币 | 部分真实 | recharge.vue 基础套餐已接 coinsales |
| `points` | 积分兑换 | 已完成 | 分类/商品列表/兑换提交已真实接入 |
| `member` | 赠币、票券 | 部分真实 | gift.vue 赠送提交 + tickets.vue 兑换提交已真实 |
| `activity` | 活动列表、活动详情 | mock facade | 完全缺少接口 |
| `ranking` | 排行榜 | mock facade | 接口与页面模型不匹配 |
| ~~`coupon`~~ | ~~优惠券中心~~ | ~~已取消~~ | ~~优惠券功能已移除~~ |

## 页面级缺口清单

### 一、缺少字段的页面（接口已接入，但部分字段仍由 mock 填充）

| 页面 | 已接入接口 | 缺失字段 | 缺失原因 |
| --- | --- | --- | --- |
| `profile/gifts.vue` | userexpends, userpickup | `pickupAddress`、`qrValue`、`expired` 独立状态 | 后端未提供提货地址、核销码、过期状态字段 |
| `profile/gift-records.vue` | usertransfer(列表) | 缺少接口：领取状态、重发链接、查看二维码 | usertransfer 只提供转账记录列表，缺少状态查询/重发/二维码接口 |
| `profile/bill.vue` | userbuys(购币)、redeem(兑换)、userexpends(礼品) | 游戏币消费流水 | 三类账单已能分别显示；游戏投币消费无对应接口 |
| `points/exchange.vue` | shopCategories、barcodes、userexpendcommodity | `stateMode`、`shortfallText`、`confirmData` | 后端未提供可兑换状态、积分不足文案、兑换确认信息 |
| `coin/recharge.vue` | coinsales、userinfo | 支付面板、实付汇总 | 限时特惠已取消；优惠券功能已取消 |
| `member/gift.vue` | usertransfer(POST)、userinfo | `secondaryBadge`、`qrAmount`、`qrValue`、`qrTipLines` | 后端未提供赠送后二维码/领取凭证 |
| `member/tickets.vue` | redeem(POST)、userinfo | 兑换前精确预估积分 | 后端未提供兑换预估/规则接口 |

### 二、缺少接口的页面（无可用接口，整体保持 mock）

| 页面 | 需要的接口 | 说明 |
| --- | --- | --- |
| `store/index.vue` | 用户已注册门店列表 | 当前以 mock facade 承载已注册门店模型 |
| `store/detail.vue` | 门店详情 | 依赖门店列表接口 |
| `activity/index.vue` | 活动列表 | 完全缺少活动域接口 |
| `activity/detail.vue` | 活动详情、活动排行 | 完全缺少活动域接口 |
| `ranking/index.vue` | 排行榜（机台/积分双维度） | `redeemtop` 只有积分榜，缺少机台维度与机型筛选 |
| `coin/custom-amount.vue` | 自定义数量计价 | 缺少报价/下单接口 |
| `coin/ticket-deduction.vue` | 彩票抵扣规则 | 缺少抵扣规则接口 |
| `coin/point-payment.vue` | 积分支付规则 | 缺少积分抵扣规则接口 |
| `coin/success.vue` | 支付结果查询 | 缺少支付结果确认接口 |

### 三、接口能力不匹配（有接口但语义差距大，不强行接入）

| 页面 | 可用接口 | 不匹配原因 |
| --- | --- | --- |
| `ranking/index.vue` | `GET /redeemtop` | 页面有双tab（机台/积分）+ 4种机型维度，接口只有一个用户积分兑换榜 |

## 全局阻塞项

- 缺少"用户已注册门店列表"接口，`store` 模块只能以 mock facade 承载
- 缺少"活动列表/详情"接口，`activity` 模块完全无法接入
- 缺少"支付闭环"接口（下单/支付/结果查询），`purchase` 模块无法完整接入
- `ranking` 模块需要后端提供机台维度排名能力

## 建议优先级

### 高优先级（接口已可用，可进一步完善）

1. **profile/gifts.vue** - 等待后端补充提货地址、核销码字段
2. **profile/gift-records.vue** - 等待后端补充领取状态、二维码字段
3. **member/gift.vue** - 等待后端补充赠送后二维码/领取凭证接口

### 中优先级（需要后端提供新接口）

4. **store 模块** - 需要"用户已注册门店列表"接口
5. **purchase 支付闭环** - 需要下单/支付/结果查询接口

### 低优先级（页面模型复杂，需先确认需求）

6. **activity 模块** - 需要活动域完整接口
7. **ranking 模块** - 需要机台维度排名接口

## 最近批次摘要

| 日期 | 批次 | 范围 | 结果 |
| --- | --- | --- | --- |
| 2026-05-06 | 批次 0 | 规则对齐 | 新增项目级接口接入规则 |
| 2026-05-06 | 批次 0 | 台账骨架 | 新增根目录总台账与 docs 骨架 |
| 2026-05-06 | 批次 1 | 首页/积分列表真实化 | Banner + shopCategories/barcodes |
| 2026-05-13 | 批次 2 | API 对齐分析 | 补齐各模块台账 |
| 2026-05-13 | 批次 3 | 真实接入第一批 | usertransfer(POST) + updateaddress + userexpendcommodity |
| 2026-05-13 | 批次 4 | profile 列表层 | userexpends + usertransfer(GET) |
| 2026-05-13 | 批次 5 | 接入规则纠偏 | 去除失败回退 mock |
| 2026-05-13 | 批次 6 | ticket 真实兑换 | redeem(POST) |
| 2026-05-13 | 批次 7 | store/home 口径调整 | Banner 游客态 + storeId |
| 2026-05-13 | 批次 8 | profile/purchase 扩展 | userinfo + userbuys + redeem(GET) + coinsales |
| 2026-05-14 | 批次 9 | home/member 扩展 | qrcode + usertransfer(GET) |
| 2026-05-14 | 批次 10 | profile mock 清理 | 待领取数量改用真实 API，默认值 0；移除优惠券摘要 |

## 维护规则

- 每完成一批真实接口接入，至少同步更新一次本文件
- 若接入涉及具体模块字段差异，必须同步新增或更新 `docs/api-integration/<module>/overview.md`
- 若发现页面模型不稳定，先登记问题，再决定是否改页面
