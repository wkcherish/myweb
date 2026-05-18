# 2.XML 与 MJCF 物理建模基础

## 1.目标说明

本章学习 MuJoCo 的 MJCF XML 基础。MJCF 是 MuJoCo 使用的模型描述格式。你不需要先完整学习 XML 语言，只需要掌握 MuJoCo 常用标签，以及它们之间的层级关系。

本章结束后，你应该能看懂一个简单模型里：

1. 地面在哪里。
2. 物体初始位置在哪里。
3. 几何体是什么形状。
4. 哪些 body 可以自由运动。
5. 如何用名字在 Python 里找到 XML 中的对象。

| 标签 | 作用 |
|:---|:---|
| `<mujoco>` | 根节点 |
| `<option>` | 仿真参数 |
| `<worldbody>` | 世界中的物体 |
| `<body>` | 刚体 |
| `<geom>` | 几何体、碰撞体、可视体 |
| `<joint>` / `<freejoint>` | 关节 |
| `<site>` | 标记点 |
| `<actuator>` | 控制器 |

初学时可以先记住：

```text
body 是刚体，geom 是形状，joint 是运动方式，site 是标记点。
```

## 2.环境与依赖安装

Fedora 44 系统依赖:

```bash
sudo dnf install -y mesa-libGL mesa-dri-drivers glfw glfw-devel
```

pip:

```bash
pip install "mujoco>=2.3" numpy
```

conda:

```bash
conda create -n mujoco-xml python=3.10 -y
conda activate mujoco-xml
pip install "mujoco>=2.3" numpy
```

版本冲突说明:

1. MJCF XML 标签随 MuJoCo 版本会持续扩展。
2. 本章使用基础标签，适用于 `mujoco>=2.3`。
3. 某些新 XML 属性可能存在版本差异，本文避免使用高版本专属属性。

## 3.核心概念解释

MJCF 是 MuJoCo 的 XML 建模格式。最小结构:

```xml
<mujoco model="name">
  <worldbody>
    ...
  </worldbody>
</mujoco>
```

`body` 表示刚体。`geom` 表示几何形状，可以用于碰撞、质量、渲染。`joint` 表示刚体相对父刚体如何运动。

### 层级结构非常重要

MuJoCo 模型不是一堆平铺的物体，而是一棵树：

```text
worldbody
├── floor geom
└── red_box body
    ├── freejoint
    ├── red_box_geom
    └── box_center site
```

`red_box_geom` 和 `box_center` 都属于 `red_box` 这个 body。body 移动时，它内部的 geom 和 site 也会跟着移动。

```xml
<body name="box" pos="0 0 1">
  <freejoint name="box_free"/>
  <geom type="box" size="0.1 0.1 0.1"/>
</body>
```

含义:

1. 创建名为 `box` 的刚体
2. 初始位置在世界坐标 `(0, 0, 1)`
3. 它有一个自由关节
4. 它有一个盒子几何体

### 坐标怎么理解

MuJoCo 默认使用三维坐标：

```text
x: 左右方向
y: 前后方向
z: 上下方向
```

例如：

```xml
pos="0 0 1"
```

表示 x=0、y=0、z=1，也就是放在世界原点上方 1 米的位置。

### geom 的 size 怎么理解

不同 `type` 的 `size` 含义不同：

| `type` | `size` 示例 | 含义 |
|:---|:---|:---|
| `box` | `size="0.1 0.2 0.3"` | x/y/z 半边长，不是完整长度 |
| `sphere` | `size="0.1"` | 球半径 |
| `capsule` | `size="0.03"` | 胶囊半径，长度常用 `fromto` 指定 |
| `plane` | `size="3 3 0.1"` | 可视平面大小，通常当地面 |

最容易踩坑的是 box：`size="0.1 0.1 0.1"` 表示边长大约是 `0.2`，因为 MuJoCo 用的是半边长。

### site 是什么

`site` 是一个不参与碰撞的小标记点。它常用于：

