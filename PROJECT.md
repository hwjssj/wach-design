# wach-design 项目说明

本文档说明 monorepo 目录、各包职责、命令与发布步骤，对应需求见仓库外 `组件框.md`。

---

## 1. 目录结构

```
wach-design/
├── pnpm-workspace.yaml      # 声明 packages/* 为子包
├── package.json             # 根脚本：build / dev:docs / build:docs
├── README.md
├── PROJECT.md               # 本文件
├── packages/
│   ├── wach-design/         # 【发布到 npm】组件库本体
│   │   ├── package.json     # name: wach-design，exports、peerDependencies
│   │   ├── vite.config.ts   # 库模式：ESM + style.css + resolver 入口
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts     # 全量 install、导出 WachButton
│   │       ├── resolver.ts  # unplugin-vue-components 解析器
│   │       ├── styles/tokens.css   # --wach-* 变量，html.dark 暗色
│   │       └── components/button/WachButton.vue
│   └── docs/                # VitePress 文档（不单独发 npm）
│       ├── package.json     # name: wach-docs，依赖 workspace:wach-design
│       └── .vitepress/
│           ├── config.ts    # 侧边栏、别名指向组件库源码便于热更新
│           └── theme/index.ts  # 全局引入 tokens.css
```

---

## 2. 各包职责

| 包 | 职责 |
|----|------|
| **wach-design** | 提供 Vue 3 组件、全局样式 `dist/style.css`、类型声明、`wach-design/resolver` 按需解析。 |
| **wach-docs** | 安装指南、主题说明、组件 API 表与示例；开发时用 Vite 别名指向 `wach-design` 源码，无需先 build 即可改组件看效果。 |

---

## 3. 配置文件与注释

- **带中文注释**的文件：`vite.config.ts`、`tsconfig.json`（wach-design）、`.vitepress/config.ts`、`theme/index.ts`、`tokens.css`、`resolver.ts` 等。
- **JSON**（如 `package.json`）标准不支持注释，说明写在 **本文件** 或 **README**。

---

## 4. 本地开发流程

1. 根目录执行 **`pnpm install`**。  
2. **只看文档 + 改组件**：**`pnpm dev:docs`**。文档内通过别名加载 `packages/wach-design/src`。  
3. **验证 npm 产物**：**`pnpm build`** 后，业务项目可通过 `file:` 或 `pnpm link` 引用 `packages/wach-design` 的 `dist`。

---

## 5. 构建说明

- **`pnpm build`**：仅构建 **wach-design**，输出：  
  - `dist/index.js`（ESM）  
  - `dist/style.css`（Token + 组件样式）  
  - `dist/resolver.js` + 对应 `.d.ts`  
  - `dist/index.d.ts`  
- 使用方：**`import 'wach-design/dist/style.css'`** 与文档一致。

---

## 6. 发布 npm 步骤（概要）

1. 修改 `packages/wach-design/package.json` 的 `version`。  
2. 在仓库根目录执行 **`pnpm build`**。  
3. 进入 **`packages/wach-design`**，登录 npm：`npm login`。  
4. 执行 **`npm publish`**（若使用作用域包 `@org/wach-design`，需 `"publishConfig": { "access": "public" }`）。  
5. 确认 `package.json` 的 `files` 仅包含 `dist`，勿把源码误发（当前已限制为 `dist`）。

---

## 7. 主题变量如何覆盖

- 默认变量定义在 **`packages/wach-design/src/styles/tokens.css`** 的 `:root` 与 **`html.dark`**。  
- 使用方在入口 CSS 中于其后覆盖同名 **`--wach-*`** 即可。  
- 暗色：根节点使用与 **`html.dark`** 一致的策略（例如给 `<html class="dark">`），与 VitePress 默认暗色一致。

---

## 8. 按需引入原理（与 element-plus 思路一致）

- 模板写 **`<WachButton>`** 时，**unplugin-vue-components** + **`WachDesignResolver`** 自动生成 `import { WachButton } from 'wach-design'`。  
- 样式仍需全量引入 **`wach-design/dist/style.css`**（MVP 未做按组件拆分的 CSS 入口）。

---

## 9. 未包含项（按需求）

- 无国际化（i18n）。  
- 无单元测试。  

---

## 10. 组件文档规范

- 每个组件使用文档（`packages/docs/components/xxx.md`）**必须包含「变更说明」章节**，与 Button、Tabs、Radio 一致。
- 格式：表头为「版本」「说明」，按时间倒序列出版本与对应改动（如 0.0.1 初始版本、0.0.2 按某设计稿重写等）。后续新增或迭代组件时，请同步维护该表。

---

如有新组件，在 **wach-design** 的 `src/components` 增加目录，在 **`index.ts`** 注册并导出，在 **docs** 侧增加侧边栏与 `components/xxx.md`（**含变更说明**）即可。
