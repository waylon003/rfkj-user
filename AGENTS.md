# 项目规则

## Figma 尺寸换算

- 在使用 Figma MCP 对齐设计稿时，凡是设计稿中读取到的 `px` 尺寸，默认按小程序 `rpx` 进行 `1px = 2rpx` 换算。
- 也就是说，Figma 中的任意 `px` 数值在实现到当前项目时，默认都需要先乘以 `2`。
- 只有在用户明确指出某个节点或属性不应按此规则换算时，才允许例外处理。

## TDesign 组件优先

- 当前项目使用 `tdesign-uniapp` 时，若 TDesign 组件库已有对应组件或图标，应优先使用 TDesign 组件/图标。
- 避免在已有成熟 TDesign 组件可用的情况下，直接使用原生 `uni-app` 基础组件重新实现同类能力。
- 本地组件文档优先查阅 `docs/tdesign-components.md`。
- 若本地文档信息不足，可再使用 Context7 查询 TDesign/tdesign-uniapp 的最新组件文档。
