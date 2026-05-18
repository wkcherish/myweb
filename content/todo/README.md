# Todo Content

此目录存放 Todo 路线图内容（Markdown 或 JSON），网页端仅展示，不做在线写入。

## Frontmatter 示例

```yaml
---
title: 修复笔记章节问题
description: 优化移动端笔记目录和章节展示问题
status: in-progress
priority: high
targetDate: 2026-05-18
---
```

## Status 对应关系

`status` 必须使用英文值：

| status | 页面显示 |
| --- | --- |
| `planned` | 计划中 |
| `in-progress` | 进行中 |
| `done` | 已完成 |
| `paused` | 搁置 |

## Priority 对应关系

`priority` 必须使用英文值：

| priority | 页面显示 |
| --- | --- |
| `high` | 高优先级 |
| `medium` | 中优先级 |
| `low` | 低优先级 |
