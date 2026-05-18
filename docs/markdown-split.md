# Markdown 笔记章节拆分

将一整篇 Markdown 笔记按最高级标题拆分为多个小章节文件，生成与 `content/wiki/2025-12-04-强化学习/` 一致的目录结构。

## 目录约定

- `split_markdown.py`：拆分脚本，放在项目根目录。
- `content/wiki/`：存放待拆分的笔记和拆分后的目录。

## 拆分规则

1. **自动检测最高标题级别** — 扫描文档找到 `#` 最少的那一级标题，按该级别拆分。如果文档最高只用 `##`，就按 `##` 拆；用 `#` 就按 `#` 拆。
2. **序号重新编排** — 不论原标题里的序号是什么格式（`1.`、`1-`、`一、`、甚至没有序号），文件名统一按出现顺序编号 `ch1-`、`ch2-`、`ch3-`...
3. **preamble 不丢失** — 第一个标题之前、frontmatter 之下的前言内容，会合并到第一章开头。
4. **子标题跟随父章节** — 比拆分级别更低的标题（如 `###`）留在所属章节内，不会被单独拆出。
5. **index.md 仅保留 frontmatter** — 拆分后生成的 `index.md` 只包含原文档的 frontmatter 元数据。

## 用法

```bash
python split_markdown.py <markdown文件路径>
```

### 示例

```bash
# 拆分单篇笔记
python split_markdown.py "content/wiki/2025-01-09-Genesis-AI项目.md"
```

输入文件 `content/wiki/2025-01-09-Genesis-AI项目.md`：

```markdown
---
title: Genesis AI项目
description: 项目简介...
category: 具身智能
---

项目简介：Genesis是一个开源的生成式物理引擎...

# 1.Ubuntu环境配置

1.  ubuntu环境换源
2.  安装cuda
...

# 2.Genesis 报错issue

参考链接：...
```

拆分后生成目录 `content/wiki/2025-01-09-Genesis-AI项目/`：

```text
2025-01-09-Genesis-AI项目/
├── index.md                    # 仅包含 frontmatter
├── ch1-Ubuntu环境配置.md        # # 1.Ubuntu环境配置 + preamble
├── ch2-Genesis 报错issue.md     # # 2.Genesis 报错issue
└── ch3-Genesis 项目运行结果.md   # # 3.Genesis 项目运行结果
```

### `##` 级标题拆分

如果整篇文档最高只用到 `##`，脚本自动适配：

```markdown
---
title: 测试文档
---

一些前言内容。

## 1.第一章节

第一章内容。

### 子标题

子内容。

## 2.第二章节

第二章内容。
```

拆分结果：

```text
测试文档/
├── index.md
├── ch1-第一章节.md    # 前言 + ## 1.第一章节 + 子内容
└── ch2-第二章节.md    # ## 2.第二章节
```

## 注意事项

- 输入文件必须是 `.md` 后缀。
- 如果文档没有任何标题，脚本会报错退出。
- 输出目录与输入文件同名（去掉 `.md`），放在同一级目录下。
- 如果输出目录已存在，会直接覆盖其中的同名文件。
- 文件名中的非法字符（`/` `\` `:` `*` `?` `"` `<` `>` `|`）会被自动清理或替换。
