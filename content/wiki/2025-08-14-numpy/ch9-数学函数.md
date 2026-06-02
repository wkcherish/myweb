---
title: 9.数学函数
description: 
---

# 9.数学函数

补充回顾：python的列表推导式

```python
[1/i for i in a]
```

## 9.1 求倒数

```python
#数组求倒数
a=[1,2,3,4,5]
b=np.array(a)#将列表转换为数组
1/b
```
```python
a=[1,2,3,4,5]
b=np.array(a)
#调用numpy中的函数reciprocal()
np.reciprocal(b)
```

## 9.2 求平方

①一维数组

```python
#square()，求平方
#一维数组
a=np.arange(1,10)
np.square(a)
```
```python
#或者通过循环遍历的形式来计算
#这是一个列表
[i*i for i in a]#这个求完之后在数列当中
np.array([i*i for i in a])
```

②二维数组

```python
#二维数组
aa=np.arange(1,13).reshape(4,3)
np.square(aa)
```
```python
#传统的方式
bb=np.empty_like(aa)
for i in range(4):
    for j in range(3):
        bb[i,j]=aa[i,j]*aa[i,j]
bb
```

## 9.3 求各元素的符号

![](/images/feishu/assets/2025-08-14-numpy-028.png)

## 9.4 modf函数

计算各元素的小数部分和整数部分以两个独立的数组返回

```python
a=np.arange(-10,10,0.3)
np.modf(a)
```

总结：就是得到两个数组，一个是由小数部分组成，另一个数组是由整数部分组成

## 9.5 向上取整、向下取整、四舍五入

np.cell()

np.floor()

np.rint()

对各元素分别向上取整、向下取整、四舍五入

![](/images/feishu/assets/2025-08-14-numpy-029.png)

## 9.6 around()函数

around()函数也可以实现对数的小数位数进行操作

其中的参数：

1.要传的数组

2.decimals:舍入的小数位数。默认值为0。如果为负，整数将四舍五入到小数点左侧的位置

![](/images/feishu/assets/2025-08-14-numpy-030.png)

## 9.7 三角函数

![](/images/feishu/assets/2025-08-14-numpy-031.png)

引入图像模块非常重要

```python
from matplotlib import pyplot as plt
```
