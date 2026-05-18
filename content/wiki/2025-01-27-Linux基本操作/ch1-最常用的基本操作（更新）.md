---
title: 1. 最常用的基本操作（更新）
description: 
---


# 1. 最常用的基本操作（更新）

装linux系统教程：

https://me.tungchiahui.cn/blog/linux-tutorial/

```Bash
#更新相关的知识
# 更新软件包列表（从服务器获取最新软件信息）
sudo apt update
# 升级所有可更新的软件包（不删除旧包）
sudo apt upgrade
#更新和升级软件包
sudo apt update && sudo apt upgrade -y
#列出可更新的软件包及版本信息
apt list --upgradable
#彻底升级（处理依赖关系，可能删除旧包）
sudo apt full-upgrade
#设置指定版本
sudo apt install <package_name>=<version_number>
#只安装软件包不升级
sudo apt install <package_name> --no-upgrade
#只升级，不存在就不安装
sudo apt install <package_name> --only-upgrade

#安装指定的软件命令
sudo apt install <package_name>

#安装多个软件包
sudo apt install <package_1> <package_2> <package_3>

#更新指定的软件命令
sudo apt update <package_name>

#显示软件包具体信息,例如：版本号，安装大小，依赖关系等等
apt show <package_name>

#删除软件包命令
sudo apt remove <package_name>

# 清理旧版本和缓存（释放磁盘空间）
sudo apt autoremove  # 删除不再需要的依赖和库文件
sudo apt clean       # 清理下载的缓存包

#移除软件包及配置文件
sudo apt purge <package_name>

#查找软件包命令
sudo apt search <keyword>

#列出所有已安装的包
apt list --installed

#列出所有已安装的包的版本信息
apt list --all-versions
```
