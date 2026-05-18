# 6.控制任务：Cartpole

## 1.目标说明

本章搭建一个最小 Cartpole 控制任务。

你将学习:

1. slide joint
2. hinge joint
3. cart force actuator
4. 状态观测
5. 简单控制循环
6. reward 设计雏形

Cartpole 是强化学习里最经典的入门任务之一。它的目标很直观：

```text
小车可以左右移动
杆子铰接在小车上
控制小车左右施力
尽量让杆子保持不倒
```

这章不是为了做出最强控制器，而是为了让你看懂一个 MuJoCo 控制任务由哪些部分组成。

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
conda create -n mujoco-cartpole python=3.10 -y
conda activate mujoco-cartpole
pip install "mujoco>=2.3" numpy
```

版本冲突说明:

1. 本章不依赖 Gymnasium。
2. Cartpole XML 是简化教学模型，不等同于 Gymnasium 官方 CartPole 参数。
3. 如果后续要对齐 Gymnasium，需要单独匹配质量、长度、奖励、终止条件。

## 3.核心概念解释

Cartpole 的模型结构:

```text
world
└── cart body
    ├── slide joint: cart_x
    └── pole body
        └── hinge joint: pole_hinge
```

小车通过 slide joint 左右移动:

```xml
<joint name="cart_x" type="slide" axis="1 0 0"/>
```

杆子通过 hinge joint 旋转:

```xml
<joint name="pole_hinge" type="hinge" axis="0 1 0"/>
```

控制力作用在小车 slide joint 上:

```xml
<motor name="cart_motor" joint="cart_x" gear="10"/>
```

### Cartpole 的状态是什么

这个简化模型有两个关节：

| 关节 | 类型 | 对应状态 |
|:---|:---|:---|
| `cart_x` | slide | 小车 x 位置 |
| `pole_hinge` | hinge | 杆子角度 |

所以：

```text
data.qpos = [cart_x, pole_angle]
data.qvel = [cart_x_velocity, pole_angular_velocity]
```

把它们拼起来就是观测：

```text
obs = [cart_x, pole_angle, cart_x_velocity, pole_angular_velocity]
```

### action 是什么

本章只有一个 actuator：

```text
data.ctrl[0] = action
```

这个 action 会通过 motor 作用在小车的 slide joint 上。action 为正，小车倾向于向 x 正方向运动；action 为负，小车倾向于向 x 负方向运动。

### reward 是什么

奖励函数：

```python
return float(1.0 - 0.1 * cart_x * cart_x - pole_angle * pole_angle)
```

含义：

1. 基础奖励是 `1.0`。
2. 小车离中心越远，扣分越多。
3. 杆子角度越大，扣分越多。

这只是教学用 reward。真实任务还可能加入终止条件、角速度惩罚、动作惩罚等。

## 4.最小可运行代码（MRE）

```python
import mujoco
import numpy as np


XML = """
<mujoco model="cartpole">
  <option timestep="0.01" gravity="0 0 -9.81"/>

  <worldbody>
    <geom name="floor" type="plane" size="4 1 0.1" rgba="0.8 0.8 0.8 1"/>

    <body name="cart" pos="0 0 0.2">
      <joint name="cart_x" type="slide" axis="1 0 0" damping="0.05"/>
      <geom name="cart_geom" type="box" size="0.2 0.1 0.1" mass="1" rgba="0.1 0.3 1 1"/>

      <body name="pole" pos="0 0 0.1">
        <joint name="pole_hinge" type="hinge" axis="0 1 0" damping="0.01"/>
        <geom name="pole_geom" type="capsule" fromto="0 0 0 0 0 0.8" size="0.03" mass="0.2" rgba="1 0.2 0.1 1"/>
      </body>
    </body>
  </worldbody>

  <actuator>
    <motor name="cart_motor" joint="cart_x" gear="10" ctrlrange="-1 1" ctrllimited="true"/>
  </actuator>
</mujoco>
"""


def get_observation(data: mujoco.MjData) -> np.ndarray:
    return np.concatenate([data.qpos.copy(), data.qvel.copy()])


def compute_reward(obs: np.ndarray) -> float:
    cart_x = obs[0]
    pole_angle = obs[1]
    return float(1.0 - 0.1 * cart_x * cart_x - pole_angle * pole_angle)


