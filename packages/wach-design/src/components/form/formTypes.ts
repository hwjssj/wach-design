/**
 * Form / FormItem 类型（对齐 DevUI Vue d-form / d-form-item 基础能力）
 */

export type FormRule = {
  /** 必填 */
  required?: boolean;
  /** 校验失败提示（各内置规则默认也有文案） */
  message?: string;
  /** 字符串最小长度 */
  min?: number;
  /** 字符串最大长度 */
  max?: number;
  /** 正则 */
  pattern?: RegExp;
  /** 自定义校验：返回 true 通过；返回 string 为错误信息；Promise 同理 */
  validator?: (
    value: unknown,
    model: Record<string, unknown>
  ) => boolean | string | Promise<boolean | string>;
};

export type FormRules = Record<string, FormRule[]>;

/** 从 model 按 `a.b.c` 取值 */
export function getPath(obj: unknown, path: string): unknown {
  if (!path) return obj;
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur === null || cur === undefined || typeof cur !== "object") {
      return undefined;
    }
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

/** 深拷贝（用于 resetFields，仅适合 JSON 可序列化数据） */
export function cloneModel<T extends Record<string, unknown>>(obj: T): T {
  try {
    return structuredClone(obj);
  } catch {
    return JSON.parse(JSON.stringify(obj)) as T;
  }
}

export async function runRule(
  value: unknown,
  rule: FormRule,
  model: Record<string, unknown>
): Promise<string | null> {
  if (rule.required) {
    const empty =
      value === "" ||
      value === undefined ||
      value === null ||
      (Array.isArray(value) && value.length === 0);
    if (empty) {
      return rule.message ?? "该项为必填项";
    }
  }

  if (rule.min !== undefined) {
    const len =
      typeof value === "string"
        ? value.length
        : Array.isArray(value)
          ? value.length
          : value != null && typeof value === "object"
            ? Object.keys(value as object).length
            : 0;
    if (len < rule.min) {
      return rule.message ?? `长度不能少于 ${rule.min}`;
    }
  }

  if (rule.max !== undefined) {
    const len =
      typeof value === "string"
        ? value.length
        : Array.isArray(value)
          ? value.length
          : 0;
    if (len > rule.max) {
      return rule.message ?? `长度不能超过 ${rule.max}`;
    }
  }

  if (rule.pattern && typeof value === "string" && !rule.pattern.test(value)) {
    return rule.message ?? "格式不正确";
  }

  if (rule.validator) {
    const r = await rule.validator(value, model);
    if (r === true || r === "") return null;
    if (typeof r === "string") return r;
    return rule.message ?? "校验未通过";
  }

  return null;
}

export async function validateRules(
  value: unknown,
  rules: FormRule[] | undefined,
  model: Record<string, unknown>
): Promise<string | null> {
  if (!rules?.length) return null;
  const isEmpty =
    value === "" ||
    value === undefined ||
    value === null ||
    (Array.isArray(value) && value.length === 0);
  const hasRequired = rules.some((r) => r.required);
  /** 非必填且为空时，跳过其余规则（与常见 Form 行为一致） */
  if (isEmpty && !hasRequired) return null;

  for (const rule of rules) {
    const err = await runRule(value, rule, model);
    if (err) return err;
  }
  return null;
}
