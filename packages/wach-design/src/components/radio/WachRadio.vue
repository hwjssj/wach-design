<script setup lang="ts">
/**
 * WachRadio：基础单选框，对齐 DevUI 单选框文本组合.json 解析规范（16px 圆、#c9c9c9 边框、文案 14/400）
 */
defineOptions({ name: "WachRadio" });

const props = withDefaults(
  defineProps<{
    /** 当前选中值（在 Group 内由 Group 的 v-model 提供） */
    modelValue?: string | number | boolean;
    /** 本选项的值 */
    value: string | number | boolean;
    /** 原生 name */
    name?: string;
    /** 是否禁用 */
    disabled?: boolean;
  }>(),
  { disabled: false }
);

const emit = defineEmits<{
  (e: "update:modelValue", v: string | number | boolean): void;
  (e: "change", v: string | number | boolean): void;
}>();

import { computed, inject } from "vue";

const group = inject<{
  modelValue: { value: string | number | boolean };
  setValue: (v: string | number | boolean) => void;
  disabled: { value: boolean };
} | null>("wachRadioGroup", null);

const isChecked = computed(() => {
  const val = group ? (group.modelValue as any).value : props.modelValue;
  return val === props.value;
});

const isDisabled = computed(
  () => props.disabled || (group?.disabled ? (group.disabled as any).value : false)
);

function onChange() {
  if (isDisabled.value) return;
  const v = props.value;
  if (group) {
    group.setValue(v);
  } else {
    emit("update:modelValue", v);
    emit("change", v);
  }
}
</script>

<template>
  <label
    class="wach-radio"
    :class="{ 'is-checked': isChecked, 'is-disabled': isDisabled }"
  >
    <input
      type="radio"
      class="wach-radio__input"
      :name="group ? undefined : name"
      :value="value"
      :checked="isChecked"
      :disabled="isDisabled"
      @change="onChange"
    />
    <span class="wach-radio__inner" />
    <span v-if="$slots.default" class="wach-radio__label">
      <slot />
    </span>
  </label>
</template>

<style lang="scss" scoped>
.wach-radio {
  display: inline-flex;
  align-items: center;
  gap: var(--wach-radio-label-gap);
  cursor: pointer;
  font-family: var(--wach-radio-label-font);
  font-size: var(--wach-radio-label-font-size);
  font-weight: var(--wach-radio-label-font-weight);
  line-height: var(--wach-radio-label-line-height);
  color: var(--wach-radio-label-color);

  &.is-disabled {
    cursor: not-allowed;
    color: var(--wach-radio-disabled-color);
  }
}

.wach-radio__input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  margin: 0;
  pointer-events: none;
}

.wach-radio__inner {
  position: relative;
  flex-shrink: 0;
  width: var(--wach-radio-size);
  height: var(--wach-radio-size);
  border: 1px solid var(--wach-radio-border-color);
  border-radius: 50%;
  background: var(--wach-radio-bg);
  transition: border-color 0.2s, background 0.2s;

  &::after {
    content: "";
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    background: var(--wach-radio-checked-bg);
    transform: scale(0);
    transition: transform 0.2s;
  }
}

.wach-radio.is-checked .wach-radio__inner {
  border-color: var(--wach-radio-checked-border-color);
  background: var(--wach-radio-bg);

  &::after {
    transform: scale(1);
  }
}

.wach-radio:not(.is-disabled):hover .wach-radio__inner {
  border-color: var(--wach-color-primary);
}

.wach-radio__label {
  line-height: var(--wach-radio-label-line-height);
}
</style>
