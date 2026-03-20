# CategorySearch 分类搜索

<script setup lang="ts">
import { ref, computed } from 'vue'
const keyword = ref('')
const selectedTags = ref<{ field: string; label: string; value: string }[]>([])
const category = [
  { field: 'type', label: '类型', options: [{ label: '全部', value: '' }, { label: '类型A', value: 'a' }, { label: '类型B', value: 'b' }] },
  { field: 'status', label: '状态', options: [{ label: '全部', value: '' }, { label: '启用', value: 'on' }, { label: '禁用', value: 'off' }] },
]
const selectedTagsText = computed(() =>
  selectedTags.value.length
    ? selectedTags.value.map((t) => `${t.label}:${t.value}`).join('、')
    : '—'
)
function onSearch(payload: { searchKey: string; selectedTags: { field: string; label: string; value: string }[] }) {
  keyword.value = payload.searchKey
  selectedTags.value = payload.selectedTags
}
</script>

按 DevUI DSL 解析规范实现的分类搜索：对应设计稿「分类搜索」（`devui-dsl-parsed/分类搜索.json`）；交互对齐 Vue DevUI CategorySearch：**聚焦或点击关键字输入框**后展开下拉，先选分类再选具体项；**分类类型不在输入框内用下拉展示**，仅 **已选条件** 以 tag 显示在输入框前；左侧搜索图标、右侧清空图标；参考 DevUI Vue CategorySearch。

## 交互说明

1. **输入框获得焦点或点击**：展开面板（**Teleport 到 `body` + `position: fixed`**，与 DevUI Dropdown 一致，不撑高输入框）；一级为尚未添加的分类列表，点某一类进入二级选具体选项。
2. **选毕一项**：写入 `selectedTags` 并关闭面板；可再次聚焦输入框继续添加其他分类（已添加的类不会出现在一级列表，需先点 tag 上 × 移除再选）。
3. **点击外侧**：关闭面板；**Esc**：二级返回一级或关闭面板。
4. **回车 / 左侧搜索图标**：触发 `search`。

## 示例

### 基本用法

<DemoBlock>

<WachCategorySearch
  :category="category"
  v-model:search-key="keyword"
  v-model:selected-tags="selectedTags"
  @search="onSearch"
/>

当前：关键字「{{ keyword || '—' }}」，已选分类 {{ selectedTagsText }}

::: details 查看代码
```vue
<template>
  <WachCategorySearch
    :category="category"
    v-model:search-key="keyword"
    v-model:selected-tags="selectedTags"
    @search="onSearch"
  />
</template>
<script setup lang="ts">
import { ref } from 'vue'
const keyword = ref('')
const selectedTags = ref([])
const category = [
  { field: 'type', label: '类型', options: [
    { label: '全部', value: '' }, { label: '类型A', value: 'a' }, { label: '类型B', value: 'b' }
  ]},
  { field: 'status', label: '状态', options: [
    { label: '全部', value: '' }, { label: '启用', value: 'on' }, { label: '禁用', value: 'off' }
  ]},
]
function onSearch(payload) {
  keyword = payload.searchKey
  selectedTags = payload.selectedTags
}
</script>
```
:::

</DemoBlock>

### 仅分类筛选（不可输入关键字）

<DemoBlock>

<WachCategorySearch
  :category="category"
  placeholder="仅通过下方分类筛选"
  input-read-only
  @search="(p) => console.log('search', p)"
/>

::: details 查看代码
```vue
<WachCategorySearch
  :category="category"
  placeholder="仅通过下方分类筛选"
  input-read-only
  @search="..."
/>
```
:::

</DemoBlock>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| category | 分类源数据（field、label、options） | `CategoryItem[]` | `[]` |
| selectedTags | 当前选中的分类（可与 v-model:selectedTags 合用） | `SelectedTag[]` | `[]` |
| searchKey | 搜索关键字（可与 v-model:searchKey 合用） | `string` | `''` |
| placeholder | 输入框占位符 | `string` | `'点击此处添加筛选条件'`（与设计稿一致） |
| inputReadOnly | 是否只读输入框，仅用分类筛选 | `boolean` | `false` |

### Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| search | 点击左侧搜索图标或输入框回车时触发 | `{ searchKey: string; selectedTags: SelectedTag[] }` |
| clearAll | 点击右侧清空图标时触发 | — |
| selectedTagsChange | 分类选中变化时触发 | `SelectedTag[]` |
| searchKeyChange | 关键字变化时触发 | `string` |

### 类型

- **CategoryItem**：`{ field: string; label: string; options?: { label: string; value: string }[] }`
- **SelectedTag**：`{ field: string; label: string; value: string }`

## 设计规范（来自 JSON 解析）

- **容器**：高 32px、**圆角 6px**、背景 `#fff`（devui-base-bg）、边框四边 1px solid `#c9c9c9`（devui-form-control-line）。
- **搜索图标**：16×16，框内最左侧，颜色 `#191919`（devui-icon-fill），点击触发搜索；与内容区间距 8px（占位文案从 x=32 起）。
- **清空图标**：框内最右侧，有关键字或已选分类时显示。
- **占位/弱化文字**：`#aeaeae`（devui-placeholder），HarmonyOS Sans SC，14px / 400，行高 22px。
- 详见 `devui-dsl-parsed/分类搜索-元素与样式.md`；样式由 `--wach-category-search-*` 控制。

## 变更说明

| 版本 | 说明 |
|------|------|
| 0.0.6 | 下拉挂 body + 固定定位，宽度与整栏对齐，滚动/resize 跟随；点击面板不误关 |
| 0.0.5 | 交互对齐 DevUI：聚焦输入展开下拉分级选类；框内不再内嵌分类 `select`，仅 tag + 输入 |
| 0.0.4 | 搜索图标矢量与 Vue DevUI CategorySearch `SearchIcon` 一致，颜色仍用 DSL `devui-icon-fill`；清空图标同源码 `ClearIcon` |
| 0.0.3 | 搜索/清空移入输入框：头部搜索图标、尾部清空图标，去掉框外文字按钮 |
| 0.0.2 | 按 DevUI「分类搜索.json」重写：6px 圆角、左侧搜索图标、占位符与设计稿一致，Token 对齐 DSL |
| 0.0.1 | 初始版本：关键字 + 多分类下拉（单选）、搜索/清空，参考 DevUI Vue CategorySearch |
