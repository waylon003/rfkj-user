# TDesign UniApp 组件库参考文档

> 本文档整理自 `node_modules/tdesign-uniapp` 组件库，方便快速查阅组件使用方法。

## 快速引入

### 全局引入

```js
// main.ts
import TDesign from 'tdesign-uniapp';
createApp(App).use(TDesign);
```

### 按需引入

```js
// 在需要使用的页面或组件中引入
import TButton from 'tdesign-uniapp/button/button.vue';
```

## 组件分类

### 基础组件
- [Button 按钮](#button-按钮) - 用于开启一个闭环的操作任务
- [Divider 分割线](#divider-分割线) - 用于分隔内容区域
- [Icon 图标](#icon-图标) - 图标组件
- [Link 链接](#link-链接) - 文字链接

### 导航组件
- [Navbar 导航栏](#navbar-导航栏) - 页面顶部导航
- [TabBar 标签栏](#tabbar-标签栏) - 底部标签栏
- [Tabs 选项卡](#tabs-选项卡) - 选项卡切换
- [Sidebar 侧边栏](#sidebar-侧边栏) - 侧边导航
- [Steps 步骤条](#steps-步骤条) - 步骤流程

### 输入组件
- [Form 表单](#form-表单) - 表单数据收集与校验
- [Input 输入框](#input-输入框) - 单行文本输入
- [Textarea 多行文本框](#textarea-多行文本框) - 多行文本输入
- [Picker 选择器](#picker-选择器) - 滚动选择器
- [Cascader 级联选择器](#cascader-级联选择器) - 多层级数据选择
- [Checkbox 多选框](#checkbox-多选框) - 多项选择
- [Radio 单选框](#radio-单选框) - 单项选择
- [Switch 开关](#switch-开关) - 开关选择
- [Slider 滑动选择器](#slider-滑动选择器) - 滑动输入
- [Stepper 步进器](#stepper-步进器) - 数值步进
- [Upload 上传](#upload-上传) - 文件上传
- [Calendar 日历](#calendar-日历) - 日历选择
- [DateTimePicker 时间选择器](#datetime-picker-时间选择器) - 时间日期选择

### 数据展示
- [Cell 单元格](#cell-单元格) - 列表单元格
- [List 列表](#list-列表) - 列表展示
- [Card 卡片](#card-卡片) - 卡片容器
- [Grid 宫格](#grid-宫格) - 宫格布局
- [Avatar 头像](#avatar-头像) - 头像展示
- [Badge 徽标](#badge-徽标) - 徽标数提醒
- [Tag 标签](#tag-标签) - 标签展示
- [Collapse 折叠面板](#collapse-折叠面板) - 折叠面板
- [Image 图片](#image-图片) - 图片展示
- [Progress 进度条](#progress-进度条) - 进度展示
- [Skeleton 骨架屏](#skeleton-骨架屏) - 骨架屏加载
- [Empty 空状态](#empty-空状态) - 空状态展示
- [Swiper 轮播图](#swiper-轮播图) - 轮播展示

### 反馈组件
- [Dialog 对话框](#dialog-对话框) - 模态对话框
- [Toast 轻提示](#toast-轻提示) - 轻量提示
- [Message 消息通知](#message-消息通知) - 消息提示
- [Loading 加载](#loading-加载) - 加载状态
- [Popup 弹出层](#popup-弹出层) - 弹出层容器
- [ActionSheet 动作面板](#actionsheet-动作面板) - 底部动作面板
- [Overlay 遮罩层](#overlay-遮罩层) - 遮罩层
- [PullDownRefresh 下拉刷新](#pulldownrefresh-下拉刷新) - 下拉刷新
- [SwipeCell 滑动操作](#swipecell-滑动操作) - 滑动单元格操作

---

## 详细文档

### Button 按钮

用于开启一个闭环的操作任务，如"删除"对象、"购买"商品等。

#### 引入

```js
import TButton from 'tdesign-uniapp/button/button.vue';
```

#### 基础用法

```html
<!-- 基础按钮 -->
<t-button theme="default">默认按钮</t-button>
<t-button theme="primary">主要按钮</t-button>
<t-button theme="danger">危险按钮</t-button>

<!-- 尺寸 -->
<t-button size="small">小按钮</t-button>
<t-button size="medium">中按钮</t-button>
<t-button size="large">大按钮</t-button>

<!-- 幽灵按钮 -->
<t-button variant="outline">线框按钮</t-button>
<t-button variant="dashed">虚线按钮</t-button>
<t-button variant="text">文字按钮</t-button>

<!-- 块级按钮 -->
<t-button block>通栏按钮</t-button>

<!-- 禁用状态 -->
<t-button disabled>禁用按钮</t-button>

<!-- 图标按钮 -->
<t-button icon="add">添加</t-button>
<t-button theme="primary" icon="search">搜索</t-button>

<!-- 加载状态 -->
<t-button theme="primary" loading>加载中</t-button>

<!-- 形状 -->
<t-button shape="square">方形</t-button>
<t-button shape="circle">圆形</t-button>
<t-button shape="round">圆角</t-button>
```

#### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| theme | String | default | 按钮风格。可选项：default/primary/danger/light |
| size | String | medium | 组件尺寸。可选项：extra-small/small/medium/large |
| variant | String | base | 按钮形式。可选项：base/outline/dashed/text |
| shape | String | rectangle | 按钮形状。可选项：rectangle/square/round/circle |
| disabled | Boolean | false | 是否禁用 |
| loading | Boolean | false | 是否显示为加载状态 |
| block | Boolean | false | 是否为块级元素 |
| ghost | Boolean | false | 是否为幽灵按钮 |
| icon | String/Object | - | 图标名称 |
| content | String | - | 按钮内容 |
| url | String | - | 点击后跳转链接地址 |

#### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| click | 点击时触发 | (e: MouseEvent) |

---

### Input 输入框

用于单行文本信息输入。

#### 引入

```js
import TInput from 'tdesign-uniapp/input/input.vue';
```

#### 基础用法

```html
<!-- 基础输入框 -->
<t-input v-model="value" placeholder="请输入内容" />

<!-- 带清除按钮 -->
<t-input v-model="value" clearable placeholder="可清除" />

<!-- 带图标 -->
<t-input v-model="value" prefix-icon="user" placeholder="用户名" />
<t-input v-model="value" suffix-icon="search" placeholder="搜索" />

<!-- 字数限制 -->
<t-input v-model="value" :maxlength="10" placeholder="最多10个字符" />
<t-input v-model="value" :maxcharacter="20" placeholder="最多20字符(中文算2)" />

<!-- 状态 -->
<t-input v-model="value" status="success" />
<t-input v-model="value" status="warning" />
<t-input v-model="value" status="error" />
<t-input v-model="value" disabled placeholder="禁用状态" />
<t-input v-model="value" readonly placeholder="只读状态" />

<!-- 带标签 -->
<t-input v-model="value" label="用户名" placeholder="请输入用户名" />

<!-- 不同类型 -->
<t-input type="password" v-model="value" placeholder="密码" />
<t-input type="number" v-model="value" placeholder="数字" />
<t-input type="digit" v-model="value" placeholder="带小数点数字" />
<t-input type="idcard" v-model="value" placeholder="身份证" />

<!-- 提示信息 -->
<t-input v-model="value" tips="这是辅助说明文字" />
<t-input v-model="value" status="error" tips="错误提示信息" />
```

#### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| value | String/Number | - | 输入框的值 |
| type | String | text | 输入框类型。可选项：text/number/idcard/digit/safe-password/password/nickname |
| placeholder | String | - | 占位符 |
| disabled | Boolean | undefined | 是否禁用 |
| readonly | Boolean | undefined | 只读状态 |
| clearable | Boolean/Object | false | 是否可清空 |
| maxlength | Number | -1 | 最大输入长度 |
| maxcharacter | Number | - | 最大字符数(中文算2) |
| prefix-icon | String/Object | - | 前置图标 |
| suffix-icon | String/Object | - | 后置图标 |
| label | String | - | 左侧文本 |
| status | String | default | 输入框状态。可选项：default/success/warning/error |
| tips | String | - | 输入框下方提示文本 |
| align | String | left | 内容对齐。可选项：left/center/right |
| layout | String | horizontal | 布局方式。可选项：vertical/horizontal |
| borderless | Boolean | false | 是否开启无边框模式 |

#### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| change | 值变化时触发 | (context: { value: InputValue }) |
| focus | 获得焦点时触发 | (context: { value: InputValue }) |
| blur | 失去焦点时触发 | (context: { value: InputValue }) |
| clear | 清空按钮点击时触发 | - |
| enter | 回车键按下时触发 | (context: { value: InputValue }) |

---

### Textarea 多行文本框

用于多行文本信息输入。

#### 引入

```js
import TTextarea from 'tdesign-uniapp/textarea/textarea.vue';
```

#### 基础用法

```html
<!-- 基础多行文本框 -->
<t-textarea v-model:value="value" placeholder="请输入内容" />

<!-- 带标题 -->
<t-textarea v-model:value="value" label="备注" placeholder="请输入备注" />

<!-- 自动增高 -->
<t-textarea v-model:value="value" :autosize="true" placeholder="自动增高" />

<!-- 限制字符数 -->
<t-textarea v-model:value="value" :maxlength="140" placeholder="最多140个字符" />

<!-- 限制字符数（中文算2） -->
<t-textarea v-model:value="value" :maxcharacter="200" placeholder="最多200字符(中文算2)" />

<!-- 显示计数器 -->
<t-textarea v-model:value="value" :maxlength="500" :indicator="true" placeholder="带计数器" />

<!-- 禁用状态 -->
<t-textarea v-model:value="value" disabled placeholder="禁用状态" />

<!-- 只读状态 -->
<t-textarea v-model:value="value" readonly placeholder="只读状态" />
```

#### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| value | String/Number | - | 文本框值，支持语法糖 v-model:value |
| placeholder | String | - | 占位符 |
| disabled | Boolean | undefined | 是否禁用文本框 |
| readonly | Boolean | undefined | 只读状态 |
| maxlength | Number | -1 | 用户最多可以输入的字符个数，值为 -1 时不限制最大长度 |
| maxcharacter | Number | - | 用户最多可以输入的字符个数，一个中文汉字表示两个字符长度 |
| autosize | Boolean/Object | false | 是否自动增高，值为 true 时，style.height 不生效。支持传入对象，如 { maxHeight: 120, minHeight: 20 } |
| indicator | Boolean | false | 显示文本计数器，如 0/140。当 maxlength < 0 && maxcharacter < 0 时无效 |
| label | String | - | 左侧文本 |
| border | Boolean | false | 是否显示外边框 |
| autofocus | Boolean | false | 自动聚焦，拉起键盘 |
| focus | Boolean | false | 自动聚焦 |
| cursor | Number | -1 | 指定 focus 时的光标位置 |
| cursor-spacing | Number | 0 | 指定光标与键盘的距离 |
| cursor-color | String | #0052d9 | 光标颜色，仅在 Skyline 下有效 |
| selection-start | Number | -1 | 光标起始位置，自动聚集时有效，需与 selection-end 搭配使用 |
| selection-end | Number | -1 | 光标结束位置，自动聚集时有效，需与 selection-start 搭配使用 |
| adjust-position | Boolean | true | 键盘弹起时，是否自动上推页面 |
| confirm-type | String | return | 设置键盘右下角按钮的文字。可选项：return/send/search/next/go/done |
| confirm-hold | Boolean | false | 点击键盘右下角按钮时是否保持键盘不收起点 |
| hold-keyboard | Boolean | false | focus时，点击页面的时候不收起键盘 |
| show-confirm-bar | Boolean | true | 是否显示键盘上方带有"完成"按钮那一栏 |
| disable-default-padding | Boolean | false | 是否去掉 iOS 下的默认内边距 |
| fixed | Boolean | false | 如果 textarea 是在一个 position:fixed 的区域，需要显式指定属性 fixed 为 true |
| allow-input-over-max | Boolean | false | 超出 maxlength 或 maxcharacter 之后是否还允许输入 |
| placeholder-class | String | textarea-placeholder | 指定 placeholder 的样式类 |
| placeholder-style | String | - | 指定 placeholder 的样式 |

#### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| change | 输入内容变化时触发 | (context: { value: TextareaValue, cursor: number }) |
| focus | 获得焦点时触发 | (context: { value: TextareaValue }) |
| blur | 失去焦点时触发 | (context: { value: TextareaValue, cursor: number }) |
| enter | 点击完成时触发 | (context: { value: TextareaValue }) |
| line-change | 行高发生变化时触发 | (context: { value: TextareaValue }) |
| keyboardheightchange | 键盘高度发生变化的时候触发 | (context: { height: number, duration: number }) |

#### Slots

| 插槽名 | 说明 |
| --- | --- |
| label | 自定义 label 显示内容 |

#### External Classes

| 类名 | 描述 |
| --- | --- |
| t-class | 根节点样式类 |
| t-class-indicator | 计数器样式类 |
| t-class-label | 左侧文本样式类 |
| t-class-textarea | 多行文本框样式类 |

#### CSS Variables

| 名称 | 默认值 | 描述 |
| --- | --- | --- |
| --td-textarea-background-color | @bg-color-container | 背景色 |
| --td-textarea-border-color | @component-border | 边框颜色 |
| --td-textarea-border-radius | @radius-default | 边框圆角 |
| --td-textarea-disabled-text-color | @text-color-disabled | 禁用状态文本颜色 |
| --td-textarea-indicator-text-color | @text-color-placeholder | 计数器文本颜色 |
| --td-textarea-label-color | @text-color-primary | 标签文本颜色 |
| --td-textarea-padding | 32rpx | 内边距 |
| --td-textarea-placeholder-color | @text-color-placeholder | 占位符颜色 |
| --td-textarea-text-color | @text-color-primary | 文本颜色 |

---

### Dialog 对话框

用于显示重要提示或请求用户进行重要操作，一种打断当前操作的模态视图。

#### 引入

```js
import TDialog from 'tdesign-uniapp/dialog/dialog.vue';
```

#### 基础用法

```html
<t-dialog
  v-model:visible="visible"
  title="标题"
  content="这是对话框内容"
  confirm-btn="确定"
  cancel-btn="取消"
  @confirm="onConfirm"
  @cancel="onCancel"
/>

<!-- 带图片 -->
<t-dialog
  v-model:visible="visible"
  title="成功"
  theme="success"
  content="操作成功"
/>

<!-- 输入对话框 -->
<t-dialog
  v-model:visible="visible"
  title="请输入"
  :input="true"
  @confirm="onInputConfirm"
/>

<!-- 按钮纵向排列 -->
<t-dialog
  v-model:visible="visible"
  title="提示"
  content="确定要删除吗？"
  button-layout="vertical"
/>
```

#### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| visible | Boolean | - | 控制对话框是否显示 |
| title | String | - | 标题 |
| content | String | - | 内容 |
| confirm-btn | String/Object | - | 确认按钮 |
| cancel-btn | String/Object | - | 取消按钮 |
| button-layout | String | horizontal | 多按钮排列方式。可选项：horizontal/vertical |
| close-btn | Boolean/Object | false | 是否展示关闭按钮 |
| show-overlay | Boolean | true | 是否显示遮罩层 |
| close-on-overlay-click | Boolean | false | 点击蒙层时是否关闭 |
| z-index | Number | 11500 | 对话框层级 |

#### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| confirm | 点击确认按钮时触发 | (context: { e: MouseEvent }) |
| cancel | 点击取消按钮时触发 | (context: { e: MouseEvent }) |
| close | 关闭事件触发 | (context: { trigger: string }) |

---

### Toast 轻提示

用于轻量级反馈或提示，不会打断用户操作。

#### 引入

```js
import TToast from 'tdesign-uniapp/toast/toast.vue';
```

#### 基础用法

```html
<!-- 组件方式 -->
<t-toast
  v-model:visible="visible"
  message="操作成功"
  theme="success"
  :duration="2000"
/>

<!-- 不同主题 -->
<t-toast theme="loading" message="加载中..." />
<t-toast theme="success" message="成功" />
<t-toast theme="warning" message="警告" />
<t-toast theme="error" message="错误" />

<!-- 不同位置 -->
<t-toast placement="top" message="顶部提示" />
<t-toast placement="middle" message="居中提示" />
<t-toast placement="bottom" message="底部提示" />

<!-- 显示遮罩 -->
<t-toast message="提示内容" :show-overlay="true" />
```

#### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| visible | Boolean | - | 是否显示 |
| message | String | - | 弹窗显示文字 |
| theme | String | - | 提示类型。可选项：loading/success/warning/error |
| duration | Number | 2000 | 弹窗显示毫秒数 |
| placement | String | middle | 弹窗展示位置。可选项：top/middle/bottom |
| icon | String/Object | - | 自定义图标 |
| show-overlay | Boolean | false | 是否显示遮罩层 |
| prevent-scroll-through | Boolean | false | 防止滚动穿透 |

#### Events

| 事件名 | 说明 |
| --- | --- |
| close | 轻提示隐藏的时候触发 |
| destroy | 轻提示销毁的时候触发 |

---

### Message 消息通知

用于操作反馈或状态提示，常用于表单提交、操作成功/失败等场景。

#### 引入

```js
import TMessage from 'tdesign-uniapp/message/message.vue';
```

#### 基础用法

```html
<!-- 不同主题 -->
<t-message theme="info" message="普通消息" />
<t-message theme="success" message="成功消息" />
<t-message theme="warning" message="警告消息" />
<t-message theme="error" message="错误消息" />

<!-- 带图标 -->
<t-message theme="success" message="操作成功" :icon="check-circle" />
<t-message theme="error" message="操作失败" :icon="close-circle" />

<!-- 不同位置 -->
<t-message placement="top" message="顶部消息" />
<t-message placement="middle" message="居中消息" />
<t-message placement="bottom" message="底部消息" />

<!-- 带关闭按钮 -->
<t-message message="可关闭的消息" :close-btn="true" />

<!-- 自定义时长 -->
<t-message message="5秒后消失" :duration="5000" />

<!-- 多条消息堆叠 -->
<t-message v-model:visible="visible1" message="第一条消息" />
<t-message v-model:visible="visible2" message="第二条消息" />

<!-- 带操作按钮 -->
<t-message message="是否确认删除？" action="确认" @action-click="handleAction" />
```

#### 编程式调用

```js
import { MessagePlugin } from 'tdesign-uniapp';

// 文本消息
MessagePlugin.info('这是普通消息');
MessagePlugin.success('操作成功');
MessagePlugin.warning('警告信息');
MessagePlugin.error('操作失败');

// 配置消息
MessagePlugin.info({
  message: '这是一条消息',
  duration: 3000,
  offset: [20, 20],
  placement: 'top',
  closeBtn: true,
});

// 带操作的消息
MessagePlugin.info({
  message: '数据已过期，点击刷新',
  action: '刷新',
  onClick: () => {
    console.log('刷新数据');
  },
});

// 关闭所有消息
MessagePlugin.closeAll();

// 关闭指定消息
const messageInstance = MessagePlugin.info('消息');
messageInstance.close();
```

#### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| visible | Boolean | - | 是否显示 |
| message | String | - | 消息内容 |
| theme | String | info | 消息类型。可选项：info/success/warning/error |
| duration | Number | 3000 | 消息显示时长，单位毫秒，0 表示不自动关闭 |
| placement | String | top | 消息位置。可选项：top/middle/bottom |
| icon | String/Object | - | 自定义图标 |
| close-btn | Boolean/String | false | 是否显示关闭按钮 |
| offset | Array | - | 消息距离视口的偏移量 |
| zIndex | Number | 6000 | 消息层级 |
| overlay | Boolean | false | 是否显示遮罩层 |
| action | String | - | 操作按钮文字 |
| marquee | Boolean/Object | false | 是否开启跑马灯效果 |

#### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| close | 关闭时触发 | - |
| action-click | 点击操作按钮时触发 | - |
| click | 点击消息时触发 | - |

---

### Form 表单

用以收集、校验和提交数据，一般由输入框、单选框、复选框、选择器等控件组成。

#### 引入

```js
import TForm from 'tdesign-uniapp/form/form.vue';
import TFormItem from 'tdesign-uniapp/form-item/form-item.vue';
```

#### 基础用法

```html
<t-form
  ref="formRef"
  :data="formData"
  :rules="rules"
  @submit="onSubmit"
  @reset="onReset"
>
  <t-form-item label="用户名" name="username">
    <t-input v-model="formData.username" placeholder="请输入用户名" />
  </t-form-item>

  <t-form-item label="密码" name="password">
    <t-input type="password" v-model="formData.password" placeholder="请输入密码" />
  </t-form-item>

  <t-form-item label="邮箱" name="email">
    <t-input v-model="formData.email" placeholder="请输入邮箱" />
  </t-form-item>

  <t-form-item>
    <t-button theme="primary" type="submit">提交</t-button>
    <t-button theme="default" type="reset" style="margin-left: 10px">重置</t-button>
  </t-form-item>
</t-form>
```

#### 校验规则

```js
const rules = {
  username: [
    { required: true, message: '用户名必填' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符' }
  ],
  password: [
    { required: true, message: '密码必填' },
    { min: 6, message: '密码长度不能少于 6 个字符' }
  ],
  email: [
    { email: true, message: '请输入正确的邮箱地址' }
  ]
};
```

#### Form Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| data | Object | {} | 表单数据 |
| rules | Object | - | 表单字段校验规则 |
| label-width | String/Number | '81px' | 标签宽度 |
| label-align | String | right | 标签对齐方式。可选项：left/right/top |
| content-align | String | left | 内容对齐方式。可选项：left/right |
| disabled | Boolean | undefined | 是否禁用整个表单 |
| readonly | Boolean | undefined | 是否整个表单只读 |
| show-error-message | Boolean | true | 校验不通过时，是否显示错误提示 |
| reset-type | String | empty | 重置方式。可选项：empty/initial |

#### Form Events

| 事件名 | 说明 |
| --- | --- |
| submit | 表单提交时触发 |
| reset | 表单重置时触发 |
| validate | 校验结束后触发 |

#### FormInstanceMethods 组件实例方法

| 方法名 | 参数 | 返回值 | 说明 |
| --- | --- | --- | --- |
| validate | (params?: FormValidateParams) | Promise | 校验表单 |
| reset | (params?: FormResetParams) | - | 重置表单 |
| clear-validate | (fields?: Array) | - | 清空校验结果 |
| set-validate-message | (message: Object) | - | 设置自定义校验结果 |
| submit | (params?: Object) | - | 提交表单 |

#### 常见问题

**问题1: 表单项没有间距**

症状: 设置了 `--td-spacer-2` 但表单项之间没有可见间距

原因: Form CSS 有媒体查询，小屏幕使用 `--td-spacer`，大屏幕使用 `--td-spacer-2`

解决:
```typescript
const formCustomStyle = computed(() => ({
  '--td-spacer': '32rpx',   // 小屏幕使用
  '--td-spacer-2': '32rpx', // 大屏幕使用
}))
```

**问题2: Input 输入框有底部边框**

症状: 使用 `:border="false"` 但底部边框还在

原因: Input 组件使用 `borderless` 属性，不是 `border`

解决:
```vue
<t-input v-model="value" :borderless="true" />
```

**问题3: Input 没有背景色和内边距**

症状: custom-style 设置的 CSS 变量不生效

原因: custom-style 必须绑在每个 t-input 上，不能从 t-form 继承

解决:
```vue
<script setup lang="ts">
const inputCustomStyle = computed(() => ({
  '--td-input-bg-color': '#F7F9FC',
  '--td-input-vertical-padding': '24rpx',
}))
</script>

<template>
  <t-input v-model="formData.name" :custom-style="inputCustomStyle" />
</template>
```

**问题4: Textarea 有边框**

症状: 使用 `:border="false"` 但边框还在

原因: Textarea 组件使用 `bordered` 属性，不是 `border`

解决:
```vue
<t-textarea v-model="value" :bordered="false" />
```

**问题5: Textarea 没有宽度（很窄）**

症状: Textarea 宽度收缩，几乎看不见

原因: `.t-textarea` 根元素是 flex 容器，没有明确宽度会收缩到内容大小

解决: 在 custom-style 中设置 `width: '100%'`
```typescript
const textareaCustomStyle = computed(() => ({
  width: '100%',
  '--td-textarea-background-color': '#F7F9FC',
  '--td-textarea-padding': '24rpx',
}))
```

**问题6: Textarea 没有高度**

症状: Textarea 高度很小，无法正常输入

原因: 内部 textarea 元素需要明确的高度

解决: 使用 `:deep()` 设置内部元素高度
```vue
<style lang="scss" scoped>
:deep(.t-textarea__wrapper-inner) {
  width: 100% !important;
  height: 240rpx !important;
}
</style>
```

**问题7: 使用插槽后 label 不显示**

症状: 使用 `<template #label>` 但 label 不显示

原因: form-item.vue 有 `v-if="label"`，没有 label 属性时整个 label 容器不渲染

解决: 即使使用插槽也要提供 `label` 属性
```vue
<t-form-item name="name" label=" ">
  <template #label><text class="label-text">会员名称</text></template>
  <t-input v-model="formData.name" />
</t-form-item>
```

**问题8: 给 Input 添加右侧图标**

解决: 使用 `suffix-icon` 属性
```vue
<t-input v-model="formData.name" suffix-icon="chevron-right" />
```

#### CSS 变量参考

| 变量 | 组件 | 用途 |
|------|------|------|
| `--td-spacer` | t-form | 表单项间距（小屏幕 ≤750rpx） |
| `--td-spacer-2` | t-form | 表单项间距（大屏幕） |
| `--td-input-bg-color` | t-input | 输入框背景色 |
| `--td-input-vertical-padding` | t-input | 输入框内边距（上下） |
| `--td-textarea-background-color` | t-textarea | 文本域背景色 |
| `--td-textarea-padding` | t-textarea | 文本域内边距 |

---

### Picker 选择器

用于一组预设数据中的选择。

#### 引入

```js
import TPicker from 'tdesign-uniapp/picker/picker.vue';
import TPickerItem from 'tdesign-uniapp/picker-item/picker-item.vue';
```

#### 基础用法

```html
<!-- 单列选择 -->
<t-picker v-model:visible="visible" v-model:value="value" :data="options" @confirm="onConfirm" />

<!-- 多列选择 -->
<t-picker v-model:visible="visible" v-model:value="value" @confirm="onConfirm">
  <t-picker-item :options="options1" />
  <t-picker-item :options="options2" />
  <t-picker-item :options="options3" />
</t-picker>

<!-- 带标题 -->
<t-picker
  v-model:visible="visible"
  v-model:value="value"
  title="选择城市"
  :data="options"
/>
```

#### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| visible | Boolean | - | 是否显示 |
| value | Array | - | 选中值 |
| title | String | - | 标题 |
| header | Boolean | true | 是否显示头部 |
| confirm-btn | String/Boolean | true | 确定按钮文字 |
| cancel-btn | String/Boolean | true | 取消按钮文字 |
| auto-close | Boolean | true | 自动关闭 |
| item-height | Number | 80 | 子项高度，单位 rpx |

#### Events

| 事件名 | 说明 |
| --- | --- |
| confirm | 点击确认按钮时触发 |
| cancel | 点击取消按钮时触发 |
| change | 选中变化时候触发 |
| pick | 任何一列选中都会触发 |

---

### Cascader 级联选择器

用于多层级数据的选择，常用于省市区选择、组织架构选择等场景。

#### 引入

```js
import TCascader from 'tdesign-uniapp/cascader/cascader.vue';
```

#### 基础用法

```html
<!-- 基础级联选择 -->
<t-cascader
  v-model:visible="visible"
  v-model:value="value"
  :options="options"
  title="请选择"
  @change="handleChange"
/>

<!-- 不同主题 -->
<t-cascader
  v-model:visible="visible"
  v-model:value="value"
  :options="options"
  theme="step"
/>

<t-cascader
  v-model:visible="visible"
  v-model:value="value"
  :options="options"
  theme="tab"
/>

<!-- 自定义次标题 -->
<t-cascader
  v-model:visible="visible"
  v-model:value="value"
  :options="options"
  :sub-titles="['请选择省份', '请选择城市', '请选择区县']"
/>

<!-- 允许选择任意层级 -->
<t-cascader
  v-model:visible="visible"
  v-model:value="value"
  :options="options"
  :check-strictly="true"
/>
```

#### 省市区选择示例

```vue
<template>
  <view>
    <view class="address-display" @click="showCascader = true">
      {{ selectedAddressText || '请选择省/市/区' }}
    </view>

    <t-cascader
      v-model:visible="showCascader"
      v-model:value="addressValue"
      :options="addressOptions"
      title="选择地址"
      @change="handleAddressChange"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const showCascader = ref(false)
const addressValue = ref('') // 级联选择器使用单个值（叶子节点）

// 表单数据
const formData = ref({
  province: '',
  city: '',
  district: ''
})

// 地址选项数据结构
const addressOptions = [
  {
    label: '广东省',
    value: '440000',
    children: [
      {
        label: '深圳市',
        value: '440300',
        children: [
          { label: '南山区', value: '440305' },
          { label: '福田区', value: '440304' }
        ]
      }
    ]
  }
]

// 显示的地址文本
const selectedAddressText = computed(() => {
  const parts = []
  if (formData.value.province) parts.push(formData.value.province)
  if (formData.value.city) parts.push(formData.value.city)
  if (formData.value.district) parts.push(formData.value.district)
  return parts.join(' ')
})

// 处理地址选择
function handleAddressChange(context: { value: string; selectedOptions: string[] }) {
  // selectedOptions 包含所有层级的标签: ['广东省', '深圳市', '南山区']
  const labels = context.selectedOptions

  if (labels.length >= 1) formData.value.province = labels[0] || ''
  if (labels.length >= 2) formData.value.city = labels[1] || ''
  if (labels.length >= 3) formData.value.district = labels[2] || ''
}
</script>
```

#### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| visible | Boolean | false | 是否显示 |
| value | String/Number | - | 选中值（叶子节点的值，非数组） |
| options | Array | [] | 可选项数据源 |
| title | String | - | 标题 |
| placeholder | String | 选择选项 | 未选中时的提示文案 |
| sub-titles | Array | [] | 每级展示的次标题 |
| theme | String | step | 展示风格。可选项：step/tab |
| check-strictly | Boolean | false | 父子节点选中状态不再关联，可各自选中 |
| close-btn | Boolean | true | 是否显示关闭按钮 |
| keys | Object | - | 字段别名，如 { value: 'id', label: 'name', children: 'items' } |

#### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| change | 值发生变更时触发 | (context: { value: string\|number, selectedOptions: string[] }) |
| pick | 选中选项时触发 | (context: { value: string\|number, label: string, index: number, level: number }) |
| close | 关闭时触发 | (context: { trigger: 'overlay'\|'close-btn'\|'finish' }) |

#### 数据结构

```typescript
interface CascaderOption {
  label: string        // 显示文本
  value: string|number // 选项值
  children?: Array<CascaderOption>  // 子选项
  disabled?: boolean   // 是否禁用
}
```

#### 重要说明

**value 格式：**
- `value` 是 `string` 或 `number` 类型，**不是数组**
- 存储的是最终选中叶子节点的值
- 选中 "广东省 > 深圳市 > 南山区" 后，value 是 `'440305'`（南山区编码）

**事件参数：**
- `@change` 事件会在选择叶子节点后自动触发并关闭
- `context.selectedOptions` 是包含所有层级标签的数组，如 `['广东省', '深圳市', '南山区']`

**初始化选中值：**
```typescript
// 编辑时初始化：根据已选的区县找到对应的 value
const district = addressOptions
  .find(p => p.label === '广东省')
  ?.children?.find(c => c.label === '深圳市')
  ?.children?.find(d => d.label === '南山区')

addressValue.value = district?.value || '' // '440305'
```

---

### Popup 弹出层

由其他控件触发，屏幕滑出或弹出一块自定义内容区域。

#### 引入

```js
import TPopup from 'tdesign-uniapp/popup/popup.vue';
```

#### 基础用法

```html
<!-- 不同方向 -->
<t-popup v-model:visible="visible" placement="top">顶部弹出</t-popup>
<t-popup v-model:visible="visible" placement="bottom">底部弹出</t-popup>
<t-popup v-model:visible="visible" placement="left">左侧弹出</t-popup>
<t-popup v-model:visible="visible" placement="right">右侧弹出</t-popup>
<t-popup v-model:visible="visible" placement="center">居中弹出</t-popup>

<!-- 带关闭按钮 -->
<t-popup v-model:visible="visible" :close-btn="true">
  内容
</t-popup>

<!-- 自定义关闭按钮 -->
<t-popup v-model:visible="visible" close-btn="关闭">
  内容
</t-popup>
```

#### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| visible | Boolean | - | 是否显示 |
| placement | String | top | 弹出位置。可选项：top/left/right/bottom/center |
| close-btn | Boolean/String | - | 关闭按钮 |
| show-overlay | Boolean | true | 是否显示遮罩层 |
| close-on-overlay-click | Boolean | true | 点击遮罩层是否关闭 |
| duration | Number | 240 | 动画过渡时间 |
| z-index | Number | 11500 | 组件层级 |

---

### Loading 加载

用于表示页面或操作的加载状态，给予用户反馈的同时减缓等待的焦虑感。

#### 引入

```js
import TLoading from 'tdesign-uniapp/loading/loading.vue';
```

#### 基础用法

```html
<!-- 加载中 -->
<t-loading />

<!-- 带文字 -->
<t-loading text="加载中..." />

<!-- 不同布局 -->
<t-loading layout="horizontal" text="横向布局" />
<t-loading layout="vertical" text="纵向布局" />

<!-- 不同尺寸 -->
<t-loading size="small" />
<t-loading size="medium" />
<t-loading size="large" />
<t-loading size="40px" />

<!-- 不同主题 -->
<t-loading theme="circular" />
<t-loading theme="spinner" />
<t-loading theme="dots" />

<!-- 延迟显示 -->
<t-loading :delay="500" text="延迟500ms显示" />

<!-- 进度 -->
<t-loading :progress="30" text="30%" />
```

#### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| loading | Boolean | true | 是否处于加载状态 |
| text | String | - | 加载提示文案 |
| theme | String | circular | 加载组件类型。可选项：circular/spinner/dots |
| size | String | '20px' | 尺寸 |
| delay | Number | 0 | 延迟显示时间，单位毫秒 |
| duration | Number | 800 | 动画执行完成一次的时间 |
| progress | Number | - | 加载进度 |
| layout | String | horizontal | 对齐方式。可选项：horizontal/vertical |
| fullscreen | Boolean | false | 是否全屏加载 |

---

### Checkbox 多选框

用于预设的一组选项中执行多项选择，并呈现选择结果。

#### 引入

```js
import TCheckbox from 'tdesign-uniapp/checkbox/checkbox.vue';
import TCheckboxGroup from 'tdesign-uniapp/checkbox-group/checkbox-group.vue';
```

#### 基础用法

```html
<!-- 基础多选 -->
<t-checkbox-group v-model:value="checkedValues">
  <t-checkbox value="apple">苹果</t-checkbox>
  <t-checkbox value="orange">橘子</t-checkbox>
  <t-checkbox value="banana">香蕉</t-checkbox>
</t-checkbox-group>

<!-- 配置方式 -->
<t-checkbox-group :options="['北京', '上海', '广州']" v-model:value="checkedValues" />

<!-- 带全选 -->
<t-checkbox-group v-model:value="checkedValues">
  <t-checkbox :check-all="true" value="all">全选</t-checkbox>
  <t-checkbox value="apple">苹果</t-checkbox>
  <t-checkbox value="orange">橘子</t-checkbox>
</t-checkbox-group>

<!-- 不同样式 -->
<t-checkbox-group v-model:value="checkedValues">
  <t-checkbox icon="circle">圆形图标</t-checkbox>
  <t-checkbox icon="line">线框图标</t-checkbox>
  <t-checkbox icon="rectangle">矩形图标</t-checkbox>
</t-checkbox-group>

<!-- 禁用状态 -->
<t-checkbox v-model:checked="checked" disabled>禁用选项</t-checkbox>

<!-- 只读状态 -->
<t-checkbox v-model:checked="checked" readonly>只读选项</t-checkbox>
```

#### Checkbox Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| checked | Boolean | - | 是否选中 |
| disabled | Boolean | undefined | 是否禁用 |
| readonly | Boolean | undefined | 只读状态 |
| value | String/Number/Boolean | - | 多选框的值 |
| label | String | - | 主文案 |
| content | String | - | 多选框内容 |
| icon | String/Array | 'circle' | 自定义选中图标 |
| placement | String | left | 多选框和内容相对位置。可选项：left/right |
| check-all | Boolean | false | 是否为全选选项 |
| indeterminate | Boolean | false | 是否为半选 |

#### CheckboxGroup Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| value | Array | - | 选中值 |
| options | Array | [] | 以配置形式设置子元素 |
| disabled | Boolean | undefined | 是否禁用组件 |
| max | Number | undefined | 最多选中的数量 |

---

### Switch 开关

用于控制某个功能的开启和关闭。

#### 引入

```js
import TSwitch from 'tdesign-uniapp/switch/switch.vue';
```

#### 基础用法

```html
<!-- 基础开关 -->
<t-switch v-model:value="checked" />

<!-- 带描述 -->
<t-switch v-model:value="checked" :label="['开', '关']" />

<!-- 自定义颜色 -->
<t-switch v-model:value="checked" custom-color="#00a870" />

<!-- 加载状态 -->
<t-switch v-model:value="checked" :loading="true" />

<!-- 禁用状态 -->
<t-switch v-model:value="checked" :disabled="true" />

<!-- 不同尺寸 -->
<t-switch v-model:value="checked" size="small" />
<t-switch v-model:value="checked" size="medium" />
<t-switch v-model:value="checked" size="large" />

<!-- 自定义值 -->
<t-switch v-model:value="status" :custom-value="[1, 0]" />

<!-- 带图标 -->
<t-switch v-model:value="checked" :icon="['check', 'close']" />
```

#### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| value | String/Number/Boolean | - | 开关值 |
| disabled | Boolean | undefined | 是否禁用 |
| loading | Boolean | false | 是否处于加载中状态 |
| size | String | medium | 开关尺寸。可选项：small/medium/large |
| label | Array | [] | 开关内容，[开启时内容，关闭时内容] |
| icon | Array | [] | 开关的图标，[打开时图标，关闭时图标] |
| custom-value | Array | [true, false] | 自定义开关的值 |

---

### Radio 单选框

用于在预设的一组选项中执行单项选择，并呈现选择结果。

#### 引入

```js
import TRadio from 'tdesign-uniapp/radio/radio.vue';
import TRadioGroup from 'tdesign-uniapp/radio-group/radio-group.vue';
```

#### 基础用法

```html
<!-- 基础单选 -->
<t-radio-group v-model:value="selectedValue">
  <t-radio value="apple">苹果</t-radio>
  <t-radio value="orange">橘子</t-radio>
  <t-radio value="banana">香蕉</t-radio>
</t-radio-group>

<!-- 配置方式 -->
<t-radio-group :options="['北京', '上海', '广州']" v-model:value="selectedValue" />

<!-- 允许取消选中 -->
<t-radio-group v-model:value="selectedValue" :allow-uncheck="true">
  <t-radio value="option1">选项1</t-radio>
</t-radio-group>

<!-- 不同样式 -->
<t-radio-group v-model:value="selectedValue">
  <t-radio icon="circle">圆形图标</t-radio>
  <t-radio icon="line">线框图标</t-radio>
  <t-radio icon="dot">圆点图标</t-radio>
</t-radio-group>

<!-- 禁用状态 -->
<t-radio v-model:checked="checked" disabled>禁用选项</t-radio>

<!-- 只读状态 -->
<t-radio v-model:checked="checked" readonly>只读选项</t-radio>
```

#### Radio Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| checked | Boolean | false | 是否选中 |
| disabled | Boolean | undefined | 是否禁用 |
| readonly | Boolean | undefined | 只读状态 |
| value | String/Number/Boolean | false | 单选按钮的值 |
| label | String | - | 主文案 |
| content | String | - | 单选内容 |
| icon | String/Array | 'circle' | 自定义选中图标。可选项：circle/line/dot |
| placement | String | left | 复选框和内容相对位置。可选项：left/right |
| allow-uncheck | Boolean | false | 是否允许取消选中 |

#### RadioGroup Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| value | String/Number/Boolean | - | 选中的值 |
| options | Array | - | 以配置形式设置子元素 |
| disabled | Boolean | undefined | 是否禁用全部子单选框 |
| allow-uncheck | Boolean | false | 是否允许取消选中 |

---

### Stepper 步进器

用于数量的增减。

#### 引入

```js
import TStepper from 'tdesign-uniapp/stepper/stepper.vue';
```

#### 基础用法

```html
<!-- 基础步进器 -->
<t-stepper v-model:value="value" />

<!-- 不同步长 -->
<t-stepper v-model:value="value" :step="5" />

<!-- 限制范围 -->
<t-stepper v-model:value="value" :min="0" :max="100" />

<!-- 禁用输入框 -->
<t-stepper v-model:value="value" :disable-input="true" />

<!-- 不同尺寸 -->
<t-stepper v-model:value="value" size="small" />
<t-stepper v-model:value="value" size="medium" />
<t-stepper v-model:value="value" size="large" />

<!-- 不同主题 -->
<t-stepper v-model:value="value" theme="normal" />
<t-stepper v-model:value="value" theme="filled" />
<t-stepper v-model:value="value" theme="outline" />

<!-- 禁用状态 -->
<t-stepper v-model:value="value" disabled />

<!-- 整数/小数 -->
<t-stepper v-model:value="value" :integer="true" />
<t-stepper v-model:value="value" :integer="false" />
```

#### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| value | String/Number | 0 | 值 |
| min | Number | 0 | 最小值 |
| max | Number | 100 | 最大值 |
| step | Number | 1 | 步长 |
| disabled | Boolean | undefined | 禁用全部操作 |
| disable-input | Boolean | false | 禁用输入框 |
| integer | Boolean | true | 是否整型 |
| size | String | medium | 组件尺寸。可选项：small/medium/large |
| theme | String | normal | 组件风格。可选项：normal/filled/outline |

#### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| change | 数值发生变更时触发 | (context: { value: string\|number }) |
| overlimit | 数值超出限制时触发 | (context: {type: 'minus'\|'plus'}) |

---

### Tabs 选项卡

用于内容分类后的展示切换。

#### 引入

```js
import TTabs from 'tdesign-uniapp/tabs/tabs.vue';
import TTabsPanel from 'tdesign-uniapp/tab-panel/tab-panel.vue';
```

#### 基础用法

```html
<!-- 基础选项卡 -->
<t-tabs v-model:value="activeValue">
  <t-tab-panel label="标签页一" value="1">内容一</t-tab-panel>
  <t-tab-panel label="标签页二" value="2">内容二</t-tab-panel>
  <t-tab-panel label="标签页三" value="3">内容三</t-tab-panel>
</t-tabs>

<!-- 不同主题 -->
<t-tabs v-model:value="value" theme="line">线条样式</t-tabs>
<t-tabs v-model:value="value" theme="tag">标签样式</t-tabs>
<t-tabs v-model:value="value" theme="card">卡片样式</t-tabs>

<!-- 带图标 -->
<t-tabs v-model:value="value">
  <t-tab-panel label="首页" value="home" icon="home">首页内容</t-tab-panel>
  <t-tab-panel label="消息" value="message" icon="notification">消息内容</t-tab-panel>
  <t-tab-panel label="我的" value="me" icon="user">我的内容</t-tab-panel>
</t-tabs>

<!-- 带徽章 -->
<t-tabs v-model:value="value">
  <t-tab-panel label="消息" value="msg" :badge-props="{ count: 10 }">消息内容</t-tab-panel>
  <t-tab-panel label="通知" value="notice" :badge-props="{ dot: true }">通知内容</t-tab-panel>
</t-tabs>

<!-- 禁用滑动 -->
<t-tabs v-model:value="value" :swipeable="false">
  <t-tab-panel label="标签一" value="1">内容一</t-tab-panel>
  <t-tab-panel label="标签二" value="2">内容二</t-tab-panel>
</t-tabs>

<!-- 懒加载 -->
<t-tabs v-model:value="value">
  <t-tab-panel label="标签一" value="1" :lazy="true">内容一</t-tab-panel>
  <t-tab-panel label="标签二" value="2" :lazy="true">内容二</t-tab-panel>
</t-tabs>
```

#### Tabs Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| value | String/Number | - | 激活的选项卡值 |
| theme | String | line | 标签样式。可选项：line/tag/card |
| swipeable | Boolean | true | 是否可以滑动切换 |
| show-bottom-line | Boolean | true | 是否展示底部激活线条 |
| space-evenly | Boolean | true | 选项卡头部空间是否均分 |
| sticky | Boolean | false | 是否开启粘性布局 |
| animation | Object | - | 动画效果设置 |

#### TabPanel Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| label | String | - | 选项卡名称 |
| value | String/Number | - | 选项卡的值 |
| disabled | Boolean | false | 是否禁用当前选项卡 |
| icon | String/Object | - | 图标 |
| badge-props | Object | {} | 透传至 Badge 组件 |
| lazy | Boolean | false | 是否启用懒加载 |

---

### Grid 宫格

用于功能入口布局，将页面或特定区域切分成若干等大的区块。

#### 引入

```js
import TGrid from 'tdesign-uniapp/grid/grid.vue';
import TGridItem from 'tdesign-uniapp/grid-item/grid-item.vue';
```

#### 基础用法

```html
<!-- 基础宫格 -->
<t-grid :column="4">
  <t-grid-item text="文字" image="图片地址" />
  <t-grid-item text="文字" image="图片地址" />
  <t-grid-item text="文字" image="图片地址" />
  <t-grid-item text="文字" image="图片地址" />
</t-grid>

<!-- 带图标 -->
<t-grid :column="4">
  <t-grid-item text="首页" icon="home" />
  <t-grid-item text="消息" icon="notification" />
  <t-grid-item text="设置" icon="setting" />
  <t-grid-item text="我的" icon="user" />
</t-grid>

<!-- 带描述 -->
<t-grid :column="3">
  <t-grid-item text="标题" description="描述文字" />
  <t-grid-item text="标题" description="描述文字" />
  <t-grid-item text="标题" description="描述文字" />
</t-grid>

<!-- 带徽章 -->
<t-grid :column="3">
  <t-grid-item text="消息" :badge-props="{ count: 10 }" />
  <t-grid-item text="通知" :badge-props="{ dot: true }" />
</t-grid>

<!-- 不同列数 -->
<t-grid :column="2">
  <t-grid-item text="选项" />
  <t-grid-item text="选项" />
</t-grid>

<t-grid :column="3">
  <t-grid-item text="选项" />
  <t-grid-item text="选项" />
  <t-grid-item text="选项" />
</t-grid>

<!-- 带边框 -->
<t-grid :column="3" border>
  <t-grid-item text="选项" />
  <t-grid-item text="选项" />
  <t-grid-item text="选项" />
</t-grid>

<!-- 卡片样式 -->
<t-grid :column="2" theme="card">
  <t-grid-item text="卡片1" description="描述" />
  <t-grid-item text="卡片2" description="描述" />
</t-grid>

<!-- 可滚动 -->
<t-grid :column="4" scroll>
  <t-grid-item text="选项" v-for="i in 10" :key="i" />
</t-grid>
```

#### Grid Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| column | Number | 4 | 每一行的列数量 |
| border | Boolean/Object | false | 边框 |
| gutter | Number | - | 间隔大小 |
| hover | Boolean | false | 是否开启点击反馈 |
| theme | String | default | 宫格风格。可选项：default/card |
| align | String | center | 内容对齐方式。可选项：left/center |

#### GridItem Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| text | String | - | 文本 |
| description | String | - | 描述文字 |
| icon | String/Object | - | 图标名称 |
| image | String | - | 图片地址 |
| badge-props | Object | {} | 透传至 Badge 属性 |
| url | String | - | 点击后的跳转链接 |
| layout | String | vertical | 内容布局方式。可选项：vertical/horizontal |

---

### Search 搜索框

用于用户输入搜索信息，并进行页面内容搜索。

#### 引入

```js
import TSearch from 'tdesign-uniapp/search/search.vue';
```

#### 基础用法

```html
<!-- 基础搜索框 -->
<t-search v-model:value="value" placeholder="搜索" />

<!-- 带操作按钮 -->
<t-search
  v-model:value="value"
  placeholder="搜索"
  action="搜索"
  @action-click="onSearch"
  @submit="onSubmit"
/>

<!-- 不同形状 -->
<t-search v-model:value="value" shape="square" />
<t-search v-model:value="value" shape="round" />

<!-- 居中 -->
<t-search v-model:value="value" :center="true" />

<!-- 禁用清除 -->
<t-search v-model:value="value" :clearable="false" />

<!-- 禁用状态 -->
<t-search v-model:value="value" disabled />

<!-- 聚焦状态 -->
<t-search v-model:value="value" :focus="true" />

<!-- 字数限制 -->
<t-search v-model:value="value" :maxlength="20" />
<t-search v-model:value="value" :maxcharacter="30" />

<!-- 自定义左侧图标 -->
<t-search v-model:value="value" left-icon="search" />
```

#### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| value | String | - | 值 |
| placeholder | String | - | 占位符 |
| shape | String | 'square' | 搜索框形状。可选项：square/round |
| action | String | - | 自定义右侧操作按钮文字 |
| center | Boolean | false | 是否居中 |
| clearable | Boolean | true | 是否启用清除控件 |
| disabled | Boolean | false | 是否禁用 |
| focus | Boolean | false | 是否聚焦 |
| maxlength | Number | -1 | 最大输入长度 |
| maxcharacter | Number | - | 最大字符数(中文算2) |
| left-icon | String | 'search' | 左侧图标 |

#### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| submit | 提交时触发 | (context: { value: string }) |
| change | 值发生变化时触发 | (context: { value: string }) |
| focus | 聚焦时触发 | (context: { value: string }) |
| blur | 失去焦点时触发 | (context: { value: string }) |
| clear | 点击清除时触发 | (context: { value: string }) |
| action-click | 点击右侧操作按钮时触发 | - |

---

### Cell 单元格

列表单元格，常用作设置项、功能入口、表单输入等。

#### 引入

```js
import TCell from 'tdesign-uniapp/cell/cell.vue';
import TCellGroup from 'tdesign-uniapp/cell-group/cell-group.vue';
```

#### 基础用法

```html
<t-cell-group>
  <!-- 基础单元格 -->
  <t-cell title="单行标题" note="辅助信息" />
  <t-cell title="单行标题" description="底部说明文字" />

  <!-- 带图标 -->
  <t-cell title="单元格" left-icon="app" />
  <t-cell title="单元格" right-icon="chevron-right" />

  <!-- 带箭头 -->
  <t-cell title="跳转" arrow url="/pages/index/index" />
  <t-cell title="点击" arrow hover />

  <!-- 带图片 -->
  <t-cell title="单元格" image="图片地址" />

  <!-- 分组标题 -->
  <t-cell-group title="分组标题">
    <t-cell title="单元格" />
    <t-cell title="单元格" />
  </t-cell-group>

  <!-- 卡片样式 -->
  <t-cell-group theme="card">
    <t-cell title="单元格" />
    <t-cell title="单元格" />
  </t-cell-group>

  <!-- 必填 -->
  <t-cell title="用户名" :required="true" />
</t-cell-group>
```

#### Cell Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| title | String | - | 标题 |
| description | String | - | 下方内容描述 |
| note | String | - | 和标题同行的说明文字 |
| left-icon | String/Object | - | 左侧图标 |
| right-icon | String/Object | - | 最右侧图标 |
| arrow | Boolean/Object | false | 是否显示右侧箭头 |
| url | String | - | 点击后跳转链接地址 |
| bordered | Boolean | true | 是否显示下边框 |
| hover | Boolean | - | 是否开启点击反馈 |
| required | Boolean | false | 是否显示表单必填星号 |
| align | String | middle | 右侧内容对齐方式。可选项：top/middle/bottom |

#### CellGroup Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| title | String | - | 单元格组标题 |
| bordered | Boolean | false | 是否显示组边框 |
| theme | String | default | 单元格组风格。可选项：default/card |

---

### Tag 标签

用于标记、分类和关键词展示。

#### 引入

```js
import TTag from 'tdesign-uniapp/tag/tag.vue';
```

#### 基础用法

```html
<!-- 基础标签 -->
<t-tag>默认标签</t-tag>

<!-- 不同主题 -->
<t-tag theme="primary">主要标签</t-tag>
<t-tag theme="success">成功标签</t-tag>
<t-tag theme="warning">警告标签</t-tag>
<t-tag theme="danger">危险标签</t-tag>
<t-tag theme="default">默认标签</t-tag>

<!-- 不同变体 -->
<t-tag variant="dark">深色标签</t-tag>
<t-tag variant="light">浅色标签</t-tag>
<t-tag variant="outline">线框标签</t-tag>
<t-tag variant="light-outline">浅色线框标签</t-tag>

<!-- 不同尺寸 -->
<t-tag size="small">小标签</t-tag>
<t-tag size="medium">中标签</t-tag>
<t-tag size="large">大标签</t-tag>

<!-- 可关闭标签 -->
<t-tag closable @close="onClose">可关闭标签</t-tag>

<!-- 禁用状态 -->
<t-tag disabled>禁用标签</t-tag>

<!-- 圆角标签 -->
<t-tag shape="round">圆角标签</t-tag>
<t-tag shape="square">方形标签</t-tag>
<t-tag shape="mark">标记标签</t-tag>
```

#### Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| theme | String | default | 标签主题。可选项：default/primary/success/warning/danger |
| variant | String | dark | 标签变体。可选项：dark/light/outline/light-outline |
| size | String | medium | 标签尺寸。可选项：small/medium/large |
| shape | String | square | 标签形状。可选项：square/round/mark |
| disabled | Boolean | false | 是否禁用 |
| closable | Boolean | false | 是否可关闭 |
| max-width | String/Number | - | 最大宽度 |
| icon | String/Object | - | 图标 |

#### Events

| 事件名 | 说明 |
| --- | --- |
| close | 关闭时触发 |
| click | 点击时触发 |

#### 使用示例（状态标签）

```html
<!-- 会员活跃状态 -->
<t-tag size="small" variant="light" :theme="memberStatusTheme">
  {{ memberStatusText }}
</t-tag>

<script setup lang="ts">
import { computed } from 'vue'

const memberStatusTheme = computed(() => {
  // 根据业务逻辑返回主题
  if (isActive) return 'success'  // 活跃 - 绿色
  if (isNormal) return 'warning'  // 一般 - 橙色
  return 'default'                // 沉睡 - 灰色
})
</script>
```

---

## 更多组件

更多组件文档请参考 `node_modules/tdesign-uniapp` 目录下各组件的 README.md 文件。

### 完整组件列表

- action-sheet - 动作面板
- avatar - 头像
- avatar-group - 头像组
- back-top - 返回顶部
- badge - 徽标
- button - 按钮
- calendar - 日历
- cascader - 级联选择器
- cell - 单元格
- cell-group - 单元格组
- checkbox - 多选框
- checkbox-group - 多选框组
- check-tag - 标签选择
- col - 栅格列
- collapse - 折叠面板
- collapse-panel - 折叠面板项
- color-picker - 颜色选择器
- count-down - 倒计时
- date-time-picker - 时间选择器
- dialog - 对话框
- divider - 分割线
- drawer - 抽屉
- dropdown-item - 下拉菜单项
- dropdown-menu - 下拉菜单
- empty - 空状态
- fab - 悬浮按钮
- footer - 页脚
- form - 表单
- form-item - 表单项
- grid - 宫格
- grid-item - 宫格项
- guide - 引导
- icon - 图标
- image - 图片
- image-viewer - 图片预览
- indexes - 索引
- indexes-anchor - 索引锚点
- input - 输入框
- link - 链接
- loading - 加载
- message - 消息通知
- message-item - 消息通知项
- navbar - 导航栏
- notice-bar - 公告栏
- overlay - 遮罩层
- picker - 选择器
- picker-item - 选择器项
- popover - 弹出气泡
- popup - 弹出层
- progress - 进度条
- pull-down-refresh - 下拉刷新
- qrcode - 二维码
- radio - 单选框
- radio-group - 单选框组
- rate - 评分
- result - 结果页
- row - 栅格行
- search - 搜索框
- side-bar - 侧边栏
- side-bar-item - 侧边栏项
- skeleton - 骨架屏
- slider - 滑动选择器
- stepper - 步进器
- steps - 步骤条
- step-item - 步骤条项
- sticky - 吸顶
- swipe-cell - 滑动操作
- swiper - 轮播图
- swiper-nav - 轮播导航
- switch - 开关
- tab-bar - 标签栏
- tab-bar-item - 标签栏项
- tab-panel - 选项卡面板
- tabs - 选项卡
- tag - 标签
- textarea - 多行文本框
- toast - 轻提示
- transition - 过渡动画
- tree-select - 树形选择
- upload - 上传
- watermark - 水印

## CSS 变量

所有组件都提供了 CSS 变量用于自定义样式，变量命名规则为 `--td-{组件名}-{属性名}`。

示例：

```css
/* 自定义按钮样式 */
--td-button-primary-bg-color: #0052d9;
--td-button-border-radius: 8px;

/* 自定义输入框样式 */
--td-input-bg-color: #f5f5f5;
```

## 外部样式类

所有组件都支持通过 `t-class` 和更具体的外部样式类来覆盖样式。

示例：

```html
<t-button t-class="custom-btn" t-class-icon="custom-icon" />
```

```css
.custom-btn {
  width: 200px;
}
.custom-icon {
  color: red;
}
```
