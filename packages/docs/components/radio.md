# Radio 单选框

<script setup lang="ts">
import { ref } from 'vue'
const radioVal = ref('a')
const radioRow = ref(1)
const radioDisabled = ref('x')
</script>

按 DevUI DSL 解析规范实现的单选框：单选项 + 单选框组，对应设计稿「单选框文本组合」（16px 圆、灰边框、文案 14px），支持横向/纵向、禁用。

## 示例

### 基础用法（纵向）

<DemoBlock>

<WachRadioGroup v-model="radioVal">
  <WachRadio value="a">选项 A</WachRadio>
  <WachRadio value="b">选项 B</WachRadio>
  <WachRadio value="c">选项 C</WachRadio>
</WachRadioGroup>

当前值：{{ radioVal }}

::: details 查看代码
```vue
<template>
  <WachRadioGroup v-model="radioVal">
    <WachRadio value="a">选项 A</WachRadio>
    <WachRadio value="b">选项 B</WachRadio>
    <WachRadio value="c">选项 C</WachRadio>
  </WachRadioGroup>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const radioVal = ref('a')
</script>
```
:::

</DemoBlock>

### 横向排列

<DemoBlock>

<WachRadioGroup v-model="radioRow" direction="row">
  <WachRadio :value="1">春</WachRadio>
  <WachRadio :value="2">夏</WachRadio>
  <WachRadio :value="3">秋</WachRadio>
  <WachRadio :value="4">冬</WachRadio>
</WachRadioGroup>

当前值：{{ radioRow }}

::: details 查看代码
```vue
<WachRadioGroup v-model="radioRow" direction="row">
  <WachRadio :value="1">春</WachRadio>
  <WachRadio :value="2">夏</WachRadio>
  ...
</WachRadioGroup>
```
:::

</DemoBlock>

### 禁用

<DemoBlock>

<WachRadioGroup v-model="radioDisabled">
  <WachRadio value="x">可选</WachRadio>
  <WachRadio value="y" disabled>禁用项</WachRadio>
  <WachRadio value="z">可选</WachRadio>
</WachRadioGroup>

::: details 查看代码
```vue
<WachRadio value="y" disabled>禁用项</WachRadio>
```
:::

</DemoBlock>

## API

### WachRadioGroup Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 当前选中的值（v-model） | `string \| number \| boolean` | — |
| name | 原生 name，用于表单 | `string` | — |
| direction | 排列方向 | `'row' \| 'column'` | `column` |
| disabled | 整组禁用 | `boolean` | `false` |

### WachRadioGroup 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| update:modelValue | v-model 更新 | `(v: string \| number \| boolean)` |
| change | 选中变化时触发 | `(v: string \| number \| boolean)` |

### WachRadio Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| value | 本选项的值（必填） | `string \| number \| boolean` | 必填 |
| modelValue | 单独使用时绑定值 | `string \| number \| boolean` | — |
| name | 原生 name（不在 Group 内时生效） | `string` | — |
| disabled | 是否禁用 | `boolean` | `false` |

### WachRadio 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| update:modelValue | 单独使用时 v-model 更新 | `(v)` |
| change | 选中时触发 | `(v)` |

### WachRadio Slots

| 插槽名 | 说明 |
|--------|------|
| default | 选项文案 |

## 设计规范（来自 JSON 解析）

- **单选框圆形**：16×16，背景 #fff，边框 1px solid #c9c9c9（devui-form-control-line），正圆；**选中**时圆内主题色实心点、边框为主题色。
- **文案**：颜色 #191919（devui-text），14px、字重 400，HarmonyOS Sans SC，行高 22px；与圆形间距 8px。
- 详见 `devui-dsl-parsed/单选框文本组合-元素与样式.md`；样式由 `--wach-radio-*` 控制。

## 变更说明

| 版本 | 说明 |
|------|------|
| 0.0.2 | 按 DevUI 单选框文本组合.json 重写：Token 对齐设计稿（16px 圆、#c9c9c9 边框、文案 14/400） |
| 0.0.1 | 初始版本：WachRadio + WachRadioGroup，参考 DevUI Vue Radio |
