# 4.关节、Actuator 与力控制

## 1.目标说明

本章用 MuJoCo 搭建一个单关节摆杆，并通过 actuator 控制它运动。

你将学习:

1. `hinge` 关节
2. `<actuator><motor .../></actuator>`
3. `data.ctrl`
4. `ctrlrange`
5. 读取关节角和角速度

这章是从“物体自己掉落”进入“我主动控制物体”的关键一步。你会第一次写：

```python
data.ctrl[0] = ...
```

这行代码就是控制算法和 MuJoCo 物理世界之间的接口。

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
conda create -n mujoco-control python=3.10 -y
conda activate mujoco-control
pip install "mujoco>=2.3" numpy
```

版本冲突说明:

1. `<motor>` 是 MuJoCo XML Reference 中的 actuator shortcut。
2. `data.ctrl` 长度等于 `model.nu`。
3. 如果 `model.nu == 0`，说明 XML 没有定义 actuator。
4. actuator 细节在 MuJoCo 不同版本中有扩展，本文只使用基础 motor。

## 3.核心概念解释

关节决定 body 如何运动:

```xml
<joint name="hinge" type="hinge" axis="0 1 0"/>
```

含义:

1. 名字是 `hinge`
2. 类型是旋转关节
3. 绕 y 轴旋转

actuator 决定如何施加控制:

```xml
<actuator>
  <motor name="hinge_motor" joint="hinge" gear="1" ctrlrange="-2 2" ctrllimited="true"/>
</actuator>
```

`data.ctrl[0]` 会变成电机输入，控制输入限制在 `[-2, 2]`。

### joint 和 actuator 的关系

很多新手会把 joint 和 actuator 混在一起。它们不是一回事：

| 概念 | 作用 | 类比 |
|:---|:---|:---|
| joint | 定义能怎么动 | 门轴允许门旋转 |
| actuator | 定义怎么施力或控制 | 人推门、马达带动门 |

只有 joint，没有 actuator，物体仍然可能因为重力、碰撞、初速度而动，但你不能通过 `data.ctrl` 主动控制它。

只有 actuator，没有正确引用 joint，模型会编译失败或没有控制效果。

### hinge joint

```xml
<joint name="hinge" type="hinge" axis="0 1 0" damping="0.1"/>
```

含义：

1. `type="hinge"`：只能绕一个轴旋转。
2. `axis="0 1 0"`：绕 y 轴旋转。
3. `damping="0.1"`：阻尼，类似摩擦，会让运动慢慢衰减。

### motor actuator

```xml
<motor name="hinge_motor" joint="hinge" gear="1" ctrlrange="-2 2" ctrllimited="true"/>
```

含义：

1. `joint="hinge"`：这个电机作用在名为 `hinge` 的关节上。
2. `gear="1"`：控制输入到力/力矩的放大比例。
3. `ctrlrange="-2 2"`：允许的控制输入范围。
4. `ctrllimited="true"`：启用控制范围限制。

简单理解：

```text
实际施加效果 ≈ data.ctrl[0] * gear
```

真实细节比这更复杂，但这个近似足够帮助入门。

## 4.最小可运行代码（MRE）

```python
import math

import mujoco
import numpy as np


XML = """
<mujoco model="one_link_motor">
  <option timestep="0.002" gravity="0 0 -9.81"/>

  <worldbody>
    <body name="base" pos="0 0 0.5">
      <geom name="base_geom" type="sphere" size="0.05" rgba="0.2 0.2 0.2 1"/>

      <body name="link" pos="0 0 0">
        <joint name="hinge" type="hinge" axis="0 1 0" damping="0.1"/>
        <geom name="link_geom" type="capsule" fromto="0 0 0 0 0 0.5" size="0.03" mass="0.5" rgba="0.1 0.4 1 1"/>
      </body>
    </body>
  </worldbody>

  <actuator>
    <motor name="hinge_motor" joint="hinge" gear="1" ctrlrange="-2 2" ctrllimited="true"/>
  </actuator>
</mujoco>
"""


def main() -> None:
    model = mujoco.MjModel.from_xml_string(XML)
    data = mujoco.MjData(model)

    print("nq:", model.nq)
    print("nv:", model.nv)
    print("nu:", model.nu)

    if model.nu != 1:
        raise RuntimeError("expected exactly one actuator")

    for step in range(2000):
        t = step * model.opt.timestep
        data.ctrl[0] = 1.5 * math.sin(2.0 * math.pi * 0.5 * t)
        mujoco.mj_step(model, data)

    print("time:", data.time)
    print("joint qpos:", np.round(data.qpos.copy(), 4))
    print("joint qvel:", np.round(data.qvel.copy(), 4))
    print("last ctrl:", data.ctrl.copy())


if __name__ == "__main__":
    main()
```

保存为：

```bash
touch ch4_joint_motor.py
```

运行:

```bash
python ch4_joint_motor.py
```

### 代码逐段解释

检查 actuator 数量：

```python
if model.nu != 1:
    raise RuntimeError("expected exactly one actuator")
