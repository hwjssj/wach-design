<script setup lang="ts">
/**
 * WachTabs：页签 Slider，对齐 DevUI 页签 Slider.json 解析规范
 * 从 default slot 的 WachTab 子节点同步解析 tab 列表；当前项为白色 pill，无底部横条
 */
defineOptions({ name: "WachTabs" });

const props = withDefaults(
  defineProps<{
    /** 当前激活的 tab id（v-model） */
    modelValue?: string | number;
    /** 是否显示下方内容区 */
    showContent?: boolean;
  }>(),
  { showContent: true }
);

const emit = defineEmits<{
  (e: "update:modelValue", id: string | number): void;
  (e: "change", id: string | number): void;
}>();

const slots = defineSlots<{ default?: () => unknown }>();

import { ref, computed, watch, nextTick, onMounted, h } from "vue";

interface TabItem {
  id: string | number;
  title?: string;
  disabled?: boolean;
  defaultSlot?: () => unknown;
}

function isTabVnode(v: any): boolean {
  if (!v || typeof v !== "object") return false;
  const hasId = v.props?.id !== undefined && v.props?.id !== null;
  const t = v.type;
  const isComponent = typeof t === "object" || typeof t === "function";
  const isWachTab =
    t?.name === "WachTab" || t?.__name === "WachTab" || t?.displayName === "WachTab";
  return hasId && isComponent && (isWachTab || (isComponent && hasId));
}

function getTabsFromSlot(): TabItem[] {
  const raw = slots.default?.() ?? [];
  let nodes: any[] = Array.isArray(raw) ? raw : [raw];
  if (nodes.length === 1 && nodes[0]?.children && Array.isArray(nodes[0].children)) {
    nodes = nodes[0].children;
  }
  return nodes
    .filter((v: any) => isTabVnode(v))
    .map((v: any) => ({
      id: v.props?.id,
      title: v.props?.title ?? "",
      disabled: v.props?.disabled ?? false,
      defaultSlot: v.children?.default ?? (() => null),
    }))
    .filter((t: TabItem) => t.id !== undefined && t.id !== null);
}

const tabs = computed<TabItem[]>(() => getTabsFromSlot());

const activeId = computed({
  get: () => {
    const v = props.modelValue;
    if (v !== undefined && v !== null) return v;
    const first = tabs.value[0];
    return first?.id ?? null;
  },
  set: (id) => {
    emit("update:modelValue", id as string | number);
    emit("change", id as string | number);
  },
});

const activeTab = computed(() => tabs.value.find((t) => t.id === activeId.value));

function select(id: string | number, disabled?: boolean) {
  if (disabled) return;
  activeId.value = id;
}

const ContentComponent = computed(() => {
  const tab = activeTab.value;
  const fn = tab?.defaultSlot;
  if (!fn) return () => null;
  return () => {
    const content = fn();
    if (content == null) return null;
    return h("div", { class: "wach-tabs__content-inner" }, Array.isArray(content) ? content : [content]);
  };
});
</script>

<template>
  <div class="wach-tabs">
    <div class="wach-tabs__nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="wach-tabs__tab"
        :class="{ 'is-active': activeId === tab.id, 'is-disabled': tab.disabled }"
        :data-wach-tab="tab.id"
        :disabled="tab.disabled"
        @click="select(tab.id, tab.disabled)"
      >
        {{ tab.title }}
      </button>
    </div>
    <div v-if="showContent && activeTab" class="wach-tabs__content">
      <component :is="ContentComponent" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 导航底槽：与 JSON 一致 — 高 32、背景 rgba(25,25,25,0.05)、圆角 4、内 gap 2 */
.wach-tabs__nav {
  display: flex;
  align-items: center;
  gap: var(--wach-tabs-nav-gap);
  padding: var(--wach-tabs-nav-gap);
  min-height: var(--wach-tabs-nav-height);
  background: var(--wach-tabs-nav-bg);
  border-radius: var(--wach-tabs-nav-radius);
}

/* 页签项 pill：高 28、圆角 4、active 白底，default 透明 */
.wach-tabs__tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: var(--wach-tabs-pill-min-width);
  min-height: var(--wach-tabs-pill-height);
  padding: 0 var(--wach-tabs-pill-padding-x);
  font-family: var(--wach-tabs-tab-font);
  font-size: var(--wach-tabs-tab-font-size);
  font-weight: var(--wach-tabs-tab-weight-default);
  line-height: var(--wach-tabs-tab-line-height);
  color: var(--wach-tabs-tab-color-default);
  background: var(--wach-tabs-pill-bg-default);
  border: none;
  border-radius: var(--wach-tabs-pill-radius);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  &.is-active {
    font-weight: var(--wach-tabs-tab-weight-active);
    color: var(--wach-tabs-tab-color-active);
    background: var(--wach-tabs-pill-bg-active);
  }

  &:hover:not(.is-disabled):not(.is-active) {
    color: var(--wach-tabs-tab-color-active);
  }

  &.is-disabled {
    color: var(--wach-tabs-tab-color-disabled);
    cursor: not-allowed;
  }
}

.wach-tabs__content {
  padding: var(--wach-tabs-content-padding);
}
</style>
