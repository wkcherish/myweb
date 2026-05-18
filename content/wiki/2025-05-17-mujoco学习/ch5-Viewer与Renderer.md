# 5.Viewer 可视化与 Renderer 离屏渲染

## 1.目标说明

本章掌握两类可视化方式:

1. 交互式 viewer: 适合人工观察仿真
2. 离屏 renderer: 适合生成图像观测、保存数据、训练视觉策略

使用官方接口:

```python
import mujoco.viewer
mujoco.viewer.launch_passive(model, data)
```

以及:

```python
renderer = mujoco.Renderer(model)
image = renderer.render()
```

新手建议先理解二者区别：

| 工具 | 用途 | 是否打开窗口 | 常见场景 |
|:---|:---|:---|:---|
| Viewer | 人眼实时观察仿真 | 是 | 调试模型、看控制效果 |
| Renderer | 生成图像数组 | 否 | 保存图片、训练视觉策略、服务器批量采集 |

## 2.环境与依赖安装

Fedora 44 系统依赖:

```bash
sudo dnf install -y \
  mesa-libGL mesa-libGLU mesa-dri-drivers \
  libglvnd-glx libglvnd-opengl \
  glfw glfw-devel \
  libX11 libXcursor libXi libXinerama libXrandr
```

pip:

```bash
pip install "mujoco>=2.3" numpy pillow
```

conda:

```bash
conda create -n mujoco-render python=3.10 -y
conda activate mujoco-render
pip install "mujoco>=2.3" numpy pillow
```

离屏渲染后端:

```bash
export MUJOCO_GL=egl
```

或:

```bash
export MUJOCO_GL=osmesa
```

可能存在版本差异: 不同显卡驱动、Mesa、EGL 支持情况不同。如果 `egl` 失败，再尝试 `osmesa`。

如果你在本机桌面环境运行，通常先不要设置 `MUJOCO_GL`，直接运行 viewer。只有在远程服务器、无显示器环境或保存离屏图片时报 OpenGL 错误时，再尝试设置。

## 3.核心概念解释

Viewer 是实时窗口。Renderer 是把仿真画面渲染成 NumPy 图像数组。

典型 viewer 流程:

```python
with mujoco.viewer.launch_passive(model, data) as viewer:
    while viewer.is_running():
        mujoco.mj_step(model, data)
        viewer.sync()
```

典型 renderer 流程:

```python
renderer = mujoco.Renderer(model, height=480, width=640)
mujoco.mj_step(model, data)
renderer.update_scene(data)
image = renderer.render()
```

### viewer 的同步逻辑

viewer 只是显示窗口，不会自动帮你推进仿真。你仍然需要：

```python
mujoco.mj_step(model, data)
viewer.sync()
```

`mj_step` 负责算物理，`viewer.sync()` 负责把最新状态同步到窗口。

### 为什么要 sleep

如果不控制循环速度，仿真可能跑得非常快，窗口里一闪而过。示例代码用：

```python
sleep_time = model.opt.timestep - (time.time() - step_start)
```

让真实时间尽量接近仿真时间。例如 timestep 是 0.01 秒，就尽量每 0.01 秒显示一步。

### renderer 输出是什么

```python
image = renderer.render()
```

得到的是 NumPy 数组，形状通常是：

```text
(height, width, 3)
```

最后一维的 3 表示 RGB 三个颜色通道。保存图片时可以交给 Pillow：

```python
Image.fromarray(image).save("render_output.png")
```

## 4.最小可运行代码（MRE）

交互式 Viewer:

```python
import time

import mujoco
import mujoco.viewer


XML = """
<mujoco model="viewer_demo">
  <option timestep="0.01" gravity="0 0 -9.81"/>

  <worldbody>
    <light name="top_light" pos="0 0 3"/>
    <geom name="floor" type="plane" size="3 3 0.1" rgba="0.8 0.8 0.8 1"/>

    <body name="box" pos="0 0 1">
      <freejoint name="box_free"/>
      <geom name="box_geom" type="box" size="0.15 0.15 0.15" mass="1" rgba="1 0 0 1"/>
    </body>
  </worldbody>
</mujoco>
"""


def main() -> None:
    model = mujoco.MjModel.from_xml_string(XML)
    data = mujoco.MjData(model)

    with mujoco.viewer.launch_passive(model, data) as viewer:
        while viewer.is_running() and data.time < 5.0:
            step_start = time.time()
            mujoco.mj_step(model, data)
            viewer.sync()

            sleep_time = model.opt.timestep - (time.time() - step_start)
            if sleep_time > 0:
                time.sleep(sleep_time)


if __name__ == "__main__":
    main()
```

