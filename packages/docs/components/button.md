# Button 按钮

按 DevUI DSL 解析规范实现的按钮：**次要按钮**对应设计稿「按钮-次要」（白底、灰边框、4px 圆角、14px 字），**主要按钮**为主题色填充。

## 示例

### 次要与主要

<DemoBlock>

<WachButton>次要</WachButton>
<WachButton type="primary" style="margin-left: 8px">主要</WachButton>

::: details 查看代码
```vue
<WachButton>次要</WachButton>
<WachButton type="primary">主要</WachButton>
```
:::

</DemoBlock>

### 尺寸

<DemoBlock>

<WachButton size="sm">小</WachButton>
<WachButton style="margin-left: 8px">中</WachButton>
<WachButton size="lg" style="margin-left: 8px">大</WachButton>

::: details 查看代码
```vue
<WachButton size="sm">小</WachButton>
<WachButton>中</WachButton>
<WachButton size="lg">大</WachButton>
```
:::

</DemoBlock>

### 禁用

<DemoBlock>

<WachButton disabled>禁用</WachButton>

::: details 查看代码
```vue
<WachButton disabled>禁用</WachButton>
```
:::

</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| type | 类型：次要(白底灰边) / 主要(主题色) | `'primary' \| 'secondary'` | `secondary` |
| size | 尺寸 | `'sm' \| 'md' \| 'lg'` | `md` |
| disabled | 是否禁用 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| click | 点击时触发（禁用时不会触发） | `(ev: MouseEvent)` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| default | 按钮文案 |

## 设计规范（来自 JSON 解析）

- **次要按钮**：背景 `#fff`，边框 `1px solid #c9c9c9`，圆角 4px，文字 `#191919`，14px / 400，行高 22px，高度 32px，左右内边距 16px。
- 可通过覆盖 `--wach-btn-*` 变量定制，见「主题与 Token」。

## 变更说明

| 版本 | 说明 |
|------|------|
| 0.0.2 | 按 DevUI 按钮-次要 JSON 规范重写：type=secondary/primary，size，Token 对齐设计稿 |
| 0.0.1 | 初始版本 |
