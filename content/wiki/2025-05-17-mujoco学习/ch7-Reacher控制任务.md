# 7.控制任务：Reacher 机械臂到达目标

## 1.目标说明

本章搭建一个二维两关节 reacher 任务。

你将学习:

1. 两个 hinge joint
2. 两个 motor actuator
3. site 作为末端点和目标点
4. 根据末端和目标距离设计 reward
5. 构造机械臂任务的基本形式

这是后续机械臂模仿学习、VLA 任务的基础。

Reacher 任务可以理解为：

```text
一条两段机械臂
末端有一个蓝色 tip
空间里有一个红色 target
控制两个关节转动
让 tip 靠近 target
```

相比 Cartpole，Reacher 更接近机械臂任务，因为它开始关注“末端位置”和“目标位置”。

## 2.环境与依赖安装

Fedora 44 系统依赖:

```bash
sudo dnf install -y python3 python3-pip mesa-libGL mesa-dri-drivers glfw
```

pip:

```bash
pip install "mujoco>=2.3" numpy
```

conda:

```bash
conda create -n mujoco-reacher python=3.10 -y
conda activate mujoco-reacher
pip install "mujoco>=2.3" numpy
```

版本冲突说明:

1. 本章使用低维状态，不使用图像输入。
2. 机械臂是教学模型，不是 Franka、UR5 等真实机器人模型。
3. 如果后续使用 MuJoCo Menagerie，模型结构会更复杂，但读取 `qpos`、`qvel`、`site_xpos` 的方法一致。

## 3.核心概念解释

Reacher 任务核心:

```text
观测：关节角、关节速度、末端位置、目标位置
动作：两个关节的 motor 输入
奖励：末端到目标距离越小越好
```

读取 site 世界坐标:

```python
site_id = mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_SITE, "tip")
tip_pos = data.site_xpos[site_id]
```

### 为什么用 site 表示 tip 和 target

机械臂控制里经常关心“末端执行器在哪里”。如果只看关节角 `qpos`，你还要自己做正运动学计算。MuJoCo 已经帮你算好了 site 的世界坐标，所以可以直接读：

```python
tip = data.site_xpos[tip_site_id]
target = data.site_xpos[target_site_id]
```

这样 reward 就很容易写：

```python
dist = np.linalg.norm(tip - target)
reward = -dist
```

距离越小，`-dist` 越接近 0，奖励越高。

### 两关节机械臂的状态

这个模型有两个 hinge joint：

```text
data.qpos = [joint1_angle, joint2_angle]
data.qvel = [joint1_velocity, joint2_velocity]
```

再加上末端和目标位置：

```text
obs = [qpos, qvel, tip_xyz, target_xyz]
```

总维度：

```text
2 + 2 + 3 + 3 = 10
```

### 为什么 gravity 是 0

本章把重力设为：

```xml
<option timestep="0.01" gravity="0 0 0"/>
```

这是为了让问题更简单。没有重力时，控制器只需要考虑让末端靠近目标，不需要额外对抗机械臂下垂。真实机器人任务通常会有重力，并需要更好的控制器或重力补偿。

## 4.最小可运行代码（MRE）

