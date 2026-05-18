# 1.环境安装与第一个 MuJoCo 程序

## 1.目标说明

本章完成 MuJoCo 官方 Python bindings 的安装，并运行第一个最小仿真程序。这个程序只做一件事：创建一个红色小方块，让它在重力作用下下落。

如果你是纯新手，本章最重要的目标不是记住所有安装命令，而是理解 MuJoCo 程序的最小闭环：

```text
写 XML
→ 编译成 model
→ 创建 data
→ 调用 mj_step
→ 读取仿真状态
```

需要掌握:

1. Fedora 44 下 MuJoCo 的系统依赖
2. Python 虚拟环境创建
3. `mujoco.MjModel`
4. `mujoco.MjData`
5. `mujoco.mj_step(model, data)`

MuJoCo 中最重要的两个对象:

| 对象 | 含义 |
|:---|:---|
| `MjModel` | 模型结构，来自 XML，基本不随时间变化 |
| `MjData` | 仿真状态，包含位置、速度、力、时间等，会随仿真推进变化 |

可以先用一个类比理解：

| 类比 | MuJoCo 对象 |
|:---|:---|
| 游戏地图和角色配置 | `MjModel` |
| 游戏运行到当前帧的状态 | `MjData` |
| 前进一帧 | `mujoco.mj_step(model, data)` |

## 2.环境与依赖安装

Fedora 44 系统依赖:

```bash
sudo dnf install -y \
  python3 python3-pip python3-virtualenv \
  mesa-libGL mesa-libGLU mesa-dri-drivers \
  libglvnd-glx libglvnd-opengl \
  glfw glfw-devel \
  libX11 libXcursor libXi libXinerama libXrandr \
  gcc gcc-c++ make
```

创建 Python 环境:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
```

pip 安装:

```bash
pip install "mujoco>=2.3" numpy
```

安装完成后，先做最小检查：

```bash
python -c "import mujoco; print(mujoco.__version__)"
```

只要能打印版本号，说明 Python 已经能找到 MuJoCo。

conda 安装:

```bash
conda create -n mujoco-study python=3.10 -y
conda activate mujoco-study
pip install "mujoco>=2.3" numpy
```

版本冲突说明:

1. 不要安装 `mujoco-py`。
2. 如果旧项目里同时安装了 `mujoco-py` 和 `mujoco`，建议新建干净虚拟环境。
3. `mujoco>=2.3` 官方 Python bindings 已包含 MuJoCo 原生库，不需要手动下载旧版 `~/.mujoco/mujoco210`。
4. 离屏渲染可能涉及 OpenGL 后端，`MUJOCO_GL=egl` 或 `MUJOCO_GL=osmesa` 在不同机器上可能存在版本差异。

## 3.核心概念解释

MuJoCo 的基本执行流程:

```text
XML 字符串/文件
→ MjModel
→ MjData
→ mj_step
→ 读取 data 中的状态
```

`MjModel` 存放模型定义，例如关节数量、几何体数量、actuator 数量、timestep、body 层级结构。

`MjData` 存放仿真运行时状态，例如 `data.time`、`data.qpos`、`data.qvel`、`data.ctrl`、`data.xpos`。

### XML 是什么

MuJoCo 默认使用 MJCF XML 描述模型。你暂时不用完整学习 XML，只要知道它是一种带层级结构的文本格式：

```xml
<body name="box" pos="0 0 1">
  <geom name="box_geom" type="box" size="0.1 0.1 0.1"/>
</body>
```

这段意思是：

1. 创建一个叫 `box` 的刚体。
2. 它初始放在 `(0, 0, 1)`，也就是 z 轴高度为 1。
3. 它里面有一个盒子形状的几何体。

### timestep 是什么

XML 里的：

```xml
<option timestep="0.01" gravity="0 0 -9.81"/>
```

表示每调用一次 `mj_step`，仿真时间前进 `0.01` 秒。循环 100 次，大约就是 1 秒：

```text
100 steps * 0.01 second/step = 1.0 second
```

### 为什么 freejoint 的 qpos 是 7 维

自由物体在三维空间里可以平移和旋转。MuJoCo 用：

```text
x y z qw qx qy qz
```

表示一个自由刚体的位置和姿态。其中 `x y z` 是位置，`qw qx qy qz` 是四元数，用来表示旋转。新手不需要马上掌握四元数，只要知道它是“姿态”的表示方法。

## 4.最小可运行代码（MRE）

新建文件:

```bash
mkdir -p mujoco_tutorial
cd mujoco_tutorial
touch ch1_first_sim.py
```

写入:

```python
import mujoco


