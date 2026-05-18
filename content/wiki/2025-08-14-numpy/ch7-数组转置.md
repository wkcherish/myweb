---
title: 7.数组转置
description: 
---

# 7.数组转置

使用transpose()函数

```python
import numpy as np
a= np.arange(1,13).reshape(4,3)
#二维数组转置
#调用transpose()函数
a.transpose()
#对于二维数组也可以采用.T来实现
a.T#与上述代码一样
#结果：
'''
array([[ 1,  4,  7, 10],
       [ 2,  5,  8, 11],
       [ 3,  6,  9, 12]])
'''
```

也可以使用np.transpose()的形式

#多维数组进行转置 np.transpose()

#对二维数组也可以使用np.transpose()进行转置

#这个有两个维度，第一个是数组，第二个是维度,可以是数列也可以是元组的形式传到这个函数中

第二个参数，维度可以理解为用axis中的数来理解

对于二维数组，axis是有两个值的0，1 进行转置就传（1,0）两者进行了替换

对于三维数组，axis是有三个值的0，1，2，进行转置，想换哪个就将默认的(0,1,2)进行改

四维及以上的数组也是一样的道理

```python
x=np.arange(1,37).reshape(3,6,2)
x.shape
#结果：（3,6,2）
#使用np.transpose()进行转置 变为(2,6,3)
np.transpose(x,(2,1,0)).shape
#结果：(2,6,3)
aaaa=np.arange(1,37).reshape(3,2,1,6)
aaaa.shape
#结果：（3，2，1，6）
#使用np.transpose()进行转置 变为(2,1,3,6)
np.transpose(aaaa,(1,2,0,3)).shape
#结果：(2,1,3,6)
```
