# Accordion 折叠面板

<script setup lang="ts">
import { ref } from 'vue'

const active1 = ref<string[]>(['a'])
const active2 = ref<string[]>(['x'])
const customOpen = ref<string[]>(['t'])
/** Pixso / 手风琴.json：第三项展开，徽标 >99 显示 99+ */
const dslOpen = ref<string[]>(['c'])
</script>

侧栏式折叠列表，样式与交互对齐 **Pixso「手风琴」DSL**（`devui-dsl-parsed/手风琴.json`）：一级行 **36px**、可选**计数徽标**、**右箭头**折叠 / 旋转为**向下**展开；二级行 **WachAccordionSubItem**，左缩进 **24px**。通用「手风琴 / 多开」行为不变：`accordion` 与 `v-model`（展开 name 数组）。

## DSL 侧栏示例（与配图一致）

宽 **216px**、三项「基础设置」+ **99+** 徽标（`:badge="120"` 显示为 `99+`）；每项展开后均可下挂两行「项目信息」（与侧栏 DSL 二级行一致）。默认仅第三项展开。

<DemoBlock>

<div style="max-width: 216px">
  <WachAccordion v-model="dslOpen">
    <WachAccordionItem name="a" title="基础设置" :badge="120">
      <WachAccordionSubItem>项目信息</WachAccordionSubItem>
      <WachAccordionSubItem>项目信息</WachAccordionSubItem>
    </WachAccordionItem>
    <WachAccordionItem name="b" title="基础设置" :badge="120">
      <WachAccordionSubItem>项目信息</WachAccordionSubItem>
      <WachAccordionSubItem>项目信息</WachAccordionSubItem>
    </WachAccordionItem>
    <WachAccordionItem name="c" title="基础设置" :badge="120">
      <WachAccordionSubItem>项目信息</WachAccordionSubItem>
      <WachAccordionSubItem>项目信息</WachAccordionSubItem>
    </WachAccordionItem>
  </WachAccordion>
</div>

当前展开：`{{ dslOpen }}`

::: details 查看代码
```vue
<script setup lang="ts">
import { ref } from 'vue'
const dslOpen = ref<string[]>(['c'])
</script>
<template>
  <div style="max-width: 216px">
    <WachAccordion v-model="dslOpen">
      <WachAccordionItem name="a" title="基础设置" :badge="120">
        <WachAccordionSubItem>项目信息</WachAccordionSubItem>
        <WachAccordionSubItem>项目信息</WachAccordionSubItem>
      </WachAccordionItem>
      <WachAccordionItem name="b" title="基础设置" :badge="120">
        <WachAccordionSubItem>项目信息</WachAccordionSubItem>
        <WachAccordionSubItem>项目信息</WachAccordionSubItem>
      </WachAccordionItem>
      <WachAccordionItem name="c" title="基础设置" :badge="120">
        <WachAccordionSubItem>项目信息</WachAccordionSubItem>
        <WachAccordionSubItem>项目信息</WachAccordionSubItem>
      </WachAccordionItem>
    </WachAccordion>
  </div>
</template>
```
:::

</DemoBlock>

## 示例

### 手风琴（默认）

`accordion` 默认为 `true`，`v-model` 为当前展开项的 `name` **数组**；手风琴模式下最多一项。

<DemoBlock>

<WachAccordion v-model="active1">
  <WachAccordionItem name="a" title="面板 A">
    这是面板 A 的说明文案（非侧栏 DSL 时，为普通段落样式）。
  </WachAccordionItem>
  <WachAccordionItem name="b" title="面板 B">
    面板 B：展开上一项时本项会自动收起。
  </WachAccordionItem>
  <WachAccordionItem name="c" title="面板 C">
    面板 C 内容区。
  </WachAccordionItem>
</WachAccordion>

当前展开：`{{ active1 }}`

