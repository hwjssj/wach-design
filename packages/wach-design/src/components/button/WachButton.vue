<script setup lang="ts">
/**
 * WachButton：按 DevUI DSL 解析规范实现
 * - type secondary 对应「按钮-次要」：白底、灰边框、深灰字、4px 圆角、14px/400、行高 22
 * - type primary：主题色填充
 * - size md 对应设计稿 32px 高、左右 16px 内边距
 */
defineOptions({ name: "WachButton" });

const props = withDefaults(
  defineProps<{
    /** 类型：secondary=次要按钮(默认)，primary=主要按钮 */
    type?: "primary" | "secondary";
    /** 尺寸：md=32px 高(默认)，sm/lg 可扩展 */
    size?: "sm" | "md" | "lg";
    /** 禁用 */
    disabled?: boolean;
  }>(),
  { type: "secondary", size: "md", disabled: false }
);

const emit = defineEmits<{
  (e: "click", ev: MouseEvent): void;
}>();

function onClick(ev: MouseEvent) {
  if (props.disabled) return;
  emit("click", ev);
}
</script>

<template>
  <button
    type="button"
    class="wach-button"
    :class="[
      `wach-button--${type}`,
      `wach-button--${size}`,
      { 'is-disabled': disabled },
    ]"
    :disabled="disabled"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
/* 基础：对齐 JSON 解析的容器与文本样式 */
.wach-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  margin: 0;
  padding: 0 var(--wach-btn-padding-x-md);
  min-height: var(--wach-btn-height-md);
  font-family: var(--wach-btn-font-family);
  font-size: var(--wach-btn-font-size-md);
  font-weight: var(--wach-btn-font-weight);
  line-height: var(--wach-btn-line-height);
  border-radius: var(--wach-btn-secondary-radius);
  border: var(--wach-btn-secondary-border);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;

  /* 次要按钮（按钮-次要.json 规范） */
  &--secondary {
    background: var(--wach-btn-secondary-bg);
    border-color: var(--wach-btn-secondary-border-color);
    color: var(--wach-btn-secondary-text);

    &:not(.is-disabled):hover {
      border-color: var(--wach-color-primary);
      color: var(--wach-color-primary);
    }
  }

  /* 主要按钮 */
  &--primary {
    background: var(--wach-btn-primary-bg);
    border: var(--wach-btn-primary-border);
    color: var(--wach-btn-primary-text);

    &:not(.is-disabled):hover {
      background: var(--wach-btn-primary-hover-bg);
      border-color: var(--wach-btn-primary-hover-border);
      color: var(--wach-btn-primary-text);
    }
  }

  &--sm {
    min-height: 24px;
    font-size: 12px;
    padding: 0 12px;
  }

  &--lg {
    min-height: 40px;
    font-size: 16px;
    padding: 0 20px;
  }

  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