def main() -> None:
    model = mujoco.MjModel.from_xml_string(XML)
    data = mujoco.MjData(model)

    data.qpos[1] = 0.1
    mujoco.mj_forward(model, data)

    total_reward = 0.0

    for step in range(1000):
        obs = get_observation(data)
        pole_angle = obs[1]
        pole_angular_velocity = obs[3]

        action = 2.0 * pole_angle + 0.5 * pole_angular_velocity
        action = np.clip(action, -1.0, 1.0)

        data.ctrl[0] = action
        mujoco.mj_step(model, data)

        reward = compute_reward(get_observation(data))
        total_reward += reward

        if step % 100 == 0:
            print("step:", step, "obs:", np.round(obs, 3), "action:", round(float(action), 3))

    print("total_reward:", round(total_reward, 3))
    print("final obs:", np.round(get_observation(data), 3))


if __name__ == "__main__":
    main()
```

保存为：

```bash
touch ch6_cartpole.py
```

运行：

```bash
python ch6_cartpole.py
```

### 代码逐段解释

构造观测：

```python
def get_observation(data: mujoco.MjData) -> np.ndarray:
    return np.concatenate([data.qpos.copy(), data.qvel.copy()])
```

`np.concatenate` 把位置数组和速度数组拼成一个更长的数组。这里 `qpos` 2 维，`qvel` 2 维，所以 obs 是 4 维。

设置初始角度：

```python
data.qpos[1] = 0.1
mujoco.mj_forward(model, data)
```

这让杆子一开始有一点倾斜。如果完全竖直且没有扰动，系统可能太“安静”，不利于观察控制效果。

简单反馈控制：

```python
action = 2.0 * pole_angle + 0.5 * pole_angular_velocity
action = np.clip(action, -1.0, 1.0)
```

这不是严格推导出来的最优控制，只是一个教学例子：根据杆子的角度和角速度，决定给小车施加多大力。

限制动作：

```python
np.clip(action, -1.0, 1.0)
```

因为 XML 里 `ctrlrange="-1 1"`，所以 Python 里也把 action 限制在这个范围内。

### 代码逐行细讲

```python
def get_observation(data: mujoco.MjData) -> np.ndarray:
    return np.concatenate([data.qpos.copy(), data.qvel.copy()])
