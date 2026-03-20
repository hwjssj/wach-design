import type { InjectionKey } from "vue";
import type { TableColumnMeta } from "./tableTypes";

export type WachTableContext = {
  registerColumn: (meta: TableColumnMeta) => () => void;
};

export const wachTableKey: InjectionKey<WachTableContext> =
  Symbol("wachTable");
