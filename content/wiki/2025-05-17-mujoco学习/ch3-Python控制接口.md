# 3.Python 控制接口：读取状态与推进仿真

## 1.目标说明

本章理解 Python 如何控制 MuJoCo 仿真。

你将学习:

1. `MjModel.from_xml_string`
2. `MjData(model)`
3. `mj_step`
4. `mj_resetData`
5. 读取 `qpos`、`qvel`、`ctrl`
6. 使用 `model.opt.timestep`

从这一章开始，你要把 MuJoCo 当成一个“状态机”来看：

```text
当前状态 data
    + 当前控制 data.ctrl
    + 模型参数 model
          ↓
      mj_step
          ↓
新的状态 data
```

后面写控制器、奖励函数、强化学习环境，都是围绕这个状态机展开。

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
conda create -n mujoco-python-api python=3.10 -y
conda activate mujoco-python-api
pip install "mujoco>=2.3" numpy
```

版本冲突说明:

1. `mujoco.MjModel` 和 `mujoco.MjData` 是官方 Python bindings 的类名。
2. 官方 Python API 中结构体名称使用大写开头，例如 C API 的 `mjModel` 在 Python 中是 `MjModel`。
3. 不要使用 `sim = mujoco_py.MjSim(...)`。

## 3.核心概念解释

仿真推进核心代码:

```python
mujoco.mj_step(model, data)
```

这一步会根据当前状态和控制量计算力，推进动力学，并更新 `data.qpos`、`data.qvel`、`data.time`。

重置仿真:

```python
mujoco.mj_resetData(model, data)
```

如果手动修改了 `data.qpos` 或 `data.qvel`，通常应调用:

```python
mujoco.mj_forward(model, data)
```

让 MuJoCo 根据新状态更新派生量，例如 body 世界坐标。

### `qpos`、`qvel`、`ctrl` 是什么

这三个数组是 MuJoCo Python 控制里最常见的数组：

| 字段 | 含义 | 谁来修改 |
|:---|:---|:---|
| `data.qpos` | 广义位置，例如小车位置、关节角、自由物体位置姿态 | MuJoCo 更新，也可以手动设置初始状态 |
| `data.qvel` | 广义速度，例如小车速度、关节角速度 | MuJoCo 更新，也可以手动清零 |
| `data.ctrl` | actuator 的控制输入 | 主要由你的控制代码写入 |

注意：`qpos` 和 `qvel` 不一定同维。自由刚体就是典型例子：

```text
freejoint: qpos 7 维，qvel 6 维
```

### `mj_step` 和 `mj_forward` 的区别

| 函数 | 是否推进时间 | 什么时候用 |
|:---|:---|:---|
| `mj_step(model, data)` | 是 | 正常仿真循环，每调用一次前进一步 |
| `mj_forward(model, data)` | 否 | 手动改了 `qpos`、`qvel` 后，刷新派生量 |

例如你写：

```python
data.qpos[2] = 2.0
```

这只是改了“原始状态数组”。MuJoCo 还没有重新计算 body 世界坐标、site 世界坐标等派生数据，所以要接着调用：

```python
mujoco.mj_forward(model, data)
```

### 为什么 reset 后要重新设置状态

`mujoco.mj_resetData(model, data)` 会把 `data` 重置回模型默认状态。如果你想每次 episode 从随机姿态开始，常见写法是：

```python
mujoco.mj_resetData(model, data)
data.qpos[:] = random_qpos
data.qvel[:] = 0.0
mujoco.mj_forward(model, data)
```

## 4.最小可运行代码（MRE）

```python
import mujoco
import numpy as np


XML = """
<mujoco model="state_api">
  <option timestep="0.01" gravity="0 0 -9.81"/>

  <worldbody>
    <geom name="floor" type="plane" size="3 3 0.1"/>

    <body name="ball" pos="0 0 1">
      <freejoint name="ball_free"/>
      <geom name="ball_geom" type="sphere" size="0.1" mass="1" rgba="0 0.2 1 1"/>
    </body>
  </worldbody>
</mujoco>
"""


def print_state(prefix: str, model: mujoco.MjModel, data: mujoco.MjData) -> None:
    print(prefix)
    print("  timestep:", model.opt.timestep)
    print("  time:", data.time)
    print("  qpos:", np.round(data.qpos.copy(), 4))
    print("  qvel:", np.round(data.qvel.copy(), 4))


def main() -> None:
    model = mujoco.MjModel.from_xml_string(XML)
    data = mujoco.MjData(model)

    print_state("initial", model, data)

    for _ in range(50):
        mujoco.mj_step(model, data)

    print_state("after 50 steps", model, data)

    mujoco.mj_resetData(model, data)
    print_state("after reset", model, data)

    data.qpos[2] = 2.0
    mujoco.mj_forward(model, data)
    print_state("after manual qpos edit", model, data)


if __name__ == "__main__":
    main()
```

保存为：

```bash
touch ch3_python_state.py
```

运行:

```bash
python ch3_python_state.py
```

### 代码逐段解释

打印状态的函数：

```python
def print_state(prefix: str, model: mujoco.MjModel, data: mujoco.MjData) -> None:
```

这个函数不是 MuJoCo 必需的，只是为了让你更清楚地看到每个阶段 `data` 里发生了什么。

推进 50 步：

```python
for _ in range(50):
    mujoco.mj_step(model, data)
