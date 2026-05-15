# 积分兑换模块总览

## 当前范围

- `src/pages/points/exchange.vue`

## 当前状态

- 分类与商品列表已开始接真实接口
- 礼品兑换提交已完成真实接入
- 兑换确认弹窗仍由前端模型控制，兑换提交已接真实接口
- 最新微信用户端文档已提供 `POST /wechat/member/userexpendcommodity`
- 当前页面核心字段已可成立，故保留真实接入；缺失字段继续在台账中显式登记

## 页面模型与接口匹配情况

- `categories`：可映射到 `shopCategories`
- `items`：可映射到 `barcodes`
- `balance`：当前仍由用户资料或页面模型提供
- `confirmData`：当前仍为 mock

## 可直接接入的地方

- 分类列表：`GET /wechat/member/shopCategories`
- 商品列表：`GET /wechat/member/barcodes`
- 当前积分余额：可复用登录模块 `GET /wechat/member/userinfo`
- 礼品兑换提交：`POST /wechat/member/userexpendcommodity`

## 暂时保持 mock 的地方

- 兑换确认弹窗
- 兑换提交动作
- 兑换成功后的文案与状态反馈

## 缺失字段清单

- `balance`：商品接口不提供当前积分，当前仍依赖 `userStore.profile.integral` 或 mock
- `confirmData`：确认弹窗文案、提示、可用积分等仍由前端模型提供
- `items[].stateMode`：接口未提供可兑换状态，当前由前端基于 `stock` 与积分推断
- `items[].shortfallText`：接口未提供积分不足文案，当前由前端兜底
- `categories[全部]`：接口未提供“全部”分类，当前由前端补齐
- `items[].barcodePriceId` / `items[].storeId` / `items[].stockId` / `items[].staging` / `items[].examine`：接口存在但当前页面模型未消费，暂记为未用字段
- `items[].barcodeId` / `items[].storeId` / `items[].stockId` / `userUid`：兑换接口需要，但当前页面 item 模型和现有 `services/points/api.ts` 未向页面暴露

## 不符合原因归类

- 缺少字段：
  - `stateMode`
  - `shortfallText`
  - `confirmData`
  - 兑换提交所需的隐藏字段当前未进入页面模型：`barcodeId`、`storeId`、`stockId`
- 缺少接口：
  - 无“兑换预估 / 兑换确认信息”接口
  - 无统一的“积分商城首页聚合接口”

## 接入策略

- 页面维持“礼品分类 + 商品卡片”模型优先
- 真实字段只补到页面需要的最小集合，不反向重构页面结构
- 请求失败时直接暴露真实接口问题，不再回退 mock
- 若后续首页或积分商城增加更完整能力，再扩展 confirm/兑换闭环

## 映射规则

- `shopCategories.list[].id` -> `categories[].value`
- `shopCategories.list[].name` -> `categories[].label`
- `barcodes.list[].id` -> `items[].id`
- `barcodes.list[].name` -> `items[].title`
- `barcodes.list[].integral` -> `items[].cost`
- `barcodes.list[].categoryId` -> `items[].category`
- `barcodes.list[].inventories` -> `items[].stock`
- `barcodes.list[].image` -> `items[].image`

## 备注

- 后续若后端提供统一积分商城总列表接口，可进一步减少多分类请求
