---
title: 3. 电机ID配置与机械臂校准
description: 
---

# 3. 电机 ID 配置与机械臂校准

## 3.1 配置电机 ID

每个电机都需要唯一 ID。新电机默认常见为 `1`，需要改成机械臂链路里不冲突的编号。

方式一：用 LeRobot 命令逐步写入。

```bash
# 主臂舵机配置 ID
lerobot-setup-motors \
  --teleop.type=so101_leader \
  --teleop.port=/dev/ttyACM0

# 从臂舵机配置 ID
lerobot-setup-motors \
  --robot.type=so101_follower \
  --robot.port=/dev/ttyACM1
```

方式二：使用对应舵机厂商调试工具改 ID（排障时也常用）。

## 3.2 机械臂校准

校准时先把关节放到行程中间位置，按提示在全行程内运动每个关节。

```bash
# 主臂校准
lerobot-calibrate \
  --teleop.type=so101_leader \
  --teleop.port=/dev/ttyACM0 \
  --teleop.id=my_awesome_leader_arm

# 从臂校准
lerobot-calibrate \
  --robot.type=so101_follower \
  --robot.port=/dev/ttyACM1 \
  --robot.id=my_awesome_follower_arm
```
