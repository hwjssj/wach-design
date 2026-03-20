# Table 表格

<script setup lang="ts">
import { ref } from "vue";

const tableData = ref<Record<string, unknown>[]>([
  { id: 1, name: "张三", age: 28, dept: "研发" },
  { id: 2, name: "李四", age: 32, dept: "产品" },
  { id: 3, name: "王五", age: 24, dept: "设计" },
]);

const emptyData = ref<Record<string, unknown>[]>([]);
const loading = ref(false);

function toggleLoading() {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1200);
}
</script>

对齐 **Vue DevUI** `d-table` / `d-table-column` 的用法（**`data` + `WachTableColumn`**），视觉按 Pixso DSL **「表格-（自由编排）单行表格」** 解析：**8px 圆角**、**浅阴影**、行高 **42px**、分隔线 **#f3f3f3**、表头 **12px / 700**、正文 **14px / 400**；默认仅**横向分隔线**（自由编排），**`border`** 为 `true` 时为全表格线。支持 **斑马纹**、**尺寸**、**空数据**、**loading**、**`#body-{prop}`**。

## 示例

### 基础用法（DSL：圆角卡片 + 横线 + 斑马纹）

默认**无竖向网格**（自由编排）；容器带圆角与阴影。加 **`border`** 可切换为全框线。

<DemoBlock>

<WachTable :data="tableData" stripe row-key="id">
  <WachTableColumn prop="name" label="姓名" min-width="100px" />
  <WachTableColumn prop="age" label="年龄" width="88px" align="right" />
  <WachTableColumn prop="dept" label="部门" min-width="120px" />
</WachTable>

::: details 查看代码
```vue
<WachTable :data="tableData" stripe row-key="id">
  <WachTableColumn prop="name" label="姓名" min-width="100px" />
  <WachTableColumn prop="age" label="年龄" width="88px" align="right" />
  <WachTableColumn prop="dept" label="部门" min-width="120px" />
</WachTable>
```
:::

</DemoBlock>

### 全框线（`border`）

<DemoBlock>

<WachTable :data="tableData" border stripe row-key="id">
  <WachTableColumn prop="name" label="姓名" min-width="100px" />
  <WachTableColumn prop="age" label="年龄" width="88px" align="right" />
  <WachTableColumn prop="dept" label="部门" min-width="120px" />
</WachTable>

::: details 查看代码
```vue
<WachTable :data="tableData" border stripe row-key="id">...</WachTable>
```
:::

</DemoBlock>

### 自定义列（`#body-{prop}`）

<DemoBlock>

<WachTable :data="tableData" row-key="id">
  <WachTableColumn prop="name" label="姓名" />
  <WachTableColumn prop="age" label="年龄" />
  <template #body-age="{ row }">
    <strong>{{ row.age }} 岁</strong>
  </template>
</WachTable>

::: details 查看代码
```vue
<WachTable :data="tableData" row-key="id">
  <WachTableColumn prop="name" label="姓名" />
  <WachTableColumn prop="age" label="年龄" />
  <template #body-age="{ row }">
    <strong>{{ row.age }} 岁</strong>
  </template>
</WachTable>
```
:::

</DemoBlock>

### 空数据与加载

<DemoBlock>

<WachButton style="margin-bottom: 12px" @click="toggleLoading">演示 loading 1.2s</WachButton>
<WachTable :data="emptyData" border :loading="loading" empty-text="当前列表为空">
  <WachTableColumn prop="name" label="姓名" />
  <WachTableColumn prop="age" label="年龄" />
</WachTable>

::: details 查看代码
```vue
<WachTable :data="[]" border :loading="loading" empty-text="当前列表为空">
  <WachTableColumn prop="name" label="姓名" />
  <WachTableColumn prop="age" label="年龄" />
</WachTable>
```
:::

</DemoBlock>

## WachTable API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| data | 行数据 | `Record<string, unknown>[]` | `[]` |
| border | `true` 为全表格线；`false` 为 DSL 自由编排（仅横向 **#f3f3f3** 分隔） | `boolean` | `false` |
| stripe | 斑马纹 | `boolean` | `false` |
| size | 尺寸 | `'sm' \| 'md'` | `'md'` |
| loading | 加载中遮罩 | `boolean` | `false` |
| empty-text | 空数据文案 | `string` | `'暂无数据'` |
| row-key | 行 key 字段名或函数 | `string \| (row, index) => string \| number` | — |

### 插槽

| 插槽 | 说明 |
|------|------|
| empty | 空数据时替换默认文案 |
| body-{prop} | 自定义该列单元格，作用域：`{ row, column, $index }` |

## WachTableColumn API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| prop | 字段路径，支持 `a.b` | `string` | 必填 |
| label | 表头 | `string` | 必填 |
| width | 列宽 | `string` | — |
| min-width | 最小列宽 | `string` | — |
| align | 对齐 | `'left' \| 'center' \| 'right'` | `'left'`（表头同列） |

## 设计规范

依据 **`devui-dsl-parsed/表格-自由编排单行-元素与样式.md`**（由 `表格-（自由编排）单行表格.json` 解析）。

- **容器**：白底 **#fff**，圆角 **8px**，阴影 **0 1px 6px rgba(0,0,0,0.08)**。
- **行高**：表头 / 数据行最小高度 **42px**；行间底边 **1px solid #f3f3f3**。
- **表头**：背景 **#fff**，字 **12px / 700 / 行高 20**，颜色 **#191919**，HarmonyOS Sans SC；纵向内边距约 **11px**、左右 **16px**（可用 Token 覆盖）。
- **单元格**：**14px / 400 / 行高 22**，颜色 **#191919**；内边距约 **10px 16px**。
- **布局**：默认**无竖线**（自由编排）；`border=true` 时为全框线，颜色 **#f3f3f3**。
- **斑马纹**：`stripe` 时偶数行底 **#f3f3f3**（与 DSL 第二行 `bc` 一致）。
- **紧凑**：`size="sm"` 时字号与内边距见 `--wach-table-*-sm`。
- **Token**：`--wach-table-*`，见 `tokens.css`。

## 变更说明

| 版本 | 说明 |
|------|------|
| 0.0.3 | 按 Pixso「表格-（自由编排）单行表格」JSON 重写视觉：圆角/阴影/行高/分隔色/表头与正文字阶；默认横向分隔；斑马纹 **#f3f3f3**；补充 DSL 解析文档。 |
| 0.0.2 | 修复：默认 `<slot />` 出口，列可注册。 |
| 0.0.1 | 初始：`WachTable` + `WachTableColumn`，`border` / `stripe` / `loading` / `row-key`，`#body-{prop}` |
