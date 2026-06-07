---
title: 5. 函数基础
description:
---

# 5. 函数基础

## 5.1 为什么需要函数

函数用于封装一段可以重复使用的代码。

不使用函数的问题：

1. 重复代码多。
2. 修改逻辑时容易漏改。
3. 主流程不清晰。
4. 程序越写越长，难以维护。

使用函数后的好处：

1. 提高复用性。
2. 提高可读性。
3. 便于调试。
4. 便于分工。

## 5.2 函数定义

语法：

```python
def 函数名():
    函数体
```

示例：

```python
def say_hello():
    print("hello")
    print("python")


say_hello()
```

注意：

1. 函数必须先定义，再调用。
2. 函数名遵循变量命名规则。
3. 函数体需要缩进。
4. 函数不调用就不会执行。

## 5.3 函数调用

```python
def print_menu():
    print("1. 查询")
    print("2. 添加")
    print("3. 删除")
    print("0. 退出")


print_menu()
print_menu()
```

函数可以多次调用，每次调用都会执行函数体。

## 5.4 参数

参数用于向函数传递数据。

```python
def say_hello(name):
    print(f"你好，{name}")


say_hello("小明")
say_hello("小红")
```

`name` 是形参，`"小明"` 是实参。

多个参数：

```python
def add(a, b):
    result = a + b
    print(result)


add(10, 20)
```

调用时参数数量必须匹配。

## 5.5 返回值

`return` 用于把函数内部的结果返回给调用者。

```python
def add(a, b):
    return a + b


result = add(10, 20)
print(result)
```

如果函数没有写 `return`，默认返回 `None`。

```python
def say_hello():
    print("hello")


result = say_hello()
print(result)  # None
```

## 5.6 return的作用

`return` 有两个作用：

1. 返回结果。
2. 结束函数。

```python
def check_age(age):
    if age < 0:
        return "年龄不合法"

    if age >= 18:
        return "成年人"

    return "未成年人"


print(check_age(20))
print(check_age(-1))
```

函数执行到 `return` 后，后面的代码不会继续执行。

## 5.7 None

`None` 表示空值或没有结果。

常见使用场景：

1. 函数没有返回值。
2. 变量暂时没有具体值。
3. 表示查询不到结果。

```python
result = None

if result is None:
    print("没有数据")
```

判断 `None` 推荐使用 `is None`，不要写成 `== None`。

## 5.8 函数文档字符串

函数内部第一行可以写文档字符串，用来说明函数用途。

```python
def calculate_bmi(weight, height):
    """根据体重和身高计算BMI。"""
    return weight / height ** 2
```

查看说明：

```python
help(calculate_bmi)
```

较完整的写法：

```python
def calculate_bmi(weight, height):
    """
    计算BMI。

    :param weight: 体重，单位kg
    :param height: 身高，单位m
    :return: BMI数值
    """
    return weight / height ** 2
```

## 5.9 变量作用域

### 5.9.1 局部变量

在函数内部定义的变量，只能在函数内部使用。

```python
def test():
    num = 10
    print(num)


test()
print(num)  # 报错
```

### 5.9.2 全局变量

在函数外部定义的变量，可以在函数内部读取。

```python
name = "小明"


def say_hello():
    print(name)


say_hello()
```

如果要在函数内部修改全局变量，需要 `global`。

```python
count = 0


def add_count():
    global count
    count += 1


add_count()
print(count)
```

不建议大量使用全局变量，项目变大后很难维护。

## 5.10 函数嵌套调用

一个函数中可以调用另一个函数。

```python
def print_line():
    print("-" * 30)


def print_info(name, age):
    print_line()
    print(f"姓名:{name}")
    print(f"年龄:{age}")
    print_line()


print_info("小明", 18)
```

这种方式可以把小功能组合成大功能。

## 5.11 参数检查

函数内部可以检查参数是否合法。

```python
def divide(a, b):
    if b == 0:
        return None
    return a / b


result = divide(10, 0)

if result is None:
    print("除数不能为0")
else:
    print(result)
```

## 5.12 类型提示

类型提示不会强制限制运行，但能让编辑器提示更准确。

```python
def add(a: int, b: int) -> int:
    return a + b
```

字符串参数：

```python
def say_hello(name: str) -> None:
    print(f"你好，{name}")
```

列表参数：

```python
def get_total(numbers: list[int]) -> int:
    total = 0
    for number in numbers:
        total += number
    return total
```

学习初期可以先掌握基础语法，后续写项目时逐渐加类型提示。

## 5.13 小案例：ATM函数拆分

```python
balance = 1000


def show_menu():
    print("====== ATM ======")
    print("1. 查询余额")
    print("2. 存款")
    print("3. 取款")
    print("0. 退出")


def show_balance():
    print(f"当前余额:{balance}元")


def save_money():
    global balance
    money = float(input("请输入存款金额:"))
    if money <= 0:
        print("金额必须大于0")
        return
    balance += money
    print("存款成功")
    show_balance()


def withdraw_money():
    global balance
    money = float(input("请输入取款金额:"))
    if money <= 0:
        print("金额必须大于0")
        return
    if money > balance:
        print("余额不足")
        return
    balance -= money
    print("取款成功")
    show_balance()


while True:
    show_menu()
    choice = input("请输入操作:")

    if choice == "1":
        show_balance()
    elif choice == "2":
        save_money()
    elif choice == "3":
        withdraw_money()
    elif choice == "0":
        print("退出系统")
        break
    else:
        print("输入错误")
```

这个案例展示了函数拆分的价值：主流程只负责调度，具体业务交给函数。

## 5.14 易错点

1. 函数定义后必须调用才会执行。
2. 函数名后面有括号才是调用。
3. `return` 后面的代码不会执行。
4. 没有返回值的函数默认返回 `None`。
5. 局部变量不能在函数外部访问。
6. 不要滥用 `global`，更好的方式是让函数返回新值。

例如不用 `global` 改写存款：

```python
def save_money(balance, money):
    return balance + money


balance = 1000
balance = save_money(balance, 200)
print(balance)
```

## 5.15 本章练习

1. 定义函数 `print_student(name, age)`，输出学生信息。
2. 定义函数 `get_max(a, b, c)`，返回三个数中的最大值。
3. 定义函数 `is_even(num)`，判断一个数是否为偶数。
4. 定义函数 `calculate_bmi(weight, height)`，返回 BMI。
5. 把第 4 章的菜单程序拆分成多个函数。

