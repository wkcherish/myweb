---
title: 6.数组的拼接
description: 
---

# 6.数组的拼接

## 6.1 使用concatenate数组拼接

使用concatenate进行数组拼接连接沿现有轴的数组数列

函数内部传两个数列构成的数列或者元组

①一维数组的拼接

```python
a=np.array([1,2,3])
b=np.array([4,5,6])
#调用concatenate进行数组拼接
np.concatenate((a,b))
#这里函数内部是以数列或者元组的形式进行传递的，也可以使用数列
#np.concatenate([a,b])
```

②一维多个数组拼接

```python
#也可以多个数组进行拼接
c=np.array([10,11,13])
c
np.concatenate((a,b,c))
```

③二维数组拼接

```python
#二维数组使用concatenate进行拼接
aa=np.arange(1,13).reshape(3,4)
bb=np.arange(101,113).reshape(3,4)
#调用concatenate进行拼接,axis默认值为0，按行;axis=1时按列
#concatenate是有两个参数的，一个是要拼接数组组成的数列或者元组，另一个是轴axis
np.concatenate((aa,bb),axis=0)
```

结果：

![](/images/feishu/assets/2025-08-14-numpy-024.png)

```python
#指定axis为1进行拼接
np.concatenate((aa,bb),axis=1)
```

结果：

![](/images/feishu/assets/2025-08-14-numpy-025.png)

**二维数组总结：0竖着方向，1横着方向**

④三维数组拼接

#concatenate()三维数组拼接，axis有三个维度0，1，2

```python
#两个三行六列
aaa=np.arange(1,37).reshape(2,3,6)
bbb=np.arange(101,137).reshape(2,3,6)
#axis=0
s=np.concatenate((aaa,bbb),axis=0)
s.shape
#输出：(4,3,6)
#axis=1
ss=np.concatenate((aaa,bbb),axis=1)
ss.shape
#输出：(2,6,6)
#axis=2
np.concatenate((aaa,bbb),axis=2).shape
#输出：（2，3，12）
```

⑤四维数组拼接

```python
#两个三行六列
aaa=np.arange(1,37).reshape(2,3,6)
bbb=np.arange(101,137).reshape(2,3,6)
aaaa=aaa.reshape(2,3,3,2)
bbbb=bbb.reshape(2,3,3,2)
#axis=0
np.concatenate((aaaa,bbbb),axis=0).shape
#结果：（4，3，3，2）
#axis=1
np.concatenate((aaaa,bbbb),axis=1).shape
#结果：（2，6，3，2）
#axis=2
np.concatenate((aaaa,bbbb),axis=2).shape
#结果：（2，3，6，2）
#axis=3
np.concatenate((aaaa,bbbb),axis=3).shape
#结果：（2，3，3，4）
```

## 6.2 使用hstack数组拼接

使用hstack进行数组拼接，水平堆叠序列中的数组(列方向)

①二维数组

```python
aa=np.arange(1,13).reshape(3,4)
bb=np.arange(101,113).reshape(3,4)
np.hstack((aa,bb))
#跟concatenate函数方法一样，把要拼接的数组放到数列或者元组中去
#np.hstack([aa,bb])
```

结果：

![](/images/feishu/assets/2025-08-14-numpy-026.png)

等效于concatenate()函数中axis=1时的情况

②三维数组

```python
#两个三行六列
aaa=np.arange(1,37).reshape(2,3,6)
bbb=np.arange(101,137).reshape(2,3,6)
#使用hstack
np.hstack((aaa,bbb)).shape
#输出：（2，6，6）
```

## 6.3 使用vstack数组拼接

使用vstack进行数组拼接，竖直堆叠序列中的数组(行方向)

①二维数组

```python
aa=np.arange(1,13).reshape(3,4)
bb=np.arange(101,113).reshape(3,4)
#vstack 垂直方向进行堆叠
np.vstack((aa,bb))
#与hstack传的参数类似，等价于：
np.vstack([aa,bb])
```

结果：

![](/images/feishu/assets/2025-08-14-numpy-027.png)

②三维数组

```python
#两个三行六列
aaa=np.arange(1,37).reshape(2,3,6)
bbb=np.arange(101,137).reshape(2,3,6)
#使用vstack
np.vstack((aaa,bbb)).shape
#输出：（4，3，6）
```

## 6.4 使用dstack数组拼接

该方法是三维数组特有的方法

也就是说

一维数组拼接方法用：concatenate()

二维数组拼接方法用: concatenate(),hstack(),vstack()

三维数组拼接方法用: concatenate(),hstack(),vstack(),dstack()

四维数组及多维数组只能用concatenate进行拼接

```python
#两个三行六列
aaa=np.arange(1,37).reshape(2,3,6)
bbb=np.arange(101,137).reshape(2,3,6)
#使用dstack
np.dstack((aaa,bbb)).shape
#结果：（2，3，12）
```