::: details 查看代码
```vue
<template>
  <WachAccordion v-model="active1">
    <WachAccordionItem name="a" title="面板 A">…</WachAccordionItem>
    <WachAccordionItem name="b" title="面板 B">…</WachAccordionItem>
    <WachAccordionItem name="c" title="面板 C">…</WachAccordionItem>
  </WachAccordion>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const active1 = ref<string[]>(['a'])
</script>
```
:::

</DemoBlock>

### 非手风琴（多项同时展开）

<DemoBlock>

<WachAccordion v-model="active2" :accordion="false">
  <WachAccordionItem name="x" title="第一项">
    第一项展开后的说明文案；可与第二项同时展开。
  </WachAccordionItem>
  <WachAccordionItem name="y" title="第二项">
    可与第一项同时展开。
  </WachAccordionItem>
  <WachAccordionItem name="z" title="第三项（禁用）" disabled>
    不可点击。
  </WachAccordionItem>
</WachAccordion>

当前展开：`{{ active2 }}`

::: details 查看代码
```vue
<WachAccordion v-model="active2" :accordion="false">
  <WachAccordionItem name="x" title="第一项">第一项展开后的说明文案；可与第二项同时展开。</WachAccordionItem>
  <WachAccordionItem name="y" title="第二项">可与第一项同时展开。</WachAccordionItem>
  <WachAccordionItem name="z" title="第三项（禁用）" disabled>不可点击。</WachAccordionItem>
</WachAccordion>
```
:::

</DemoBlock>

### 自定义标题与徽标插槽

可用 `#title`、**`#badge`** 完全自定义（覆盖 `badge` 属性）。

<DemoBlock>

<WachAccordion v-model="customOpen">
  <WachAccordionItem name="t">
    <template #title>
      <span style="font-weight: 700">自定义标题</span>
    </template>
    <template #badge>自定义</template>
    内容区与默认一致。
  </WachAccordionItem>
</WachAccordion>

::: details 查看代码
```vue
<script setup lang="ts">
import { ref } from 'vue'
const customOpen = ref<string[]>(['t'])
</script>
<template>
  <WachAccordion v-model="customOpen">
    <WachAccordionItem name="t">
      <template #title>
        <span style="font-weight: 700">自定义标题</span>
      </template>
      <template #badge>自定义</template>
      内容区与默认一致。
    </WachAccordionItem>
  </WachAccordion>
</template>
```
:::

</DemoBlock>

## API

### WachAccordion

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 当前展开的 `name` 列表（`v-model`） | `(string \| number)[]` | `[]` |
| accordion | 是否手风琴（仅一项展开） | `boolean` | `true` |

### 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| update:modelValue | 展开列表变化 | `(names: (string \| number)[]) => void` |
| change | 同 update:modelValue | `(names: (string \| number)[]) => void` |

### WachAccordionItem

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| name | 唯一标识，与 `modelValue` 对应 | `string \| number` | — |
| title | 标题文案 | `string` | `''` |
| badge | 计数徽标；数字 **>99** 显示为 **99+** | `string \| number` | — |
| disabled | 是否禁用 | `boolean` | `false` |

### WachAccordionSubItem

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| clickable | 为 `true` 时渲染为 `button`，可配合路由/点击 | `boolean` | `false` |

### 插槽

| 插槽 | 说明 |
|------|------|
| title | 标题（可选，覆盖 `title` 属性） |
| badge | 徽标（可选，覆盖 `badge` 属性） |
| default | 折叠区内容；侧栏 DSL 下建议放置 `WachAccordionSubItem` |

## 设计 Token

见 `tokens.css` 中 `--wach-accordion-*`（宽度 216、行高 36、徽标、缩进 24、间距 4 等）。

## 变更说明

| 版本 | 说明 |
|------|------|
| 0.0.2 | 按 Pixso「手风琴.json」重写侧栏视觉：无整框描边、项间距 4px、一级 36px 行 + 徽标 + chevron-right/展开旋转、二级 `WachAccordionSubItem`；`badge` / `#badge` |
| 0.0.1 | 初始版本：手风琴与多开、`v-model` 为 name 数组 |