```python
import mujoco
import numpy as np


XML = """
<mujoco model="two_link_reacher">
  <option timestep="0.01" gravity="0 0 0"/>

  <worldbody>
    <geom name="floor" type="plane" size="2 2 0.1" rgba="0.9 0.9 0.9 1"/>
    <site name="target" pos="0.5 0 0.4" size="0.04" rgba="1 0 0 1"/>

    <body name="link1" pos="0 0 0.4">
      <joint name="joint1" type="hinge" axis="0 1 0" damping="0.1"/>
      <geom name="link1_geom" type="capsule" fromto="0 0 0 0.3 0 0" size="0.025" mass="0.2" rgba="0.1 0.3 1 1"/>

      <body name="link2" pos="0.3 0 0">
        <joint name="joint2" type="hinge" axis="0 1 0" damping="0.1"/>
        <geom name="link2_geom" type="capsule" fromto="0 0 0 0.3 0 0" size="0.025" mass="0.2" rgba="0.1 0.8 0.3 1"/>
        <site name="tip" pos="0.3 0 0" size="0.03" rgba="0 0 1 1"/>
      </body>
    </body>
  </worldbody>

  <actuator>
    <motor name="motor1" joint="joint1" gear="1" ctrlrange="-1 1" ctrllimited="true"/>
    <motor name="motor2" joint="joint2" gear="1" ctrlrange="-1 1" ctrllimited="true"/>
  </actuator>
</mujoco>
"""


def site_position(model: mujoco.MjModel, data: mujoco.MjData, name: str) -> np.ndarray:
    site_id = mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_SITE, name)
    if site_id < 0:
        raise RuntimeError(f"site not found: {name}")
    return data.site_xpos[site_id].copy()


def get_obs(model: mujoco.MjModel, data: mujoco.MjData) -> np.ndarray:
    tip = site_position(model, data, "tip")
    target = site_position(model, data, "target")
    return np.concatenate([data.qpos.copy(), data.qvel.copy(), tip, target])


def reward(model: mujoco.MjModel, data: mujoco.MjData) -> float:
    tip = site_position(model, data, "tip")
    target = site_position(model, data, "target")
    dist = np.linalg.norm(tip - target)
    control_cost = 0.01 * np.sum(np.square(data.ctrl))
    return float(-dist - control_cost)


def main() -> None:
    model = mujoco.MjModel.from_xml_string(XML)
    data = mujoco.MjData(model)
    total_reward = 0.0

    for step in range(500):
        mujoco.mj_forward(model, data)
        tip = site_position(model, data, "tip")
        target = site_position(model, data, "target")
        error = target - tip

        data.ctrl[0] = np.clip(2.0 * error[2], -1.0, 1.0)
        data.ctrl[1] = np.clip(2.0 * error[0], -1.0, 1.0)

        mujoco.mj_step(model, data)
        total_reward += reward(model, data)

        if step % 100 == 0:
            obs = get_obs(model, data)
            print("step:", step)
            print("  tip:", np.round(tip, 3))
            print("  target:", np.round(target, 3))
            print("  ctrl:", np.round(data.ctrl.copy(), 3))
            print("  obs_dim:", obs.shape[0])

    print("total_reward:", round(total_reward, 3))
    print("final tip:", np.round(site_position(model, data, "tip"), 3))
    print("target:", np.round(site_position(model, data, "target"), 3))


if __name__ == "__main__":
    main()
```

保存为：

```bash
touch ch7_reacher.py
```

运行：

```bash
python ch7_reacher.py
```

### 代码逐段解释

读取 site 坐标：

```python
def site_position(model: mujoco.MjModel, data: mujoco.MjData, name: str) -> np.ndarray:
```

这个函数把“按名字查找 site ID”和“读取 site 世界坐标”封装到一起，避免重复写。

构造观测：

```python
return np.concatenate([data.qpos.copy(), data.qvel.copy(), tip, target])
```

这让策略或控制器能同时看到关节状态、末端位置和目标位置。

奖励函数：

```python
dist = np.linalg.norm(tip - target)
control_cost = 0.01 * np.sum(np.square(data.ctrl))
return float(-dist - control_cost)
```

奖励由两部分组成：

1. `-dist`：末端离目标越远，奖励越低。
2. `control_cost`：动作越大，扣分越多，避免控制输入过于剧烈。

简单控制器：

```python
error = target - tip
data.ctrl[0] = np.clip(2.0 * error[2], -1.0, 1.0)
data.ctrl[1] = np.clip(2.0 * error[0], -1.0, 1.0)
```

这只是为了演示控制闭环，不是严格的逆运动学。真实 reacher 通常需要更系统的方法。

### 代码逐行细讲

```python
def site_position(model: mujoco.MjModel, data: mujoco.MjData, name: str) -> np.ndarray:
```

定义一个函数，用名字读取 site 的世界坐标。参数 `name` 是 site 的名字，比如 `"tip"` 或 `"target"`。

```python
site_id = mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_SITE, name)
```

根据 site 名字查找数字 ID。MuJoCo 内部数组需要用 ID 访问，不能直接用字符串名字访问。

```python
if site_id < 0:
    raise RuntimeError(f"site not found: {name}")
```

如果 site 没找到，就主动报错。`f"site not found: {name}"` 是 Python 的 f-string，会把变量 `name` 的值放进字符串里。

```python
return data.site_xpos[site_id].copy()
```

返回这个 site 的世界坐标。`site_xpos` 里的每一行都是一个 site 的 `(x, y, z)` 坐标。

```python
def get_obs(model: mujoco.MjModel, data: mujoco.MjData) -> np.ndarray:
```

定义获取观测的函数。Reacher 的观测不仅包含关节角和速度，还包含末端位置和目标位置。

```python
tip = site_position(model, data, "tip")
target = site_position(model, data, "target")
```

分别读取末端点和目标点的世界坐标。

```python
return np.concatenate([data.qpos.copy(), data.qvel.copy(), tip, target])
```

把四部分拼成一个观测数组：

```text
关节角 qpos
关节速度 qvel
末端坐标 tip
目标坐标 target
```

```python
dist = np.linalg.norm(tip - target)
```

计算 tip 到 target 的距离。`tip - target` 得到一个三维向量，`np.linalg.norm(...)` 计算这个向量的长度。

