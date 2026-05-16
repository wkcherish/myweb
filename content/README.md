# Content Maintenance

正式内容只通过本地文件维护，网页端只负责读取和展示。

- 博客与 Wiki 使用 Markdown 文件。
- Todo 第一版使用 Markdown 文件。
- 网页端不提供新增、编辑、删除、发布等正式内容写入能力。

## 新增内容流程

1. 在本地编辑 `content/blog/`、`content/wiki/` 或 `content/todo/` 中的 Markdown 文件。
2. 为文件补齐 frontmatter。
3. 运行 `npm run dev` 预览列表页和详情页。
4. 运行 `npm run generate` 检查静态生成。
5. 提交代码并部署 `.output/public`。

## 文件命名

Markdown 文件名使用 `YYYY-MM-DD-笔记名.md`，页面日期从文件名开头自动解析。例如：

- `content/blog/2026-05-16-nuxt-notebook.md`
- `content/wiki/2025-01-09-Genesis AI项目参考文档.md`
- `content/todo/2026-05-16-home-polish.md`

## Frontmatter

博客文章包含 `title`、`description`、`tags`、`category`、`draft`。

Wiki 文档包含 `title`、`description`、`category`、`tags`。

Todo 文档包含 `title`、`description`、`status`、`priority`、`targetDate`、`tags`。
