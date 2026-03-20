<script setup lang="ts">
/**
 * WachCategorySearch：分类搜索，交互对齐 Vue DevUI CategorySearch（简化）
 * - 聚焦/点击输入框展开下拉：先选分类，再在二级列表选具体项；框内不再放分类下拉
 * - 已选条件以 tag 展示在输入前（与 DevUI 行内 tag 一致）
 * - 样式对齐分类搜索.json：圆角、边框、图标、占位符等
 */
defineOptions({ name: "WachCategorySearch" });

/** 分类项配置（对应 DevUI ICategorySearchTagItem 简化） */
export interface CategoryItem {
  /** 分类字段，唯一 */
  field: string;
  /** 分类显示名 */
  label: string;
  /** 选项（radio 型：单选） */
  options?: { label: string; value: string }[];
}

/** 已选中的分类标签（简化） */
export interface SelectedTag {
  field: string;
  label: string;
  value: string;
}

const props = withDefaults(
  defineProps<{
    /** 分类源数据 */
    category?: CategoryItem[];
    /** 当前选中的分类（受控，可与 v-model:selectedTags 合用） */
    selectedTags?: SelectedTag[];
    /** 搜索关键字（可与 v-model:searchKey 合用） */
    searchKey?: string;
    /** 输入框占位符 */
    placeholder?: string;
    /** 是否只读输入框，仅用分类筛选 */
    inputReadOnly?: boolean;
  }>(),
  {
    category: () => [],
    selectedTags: () => [],
    searchKey: "",
    placeholder: "点击此处添加筛选条件",
    inputReadOnly: false,
  }
);

const emit = defineEmits<{
  (e: "update:searchKey", v: string): void;
  (e: "update:selectedTags", v: SelectedTag[]): void;
  (e: "search", payload: { searchKey: string; selectedTags: SelectedTag[] }): void;
  (e: "clearAll"): void;
  (e: "selectedTagsChange", tags: SelectedTag[]): void;
  (e: "searchKeyChange", v: string): void;
}>();

