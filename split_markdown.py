#!/usr/bin/env python3
"""
将 markdown 笔记按最高级标题拆分为小章节（自动检测 # 级别）。

用法:
    python split_markdown.py <markdown文件路径>

示例:
    python split_markdown.py "content/wiki/2025-01-09-Genesis-AI项目.md"

效果:
    输入文件: content/wiki/2025-01-09-Genesis-AI项目.md
    生成目录: content/wiki/2025-01-09-Genesis-AI项目/
        ├── index.md          (仅包含 frontmatter)
        ├── ch1-Ubuntu环境配置.md
        ├── ch2-Genesis报错issue.md
        └── ...
"""

import re
import sys
import os
from pathlib import Path


def parse_frontmatter_and_body(text: str) -> tuple[list[str], str]:
    """解析 frontmatter 和正文。返回 (frontmatter_lines, body)。"""
    text = text.strip()
    if not text.startswith("---"):
        return [], text

    parts = text.split("---", 2)
    if len(parts) < 3:
        return [], text

    fm_lines = parts[1].strip().split("\n")
    body = parts[2].strip()
    return fm_lines, body


def detect_top_heading_level(body: str) -> int:
    """检测正文中最高标题级别（# 数量最少）。没有标题则返回 None。"""
    headings = re.findall(r"^(#+)\s", body, re.MULTILINE)
    if not headings:
        return None
    return min(len(h) for h in headings)


def clean_title(heading_text: str) -> str:
    """从标题文本中提取干净的章节名，去掉可能的前置序号。"""
    # 去掉开头的序号如 "1." "1-" "1、" "一、" "一." 等
    cleaned = re.sub(r"^[\d一二三四五六七八九十]+[.\-、\s]+", "", heading_text)
    return cleaned.strip()


def split_chapters(body: str) -> list[tuple[str, str, str]]:
    """
    检测正文最高标题级别，按该级别拆分。
    返回 [(seq_number, cleaned_title, chapter_content), ...]
    seq_number 是按出现顺序的序号（1, 2, 3...）。
    """
    top_level = detect_top_heading_level(body)
    if top_level is None:
        return []

    prefix = "#" * top_level
    # 匹配该级别的所有标题行
    heading_pattern = re.compile(rf"^{prefix}\s+(.+)", re.MULTILINE)

    matches = list(heading_pattern.finditer(body))
    if not matches:
        return []

    chapters = []
    for i, m in enumerate(matches):
        raw_title = m.group(1).strip()
        title = clean_title(raw_title)
        seq = str(i + 1)
        start = m.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(body)
        content = body[start:end].strip()

        # 第一个章节：把前面孤立的 preamble 内容拼到章节内容前面
        if i == 0 and start > 0:
            preamble = body[:start].strip()
            if preamble:
                content = preamble + "\n\n" + content

        chapters.append((seq, title, content))

    return chapters


def sanitize_filename(name: str) -> str:
    """清理文件名中的非法字符。"""
    # 移除或替换不适合作为文件名的字符
    name = name.replace("/", " ").replace("\\", " ").replace(":", "：")
    name = name.replace("*", "").replace("?", "").replace('"', "")
    name = name.replace("<", "").replace(">", "").replace("|", "")
    return " ".join(name.split())  # 合并多余空格


def split_markdown(input_path: str) -> str:
    """主逻辑：拆分 markdown 文件，返回输出目录路径。"""
    file_path = Path(input_path).resolve()

    if not file_path.exists():
        print(f"错误: 文件不存在 — {file_path}")
        sys.exit(1)

    if file_path.suffix != ".md":
        print(f"错误: 文件不是 .md 格式 — {file_path}")
        sys.exit(1)

    # 目录名 = 输入文件名去掉 .md
    dir_name = file_path.stem
    output_dir = file_path.parent / dir_name

    # 读取文件
    text = file_path.read_text(encoding="utf-8")

    # 解析 frontmatter 和正文
    fm_lines, body = parse_frontmatter_and_body(text)

    # 按一级标题拆分
    chapters = split_chapters(body)

    if not chapters:
        print(f"警告: 未找到任何标题，无法拆分")
        sys.exit(1)

    # 创建输出目录
    output_dir.mkdir(parents=True, exist_ok=True)
    print(f"创建目录: {output_dir}")

    # 写入 index.md（仅含 frontmatter）
    if fm_lines:
        index_content = "---\n" + "\n".join(fm_lines) + "\n---\n"
    else:
        title = file_path.stem
        index_content = f"---\ntitle: {title}\ndescription: \ncategory: \n---\n"

    index_path = output_dir / "index.md"
    index_path.write_text(index_content, encoding="utf-8")
    print(f"  写入: index.md")

    # 写入各章节
    for num, title, content in chapters:
        safe_title = sanitize_filename(title)
        ch_filename = f"ch{num}-{safe_title}.md"
        ch_path = output_dir / ch_filename
        ch_path.write_text(content + "\n", encoding="utf-8")
        print(f"  写入: {ch_filename}")

    print(f"\n拆分完成，共 {len(chapters)} 个章节。")
    print(f"输出目录: {output_dir}")
    return str(output_dir)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    split_markdown(sys.argv[1])
