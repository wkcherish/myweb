---
title: 2. 基础语法、变量与字符串
description:
---

# 2. 基础语法、变量与字符串

## 2.1 注释

注释是给人看的说明文字，不会被 Python 执行。

单行注释：

```python
# 这是单行注释
print("hello")
```

多行说明常用三引号：

```python
"""
这是多行说明。
常用于文件顶部说明、函数说明等。
"""
```

实际写代码时，注释不要解释显而易见的内容，而要解释意图。

不好：

```python
# age 加 1
age = age + 1
```

较好：

```python
# 用户过完生日后，年龄增加一岁
age = age + 1
```

## 2.2 字面量

字面量就是代码中直接写出来的数据。

```python
100          # 整数
3.14         # 小数
"hello"      # 字符串
True         # 布尔值
None         # 空值
```

常见字面量类型：

| 类型 | 示例 | 说明 |
| --- | --- | --- |
| int | `100` | 整数 |
| float | `3.14` | 浮点数 |
| str | `"hello"` | 字符串 |
| bool | `True`、`False` | 布尔值 |
| NoneType | `None` | 空值 |
| list | `[1, 2, 3]` | 列表 |
| tuple | `(1, 2, 3)` | 元组 |
| dict | `{"name": "张三"}` | 字典 |
| set | `{1, 2, 3}` | 集合 |

## 2.3 变量

变量是保存数据的名字。

```python
name = "小明"
age = 18
height = 1.75
is_student = True
```

Python 的变量不需要提前声明类型：

```python
score = 100
score = "满分"
```

这虽然合法，但不建议在同一段逻辑里频繁改变变量含义，否则代码难读。

## 2.4 变量命名规则

硬性规则：

1. 只能由字母、数字、下划线组成。
2. 不能以数字开头。
3. 不能使用 Python 关键字。
4. 区分大小写。

```python
user_name = "张三"
age2 = 18
_token = "abc"
```

错误写法：

```python
2age = 18
user-name = "张三"
class = "一班"
```

查看关键字：

```python
import keyword

print(keyword.kwlist)
```

推荐命名风格：

```python
student_name = "小明"
total_price = 99.8
is_finished = False
```

Python 中变量名通常使用小写字母和下划线，也叫 snake_case。

## 2.5 数据类型

使用 `type()` 查看数据类型：

```python
print(type(100))
print(type(3.14))
print(type("hello"))
print(type(True))
print(type(None))
```

输出类似：

```text
<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
<class 'NoneType'>
```

注意：`bool` 是 `int` 的子类，`True` 可以当作 `1`，`False` 可以当作 `0`，但业务代码中不要滥用。

```python
print(True + 1)   # 2
print(False + 1)  # 1
```

## 2.6 类型转换

常用转换函数：

```python
int("10")
float("3.14")
str(100)
bool(1)
```

示例：

```python
age = "18"
age = int(age)
print(age + 1)
```

输入得到的内容永远是字符串：

```python
num = input("请输入数字:")
print(type(num))  # str
```

如果要做数学运算，必须转换：

```python
num = int(input("请输入数字:"))
print(num + 10)
```

常见错误：

```python
int("3.14")   # 错误
int("abc")    # 错误
```

正确写法：

```python
num = float("3.14")
```

## 2.7 运算符

### 2.7.1 算术运算符

| 运算符 | 说明 | 示例 |
| --- | --- | --- |
| `+` | 加法 | `1 + 2` |
| `-` | 减法 | `5 - 3` |
| `*` | 乘法 | `2 * 3` |
| `/` | 除法，结果是浮点数 | `5 / 2` |
| `//` | 整除 | `5 // 2` |
| `%` | 取余 | `5 % 2` |
| `**` | 幂运算 | `2 ** 3` |

示例：

```python
print(5 / 2)   # 2.5
print(5 // 2)  # 2
print(5 % 2)   # 1
print(2 ** 3)  # 8
```

### 2.7.2 赋值运算符

```python
num = 10
num += 5
num -= 2
num *= 3
num /= 2
```

等价关系：

```python
num += 1
num = num + 1
```

Python 没有 `num++` 和 `num--`。