保存为：

```bash
touch ch5_viewer.py
```

离屏 Renderer 保存图片:

```python
from pathlib import Path

import mujoco
from PIL import Image


XML = """
<mujoco model="renderer_demo">
  <option timestep="0.01" gravity="0 0 -9.81"/>

  <worldbody>
    <light name="top_light" pos="0 0 3"/>
    <camera name="fixed_camera" pos="1.5 -2.0 1.2" xyaxes="1 0.75 0 0 0 1"/>
    <geom name="floor" type="plane" size="3 3 0.1" rgba="0.8 0.8 0.8 1"/>

    <body name="box" pos="0 0 1">
      <freejoint name="box_free"/>
      <geom name="box_geom" type="box" size="0.15 0.15 0.15" mass="1" rgba="1 0 0 1"/>
    </body>
  </worldbody>
</mujoco>
"""


def main() -> None:
    model = mujoco.MjModel.from_xml_string(XML)
    data = mujoco.MjData(model)
    renderer = mujoco.Renderer(model, height=480, width=640)

    for _ in range(100):
        mujoco.mj_step(model, data)

    renderer.update_scene(data, camera="fixed_camera")
    image = renderer.render()

    output_path = Path("render_output.png")
    Image.fromarray(image).save(output_path)
    renderer.close()

    print("saved:", output_path.resolve())
    print("image shape:", image.shape)


if __name__ == "__main__":
    main()
```

保存为：

```bash
touch ch5_renderer.py
```

### 代码逐段解释

viewer 上下文：

```python
with mujoco.viewer.launch_passive(model, data) as viewer:
```

`with` 语句会创建窗口，并在退出时自动清理资源。

窗口循环：

```python
while viewer.is_running() and data.time < 5.0:
```

只要窗口没有被关闭，并且仿真时间还没到 5 秒，就继续运行。

固定相机：

```xml
<camera name="fixed_camera" pos="1.5 -2.0 1.2" xyaxes="1 0.75 0 0 0 1"/>
```

Renderer 示例中定义了一个固定相机。这样每次保存的图片视角一致，适合做数据采集。

### Viewer 代码逐行细讲

```python
import time
```

导入时间模块。后面用它控制 viewer 循环速度，让画面不要跑得太快。

```python
import mujoco
import mujoco.viewer
```

第一行导入 MuJoCo 基础功能。第二行导入 MuJoCo 的 viewer 模块，用来打开交互式窗口。

```python
with mujoco.viewer.launch_passive(model, data) as viewer:
```

打开一个 viewer 窗口。`launch_passive` 的意思是“被动 viewer”：它负责显示，但仿真推进仍然由你的 Python 代码控制。

```python
while viewer.is_running() and data.time < 5.0:
```

只要窗口还开着，并且仿真时间小于 5 秒，就继续循环。如果你手动关闭窗口，`viewer.is_running()` 会变成 false，循环结束。

```python
step_start = time.time()
```

记录当前真实时间。后面用它计算这一轮循环花了多久。

```python
mujoco.mj_step(model, data)
viewer.sync()
```

`mj_step` 推进物理仿真。`viewer.sync()` 把最新的 `data` 同步到窗口里显示。没有 `sync()`，窗口可能看不到最新状态。

```python
sleep_time = model.opt.timestep - (time.time() - step_start)
```

计算还需要等待多久。假设 timestep 是 0.01 秒，而这一轮计算只花了 0.003 秒，那就 sleep 约 0.007 秒。

```python
if sleep_time > 0:
    time.sleep(sleep_time)
```