import {
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import type { CSSProperties } from "vue";

const innerKeyword = ref(props.searchKey);
const innerTags = ref<SelectedTag[]>([]);
const rootRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
/** Teleport 到 body 的下拉层，用于点击外部判断与定位 */
const dropdownPanelRef = ref<HTMLElement | null>(null);
const dropdownStyle = ref<CSSProperties>({});
/** 下拉是否展开 */
const menuOpen = ref(false);
/** 当前在选哪一类下的具体项（null 表示一级：选分类） */
const activeCategoryField = ref<string | null>(null);

watch(
  () => props.searchKey,
  (v) => {
    innerKeyword.value = v;
  },
  { immediate: true }
);

watch(
  () => props.selectedTags,
  (v) => {
    innerTags.value = v?.length ? [...v] : [];
  },
  { immediate: true, deep: true }
);

const selectedByField = computed(() => {
  const map: Record<string, string> = {};
  for (const t of innerTags.value) {
    map[t.field] = t.value;
  }
  return map;
});

/** 仍可添加的分类（未选中的） */
const categoriesToAdd = computed(() =>
  props.category.filter((c) => !selectedByField.value[c.field])
);

const activeCategory = computed(() =>
  props.category.find((c) => c.field === activeCategoryField.value)
);

const canClear = computed(
  () => innerKeyword.value.trim() !== "" || innerTags.value.length > 0
);

function openMenu() {
  menuOpen.value = true;
  activeCategoryField.value = null;
}

function closeMenu() {
  menuOpen.value = false;
  activeCategoryField.value = null;
}

function onInputFocus() {
  openMenu();
}

function onInputClick() {
  openMenu();
}

function onKeywordInput(e: Event) {
  const v = (e.target as HTMLInputElement).value;
  innerKeyword.value = v;
  emit("update:searchKey", v);
  emit("searchKeyChange", v);
}

function pickCategory(cat: CategoryItem) {
  activeCategoryField.value = cat.field;
}

function goBackToCategoryList() {
  activeCategoryField.value = null;
}

function selectOption(cat: CategoryItem, opt: { label: string; value: string }) {
  const next = innerTags.value.filter((t) => t.field !== cat.field);
  if (opt.value !== "") {
    next.push({
      field: cat.field,
      label: cat.label,
      value: opt.value,
    });
  }
  innerTags.value = next;
  emit("update:selectedTags", next);
  emit("selectedTagsChange", next);
  closeMenu();
  nextTick(() => inputRef.value?.focus());
}

function onSearch() {
  closeMenu();
  emit("search", {
    searchKey: innerKeyword.value,
    selectedTags: [...innerTags.value],
  });
}

function onClear() {
  innerKeyword.value = "";
  innerTags.value = [];
  emit("update:searchKey", "");
  emit("update:selectedTags", []);
  emit("searchKeyChange", "");
  emit("selectedTagsChange", []);
  emit("clearAll");
  closeMenu();
}

function removeTag(field: string) {
  const next = innerTags.value.filter((t) => t.field !== field);
  innerTags.value = next;
  emit("update:selectedTags", next);
  emit("selectedTagsChange", next);
}

function getTagDisplayText(tag: SelectedTag): string {
  const opt = props.category
    .find((c) => c.field === tag.field)
    ?.options?.find((o) => o.value === tag.value);
  return opt ? `${tag.label}: ${opt.label}` : `${tag.label}: ${tag.value}`;
}

const DROPDOWN_GAP = 4;

function updateDropdownPosition() {
  if (!menuOpen.value || !rootRef.value) return;
  const r = rootRef.value.getBoundingClientRect();
  dropdownStyle.value = {
    position: "fixed",
    left: `${r.left}px`,
    top: `${r.bottom + DROPDOWN_GAP}px`,
    width: `${Math.max(r.width, 160)}px`,
    maxHeight: "280px",
    overflowY: "auto",
    boxSizing: "border-box",
    zIndex: 2000,
  };
}

function onReposition() {
  updateDropdownPosition();
}

function onDocPointerDown(e: MouseEvent) {
  if (!menuOpen.value) return;
  const t = e.target as Node;
  if (rootRef.value?.contains(t)) return;
  if (dropdownPanelRef.value?.contains(t)) return;
  closeMenu();
}

function onInputKeydown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    e.preventDefault();
    if (activeCategoryField.value) {
      activeCategoryField.value = null;
    } else {
      closeMenu();
    }
  }
  if (e.key === "Enter") {
    onSearch();
  }
}

watch(menuOpen, (open) => {
  if (open) {
    nextTick(() => {
      updateDropdownPosition();
      window.addEventListener("scroll", onReposition, true);
      window.addEventListener("resize", onReposition);
    });
  } else {
    window.removeEventListener("scroll", onReposition, true);
    window.removeEventListener("resize", onReposition);
  }
});

watch(activeCategory, () => {
  if (menuOpen.value) nextTick(updateDropdownPosition);
});

onMounted(() => {
  document.addEventListener("pointerdown", onDocPointerDown, true);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onReposition, true);
  window.removeEventListener("resize", onReposition);
});

onUnmounted(() => {
  document.removeEventListener("pointerdown", onDocPointerDown, true);
});
</script>

