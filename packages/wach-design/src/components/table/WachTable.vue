<script setup lang="ts">
/**
 * WachTable：基础表格
 * - 视觉：Pixso / DSL「表格-（自由编排）单行表格」— 自由版-表格-单行（白底、8px 圆角、浅阴影、行高 42、分隔线 #f3f3f3、表头 12/700、正文 14/400）
 * - API：DevUI d-table 风格 — data + WachTableColumn；border（全框线）/ stripe / size；loading；#body-{prop}
 */
import { computed, provide, shallowRef } from "vue";
import type { TableColumnMeta } from "./tableTypes";
import { wachTableKey } from "./tableInjection";
import { getCellValue, formatCellValue } from "./tableUtils";

defineOptions({ name: "WachTable" });

const props = withDefaults(
  defineProps<{
    /** 行数据 */
    data?: Record<string, unknown>[];
    /** 是否带纵向边框 */
    border?: boolean;
    /** 斑马纹 */
    stripe?: boolean;
    /** 尺寸 */
    size?: "sm" | "md";
    /** 加载中 */
    loading?: boolean;
    /** 空数据文案 */
    emptyText?: string;
    /**
     * 行 key：字段名或 `(row, index) => key`
     */
    rowKey?: string | ((row: Record<string, unknown>, index: number) => string | number);
  }>(),
  {
    data: () => [],
    border: false,
    stripe: false,
    size: "md",
    loading: false,
    emptyText: "暂无数据",
    rowKey: undefined,
  }
);

const columns = shallowRef<TableColumnMeta[]>([]);

function registerColumn(meta: TableColumnMeta) {
  columns.value = [...columns.value, meta];
  return () => {
    columns.value = columns.value.filter((c) => c.id !== meta.id);
  };
}

provide(wachTableKey, { registerColumn });

function resolveRowKey(row: Record<string, unknown>, index: number) {
  const rk = props.rowKey;
  if (typeof rk === "function") return rk(row, index);
  if (typeof rk === "string" && rk) {
    const v = row[rk];
    if (v !== undefined && v !== null) return String(v);
  }
  return index;
}

function thStyle(col: TableColumnMeta) {
  const s: Record<string, string> = {
    textAlign: col.align ?? "left",
  };
  if (col.width) s.width = col.width;
  if (col.minWidth) s.minWidth = col.minWidth;
  return s;
}

function tdStyle(col: TableColumnMeta) {
  return {
    textAlign: col.align ?? "left",
    ...(col.width ? { width: col.width } : {}),
    ...(col.minWidth ? { minWidth: col.minWidth } : {}),
  };
}

function cellText(row: Record<string, unknown>, col: TableColumnMeta) {
  return formatCellValue(getCellValue(row, col.prop));
}

function bodySlotName(prop: string) {
  return `body-${prop}` as const;
}

const colCount = computed(() => Math.max(1, columns.value.length));
</script>

