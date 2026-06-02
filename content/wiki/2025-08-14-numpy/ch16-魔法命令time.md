---
title: 16.魔法命令time
description: 
---

# 16.魔法命令time

魔法命令是ipython提供特殊命令，能实现一些特殊功能，比如统计时间(time/timeit)和占用内存(memit/mprun)等功能,魔法命令有种形式：

%:行模式

%%:单元格模式

IPython 是一个“更强大、更智能”的 Python 交互式命令行工具，比你平时在终端运行的 python 要聪明得多。

```python
#程序执行时间
import time 
#获取时间
start=time.time()
time.sleep(0.4)#让程序暂停执行 0.4 秒（即 400 毫秒）再继续运行
#获取时间
end=time.time()
end-start
```

![](/images/feishu/assets/2025-08-14-numpy-039.png)
