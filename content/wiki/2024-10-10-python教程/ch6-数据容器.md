---
title: 6. 数据容器
description:
---

# 6. 数据容器

## 6.1 什么是数据容器

数据容器用于一次保存多个数据。

常见容器：

| 容器 | 是否有序 | 是否可变 | 是否允许重复 | 示例 |
| --- | --- | --- | --- | --- |
| list列表 | 有序 | 可变 | 允许 | `[1, 2, 3]` |
| tuple元组 | 有序 | 不可变 | 允许 | `(1, 2, 3)` |
| str字符串 | 有序 | 不可变 | 允许 | `"abc"` |
| set集合 | 无序 | 可变 | 不允许 | `{1, 2, 3}` |
| dict字典 | 有序 | 可变 | key不允许重复 | `{"name": "小明"}` |

Python 3.7 之后，字典保持插入顺序。

## 6.2 列表list

列表用于保存一组有顺序的数据。

```python
names = ["小明", "小红", "小刚"]
numbers = [1, 2, 3, 4]
mixed = ["小明", 18, True]
empty = []
```

推荐一个列表中保存同类数据，代码更清晰。

## 6.3 列表索引

正向索引从 0 开始：

```python
names = ["小明", "小红", "小刚"]

print(names[0])
print(names[1])
print(names[2])
```

反向索引从 -1 开始：

```python
print(names[-1])  # 小刚
print(names[-2])  # 小红
```

索引越界会报错：

```python
print(names[3])
```

## 6.4 列表常用方法

```python
names = ["小明", "小红"]

names.append("小刚")
names.insert(1, "小李")
names.extend(["小王", "小赵"])

print(names)
```

删除元素：

```python
names.remove("小红")
last = names.pop()
first = names.pop(0)
del names[0]
names.clear()
```

查询和统计：

```python
numbers = [1, 2, 3, 2, 4]

print(numbers.index(3))
print(numbers.count(2))
print(len(numbers))
```

排序：

```python
numbers = [3, 1, 5, 2]

numbers.sort()
print(numbers)

numbers.sort(reverse=True)
print(numbers)

numbers.reverse()
print(numbers)
```

`sort()` 会修改原列表，`sorted()` 返回新列表。

```python
numbers = [3, 1, 5, 2]
new_numbers = sorted(numbers)

print(numbers)
print(new_numbers)
```

## 6.5 列表遍历

```python
names = ["小明", "小红", "小刚"]

for name in names:
    print(name)
```

需要索引时：

```python
for index, name in enumerate(names):
    print(index, name)
```

统计总分：

```python
scores = [90, 85, 66, 78]
total = 0

for score in scores:
    total += score

avg = total / len(scores)
print(f"平均分:{avg:.2f}")
```

## 6.6 元组tuple

元组和列表类似，但不可修改。

```python
point = (10, 20)
info = ("小明", 18, "北京")
```

单元素元组必须加逗号：

```python
t1 = (10,)
t2 = (10)

print(type(t1))  # tuple
print(type(t2))  # int
```

元组适合保存不希望被修改的数据，如坐标、配置项。

## 6.7 字符串str

字符串也是序列，可以索引、切片和遍历。

```python
text = "python"

print(text[0])
print(text[-1])

for ch in text:
    print(ch)
```

字符串不可变：

```python
text = "python"
text[0] = "P"  # 报错
```

如果要得到新字符串：

```python
text = "python"
text = "P" + text[1:]
print(text)
```

## 6.8 切片

切片用于从序列中取一部分。

```python
序列[开始:结束:步长]
```

结束位置不包含。

```python
nums = [0, 1, 2, 3, 4, 5, 6]

print(nums[1:4])    # [1, 2, 3]
print(nums[:3])     # [0, 1, 2]
print(nums[3:])     # [3, 4, 5, 6]
print(nums[::2])    # [0, 2, 4, 6]
print(nums[::-1])   # 反转
```

字符串切片：

```python
text = "abcdef"
print(text[1:4])
print(text[::-1])
```

## 6.9 集合set

集合特点：

1. 无序。
2. 元素不重复。
3. 可以做交集、并集、差集。

```python
nums = {1, 2, 3, 3, 4}
print(nums)
```

创建空集合：

