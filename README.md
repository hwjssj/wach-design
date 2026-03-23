# wach-design

Vue 3 组件库 **wach-design** 的 monorepo：可发布 npm 的组件包 + VitePress 文档站。

## 环境

- **Node** >= 18  
- **pnpm** >= 8（推荐 `corepack enable` 后使用 pnpm）

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm install` | 根目录安装全部依赖 |
| `pnpm build` | 构建组件库产物到 `packages/wach-design/dist` |
| `pnpm dev:docs` | 启动文档站（仅本机访问） |
| `pnpm dev:docs:network` | 启动文档站（局域网可访问，`--host 0.0.0.0`） |
| `pnpm build:docs` | 构建静态文档 |

## 文档与说明

- 使用说明、全量/按需引入：**文档站「安装与使用」** 或见 `packages/docs/guide/install.md`
- 主题变量：**`packages/wach-design/src/styles/tokens.css`** 与文档「主题与 Token」
- **架构、目录、发布流程**：请阅读根目录 **[PROJECT.md](./PROJECT.md)**

## 包说明

| 路径 | 说明 |
|------|------|
| `packages/wach-design` | npm 包 **wach-design**，含 `WachButton` 示例与 `WachDesignResolver` |
| `packages/docs` | 文档站，依赖 workspace 内的 `wach-design` |

发布 npm 时在 **`packages/wach-design`** 下执行 `npm publish`（需先 `pnpm build`）。