XML = """
<mujoco model="first_sim">
  <option timestep="0.01" gravity="0 0 -9.81"/>

  <worldbody>
    <geom name="floor" type="plane" size="2 2 0.1" rgba="0.8 0.8 0.8 1"/>

    <body name="box" pos="0 0 1">
      <freejoint name="box_free"/>
      <geom name="box_geom" type="box" size="0.1 0.1 0.1" mass="1" rgba="1 0 0 1"/>
    </body>
  </worldbody>
</mujoco>
"""


def main() -> None:
    model = mujoco.MjModel.from_xml_string(XML)
    data = mujoco.MjData(model)

    print("nq:", model.nq)
    print("nv:", model.nv)
    print("nu:", model.nu)
    print("initial time:", data.time)
    print("initial qpos:", data.qpos.copy())

    for _ in range(100):
        mujoco.mj_step(model, data)

    print("final time:", data.time)
    print("final qpos:", data.qpos.copy())


if __name__ == "__main__":
    main()
```

### 代码逐段解释

导入库：

```python
import mujoco
```

这里导入的是官方 Python bindings。后面所有 MuJoCo API 都从这个模块里调用。

定义 XML：

```python
XML = """
...
"""
```

三引号字符串里放的是 MuJoCo 模型。这个模型包含地面和一个带 `freejoint` 的方块。

编译模型：

```python
model = mujoco.MjModel.from_xml_string(XML)
```

这一步会检查 XML 是否合法，并把文本模型编译成 MuJoCo 内部可运行的物理模型。

创建数据：

```python
data = mujoco.MjData(model)
```

`data` 会保存仿真当前状态。刚创建时，时间是 `0`，方块还在初始位置。

推进仿真：

```python
for _ in range(100):
    mujoco.mj_step(model, data)
