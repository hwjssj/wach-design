# 安装与使用

## 安装

::: details 查看代码
```bash
pnpm add wach-design
# 或 npm / yarn
```
:::

需满足 **Vue ^3.3**，Node 建议 **>= 18**。

## 全量引入

::: details 查看代码
```ts
import { createApp } from "vue";
import WachDesign from "wach-design";
import "wach-design/dist/style.css";

const app = createApp(App);
app.use(WachDesign);
```
:::

## 按需引入（unplugin-vue-components）

安装插件后，在 `vite.config.ts` 中：

::: details 查看代码
```ts
import Components from "unplugin-vue-components/vite";
import { WachDesignResolver } from "wach-design/resolver";

export default defineConfig({
  plugins: [
    Components({
      resolvers: [WachDesignResolver()],
    }),
  ],
});
```
:::

模板中直接使用 `<WachButton>`，**仍需全局引入样式**：

::: details 查看代码
```ts
import "wach-design/dist/style.css";
```
:::

## 或按名导入

::: details 查看代码
```vue
<script setup lang="ts">
import { WachButton } from "wach-design";
</script>
```
:::

同样需引入 `wach-design/dist/style.css`。
