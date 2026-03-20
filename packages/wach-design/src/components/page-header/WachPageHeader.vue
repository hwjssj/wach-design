<script setup lang="ts">
/**
 * WachPageHeader：页头
 * - **带 tabs**：布局对齐 DevUI「全屏任务编辑页头部导航」DSL（48px 高、左标题+返回、中页签、右操作）
 * - **无 tabs**：保留 Ant Design PageHeader 式简单布局（标题/副标题/extra/footer）
 */
defineOptions({ name: "WachPageHeader" });

export interface PageHeaderTab {
  key: string;
  label: string;
}

const props = withDefaults(
  defineProps<{
    title?: string;
    subTitle?: string;
    ghost?: boolean;
    showBack?: boolean;
    /** 中部页签；有值时启用 DSL 三栏导航布局 */
    tabs?: PageHeaderTab[];
    /** 当前页签（与 v-model:activeTab 配合）；不传则为非受控，内部默认第一项 */
    activeTab?: string;
  }>(),
  {
    title: "",
    subTitle: "",
    ghost: false,
    showBack: false,
    tabs: () => [],
    activeTab: undefined,
  }
);

const emit = defineEmits<{
  (e: "back", ev: MouseEvent): void;
  (e: "update:activeTab", key: string): void;
  (e: "tabChange", key: string): void;
}>();

import { ref, computed, watch } from "vue";

const hasTabs = computed(() => props.tabs.length > 0);

const innerTab = ref("");

watch(
  () => props.tabs,
  (list) => {
    if (!list.length) return;
    if (props.activeTab === undefined && !innerTab.value) {
      innerTab.value = list[0].key;
    }
  },
  { immediate: true }
);

watch(
  () => props.activeTab,
  (v) => {
    if (v !== undefined && v !== "") innerTab.value = v;
  },
  { immediate: true }
);

const currentTabKey = computed(() => {
  if (props.activeTab !== undefined && props.activeTab !== "") {
    return props.activeTab;
  }
  return innerTab.value || props.tabs[0]?.key || "";
});

function onTabClick(key: string) {
  innerTab.value = key;
  emit("update:activeTab", key);
  emit("tabChange", key);
}

function onBackClick(ev: MouseEvent) {
  emit("back", ev);
}
</script>

<template>
  <!-- 全屏任务编辑页头部导航（DSL 带页签） -->
  <header
    v-if="hasTabs"
    class="wach-page-header wach-page-header--nav"
    :class="{ 'wach-page-header--ghost': ghost }"
  >
    <div v-if="$slots.breadcrumb" class="wach-page-header__breadcrumb">
      <slot name="breadcrumb" />
    </div>
    <div class="wach-page-header__bar">
      <div class="wach-page-header__left">
        <button
          v-if="showBack"
          type="button"
          class="wach-page-header__back wach-page-header__back--nav"
          aria-label="返回"
          @click="onBackClick"
        >
          <slot name="backIcon">
            <!-- 与配图一致：细线「←」（描边），非填充三角；对齐 DSL 16×16、#191919 -->
            <svg
              class="wach-page-header__back-svg wach-page-header__back-svg--nav"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </slot>
        </button>
        <span class="wach-page-header__title wach-page-header__title--nav">
          <slot name="title">{{ title }}</slot>
        </span>
      </div>
      <div class="wach-page-header__center">
        <div class="wach-page-header__tabs" role="tablist">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            class="wach-page-header__tab"
            :class="{
              'wach-page-header__tab--active': tab.key === currentTabKey,
            }"
            role="tab"
            :aria-selected="tab.key === currentTabKey"
            @click="onTabClick(tab.key)"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
      <div v-if="$slots.extra" class="wach-page-header__extra wach-page-header__extra--nav">
        <slot name="extra" />
      </div>
    </div>
    <div v-if="$slots.footer" class="wach-page-header__footer">
      <slot name="footer" />
    </div>
  </header>

  <!-- 简单页头（无页签） -->
  <header
    v-else
    class="wach-page-header"
    :class="{ 'wach-page-header--ghost': ghost }"
  >
    <div v-if="$slots.breadcrumb" class="wach-page-header__breadcrumb">
      <slot name="breadcrumb" />
    </div>
    <div class="wach-page-header__main">
      <button
        v-if="showBack"
        type="button"
        class="wach-page-header__back"
        aria-label="返回"
        @click="onBackClick"
      >
        <slot name="backIcon">
          <svg
            class="wach-page-header__back-svg"
            viewBox="64 64 896 896"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"
            />
          </svg>
        </slot>
      </button>
      <div v-if="$slots.avatar" class="wach-page-header__avatar">
        <slot name="avatar" />
      </div>
      <div class="wach-page-header__body">
        <div class="wach-page-header__row">
          <div class="wach-page-header__titles">
            <span class="wach-page-header__title">
              <slot name="title">{{ title }}</slot>
            </span>
            <span
              v-if="subTitle || $slots.subTitle"
              class="wach-page-header__subtitle"
            >
              <slot name="subTitle">{{ subTitle }}</slot>
            </span>
            <span v-if="$slots.tags" class="wach-page-header__tags">
              <slot name="tags" />
            </span>
          </div>
          <div v-if="$slots.extra" class="wach-page-header__extra">
            <slot name="extra" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="$slots.footer" class="wach-page-header__footer">
      <slot name="footer" />
    </div>
  </header>