```

`model.nu` 是控制输入维度。这个模型只有一个 motor，所以 `data.ctrl` 长度应该是 1。

产生正弦控制信号：

```python
data.ctrl[0] = 1.5 * math.sin(2.0 * math.pi * 0.5 * t)
```

这表示电机输入会在正负之间周期变化。你可以把它理解成一会儿往一个方向推，一会儿往反方向推。

推进仿真：

```python
mujoco.mj_step(model, data)
```

MuJoCo 根据当前电机输入、重力、阻尼、质量等参数计算下一步状态。

### 代码逐行细讲

```python
import math
```

导入 Python 标准库里的数学模块。后面要用 `math.sin` 和 `math.pi` 生成周期变化的控制信号。

```python
import mujoco
import numpy as np
```

导入 MuJoCo 和 NumPy。MuJoCo 负责仿真，NumPy 负责数组显示和数值处理。

```xml
<joint name="hinge" type="hinge" axis="0 1 0" damping="0.1"/>
```

这行定义关节。`hinge` 表示旋转关节。`axis="0 1 0"` 表示绕 y 轴旋转。`damping="0.1"` 表示有一点阻尼，运动不会完全无损耗。

```xml
<geom name="link_geom" type="capsule" fromto="0 0 0 0 0 0.5" size="0.03" mass="0.5"/>
```

这行定义摆杆的形状。`capsule` 是胶囊体，适合表示杆子。`fromto` 前三个数是起点，后三个数是终点，所以这根杆从 `(0,0,0)` 延伸到 `(0,0,0.5)`。`size="0.03"` 是半径。

```xml
<motor name="hinge_motor" joint="hinge" gear="1" ctrlrange="-2 2" ctrllimited="true"/>
```

这行定义电机。它作用在 `hinge` 关节上。`gear` 可以理解成放大倍数。`ctrlrange` 限制控制输入范围。

```python
if model.nu != 1:
    raise RuntimeError("expected exactly one actuator")
```

`model.nu` 是控制输入数量。这个 XML 只定义了一个 motor，所以应该等于 1。如果不是 1，说明模型和预期不一致，继续运行可能会出错。

```python
for step in range(2000):
```

循环 2000 步。这里没有用 `_`，而是用 `step`，因为后面要用当前步数计算时间。

```python
t = step * model.opt.timestep
```

当前仿真时间可以用“步数乘以时间步长”估算。比如 step=100，timestep=0.002，那么 t=0.2 秒。

```python
data.ctrl[0] = 1.5 * math.sin(2.0 * math.pi * 0.5 * t)
```

这行给电机输入一个正弦波。拆开看：

1. `math.sin(...)` 产生 -1 到 1 之间周期变化的值。
2. `1.5 *` 把范围放大成 -1.5 到 1.5。
3. `data.ctrl[0] = ...` 把结果写入第 0 个 actuator。

因为正弦值一会儿正一会儿负，所以电机会来回推动关节。

```python
print("joint qpos:", np.round(data.qpos.copy(), 4))
```

打印关节角度。这个模型只有一个 hinge joint，所以 `data.qpos` 只有一个数。

## 5.运行结果说明

输出类似:

```text
nq: 1
nv: 1
nu: 1
time: 4.0
joint qpos: [...]
joint qvel: [...]
last ctrl: [...]
```

这里 `data.ctrl[0]` 是电机输入。

`joint qpos` 是关节角度，单位通常是弧度。`joint qvel` 是角速度，单位通常是弧度每秒。

角度单位提示：

```text
pi rad ≈ 180 degrees
1 rad ≈ 57.3 degrees
```

如果你看到 `qpos` 是 `0.5`，大约就是 28.6 度。

## 6.验证步骤

1. 把 `gear="1"` 改成 `gear="5"`。
2. 重新运行，观察关节运动是否更剧烈。
3. 把 `ctrlrange` 改成 `-0.2 0.2`。
4. 重新运行，观察控制能力是否变弱。
5. 去掉 actuator，确认 `model.nu` 变成 `0`。
6. 把 `damping="0.1"` 改成 `damping="2.0"`，观察运动是否更难被带动。
7. 把 `axis="0 1 0"` 改成 `axis="1 0 0"`，用 viewer 观察旋转方向变化。

## 7.常见错误与解决方案

### `IndexError: index 0 is out of bounds`

原因是 `model.nu == 0`，没有 actuator。

### 关节几乎不动

可能原因:

1. `gear` 太小
2. `ctrlrange` 太小
3. `damping` 太大
4. 重力方向导致运动不明显

### 模型编译失败

检查 actuator 引用的 `joint="hinge"` 是否存在，joint 名称是否拼写一致。

### `data.ctrl[0]` 写了但没有效果

检查：

1. `model.nu` 是否大于 0。
2. motor 是否引用了正确 joint。
3. `gear` 是否太小。
4. `ctrlrange` 是否把输入限制得太小。
5. body 是否真的有可动 joint。

### 控制输入超过范围会怎样

如果设置了：

```xml
ctrlrange="-2 2" ctrllimited="true"
```

MuJoCo 会把控制输入限制在这个范围附近。为了让代码更清晰，实际控制任务里仍建议在 Python 里自己写：

```python
action = np.clip(action, -2.0, 2.0)
data.ctrl[0] = action
```

## 8.本章小结

这一章建立了控制任务的基本形式：

```text
读取状态 qpos/qvel
→ 计算控制 ctrl
→ 写入 data.ctrl
→ mj_step 推进仿真
```

后面的 Cartpole 和 Reacher 只是把这个形式扩展到更多关节和更复杂的观测、奖励。