### 2.7.3 比较运算符

比较运算结果是布尔值。

```python
print(10 > 5)
print(10 >= 10)
print(10 == 8)
print(10 != 8)
```

注意：判断相等用 `==`，赋值用 `=`。

```python
age = 18       # 赋值
age == 18      # 判断是否相等
```

### 2.7.4 逻辑运算符

| 运算符 | 说明 |
| --- | --- |
| `and` | 并且 |
| `or` | 或者 |
| `not` | 取反 |

```python
age = 20
has_ticket = True

print(age >= 18 and has_ticket)
print(age < 18 or has_ticket)
print(not has_ticket)
```

## 2.8 字符串定义

三种常见写法：

```python
name1 = '小明'
name2 = "小明"
text = """这是多行字符串
可以换行"""
```

字符串中包含引号：

```python
msg = "他说:'你好'"
msg2 = '他说:"你好"'
msg3 = "他说:\"你好\""
```

常见转义字符：

| 写法 | 含义 |
| --- | --- |
| `\n` | 换行 |
| `\t` | 制表符 |
| `\\` | 反斜杠 |
| `\"` | 双引号 |
| `\'` | 单引号 |

## 2.9 字符串拼接

```python
name = "小明"
print("你好，" + name)
```

字符串只能和字符串拼接：

```python
age = 18
print("年龄:" + str(age))
```

更推荐使用格式化字符串。

## 2.10 字符串格式化

### 2.10.1 百分号格式化

```python
name = "小明"
age = 18
score = 95.5

print("姓名:%s 年龄:%d 分数:%.1f" % (name, age, score))
```

常用占位符：

| 占位符 | 说明 |
| --- | --- |
| `%s` | 字符串 |
| `%d` | 整数 |
| `%f` | 浮点数 |

精度控制：

```python
price = 12.3456
print("%.2f" % price)
```

### 2.10.2 format方法

```python
name = "小明"
age = 18

print("姓名:{} 年龄:{}".format(name, age))
print("姓名:{0} 年龄:{1}".format(name, age))
print("姓名:{name} 年龄:{age}".format(name=name, age=age))
```

### 2.10.3 f-string

推荐写法：

```python
name = "小明"
age = 18
score = 95.5

print(f"姓名:{name} 年龄:{age} 分数:{score:.1f}")
```

表达式也可以放进去：

```python
price = 8
count = 5
print(f"总价:{price * count}元")
```

## 2.11 input输入

`input()` 会暂停程序，等待用户输入。

```python
name = input("请输入姓名:")
print(f"你好，{name}")
```

输入整数：

```python
age = int(input("请输入年龄:"))
print(f"明年你{age + 1}岁")
```

输入小数：

```python
height = float(input("请输入身高:"))
print(f"身高:{height:.2f}米")
```

## 2.12 小案例：购物金额计算

需求：

1. 输入商品单价。
2. 输入购买数量。
3. 输入折扣，例如 0.8 表示八折。
4. 输出最终金额，保留两位小数。

代码：

```python
price = float(input("请输入商品单价:"))
count = int(input("请输入购买数量:"))
discount = float(input("请输入折扣:"))

total = price * count * discount

print(f"商品单价:{price:.2f}")
print(f"购买数量:{count}")
print(f"折扣:{discount}")
print(f"应付金额:{total:.2f}元")
```

## 2.13 易错点

1. `input()` 的结果是字符串，做运算前要转换。
2. 字符串拼接时，数字要先 `str()`。
3. `=` 是赋值，`==` 是比较。
4. Python 没有自增自减运算符。
5. 浮点数计算可能有精度误差：

```python
print(0.1 + 0.2)
```

金额计算如果要求严格，可以后续学习 `decimal` 模块。

## 2.14 本章练习

1. 输入姓名、年龄、身高，使用 f-string 输出个人信息。
2. 输入圆的半径，计算面积，保留两位小数。
3. 输入工资和奖金，计算总收入。
4. 输入摄氏温度，转换为华氏温度。
5. 写一个 BMI 计算程序：

```text
BMI = 体重kg / 身高m ** 2
```

