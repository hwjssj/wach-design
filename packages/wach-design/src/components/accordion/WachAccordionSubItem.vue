<script setup lang="ts">
/**
 * WachAccordionSubItem：二级行（DSL「.二级」）
 * - 高 36px、左缩进 24px、14px/500/#191919，与一级行垂直间距由父级 content gap 控制
 */
defineOptions({ name: "WachAccordionSubItem" });

defineProps<{
  /** 是否作为可点击项（如路由） */
  clickable?: boolean;
}>();

defineSlots<{
  default?: () => unknown;
}>();
</script>

<template>
  <component
    :is="clickable ? 'button' : 'div'"
    :type="clickable ? 'button' : undefined"
    class="wach-accordion-sub"
  >
    <slot />
  </component>
</template>

<style lang="scss" scoped>
.wach-accordion-sub {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: calc(100% + 16px);
  min-height: var(--wach-accordion-row-height, 36px);
  margin-left: -8px;
  margin-right: -8px;
  padding: 7px 8px 7px var(--wach-accordion-sub-indent, 24px);
  border: none;
  border-radius: var(--wach-accordion-radius, 4px);
  background: transparent;
  font-family: var(--wach-btn-font-family);
  font-size: var(--wach-accordion-header-font-size, 14px);
  font-weight: var(--wach-accordion-header-font-weight, 500);
  line-height: var(--wach-accordion-content-line-height, 22px);
  color: var(--wach-accordion-sub-color, #191919);
  text-align: left;
  cursor: default;
  transition: background 0.2s;
}

button.wach-accordion-sub {
  cursor: pointer;
  width: calc(100% + 16px);

  &:hover {
    background: var(--wach-accordion-header-bg-hover, #f5f7fa);
  }

  &:focus-visible {
    outline: 2px solid var(--wach-color-primary, #409eff);
    outline-offset: -2px;
  }
}
</style>
