# 飞书笔记图片迁移

这套脚本做两件事：

1. 扫描 `content/wiki/` 里的 Markdown，找出图片链接。
2. 按“文档创建时间-文档 id-序号”的规则下载图片，并生成可替换的 Markdown。

## 目录约定

- `content/wiki/`：你的飞书笔记 Markdown。
- `public/images/feishu/assets/`：下载后的本地图片（放在 `public/` 下，Nuxt 通过 `/images/feishu/assets/` 访问）。
- `public/images/feishu/manifest.json`：图片映射表。
- `public/images/feishu/*.zip`：图片和清单的压缩包。

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
public/images/feishu/assets/
```

如果只想下载新增笔记的图片，用 `--file` 指定文件或 `--skip-existing` 跳过已完成的：

```bash
# 文件名无空格时
npm run feishu:images -- --file=content/wiki/新笔记.md
# 文件名含空格时，必须用 = 语法，否则 shell 会拆开
npm run feishu:images -- --file="content/wiki/2025-01-09-Genesis AI项目.md"
npm run feishu:images -- --skip-existing
```

图片命名格式：

```text
YYYY-MM-DD-文档id-001.png
```

例如：

```text
2025-01-09-笔记-001.png
```

## 第三步：替换 content/wiki/ 里的图片链接

下载完成后，把 `content/wiki/` 里原文件的远程图片地址替换为本地路径：

```bash
node scripts/feishu-backup.mjs rewrite --inPlace
```

这样 `content/wiki/` 里的 Markdown 会直接改成：

```md
![](/images/feishu/assets/2025-01-09-笔记-001.png)
```

也可以只替换指定文件或跳过已替换的：

```bash
node scripts/feishu-backup.mjs rewrite --inPlace --file="content/wiki/新笔记.md"
node scripts/feishu-backup.mjs rewrite --inPlace --skip-existing
```

## 第四步：以后替换成腾讯云图片

等你把图片上传到腾讯云图库后，准备一个映射文件，例如：

```json
{
  "/images/feishu/assets/2025-01-09-笔记-001.png": "https://cdn.example.com/2025-01-09-笔记-001.png"
}
```

然后运行：

```bash
node scripts/feishu-backup.mjs rewrite --inPlace --cloudMap=public/images/feishu/cloud-map.json
```

这样 Markdown 会直接替换成腾讯云地址。

## 选择要处理的文件

默认会扫描 `--source` 目录下所有 Markdown。如果只想处理部分文件：

```bash
# 指定单个文件
node scripts/feishu-web-images.mjs --file content/wiki/新笔记.md

# 指定多个文件（逗号分隔）
node scripts/feishu-web-images.mjs --file "content/wiki/a.md,content/wiki/b.md"

# rewrite 也支持
node scripts/feishu-backup.mjs rewrite --file content/wiki/新笔记.md
```

## 跳过已处理的文件

如果已经爬取过一部分图片，想只处理新增的文件：

```bash
# 下载图片时，跳过图片已全部下载完成的文件
node scripts/feishu-web-images.mjs --skip-existing

# rewrite 时，跳过输出目录中已存在的文件
node scripts/feishu-backup.mjs rewrite --skip-existing
```

也可以简写为 `--skip`。

## 常用参数

```bash
# 下载图片
node scripts/feishu-web-images.mjs --source=content/wiki --out=public/images/feishu
node scripts/feishu-web-images.mjs --force
node scripts/feishu-web-images.mjs --skip-existing
node scripts/feishu-web-images.mjs --file="content/wiki/新笔记.md"

# 替换图片链接（直接改 content/wiki/ 原文件）
node scripts/feishu-backup.mjs rewrite --inPlace
node scripts/feishu-backup.mjs rewrite --inPlace --file="content/wiki/新笔记.md"
node scripts/feishu-backup.mjs rewrite --inPlace --skip-existing

# 替换为腾讯云地址
node scripts/feishu-backup.mjs rewrite --inPlace --cloudMap=public/images/feishu/cloud-map.json
```

## 说明

- `feishuId` 最好手动补上，这样文件名更稳定。
- 当前脚本先按你本地的 Markdown 做迁移，适合你先把飞书内容落到本地，再逐步切到腾讯云图片。
- 如果你后面要直接接飞书开放平台，我可以再把“自动拉取飞书文档列表和原始图片”的版本补上。
