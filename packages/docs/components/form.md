# Form 表单

<script setup lang="ts">
import { reactive, ref } from "vue";

const model = reactive({
  name: "",
  email: "",
});

const modelDsl = reactive({
  title: "",
});

const modelTop = reactive({
  note: "",
});

const rules = {
  name: [{ required: true, message: "请输入姓名" }],
  email: [
    { required: true, message: "请输入邮箱" },
    {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "邮箱格式不正确",
    },
  ],
};

const rulesDsl = {
  title: [{ required: true, message: "请输入标题" }],
};

const rulesTop = {
  note: [{ required: true, message: "请填写" }],
};

const formRef = ref<{ validate: () => Promise<boolean> } | null>(null);

async function onSubmit() {
  const ok = await formRef.value?.validate();
  if (ok) alert("校验通过");
}
</script>

对齐 **Vue DevUI** `d-form` / `d-form-item`，并按 DSL **「表单项-文本输入框」** 落地尺寸与颜色（标题 `#191919`、标签在上间距 **8px**、输入框 **32px** 高、边框 `#c9c9c9`、圆角 **4px**、占位 `#aeaeae`）。默认 **`label-position="top"`**。

## 示例

### DSL：表单项 + 文本输入框

与 `表单项-文本输入框.json` 一致：上标题、下输入框，可选提示图标与辅助文案。

<DemoBlock>

<WachForm :model="modelDsl" :rules="rulesDsl" style="max-width:296px">
  <WachFormItem
    label="标题"
    prop="title"
    show-help-tips
    help-tips-title="此处为说明文案"
    show-extra-info
  >
    <WachFormInput v-model="modelDsl.title" placeholder="请输入" />
    <template #extra>辅助说明可放在此处</template>
  </WachFormItem>
</WachForm>

::: details 查看代码
```vue
<WachForm :model="model" :rules="rules" style="max-width:296px">
  <WachFormItem
    label="标题"
    prop="title"
    show-help-tips
    help-tips-title="此处为说明文案"
    show-extra-info
  >
    <WachFormInput v-model="model.title" placeholder="请输入" />
    <template #extra>辅助说明可放在此处</template>
  </WachFormItem>
</WachForm>
```
:::

</DemoBlock>

### 横向布局（label-position="right"）

<DemoBlock>

<WachForm ref="formRef" :model="model" :rules="rules" label-position="right" label-width="88px">
  <WachFormItem label="姓名" prop="name">
    <WachFormInput v-model="model.name" placeholder="请输入" />
  </WachFormItem>
  <WachFormItem label="邮箱" prop="email">
    <WachFormInput v-model="model.email" type="email" placeholder="name@example.com" />
  </WachFormItem>
  <WachFormItem label="">
    <WachButton type="primary" @click="onSubmit">提交</WachButton>
  </WachFormItem>
</WachForm>

::: details 查看代码
```vue
<WachForm
  ref="formRef"
  :model="model"
  :rules="rules"
  label-position="right"
  label-width="88px"
>
  <WachFormItem label="姓名" prop="name">
    <WachFormInput v-model="model.name" />
  </WachFormItem>
  <WachFormItem label="邮箱" prop="email">
    <WachFormInput v-model="model.email" type="email" />
  </WachFormItem>
  <WachFormItem label="">
    <WachButton type="primary" @click="onSubmit">提交</WachButton>
  </WachFormItem>
</WachForm>
```
:::

</DemoBlock>

### 标签在上方（默认等价）

<DemoBlock>

<WachForm :model="modelTop" :rules="rulesTop" label-width="auto">
  <WachFormItem label="备注" prop="note">
    <WachFormInput v-model="modelTop.note" placeholder="请输入" />
  </WachFormItem>
</WachForm>

::: details 查看代码
```vue
<WachForm :model="modelTop" :rules="rulesTop" label-width="auto">
  <WachFormItem label="备注" prop="note">
    <WachFormInput v-model="modelTop.note" />
  </WachFormItem>
</WachForm>
```
:::

</DemoBlock>

## WachForm API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| model | 表单数据（与 FormItem `prop` 对应） | `Record<string, unknown>` | — |
| rules | 校验规则 | `FormRules` | `{}` |
| label-position | 标签位置 | `'left' \| 'right' \| 'top'` | `'top'` |
| label-width | 标签宽度（横向布局） | `string` | `'auto'` |
| label-suffix | 标签后缀（如中文冒号） | `string` | `''` |
| show-message | 是否展示错误文案 | `boolean` | `true` |

### 方法（ref）

| 方法 | 说明 |
|------|------|
| validate() | 校验全部已注册表单项，全部通过返回 `true` |
| validateField(prop) | 校验单个字段 |
| clearValidate(prop?) | 清除错误；不传 `prop` 则清除全部 |
| resetFields() | 将 `model` 恢复为挂载时的快照并清除校验 |

