/**
 * VitePress 站点配置：标题、侧边栏、本地包 wach-design 解析
 */
import { defineConfig } from "vitepress";
import { resolve } from "node:path";
import Components from "unplugin-vue-components/vite";
/* 配置在 Node 下加载，用相对路径引用 resolver，避免未构建时包入口不可用 */
import { WachDesignResolver } from "../../wach-design/src/resolver";

export default defineConfig({
  title: "wach-design",
  description: "Vue 3 组件库",
  markdown: {
    // 代码块右上角复制按钮的提示文案
    codeCopyButtonTitle: "复制代码",
  },
  themeConfig: {
    nav: [
      { text: "指南", link: "/guide/install" },
      { text: "组件", link: "/components/button" },
    ],
    sidebar: {
      "/guide/": [
        { text: "安装与使用", link: "/guide/install" },
        { text: "主题与 Token", link: "/guide/theme" },
      ],
      "/components/": [
        { text: "Button 按钮", link: "/components/button" },
        { text: "Tabs 页签", link: "/components/tabs" },
        { text: "Radio 单选框", link: "/components/radio" },
        { text: "CategorySearch 分类搜索", link: "/components/category-search" },
        { text: "PageHeader 页头", link: "/components/page-header" },
        { text: "Accordion 折叠面板", link: "/components/accordion" },
        { text: "Form 表单", link: "/components/form" },
        { text: "Table 表格", link: "/components/table" },
      ],
    },
    socialLinks: [],
  },
  vite: {
    plugins: [
      // 文档 .md 里写 <WachButton> 时自动解析（演示按需引入）
      Components({
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [WachDesignResolver()],
        dts: false,
      }),
    ],
    resolve: {
      alias: {
        // .vitepress 的上两级才是 packages，再进 wach-design 源码
        "wach-design": resolve(__dirname, "../../wach-design/src/index.ts"),
        "wach-design/resolver": resolve(
          __dirname,
          "../../wach-design/src/resolver.ts"
        ),
      },
    },
    css: {
      preprocessorOptions: {
        scss: { api: "modern-compiler" },
      },
    },
  },
});
