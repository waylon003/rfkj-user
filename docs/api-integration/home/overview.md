# 首页模块总览

## 当前范围

- `src/pages/home/index.vue`

## 当前状态

- Banner 已接真实接口 `GET /wechat/member/banners`
- Banner 现支持游客态直接请求，不再要求登录态才能拉取
- Banner 新增可选查询参数 `storeId`，用于按当前选中门店拉取轮播
- 会员二维码已接真实接口 `GET /wechat/member/qrcode`，已登录用户会从后端获取真实二维码
- 其余首页字段仍由 mock 页面模型提供
- 首页会员信息已可从 `userStore.profile` 间接接入 `GET /wechat/member/userinfo`

## 页面模型与接口匹配情况

- `banners`：可直接映射，已接真实
- `posterQrValue`：已接真实接口，已登录用户从后端获取，游客态使用 mock 值
- `user`：依赖 `userStore` + 登录态资料
- `stats`：当前仍由 mock 提供
- `quickActions`：当前仍由 mock 提供
- `modules`：当前仍由 mock 提供
- `ticker`：当前仍由 mock 提供

## 可直接接入的地方

- Banner 轮播：`GET /wechat/member/banners`（支持游客态，且可带可选 `storeId`）
- 会员二维码：`GET /wechat/member/qrcode`（需登录态，返回二维码字符串）
- 会员昵称 / 卡号 / 资产展示：可复用登录模块注入的 `userinfo`

## 可部分接入但暂不改单页模型的地方

（无）

## 缺失字段清单

- `user.scanLabel`：真实接口未提供，当前继续使用前端文案
- `banners[].subtitle`：后端 `title` 为空时由前端补默认值，非稳定字段

## 不符合原因归类

- 缺少字段：
  - `banners[].subtitle`
  - `user.scanLabel`

## 备注

- `quickActions`、`modules`、`ticker` 为前端静态配置，不需要后端接口

## 接入策略

- 首页 Banner 和会员二维码已接真实，其余部分保持页面模型优先
- Banner 和二维码请求失败时应直接暴露真实接口问题，不再回退 mock 掩盖
- `quickActions`、`modules`、`ticker` 为前端静态配置，不需要后端接口

## 备注

- 真实接口返回的图片与标题字段已能支撑首页轮播
- Banner 当前会优先带 `storeId` 查询参数，请求当前门店上下文下的轮播数据
- 会员二维码在用户已登录时从后端获取，游客态使用 mock 数据兜底
- 二维码获取失败时使用 mock 值，不影响首页展示
- 若后续补出跳转字段或副标题规则，可继续扩展 banner 映射