</template>

<style lang="scss" scoped>
/* ========== 简单模式 ========== */
.wach-page-header:not(.wach-page-header--nav) {
  box-sizing: border-box;
  padding: var(--wach-page-header-padding, 16px 24px);
  background: var(--wach-page-header-bg, var(--wach-color-bg));
  border-bottom: 1px solid var(--wach-page-header-border-color, #f3f3f3);

  &.wach-page-header--ghost {
    background: transparent;
    border-bottom-color: transparent;
  }
}

.wach-page-header__breadcrumb {
  margin-bottom: var(--wach-page-header-breadcrumb-gap, 12px);
  font-size: var(--wach-font-size-sm, 12px);
  color: var(--wach-color-text-secondary);
}

.wach-page-header__main {
  display: flex;
  align-items: flex-start;
  gap: var(--wach-page-header-main-gap, 12px);
}

.wach-page-header__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  margin-top: 2px;
  padding: 4px;
  border: none;
  border-radius: var(--wach-radius-sm, 4px);
  background: transparent;
  color: var(--wach-page-header-title-color, #191919);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  transition: color 0.2s, background 0.2s;
}

.wach-page-header__back:hover {
  color: var(--wach-color-primary);
  background: var(--wach-color-bg-soft);
}

.wach-page-header__back-svg {
  display: block;
}

.wach-page-header__avatar {
  flex-shrink: 0;
}

.wach-page-header__body {
  flex: 1;
  min-width: 0;
}

.wach-page-header__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--wach-spacing-md, 12px);
}

.wach-page-header__titles {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--wach-spacing-sm, 8px);
  min-width: 0;
}

