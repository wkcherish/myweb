---
title: 2. Linux装机教程
description: 
---

# 2. Linux装机教程
    

## 2.1 实体机
    

使用清华源：（Ubuntu24.04）

https://mirrors.tuna.tsinghua.edu.cn/ubuntu-releases/24.04/

## 2.2 普通虚拟机
    

### 2.2.1 下载VirtualBox虚拟机

[https://www.virtualbox.org/wiki/Download\_Old\_Builds\_7\_0](https://www.virtualbox.org/wiki/Download_Old_Builds_7_0)

![](/images/feishu/assets/2025-01-27-Linux基本操作-001.png)

![](/images/feishu/assets/2025-01-27-Linux基本操作-002.png)

![](/images/feishu/assets/2025-01-27-Linux基本操作-003.png)

![](/images/feishu/assets/2025-01-27-Linux基本操作-004.png)

![](/images/feishu/assets/2025-01-27-Linux基本操作-005.png)

内存4G（4096MB）；

CPU给4个核；

硬盘动态分配60G；

除了上面这三项，其它的默认即可，最后点击“Finish”。

### 2.2.2 安装Ubuntu

按照1.1的步骤下载Ubuntu

![](/images/feishu/assets/2025-01-27-Linux基本操作-006.png)

点击启动(绿色大箭头)，过一段时间出现下图中的小界面，往下拉选择中文简体，然后点击“安装Ubuntu”

![](/images/feishu/assets/2025-01-27-Linux基本操作-007.png)

键盘布局默认“Chinese”并点击“继续”，如果找不到“继续”就用Alt+F7，然后往上拖鼠标即可看到（注意拖鼠标的过程中不要点击鼠标，拖到目标位置后再点击鼠标）。

![](/images/feishu/assets/2025-01-27-Linux基本操作-008.png)

选择“正常安装”(找不到都用Alt+F7)， **不选** “安装Ubuntu时下载更新”，其余都默认并继续

清除整个磁盘并安装Ubuntu，现在安装。(不会清除windows的磁盘，放心安装)

将改动写入磁盘吗 继续

选择东八区（shanghai，大致在地图上点一下），继续

姓名、计算机名、用户名、密码都自己设置，越简单越好(密码需牢记)。 自动登录 继续

就开始安装了,比较耗时，只要Skip高亮了就点击之（这样省时，光标是圆圈也能点击）

安装完成后，现在重启，重启过程中根据提示按回车键。 进入系统后不要升级，且第一次进系统需设置一些信息，根据提示 **除了** 选不发送系统信息与不升级之外， **其它** 都跳过或前进）

### 2.2.3 增强虚拟机体验感

#### 2.2.3.1 全屏

![](/images/feishu/assets/2025-01-27-Linux基本操作-009.png)

![](/images/feishu/assets/2025-01-27-Linux基本操作-010.png)

#### 2.2.3.2 文件交换

![](/images/feishu/assets/2025-01-27-Linux基本操作-011.png)

#### 2.2.3.3 新建文本文档

![](/images/feishu/assets/2025-01-27-Linux基本操作-012.png)

  

## 2.3 Windows Subsystem For Linux 2(Windows的Linux子系统2)
    

### 2.3.1 简介与优缺点
    

1.  什么情况下推荐？
    

无多余硬盘，没法实体装Linux。此时最优选择就是WSL2。而非VMware等虚拟机。

2.  优缺点：
    
    1.  优点：
        
        1.  WSL2是最好的Linux发行版;(bushi)
            
        2.  性能损耗极低。且比在Windows上跑深度性能 **强非常非常多;** （如下图，时间的数值越低证明性能越高）
            
        3.  非常方便调用USB设备，可以USB直通;
            
        4.  非常方便使用英伟达显卡的CUDA与cuDNN;
            
        5.  非常方便Win与WSL2互相传文件等协同操作;
            
        6.  WSL2中甚至可以在Linux的终端中使用Windows软件;
            
        7.  非常方便使用Windows的VScode远程开发;
            
    2.  缺点：
        
        1.  无法调用本机摄像头，或说调用本机摄像头会巨麻烦。（虽无法调用本机摄像头，但是可以使用USB的摄像头）
            

![](/images/feishu/assets/2025-01-27-Linux基本操作-013.png)

### 2.3.2 安装教程
    

#### 2.3.2.1 启动WSL2子系统和虚拟平台
    

1.  方法一(图形界面)
    

用Win+R输入`appwiz.cpl`：

![](/images/feishu/assets/2025-01-27-Linux基本操作-014.png)

点击OK进入 **程序和功能/Programs and Features** 界面，点击 **启用或关闭Windows功能/Turn Windows features on or off** ：

![](/images/feishu/assets/2025-01-27-Linux基本操作-015.png)

选择 **适用于Linux的Windows子系统/Windows Subsystem for Linux** 和 **虚拟机平台/Virtual Machine Platform** 功能：

![](/images/feishu/assets/2025-01-27-Linux基本操作-016.png)

  

2.  方法二(命令行)
    

```PowerShell
# 开启 Linux 子系统
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
# 开启虚拟机平台
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

  

#### 2.3.2.2 将WSL2设置为默认版本
    

用管理员权限打开powershell

![](/images/feishu/assets/2025-01-27-Linux基本操作-017.png)

升级WSL并设置默认版本为WSL2

```PowerShell
# 更新 wsl
wsl --update
# 将 wsl 版本设置为 wsl2
wsl --set-default-version 2
```

#### 2.3.2.3 安装Linux发行版
    

1.  方式一(商店下载)
    

直接打开Microsoft Store搜索对应的发行版下载即可(比如Ubuntu 24.04 LTS)

![](/images/feishu/assets/2025-01-27-Linux基本操作-018.png)

2.  方式二(命令行安装)
    

```PowerShell
# 列出可安装的 Linux 版本
#（需要科学手段）
wsl --list --online
```

  

![](/images/feishu/assets/2025-01-27-Linux基本操作-019.png)

选择对应发行版并安装

```PowerShell
# Ubuntu安装完毕后需要重启系统
wsl --install -d Ubuntu-24.04
```

  

#### 2.3.2.4 查看系统状态
    

```PowerShell
# 查看 wsl
wsl -l
# 查看 wsl 运行版本或模式
wsl -l -v


# 设置发行版为使用 wsl 2 （如果版本为 2 则不需要）
wsl --set-version <distro> 2
# 选择要注销的版本 （如果想卸载再用此命令）
wsl --unregister <distro>
```

输出Version为2即正常

![](/images/feishu/assets/2025-01-27-Linux基本操作-020.png)

  

#### 2.3.2.5 设置用户名与密码
    

直接在Powershell里输入wsl命令进入子系统

```PowerShell
# 进入子系统
wsl
```

输入用户名(随便设置，建议字母+数字，或者纯字母)

输入密码(建议低于6位的数字，并且在输入密码时，终端上不会显示输入的字符，但是已经正常输入了)

![](/images/feishu/assets/2025-01-27-Linux基本操作-021.png)

  

### 2.3.3 配置各种环境
    

#### 2.3.3.1 换源
    

(同实体机LINUX，往下找教程)

#### 2.3.3.2 英伟达显卡
    

##### 2.3.3.2.1 显卡驱动
    

不用安装，只要你的Windows安装了驱动，你的WSL2就已经安装好驱动了。

![](/images/feishu/assets/2025-01-27-Linux基本操作-022.png)

![](/images/feishu/assets/2025-01-27-Linux基本操作-023.png)

##### 2.3.3.2.2 CUDA
    

前往 NVIDIA CUDA Toolkit 下载页面：https://developer.nvidia.com/cuda-downloads

![](/images/feishu/assets/2025-01-27-Linux基本操作-024.png)![](/images/feishu/assets/2025-01-27-Linux基本操作-025.png)

在下方的网站，选择合适的版本。

WSL2 专属 CUDA 指南：https://docs.nvidia.com/cuda/wsl-user-guide/index.html

**(同实体机LINUX，往下找教程，唯一与实体机不同的地方如下图)**

![](/images/feishu/assets/2025-01-27-Linux基本操作-026.png)

挨行敲一遍

![](/images/feishu/assets/2025-01-27-Linux基本操作-027.png)

敲完后，输入`nvcc -V`检测是否安装成功，如果出现下图，证明没配置环境。

![](/images/feishu/assets/2025-01-27-Linux基本操作-028.png)

（请详看下方教程的**安装CUDA的配置环境来看**如何配置环境）

  

  

##### 2.3.3.2.3 cuDNN
    

(同实体机LINUX，往下找教程)

![](/images/feishu/assets/2025-01-27-Linux基本操作-029.png)

#### 2.3.3.3 VScode远程开发
    

(一定要把工程放在Linux中开发，别放在Win磁盘中，否则I/O效率会很低)

安装该插件(WSL2有自己的远程开发插件，无需使用SSH）。

![](/images/feishu/assets/2025-01-27-Linux基本操作-030.png)

连接WSL2

![](/images/feishu/assets/2025-01-27-Linux基本操作-031.png)

远程开发成功。

![](/images/feishu/assets/2025-01-27-Linux基本操作-032.png)

![](/images/feishu/assets/2025-01-27-Linux基本操作-033.png)

![](/images/feishu/assets/2025-01-27-Linux基本操作-034.png)

#### 2.3.3.4 Linux终端使用Windows软件
    

![](/images/feishu/assets/2025-01-27-Linux基本操作-035.png)

#### 2.3.3.5 OpenGL有问题
    

```Bash
sudo apt update
sudo apt upgrade
sudo apt install mesa-utils

#然后重启wsl2即可
```
