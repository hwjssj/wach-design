# PageHeader 页头

<script setup lang="ts">
import { ref } from 'vue'

const dslTabs = [
  { key: 'overview', label: '工程概览' },
  { key: 'model', label: '模型设计' },
  { key: 'arch', label: '架构信息' },
  { key: 'code', label: '代码模型' },
  { key: 'req', label: '需求模型' },
]
const dslActive = ref('overview')
</script>

页头组件：**传入 `tabs` 时**采用 DevUI DSL「全屏任务编辑页头部导航」布局（48px 高、左返回+标题、中页签、右操作）；**不传 `tabs`** 时为 Ant Design PageHeader 式简单布局。样式变量见 `tokens.css` 中 `--wach-page-header-*`，解析说明见 `devui-dsl-parsed/全屏任务编辑页头部导航-元素与样式.md`。

## 设计稿对照（Pixso / 配图）

以下为设计侧截图，可与下方「DSL 还原示例」逐项对照。

![全屏任务编辑页头部导航设计稿](/page-header-dsl-reference.png)

## 示例

### DSL 还原：全屏任务编辑页头部导航（带页签）

与仓库内 `devui-dsl-parsed/全屏任务编辑页头部导航.json`、`全屏任务编辑页头部导航-元素与样式.md` 及上方配图一致，包含：

- 画布 **1920×48**，白底 **`#fff`**，底边 **`1px #f3f3f3`**
- 左侧：返回 **16×16** `#191919`，标题 **18px/700/26px** `#191919`，标题区宽约 **287px**，与页签区间距 **16px**
- 中部：5 个页签各 **88×42**，总宽 **440**；首项「工程概览」为**选中**态；文案依次为 **工程概览 / 模型设计 / 架构信息 / 代码模型 / 需求模型**
- 右侧：次要 **80×32**、`#c9c9c9` 边框，文案「编辑」×2，间距 **8px**；主按钮 **106×32**、**`#5e7ce0`**、「保存并执行」

外层 **`page-header-dsl-canvas`** 宽度 **1920px**（超出视口可横向滚动），与 Pixso 画板对齐；业务页用 `width: 100%` 即可。

<DemoBlock>

<div class="page-header-dsl-canvas">
  <WachPageHeader
    title="Pipeline_V8R21C00_sys_FCSD"
    show-back
    :tabs="dslTabs"
    v-model:active-tab="dslActive"
    @back="() => {}"
  >
    <template #extra>
      <WachButton
        type="secondary"
        style="width: 80px; min-width: 80px; height: 32px; box-sizing: border-box; padding: 0 8px"
      >编辑</WachButton>
      <WachButton
        type="secondary"
        style="width: 80px; min-width: 80px; height: 32px; box-sizing: border-box; padding: 0 8px"
      >编辑</WachButton>
      <WachButton
        type="primary"
        style="width: 106px; min-width: 106px; height: 32px; box-sizing: border-box; padding: 0 8px"
      >保存并执行</WachButton>
    </template>
  </WachPageHeader>
</div>

当前页签：`{{ dslActive }}`

::: details 查看代码
```vue
<script setup lang="ts">
import { ref } from 'vue'
const dslTabs = [
  { key: 'overview', label: '工程概览' },
  { key: 'model', label: '模型设计' },
  { key: 'arch', label: '架构信息' },
  { key: 'code', label: '代码模型' },
  { key: 'req', label: '需求模型' },
]
const dslActive = ref('overview')
</script>
<template>
  <div class="page-header-dsl-canvas">
    <WachPageHeader
      title="Pipeline_V8R21C00_sys_FCSD"
      show-back
      :tabs="dslTabs"
      v-model:active-tab="dslActive"
      @back="onBack"
    >
      <template #extra>
        <WachButton type="secondary" style="width:80px;min-width:80px;height:32px;box-sizing:border-box;padding:0 8px">编辑</WachButton>
        <WachButton type="secondary" style="width:80px;min-width:80px;height:32px;box-sizing:border-box;padding:0 8px">编辑</WachButton>
        <WachButton type="primary" style="width:106px;min-width:106px;height:32px;box-sizing:border-box;padding:0 8px">保存并执行</WachButton>
      </template>
    </WachPageHeader>
  </div>
</template>
```
:::