```

由于 `timestep=0.01`，所以 50 步后时间约为 `0.5` 秒。

重置：

```python
mujoco.mj_resetData(model, data)
```

这会把时间、位置、速度恢复到初始状态。

手动改高度：

```python
data.qpos[2] = 2.0
mujoco.mj_forward(model, data)
```

这个例子里 `qpos[2]` 是 freejoint 的 z 坐标。改成 `2.0` 表示把小球放到更高的位置。

### 代码逐行细讲

```python
def print_state(prefix: str, model: mujoco.MjModel, data: mujoco.MjData) -> None:
```

这里定义了一个辅助函数，用来打印状态。括号里的三个参数分别是：

1. `prefix`：一段文字，比如 `"initial"`，用来说明现在打印的是哪个阶段。
2. `model`：MuJoCo 模型。
3. `data`：MuJoCo 当前状态。

`prefix: str`、`model: mujoco.MjModel` 这些是类型提示。它们帮助人和编辑器理解变量类型，不会改变程序运行逻辑。

```python
print("  qpos:", np.round(data.qpos.copy(), 4))
```

`np.round(..., 4)` 表示保留 4 位小数。仿真输出可能有很多小数，保留 4 位更容易看。

```python
model = mujoco.MjModel.from_xml_string(XML)
data = mujoco.MjData(model)
```

这两行是所有 MuJoCo 程序的常见开头：先编译模型，再创建运行数据。

```python
print_state("initial", model, data)
```

调用刚才定义的 `print_state` 函数，打印初始状态。

```python
for _ in range(50):
    mujoco.mj_step(model, data)
```

循环 50 次，每次推进 0.01 秒，所以最后时间约为 0.5 秒。

```python
mujoco.mj_resetData(model, data)
```

重置 `data`。注意它不会重新创建 `model`，因为模型结构没有变，只是状态回到初始值。

```python
data.qpos[2] = 2.0
```

这行是“手动改状态”。在 freejoint 中，`qpos[0]`、`qpos[1]`、`qpos[2]` 分别是 x、y、z 坐标，所以这里把小球高度改成 2.0。

```python
mujoco.mj_forward(model, data)
```

手动改完 `qpos` 后，调用 `mj_forward` 让 MuJoCo 重新计算派生状态。它不推进时间，只刷新当前状态对应的世界坐标、碰撞信息等。

## 5.运行结果说明

你会看到:

1. 初始时间为 `0`
2. 50 步后时间约为 `0.5`
3. reset 后状态恢复
4. 手动修改 `data.qpos[2]` 后，小球高度变为 `2.0`

`qpos[2]` 在这个例子中表示自由刚体的 z 坐标。

输出里可以重点看三件事：

1. `time` 是否随着 `mj_step` 增加。
2. `qpos` 的 z 坐标是否因为下落而变化。
3. `mj_resetData` 后时间是否回到 `0`。

## 6.验证步骤

1. 修改 timestep 为 `0.005`。
2. 重新运行，检查 50 步后时间是否约为 `0.25`。
3. 修改重力为 `0 0 -1.0`。
4. 观察小球下降速度是否变慢。
5. 把 `data.qpos[2] = 2.0` 改成 `data.qpos[0] = 1.0`，观察 x 坐标是否变化。
6. 注释掉 `mujoco.mj_forward(model, data)`，观察派生状态是否可能没有及时更新。

## 7.常见错误与解决方案

### 修改 `data.qpos` 后位置没有更新

解决:

```python
mujoco.mj_forward(model, data)
```

### 数组维度看不懂

打印模型维度:

```python
print(model.nq, model.nv, model.nu)
```

| 字段 | 含义 |
|:---|:---|
| `nq` | 位置变量数量 |
| `nv` | 速度变量数量 |
| `nu` | 控制输入数量 |

### 误以为 `qpos` 一定等于关节数

不是。例如 `freejoint` 的 `qpos` 是 7 维，但 `qvel` 是 6 维。

### 不知道某个元素在 `qpos` 的第几位

初学时可以先打印：

```python
print("nq:", model.nq)
print("nv:", model.nv)
print("qpos:", data.qpos)
print("qvel:", data.qvel)
```

更复杂模型中，可以用 MuJoCo 的 joint 地址字段查询，不过本教程先保持简单。前几章的模型维度都很小，直接打印数组就能看懂。

### 仿真结果每次都一样

这是正常的。MuJoCo 本身是确定性仿真，只要初始状态、模型参数、控制输入一样，结果通常就一样。想要每次不同，需要你自己在 reset 时随机化 `qpos`、目标点或控制输入。

## 8.本章小结

Python 控制 MuJoCo 的核心就是读写 `data`：

1. 用 `data.qpos` 和 `data.qvel` 读取状态。
2. 用 `data.ctrl` 写入控制。
3. 用 `mj_step` 推进时间。
4. 手动改状态后用 `mj_forward` 刷新派生量。

理解这一章后，就可以进入关节和 actuator 控制。
