<script setup lang="ts">
/**
 * 示例块容器：参考 DevUI Vue 文档，为每个示例标题下的内容提供统一的外框（padding、border、圆角）
 */
</script>

<template>
  <div class="demo-block">
    <slot />
  </div>
</template>

<style scoped>
/* 参考 DevUI Vue 文档示例区：边框、圆角、内边距、浅底 */
.demo-block {
  /* 略减内边距，把宽度让给复杂组件（如 PageHeader DSL） */
  padding: 20px 16px;
  margin: 16px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.25s, background-color 0.25s;
}
</style>
