# 微信用户端与验证码接口

来源文档：`C:\Users\26249\Downloads\如风科技 (1).md`  
本次提取时间：2026-04-13  
用途：用于当前小程序用户端的登录/注册弹窗、游客态转登录、商品浏览与用户资料补全等功能对接。  

## 一、对接建议

- 登录注册弹窗优先基于以下能力设计：
  - 微信小程序登录
  - 手机号码获取
  - 用户资料补全
- 若后续需要手机号验证码登录/注册兜底，可复用本文档中的验证码发送与验证接口。
- 文档更新后，可继续基于同一来源文档增量同步本文件。

## 二、认证与约定

### 微信用户端目录级说明

- 目录 Header 要求：`Authorization: Bearer`
- 当前文档中的微信用户端接口大多标注为“继承父级认证”
- 但从接口语义看，`小程序用户登录`、`手机号码获取` 这类接口通常属于登录前接口，真实联调时以后端实际鉴权为准

### 验证码接口额外说明

- 验证码发送/验证接口需要 `x-api-key`
- 源文档说明：真实 `x-api-key` 需联系接口提供方获取
- 接口存在手机号发送限制与按 IP 限流

## 三、微信用户端接口

### 1. 小程序用户登录

- 状态：开发中
- 方法：`POST`
- URL：`https://rfsn.yywk.net/wechat/member/onlogin?code=`
- Content-Type：`none`

请求参数：

| 参数 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| code | Query | 是 | string | 使用 `wx.login` 获取的微信 `code` |

成功响应关键字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| data.sessionId | string | 登录会话标识 |
| data.userInfo.phone | string | 手机号，可能为空 |
| data.userInfo.uid | string | 用户唯一标识 |
| data.userInfo.avatar | string | 头像 |
| data.userInfo.nickname | string | 昵称 |
| data.userInfo.address | string | 地址 |
| data.userInfo.status | boolean | 状态 |
| data.userInfo.storeId | number | 门店 ID |
| data.userInfo.cardFactorySerial | string | 会员卡序列号 |
| data.userInfo.coin | number | 游戏币 |
| data.userInfo.integral | number | 积分 |
| data.userInfo.ticket | number | 彩票/票数 |

前端接入建议：

- 小程序启动或登录弹窗确认登录时调用
- 成功后保存：
  - `sessionId`
  - `userInfo`
- 可作为“游客态 -> 登录态”的主入口

### 2. 手机号码获取

- 状态：开发中
- 方法：`GET`
- URL：`https://rfsn.yywk.net/wechat/member/GetUserPhoneNumber?code=&storeId=15`
- Content-Type：`none`

请求参数：

| 参数 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| code | Query | 是 | string | 微信 code |
| storeId | Query | 是 | number | 用户通过微信扫码获取的门店号码 |

成功响应关键字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| data.phone | string | 手机号 |
| data.uuid | string | 用户唯一标识 |
| data.avatar | string/null | 头像 |
| data.nickname | string/null | 昵称 |
| data.address | string/null | 地址 |
| data.coin | number | 游戏币 |
| data.integral | number | 积分 |
| data.ticket | number | 彩票/票数 |

前端接入建议：

- 适合“登录后补全手机号”或“微信授权手机号绑定”
- 结合当前门店选择逻辑，可传当前选中的 `storeId`

### 3. 上传用户资料

- 状态：开发中
- 方法：`POST`
- URL：`https://rfsn.yywk.net/wechat/member/updateaddress`
- Content-Type：`json`

请求 Body：

| 参数 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- |
| contacts | 否 | string | 联系人 |
| tel | 否 | string | 手机号 |
| address | 否 | string | 地址 |
| nickname | 否 | string | 昵称 |
| avatar | 否 | string | 头像 URL |

成功响应：

- `data: true`

前端接入建议：

- 可用于登录注册弹窗后的资料补全
- 也可用于“我的资料”页保存

### 4. 获取用户信息

- 状态：开发中
- 方法：`GET`
- URL：`https://rfsn.yywk.net/wechat/member/userinfo`
- Content-Type：`none`

成功响应关键字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| data.phone | string | 手机号 |
| data.uuid | string | 用户唯一标识 |
| data.avatar | string | 头像 |
| data.nickname | string | 昵称 |
| data.address | string | 地址 |
| data.status | boolean | 状态 |
| data.storeId | number | 门店 ID |
| data.coin | number | 游戏币 |
| data.integral | number | 积分 |
| data.ticket | number | 彩票/票数 |

