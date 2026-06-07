---
title: 8. 文件操作
description:
---

# 8. 文件操作

## 8.1 文件操作的意义

程序运行时，变量保存在内存中。程序结束后，内存数据通常会消失。文件可以把数据保存到磁盘，实现持久化。

常见文件类型：

1. `.txt`：普通文本。
2. `.csv`：表格文本。
3. `.json`：结构化数据。
4. `.log`：日志文件。
5. `.py`：Python 源代码。

## 8.2 路径

### 8.2.1 相对路径

相对当前运行目录：

```python
open("data.txt", "r", encoding="utf-8")
```

### 8.2.2 绝对路径

从根目录或盘符开始：

```python
open("/home/user/data.txt", "r", encoding="utf-8")
open("D:/data/data.txt", "r", encoding="utf-8")
```

Windows 路径建议写成：

```python
path = "D:/data/data.txt"
```

或原始字符串：

```python
path = r"D:\data\data.txt"
```

## 8.3 open函数

语法：

```python
file = open(文件路径, 打开模式, encoding="utf-8")
```

常见模式：

| 模式 | 说明 |
| --- | --- |
| `r` | 只读，文件不存在会报错 |
| `w` | 只写，文件不存在会创建，存在会清空 |
| `a` | 追加，文件不存在会创建 |
| `rb` | 二进制只读 |
| `wb` | 二进制只写 |

## 8.4 读取文件

### 8.4.1 read

一次读取全部内容：

```python
file = open("data.txt", "r", encoding="utf-8")
content = file.read()
print(content)
file.close()
```

可以指定读取字符数：

```python
content = file.read(10)
```

### 8.4.2 readline

一次读取一行：

```python
file = open("data.txt", "r", encoding="utf-8")

line = file.readline()
print(line)

file.close()
```

### 8.4.3 readlines

读取所有行，返回列表：

```python
file = open("data.txt", "r", encoding="utf-8")
lines = file.readlines()
print(lines)
file.close()
```

每一行通常带有换行符，可以用 `strip()` 去掉：

```python
for line in lines:
    print(line.strip())
```

### 8.4.4 直接遍历文件对象

推荐读取大文件时使用：

```python
file = open("data.txt", "r", encoding="utf-8")

for line in file:
    print(line.strip())

file.close()
```

## 8.5 with语句

`with` 会自动关闭文件，推荐使用。

```python
with open("data.txt", "r", encoding="utf-8") as file:
    content = file.read()
    print(content)
```

等价于打开文件、读取、最后关闭，但更安全。

## 8.6 写入文件

`w` 模式会清空原文件。

```python
with open("data.txt", "w", encoding="utf-8") as file:
    file.write("hello\n")
    file.write("python\n")
```

写入多行：

```python
lines = ["小明,18\n", "小红,17\n", "小刚,19\n"]

with open("students.txt", "w", encoding="utf-8") as file:
    file.writelines(lines)
```

## 8.7 追加文件

`a` 模式不会清空原内容，而是在末尾追加。

```python
with open("log.txt", "a", encoding="utf-8") as file:
    file.write("程序启动\n")
```

日志类文件常用追加模式。

## 8.8 文件编码

编码决定文字如何保存为字节。

常见编码：

1. UTF-8：推荐。
2. GBK：部分 Windows 中文文件常见。

读取文件乱码时，可以尝试：

```python
with open("data.txt", "r", encoding="gbk") as file:
    content = file.read()
```

写文件时建议统一 UTF-8：

```python
with open("data.txt", "w", encoding="utf-8") as file:
    file.write("中文内容")
```

## 8.9 pathlib

`pathlib` 是现代 Python 推荐的路径处理方式。

```python
from pathlib import Path

path = Path("data") / "students.txt"
print(path)
```

创建目录：

```python
from pathlib import Path

data_dir = Path("data")
data_dir.mkdir(exist_ok=True)
```

判断文件是否存在：

```python
path = Path("data/students.txt")

if path.exists():
    print("文件存在")
```

读写文本：

```python
path = Path("data.txt")

path.write_text("hello python", encoding="utf-8")
content = path.read_text(encoding="utf-8")
print(content)
```

## 8.10 JSON文件

JSON 是常见的数据交换格式，适合保存列表、字典这类结构化数据。

```python
import json

student = {
    "name": "小明",
    "age": 18,
    "score": 95
}

text = json.dumps(student, ensure_ascii=False, indent=2)
print(text)
```

写入 JSON 文件：

```python
import json

students = [
    {"name": "小明", "age": 18, "score": 95},
    {"name": "小红", "age": 17, "score": 88},
]

with open("students.json", "w", encoding="utf-8") as file:
    json.dump(students, file, ensure_ascii=False, indent=2)
```

读取 JSON 文件：

```python
import json

with open("students.json", "r", encoding="utf-8") as file:
    students = json.load(file)

print(students)
```

## 8.11 CSV文件

CSV 是逗号分隔值，常用于表格数据。

写入 CSV：

```python
import csv

students = [
    ["姓名", "年龄", "成绩"],
    ["小明", 18, 95],
    ["小红", 17, 88],
]

with open("students.csv", "w", encoding="utf-8", newline="") as file:
    writer = csv.writer(file)
    writer.writerows(students)
```

读取 CSV：

```python
import csv

with open("students.csv", "r", encoding="utf-8") as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)
```

使用字典写入：

```python
import csv

students = [
    {"name": "小明", "age": 18, "score": 95},
    {"name": "小红", "age": 17, "score": 88},
]

with open("students.csv", "w", encoding="utf-8", newline="") as file:
    fieldnames = ["name", "age", "score"]
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(students)
```

## 8.12 小案例：文本词频统计

需求：

1. 读取文本文件。
2. 统计每个单词出现次数。
3. 输出出现次数最多的前 10 个单词。

代码：

```python
from pathlib import Path

path = Path("article.txt")
content = path.read_text(encoding="utf-8")

words = content.lower().split()
counter = {}

for word in words:
    word = word.strip(".,!?;:\"'()[]")
    if not word:
        continue
    counter[word] = counter.get(word, 0) + 1

items = sorted(counter.items(), key=lambda item: item[1], reverse=True)

for word, count in items[:10]:
    print(word, count)
```

## 8.13 小案例：学生信息持久化

```python
import json
from pathlib import Path

DATA_FILE = Path("students.json")


def load_students():
    if not DATA_FILE.exists():
        return []

    with open(DATA_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def save_students(students):
    with open(DATA_FILE, "w", encoding="utf-8") as file:
        json.dump(students, file, ensure_ascii=False, indent=2)


students = load_students()
students.append({"name": "小明", "age": 18, "score": 95})
save_students(students)
print("保存成功")
```

## 8.14 易错点

1. `w` 模式会清空原文件。
2. 读写中文要指定 `encoding="utf-8"`。
3. 打开文件后要关闭，推荐使用 `with`。
4. 读取大文件不要直接 `read()` 全部内容。
5. Windows 写 CSV 时建议加 `newline=""`，避免空行。
6. JSON 只能保存基础数据类型，不能直接保存函数、文件对象等。

## 8.15 本章练习

1. 写入一个 `students.txt`，每行保存一个学生姓名。
2. 读取 `students.txt` 并输出所有学生。
3. 把学生列表保存为 JSON 文件。
4. 从 JSON 文件读取学生数据，计算平均分。
5. 写一个日志函数 `write_log(message)`，每次调用向 `app.log` 追加一行。

