---
title: 1.验证深度学习环境
description: 
---

# 1.验证深度学习环境

关于环境的安装，看[Pytorch-->深度学习](https://acn59hvfac4g.feishu.cn/docx/K4cjdAj26ogJLGxVfWTcrwo6nih)

补充一点安装cuda和cudnn时，使用指令比较好一些，不用单独进行安装，安装pytorch时直接安依赖包就可以（ `pytorch-cuda=12.4` 是一个“ **元包（meta-package）** ”，它并不包含真正的 CUDA 文件，而是一个 **依赖集合，** 里边包含了所需要的一些包，需要注意的是安装前先查看电脑支持的cuda最高版本，要安装的cuda版本小于等于13.0

![](../../public/images/feishu/assets/2025-11-03-深度学习基础-001.png)

```bash
# CUDA 12.4
conda install pytorch==2.5.1 torchvision==0.20.1 torchaudio==2.5.1 pytorch-cuda=12.4 -c pytorch -c nvidia
```

）：

https://pytorch.org/get-started/previous-versions/

```python
# 对深度学习环境进行测试
import torch
# 查看cuda是否被激活
flag=torch.cuda.is_available()
print("cuda:", flag)   #返回true的话说明被激活
# 进行调用查看:有GPU调用GPU，没有GPU调用CPU
ngpu=1
device=torch.device("cuda:0" if(torch.cuda.is_available() and ngpu>0) else "cpu")
print(device)
print(torch.cuda.get_device_name(0))
print(torch.rand(3,3).cuda())
# 查看cuda和cudnn的版本
cuda_version=torch.version.cuda
print("cuda version",cuda_version)
cudnn_version=torch.backends.cudnn.version()
print("cudnn version",cudnn_version)
```

![](../../public/images/feishu/assets/2025-11-03-深度学习基础-002.png)

cuda:0 指的是一块显卡
