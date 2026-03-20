/**
 * unplugin-vue-components 解析器：模板里写 <WachButton> 时自动从 wach-design 按名导入。
 * 使用方仍需全局引入样式：import 'wach-design/dist/style.css'
 *
 * 配置示例见文档站「按需引入」章节。
 */
export function WachDesignResolver() {
  return (name: string) => {
    if (/^Wach[A-Z][a-zA-Z]*/.test(name)) {
      return { name, from: "wach-design" };
    }
    return undefined;
  };
}
