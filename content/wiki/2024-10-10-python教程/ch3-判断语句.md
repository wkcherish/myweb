---
title: 3. 判断语句
description:
---

# 3. 判断语句

## 3.1 布尔值

判断语句依赖布尔值：

```python
True
False
```

比较表达式会产生布尔值：

```python
age = 18
print(age >= 18)  # True
```

## 3.2 if基础语法

```python
age = int(input("请输入年龄:"))

if age >= 18:
    print("可以进入网吧")
```

注意：

1. `if` 后面是条件表达式。
2. 条件后面必须写冒号。
3. 条件成立时执行缩进代码块。
4. Python 用缩进表示代码层级，一般使用 4 个空格。

错误示例：

```python
if age >= 18
    print("可以进入")
```

缺少冒号。

## 3.3 if else

```python
age = int(input("请输入年龄:"))

if age >= 18:
    print("成年人")
else:
    print("未成年人")
```

执行逻辑：

1. 条件成立，执行 `if` 代码块。
2. 条件不成立，执行 `else` 代码块。
3. 两个代码块只会执行其中一个。

## 3.4 if elif else

多条件判断：

```python
score = int(input("请输入成绩:"))

if score >= 90:
    print("优秀")
elif score >= 80:
    print("良好")
elif score >= 60:
    print("及格")
else:
    print("不及格")
```

注意判断顺序很重要。

如果把 `score >= 60` 放在最前面：

```python
if score >= 60:
    print("及格")
elif score >= 90:
    print("优秀")
```

成绩 95 会先满足 `score >= 60`，后面的优秀分支就不会执行。

## 3.5 判断语句嵌套

嵌套判断就是在一个判断内部再写判断。

```python
age = int(input("请输入年龄:"))
has_ticket = input("是否有票(y/n):")

if age >= 18:
    if has_ticket == "y":
        print("可以进入")
    else:
        print("请先买票")
else:
    print("未成年人禁止进入")
```

嵌套层级不要太深，超过 3 层就应该考虑拆成函数或调整条件。

## 3.6 逻辑运算组合条件

### 3.6.1 and

两个条件都成立才成立。

```python
age = 20
has_ticket = True

if age >= 18 and has_ticket:
    print("可以进入")
```

### 3.6.2 or

只要一个条件成立就成立。

```python
is_vip = False
coupon = True

if is_vip or coupon:
    print("可以享受优惠")
```

### 3.6.3 not

取反。

```python
is_closed = False

if not is_closed:
    print("店铺营业中")
```

## 3.7 链式比较

Python 支持链式比较：

```python
score = 85

if 0 <= score <= 100:
    print("成绩合法")
```

等价于：

```python
if score >= 0 and score <= 100:
    print("成绩合法")
```

## 3.8 真值和假值

在 `if` 中，不只有布尔值能做条件。很多对象也能被判断为真或假。

假值：

```python
False
None
0
0.0
""
[]
()
{}
set()
```

示例：

```python
name = input("请输入姓名:")

if name:
    print(f"你好，{name}")
else:
    print("姓名不能为空")
```

## 3.9 match语句

Python 3.10 开始支持 `match`。它适合处理固定选项。

```python
command = input("请输入命令:")

match command:
    case "start":
        print("启动")
    case "stop":
        print("停止")
    case "restart":
        print("重启")
    case _:
        print("未知命令")
```

入门阶段掌握 `if elif else` 更重要，`match` 可以作为补充。

## 3.10 小案例：成绩等级

需求：

1. 输入成绩。
2. 判断成绩是否合法。
3. 输出等级。

代码：

```python
score = float(input("请输入成绩:"))

if not 0 <= score <= 100:
    print("成绩不合法")
elif score >= 90:
    print("等级:A")
elif score >= 80:
    print("等级:B")
elif score >= 70:
    print("等级:C")
elif score >= 60:
    print("等级:D")
else:
    print("等级:E")
```

## 3.11 小案例：会员折扣

需求：

1. 输入消费金额。
2. 输入会员等级，普通、银卡、金卡。
3. 普通不打折，银卡 9 折，金卡 8 折。
4. 满 500 再减 50。

代码：

```python
amount = float(input("请输入消费金额:"))
level = input("请输入会员等级(普通/银卡/金卡):")

discount = 1

if level == "银卡":
    discount = 0.9
elif level == "金卡":
    discount = 0.8
elif level == "普通":
    discount = 1
else:
    print("会员等级输入错误，按普通会员计算")

pay = amount * discount

if pay >= 500:
    pay -= 50

print(f"应付金额:{pay:.2f}元")
```

## 3.12 易错点

1. 冒号不能漏。
2. 缩进必须统一，不能一会儿 Tab 一会儿空格。
3. 多分支判断要注意顺序。
4. 判断相等用 `==`。
5. 字符串比较区分大小写：

```python
"Y" == "y"  # False
```

可转换后再判断：

```python
answer = input("是否继续(y/n):").lower()
if answer == "y":
    print("继续")
```

## 3.13 本章练习

1. 输入年龄，判断是否成年。
2. 输入年份，判断是否为闰年。
3. 输入三个数字，输出最大值。
4. 写登录判断：用户名是 `admin` 且密码是 `123456` 才登录成功。
5. 写 BMI 判断程序，根据 BMI 输出偏瘦、正常、偏胖、肥胖。