例如：

```text
tip    = [0.3, 0.0, 0.4]
target = [0.5, 0.0, 0.4]
tip - target = [-0.2, 0.0, 0.0]
distance = 0.2
```

```python
control_cost = 0.01 * np.sum(np.square(data.ctrl))
```

计算动作惩罚。`np.square(data.ctrl)` 把每个控制输入平方，`np.sum(...)` 把它们加起来。动作越大，惩罚越大。

```python
return float(-dist - control_cost)
```

奖励是负距离再减去动作惩罚。距离越小，奖励越接近 0；动作越大，奖励越低。

```python
total_reward = 0.0
```

累计奖励变量，记录整个运行过程的总分。

```python
for step in range(500):
```

运行 500 个控制步。

```python
mujoco.mj_forward(model, data)
```

刷新当前状态对应的 site 坐标。这里每步开头调用一次，确保读取到的 `tip` 和 `target` 是当前状态下的坐标。

```python
error = target - tip
```

计算目标点相对末端点的误差向量。它表示“从 tip 指向 target 还差多少”。

```python
data.ctrl[0] = np.clip(2.0 * error[2], -1.0, 1.0)
data.ctrl[1] = np.clip(2.0 * error[0], -1.0, 1.0)
```

给两个关节写控制输入。这里用 z 方向误差控制第一个关节，用 x 方向误差控制第二个关节。这是非常粗糙的教学控制器，只是为了展示 `error -> ctrl -> step` 的流程。

```python
mujoco.mj_step(model, data)
```

推进仿真。机械臂会根据两个 motor 的输入改变姿态。

```python
obs = get_obs(model, data)
```

读取最新观测。后面打印 `obs.shape[0]`，用来确认观测维度是 10。

## 5.运行结果说明

观测维度为:

```text
2 个 qpos
2 个 qvel
3 个 tip position
3 个 target position
= 10
```

控制器只是教学控制器。真实机械臂 reacher 通常会用逆运动学、Operational Space Control、RL policy 或模仿学习 policy。

程序每 100 步打印：

```text
tip: 末端点世界坐标
target: 目标点世界坐标
ctrl: 两个关节的控制输入
obs_dim: 观测维度
```

如果控制有效，你应该看到最终 `tip` 的位置相对初始位置发生变化。它不一定能精准到达目标，因为这个控制器很粗糙。

## 6.验证步骤

1. 修改目标点位置。
2. 重新运行，观察最终 tip 是否变化。
3. 把 gravity 改成 `0 0 -9.81`，观察控制是否变差。
4. 打印 `model.nu`，应为 `2`。
5. 把 `ctrlrange="-1 1"` 改成 `-0.2 0.2`，观察机械臂是否更难移动。
6. 把 `target` 的 `pos` 改成 `0.2 0 0.6`，观察 reward 和 final tip。
7. 用 viewer 可视化，确认 link1、link2 和 target 的位置符合预期。

## 7.常见错误与解决方案

### `site not found`

检查 XML 中是否有 `site name="tip"` 和 `site name="target"`。

### 机械臂完全不动

检查:

1. `model.nu` 是否为 2
2. actuator 是否引用正确 joint
3. `data.ctrl` 是否被赋值
4. 是否执行了 `mujoco.mj_step(model, data)`

### 控制效果不好

正常。本章重点不是控制器最优，而是任务结构:

```text
obs → action → mj_step → reward → next_obs
```

### tip 坐标不变化

检查：

1. 是否每步调用了 `mujoco.mj_step(model, data)`。
2. 是否写入了 `data.ctrl[0]` 和 `data.ctrl[1]`。
3. actuator 是否正确引用 `joint1`、`joint2`。
4. 控制输入是否太小。

### 目标点不会动

本章的 target 是固定 site：

```xml
<site name="target" pos="0.5 0 0.4" .../>
```

它直接挂在 `worldbody` 下，所以不会随机械臂运动。如果你想每次 reset 随机目标，后续可以把目标放在 mocap body 或通过修改模型/数据实现，本章先不展开。

### 机械臂不像真实机械臂

正常。本章模型是教学用二维两连杆，没有电机真实参数、关节限位、摩擦、真实机器人 URDF/MJCF 结构。它的价值是帮你理解任务结构，而不是模拟某台真实机器人。

## 8.本章小结

Reacher 比 Cartpole 多了一个关键概念：任务目标往往不是直接由关节角定义，而是由末端点和目标点的空间关系定义。

核心公式：

```text
distance = ||tip - target||
reward = -distance - action_cost
```

掌握这个模式后，就能理解很多机械臂 reach、push、pick、place 任务的基本奖励设计。