<template>
  <div ref="rootRef" class="wach-category-search">
    <button
      type="button"
      class="wach-category-search__search-icon"
      aria-label="搜索"
      @click="onSearch"
    >
      <svg
        class="wach-category-search__icon-svg"
        viewBox="0 0 16 16"
        width="16"
        height="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="none" fill-rule="evenodd">
          <path
            fill="currentColor"
            d="M7,0 C10.8659932,0 14,3.13400675 14,7 C14,8.57190212 13.4818819,10.0227913 12.6071076,11.1912056 L15.7071068,14.2928932 C16.0976311,14.6834175 16.0976311,15.3165825 15.7071068,15.7071068 C15.3466228,16.0675907 14.7793918,16.0953203 14.3871006,15.7902954 L14.2928932,15.7071068 L11.1912056,12.6071076 C10.0227913,13.4818819 8.57190212,14 7,14 C3.13400675,14 5.5067062e-14,10.8659932 5.5067062e-14,7 C5.5067062e-14,3.13400675 3.13400675,0 7,0 Z M7,2 C4.23857625,2 2,4.23857625 2,7 C2,9.76142375 4.23857625,12 7,12 C9.76142375,12 12,9.76142375 12,7 C12,4.23857625 9.76142375,2 7,2 Z"
          />
        </g>
      </svg>
    </button>
    <div class="wach-category-search__main">
      <span
        v-for="tag in innerTags"
        :key="tag.field"
        class="wach-category-search__tag"
      >
        {{ getTagDisplayText(tag) }}
        <button
          type="button"
          class="wach-category-search__tag-close"
          :aria-label="`移除${tag.label}`"
          @click.prevent="removeTag(tag.field)"
        >
          ×
        </button>
      </span>
      <div class="wach-category-search__input-wrap">
        <input
          ref="inputRef"
          v-model="innerKeyword"
          type="text"
          class="wach-category-search__input"
          :placeholder="placeholder"
          :readonly="inputReadOnly"
          autocomplete="off"
          @input="onKeywordInput"
          @focus="onInputFocus"
          @click="onInputClick"
          @keydown="onInputKeydown"
        />
      </div>
      <Teleport to="body">
        <Transition name="wach-cs-drop">
          <div
            v-show="menuOpen"
            ref="dropdownPanelRef"
            class="wach-category-search__dropdown"
            role="listbox"
            :style="dropdownStyle"
            @mousedown.prevent
          >
            <template v-if="!activeCategory">
              <ul class="wach-category-search__menu">
                <li
                  v-for="cat in categoriesToAdd"
                  :key="cat.field"
                  class="wach-category-search__menu-item"
                  role="option"
                  @click="pickCategory(cat)"
                >
                  {{ cat.label }}
                </li>
                <li
                  v-if="categoriesToAdd.length === 0"
                  class="wach-category-search__menu-empty"
                >
                  没有可选筛选条件
                </li>
              </ul>
            </template>
            <template v-else-if="activeCategory">
              <button
                type="button"
                class="wach-category-search__menu-back"
                @click="goBackToCategoryList"
              >
                ← {{ activeCategory.label }}
              </button>
              <ul class="wach-category-search__menu">
                <li
                  v-for="opt in activeCategory.options"
                  :key="String(opt.value)"
                  class="wach-category-search__menu-item"
                  role="option"
                  @click="selectOption(activeCategory, opt)"
                >
                  {{ opt.label }}
                </li>
              </ul>
            </template>
          </div>
        </Transition>
      </Teleport>
    </div>
    <button
      v-show="canClear"
      type="button"
      class="wach-category-search__clear-icon"
      aria-label="清空"
      @click="onClear"
    >
      <svg
        class="wach-category-search__icon-svg"
        viewBox="0 0 16 16"
        width="16"
        height="16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>清空</title>
        <g fill="none" fill-rule="evenodd">
          <path
            fill="currentColor"
            fill-rule="nonzero"
            d="M4.61289944,3.20970461 L4.70710678,3.29289322 L8,6.585 L11.2928932,3.29289322 C11.6834175,2.90236893 12.3165825,2.90236893 12.7071068,3.29289322 C13.0675907,3.65337718 13.0953203,4.22060824 12.7902954,4.61289944 L12.7071068,4.70710678 L9.415,8 L12.7071068,11.2928932 C13.0976311,11.6834175 13.0976311,12.3165825 12.7071068,12.7071068 C12.3466228,13.0675907 11.7793918,13.0953203 11.3871006,12.7902954 L11.2928932,12.7071068 L8,9.415 L4.70710678,12.7071068 C4.31658249,13.0976311 3.68341751,13.0976311 3.29289322,12.7071068 C2.93240926,12.3466228 2.90467972,11.7793918 3.20970461,11.3871006 L3.29289322,11.2928932 L6.585,8 L3.29289322,4.70710678 C2.90236893,4.31658249 2.90236893,3.68341751 3.29289322,3.29289322 C3.65337718,2.93240926 4.22060824,2.90467972 4.61289944,3.20970461 Z"
          />
        </g>
      </svg>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.wach-category-search {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: var(--wach-category-search-icon-gap, 8px);
  box-sizing: border-box;
  width: 100%;
  min-width: 200px;
  min-height: var(--wach-category-search-height, 32px);
  padding: 0 var(--wach-category-search-box-padding-x, 8px);
  font-family: var(
    --wach-category-search-font-family,
    var(--wach-btn-font-family)
  );
  font-size: var(--wach-category-search-font-size, 14px);
  font-weight: var(--wach-category-search-font-weight, 400);
  line-height: var(--wach-category-search-line-height, 22px);
  color: var(--wach-btn-secondary-text, #191919);
  background: var(--wach-color-bg);
  border: 1px solid var(--wach-category-search-border-color, #c9c9c9);
  border-radius: var(--wach-category-search-radius, 6px);
}

.wach-category-search:focus-within {
  border-color: var(--wach-color-primary);
}

.wach-category-search__search-icon,
.wach-category-search__clear-icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  width: var(--wach-category-search-icon-size, 16px);
  height: var(--wach-category-search-icon-size, 16px);
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--wach-category-search-icon-color, #191919);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.wach-category-search__search-icon:hover,
.wach-category-search__clear-icon:hover {
  background: var(--wach-color-bg-soft);
  color: var(--wach-color-primary);
}

.wach-category-search__icon-svg {
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.wach-category-search__main {
  display: flex;
  align-items: center;
  flex: 1;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
}

.wach-category-search__tag {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 22px;
  padding: 0 6px;
  background: var(--wach-category-search-tag-bg, rgba(64, 158, 255, 0.1));
  border-radius: 4px;
  color: var(--wach-color-primary);
  white-space: nowrap;
}

.wach-category-search__tag-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  width: 16px;
  height: 16px;
  border: none;
  border-radius: 2px;
  background: transparent;
  color: inherit;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  opacity: 0.8;
}

.wach-category-search__tag-close:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.06);
}

