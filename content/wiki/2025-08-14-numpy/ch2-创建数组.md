---
title: 2.创建数组
description: 
---

# 2.创建数组

## 2.1 array()函数创建数组

### 2.2.1 函数语句

```python
numpy.array(object, dtype = None, copy = True, order = None, subok = False, ndmin = 0)
```

参数：

![](/images/feishu/assets/2025-08-14-numpy-001.png)

### 2.2.2 实例

![](/images/feishu/assets/2025-08-14-numpy-002.png)

![](/images/feishu/assets/2025-08-14-numpy-003.png)

![](/images/feishu/assets/2025-08-14-numpy-004.png)

![](/images/feishu/assets/2025-08-14-numpy-005.png)

在使用admin属性指定维度时，如果是ndim=3，表示创建一个三维的数组；如果ndim=4，表示创建了一个四维的数组，上述结果就变为：

![](/images/feishu/assets/2025-08-14-numpy-006.png)

## 2.2 随机数创建数组

### 2.2.1 random语句

```python
#random.random()
#确定随机种子,就是每次运行结果是相同的
np.random.seed(0)
np.random.random()
#生成一个随机的数目
```

使用seed()函数后就可以保证每次生成的随机数都是一样的，不会再变了

可以指定数组形状 size

①生成一维数组

```python
#random.random(size())
np.random.random(size=5)
#生成一位的五个元素
a=np.random.random(size=4)
a.shape #输出数组形状
```

②生成二维数组

```python
#二维数组
aa=np.random.random(size=(4,5))
#生成四行五列的数组
```

③生成三维数组

```python
#三维数组
aaa=np.random.random(size=(2,3,4))
aaa.shape
```

### 2.2.2 randint语句

```python
#生成随机的整数 random.randint(low,high,size)
np.random.randint(5) #0~5中的随机一个数
```

①生成一维数组

```python
#一维
np.random.randint(1,11,size=(10))
#运行结果：array([4, 5, 5, 9, 5, 4, 8, 6, 6, 1], dtype=int32)
```

②生成二维数组

![](/images/feishu/assets/2025-08-14-numpy-007.png)

③生成三维数组

![](/images/feishu/assets/2025-08-14-numpy-008.png)

### 2.2.2 rand语句

Numpy 的函数，生成均匀分布的随机数（0-1）

```python
np.random.rand(100,10)
#第一个参数100：行数，表示有100个样本
#第二个参数10：列数，表示每个样本有10个值（例如分类标签）
```

## 2.3 arange()创建数组

### 2.3.1 函数语句

```python
numpy.arange([start,] stop[, step], dtype=None)
#参数
"""
start:起始值，可选，默认从 0 开始。
stop:结束值（不包含该值）。
step:步长，可选，默认是 1。可以为浮点数。
dtype:指定返回数组的数据类型（如 int32、float64 等），默认自动推断。
"""
```

### 2.3.2 实例

```python
#创建一维数组
np.arange(1,21,1,dtype=int)
#输出结果：
#array([ 1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17,18, 19, 20])
#创建二维数组
np.array([np.arange(1,4),np.arange(4,7)])
#结果：
"""
array([[1, 2, 3],
       [4, 5, 6]])
"""
```

## 2.4 生态分布

### 2.4.1 标准正态分布

randn()函数返回一个或一组数据，具有标准正态分布（期望为0，方差为1）

![](/images/feishu/assets/2025-08-14-numpy-009.png)

### 2.4.2 常规正态分布

```python
random.normal(loc,scale,size)也可以生成正态分布
#loc:期望
#scale:方差
#size:用于确定是几维的数列
```

![](/images/feishu/assets/2025-08-14-numpy-010.png)

## 2.5 ndarry属性（数组属性）

ndim:秩，维度个数

size:数组元素的个数

shape:数组的形状

dtype:数组元素的类型

itemsize:每个元素的大小，以字节为单位，一个字节8位 (结果其实就是数组的元素类型结果除8)

他们都是属性，通过数组.属性的形式来确定

如果需要输出多个可以通过以下方式：

```python
print(a.dtype,aa.dtype,aaa.dtype,aaa.itemsize)
```

## 2.6 其他方式创建数组

### 2.6.1 zeros()创建数组

①创建一维数组

```python
np.zeros(10)
"""
输出结果：
array([0., 0., 0., 0., 0., 0., 0., 0., 0., 0.])
"""
```

上方代码等价于：

```python
np.zeros(shape=(10))#创建10个元素的0数组
```

也可以指定类型

```python
#指定类型
np.zeros(5,dtype=int)
```

②创建二维数组

```python
np.zeros((3,4),dtype=int)
```

③创建三维数组

```python
#创建三维数组
np.zeros((3,4,5),dtype=int)
```

④zeros\_like:根据传入的数组形状创建全为0的数组

