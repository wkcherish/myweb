---
title: 2. 环境准备与设备连接
description: 
---

# 2. 环境准备与设备连接

## 2.1 系统与环境

可用系统：Linux / Windows(Wsl2) / macOS。

建议使用 conda 创建独立虚拟环境，并按官方文档安装 `lerobot` 依赖。

## 2.2 机械臂串口识别

需要用拓展坞把 usb 和电源接到 MotorBus。执行端口探测命令：

```bash
lerobot-find-out
```

按提示断开/接回线缆后，记录识别出的串口（如 `/dev/ttyACM0`、`/dev/ttyACM1`）。

## 2.3 串口授权

```bash
sudo chmod 666 /dev/ttyACM0
sudo chmod 666 /dev/ttyACM1
```

说明：

- `sudo`：以 root 权限执行命令。
- `chmod`：修改设备节点权限。
- `666`：`rw-rw-rw-`，所有用户可读写。
- 串口号必须替换为你机器上的真实端口。