```python
s = set()
```

注意：`{}` 是空字典，不是空集合。

集合常用操作：

```python
s = {1, 2, 3}

s.add(4)
s.remove(2)
s.discard(10)
print(len(s))
```

交并差：

```python
a = {1, 2, 3}
b = {3, 4, 5}

print(a & b)  # 交集
print(a | b)  # 并集
print(a - b)  # 差集
```

## 6.10 字典dict

字典通过 key-value 保存数据。

```python
student = {
    "name": "小明",
    "age": 18,
    "score": 95
}
```

获取值：

```python
print(student["name"])
print(student.get("name"))
```

区别：

```python
student["address"]     # key不存在会报错
student.get("address") # key不存在返回None
```

设置默认值：

```python
print(student.get("address", "未知"))
```

新增和修改：

```python
student["age"] = 19
student["address"] = "北京"
```

删除：

```python
score = student.pop("score")
del student["age"]
student.clear()
```

## 6.11 字典遍历

遍历 key：

```python
for key in student:
    print(key, student[key])
```

遍历 value：

```python
for value in student.values():
    print(value)
```

遍历 key 和 value：

```python
for key, value in student.items():
    print(key, value)
```

## 6.12 嵌套容器

列表中保存字典，是项目中最常见的结构之一。

```python
students = [
    {"name": "小明", "age": 18, "score": 95},
    {"name": "小红", "age": 17, "score": 88},
    {"name": "小刚", "age": 19, "score": 72},
]

for student in students:
    print(student["name"], student["score"])
```

统计平均分：

```python
total = 0

for student in students:
    total += student["score"]

avg = total / len(students)
print(f"平均分:{avg:.2f}")
```

查找学生：

```python
target = input("请输入学生姓名:")

for student in students:
    if student["name"] == target:
        print(student)
        break
else:
    print("没有找到")
```

## 6.13 容器通用操作

长度：

```python
len([1, 2, 3])
len("abc")
len({"name": "小明"})
```

最大最小：

```python
max([1, 2, 3])
min([1, 2, 3])
```

求和：

```python
sum([1, 2, 3])
```

排序：

```python
sorted([3, 1, 2])
```

类型转换：

```python
list("abc")
tuple([1, 2, 3])
set([1, 1, 2, 3])
```

成员判断：

```python
print("a" in "abc")
print(1 in [1, 2, 3])
print("name" in {"name": "小明"})
```

## 6.14 推导式

推导式用于快速生成容器。

列表推导式：

```python
nums = [i for i in range(1, 6)]
print(nums)
```

带条件：

```python
even_nums = [i for i in range(1, 101) if i % 2 == 0]
print(even_nums)
```

字典推导式：

```python
squares = {i: i ** 2 for i in range(1, 6)}
print(squares)
```

集合推导式：

```python
chars = {ch for ch in "hello"}
print(chars)
```

推导式适合简单逻辑，复杂逻辑还是写普通循环。

## 6.15 小案例：学生成绩统计

```python
students = [
    {"name": "小明", "score": 95},
    {"name": "小红", "score": 88},
    {"name": "小刚", "score": 72},
    {"name": "小李", "score": 59},
]

total = 0
max_student = students[0]
passed = []

for student in students:
    total += student["score"]

    if student["score"] > max_student["score"]:
        max_student = student

    if student["score"] >= 60:
        passed.append(student)

avg = total / len(students)

print(f"平均分:{avg:.2f}")
print(f"最高分学生:{max_student['name']} {max_student['score']}")
print(f"及格人数:{len(passed)}")
```

## 6.16 易错点

1. 列表可变，元组和字符串不可变。
2. 切片结束位置不包含。
3. 字典通过 key 取值，不是通过索引。
4. 空集合要用 `set()`。
5. 使用 `student["key"]` 前要确认 key 存在，或用 `get()`。
6. 嵌套容器要先看清楚每一层是什么类型。

## 6.17 本章练习

1. 定义列表保存 5 个成绩，计算最高分、最低分、平均分。
2. 输入一句话，统计每个字符出现次数。
3. 使用集合去除列表中的重复元素。
4. 使用字典保存一个学生的信息，并实现修改成绩。
5. 使用列表字典结构保存多个学生，实现按姓名查询。

