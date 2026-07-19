# MoeKoe Smart Artist Search

MoeKoe Music 插件。点击播放器底部的歌手名时，自动识别顿号分隔的多位歌手并弹出选择菜单，解决联合搜索不精确的问题。

## 解决的问题

MoeKoe Music 播放器底部显示的歌手名如"卓文萱、曹格"是一个整体文本。点击它时，客户端会用整个字符串作为关键词搜索，搜不到理想的单人结果。

本插件拦截点击行为，将歌手名按顿号分割，弹出菜单供你选择，再以选中的歌手名发起精确搜索。

## 安装

### 从插件市场安装（审核通过后）

打开 MoeKoe Music → 设置 → 插件 → 插件市场 → 找到 "MoeKoe Smart Artist Search" → 安装。

### 手动安装

1. 下载此仓库或复制插件目录到 MoeKoe 扩展目录：
   ```
   %APPDATA%\moekoemusic\extensions\MoeKoe-Smart-Artist-Search\
   ```
2. 重启 MoeKoe Music，插件自动生效，无需额外配置。

## 使用

正常点击播放器底部的歌手名即可。

- 歌手名不含顿号（如单人演唱）→ 行为不变，直接搜索该歌手。
- 歌手名含顿号（如"卓文萱、曹格"）→ 弹出悬浮列表，列出每一位歌手，点击某一项后精确搜索。

## 文件结构

```
MoeKoe-Smart-Artist-Search/
├── manifest.json    # 插件声明文件
├── content.js       # Content Script：注入样式和 hook.js
├── hook.js          # 主世界脚本：拦截点击、弹出菜单、触发搜索
└── README.md        # 本文件
```

## 工作原理

MoeKoe Music 的扩展系统基于 Chrome Extension Manifest V3。本插件通过 content script 注入一段主世界脚本（hook.js），在浏览器的捕获阶段拦截 `.artist` 元素的点击事件。捕获阶段的优先级高于 Vue 的事件处理，因此可以阻止 Vue 将整个字符串作为关键词搜索，转而弹出自定义菜单。

搜索通过 hash 路由 `#/search?q=歌手名` 触发，与 MoeKoe Music 原生的搜索路由保持一致。

## 兼容性

- MoeKoe Music v1.6.7+
- 支持暗色主题（样式适配 player-container 的暗色配色）

## License

MIT
