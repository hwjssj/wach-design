<script setup lang="ts">
/**
 * WachForm：表单容器（对齐 DevUI Vue d-form）
 * - model + rules；labelPosition / labelWidth；整表 validate、resetFields、clearValidate
 */
import { ref, reactive, provide, onMounted, watch } from "vue";
import type { FormRules } from "./formTypes";
import { cloneModel } from "./formTypes";
import { wachFormKey, type FieldEntry } from "./formInjection";

defineOptions({ name: "WachForm" });

const props = withDefaults(
  defineProps<{
    /** 表单数据对象（与 FormItem 的 prop 对应字段路径） */
    model: Record<string, unknown>;
    /** 校验规则，key 为字段路径，如 `name` 或 `user.name` */
    rules?: FormRules;
    /** 标签相对控件位置 */
    labelPosition?: "left" | "right" | "top";
    /** 标签宽度（横向布局时生效） */
    labelWidth?: string;
    /** 标签后缀，如 `：` */
    labelSuffix?: string;
    /** 是否展示校验错误文案 */
    showMessage?: boolean;
  }>(),
  {
    rules: () => ({}),
    /** DSL「表单项-文本输入框」：标题在上、控件在下 */
    labelPosition: "top",
    labelWidth: "auto",
    labelSuffix: "",
    showMessage: true,
  }
);

const fields = new Map<string, FieldEntry>();

const initialSnapshot = ref<Record<string, unknown> | null>(null);

onMounted(() => {
  initialSnapshot.value = cloneModel(props.model);
});

watch(
  () => props.model,
  () => {
    if (initialSnapshot.value === null) {
      initialSnapshot.value = cloneModel(props.model);
    }
  },
  { deep: true }
);

function registerField(prop: string, entry: FieldEntry) {
  fields.set(prop, entry);
  return () => {
    fields.delete(prop);
  };
}

async function validateField(prop: string): Promise<string | null> {
  const entry = fields.get(prop);
  if (!entry) return null;
  return entry.validate();
}

async function validate(): Promise<boolean> {
  const keys = [...fields.keys()];
  const results = await Promise.all(keys.map((k) => validateField(k)));
  return results.every((r) => r === null);
}

function clearValidate(prop?: string) {
  if (prop !== undefined) {
    fields.get(prop)?.clearValidate();
    return;
  }
  for (const f of fields.values()) {
    f.clearValidate();
  }
}

function resetFields() {
  if (initialSnapshot.value) {
    const snap = cloneModel(initialSnapshot.value);
    Object.keys(props.model).forEach((k) => {
      delete props.model[k];
    });
    Object.assign(props.model, snap);
  }
  clearValidate();
}

export type WachFormExpose = {
  validate: () => Promise<boolean>;
  validateField: (prop: string) => Promise<string | null>;
  clearValidate: (prop?: string) => void;
  resetFields: () => void;
};

defineExpose<WachFormExpose>({
  validate,
  validateField,
  clearValidate,
  resetFields,
});

const formCtx = reactive({
  get model() {
    return props.model;
  },
  get rules() {
    return props.rules ?? {};
  },
  get labelPosition() {
    return props.labelPosition;
  },
  get labelWidth() {
    return props.labelWidth;
  },
  get labelSuffix() {
    return props.labelSuffix;
  },
  get showMessage() {
    return props.showMessage;
  },
  registerField,
  validateField,
});

provide(wachFormKey, formCtx);
</script>

<template>
  <form
    class="wach-form"
    :class="[
      `wach-form--label-${labelPosition}`,
      { 'wach-form--no-message': !showMessage },
    ]"
    @submit.prevent
  >
    <slot />
  </form>
</template>

<style lang="scss" scoped>
.wach-form {
  box-sizing: border-box;
  width: 100%;
  font-family: var(
    --wach-form-font-family,
    "HarmonyOS Sans SC",
    system-ui,
    sans-serif
  );
  font-size: var(--wach-form-font-size, 14px);
  color: var(--wach-form-text-color, var(--wach-color-text, #303133));
}

.wach-form--no-message :deep(.wach-form-item__error) {
  display: none;
}
</style>
