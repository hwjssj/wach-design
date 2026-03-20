/**
 * wach-design 库构建配置
 * - library mode：打出一个 ESM 入口 + 聚合样式 style.css
 * - vue 作为 external，由使用方提供
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    vue(),
    // 从 TS 源码生成类型声明到 dist
    dts({
      entryRoot: "src",
      tsconfigPath: "tsconfig.json",
      include: ["src/**/*.ts", "src/**/*.vue"],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        resolver: resolve(__dirname, "src/resolver.ts"),
      },
      formats: ["es"],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        // 样式文件固定为 style.css，便于文档约定：import 'wach-design/dist/style.css'
        assetFileNames: "style.css",
      },
    },
    emptyOutDir: true,
  },
});