如果还有剩余时间，就暂停一会儿。这样 viewer 看起来更接近真实速度。

### Renderer 代码逐行细讲

```python
from pathlib import Path
```

导入 `Path`，用来处理文件路径。相比直接写字符串，`Path("render_output.png")` 更清晰。

```python
from PIL import Image
```

导入 Pillow 的图片工具。MuJoCo Renderer 输出的是数组，Pillow 可以把数组保存成 PNG 图片。

```xml
<camera name="fixed_camera" pos="1.5 -2.0 1.2" xyaxes="1 0.75 0 0 0 1"/>
```

定义一个相机。`name` 是相机名字。`pos` 是相机在世界里的位置。`xyaxes` 控制相机朝向，初学时可以先照抄，后面通过改 `pos` 来调视角。

```python
renderer = mujoco.Renderer(model, height=480, width=640)
```

创建离屏渲染器。`height` 和 `width` 决定输出图片大小。

```python
for _ in range(100):
    mujoco.mj_step(model, data)
```

先让仿真跑 100 步。这样保存图片时，方块已经下落了一段时间。

```python
renderer.update_scene(data, camera="fixed_camera")
```

告诉 renderer：用当前 `data` 的状态更新画面，并使用名为 `fixed_camera` 的相机视角。

```python
image = renderer.render()
```

真正渲染出图像。`image` 是一个 NumPy 数组，不是文件。

```python
Image.fromarray(image).save(output_path)
```

把数组转换成图片，并保存到 `render_output.png`。

```python
renderer.close()
```

关闭 renderer，释放图形资源。写小脚本时不一定马上出问题，但养成关闭资源的习惯更好。

## 5.运行结果说明

Viewer 示例会打开窗口，显示红色方块下落。Renderer 示例会生成 `render_output.png`，并输出图像数组形状，例如 `(480, 640, 3)`。

如果图片里看不到方块，先检查：

1. 方块是否掉到相机视野外。
2. camera 位置是否合理。
3. 是否在 `renderer.update_scene(data, camera="fixed_camera")` 里指定了正确相机名。

## 6.验证步骤

运行 viewer:

```bash
python ch5_viewer.py
```

运行 renderer:

```bash
python ch5_renderer.py
```

如果在服务器上运行:

```bash
MUJOCO_GL=egl python ch5_renderer.py
```

或:

```bash
MUJOCO_GL=osmesa python ch5_renderer.py
```

再做几个练习：

1. 把 renderer 分辨率改成 `height=240, width=320`，观察输出 shape。
2. 把方块颜色改成蓝色，重新保存图片。
3. 把相机 `pos` 改远一点，观察画面中物体是否变小。
4. 把 viewer 示例中的 `data.time < 5.0` 改成 `data.time < 20.0`，观察更长时间。

## 7.常见错误与解决方案

### viewer 窗口打不开

安装:

```bash
sudo dnf install -y glfw glfw-devel libX11 libXi libXrandr libXcursor libXinerama
```

### `GLFWError`

可能是图形环境不可用。本机桌面优先测试 X11；远程服务器优先使用 Renderer 离屏渲染。

### Renderer 报 OpenGL 后端错误

尝试 `MUJOCO_GL=egl` 或 `MUJOCO_GL=osmesa`。可能存在版本差异。

### 保存图片是黑的

检查：

1. XML 里是否有 light。
2. 相机是否对着模型。
3. 是否先 `renderer.update_scene(data, camera="...")` 再 `renderer.render()`。
4. 物体是否已经掉出视野。

### 远程服务器没有显示器

不要强行打开 viewer。优先使用 Renderer，并尝试：

```bash
MUJOCO_GL=egl python ch5_renderer.py
```

如果 EGL 不可用，再尝试：

```bash
MUJOCO_GL=osmesa python ch5_renderer.py
```

## 8.本章小结

Viewer 用来调试，Renderer 用来生成图像。实际项目里常见流程是：

1. 先用 viewer 看模型和控制是否正常。
2. 再用 renderer 保存图片或构造视觉观测。
3. 最后把状态、动作、图像、奖励组织成训练数据。