```

每次 `mj_step` 前进一步。这里循环 100 次，所以仿真大约运行 1 秒。

### 代码逐行细讲

下面把完整代码按新手视角拆开讲。

```python
import mujoco
```

`import` 是 Python 的导入语句。这里的意思是：把 MuJoCo 官方 Python 包导入进来，后面才能写 `mujoco.MjModel`、`mujoco.MjData`、`mujoco.mj_step`。

```python
XML = """
...
"""
```

`XML` 是一个变量名。右边的三引号 `"""` 表示多行字符串。因为 MuJoCo 模型通常有很多行，所以用三引号保存 XML 文本最方便。

```xml
<mujoco model="first_sim">
```

这是 XML 的根标签。`model="first_sim"` 给这个模型起了一个名字，叫 `first_sim`。

```xml
<option timestep="0.01" gravity="0 0 -9.81"/>
```

`option` 用来设置仿真参数。`timestep="0.01"` 表示每一步是 0.01 秒。`gravity="0 0 -9.81"` 表示重力方向沿 z 轴向下，大小约为 9.81。

```xml
<worldbody>
```

`worldbody` 表示世界里直接存在的物体都写在这里。你可以把它理解为“场景根节点”。

```xml
<geom name="floor" type="plane" size="2 2 0.1" rgba="0.8 0.8 0.8 1"/>
```

这行创建地面。`geom` 是几何体。`name="floor"` 是名字。`type="plane"` 表示平面。`rgba` 是颜色，四个数字分别表示红、绿、蓝、透明度。

```xml
<body name="box" pos="0 0 1">
```

这行创建一个刚体，名字叫 `box`。`pos="0 0 1"` 表示它一开始在世界坐标 `(0, 0, 1)`，也就是离地面 1 米高。

```xml
<freejoint name="box_free"/>
```

这行很重要。`freejoint` 表示这个刚体可以在三维空间自由移动和旋转。如果没有它，box 会被固定住，不会掉下来。

```xml
<geom name="box_geom" type="box" size="0.1 0.1 0.1" mass="1" rgba="1 0 0 1"/>
```

这行给 box body 添加一个盒子形状。`type="box"` 表示形状是盒子。`size="0.1 0.1 0.1"` 表示三个方向的半边长都是 0.1。`mass="1"` 表示质量是 1。`rgba="1 0 0 1"` 表示红色。

```python
def main() -> None:
```

`def` 用来定义函数。这里定义了一个叫 `main` 的函数。`-> None` 是类型提示，表示这个函数不返回有意义的结果。初学时可以先把它理解成注释，不影响运行。

```python
model = mujoco.MjModel.from_xml_string(XML)
```

这行把 XML 字符串编译成 MuJoCo 模型。`model` 保存的是“静态结构”，比如有几个 body、有几个 joint、时间步长是多少。

```python
data = mujoco.MjData(model)
```

这行创建仿真数据。`data` 保存的是“当前状态”，比如当前时间、位置、速度。仿真每前进一步，`data` 都会变化。

```python
print("nq:", model.nq)
print("nv:", model.nv)
print("nu:", model.nu)
```

`print` 用来输出信息。`model.nq` 是位置变量数量，`model.nv` 是速度变量数量，`model.nu` 是控制输入数量。这个例子没有电机，所以 `nu` 是 0。

```python
print("initial time:", data.time)
print("initial qpos:", data.qpos.copy())
```

这里打印初始时间和初始位置。`data.time` 一开始是 0。`data.qpos` 是位置数组。`.copy()` 表示复制一份数组再打印，避免以后数组变化时影响你理解输出。

```python
for _ in range(100):
    mujoco.mj_step(model, data)
```

`for` 是循环。`range(100)` 表示循环 100 次。`_` 是一个临时变量名，表示“我不关心当前是第几次”。每次循环都会调用一次 `mj_step`，仿真就前进一步。

```python
print("final time:", data.time)
print("final qpos:", data.qpos.copy())
```

循环结束后，再打印最终时间和最终位置。你会看到时间从 0 变成约 1.0，方块的位置也变了。

```python
if __name__ == "__main__":
    main()
```

这是 Python 常见写法。意思是：如果你直接运行这个文件，就调用 `main()` 函数。如果这个文件被别的文件导入，就不会自动运行 `main()`。

运行:

```bash
python ch1_first_sim.py
```

## 5.运行结果说明

你应该看到类似输出:

```text
nq: 7
nv: 6
nu: 0
initial time: 0.0
final time: 1.0000000000000007
```

`freejoint` 有 7 个位置变量: `x y z qw qx qy qz`。自由刚体有 6 个速度变量: `vx vy vz wx wy wz`。

你还会看到 `final qpos` 里的 z 坐标比初始时小。原因是方块受到重力作用向下掉落。如果方块撞到地面，MuJoCo 会计算碰撞，让它不会无限向下穿透。

## 6.验证步骤

确认版本:

```bash
python -c "import mujoco; print(mujoco.__version__)"
```

确认导入的是官方 bindings:

```bash
python -c "import mujoco; print(mujoco)"
```

运行程序:

```bash
python ch1_first_sim.py
```

检查 `final time` 是否约等于 `1.0`。

再做几个小实验：

1. 把 `pos="0 0 1"` 改成 `pos="0 0 2"`，观察初始高度变化。
2. 把 `gravity="0 0 -9.81"` 改成 `gravity="0 0 -1"`，观察下落是否变慢。
3. 把 `timestep="0.01"` 改成 `timestep="0.005"`，观察 100 步后的 `final time` 是否变成约 `0.5`。
4. 删除 `<freejoint name="box_free"/>`，观察方块是否还会下落。

第 4 个实验很关键：没有自由关节时，body 会被固定在父节点上，不能自由运动。

## 7.常见错误与解决方案

### `ModuleNotFoundError: No module named 'mujoco'`

解决:

```bash
pip install "mujoco>=2.3"
```

### 图形或 OpenGL 相关报错

先安装系统依赖:

```bash
sudo dnf install -y mesa-libGL mesa-dri-drivers glfw glfw-devel libX11 libXi libXrandr
```

### XML 解析失败

检查:

1. 标签是否闭合
2. 属性是否带引号
3. 根节点是否是 `<mujoco>`
4. `body` 是否放在 `<worldbody>` 内部

### `final time` 不是严格等于 `1.0`

这通常不是错误。浮点数计算可能得到：

```text
1.0000000000000007
```

只要接近 `1.0` 就正常。

### 方块没有掉下来

检查：

1. 方块 body 里是否有 `<freejoint/>`
2. 重力是否是 `0 0 -9.81`
3. 是否真的调用了 `mujoco.mj_step(model, data)`
4. 你看的是否是 `final qpos`，不是 `initial qpos`

## 8.本章小结

本章你已经完成了 MuJoCo 的最小闭环：

```text
XML 模型 → MjModel → MjData → mj_step → 读取状态
```

后面所有复杂任务，本质都是在这个闭环上继续增加内容：更多 body、更多 joint、更多 actuator、更复杂的控制逻辑和奖励函数。
