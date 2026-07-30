# 王吉源｜游戏特效个人作品集

基于 **React + Vite** 构建的深色、PC 优先个人作品集网站。

## 当前内容

站点已依据简历填入：

- 王吉源｜游戏特效师
- SNK 中国、完美世界、盖娅互娱、蓝鲸时代工作经历
- PJN、P5X、PJW、山海异闻录等精选项目
- 全链路制作、材质与性能、设计与协作能力
- MagesBox 线上作品集入口

简历中的邮箱与手机号是脱敏形式，因此页面仅展示脱敏信息；如需实际联系跳转，请在 `src/main.jsx` 的 `portfolio.contact` 中改为真实联系方式。

## 本地运行

```powershell
pnpm install
pnpm dev
```

若系统没有配置 Node / pnpm，可使用 Codex 内置运行时：

```powershell
$env:PATH='C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin;' + $env:PATH
pnpm dev
```

## 后续替换素材

当前人物视觉与项目封面为本地抽象占位素材，位于 `public/assets/`。提供真实头像、项目截图或视频后，可直接替换为正式素材。
