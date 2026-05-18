---
title: 4. 遥操与相机接入
description: 
---

# 4. 遥操与相机接入

## 4.1 不带相机遥操

```bash
lerobot-teleoperate \
  --robot.type=so101_follower \
  --robot.port=/dev/ttyACM1 \
  --robot.id=my_awesome_follower_arm \
  --teleop.type=so101_leader \
  --teleop.port=/dev/ttyACM0 \
  --teleop.id=my_awesome_leader_arm
```

## 4.2 查找相机并启用可视化

```bash
lerobot-find-cameras opencv
```

```bash
lerobot-teleoperate \
  --robot.type=so101_follower \
  --robot.port=/dev/ttyACM1 \
  --robot.id=my_awesome_follower_arm \
  --robot.cameras="{ front: {type: opencv, index_or_path: /dev/video4, width: 640, height: 480, fps: 30}}" \
  --teleop.type=so101_leader \
  --teleop.port=/dev/ttyACM0 \
  --teleop.id=my_awesome_leader_arm \
  --display_data=true
```

相机参数说明：

- `front`：相机名称。
- `type: opencv`：相机驱动类型。
- `index_or_path`：设备编号或设备路径（如 `/dev/video4`）。
- `width` / `height`：图像分辨率。
- `fps`：采样帧率。
- `--display_data=true`：启用实时可视化。
