<script setup lang="ts">
/**
 * WachFormItem：表单项（对齐 DevUI Vue d-form-item）
 * - label、prop、required、rules；错误信息与 help 插槽
 */
import { ref, computed, inject, onBeforeUnmount, watch, useSlots } from "vue";
import type { FormRule } from "./formTypes";
import { getPath, validateRules } from "./formTypes";
import { wachFormKey, type WachFormContext } from "./formInjection";

defineOptions({ name: "WachFormItem" });

const props = withDefaults(
  defineProps<{
    /** 标签文案 */
    label?: string;
    /** 对应 model 中的字段路径，如 `email` 或 `user.name` */
    prop?: string;
    /** 是否显示必填星号（仅展示，真正必填由 rules.required 决定） */
    required?: boolean;
    /** 当前项规则，会与 Form 上 rules[prop] 合并（此项优先） */
    rules?: FormRule[];
    /** 覆盖 Form 的 labelWidth */
    labelWidth?: string;
    /**
     * 是否展示标签旁提示图标（对齐 DSL：提示图标-helpTips）
     * 与插槽 `#helpTips` 二选一；有插槽时始终展示插槽内容
     */
    showHelpTips?: boolean;
    /** 提示图标原生 title（无障碍/悬停说明） */
    helpTipsTitle?: string;
    /**
     * 是否展示辅助文本区域（对齐 DSL：是否展示辅助文本-showExtraInfo）
     * 为 false 时不渲染 `#extra` 区域
     */
    showExtraInfo?: boolean;
  }>(),
  {
    label: "",
    required: false,
    rules: undefined,
    showHelpTips: false,
    helpTipsTitle: "",
    showExtraInfo: true,
  }
);

defineSlots<{
  label?: () => unknown;
  /** 自定义提示图标（替代默认问号图标） */
  helpTips?: () => unknown;
  default?: () => unknown;
  error?: (props: { message: string }) => unknown;
  extra?: () => unknown;
}>();

const _formInject = inject(wachFormKey);
if (_formInject === undefined) {
  throw new Error("WachFormItem 必须放在 WachForm 内使用");
}
/** 显式类型，避免嵌套 async 中 inject 被推断为可能 undefined */
const formCtx: WachFormContext = _formInject;

const errorMessage = ref("");

const mergedRules = computed<FormRule[] | undefined>(() => {
  const fromForm = props.prop ? formCtx.rules[props.prop] : undefined;
  const local = props.rules;
  if (fromForm?.length && local?.length) {
    return [...local, ...fromForm];
  }
  return local ?? fromForm;
});

async function validate(): Promise<string | null> {
  if (!props.prop) {
    errorMessage.value = "";
    return null;
  }
  const value = getPath(formCtx.model, props.prop);
  const err = await validateRules(value, mergedRules.value, formCtx.model);
  errorMessage.value = err ?? "";
  return err;
}

function clearValidate() {
  errorMessage.value = "";
}

let unregister: (() => void) | undefined;

