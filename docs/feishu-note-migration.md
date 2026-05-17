# 飞书笔记图片迁移

这套脚本做两件事：

1. 扫描 `content/wiki/` 里的 Markdown，找出图片链接。
2. 按“文档创建时间-文档 id-序号”的规则下载图片，并生成可替换的 Markdown。

## 目录约定

- `content/wiki/`：你的飞书笔记 Markdown。
- `feishu-images/assets/`：下载后的本地图片。
- `feishu-images/manifest.json`：图片映射表。
- `feishu-images/markdown/`：替换过图片地址的 Markdown。
- `feishu-images/*.zip`：图片和清单的压缩包。

## 第一步：准备 Markdown

先把飞书笔记导出或整理成 Markdown，放进 `content/wiki/`。

建议每篇笔记的 frontmatter 里至少保留：

```md
---
title: 笔记标题
date: 2025-01-09
feishuId: 你的文档ID
---
```

如果没有 `feishuId`，脚本会退回用文件名当作 id。

## 第二步：下载图片

运行：

```bash
npm run feishu:images
```

默认会扫描 `content/wiki/`，把图片保存到：

```text
feishu-images/assets/
```

图片命名格式：

```text
YYYY-MM-DD-文档id-001.png
```

例如：

```text
2025-01-09-笔记-001.png
```

## 第三步：生成可发布 Markdown

运行：

```bash
node scripts/feishu-backup.mjs rewrite
```

默认输出到：

```text
feishu-images/markdown/
```

这个目录里的 Markdown 会把原图片地址替换成本地路径：

```md
![](/images/feishu/2025-01-09-笔记-001.png)
```

## 第四步：以后替换成腾讯云图片

等你把图片上传到腾讯云图库后，准备一个映射文件，例如：

```json
{
  "/images/feishu/2025-01-09-笔记-001.png": "https://cdn.example.com/2025-01-09-笔记-001.png"
}
```

然后运行：

```bash
node scripts/feishu-backup.mjs rewrite --cloudMap feishu-images/cloud-map.json
```

这样 Markdown 会直接替换成腾讯云地址。

## 常用参数

```bash
node scripts/feishu-web-images.mjs --source content/wiki --out feishu-images
node scripts/feishu-web-images.mjs --force
node scripts/feishu-backup.mjs rewrite --source content/wiki --out feishu-images/markdown
node scripts/feishu-backup.mjs rewrite --inPlace
```

## 说明

- `feishuId` 最好手动补上，这样文件名更稳定。
- 当前脚本先按你本地的 Markdown 做迁移，适合你先把飞书内容落到本地，再逐步切到腾讯云图片。
- 如果你后面要直接接飞书开放平台，我可以再把“自动拉取飞书文档列表和原始图片”的版本补上。
