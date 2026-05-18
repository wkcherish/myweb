# fix_codeblock_lang.py — 修复 Markdown 代码块语言提示

## 功能

批量修复 `content/wiki/` 下所有 markdown 笔记中不规范的代码块语言提示，确保语法高亮正常工作。

**修复内容：**

| 问题 | 示例 | 修复 |
|------|------|------|
| 大写语言名 | ` ```Bash` ` ```Python` ` ```YAML` | ` ```bash` ` ```python` ` ```yaml` |
| 非标准提示 | ` ```Plain Text` | ` ```text` |
| 任意大写全字母提示 | ` ```SH` ` ```SQL` | ` ```sh` ` ```sql` |

## 用法

```bash
# 修复 content/wiki/ 下所有 markdown 文件
python scripts/fix_codeblock_lang.py

# 仅预览，不实际写入
python scripts/fix_codeblock_lang.py --check

# 修复单个文件
python scripts/fix_codeblock_lang.py content/wiki/2025-12-01-lerobot101-act算法复现.md
```

## 原理

脚本用正则匹配 markdown 中以 ` ``` ` 开头的代码块起始行，提取语言提示，在映射表中查找对应的规范写法并替换。对于映射表中没有的全大写/首字母大写 alpha 提示，做通用小写化处理。

只修改代码块的**起始行**，不会触碰代码块内容和结束标记。

## 映射表

脚本内置了常见不规范提示到规范提示的映射，涵盖：

- 大小写修正：`Bash/BASH` → `bash`、`Python/PYTHON` → `python`、`YAML/Yaml` → `yaml`、`JS` → `js`、`HTML` → `html`、`CSS` → `css`、`JSON` → `json`、`SQL/Sql` → `sql`、`SH/Sh` → `sh`、`Shell/SHELL` → `shell`、`PowerShell/Powershell` → `powershell` 等
- 非标准名称修正：`Plain Text/plain text/plaintext` → `text`
- 通用规则：任意全字母大写提示自动转为小写