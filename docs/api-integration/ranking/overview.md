# 排行榜模块总览

## 当前范围

- `src/pages/ranking/index.vue`
- `src/services/ranking/*`

## 当前状态

- 当前整页仍由 mock facade 驱动
- 最新微信用户端文档只提供一个 `用户兑换排行榜` 接口
- 当前页面模型是“机台排名 / 积分排名 + 机型筛选 + podium + 列表”的多维榜单模型，和现有接口能力差距较大

## 候选真实接口

- `GET /wechat/member/redeemtop`

## 可部分接入但暂不建议替换整页模型的地方

- “积分排名” tab 的列表数据，理论上可从 `redeemtop` 映射出一份基础榜单

## 继续保持 mock 的地方

- 整个 `ranking/index.vue`

## 不符合原因归类

- 缺少字段：
  - `myRank`
  - `machineTypes`
  - `podium[].baseLabel`
  - `list[].avatarClass`
  - 各榜单 `unit` 的稳定语义
- 缺少接口：
  - 机台排名接口
  - 按机台类型筛选的排名接口
  - 我的当前排名接口

## 具体不符合点

- 当前页面有两个 tab：`machine` 与 `points`
- 当前页面还有四个机型维度：`entertainment / claw / gashapon / pinball`
- `redeemtop` 只是一份用户积分兑换榜，没有机台维度，也没有双 tab 结构
- `redeemtop` 响应没有显式 `rank` 字段，只能按列表顺序派生，不适合作为稳定页面契约

## 接入策略

- 保持 `services/ranking` mock facade 不变
- 只有后端后续提供“机台榜 / 积分榜 / 机型筛选”至少三类能力后，再考虑替换
