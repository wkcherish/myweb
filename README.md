# Cherish Notebook

一个基于 Nuxt 4 的个人知识库与博客站点，用来记录学习、开发、生活笔记，以及 Todo 和一些静态页面。

## 特性

- 博客、Wiki、Todo 都由本地 Markdown 文件维护
- 站点使用 Nuxt Content 渲染内容
- 支持静态生成与预渲染
- 包含首页、博客、Wiki、Todo、About、Resume、Links、Analytics 等页面

## 开发

```bash
npm install
npm run dev
```

开发服务器默认运行在 `http://localhost:5176`。

## 构建

```bash
npm run build
```

静态输出位于 `.output/public`。

## 预览

```bash
npm run preview
```

## 目录结构

```text
app/        前端页面、组件、布局和样式
content/    Markdown 内容
public/     静态资源
server/     服务端 API
scripts/    维护脚本
docs/       说明文档
```

## 内容维护

正式内容只通过本地文件维护，网页端不提供新增、编辑、删除等写入能力。具体规则见 [content/README.md](content/README.md)。

## 常用脚本

- `npm run dev`  启动开发环境
- `npm run build`  构建站点
- `npm run generate`  生成静态站点
- `npm run preview`  本地预览构建结果
- `npm run feishu:images`  处理飞书网页图片
- `npm run feishu:rewrite`  重写飞书备份内容

