---
title: 8. 策略部署与自动采集
description: 
---

# 8. 策略部署与自动采集

使用已训练好的 ACT 模型驱动从臂执行，并继续录制新数据：

```bash
lerobot-record \
  --robot.type=so101_follower \
  --robot.port=/dev/ttyACM1 \
  --robot.cameras="{ front: {type: opencv, index_or_path: 4, width: 640, height: 480, fps: 30}}" \
  --robot.id=my_awesome_follower_arm \
  --display_data=false \
  --dataset.repo_id="Embodied-AI-6/so101_test" \
  --dataset.single_task="Grab the green cube" \
  --policy.path="Embodied-AI-6/lerobot_new"
```

- `--policy.path`：已训练策略的本地路径或远程仓库路径。
