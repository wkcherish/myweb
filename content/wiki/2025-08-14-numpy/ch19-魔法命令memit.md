---
title: 19.魔法命令memit
description: 
---

# 19.魔法命令memit

memit：用于分析语句内存使用情况，memit支持行模式与单元格模式。单元格模式下，初始化语句不会参与计算内存。第二行至整个单元格末尾会参与计算内存

说明：

memit不是Ipython的内置，需要安装memory\_profiler模块(pip install memory\_profiler)

安装后，需要通过%load\_ext memory\_profiler载入，才能使用

![](../../public/images/feishu/assets/2025-08-14-numpy-043.png)

补充：

Python 3.12+ 版本已经完全移除了 distutils 模块，而许多工具链（包括 IPython 的旧版本）仍依赖它

在 Python 3.10+ 版本中，distutils 库已被弃用，并在 Python 3.12 中完全移除。在加载 memory\_profiler 扩展时，因为 IPython 的旧版本依赖 distutils,当前python版本太高，所以如果不升级升级 IPython 和依赖库或者降python版本的话会报错

解决方法：

1.cmd

2.依次输入以下代码：

#升级 IPython 到兼容 Python 3.12+ 的版本

pip install --upgrade ipython

#升级 memory\_profiler 和 setuptools

pip install --upgrade memory\_profiler setuptools
