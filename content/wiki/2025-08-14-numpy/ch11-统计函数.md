---
title: 11.统计函数
description: 
---

# 11.统计函数

sum max min mean

这些有axis参数，可以指定方向

## 11.1 sum()求和函数

```python
#创建一维数组
a=np.random.randint(1,100,20)
np.sum(a)#求和
```

## 11.2 max()求最大值函数

```python
#创建一维数组
a=np.random.randint(1,100,20)
np.max(a)
#最大索引(求最大元素的索引)arg
np.argmax(a)
```
```python
a = np.array([1, 5, 3])
b = np.array([3, 2, 4])

print(np.maximum(a, b))   # [3 5 4]，每个位置上取较大值
```

## 11.3 mean()求平均值函数

①一维数组：

```python
#创建一维数组
a=np.random.randint(1,100,20)
#求平均值
np.mean(a)
```

②二维数组

```python
#二维数组
aa=np.arange(1,13).reshape(3,4)
#对数组中的所有数求平均
np.mean(aa)
```

## 11.4 median()求中位数函数

```python
#求中位数
b=np.arange(1,10)
np.median(b)
#正常这个代码就可以，对于奇数就是排序后中间哪个值，对于偶数就是排序后中间那两个数的平均值
```

## 11.5 power()求幂运算函数

```python
b=np.arange(1,10)
#幂运算
#第一个参数是要进行幂运算的数列，第二个参数是为方
np.power(b,2)
#或者以下代码，将数据存储起来
y=np.empty_like(b)
np.power(b,2,out=y)
```

## 11.6 sqrt()求开方函数

```python
b=np.arange(1,10)
#开方
np.sqrt(b)
#或者以下代码，将数据存储起来
y=np.empty_like(b,dtype=float)
np.sqrt(b,out=y)
```

## 11.7 cumsum()累计求和函数

对数组中的元素累计求和，可指定轴

#累计求和的意思是：

a = np.array(\[1, 2, 3, 4\])

\[1, 1+2, 1+2+3, 1+2+3+4\] → \[1, 3, 6, 10\]

```python
b=np.arange(1,10)
np.cumsum(b)
#结果：
#array([ 1,  3,  6, 10, 15, 21, 28, 36, 45])
```

## 11.8 cumprod()累计求积函数

```python
b=np.arange(1,10)
#对数组中的元素累计求积，可指定轴
np.cumprod(b)
#结果：
#array([     1,      2,      6,     24,    120,    720,   5040,  40320,362880])
```

## 11.9 uniqu()删除重复元素+排序

```python
#删除数组中的重复数据，并对数据进行排序
a=np.array([1,2,3,12,3,10,32,0,23,4])
np.unique(a)
#结果：
#array([ 0,  1,  2,  3,  4, 10, 12, 23, 32])
```

升序形式排序

## 11.10 nonzero()返回非零元素索引

```python
a=np.array([1,2,3,12,3,10,32,0,23,4])
#返回数组中非零元素的索引
np.nonzero(a)
```

## 11.11 ptp()计算最值之差

```python
a=np.array([1,2,3,12,3,10,32,0,23,4])
#计算一组数中最大值与最小值的差，可指定轴
np.ptp(a)
```
