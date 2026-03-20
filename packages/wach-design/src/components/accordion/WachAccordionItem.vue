<script setup lang="ts">
/**
 * WachAccordionItem：一级折叠项（对齐「手风琴.json」一级行）
 * - 行高 36px、左内边距 8px、标题 14px/500/#191919
 * - 可选计数徽标（pill #f3f3f3 + 12px/#777）；折叠 chevron-right，展开 chevron-down（旋转实现）
 * - 默认插槽内可放 WachAccordionSubItem 作为二级行（左缩进 24px）
 */
defineOptions({ name: "WachAccordionItem" });

const props = withDefaults(
  defineProps<{
    name: string | number;
    title?: string;
    disabled?: boolean;
    /**
     * 计数徽标：数字时 >99 显示为 99+；也可传字符串
     * 与 #badge 插槽二选一，插槽优先
     */
    badge?: string | number;
  }>(),
  { title: "", disabled: false }
);

defineSlots<{
  title?: () => unknown;
  badge?: () => unknown;
  default?: () => unknown;
}>();

import { computed, inject } from "vue";

type AccordionApi = {
  isOpen: (name: string | number) => boolean;
  toggle: (name: string | number) => void;
  panelId: (name: string | number) => string;
  headerId: (name: string | number) => string;
};

const api = inject<AccordionApi | undefined>("wachAccordion");
if (api === undefined) {
  throw new Error("WachAccordionItem 必须放在 WachAccordion 内使用");
}

const { isOpen, toggle, panelId, headerId } = api;

const expanded = computed(() => isOpen(props.name));

const headerIdStr = computed(() => headerId(props.name));
const panelIdStr = computed(() => panelId(props.name));

const badgeText = computed(() => {
  const v = props.badge;
  if (v === undefined || v === "") return "";
  if (typeof v === "number") return v > 99 ? "99+" : String(v);
  return String(v);
});

const showBadge = computed(
  () => Boolean(props.badge !== undefined && props.badge !== "")
);

function onHeaderClick() {
  if (props.disabled) return;
  toggle(props.name);
}
</script>

<template>
  <div
    class="wach-accordion-item"
    :class="{ 'is-disabled': disabled, 'is-expanded': expanded }"
  >
    <button
      :id="headerIdStr"
      type="button"
      class="wach-accordion-item__header"
      :disabled="disabled"
      :aria-expanded="expanded"
      :aria-controls="panelIdStr"
      @click="onHeaderClick"
    >
      <span class="wach-accordion-item__title">
        <slot name="title">{{ title }}</slot>
      </span>
      <span
        v-if="$slots.badge || showBadge"
        class="wach-accordion-item__badge"
      >
        <slot name="badge">{{ badgeText }}</slot>
      </span>
      <span class="wach-accordion-item__icon" aria-hidden="true">
        <!-- DSL：折叠=chevron-right，展开=chevron-down；用右箭头旋转 90° -->
        <svg
          class="wach-accordion-item__chevron"
          :class="{ 'is-expanded': expanded }"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="currentColor"
        >
          <path
            d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
          />
        </svg>
      </span>
    </button>
    <div
      class="wach-accordion-item__panel"
      :class="{ 'is-expanded': expanded }"
    >
      <div class="wach-accordion-item__inner">
        <div
          :id="panelIdStr"
          class="wach-accordion-item__content"
          role="region"
          :aria-labelledby="headerIdStr"
          :aria-hidden="!expanded"
        >
          <div class="wach-accordion-item__body">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wach-accordion-item {
  box-sizing: border-box;
  border-radius: var(--wach-accordion-radius, 4px);
  overflow: hidden;
  background: var(--wach-accordion-header-bg, #fff);

  &.is-disabled {
    opacity: var(--wach-accordion-disabled-opacity, 0.45);
    pointer-events: none;
  }
}

.wach-accordion-item__header {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-height: var(--wach-accordion-row-height, 36px);
  margin: 0;
  padding: var(--wach-accordion-header-padding, 7px 8px);
  border: none;
  background: var(--wach-accordion-header-bg, #fff);
  font-family: var(--wach-btn-font-family);
  font-size: var(--wach-accordion-header-font-size, 14px);
  font-weight: var(--wach-accordion-header-font-weight, 500);
  line-height: var(--wach-accordion-content-line-height, 22px);
  color: var(--wach-accordion-header-color, #191919);
  text-align: left;
  cursor: pointer;
  transition: background 0.2s;
  box-sizing: border-box;

  &:hover:not(:disabled) {
    background: var(--wach-accordion-header-bg-hover, #f5f7fa);
  }

  &:focus-visible {
    outline: 2px solid var(--wach-color-primary, #409eff);
    outline-offset: -2px;
  }
}

.wach-accordion-item__title {
  flex: 1;
  min-width: 0;
}

.wach-accordion-item__badge {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: var(--wach-accordion-badge-min-width, 29px);
  height: var(--wach-accordion-badge-height, 16px);
  padding: 0 6px;
  border: var(--wach-accordion-badge-border, 1px solid #ffffff);
  border-radius: 16px;
  background: var(--wach-accordion-badge-bg, #f3f3f3);
  font-size: var(--wach-accordion-badge-font-size, 12px);
  font-weight: 400;
  line-height: 1;
  color: var(--wach-accordion-badge-color, #777777);
}

.wach-accordion-item__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: var(--wach-accordion-icon-color, #191919);
}

.wach-accordion-item__chevron {
  display: block;
  transition: transform 0.2s ease;

  &.is-expanded {
    transform: rotate(90deg);
  }
}

.wach-accordion-item__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.2s ease;
}

.wach-accordion-item__panel.is-expanded {
  grid-template-rows: 1fr;
}

.wach-accordion-item__inner {
  overflow: hidden;
  min-height: 0;
}

.wach-accordion-item__content {
  margin: 0;
  padding: 0;
}

.wach-accordion-item__body {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--wach-accordion-content-gap, 4px);
  /* 与一级底边距：DSL 一级与二级首行间距 4px */
  padding: 4px 8px 8px;
  font-size: var(--wach-accordion-content-font-size, 14px);
  line-height: var(--wach-accordion-content-line-height, 22px);
  color: var(--wach-accordion-content-color, #606266);
}
</style>
