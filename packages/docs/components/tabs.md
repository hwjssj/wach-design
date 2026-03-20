# Tabs 页签

<script setup lang="ts">
import { ref } from 'vue'
const activeTab = ref('tab1')
const activeTab2 = ref('a')
</script>

按 DevUI DSL 解析规范实现的页签：对应设计稿「页签 Slider」（导航底槽浅灰、当前项为白色 pill），可切换面板内容。

## 示例

### 基础用法

<DemoBlock>

<WachTabs v-model="activeTab">
  <WachTab id="tab1" title="Tab1">Tab1 内容</WachTab>
  <WachTab id="tab2" title="Tab2">Tab2 内容</WachTab>
  <WachTab id="tab3" title="Tab3">Tab3 内容</WachTab>
</WachTabs>

::: details 查看代码
```vue
<template>
  <WachTabs v-model="activeTab">
    <WachTab id="tab1" title="Tab1">Tab1 内容</WachTab>
    <WachTab id="tab2" title="Tab2">Tab2 内容</WachTab>
    <WachTab id="tab3" title="Tab3">Tab3 内容</WachTab>
  </WachTabs>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const activeTab = ref('tab1')
</script>
```
:::

</DemoBlock>

### 禁用某一项

<DemoBlock>

<WachTabs v-model="activeTab2">
  <WachTab id="a" title="可用">内容 A</WachTab>
  <WachTab id="b" title="禁用" disabled>内容 B</WachTab>
  <WachTab id="c" title="可用">内容 C</WachTab>
</WachTabs>

::: details 查看代码
```vue
<WachTab id="b" title="禁用" disabled>内容 B</WachTab>
```
:::

</DemoBlock>

## API

### WachTabs Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 当前激活的 tab id（v-model） | `string \| number` | 首个 tab 的 id |
| showContent | 是否显示下方内容区 | `boolean` | `true` |

### WachTabs 事件

| 事件名 | 说明 | 参数 |
|--------|------|------|
| update:modelValue | v-model 更新 | `(id: string \| number)` |
| change | 切换时触发 | `(id: string \| number)` |

### WachTab Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| id | 唯一 id，与 v-model 对应 | `string \| number` | 必填 |
| title | 页签标题 | `string` | — |
| disabled | 是否禁用 | `boolean` | `false` |

### WachTab Slots

| 插槽名 | 说明 |
|--------|------|
| default | 该页签对应的面板内容 |

## 设计规范（来自 JSON 解析）

- **导航底槽**：高 32px，背景 `rgba(25,25,25,0.05)`，圆角 4px，内边距 2px。
- **页签项 (pill)**：高 28px，圆角 4px；**选中** = 白底 #fff + 主文字色 #191919、字重 500；**未选** = 透明底 + 次要文字色 #777、字重 400。字体 HarmonyOS Sans SC，14px，行高 22px。
- 样式由 `--wach-tabs-*` 控制，详见 `devui-dsl-parsed/页签-Slider-元素与样式.md` 与「主题与 Token」。

## 变更说明

| 版本 | 说明 |
|------|------|
| 0.0.2 | 按 DevUI 页签 Slider.json 重写：pill 形态、Token 对齐设计稿，移除底部横条 |
| 0.0.1 | 基础 Slider 页签，WachTabs + WachTab |
