<script setup lang="ts">
/**
 * WachAccordion：折叠面板容器（Pixso / DevUI「手风琴」DSL）
 * - 侧栏形态：项间距 4px、默认最大宽度 216px，无整框描边
 * - `accordion`：手风琴仅一项展开；`false` 时多项同时展开
 */
defineOptions({ name: "WachAccordion" });

const props = withDefaults(
  defineProps<{
    modelValue?: (string | number)[];
    accordion?: boolean;
  }>(),
  {
    modelValue: () => [],
    accordion: true,
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", v: (string | number)[]): void;
  (e: "change", v: (string | number)[]): void;
}>();

import { computed, provide, ref } from "vue";

const names = computed(() => props.modelValue ?? []);

function isOpen(name: string | number) {
  return names.value.includes(name);
}

function toggle(name: string | number) {
  const cur = [...names.value];
  const idx = cur.indexOf(name);
  let next: (string | number)[];
  if (props.accordion) {
    next = idx >= 0 ? [] : [name];
  } else {
    if (idx >= 0) {
      cur.splice(idx, 1);
      next = cur;
    } else {
      next = [...cur, name];
    }
  }
  emit("update:modelValue", next);
  emit("change", next);
}

const baseId = ref(`wach-acc-${Math.random().toString(36).slice(2, 10)}`);

function panelId(name: string | number) {
  return `${baseId.value}-panel-${String(name)}`;
}

function headerId(name: string | number) {
  return `${baseId.value}-hdr-${String(name)}`;
}

provide("wachAccordion", {
  isOpen,
  toggle,
  panelId,
  headerId,
});
</script>

<template>
  <div class="wach-accordion" role="presentation">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.wach-accordion {
  box-sizing: border-box;
  width: 100%;
  max-width: var(--wach-accordion-width, 216px);
  display: flex;
  flex-direction: column;
  gap: var(--wach-accordion-item-gap, 4px);
  background: var(--wach-accordion-bg, transparent);
}
</style>
