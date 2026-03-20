/** 从行对象按 `a.b` 取值 */
export function getCellValue(row: Record<string, unknown>, prop: string): unknown {
  if (!prop) return "";
  const parts = prop.split(".");
  let cur: unknown = row;
  for (const p of parts) {
    if (cur === null || cur === undefined || typeof cur !== "object") {
      return undefined;
    }
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

export function formatCellValue(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
