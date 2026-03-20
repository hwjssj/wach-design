<script setup lang="ts">
/**
 * WachTab：单个页签面板，与 WachTabs 配合，通过 provide/inject 注册
 */
defineOptions({ name: "WachTab" });

const props = defineProps<{
  /** 唯一 id，与 v-model 对应 */
  id: string | number;
  /** 页签标题 */
  title?: string;
  /** 是否禁用 */
  disabled?: boolean;
}>();

const slots = defineSlots<{
  default?: () => unknown;
}>();

import { inject, onMounted, onUnmounted } from "vue";

const tabsApi = inject<{
  register: (tab: {
    id: string | number;
    title?: string;
    disabled?: boolean;
    defaultSlot: (() => unknown) | undefined;
  }) => void;
  unregister: (id: string | number) => void;
}>("wachTabs");

onMounted(() => {
  tabsApi?.register({
    id: props.id,
    title: props.title,
    disabled: props.disabled,
    defaultSlot: slots.default,
  });
});

onUnmounted(() => {
  tabsApi?.unregister(props.id);
});
</script>

<template>
  <!-- Tab 不渲染自身，由 WachTabs 统一渲染标题与内容 -->
</template>