## WachFormItem API

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| label | 标签文案 | `string` | `''` |
| prop | 对应 `model` 字段路径（支持 `a.b`） | `string` | — |
| required | 是否显示必填星号 | `boolean` | `false` |
| rules | 当前项规则（会与 Form 上同名规则合并） | `FormRule[]` | — |
| label-width | 覆盖 Form 的 `label-width` | `string` | — |
| show-help-tips | 是否展示标签旁提示图标（可用 `#helpTips` 插槽自定义） | `boolean` | `false` |
| help-tips-title | 默认图标的 `title` 提示 | `string` | `''` |
| show-extra-info | 是否渲染 `#extra` 区域 | `boolean` | `true` |

### 插槽

| 插槽 | 说明 |
|------|------|
| default | 表单项控件 |
| label | 自定义标签 |
| helpTips | 自定义提示图标 |
| error | 自定义错误展示，`{ message }` |
| extra | 控件下方辅助说明 |

## WachFormInput

DSL 样式文本输入框（**32px** 高、边框 **#c9c9c9**、圆角 **4px**、占位 **#aeaeae**）。支持 `v-model`、`placeholder`（默认「请输入」）、`type`、`disabled`、`readonly` 等。

## FormRule

内置支持：`required`、`min` / `max`（字符串长度）、`pattern`、`message`、`validator`（异步可）。

```ts
import type { FormRule, FormRules } from "wach-design";
```

## 设计规范（来自 JSON 解析）

依据 DevUI DSL **「表单项-文本输入框」**（`表单项-文本输入框.json`）及解析文档 `devui-dsl-parsed/表单项-文本输入框-元素与样式.md`。

### 布局与尺寸

- **表单项整体参考**：外框约 **296×62**（设计稿）；标题区高度 **22px**，控件区自 **y=30** 起，**标题与控件间距 8px**。
- **默认布局**：`WachForm` 默认 **`label-position="top"`**、`label-width="auto"`，与「标题在上、输入在下」稿面一致；横向排布时使用 `label-position="left" | "right"` 并设置 `label-width`。

### 标题（标签）

- **文字颜色**：主要文字 `token/devui-text`，**#191919**。
- **字体**：HarmonyOS Sans SC，**14px** / **400**，**行高 22px**，左对齐。

### 文本输入框（WachFormInput）

- **高度**：**32px**；**圆角**：**4px**。
- **背景**：通用背景 **#ffffff**（暗色主题见 `--wach-form-control-bg`）。
- **边框**：`devui-form-control-line`，**1px solid #c9c9c9**；**hover / focus** 可通过 `--wach-form-control-border-hover`、`--wach-form-control-border-focus` 覆盖。
- **内边距**：水平 **12px**，垂直 **5px**（与 14px 字、22px 行高在 32px 高中对齐）。
- **占位符**：`token/devui-placeholder`，**#aeaeae**；默认文案「请输入」。

### 表单项能力（与组件实例参数对齐）

| DSL 参数 | 组件能力 |
|----------|-----------|
| `label` | `WachFormItem` 的 `label` / `#label` |
| `helpTips` | `show-help-tips`、`#helpTips`、`help-tips-title` |
| `showExtraInfo` | `show-extra-info`、`#extra` |
| `required` | `required` 与 `rules` 中的 `required` |
| `status`（如 noContent） | 由业务数据与占位符表现，无单独枚举 Prop |

### 校验与错误态

- **必填/规则**：红色星号与错误文案颜色 **#f56c6c**（`--wach-form-required-color`、`--wach-form-error-*`）。
- **错误时控件描边**：`--wach-form-error-border-color`，作用于原生 `input`/`textarea`/`select` 及 **`.wach-form-input`**。

### Token 定制

- 表单相关变量前缀 **`--wach-form-*`**、控件 **`--wach-form-control-*`**、占位 **`--wach-form-placeholder-color`**，详见 `packages/wach-design/src/styles/tokens.css` 与「主题与 Token」。

## 变更说明

| 版本 | 说明 |
|------|------|
| 0.0.2 | 按 DSL「表单项-文本输入框」对齐：补充 `--wach-form-control-*` 等 Token；新增 **WachFormInput**；**WachForm** 默认 `label-position=top`、`label-width=auto`；**WachFormItem** 增加 `show-help-tips`、`help-tips-title`、`show-extra-info` 及 `#helpTips`；文档补充 **设计规范**、**变更说明**。 |
| 0.0.1 | 初始版本：**WachForm** / **WachFormItem**，`model` + `rules`，`validate` / `resetFields` / `clearValidate`，基础 `FormRule`。 |
