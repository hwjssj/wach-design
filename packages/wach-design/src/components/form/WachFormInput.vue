<script setup lang="ts">
/**
 * WachFormInput：表单项-文本输入框（对齐「表单项-文本输入框.json」）
 * - 高度 32px、圆角 4px、边框 #c9c9c9、内边距 12px / 垂直居中 14/22 行高
 * - 占位符色 #aeaeae；可与 WachFormItem + label-position=top 组合
 */
defineOptions({ name: "WachFormInput" });

const props = withDefaults(
  defineProps<{
    /** 绑定值 */
    modelValue?: string;
    /** 占位符（DSL 默认「请输入」） */
    placeholder?: string;
    /** 原生 type */
    type?: string;
    /** 禁用 */
    disabled?: boolean;
    /** 只读 */
    readonly?: boolean;
    /** 原生 autocomplete */
    autocomplete?: string;
    /** 原生 name */
    name?: string;
    /** 原生 id */
    id?: string;
  }>(),
  {
    modelValue: "",
    placeholder: "请输入",
    type: "text",
    disabled: false,
    readonly: false,
    autocomplete: undefined,
    name: undefined,
    id: undefined,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", v: string): void;
  (e: "blur", ev: FocusEvent): void;
  (e: "focus", ev: FocusEvent): void;
  (e: "change", ev: Event): void;
}>();

function onInput(e: Event) {
  const v = (e.target as HTMLInputElement).value;
  emit("update:modelValue", v);
}
</script>

<template>
  <input
    :id="id"
    class="wach-form-input"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    :name="name"
    :autocomplete="autocomplete"
    @input="onInput"
    @blur="emit('blur', $event)"
    @focus="emit('focus', $event)"
    @change="emit('change', $event)"
  />
</template>

<style lang="scss" scoped>
.wach-form-input {
  box-sizing: border-box;
  display: block;
  width: 100%;
  height: var(--wach-form-control-height, 32px);
  margin: 0;
  padding: var(--wach-form-control-padding-y, 5px)
    var(--wach-form-control-padding-x, 12px);
  border: var(--wach-form-control-border, 1px solid #c9c9c9);
  border-radius: var(--wach-form-control-radius, 4px);
  background: var(--wach-form-control-bg, #ffffff);
  outline: none;
  font-family: var(--wach-form-font-family, "HarmonyOS Sans SC", system-ui, sans-serif);
  font-size: var(--wach-form-font-size, 14px);
  font-weight: 400;
  line-height: var(--wach-form-line-height, 22px);
  color: var(--wach-form-control-text-color, #191919);
  transition: border-color 0.2s;

  &::placeholder {
    color: var(--wach-form-placeholder-color, #aeaeae);
  }

  &:hover:not(:disabled):not(:read-only) {
    border-color: var(--wach-form-control-border-hover, #aeaeae);
  }

  &:focus-visible {
    border-color: var(--wach-form-control-border-focus, var(--wach-color-primary, #409eff));
  }

  &:disabled {
    cursor: not-allowed;
    opacity: var(--wach-form-control-disabled-opacity, 0.65);
    background: var(--wach-form-control-bg-disabled, #f5f5f5);
  }
}
</style>
