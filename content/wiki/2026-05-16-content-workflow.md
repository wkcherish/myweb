---
title: 内容维护工作流
description: 博客、Wiki、Todo 和反思都通过本地 Markdown 维护，再由 Nuxt Content 读取生成静态页面。
category: 知识库
tags:
  - Content
  - 工作流
  - Markdown
---

# 内容维护工作流

这篇用于测试首页最新 Wiki 展示，也记录内容维护的固定流程。

## 标准流程

1. 在本地编辑 `content/` 下的 Markdown。
2. 运行本地预览，确认列表页和详情页都能读取。
3. 提交代码。
4. 执行构建或静态生成。
5. 部署生成后的静态资源。

## Frontmatter 约定

Wiki 文档至少包含 `title`、`description`、`category`、`tags`。笔记日期由文件名开头的 `YYYY-MM-DD` 自动解析，分类用于总览页聚合，标签用于后续搜索和关联推荐。

```yaml
title: 内容维护工作流
description: 记录只读内容从本地 Markdown 到静态页面的路径。
category: 知识库
tags:
  - Content
```

## 只读原则

网页端可以做搜索、筛选、目录跳转和复制链接，但不能把内容写回仓库。需要修改正文时，回到本地文件处理。

| 内容类型 | 目录 | 页面能力 |
| --- | --- | --- |
| Blog | `content/blog/` | 阅读、筛选、跳转 |
| Wiki | `content/wiki/` | 阅读、检索、目录 |
| Todo | `content/todo/` | 只读展示、筛选 |
