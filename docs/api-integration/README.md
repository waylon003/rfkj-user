# API 对接模块台账

## 目录用途

此目录用于维护模块级真实接口接入台账，作为 `backend-api-integration-checklist.md` 的下钻明细。

每个模块建议使用如下结构：

```text
docs/api-integration/
  <module>/
    overview.md
```

## 模块文档建议内容

- 页面范围
- 当前页面模型
- 候选真实接口
- 已接接口
- 未接接口
- 字段缺失清单
- 语义不一致清单
- 最近批次记录

## 执行规则

- 真实接口接入前，先确认页面是否已有稳定的前端模型
- 页面不得直接消费后端原始结构
- 所有字段映射、空值补位、枚举转换都放在 `src/services/<domain>` 内
- 若接口行为不满足当前页面模型，继续保留 mock，不要强行接真
- 若模块文档不存在，在首次接入该模块时创建 `overview.md`

## 初始模块建议

- `auth`
- `store`
- `home`
- `profile`
- `purchase`
- `points`
- `member`
- `activity`
- `ranking`
- `coupon`
