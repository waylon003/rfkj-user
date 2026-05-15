# 活动模块总览

## 当前范围

- `src/pages/activity/index.vue`
- `src/pages/activity/detail.vue`
- `src/services/activity/*`

## 当前状态

- 当前整组页面仍由 mock facade 驱动
- 最新同步到项目的 `API-微信用户端接口.md` 中，没有活动列表、活动详情、活动排行相关接口

## 继续保持 mock 的地方

- `activity/index.vue`
- `activity/detail.vue`

## 不符合原因归类

- 缺少接口：
  - 活动列表接口
  - 活动详情接口
  - 活动排名 / 活动参与明细接口

## 页面级判断

- `activity/index.vue`
  - 保持 mock
  - 原因：缺少列表接口
- `activity/detail.vue`
  - 保持 mock
  - 原因：缺少详情接口与排行接口

## 接入策略

- 活动模块暂不推进真实接口
- 等后端提供活动域接口后，再按列表 / 详情 / 排名三个子能力拆分接入
