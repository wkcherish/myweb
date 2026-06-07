---
title: 7. 函数进阶
description:
---

# 7. 函数进阶

## 7.1 多返回值

Python 函数可以返回多个值，本质上返回的是元组。

```python
def get_info():
    name = "小明"
    age = 18
    score = 95
    return name, age, score


result = get_info()
print(result)
print(type(result))
```

可以直接解包：

```python
name, age, score = get_info()
print(name, age, score)
```

返回多个值适合函数需要同时给出多个结果时使用。

## 7.2 位置参数

位置参数按顺序传递。

```python
def introduce(name, age):
    print(f"我叫{name}，今年{age}岁")


introduce("小明", 18)
```

顺序错了就会得到错误含义：

```python
introduce(18, "小明")
```

## 7.3 关键字参数

关键字参数按参数名传递。

```python
introduce(name="小明", age=18)
introduce(age=18, name="小明")
```

优点：

1. 顺序不容易错。
2. 调用时可读性更强。

## 7.4 默认参数

默认参数给参数设置默认值。

```python
def connect(host, port=3306):
    print(f"连接{host}:{port}")


connect("localhost")
connect("localhost", 6379)
```

注意：默认参数必须放在非默认参数后面。

错误：

```python
def connect(port=3306, host):
    pass
```

正确：

```python
def connect(host, port=3306):
    pass
```

## 7.5 默认参数的坑

不要使用可变对象作为默认参数。

错误示例：

```python
def add_item(item, items=[]):
    items.append(item)
    return items


print(add_item("a"))
print(add_item("b"))
```

第二次调用会复用第一次的列表。

正确写法：

```python
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```

## 7.6 不定长参数

### 7.6.1 *args

`*args` 接收任意数量的位置参数，得到元组。

```python
def add(*args):
    total = 0
    for num in args:
        total += num
    return total


print(add(1, 2, 3))
print(add(1, 2, 3, 4, 5))
```

### 7.6.2 **kwargs

`**kwargs` 接收任意数量的关键字参数，得到字典。

```python
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(key, value)


print_info(name="小明", age=18, city="北京")
```

## 7.7 参数解包

列表或元组解包为位置参数：

```python
def add(a, b, c):
    return a + b + c


nums = [1, 2, 3]
print(add(*nums))
```

字典解包为关键字参数：

```python
def introduce(name, age):
    print(f"{name} {age}")


info = {"name": "小明", "age": 18}
introduce(**info)
```

## 7.8 匿名函数lambda

`lambda` 用于定义简单匿名函数。

```python
add = lambda a, b: a + b
print(add(1, 2))
```

常和排序、过滤等函数一起使用。

按分数排序：

```python
students = [
    {"name": "小明", "score": 95},
    {"name": "小红", "score": 88},
    {"name": "小刚", "score": 72},
]

students.sort(key=lambda item: item["score"], reverse=True)
print(students)
```

如果逻辑复杂，不要硬写 `lambda`，定义普通函数更清晰。

## 7.9 函数作为参数

函数可以作为参数传给另一个函数。

```python
def add(a, b):
    return a + b


def calculate(a, b, func):
    return func(a, b)


print(calculate(10, 20, add))
```

这种思想在排序、回调、框架中经常出现。

## 7.10 map、filter、sorted

### 7.10.1 map

`map` 对每个元素执行函数。

```python
nums = [1, 2, 3, 4]
result = map(lambda x: x * 2, nums)
print(list(result))
```

### 7.10.2 filter

`filter` 保留满足条件的元素。

```python
nums = [1, 2, 3, 4, 5]
result = filter(lambda x: x % 2 == 0, nums)
print(list(result))
```

### 7.10.3 sorted

`sorted` 返回排序后的新列表。

```python
students = [
    {"name": "小明", "score": 95},
    {"name": "小红", "score": 88},
    {"name": "小刚", "score": 72},
]

result = sorted(students, key=lambda item: item["score"], reverse=True)
print(result)
```

## 7.11 闭包入门

闭包指内部函数使用了外部函数的变量，并且外部函数返回内部函数。

```python
def outer(base):
    def inner(num):
        return base + num

    return inner


add_10 = outer(10)
print(add_10(5))
```

闭包常用于保存状态、构造函数工厂。入门阶段了解即可。

## 7.12 装饰器入门

装饰器用于在不修改原函数代码的情况下，给函数增加功能。

```python
def log(func):
    def wrapper():
        print("函数开始执行")
        func()
        print("函数执行结束")

    return wrapper


@log
def say_hello():
    print("hello")


say_hello()
```

等价于：

```python
say_hello = log(say_hello)
```

装饰器在 Web 框架、权限校验、日志统计中很常见。

## 7.13 带参数函数的装饰器

```python
def log(func):
    def wrapper(*args, **kwargs):
        print("函数开始执行")
        result = func(*args, **kwargs)
        print("函数执行结束")
        return result

    return wrapper


@log
def add(a, b):
    return a + b


print(add(10, 20))
```

这个写法使用 `*args` 和 `**kwargs` 接收原函数的所有参数。

## 7.14 小案例：通用统计函数

需求：

1. 给定一组学生数据。
2. 封装函数，根据传入规则筛选学生。
3. 筛选及格、优秀、未成年学生。

代码：

```python
students = [
    {"name": "小明", "age": 18, "score": 95},
    {"name": "小红", "age": 17, "score": 88},
    {"name": "小刚", "age": 19, "score": 59},
]


def filter_students(students, condition):
    result = []
    for student in students:
        if condition(student):
            result.append(student)
    return result


passed = filter_students(students, lambda s: s["score"] >= 60)
excellent = filter_students(students, lambda s: s["score"] >= 90)
under_age = filter_students(students, lambda s: s["age"] < 18)

print(passed)
print(excellent)
print(under_age)
```

## 7.15 易错点

1. 默认参数不要写可变对象。
2. `*args` 是元组，`**kwargs` 是字典。
3. `lambda` 只适合简单表达式。
4. `map` 和 `filter` 的结果是迭代器，常用 `list()` 转换查看。
5. 装饰器会改变函数调用链，初学时先理解执行顺序。

## 7.16 本章练习

1. 写函数 `calc(*args)`，返回所有数字的和、最大值、最小值。
2. 写函数 `print_user(**kwargs)`，输出用户所有字段。
3. 使用 `lambda` 对学生列表按年龄排序。
4. 使用 `filter` 找出成绩不及格的学生。
5. 写一个装饰器，统计函数执行前后的提示信息。

