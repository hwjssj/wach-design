/**
 * VitePress 主题扩展：注入全局 Token，保证 demo 与明暗主题一致
 */
import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import DemoBlock from "./components/DemoBlock.vue";
import "../../../wach-design/src/styles/tokens.css";
import "./style.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("DemoBlock", DemoBlock);
  },
} satisfies Theme;
