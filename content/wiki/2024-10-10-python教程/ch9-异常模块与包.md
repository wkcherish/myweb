---
title: 9. 异常、模块与包
description:
---

# 9. 异常、模块与包

## 9.1 什么是异常

异常是程序运行过程中出现的错误。

常见异常：

| 异常 | 说明 |
| --- | --- |
| `NameError` | 使用了未定义变量 |
| `TypeError` | 类型不匹配 |
| `ValueError` | 值不合法 |
| `IndexError` | 列表索引越界 |
| `KeyError` | 字典 key 不存在 |
| `FileNotFoundError` | 文件不存在 |
| `ZeroDivisionError` | 除数为 0 |
| `ImportError` | 导入失败 |

示例：

```python
num = int("abc")
```

会触发 `ValueError`。

## 9.2 为什么要处理异常

如果不处理异常，程序会直接终止。

例如用户输入年龄：

```python
age = int(input("请输入年龄:"))
print(age)
```

用户输入 `abc`，程序就会报错退出。

异常处理可以让程序在出错时给出友好提示，并继续运行。

## 9.3 try except

基础语法：

```python
try:
    可能出错的代码
except:
    出错后的处理代码
```

示例：

```python
try:
    age = int(input("请输入年龄:"))
    print(age)
except:
    print("年龄必须是数字")
```

不建议裸写 `except`，最好指定异常类型。

```python
try:
    age = int(input("请输入年龄:"))
    print(age)
except ValueError:
    print("年龄必须是数字")
```

## 9.4 捕获多个异常

```python
try:
    nums = [1, 2, 3]
    index = int(input("请输入索引:"))
    print(nums[index])
except ValueError:
    print("索引必须是整数")
except IndexError:
    print("索引越界")
```

多个异常使用相同处理逻辑：

```python
try:
    num = int(input("请输入数字:"))
    print(10 / num)
except (ValueError, ZeroDivisionError):
    print("输入不合法")
```

## 9.5 获取异常信息

```python
try:
    num = int("abc")
except ValueError as e:
    print(f"出错了:{e}")
```

输出：

```text
出错了:invalid literal for int() with base 10: 'abc'
```

## 9.6 else和finally

`else`：没有异常时执行。

`finally`：无论是否异常都会执行。

```python
try:
    num = int(input("请输入数字:"))
except ValueError:
    print("输入错误")
else:
    print(f"输入正确:{num}")
finally:
    print("程序结束")
```

`finally` 常用于释放资源，如关闭文件、关闭网络连接。

## 9.7 抛出异常

程序可以主动抛出异常。

```python
def set_age(age):
    if age < 0:
        raise ValueError("年龄不能为负数")
    print(f"年龄:{age}")


set_age(-1)
```

调用者可以捕获：

```python
try:
    set_age(-1)
except ValueError as e:
    print(e)
```

## 9.8 自定义异常

```python
class BalanceNotEnoughError(Exception):
    pass


def withdraw(balance, money):
    if money > balance:
        raise BalanceNotEnoughError("余额不足")
    return balance - money


try:
    balance = withdraw(100, 200)
except BalanceNotEnoughError as e:
    print(e)
```

入门阶段大多数情况使用内置异常即可。

## 9.9 traceback

调试时可以输出完整异常堆栈。

```python
import traceback

try:
    int("abc")
except ValueError:
    traceback.print_exc()
```

日志系统中常把异常堆栈记录到文件。

## 9.10 什么是模块

模块就是一个 `.py` 文件。

例如创建 `my_math.py`：

```python
def add(a, b):
    return a + b


def sub(a, b):
    return a - b
```

在另一个文件中导入：

```python
import my_math

print(my_math.add(1, 2))
```

## 9.11 import导入

### 9.11.1 导入模块

```python
import random

print(random.randint(1, 10))
```

### 9.11.2 导入指定内容

```python
from random import randint

print(randint(1, 10))
```

### 9.11.3 起别名

```python
import random as rd

print(rd.randint(1, 10))
```

```python
from random import randint as rint

print(rint(1, 10))
```

### 9.11.4 不推荐星号导入

```python
from random import *
```

这种写法会让当前文件多出很多名字，容易冲突，不利于阅读。

## 9.12 常用内置模块

### 9.12.1 random

```python
import random

print(random.randint(1, 10))
print(random.choice(["小明", "小红", "小刚"]))
print(random.sample([1, 2, 3, 4, 5], 2))
```

### 9.12.2 time

```python
import time

print(time.time())
time.sleep(1)
print("1秒后执行")
```

### 9.12.3 datetime

```python
from datetime import datetime

now = datetime.now()
print(now)
print(now.strftime("%Y-%m-%d %H:%M:%S"))
```

### 9.12.4 os

```python
import os

print(os.getcwd())
print(os.listdir("."))
```

### 9.12.5 sys

```python
import sys

print(sys.version)
print(sys.path)
```

## 9.13 if __name__ == "__main__"

模块被直接运行和被导入时，`__name__` 的值不同。

创建 `my_module.py`：

```python
def add(a, b):
    return a + b


if __name__ == "__main__":
    print(add(1, 2))
```

作用：

1. 直接运行该文件时，执行测试代码。
2. 被其他文件导入时，不执行测试代码。

这是写模块时很常用的习惯。

## 9.14 包

包是包含 `__init__.py` 的目录，用于组织多个模块。

目录结构：

```text
project/
  main.py
  utils/
    __init__.py
    file_utils.py
    string_utils.py
```

导入：

```python
from utils.file_utils import read_file
```

`__init__.py` 可以为空，也可以写包初始化逻辑。

## 9.15 第三方包

第三方包通过 `pip` 安装。

```bash
pip install requests
```

使用：

```python
import requests

response = requests.get("https://www.example.com")
print(response.status_code)
```

查看已安装包：

```bash
pip list
```

导出项目依赖：

```bash
pip freeze > requirements.txt
```

安装项目依赖：

```bash
pip install -r requirements.txt
```

## 9.16 模块搜索路径

Python 导入模块时会在 `sys.path` 中查找。

```python
import sys

for path in sys.path:
    print(path)
```

优先查找当前运行目录，所以文件名不要和标准库同名。

错误示例：

```text
random.py
json.py
time.py
```

这些文件名可能导致导入异常。

## 9.17 小案例：工具包拆分

目录结构：

```text
student_system/
  main.py
  services/
    __init__.py
    student_service.py
  utils/
    __init__.py
    file_utils.py
```

`utils/file_utils.py`：

```python
import json
from pathlib import Path


def read_json(path):
    path = Path(path)
    if not path.exists():
        return []

    with open(path, "r", encoding="utf-8") as file:
        return json.load(file)


def write_json(path, data):
    with open(path, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=2)
```

`main.py`：

```python
from utils.file_utils import read_json, write_json

students = read_json("students.json")
students.append({"name": "小明", "score": 95})
write_json("students.json", students)
```

## 9.18 易错点

1. 异常处理不要把所有错误都吞掉，至少要输出提示。
2. 能指定异常类型就不要裸写 `except`。
3. `finally` 无论是否出错都会执行。
4. 模块文件名不要和标准库重名。
5. 导入自己写的模块时，要注意运行目录。
6. 第三方包要安装到当前解释器或虚拟环境中。

## 9.19 本章练习

1. 写一个安全输入整数函数，输入错误时提示并重新输入。
2. 写函数读取文件，如果文件不存在则返回空字符串。
3. 创建 `math_utils.py`，实现加减乘除函数并导入使用。
4. 创建一个 `utils` 包，把 JSON 读写函数放进去。
5. 写一个程序，捕获除零异常和输入格式异常。

