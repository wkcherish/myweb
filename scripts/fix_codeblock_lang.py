#!/usr/bin/env python3
"""
Fix incorrect code block language hints in markdown files under content/wiki/.

Normalizes common issues:
  - Uppercase language names -> lowercase (Bash->bash, Python->python, etc.)
  - "Plain Text" -> "text"
  - Any other all-alpha uppercase hints -> lowercase

Usage:
  python scripts/fix_codeblock_lang.py          # fix all files
  python scripts/fix_codeblock_lang.py --check  # dry-run, show what would change
  python scripts/fix_codeblock_lang.py <file>   # fix a single file
"""

import argparse
import re
import sys
from pathlib import Path

WIKI_DIR = Path(__file__).resolve().parent.parent / "content" / "wiki"

# Known hints mapped to their correct (lowercase) form
FIX_MAP: dict[str, str] = {
    # Case fixes
    "Bash": "bash",
    "BASH": "bash",
    "Python": "python",
    "PYTHON": "python",
    "YAML": "yaml",
    "Yaml": "yaml",
    "Js": "js",
    "JS": "js",
    "HTML": "html",
    "CSS": "css",
    "JSON": "json",
    "Xml": "xml",
    "XML": "xml",
    "Sql": "sql",
    "SQL": "sql",
    "Sh": "sh",
    "SH": "sh",
    "Shell": "shell",
    "SHELL": "shell",
    "PowerShell": "powershell",
    "Powershell": "powershell",
    "Dockerfile": "dockerfile",
    "Makefile": "makefile",
    "TypeScript": "typescript",
    "Typescript": "typescript",
    # Non-standard names
    "Plain Text": "text",
    "plain text": "text",
    "plaintext": "text",
}

# Matches ``` at start of line with optional lang hint and trailing content
FENCE_RE = re.compile(r"^(```)([^\S\n]*)(\S.*)?$", re.MULTILINE)


def fix_content(text: str, filepath: str = "") -> tuple[str, int]:
    """Fix code block hints in text. Returns (fixed_text, change_count)."""
    count = 0

    def replacer(m: re.Match) -> str:
        nonlocal count
        hint = m.group(3)
        if hint is None:
            return m.group(0)

        hint_stripped = hint.strip()
        corrected = FIX_MAP.get(hint_stripped)
        if corrected is not None:
            count += 1
            remainder = hint[len(hint_stripped):]
            return f"{m.group(1)}{corrected}{remainder}"

        # Catch-all: lowercase any all-alpha hint that has uppercase letters
        if hint_stripped.isalpha() and hint_stripped != hint_stripped.lower():
            count += 1
            remainder = hint[len(hint_stripped):]
            return f"{m.group(1)}{hint_stripped.lower()}{remainder}"

        return m.group(0)

    fixed = FENCE_RE.sub(replacer, text)
    return fixed, count


def process_file(filepath: Path, check_only: bool = False) -> int:
    """Fix a single file. Returns number of blocks changed."""
    original = filepath.read_text(encoding="utf-8")
    fixed, count = fix_content(original, str(filepath))

    if count and not check_only:
        filepath.write_text(fixed, encoding="utf-8")

    return count


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Fix incorrect code block language hints in markdown files."
    )
    parser.add_argument(
        "path", nargs="?", default=None,
        help="Single markdown file to fix (default: all .md under content/wiki/)",
    )
    parser.add_argument(
        "--check", action="store_true",
        help="Dry-run mode: show what would be fixed without writing",
    )
    args = parser.parse_args()

    if args.path:
        target = Path(args.path)
        if not target.exists():
            print(f"File not found: {args.path}", file=sys.stderr)
            sys.exit(1)
        md_files = [target]
    else:
        md_files = sorted(WIKI_DIR.rglob("*.md"))
        if not md_files:
            print(f"No markdown files found under {WIKI_DIR}", file=sys.stderr)
            sys.exit(1)

    total_blocks = 0
    files_changed = 0
    action = "Would fix" if args.check else "Fixed"

    for md in md_files:
        n = process_file(md, check_only=args.check)
        if n:
            rel = md.relative_to(Path.cwd())
            print(f"[{action}] {n:3d} block(s) in {rel}")
            total_blocks += n
            files_changed += 1

    print()
    print(f"{action} {total_blocks} code block(s) across {files_changed} file(s).")


if __name__ == "__main__":
    main()