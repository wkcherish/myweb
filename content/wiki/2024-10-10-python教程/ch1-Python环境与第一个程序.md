---
title: 1. Python环境与第一个程序
description:
---

# 1. Python环境与第一个程序

## 1.1 什么是Python

Python 是一种解释型、高级、通用编程语言。它的语法接近自然语言，适合做自动化脚本、数据处理、Web 后端、人工智能、爬虫、测试工具、运维工具和教学入门。

理解 Python 时抓住三个关键词：

1. 解释型：代码通常由解释器一行行执行，不需要像 C/C++ 那样先手动编译出可执行文件。
2. 动态类型：变量不用提前声明类型，运行时根据赋值对象确定类型。
3. 标准库丰富：安装 Python 后自带很多模块，如 `os`、`sys`、`json`、`random`、`datetime`。

Python 程序的运行链路：

```text
编写 .py 文件 -> Python 解释器读取代码 -> 转换为字节码 -> 虚拟机执行 -> 输出结果
```

## 1.2 Python解释器

解释器就是运行 Python 代码的软件。终端中常用命令如下：

```bash
python --version
python3 --version
python
python3
```

进入交互模式后，可以直接输入表达式：

```python
>>> 1 + 2
3
>>> print("hello python")
hello python
```

退出交互模式：

```python
exit()
```

或使用快捷键：

```text
Windows: Ctrl + Z 然后回车
macOS/Linux: Ctrl + D
```

## 1.3 安装Python

### 1.3.1 Windows安装

1. 打开 Python 官网：https://www.python.org/downloads/
2. 下载 Windows Installer。
3. 安装时勾选 `Add Python to PATH`。
4. 点击 `Install Now`。
5. 安装完成后打开命令提示符验证：

```bash
python --version
pip --version
```

如果提示 `python 不是内部或外部命令`，通常是 PATH 没配置好。可以重新安装并勾选 PATH，或在系统环境变量中加入 Python 安装目录。

### 1.3.2 macOS安装

macOS 自带的 Python 版本可能不适合开发，建议安装新版：

```bash
brew install python
python3 --version
pip3 --version
```

如果没有 Homebrew，可以直接从 Python 官网下载 macOS 安装包。

### 1.3.3 Linux安装

Ubuntu/Debian：

```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
python3 --version
pip3 --version
```

Fedora：

```bash
sudo dnf install python3 python3-pip
```

Linux 上通常使用 `python3` 命令，避免和系统旧版本 Python 冲突。

## 1.4 pip包管理器

`pip` 用来安装第三方库。

```bash
pip install requests
pip uninstall requests
pip show requests
pip list
pip freeze
```

国内网络较慢时可以临时使用镜像：

```bash
pip install requests -i https://pypi.tuna.tsinghua.edu.cn/simple
```

常见第三方库：

| 库 | 作用 |
| --- | --- |
| requests | 网络请求 |
| numpy | 数值计算 |
| pandas | 表格数据处理 |
| matplotlib | 绘图 |
| pyecharts | ECharts 图表 |
| flask | Web 后端 |
| pytest | 自动化测试 |

## 1.5 虚拟环境

虚拟环境用于隔离不同项目的依赖。一个项目需要 `pyecharts==2.x`，另一个项目需要别的版本，直接全局安装容易冲突，所以建议每个项目创建自己的虚拟环境。

创建虚拟环境：

```bash
python -m venv .venv
```

Windows 激活：

```bash
.venv\Scripts\activate
```

macOS/Linux 激活：

```bash
source .venv/bin/activate
```

退出虚拟环境：

```bash
deactivate
```

保存依赖：

```bash
pip freeze > requirements.txt
```

安装依赖：

```bash
pip install -r requirements.txt
```

## 1.6 开发工具

### 1.6.1 PyCharm

PyCharm 适合新手，因为运行按钮、项目解释器、文件结构都比较直观。

常用操作：

1. New Project：创建项目。
2. Add Interpreter：选择 Python 解释器或虚拟环境。
3. New Python File：创建 `.py` 文件。
4. Run：运行当前文件。
5. Debug：断点调试。

### 1.6.2 VS Code

VS Code 轻量，适合后续多语言开发。

建议安装插件：

1. Python。
2. Pylance。
3. Jupyter。

选择解释器：

```text
Ctrl + Shift + P -> Python: Select Interpreter
```

## 1.7 第一个Python程序

创建文件 `hello.py`：

```python
print("Hello World")
print("你好，Python")
```

在终端运行：

```bash
python hello.py
```

或：

```bash
python3 hello.py
```

输出：

```text
Hello World
你好，Python
```

## 1.8 print函数

`print()` 用来输出内容。

```python
print("hello")
print(100)
print(3.14)
print("年龄:", 18)
```

多个内容用逗号隔开，默认中间加空格：

```python
name = "张三"
age = 18
print("姓名:", name, "年龄:", age)
```

修改分隔符：

```python
print("2024", "10", "10", sep="-")
```

修改结尾符：

```python
print("hello", end=" ")
print("python")
```

## 1.9 脚本运行和交互运行

交互运行适合临时验证：

```python
>>> 10 * 3
30
```

脚本运行适合保存程序：

```python
price = 8
count = 5
print(price * count)
```

实际学习中推荐：

1. 临时试一个语法，用交互模式。
2. 写完整练习，用 `.py` 文件。
3. 写项目，用独立目录和虚拟环境。

## 1.10 常见错误

### 1.10.1 命令找不到

```text
python: command not found
```

原因：

1. 没安装 Python。
2. PATH 没配置。
3. Linux/macOS 应该使用 `python3`。

### 1.10.2 文件名冲突

不要把文件命名为：

```text
random.py
json.py
time.py
requests.py
```

这些名字可能和标准库或第三方库冲突，导致导入模块异常。

### 1.10.3 中文乱码

Python 3 默认源文件编码是 UTF-8。仍然建议编辑器保存为 UTF-8。

如果读写文件出现乱码，要明确指定编码：

```python
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()
```

## 1.11 本章练习

1. 安装 Python，并在终端输出版本号。
2. 新建 `hello.py`，输出自己的姓名、年龄、学习目标。
3. 使用 `print()` 输出下面格式：

```text
姓名: 小明
年龄: 18
目标: 学会Python
```

4. 使用 `sep` 输出日期：

```text
2024-10-10
```

5. 使用 `end` 让两次 `print()` 输出在同一行。