.wach-page-header:not(.wach-page-header--nav) .wach-page-header__title {
  font-size: var(--wach-page-header-title-size, 20px);
  font-weight: var(--wach-page-header-title-weight, 600);
  line-height: var(--wach-page-header-title-line-height, 32px);
  color: var(--wach-page-header-title-color, #191919);
}

.wach-page-header__subtitle {
  font-size: var(--wach-page-header-subtitle-size, 14px);
  line-height: var(--wach-page-header-subtitle-line-height, 22px);
  color: var(--wach-page-header-subtitle-color, var(--wach-color-text-secondary));
}

.wach-page-header__tags {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.wach-page-header__extra {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--wach-spacing-sm, 8px);
  margin-left: auto;
}

.wach-page-header__footer {
  margin-top: var(--wach-page-header-footer-margin-top, 12px);
  padding-top: var(--wach-page-header-footer-padding-top, 12px);
  border-top: 1px solid var(--wach-page-header-footer-border, #f0f0f0);
}

.wach-page-header--ghost .wach-page-header__footer {
  border-top-color: rgba(0, 0, 0, 0.06);
}

/* ========== DSL 全屏任务编辑页头部导航（带页签） ========== */
.wach-page-header--nav {
  box-sizing: border-box;
  background: var(--wach-page-header-bg, #fff);
  border-bottom: 1px solid var(--wach-page-header-border-color, #f3f3f3);
  font-family: var(
    --wach-page-header-nav-font-family,
    var(--wach-btn-font-family)
  );

  &.wach-page-header--ghost {
    background: transparent;
    border-bottom-color: transparent;
  }
}

.wach-page-header--nav .wach-page-header__breadcrumb {
  padding: 8px var(--wach-page-header-nav-padding-x, 20px) 0;
  margin-bottom: 0;
}

.wach-page-header__bar {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  justify-content: flex-start;
  gap: var(--wach-page-header-bar-gap, 16px);
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  min-height: var(--wach-page-header-nav-height, 48px);
  padding: 0 var(--wach-page-header-nav-padding-x, 20px);
}

.wach-page-header__left {
  display: flex;
  align-items: center;
  gap: var(--wach-page-header-back-gap, 8px);
  flex: 0 1 auto;
  min-width: 0;
  margin-top: var(--wach-page-header-nav-offset-left-y, 11px);
  /* DSL：标题区宽约 287px；长标题省略号 */
  max-width: min(
    var(--wach-page-header-nav-left-max, 287px),
    100%
  );
}

.wach-page-header__back--nav {
  flex-shrink: 0;
  margin-top: 0;
  padding: 0;
  width: 16px;
  height: 16px;
  color: var(--wach-page-header-title-color, #191919);
}

.wach-page-header__title--nav {
  font-family: var(--wach-btn-font-family);
  font-size: var(--wach-page-header-nav-title-size, 18px);
  font-weight: var(--wach-page-header-nav-title-weight, 700);
  line-height: var(--wach-page-header-nav-title-line-height, 26px);
  color: var(--wach-page-header-title-color, #191919);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wach-page-header__center {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  margin-top: var(--wach-page-header-nav-offset-tabs-y, 6px);
  padding: 0;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}

.wach-page-header__tabs {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  align-items: flex-end;
}

.wach-page-header__tab {
  box-sizing: border-box;
  /* DSL：单项 88×42，5 项总宽 440 */
  flex: 0 0 var(--wach-page-header-tab-min-width, 88px);
  width: var(--wach-page-header-tab-min-width, 88px);
  min-width: var(--wach-page-header-tab-min-width, 88px);
  max-width: var(--wach-page-header-tab-min-width, 88px);
  height: var(--wach-page-header-tab-height, 42px);
  margin: 0;
  padding: 0 8px;
  border: none;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: var(--wach-page-header-tab-radius, 4px)
    var(--wach-page-header-tab-radius, 4px) 0 0;
  background: transparent;
  font-family: var(--wach-btn-font-family);
  font-size: var(--wach-page-header-tab-font-size, 14px);
  font-weight: var(--wach-page-header-tab-weight-default, 400);
  line-height: var(--wach-page-header-tab-line-height, 22px);
  color: var(--wach-page-header-tab-text-default, #777);
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.wach-page-header__tab:hover {
  color: var(--wach-page-header-tab-text-active, #191919);
}

.wach-page-header__tab--active {
  background: var(--wach-page-header-tab-active-bg, #f3f3f3);
  border: 1px solid var(--wach-page-header-tab-active-border, #f3f3f3);
  /* 底边与页头底部分割线衔接：用页面底色盖住条底 1px 线 */
  border-bottom-color: var(--wach-page-header-bg, #fff);
  font-weight: var(--wach-page-header-tab-weight-active, 500);
  color: var(--wach-page-header-tab-text-active, #191919);
  position: relative;
  z-index: 1;
}

.wach-page-header__extra--nav {
  display: flex;
  flex-wrap: nowrap;
  flex: 0 0 auto;
  flex-shrink: 0;
  align-items: center;
  gap: var(--wach-page-header-action-gap, 8px);
  margin-top: var(--wach-page-header-nav-offset-actions-y, 8px);
  margin-left: auto;
}

/* 右侧主要按钮使用 DSL devui-primary #5e7ce0 */
.wach-page-header__extra--nav :deep(.wach-button--primary) {
  background: var(--wach-page-header-action-primary-bg, #5e7ce0);
  border-color: var(--wach-page-header-action-primary-bg, #5e7ce0);
  color: var(--wach-page-header-action-primary-text, #fff);
}

.wach-page-header__extra--nav :deep(.wach-button--primary:not(.is-disabled):hover) {
  background: var(--wach-page-header-action-primary-hover, #4e6dcf);
  border-color: var(--wach-page-header-action-primary-hover, #4e6dcf);
  color: var(--wach-page-header-action-primary-text, #fff);
}

.wach-page-header--nav.wach-page-header--ghost .wach-page-header__tab--active {
  border-bottom-color: transparent;
}
</style>
