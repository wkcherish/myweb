---
title: 4. 循环语句
description:
---

# 4. 循环语句

## 4.1 为什么需要循环

如果要输出 1 到 100，不应该写 100 行 `print()`，而应该用循环。

循环适合处理重复任务：

1. 重复输出。
2. 重复输入。
3. 遍历数据。
4. 持续执行菜单。
5. 批量处理文件或数据。

## 4.2 while循环

语法：

```python
while 条件:
    循环体
```

示例：

```python
i = 1

while i <= 5:
    print(i)
    i += 1
```

执行过程：

1. 判断条件 `i <= 5`。
2. 条件成立，执行循环体。
3. 执行完后回到条件判断。
4. 条件不成立，退出循环。

## 4.3 while累加

计算 1 到 100 的和：

```python
i = 1
total = 0

while i <= 100:
    total += i
    i += 1

print(total)
```

核心思想：

1. `i` 控制循环次数。
2. `total` 保存累加结果。
3. 每轮循环都要更新 `i`，否则可能死循环。

## 4.4 while猜数字

```python
import random

answer = random.randint(1, 100)
count = 0

while True:
    guess = int(input("请输入1到100之间的数字:"))
    count += 1

    if guess > answer:
        print("猜大了")
    elif guess < answer:
        print("猜小了")
    else:
        print(f"猜对了，一共猜了{count}次")
        break
```

`while True` 表示无限循环，通常配合 `break` 使用。

## 4.5 break和continue

### 4.5.1 break

`break` 直接结束整个循环。

```python
for i in range(1, 6):
    if i == 3:
        break
    print(i)
```

输出：

```text
1
2
```

### 4.5.2 continue

`continue` 跳过本轮剩余代码，进入下一轮循环。

```python
for i in range(1, 6):
    if i == 3:
        continue
    print(i)
```

输出：

```text
1
2
4
5
```

## 4.6 for循环

`for` 常用于遍历序列。

```python
name = "python"

for ch in name:
    print(ch)
```

遍历列表：

```python
students = ["小明", "小红", "小刚"]

for student in students:
    print(student)
```

## 4.7 range函数

`range()` 用于生成整数序列。

```python
range(5)          # 0,1,2,3,4
range(1, 5)       # 1,2,3,4
range(1, 10, 2)   # 1,3,5,7,9
```

配合 `for`：

```python
for i in range(1, 6):
    print(i)
```

注意：`range` 的结束值不包含在内。

## 4.8 for循环求和

```python
total = 0

for i in range(1, 101):
    total += i

print(total)
```

求偶数和：

```python
total = 0

for i in range(1, 101):
    if i % 2 == 0:
        total += i

print(total)
```

也可以：

```python
total = 0

for i in range(2, 101, 2):
    total += i

print(total)
```

## 4.9 循环嵌套

嵌套循环就是循环里面再写循环。

```python
for i in range(1, 4):
    for j in range(1, 4):
        print(f"i={i}, j={j}")
```

外层循环执行一次，内层循环执行完整一轮。

## 4.10 九九乘法表

```python
for i in range(1, 10):
    for j in range(1, i + 1):
        print(f"{j}*{i}={i * j}", end="\t")
    print()
```

关键点：

1. 外层 `i` 控制行。
2. 内层 `j` 控制列。
3. 每行结束后用 `print()` 换行。
4. `end="\t"` 让同一行的内容横向排列。

## 4.11 循环else

Python 的循环可以带 `else`。当循环正常结束时执行 `else`，如果被 `break` 打断，则不执行。

```python
for i in range(1, 6):
    if i == 10:
        print("找到了")
        break
else:
    print("没找到")
```

常用于搜索。

```python
names = ["小明", "小红", "小刚"]
target = "小李"

for name in names:
    if name == target:
        print("找到了")
        break
else:
    print("没找到")
```

## 4.12 小案例：登录重试

需求：

1. 用户最多输入 3 次密码。
2. 密码正确则登录成功。
3. 3 次都错误则锁定账号。

代码：

```python
password = "123456"

for i in range(3):
    user_password = input("请输入密码:")

    if user_password == password:
        print("登录成功")
        break
    else:
        print(f"密码错误，还剩{2 - i}次机会")
else:
    print("账号已锁定")
```

## 4.13 小案例：菜单程序

```python
while True:
    print("====== 菜单 ======")
    print("1. 查询余额")
    print("2. 存款")
    print("3. 取款")
    print("0. 退出")

    choice = input("请输入操作:")

    if choice == "1":
        print("余额为1000元")
    elif choice == "2":
        print("存款功能")
    elif choice == "3":
        print("取款功能")
    elif choice == "0":
        print("退出系统")
        break
    else:
        print("输入错误")
```

菜单类程序通常使用 `while True`，用户选择退出时 `break`。

## 4.14 易错点

1. `while` 循环必须更新控制变量。
2. `range(1, 10)` 不包含 10。
3. `break` 结束整个循环，`continue` 只跳过本轮。
4. 嵌套循环中，`break` 只跳出当前所在的一层循环。
5. 不要在循环中频繁写重复代码，能封装函数就封装函数。

## 4.15 本章练习

1. 输出 1 到 100。
2. 计算 1 到 100 的偶数和。
3. 输出 100 以内能被 3 和 5 同时整除的数。
4. 编写猜数字游戏，限制最多猜 7 次。
5. 编写菜单程序，实现查看余额、存款、取款、退出。