<template>
  <div
    class="wach-table"
    :class="[
      `wach-table--size-${size}`,
      { 'is-bordered': border, 'is-stripe': stripe, 'is-loading': loading },
    ]"
  >
    <!--
      必须渲染默认插槽：否则 WachTableColumn 不会挂载，列无法注册（文档站 / 任意用法下表头与单元格为空）
    -->
    <div class="wach-table__column-slot" aria-hidden="true">
      <slot />
    </div>
    <div class="wach-table__inner">
      <table class="wach-table__table" role="table">
        <thead class="wach-table__thead">
          <tr>
            <th
              v-for="col in columns"
              :key="String(col.id)"
              class="wach-table__th"
              scope="col"
              :style="thStyle(col)"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody class="wach-table__tbody">
          <template v-if="data.length">
            <tr
              v-for="(row, ri) in data"
              :key="resolveRowKey(row, ri)"
              class="wach-table__tr"
              :class="{ 'is-stripe-row': stripe && ri % 2 === 1 }"
            >
              <td
                v-for="col in columns"
                :key="String(col.id)"
                class="wach-table__td"
                :style="tdStyle(col)"
              >
                <slot
                  :name="bodySlotName(col.prop)"
                  :row="row"
                  :column="col"
                  :$index="ri"
                >
                  {{ cellText(row, col) }}
                </slot>
              </td>
            </tr>
          </template>
          <tr v-else-if="!loading" class="wach-table__empty-tr">
            <td class="wach-table__empty" :colspan="colCount">
              <slot name="empty">{{ emptyText }}</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="loading" class="wach-table__mask" aria-busy="true" aria-live="polite">
      <span class="wach-table__spinner" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wach-table {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  font-family: var(
    --wach-table-font-family,
    "HarmonyOS Sans SC",
    system-ui,
    sans-serif
  );
  color: var(--wach-table-text-color, #191919);
  background: var(--wach-table-bg, #ffffff);
  border-radius: var(--wach-table-radius, 8px);
  box-shadow: var(--wach-table-shadow, 0 1px 6px 0 rgba(0, 0, 0, 0.08));
  overflow: hidden;
}

.wach-table__column-slot {
  position: absolute;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
  pointer-events: none;
}

.wach-table__inner {
  overflow-x: auto;
  background: var(--wach-table-bg, #ffffff);
}

.wach-table__table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: auto;
  background: var(--wach-table-bg, #ffffff);
}

/* 自由编排：仅横向分隔线（与 DSL 标题行/数据行 bottom bd 一致） */
.wach-table:not(.is-bordered) .wach-table__th,
.wach-table:not(.is-bordered) .wach-table__td {
  border-style: solid;
  border-color: transparent;
  border-width: 0;
  border-bottom: var(--wach-table-row-separator, 1px solid #f3f3f3);
}

.wach-table:not(.is-bordered) .wach-table__tbody .wach-table__tr:last-child .wach-table__td {
  border-bottom: var(--wach-table-row-separator, 1px solid #f3f3f3);
}

.wach-table.is-bordered .wach-table__table {
  border: var(--wach-table-border, 1px solid #f3f3f3);
}

.wach-table.is-bordered .wach-table__th,
.wach-table.is-bordered .wach-table__td {
  border: var(--wach-table-cell-border, 1px solid #f3f3f3);
}

.wach-table__th {
  box-sizing: border-box;
  min-height: var(--wach-table-row-min-height, 42px);
  padding: var(--wach-table-header-padding-y, 11px)
    var(--wach-table-cell-padding-x, 16px);
  font-size: var(--wach-table-header-font-size, 12px);
  line-height: var(--wach-table-header-line-height, 20px);
  font-weight: var(--wach-table-header-weight, 700);
  color: var(--wach-table-header-color, #191919);
  text-align: left;
  white-space: nowrap;
  vertical-align: middle;
  background: var(--wach-table-header-bg, #ffffff);
}

.wach-table__td {
  box-sizing: border-box;
  min-height: var(--wach-table-row-min-height, 42px);
  padding: var(--wach-table-cell-padding-y, 10px)
    var(--wach-table-cell-padding-x, 16px);
  font-size: var(--wach-table-cell-font-size, 14px);
  line-height: var(--wach-table-cell-line-height, 22px);
  font-weight: var(--wach-table-cell-weight, 400);
  color: var(--wach-table-cell-color, #191919);
  vertical-align: middle;
}

.wach-table__thead {
  background: var(--wach-table-header-bg, #ffffff);
}

.wach-table--size-sm .wach-table__th {
  padding: var(--wach-table-cell-padding-y-sm, 6px)
    var(--wach-table-cell-padding-x-sm, 10px);
  font-size: var(--wach-table-font-size-sm, 12px);
  line-height: var(--wach-table-line-height-sm, 20px);
}

.wach-table--size-sm .wach-table__td {
  padding: var(--wach-table-cell-padding-y-sm, 6px)
    var(--wach-table-cell-padding-x-sm, 10px);
  font-size: var(--wach-table-font-size-sm, 12px);
  line-height: var(--wach-table-line-height-sm, 20px);
}

.wach-table__tbody .wach-table__tr:hover {
  background: var(--wach-table-row-hover-bg, #fafafa);
}

.wach-table.is-stripe .wach-table__tbody .wach-table__tr.is-stripe-row {
  background: var(--wach-table-stripe-bg, #f3f3f3);
}

.wach-table__empty-tr .wach-table__empty {
  text-align: center;
  color: var(--wach-table-empty-color, var(--wach-color-text-secondary, #909399));
  padding: var(--wach-table-empty-padding, 24px 16px);
  border-bottom: none;
}

.wach-table__mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--wach-table-mask-bg, rgba(255, 255, 255, 0.65));
  border-radius: inherit;
}

.wach-table__spinner {
  width: 28px;
  height: 28px;
  border: 2px solid var(--wach-table-spinner-track, #e4e7ed);
  border-top-color: var(--wach-color-primary, #409eff);
  border-radius: 50%;
  animation: wach-table-spin 0.7s linear infinite;
}

@keyframes wach-table-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