```python
#使用zeros_like将创建的一维数组变成全0的数组
a=np.arange(4)#这个得到的结果：一维数组0，1，2，3
np.zeros_like(a)
#使用zeros_like将创建的二维数组变成全0的数组
aa=np.random.random(size=(4,5))
np.zeros_like(aa)
```

### 2.6.2 ones()创建数组

与zeros的用法一模一样，两者如果不指定元素类型的话，都默认为浮点型

### 2.6.3 empty()创建数组

①empty()用法

```python
numpy.empty(shape,dtype=float,order='c')
```

创建的一个指定形状(shape)、数据类型(dtype)且未初始化的数组，里边的元素的值是之前内存的值

order:有"C"和"F"两个选项,分别代表，行优先和列优先，在计算机内存中的存储元素的顺序。

![](/images/feishu/assets/2025-08-14-numpy-011.png)

②empty()用法

```python
y=np.empty(10,dtype=int)
x=np.arange(5)
np.add(2,x,out=y[:5])
#指的是x数列中的每个元素都加2，然后再out存到y中，是存放到的是前五个
y
```

输出结果：

![](/images/feishu/assets/2025-08-14-numpy-012.png)

```python
x=np.arange(1,6)
y=np.empty(5,dtype=int)
np.add(x,2,out=y)
#将数列x中的每个元素都加2，然后放到y数列中去
```

③empty\_like()

**创建一个****与给定数组形状和数据类型相同****，但内容未初始化的新数组。**

`np.empty_like()`不会清空内存中的原数据，它只是分配一块与原数组相同大小和类型的内存区域。

![](/images/feishu/assets/2025-08-14-numpy-013.png)

### 2.6.4 ？？用法

当想查看一个函数的参数时，可以通过？？来实现

```python
np.full??
```

### 2.6.5 full()创建数组

```python
full(shape,fill_value)
创建全为某个指定值的数组
```

①一维数组

```python
#创建一个一维数组,以20进行填充
np.full(10,20)
```

②二维数组

```python
#创建二维数组
np.full((3,5),11)
```

③full\_like用法

跟上边的zeros\_like()和ones\_like()的用法一模一样

这里是指定填充而已

```python
#创建一个指定形状数组
a=np.arange(1,37).reshape(4,9)
#进行指定填充
np.full_like(a,10)
```

输出结果：

![](/images/feishu/assets/2025-08-14-numpy-014.png)

### 2.6.6 创建单位矩阵

#### 2.6.6.1 法1：eye()函数

```python
np.eye(4,dtype=int)
#四行四列的单位矩阵，是二维的，并且里边的元素全为整型
```

#### 2.6.6.2 法2：identity()

```python
#identity()
np.identity(5,dtype=int)
```

两个函数是有区别的

![](/images/feishu/assets/2025-08-14-numpy-015.png)

![](/images/feishu/assets/2025-08-14-numpy-016.png)

```python
# 创建一个 3 行 4 列的矩阵，对角线在第 0 条（默认）
np.eye(3, 4)
# 输出:
# [[1. 0. 0. 0.]
#  [0. 1. 0. 0.]
#  [0. 0. 1. 0.]]

# 对角线向上偏移1
np.eye(3, 4, k=1)
# 输出:
# [[0. 1. 0. 0.]
#  [0. 0. 1. 0.]
#  [0. 0. 0. 1.]]

```

### 2.6.7 linspace创建等差数列

```python
#linspace函数用于创建一个一维数组，数组是一个等差数列构成的，格式如下：
"""
np.linspace(start,|stop,num=50,endpoint=True,retstep=False,dtype=None)
参数介绍：
start：序列的起始值
stop:序列的终止值，如果endpoint为True，该值包含数列中
num：要生长的等步长的样本数量，默认为50
endpoint：该值为True时，数列中包含stop值，反之不包含，默认是True
retstep：如果为True时，生长的数组中会显示间距，反之不显示
dtype：ndarry的数据类型
"""
```

![](/images/feishu/assets/2025-08-14-numpy-017.png)

这里num=是可以省略的

也就是下方两行代码结果是一模一样的

```python
np.linspace(1,5,5)
np.linspace(1,5,num=5)
```

### 2.6.8 logspace创建等比数列

```python
#logspace函数用于创建一个等比数列，格式如下：
"""
np.logspace(start,stop,num=50,endpoint=True,base=10.0,dtype=None)
参数为：
start:序列的起始位置为：base**start
stop：序列的终止值为：base**stop。如果endpoint为True，该值包含于数列
num：要生长的等步长的样本数量，默认为50
endpoint：是否包含 stop 这个值，默认是 True
base：对数的底数，默认是 10（常见对数）
dtype：ndarry的数据类型
"""
```

![](/images/feishu/assets/2025-08-14-numpy-018.png)

logspace()函数中的num参数也是可以不写num=的

endpoint是不可以省略的