1. 标记机械臂末端。
2. 标记目标位置。
3. 放传感器或相机参考点。
4. 在 Python 中读取某个关键点的世界坐标。

在后面的 Reacher 任务中，`tip` 和 `target` 就会用 site 表示。

## 4.最小可运行代码（MRE）

```python
import mujoco
import numpy as np


XML = """
<mujoco model="xml_basic">
  <option timestep="0.01" gravity="0 0 -9.81"/>

  <worldbody>
    <geom name="floor" type="plane" size="3 3 0.1" rgba="0.7 0.7 0.7 1"/>

    <body name="red_box" pos="0 0 1">
      <freejoint name="red_box_free"/>
      <geom name="red_box_geom" type="box" size="0.15 0.15 0.15" mass="1" rgba="1 0 0 1"/>
      <site name="box_center" pos="0 0 0" size="0.03" rgba="0 1 0 1"/>
    </body>
  </worldbody>
</mujoco>
"""


def main() -> None:
    model = mujoco.MjModel.from_xml_string(XML)
    data = mujoco.MjData(model)

    box_body_id = mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_BODY, "red_box")
    site_id = mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_SITE, "box_center")

    if box_body_id < 0:
        raise RuntimeError("body red_box not found")
    if site_id < 0:
        raise RuntimeError("site box_center not found")

    for _ in range(200):
        mujoco.mj_step(model, data)

    print("simulation time:", data.time)
    print("box body position:", data.xpos[box_body_id].copy())
    print("site position:", data.site_xpos[site_id].copy())
    print("box qpos:", np.array(data.qpos))


if __name__ == "__main__":
    main()
```

保存为：

```bash
touch ch2_xml_basic.py
```

运行:

```bash
python ch2_xml_basic.py
```

### 代码逐段解释

用名字查找 body：

```python
box_body_id = mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_BODY, "red_box")
```

MuJoCo 内部主要用数字 ID 管理对象。你在 XML 里写的是名字，Python 读取数组时常常需要先把名字转成 ID。

用名字查找 site：

```python
site_id = mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_SITE, "box_center")
```

注意第二个参数是对象类型。查 body 就用 `mjOBJ_BODY`，查 site 就用 `mjOBJ_SITE`。名字相同但类型不同，也不是同一个对象。

读取世界坐标：

```python
data.xpos[box_body_id]
data.site_xpos[site_id]
```

`xpos` 是 body 的世界坐标，`site_xpos` 是 site 的世界坐标。

### 代码逐行细讲

```python
import mujoco
import numpy as np
```

第一行导入 MuJoCo。第二行导入 NumPy，并给它起别名 `np`。NumPy 是 Python 里处理数组和数值计算最常用的库。`as np` 是习惯写法，后面就可以写 `np.array(...)`、`np.round(...)`。

```python
XML = """
...
"""
```

这里把 MJCF 模型保存成字符串。Python 不会理解 XML 的物理含义，真正解析 XML 的是 `mujoco.MjModel.from_xml_string(XML)`。

```xml
<site name="box_center" pos="0 0 0" size="0.03" rgba="0 1 0 1"/>
```

`site` 是标记点。`pos="0 0 0"` 表示这个点在 red_box body 的局部原点。`size="0.03"` 表示显示出来的小球大小。`rgba="0 1 0 1"` 表示绿色。

```python
box_body_id = mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_BODY, "red_box")
```

这行的作用是：根据名字 `"red_box"` 找到对应 body 的数字 ID。MuJoCo 内部数组不用名字索引，而是用数字索引，所以要先把名字转换成 ID。

拆开看：

1. `mujoco.mj_name2id` 是 MuJoCo 提供的查找函数。
2. `model` 是被查询的模型。
3. `mujoco.mjtObj.mjOBJ_BODY` 表示要找的是 body。
4. `"red_box"` 是 XML 里写的名字。

