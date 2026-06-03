---
title: mujoco学习
description: 仿真搭建。
category: 机器人
---

# MuJoCo 学习

这套笔记面向从零开始学习 MuJoCo 的工程复现路线。目标不是只让你复制代码跑通，而是让你看懂：

1. MuJoCo 模型文件在描述什么。
2. Python 代码怎样读取和推进仿真。
3. `qpos`、`qvel`、`ctrl` 这些数组为什么重要。
4. 如何从一个会掉落的小方块，逐步搭出 Cartpole、Reacher 和 Gymnasium 风格环境。

默认环境为 Fedora 44、Python >= 3.10、`mujoco>=2.3` 官方 Python bindings。

注意：本文禁止使用 `mujoco-py`。所有示例均使用：

```python
import mujoco
```

## 适合谁阅读

如果你符合下面任意一种情况，可以从第 1 章开始按顺序学：

1. 没学过 MuJoCo，只会一点 Python。
2. 看过强化学习环境，但不知道 MuJoCo 环境是怎么写出来的。
3. 想复现机器人控制、模仿学习、VLA 数据采集，但对仿真模型没有概念。
4. 以前接触过 `mujoco-py`，现在想迁移到官方 `mujoco` Python bindings。

阅读前只需要知道 Python 的变量、函数、列表或数组大概是什么。NumPy 不熟也没关系，教程会尽量解释每个数组的含义。

## MuJoCo 到底是什么

MuJoCo 是一个物理仿真引擎。你可以把它理解成一个“机器人和物体的虚拟实验室”：

```text
你写 XML 描述世界里有什么
          ↓
MuJoCo 编译成物理模型
          ↓
Python 程序给关节或电机输入控制量
          ↓
MuJoCo 按物理规律更新位置、速度、碰撞、力
          ↓
你读取状态、计算奖励、保存数据或训练策略
```

在机器人、强化学习和具身智能里，MuJoCo 常用于：

1. 搭建机械臂、小车、摆杆、多足机器人等模型。
2. 快速测试控制算法，不必一开始就上真实机器人。
3. 生成强化学习环境。
4. 采集状态、动作、图像、奖励等训练数据。

## 学习前的心智模型

新手最容易卡在“XML 和 Python 代码到底谁负责什么”。可以先记住这个分工：

| 部分 | 负责什么 | 例子 |
|:---|:---|:---|
| MJCF XML | 定义世界和机器人结构 | 地面、盒子、关节、电机、摄像头 |
| `MjModel` | 编译后的静态模型 | 有几个关节、有几个电机、时间步长是多少 |
| `MjData` | 运行中的动态状态 | 当前时间、位置、速度、电机输入 |
| `mj_step` | 推进一步物理仿真 | 根据重力、力、碰撞更新状态 |
| Viewer / Renderer | 把仿真显示出来 | 打开窗口或保存图片 |

一句话总结：

```text
XML 决定“有什么”，MjModel 记住“结构”，MjData 记录“现在怎样”，mj_step 让时间往前走。
```

参考来源：

- MuJoCo Python 官方文档：<https://mujoco.readthedocs.io/en/stable/python.html>
- MuJoCo XML Reference：<https://mujoco.readthedocs.io/en/stable/XMLreference.html>
- MuJoCo Overview：<https://mujoco.readthedocs.io/en/stable/overview.html>

## 章节目录

1. [环境安装与第一个 MuJoCo 程序](/wiki/2025-05-17-mujoco-xue-xi/ch1-huan-jing-an-zhuang-yu-di-yi-ge-mujoco-cheng-xu)
2. [XML 与 MJCF 物理建模基础](/wiki/2025-05-17-mujoco-xue-xi/ch2-xml-yu-mjcf-wu-li-jian-mo-ji-chu)
3. [Python 控制接口：读取状态与推进仿真](/wiki/2025-05-17-mujoco-xue-xi/ch3-python-kong-zhi-jie-kou)
4. [关节、Actuator 与力控制](/wiki/2025-05-17-mujoco-xue-xi/ch4-guan-jie-actuator-yu-li-kong-zhi)
5. [Viewer 可视化与 Renderer 离屏渲染](/wiki/2025-05-17-mujoco-xue-xi/ch5-viewer-yu-renderer)
6. [控制任务：Cartpole](/wiki/2025-05-17-mujoco-xue-xi/ch6-cartpole-kong-zhi-ren-wu)
7. [控制任务：Reacher 机械臂到达目标](/wiki/2025-05-17-mujoco-xue-xi/ch7-reacher-kong-zhi-ren-wu)
8. [Gymnasium 风格强化学习接口基础](/wiki/2025-05-17-mujoco-xue-xi/ch8-gymnasium-jie-kou-ji-chu)

## 推荐学习路线

```text
环境安装
→ XML / MJCF 建模
→ MjModel / MjData
→ mj_step 控制循环
→ joint / actuator
→ viewer / renderer
→ cartpole / reacher
→ Gymnasium 环境接口
→ imitation learning / VLA 数据采集
```

不要跳过第 1 到第 4 章。后面的 Cartpole、Reacher 和 Gymnasium 环境，本质上都是在反复使用前面这几个核心概念。

## 建议的目录结构

为了避免代码散落，建议你在任意工作目录下新建一个学习文件夹：

```bash
mkdir -p mujoco_tutorial
cd mujoco_tutorial
```

每一章的代码都单独保存：

```text
mujoco_tutorial/
├── ch1_first_sim.py
├── ch2_xml_basic.py
├── ch3_python_state.py
├── ch4_joint_motor.py
├── ch5_viewer.py
├── ch5_renderer.py
├── ch6_cartpole.py
├── ch7_reacher.py
└── ch8_gym_env.py
```

这样出错时，你可以确认到底是哪一章的代码有问题。

## 学习方法

每章建议按这个顺序操作：

1. 先读“核心概念解释”，不用追求一次看懂所有细节。
2. 复制最小可运行代码，保存成指定文件。
3. 运行代码，确认没有报错。
4. 对照“运行结果说明”理解输出。
5. 做“验证步骤”，主动改一两个参数。
6. 遇到报错先看“常见错误与解决方案”。

不要只看不跑。MuJoCo 的学习重点是“改参数以后观察物理结果”，比如把重力变小、把电机力变大、把初始高度变高。只要你能预测并解释这些变化，就说明你真正理解了。

## 全局排错顺序

遇到问题时，按下面顺序查：

1. Python 环境是否激活：`which python`
2. MuJoCo 是否能导入：`python -c "import mujoco; print(mujoco.__version__)"`
3. 是否误装了 `mujoco-py`
4. XML 标签是否闭合、属性是否拼写正确
5. actuator 引用的 joint 名字是否存在
6. `data.ctrl` 的长度是否等于 `model.nu`
7. 修改 `qpos` 或 `qvel` 后是否调用了 `mujoco.mj_forward`
8. 图形显示问题是否和 OpenGL、GLFW、远程服务器有关