.wach-category-search__input-wrap {
  flex: 1;
  min-width: 80px;
}

.wach-category-search__input {
  box-sizing: border-box;
  width: 100%;
  height: 24px;
  padding: 0 4px;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  color: var(--wach-color-text);
  background: transparent;
  border: none;
  outline: none;
}

.wach-category-search__input::placeholder {
  color: var(--wach-category-search-placeholder-color, #aeaeae);
}

.wach-category-search__input:read-only {
  cursor: default;
}

/* 脱离文档流挂到 body，position/尺寸由 :style 绑定（对齐 DevUI Dropdown append-to-body） */
.wach-category-search__dropdown {
  min-width: 160px;
  background: var(--wach-color-bg);
  border: 1px solid var(--wach-category-search-border-color, #c9c9c9);
  border-radius: var(--wach-category-search-radius, 6px);
  box-shadow: var(
    --wach-category-search-dropdown-shadow,
    0 4px 12px rgba(0, 0, 0, 0.1)
  );
}

.wach-category-search__menu {
  margin: 0;
  padding: 4px 0;
  list-style: none;
}

.wach-category-search__menu-item {
  padding: 8px 12px;
  cursor: pointer;
  color: var(--wach-color-text);
  transition: background 0.15s;
}

.wach-category-search__menu-item:hover {
  background: var(--wach-color-bg-soft);
  color: var(--wach-color-primary);
}

.wach-category-search__menu-empty {
  padding: 12px;
  color: var(--wach-color-text-secondary);
  font-size: 13px;
  text-align: center;
}

.wach-category-search__menu-back {
  display: block;
  width: 100%;
  margin: 0;
  padding: 8px 12px;
  border: none;
  border-bottom: 1px solid var(--wach-color-border);
  background: var(--wach-color-bg-soft);
  font-family: inherit;
  font-size: 13px;
  color: var(--wach-color-text-secondary);
  text-align: left;
  cursor: pointer;
}

.wach-category-search__menu-back:hover {
  color: var(--wach-color-primary);
}

.wach-cs-drop-enter-active,
.wach-cs-drop-leave-active {
  transition: opacity 0.12s ease;
}

.wach-cs-drop-enter-from,
.wach-cs-drop-leave-to {
  opacity: 0;
}
</style>