watch(
  () => props.prop,
  (newProp) => {
    unregister?.();
    unregister = undefined;
    if (newProp) {
      unregister = formCtx.registerField(newProp, {
        validate,
        clearValidate,
      });
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  unregister?.();
});

watch(
  () => [props.prop, formCtx.model, mergedRules.value] as const,
  async () => {
    if (!props.prop || !errorMessage.value) return;
    await validate();
  },
  { deep: true }
);

const labelStyle = computed(() => {
  const w = props.labelWidth ?? formCtx.labelWidth;
  if (formCtx.labelPosition === "top") {
    return { width: "100%" };
  }
  return { width: w };
});

const showRequired = computed(
  () =>
    props.required ||
    mergedRules.value?.some((r) => r.required) === true
);

const showError = computed(
  () => formCtx.showMessage && Boolean(errorMessage.value)
);

/** 标签列内文字对齐（与 DevUI label-position 一致） */
const labelTextAlign = computed(() => {
  if (formCtx.labelPosition === "top") return "left";
  return formCtx.labelPosition === "left" ? "left" : "right";
});

const slots = useSlots();

const showHelpTipsUi = computed(
  () => Boolean(props.showHelpTips || slots.helpTips)
);
</script>

<template>
  <div
    class="wach-form-item"
    :class="{
      'is-error': showError,
      'is-required': showRequired,
      [`wach-form-item--label-${formCtx.labelPosition}`]: true,
    }"
  >
    <div
      v-if="label || $slots.label || showHelpTipsUi"
      class="wach-form-item__label"
      :style="labelStyle"
    >
      <div class="wach-form-item__label-inner">
        <span v-if="showRequired" class="wach-form-item__required" aria-hidden="true"
          >*</span
        >
        <span class="wach-form-item__label-text">
          <slot name="label">{{ label }}{{ formCtx.labelSuffix }}</slot>
        </span>
        <span
          v-if="showHelpTipsUi"
          class="wach-form-item__help-wrap"
        >
          <slot name="helpTips">
            <button
              type="button"
              class="wach-form-item__help-btn"
              :title="helpTipsTitle || undefined"
              aria-label="帮助说明"
            >
              <svg
                class="wach-form-item__help-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                aria-hidden="true"
                fill="currentColor"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
                />
              </svg>
            </button>
          </slot>
        </span>
      </div>
    </div>
    <div class="wach-form-item__content">
      <div class="wach-form-item__control">
        <slot />
      </div>
      <div v-if="showExtraInfo && $slots.extra" class="wach-form-item__extra">
        <slot name="extra" />
      </div>
      <div
        v-if="showError"
        class="wach-form-item__error"
        role="alert"
      >
        <slot name="error" :message="errorMessage">
          {{ errorMessage }}
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wach-form-item {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-bottom: var(--wach-form-item-margin-bottom, 18px);
  font-size: var(--wach-form-font-size, 14px);
  line-height: var(--wach-form-line-height, 22px);
}

.wach-form-item--label-top {
  flex-direction: column;
  gap: var(--wach-form-item-label-gap, 8px);

  .wach-form-item__label {
    padding: 0;
    text-align: left;
  }

  .wach-form-item__content {
    width: 100%;
  }
}

.wach-form-item--label-left,
.wach-form-item--label-right {
  flex-direction: row;
  gap: var(--wach-form-item-inline-gap, 12px);

  .wach-form-item__label {
    flex-shrink: 0;
    padding-top: var(--wach-form-item-label-padding-top, 5px);
    text-align: v-bind(labelTextAlign);
  }

  .wach-form-item__content {
    flex: 1;
    min-width: 0;
  }
}

.wach-form-item__required {
  margin-right: 4px;
  color: var(--wach-form-required-color, #f56c6c);
  font-family: SimSun, sans-serif;
}

.wach-form-item__label-text {
  color: var(--wach-form-label-color, var(--wach-color-text-secondary, #606266));
}

.wach-form-item__control {
  width: 100%;
}

.wach-form-item__extra {
  margin-top: var(--wach-spacing-xs, 4px);
  font-size: var(--wach-font-size-sm, 12px);
  color: var(--wach-color-text-secondary, #909399);
}

.wach-form-item__error {
  margin-top: var(--wach-form-error-margin-top, 4px);
  font-size: var(--wach-form-error-font-size, 12px);
  line-height: var(--wach-form-error-line-height, 18px);
  color: var(--wach-form-error-color, #f56c6c);
}

.wach-form-item.is-error :deep(input:not([type="hidden"])),
.wach-form-item.is-error :deep(textarea),
.wach-form-item.is-error :deep(select),
.wach-form-item.is-error :deep(.wach-form-input) {
  border-color: var(--wach-form-error-border-color, #f56c6c);
}

.wach-form-item__label-inner {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--wach-form-item-label-inner-gap, 4px);
  min-width: 0;
}

.wach-form-item__help-wrap {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
}

.wach-form-item__help-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--wach-form-help-icon-color, #aeaeae);
  cursor: help;
  line-height: 0;
}

.wach-form-item__help-btn:hover {
  color: var(--wach-form-help-icon-hover-color, #777777);
}

.wach-form-item__help-icon {
  display: block;
}
</style>
