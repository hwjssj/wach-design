/**
 * Table 列元数据（与 DevUI d-table-column 字段对齐）
 */
export type TableColumnAlign = "left" | "center" | "right";

export type TableColumnMeta = {
  /** 列唯一 id（注册时生成） */
  id: symbol;
  /** 对应行数据字段，支持 `a.b` */
  prop: string;
  label: string;
  width?: string;
  minWidth?: string;
  align?: TableColumnAlign;
};