</DemoBlock>

### 简单页头（无 `tabs`，Ant Design 式）

<DemoBlock>

<WachPageHeader title="页面标题" sub-title="说明文字" />

</DemoBlock>

### 带返回与 extra

<DemoBlock>

<WachPageHeader title="详情页" sub-title="副标题" show-back @back="() => {}">
  <template #extra>
    <WachButton type="secondary">次要</WachButton>
    <WachButton type="primary" style="margin-left: 8px">主要</WachButton>
  </template>
</WachPageHeader>

</DemoBlock>

### Ghost

<DemoBlock>

<div style="padding: 16px; background: var(--wach-color-bg-soft); border-radius: 8px;">
  <WachPageHeader title="透明背景" ghost />
</div>

</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| title | 标题 | `string` | `''` |
| subTitle | 副标题（仅无 `tabs` 时展示） | `string` | `''` |
| ghost | 透明背景 | `boolean` | `false` |
| showBack | 显示返回 | `boolean` | `false` |
| tabs | 中部页签；**有值时启用 DSL 三栏导航布局** | `PageHeaderTab[]` | `[]` |
| activeTab | 当前页签 key（与 `v-model:activeTab` 配合） | `string` | — |

### Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| back | 点击返回 | `(ev: MouseEvent)` |
| update:activeTab | 页签切换（v-model） | `(key: string)` |
| tabChange | 页签切换 | `(key: string)` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| breadcrumb | 面包屑（导航模式下在条上方） |
| backIcon | 自定义返回图标 |
| avatar | 仅简单模式 |
| title | 自定义标题 |
| subTitle | 仅简单模式 |
| tags | 仅简单模式 |
| extra | 右侧操作区 |
| footer | 底部 |

### 类型

- `PageHeaderTab`：`{ key: string; label: string }`

## 设计规范（DSL 摘要）

- 导航条高 **48px**，左右内边距 **20px**，底边 **1px #f3f3f3**，背景 **#fff**，字体 **HarmonyOS Sans SC**（`--wach-page-header-nav-font-family`）。
- 左侧：返回 **16×16** `#191919`；标题 **18px / 700 / 行高 26px** `#191919`；标题区最大宽约 **287px**（`--wach-page-header-nav-left-max`），与页签区间距 **16px**（`--wach-page-header-bar-gap`）。
- 竖直偏移（相对条顶）：标题区 **11px**、页签区 **6px**、右侧按钮 **8px**（`--wach-page-header-nav-offset-*`）。
- 页签：**88×42** 固定宽、5 项总宽 **440**；页签紧跟左侧（**非**视口居中）；选中底 `#f3f3f3`、上/左/右 **1px #f3f3f3**，字 **14/500/#191919**；默认 **14/400/#777**；圆角 **4px 4px 0 0**。
- 右侧：次要 **80×32**、边框 `#c9c9c9`、间距 **8px**；主按钮 **106×32**、**`#5e7ce0`**（`extra` 内 `primary` 由 `:deep` 覆盖）。

## 变更说明

| 版本 | 说明 |
|------|------|
| 0.0.4 | DSL 导航：页签区左对齐（距标题 16px）、页签固定 88×42、左侧 287px 与 JSON 竖直偏移；文档示例 1920 画布 + 按钮精确尺寸 |
| 0.0.3 | 导航条改为 flex：左区限宽、中部页签可横向滚动、右侧操作 `flex-shrink: 0`；文档 DSL 示例加横向滚动容器 |
| 0.0.2 | 按「全屏任务编辑页头部导航.json」与配图重写：`tabs` 三栏导航、Token 与主按钮 `#5e7ce0`；保留无 `tabs` 简单模式 |
| 0.0.1 | 初始版本：参考 Ant Design Vue PageHeader |
