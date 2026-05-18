---
title: 5.改变数组的维度
description: 
---

# 5.改变数组的维度

## 5.1 使用reshape()

通过reshape方法可以将一维数组变成二维数组、三维或者多维数组，也可以通过reshape方法将多维数组变成一维

①一维数组转换为二维数组

```python
a=np.arange(1,13)
#将一维数组进行转换
#注意点：元素个数不可以变
#转换维度要保持一致，不一致就异常！！！
aa=a.reshape(2,6)
```

②一维数组转换为三维数组

```python
aaa=a.reshape(2,3,2)
```

③二维数组转化为一维数组

```python
#知道元素个数：
aa.reshape(12)
```
```python
#不知道元素个数，参数传递-1
aa.reshape(-1)
```

④三维数组转换为一维数组

```python
aaa.reshape(-1)
```

## 5.2 使用revel()转换为一维数组

```python
aa=np.arange(1,13).reshape(2,6)#转换为2行6列的数组
aa.revel()
#结果：
#array([ 1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12])
```

## 5.3 使用flatten()转换为一维数组

```python
aa=np.arange(1,13).reshape(2,6)
aa.flatten()
#结果：
#array([ 1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12])
```

## 5.4 使用resize()

改变数组的维度还可以直接设置numpy数组的shape属性（元组类型）

通过resize方法可以改变数组的维度

#resize修改数组维度

#以元组的形式指定形状

#改变的是原数组

```python
a=np.arange(1,13)
a.shape=(2,6)#改变了原数组
a=resize((12))
#结果：
#array([ 1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12])
```
```python
a.resize((6,2))
#结果：
'''
array([[ 1,  2],
       [ 3,  4],
       [ 5,  6],
       [ 7,  8],
       [ 9, 10],
       [11, 12]])
'''
```

## 5.5 使用数组shape属性修改

改变了原数组

```python
a=np.arange(1,13)
a.shape=(2,6)
#结果：
'''
array([[ 1,  2,  3,  4,  5,  6],
       [ 7,  8,  9, 10, 11, 12]])
'''
```

## 5.6 重要比较：

![](../../public/images/feishu/assets/2025-08-14-numpy-022.png)

口诀：NumPy 函数要么用 `shape`，要么用 `size`，创建结构用 shape，造数据用 size

![](../../public/images/feishu/assets/2025-08-14-numpy-023.png)