```python
site_id = mujoco.mj_name2id(model, mujoco.mjtObj.mjOBJ_SITE, "box_center")
```

这行同理，只是查找对象类型换成了 site，名字换成了 `"box_center"`。

```python
if box_body_id < 0:
    raise RuntimeError("body red_box not found")
```

`if` 是条件判断。`mj_name2id` 找不到对象时会返回 `-1`。所以如果 ID 小于 0，就说明名字写错了。`raise RuntimeError(...)` 表示主动抛出错误，让程序停下来并告诉你原因。

```python
for _ in range(200):
    mujoco.mj_step(model, data)
```

这段让仿真运行 200 步。因为 timestep 是 0.01，所以仿真时间约为 2 秒。

```python
print("box body position:", data.xpos[box_body_id].copy())
```

`data.xpos` 保存所有 body 的世界坐标。`data.xpos[box_body_id]` 表示取出 red_box 这个 body 的世界坐标。

```python
print("site position:", data.site_xpos[site_id].copy())
```

`data.site_xpos` 保存所有 site 的世界坐标。因为 `box_center` 放在 box 的中心，所以它的位置通常和 box body 的位置接近。

```python
print("box qpos:", np.array(data.qpos))
```

这里打印广义位置数组。`np.array(data.qpos)` 把 MuJoCo 内部数组转成 NumPy 数组，方便显示和后续计算。

## 5.运行结果说明

程序会输出 `simulation time`、box 的世界坐标、site 的世界坐标和 `qpos`。

`data.xpos[box_body_id]` 是 body 的世界坐标位置。`data.site_xpos[site_id]` 是 site 的世界坐标位置。`mujoco.mj_name2id(...)` 用名字查找模型元素 ID。

如果 `box_center` 的 `pos="0 0 0"`，那么它位于 box body 的局部原点。由于这个例子里 site 放在 body 中心，所以 body position 和 site position 通常非常接近。

如果你把 site 改成：

```xml
<site name="box_top" pos="0 0 0.15" size="0.03" rgba="0 1 0 1"/>
```

那么 site 会在盒子局部坐标的上方，输出的 `site position` 就会比 body position 的 z 坐标更高。

## 6.验证步骤

1. 把 `red_box` 的初始高度从 `1` 改成 `2`。
2. 重新运行程序。
3. 观察 `box qpos` 和最终位置是否变化。
4. 故意把 `site` 名称改错，确认程序能报错。
5. 把 `geom` 的颜色 `rgba="1 0 0 1"` 改成 `rgba="0 0 1 1"`，后面用 viewer 看颜色变化。
6. 把 `box_center` 的 `pos` 改成 `0 0 0.2`，观察 `site position` 如何变化。

## 7.常见错误与解决方案

### `XML Error: Schema violation`

说明 XML 标签或属性不合法。查官方 XML Reference，确认标签放在正确父标签下面，属性名拼写正确。

### `mj_name2id` 返回 `-1`

说明名字没有找到。检查 XML 中 `name="..."`，并确认对象类型正确。

### 物体不下落

检查:

1. body 是否有 `freejoint`
2. gravity 是否为 `0 0 -9.81`
3. body 是否被固定在 `worldbody` 中

### 坐标看起来不符合预期

先区分两种坐标：

| 坐标 | 含义 |
|:---|:---|
| XML 里的 `pos` | 相对父 body 的局部坐标 |
| `data.xpos` / `data.site_xpos` | 仿真更新后的世界坐标 |

如果你修改了 `data.qpos`，但还没调用 `mj_forward` 或 `mj_step`，世界坐标可能还没有更新。

## 8.本章小结

MJCF 建模先掌握四件事：

1. `body` 表示刚体层级。
2. `geom` 表示形状、碰撞和质量。
3. `joint` 决定 body 能不能动、怎么动。
4. `site` 用来标记关键点，方便 Python 读取位置。

只要能看懂 body、geom、joint、site，后面搭建 Cartpole 和 Reacher 就不会迷路。