```

这段定义了一个函数，用来获取当前观测。`data.qpos.copy()` 是位置数组副本，`data.qvel.copy()` 是速度数组副本。`np.concatenate(...)` 把两个数组首尾拼接起来。

在本章模型里：

```text
data.qpos = [小车位置, 杆子角度]
data.qvel = [小车速度, 杆子角速度]
```

所以返回的 obs 是：

```text
[小车位置, 杆子角度, 小车速度, 杆子角速度]
```

```python
def compute_reward(obs: np.ndarray) -> float:
```

这行定义奖励函数。输入是观测 `obs`，输出是一个浮点数奖励。

```python
cart_x = obs[0]
pole_angle = obs[1]
```

数组索引从 0 开始。`obs[0]` 是第一个元素，也就是小车位置。`obs[1]` 是第二个元素，也就是杆子角度。

```python
return float(1.0 - 0.1 * cart_x * cart_x - pole_angle * pole_angle)
```

这行计算奖励。`cart_x * cart_x` 是小车位置的平方，`pole_angle * pole_angle` 是杆子角度的平方。平方的特点是无论正负都会变成正数，所以偏离中心和角度偏离都会扣分。

```python
data.qpos[1] = 0.1
```

手动设置杆子的初始角度。因为 `qpos[0]` 是小车位置，`qpos[1]` 是杆子角度，所以这里改的是杆子。

```python
mujoco.mj_forward(model, data)
```

手动修改 `qpos` 后，刷新 MuJoCo 内部派生状态。否则有些坐标、碰撞或可视化信息可能还停留在旧状态。

```python
total_reward = 0.0
```

创建一个变量，用来累计整个 episode 的奖励。初始值是 0。

```python
for step in range(1000):
```

循环 1000 步。`step` 是当前步数，从 0 到 999。

```python
obs = get_observation(data)
```

读取当前状态，保存到 `obs`。

```python
pole_angle = obs[1]
pole_angular_velocity = obs[3]
```

取出杆子角度和杆子角速度。为什么角速度是 `obs[3]`？因为 obs 的顺序是 `[cart_x, pole_angle, cart_x_velocity, pole_angular_velocity]`。

```python
action = 2.0 * pole_angle + 0.5 * pole_angular_velocity
```

这是一个简单反馈控制器。它根据杆子当前角度和角速度算出动作。`2.0` 和 `0.5` 是人为设置的系数，不是固定公式。

```python
action = np.clip(action, -1.0, 1.0)
```

把 action 限制在 -1 到 1 之间。如果 action 算出来是 3，会变成 1；如果是 -4，会变成 -1。

```python
data.ctrl[0] = action
```

把动作写入第 0 个 actuator，也就是小车电机。真正的“控制 MuJoCo”就是通过这行发生的。

```python
mujoco.mj_step(model, data)
```

让仿真前进一步。MuJoCo 会根据刚刚写入的 `data.ctrl[0]` 计算小车和杆子的下一刻状态。

```python
reward = compute_reward(get_observation(data))
total_reward += reward
```

先根据新状态计算奖励，再把它加到累计奖励中。`+=` 是简写，`total_reward += reward` 等价于 `total_reward = total_reward + reward`。

```python
if step % 100 == 0:
```

`%` 是取余数。`step % 100 == 0` 表示每 100 步打印一次，比如第 0、100、200 步。

```python
print("step:", step, "obs:", np.round(obs, 3), "action:", round(float(action), 3))
```

打印当前步数、观测和动作。`np.round(obs, 3)` 表示 obs 保留 3 位小数。`round(float(action), 3)` 表示 action 保留 3 位小数。

## 5.运行结果说明

观测向量:

```text
[cart_x, pole_angle, cart_x_velocity, pole_angular_velocity]
```

控制器是教学用的简单线性反馈，不保证最优。

每隔 100 步会打印一次：

```text
step: 当前步数
obs: 当前观测
action: 当前控制输入
```

重点观察：

1. `pole_angle` 是否越来越大。
2. `cart_x` 是否跑得太远。
3. action 是否经常被 clip 到 `-1` 或 `1`。

如果 action 长期贴着边界，说明控制器可能太激进，或者 actuator 力不够。

## 6.验证步骤

1. 把初始角度改为 `data.qpos[1] = 0.3`。
2. 重新运行，观察控制是否变差。
3. 把 actuator `gear` 改小。
4. 打印 `model.nq, model.nv, model.nu`，应为 `2 2 1`。
5. 把 reward 里的 `pole_angle * pole_angle` 系数改大，观察总奖励变化。
6. 把控制器改成反号，观察杆子是否更容易倒。
7. 用第 5 章 viewer 把这个 XML 放进去，可视化看小车和杆子的运动。

## 7.常见错误与解决方案

### 杆子方向和预期不一致

检查 `axis="0 1 0"` 和 capsule 的 `fromto`，必要时用 viewer 可视化确认。

### 控制器越控越倒

说明反馈符号可能反了，尝试:

```python
action = -2.0 * pole_angle - 0.5 * pole_angular_velocity
```

### 小车飞走

降低 `gear` 或缩小 `action` 的 clip 范围。

### `obs[3]` 为什么是杆子角速度

因为这个模型里：

```text
qpos = [cart_x, pole_angle]
qvel = [cart_x_velocity, pole_angular_velocity]
obs = qpos + qvel
```

所以：

```text
obs[0] = cart_x
obs[1] = pole_angle
obs[2] = cart_x_velocity
obs[3] = pole_angular_velocity
```

### reward 变成负数是否错误

不是。reward 可以是负数。它只是一个分数，强化学习算法关心的是“长期总奖励尽量大”。如果杆子角度很大或小车离中心很远，reward 变负是合理的。

## 8.本章小结

一个控制任务通常包含：

1. 模型：Cartpole 的 body、joint、actuator。
2. 观测：从 `qpos`、`qvel` 里取状态。
3. 动作：写入 `data.ctrl`。
4. 奖励：根据任务目标打分。
5. 循环：obs -> action -> step -> reward。

这就是后面 Gymnasium 环境的基本骨架。
