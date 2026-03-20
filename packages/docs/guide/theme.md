# 主题与 Token

## CSS 变量

在 `:root` 上覆盖 `--wach-*` 即可定制浅色主题；在 `html.dark` 下覆盖对应变量可定制暗色。

变量列表见源码 `packages/wach-design/src/styles/tokens.css`。

## 明暗切换

给根节点增加 class `dark` 即可启用暗色 Token（与 `html.dark` 二选一，当前 Token 写在 `html.dark` 下，请同时给 `html` 加 `class="dark"` **或** 将暗色选择器改为与你的产品一致）。

示例：

::: details 查看代码
```html
<html class="dark">
```
:::

若你希望仅用 `html.dark` 而不使用 class，可把 `tokens.css` 中 `html.dark` 保持为暗色定义，通过 JS 切换 `document.documentElement.classList.toggle('dark')` 并同步将暗色变量挂在 `.dark` 上——可按项目统一一种写法。