前端接入建议：

- 登录后进入首页/我的页时拉取
- 用于游客态切登录态后的用户资产刷新

### 5. 获取商品类型

- 状态：已完成
- 方法：`GET`
- URL：`https://rfsn.yywk.net/wechat/member/shopCategories?pageSize=10&pageIndex=1`
- Content-Type：`none`

请求参数：

| 参数 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| pageSize | Query | 否 | number | 页长 |
| pageIndex | Query | 否 | number | 页码 |

成功响应关键字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| data.total | number | 总数 |
| data.list[].id | number | 分类 ID |
| data.list[].name | string | 分类名称 |
| data.list[].description | string | 分类描述 |
| data.list[].order | number | 排序 |

前端接入建议：

- 对应积分兑换/礼品商城分类 Tab

### 6. 获取商品

- 状态：已完成
- 方法：`GET`
- URL：`https://rfsn.yywk.net/wechat/member/barcodes?pageSize=10&pageIndex=1&categoryId=3`
- Content-Type：`none`

请求参数：

| 参数 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| pageSize | Query | 否 | number | 页长 |
| pageIndex | Query | 否 | number | 页码 |
| categoryId | Query | 是 | number | 分类 ID |

成功响应关键字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| data.total | number | 总数 |
| data.list[].id | number | 记录 ID |
| data.list[].name | string | 商品名 |
| data.list[].integral | number | 所需积分 |
| data.list[].inventories | number | 库存 |
| data.list[].image | string | 图片 |
| data.list[].categoryId | number | 分类 ID |
| data.list[].unit | string | 单位 |

前端接入建议：

- 对应积分兑换页商品列表
- 当前项目的 mock 商品列表后续可以替换为此接口

## 四、收银机中可复用的验证码接口

这两个接口虽然在源文档中位于“收银机”相关章节，但从能力上适合给小程序登录/注册弹窗复用。

### 1. 发送手机验证码

- 状态：已完成
- 方法：`POST`
- URL：`https://rfsn.yywk.net/api/verifyCode/send?phone=13127944967`
- Content-Type：`none`

请求 Header：

| 参数 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- |
| x-api-key | 是 | string | 内部调用 apikey |

请求参数：

| 参数 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| phone | Query | 是 | string | 手机号码 |

成功响应：

```json
{
  "code": 200,
  "message": "SMS sent successfully.",
  "data": {
    "code": 9728
  }
}
```

失败响应示例：

```json
{
  "code": 400,
  "message": "invalid API key",
  "data": null
}
```

前端接入建议：

- 登录注册弹窗中的“发送验证码”按钮
- 需要前端做倒计时、重复发送限制、错误提示

### 2. 验证手机验证码

- 状态：已完成
- 方法：`POST`
- URL：`https://rfsn.yywk.net/api/verifyCode/check?phone=13127944967&code=7418`
- Content-Type：`none`

请求 Header：

| 参数 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- |
| x-api-key | 是 | string | 内部调用 apikey |

请求参数：

| 参数 | 位置 | 必填 | 类型 | 说明 |
| --- | --- | --- | --- | --- |
| phone | Query | 是 | string | 手机号码 |
| code | Query | 是 | string | 用户输入的验证码 |

成功响应：

```json
{
  "code": 200,
  "message": "Verification successful.",
  "data": null
}
```

失败响应示例：

```json
{
  "code": 400,
  "message": "Verification code expired or not found.",
  "data": null
}
```

前端接入建议：

- 与“发送手机验证码”配套使用
- 成功后可继续：
  - 创建/绑定当前用户
  - 触发登录态切换
  - 拉取用户资料

## 五、登录注册弹窗建议对接顺序

### 方案 A：优先微信登录

1. 调用 `wx.login`
2. 请求 `小程序用户登录`
3. 若后端返回用户资料完整，则直接进入登录态
4. 若手机号缺失，再调用 `手机号码获取` 或打开资料补全

### 方案 B：手机号验证码兜底

1. 输入手机号
2. 调用 `发送手机验证码`
3. 输入验证码
4. 调用 `验证手机验证码`
5. 验证通过后：
   - 绑定微信身份，或
   - 向后端换取登录态（这一步需要后端补完整登录/注册闭环接口）

## 六、后续同步规则

后续你只要提供新的源文档路径，我可以按以下方式同步本文件：

1. 重新扫描 `微信用户端` 章节
2. 重新扫描验证码相关章节
3. 对比新增、删除、变更的接口
4. 直接更新本文件并标注变更点
