---
title: 17.魔法命令timeit
description: 
---

# 17.魔法命令timeit

timeit可以循环执行被统计语句，得到平均执行时间，支持行模式和单元格模式

timeit命令参数，-n指定每轮测试次数，-r指定测试轮数(默认为7)

单元格模式：

第一行语句(与timeit同一行语句)为初始化语句，作用为后续代码中变量提供初始化功能

初始化语句执行次数由轮数来决定

初始化语句每轮测试只执行一次，且不参与计时。第二行至整个单元格末尾语句会执行相应次数，并参与计时

![](../../public/images/feishu/assets/2025-08-14-numpy-040.png)

![](../../public/images/feishu/assets/2025-08-14-numpy-041.png)
