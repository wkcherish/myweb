---
title: Nuxt 个人站搭建记录
description: 记录这个个人 Notebook 从首页视觉、内容目录到静态生成的搭建过程。
tags:
  - Nuxt
  - 个人网站
  - 静态生成
category: 开发记录
draft: false
---

# Nuxt 个人站搭建记录

这篇用于测试首页最新博客展示，也作为博客长文样式的基准。正式内容只从本地 Markdown 进入站点，网页端只负责阅读、筛选和跳转。

## 为什么先做内容目录

内容目录是整个站点的边界。它决定哪些东西是正式内容，哪些只是浏览偏好。这个站点的第一版不做在线编辑后台，因此文章、知识库和规划都要回到 `content/` 目录维护。

> 如果页面上出现能修改正式内容的按钮，就说明边界被破坏了。

## 当前约定

- 博客文章放在 `content/blog/`。
- Wiki 文档放在 `content/wiki/`。
- Todo 规划放在 `content/todo/`。
- 每个文件都使用 Markdown frontmatter 描述标题、摘要、标签和日期。

## 示例代码块

```ts
export const getReadingTime = (text: string) => {
  const words = text.trim().split(/\s+/).filter(Boolean).length

  return Math.max(1, Math.ceil(words / 260))
}
```

## 检查表

| 项目 | 状态 | 备注 |
| --- | --- | --- |
| Markdown 示例 | 已补充 | 覆盖标题、列表、引用、代码和表格 |
| 只读边界 | 已确认 | 页面不提供写入入口 |
| 静态生成 | 待验证 | 阶段完成后运行 `npm run generate` |
