---
title: 10.算数函数
description: 
---

# 10.算数函数

加减乘除运算跟python基础语法没区别

除了python那种方法外还可以使用函数

加：np.add(a,b)

减：np.subtract(a,b)

乘：np.multiply(a,b)

除：np.divide(a,b) == a/b

取余：np.mod(a,b) == a%b

必须会的用法：

```python
a=np.arange(9).reshape(3,3)
b=np.array([10,10,10])
result=np.empty_like(a)
np.add(a,b,out=result)
result
```

总结：使用函数可以使用out参数将结果放到具体的位置，在进行运算时，两个数组形状不同时，会进行广播操作，变成一样的
