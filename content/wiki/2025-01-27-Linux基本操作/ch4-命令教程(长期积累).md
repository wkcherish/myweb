---
title: 4. 命令教程(长期积累)
description: 
---

# 4. 命令教程(长期积累)
    

1.  大多数命令
    

常用 Linux 命令速查：

```Bash
# 文件与目录
ls        # 列出目录内容
cd        # 切换目录
pwd       # 显示当前路径
mkdir     # 创建目录
rm        # 删除文件或目录
cp        # 复制文件或目录
mv        # 移动/重命名文件或目录
touch     # 创建空文件
cat       # 查看文件内容
head/tail # 查看文件头部/尾部

# 权限管理
chmod     # 修改文件权限
chown     # 修改文件所有者
sudo      # 以管理员身份执行

# 系统信息
uname     # 系统信息
df        # 磁盘使用情况
free      # 内存使用情况
top/htop  # 进程监控
ps        # 查看进程

# 网络
ping      # 测试网络连通性
curl      # 发送 HTTP 请求
wget      # 下载文件
ssh       # 远程登录
scp       # 远程文件传输

# 包管理（Debian/Ubuntu）
apt update   # 更新软件源
apt install  # 安装软件包
apt remove   # 卸载软件包
```

  

2.  KDE Dolphin 以root打开
    

kde5

```Bash
pkexec env DISPLAY=$DISPLAY XAUTHORITY=$XAUTHORITY KDE_SESSION_VERSION=5 KDE_FULL_SESSION=true dolphin
```

kde6

```Bash
pkexec env DISPLAY=$DISPLAY XAUTHORITY=$XAUTHORITY KDE_SESSION_VERSION=6 KDE_FULL_SESSION=true dolphin
```
