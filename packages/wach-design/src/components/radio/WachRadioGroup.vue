<script setup lang="ts">
/**
 * WachRadioGroup：单选框组，对齐 DevUI Vue RadioGroup，提供 v-model 与横向/纵向排列
 */
defineOptions({ name: "WachRadioGroup" });

const props = withDefaults(
  defineProps<{
    /** 当前选中的值（v-model） */
    modelValue?: string | number | boolean;
    /** 原生 name，会传给内部 Radio */
    name?: string;
    /** 横向 row / 纵向 column */
    direction?: "row" | "column";
    /** 整组禁用 */
    disabled?: boolean;
  }>(),
  { direction: "column", disabled: false }
);

const emit = defineEmits<{
  (e: "update:modelValue", v: string | number | boolean): void;
  (e: "change", v: string | number | boolean): void;
}>();

import { computed, provide, toRef } from "vue";

const modelValue = computed({
  get: () => props.modelValue,
  set: (v) => {
    emit("update:modelValue", v as string | number | boolean);
    emit("change", v as string | number | boolean);
  },
});

function setValue(v: string | number | boolean) {
  modelValue.value = v;
}

provide("wachRadioGroup", {
  modelValue,
  setValue,
  disabled: toRef(props, "disabled"),
});
</script>

<template>
  <div
    class="wach-radio-group"
    :class="[`wach-radio-group--${direction}`]"
    role="radiogroup"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.wach-radio-group {
  display: flex;
  gap: 12px;

  &--row {
    flex-direction: row;
    flex-wrap: wrap;
  }

  &--column {
    flex-direction: column;
  }
}
</style>
