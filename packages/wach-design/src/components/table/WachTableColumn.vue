<script setup lang="ts">
/**
 * WachTableColumn：列定义（对齐 DevUI d-table-column 的 prop / label / width 等）
 * 仅注册元数据，实际渲染由 WachTable 完成；自定义单元格请用父级 #body-{prop}
 */
import { onBeforeUnmount, onMounted, inject } from "vue";
import type { TableColumnAlign, TableColumnMeta } from "./tableTypes";
import { wachTableKey } from "./tableInjection";

defineOptions({ name: "WachTableColumn" });

const props = withDefaults(
  defineProps<{
    /** 对应行字段，支持 `user.name` */
    prop: string;
    /** 表头文案 */
    label: string;
    /** 列宽，如 `120px`、`20%` */
    width?: string;
    minWidth?: string;
    align?: TableColumnAlign;
  }>(),
  {
    width: undefined,
    minWidth: undefined,
    align: undefined,
  }
);

const ctx = inject(wachTableKey);
if (ctx === undefined) {
  throw new Error("WachTableColumn 必须放在 WachTable 内使用");
}

const colId = Symbol(props.prop);

let unregister: (() => void) | undefined;

onMounted(() => {
  const meta: TableColumnMeta = {
    id: colId,
    prop: props.prop,
    label: props.label,
    width: props.width,
    minWidth: props.minWidth,
    align: props.align,
  };
  unregister = ctx.registerColumn(meta);
});

onBeforeUnmount(() => {
  unregister?.();
});
</script>

<template>
  <!-- 无可见 UI：列仅用于注册 -->
  <span class="wach-table-column" aria-hidden="true" style="display: none" />
</template>
