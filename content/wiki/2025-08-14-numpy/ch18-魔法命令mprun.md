---
title: 20.魔法命令mprun
description: 
---

# 20.魔法命令mprun

逐行分析数据内存的使用情况

语法格式：

%mprun -f 模块名.函数名 模块名.函数名()

分析结果列如下：

Line行号

Mem usage内存使用大小

increment内存增量

Line content代码内容

补充说明：

mprun不是Ipython内置，需要安装memory\_profiler模块

安装后，需要通过%load\_ext memory\_profiler载入，才能使用

mprun测试的函数必须定义在独立模块中，不能定义在交互式Ipython环境中,要把它写入文件当中

如果需要重新加载模块，可以调用importlib模块提供reload函数

![](../../public/images/feishu/assets/2025-08-14-numpy-044.png)

这个时候如果将函数里边range()范围改了，则重新运行之后，结果increment的每一句代码是不变的

这时候需要重新加载模块

```python
#重新加载模块
import importlib
importlib.reload(mprun_test)
%mprun -f mprun_test.fun_test mprun_test.fun_test()
```
