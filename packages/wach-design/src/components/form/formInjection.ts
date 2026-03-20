import type { InjectionKey } from "vue";
import type { FormRules } from "./formTypes";

export type FieldEntry = {
  validate: () => Promise<string | null>;
  clearValidate: () => void;
};

export type WachFormContext = {
  model: Record<string, unknown>;
  rules: FormRules;
  labelPosition: "left" | "right" | "top";
  labelWidth: string;
  labelSuffix: string;
  showMessage: boolean;
  registerField: (prop: string, entry: FieldEntry) => () => void;
  validateField: (prop: string) => Promise<string | null>;
};

export const wachFormKey: InjectionKey<WachFormContext> =
  Symbol("wachForm");
