# 8.Gymnasium 风格强化学习接口基础

## 1.目标说明

本章把 MuJoCo 任务封装成类似 Gymnasium 的接口。

你将实现:

```python
obs, info = env.reset()
obs, reward, terminated, truncated, info = env.step(action)
```

这为后续强化学习、模仿学习、VLA 数据采集打基础。

前面章节的代码都是“脚本式”的：在 `main()` 里写循环。本章要把同样的逻辑封装成环境类。这样强化学习算法就可以用统一方式调用你的 MuJoCo 任务。

可以先记住 Gymnasium 环境的核心交互：

```text
reset 得到初始 obs
循环：
  policy 根据 obs 产生 action
  env.step(action) 返回 next_obs、reward、done 信息
```

## 2.环境与依赖安装

Fedora 44 系统依赖:

```bash
sudo dnf install -y python3 python3-pip mesa-libGL mesa-dri-drivers glfw
```

pip:

```bash
pip install "mujoco>=2.3" numpy gymnasium
```

conda:

```bash
conda create -n mujoco-gym-api python=3.10 -y
conda activate mujoco-gym-api
pip install "mujoco>=2.3" numpy gymnasium
```

版本冲突说明:

1. 本章使用 `gymnasium`，不是旧版 `gym`。
2. Gymnasium API 与旧 Gym API 有差异。
3. 旧 Gym 常见返回值是 4 个: `obs, reward, done, info`。
4. Gymnasium 返回值是 5 个: `obs, reward, terminated, truncated, info`。

## 3.核心概念解释

强化学习环境接口包含:

| 方法 | 作用 |
|:---|:---|
| `reset()` | 重置环境 |
| `step(action)` | 执行动作 |
| `observation_space` | 观测空间 |
| `action_space` | 动作空间 |

一个最小环境需要完成:

```text
reset 初始化状态
step 写入 data.ctrl
mj_step 推进仿真
计算 obs/reward/done
返回结果
```

### `terminated` 和 `truncated` 的区别

Gymnasium 把“结束”拆成两个概念：

| 字段 | 含义 | 例子 |
|:---|:---|:---|
| `terminated` | 任务自然结束 | 机械臂到达目标、机器人摔倒 |
| `truncated` | 因外部限制截断 | 达到最大步数、时间限制 |

本章中：

```python
terminated = dist < 0.05
truncated = self.steps >= self.max_steps
```

也就是：

1. 末端距离目标小于 0.05，任务成功结束。
2. 步数超过上限，episode 被截断。

### `observation_space` 和 `action_space`

这两个对象告诉算法：

```text
观测长什么样
动作允许多大
```

例如：

```python
self.action_space = spaces.Box(low=-1.0, high=1.0, shape=(2,), dtype=np.float32)
```

表示动作是 2 维数组，每个值都在 `[-1, 1]` 范围内。

```python
self.observation_space = spaces.Box(low=-np.inf, high=np.inf, shape=(10,), dtype=np.float32)
```

表示观测是 10 维浮点数组，数值范围不强行限制。

### frame_skip 是什么

```python
self.frame_skip = 5
```

表示外部调用一次 `env.step(action)`，内部连续执行 5 次 MuJoCo `mj_step`。这样做很常见，因为控制策略不一定需要每个物理时间步都重新给动作。

## 4.最小可运行代码（MRE）

```python
import gymnasium as gym
import mujoco
import numpy as np
from gymnasium import spaces


XML = """
<mujoco model="gym_reacher">
  <option timestep="0.01" gravity="0 0 0"/>

  <worldbody>
    <site name="target" pos="0.5 0 0.4" size="0.04" rgba="1 0 0 1"/>

    <body name="link1" pos="0 0 0.4">
      <joint name="joint1" type="hinge" axis="0 1 0" damping="0.1"/>
      <geom name="link1_geom" type="capsule" fromto="0 0 0 0.3 0 0" size="0.025" mass="0.2"/>

      <body name="link2" pos="0.3 0 0">
        <joint name="joint2" type="hinge" axis="0 1 0" damping="0.1"/>
        <geom name="link2_geom" type="capsule" fromto="0 0 0 0.3 0 0" size="0.025" mass="0.2"/>
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


class ReacherEnv(gym.Env):
    metadata = {"render_modes": []}

    def __init__(self) -> None:
        super().__init__()
        self.model = mujoco.MjModel.from_xml_string(XML)
        self.data = mujoco.MjData(self.model)

        self.tip_site_id = mujoco.mj_name2id(self.model, mujoco.mjtObj.mjOBJ_SITE, "tip")
        self.target_site_id = mujoco.mj_name2id(self.model, mujoco.mjtObj.mjOBJ_SITE, "target")
        if self.tip_site_id < 0 or self.target_site_id < 0:
            raise RuntimeError("required sites not found")

        self.frame_skip = 5
        self.max_steps = 200
        self.steps = 0

        self.action_space = spaces.Box(low=-1.0, high=1.0, shape=(2,), dtype=np.float32)
        self.observation_space = spaces.Box(low=-np.inf, high=np.inf, shape=(10,), dtype=np.float32)

    def _get_obs(self) -> np.ndarray:
        tip = self.data.site_xpos[self.tip_site_id].copy()
        target = self.data.site_xpos[self.target_site_id].copy()
        obs = np.concatenate([self.data.qpos.copy(), self.data.qvel.copy(), tip, target])
        return obs.astype(np.float32)

    def _get_reward(self) -> float:
        tip = self.data.site_xpos[self.tip_site_id]
        target = self.data.site_xpos[self.target_site_id]
        dist = np.linalg.norm(tip - target)
        control_cost = 0.01 * np.sum(np.square(self.data.ctrl))
        return float(-dist - control_cost)

    def reset(self, *, seed: int | None = None, options: dict | None = None):
        super().reset(seed=seed)
        mujoco.mj_resetData(self.model, self.data)

        self.data.qpos[:] = self.np_random.uniform(low=-0.1, high=0.1, size=self.model.nq)
        self.data.qvel[:] = 0.0
        mujoco.mj_forward(self.model, self.data)

        self.steps = 0
        return self._get_obs(), {}

    def step(self, action):
        action = np.asarray(action, dtype=np.float32)
        action = np.clip(action, self.action_space.low, self.action_space.high)

        self.data.ctrl[:] = action
        for _ in range(self.frame_skip):
            mujoco.mj_step(self.model, self.data)

        self.steps += 1

        obs = self._get_obs()
        reward = self._get_reward()

        tip = self.data.site_xpos[self.tip_site_id]
        target = self.data.site_xpos[self.target_site_id]
        dist = float(np.linalg.norm(tip - target))

        terminated = dist < 0.05
        truncated = self.steps >= self.max_steps
        info = {"distance": dist}
        return obs, reward, terminated, truncated, info


def main() -> None:
    env = ReacherEnv()
    obs, info = env.reset(seed=0)
    print("initial obs shape:", obs.shape)
    print("initial info:", info)

    total_reward = 0.0
    for step in range(20):
        action = env.action_space.sample()
        obs, reward, terminated, truncated, info = env.step(action)
        total_reward += reward
        print("step:", step, "reward:", round(reward, 3), "distance:", round(info["distance"], 3))
        if terminated or truncated:
            break

    print("total_reward:", round(total_reward, 3))


if __name__ == "__main__":
    main()
```

保存为：

```bash
touch ch8_gym_env.py
```

运行：

```bash
python ch8_gym_env.py
```

### 代码逐段解释

继承 Gymnasium 环境：

```python
class ReacherEnv(gym.Env):
```

这表示你在定义一个符合 Gymnasium 规范的环境。

初始化模型：

```python
self.model = mujoco.MjModel.from_xml_string(XML)
self.data = mujoco.MjData(self.model)
```

这和前面章节一样，只是现在放到了类的 `__init__` 里。

缓存 site ID：

```python
self.tip_site_id = mujoco.mj_name2id(...)
self.target_site_id = mujoco.mj_name2id(...)
```

不要每次 step 都重复查名字。初始化时查一次 ID，后面直接用 ID 读取数组更清晰。

reset：

```python
def reset(self, *, seed: int | None = None, options: dict | None = None):
```

`reset` 做四件事：

1. 设置随机种子。
2. 重置 MuJoCo data。
3. 随机初始化关节角。
4. 返回初始观测和 info。

step：

```python
def step(self, action):
```

`step` 做六件事：

1. 检查并裁剪 action。
2. 写入 `self.data.ctrl`。
3. 连续推进若干个 MuJoCo 物理步。
4. 计算新观测。
5. 计算奖励和结束条件。
6. 返回 Gymnasium 标准五元组。

### 代码逐行细讲

```python
import gymnasium as gym
```

导入 Gymnasium，并起别名 `gym`。后面写 `gym.Env` 就表示 Gymnasium 的环境基类。

```python
from gymnasium import spaces
```

导入空间定义工具。`spaces.Box` 用来描述连续动作空间和连续观测空间。

```python
class ReacherEnv(gym.Env):
```

定义一个类，名字叫 `ReacherEnv`。括号里的 `gym.Env` 表示它继承 Gymnasium 环境基类。继承后，你需要实现 `reset` 和 `step` 这两个核心方法。

```python
metadata = {"render_modes": []}
```

Gymnasium 环境可以声明支持哪些渲染模式。这里暂时不实现 render，所以写空列表。

```python
def __init__(self) -> None:
```

`__init__` 是类的初始化函数。创建环境时会自动调用，比如 `env = ReacherEnv()`。

```python
super().__init__()
```

调用父类 `gym.Env` 的初始化逻辑。写自定义 Gymnasium 环境时通常保留这行。

```python
self.model = mujoco.MjModel.from_xml_string(XML)
self.data = mujoco.MjData(self.model)
```

把 MuJoCo 模型和状态保存到 `self` 上。`self.model` 和 `self.data` 表示这个环境对象自己的模型和状态。

```python
self.tip_site_id = mujoco.mj_name2id(...)
self.target_site_id = mujoco.mj_name2id(...)
```

提前查好 tip 和 target 的 site ID。这样 `_get_obs` 和 `_get_reward` 里就不用每次按名字查找。

```python
self.frame_skip = 5
self.max_steps = 200
self.steps = 0
```

`frame_skip` 表示一次环境 step 内部跑几个 MuJoCo 物理步。`max_steps` 是一个 episode 最多运行多少步。`steps` 记录当前 episode 已经走了多少步。

```python
self.action_space = spaces.Box(low=-1.0, high=1.0, shape=(2,), dtype=np.float32)
```

定义动作空间。`shape=(2,)` 表示动作是两个数，因为有两个 motor。`low=-1.0` 和 `high=1.0` 表示每个动作值都限制在 -1 到 1。

```python
self.observation_space = spaces.Box(low=-np.inf, high=np.inf, shape=(10,), dtype=np.float32)
```

定义观测空间。`shape=(10,)` 表示观测是 10 个数。`np.inf` 表示无穷大，这里表示不限制观测数值范围。

```python
def _get_obs(self) -> np.ndarray:
```

定义内部函数，用来生成观测。函数名前面的 `_` 是习惯写法，表示这是类内部使用的辅助函数。

```python
tip = self.data.site_xpos[self.tip_site_id].copy()
target = self.data.site_xpos[self.target_site_id].copy()
```

从 MuJoCo data 中读取末端点和目标点坐标。

```python
obs = np.concatenate([self.data.qpos.copy(), self.data.qvel.copy(), tip, target])
return obs.astype(np.float32)
```

拼接观测，并转换成 `float32`。很多强化学习库默认使用 `float32`，所以这里主动转换。

```python
def reset(self, *, seed: int | None = None, options: dict | None = None):
```

定义 reset。`seed` 用来控制随机数，保证实验可以复现。`options` 用来接收额外配置，本章暂时不用。

```python
super().reset(seed=seed)
```

把随机种子交给 Gymnasium 父类处理。之后可以使用 `self.np_random` 生成可复现的随机数。

```python
mujoco.mj_resetData(self.model, self.data)
```

把 MuJoCo 状态重置到默认状态。

```python
self.data.qpos[:] = self.np_random.uniform(low=-0.1, high=0.1, size=self.model.nq)
```

随机初始化关节角。`[:]` 表示修改整个数组。`uniform(low=-0.1, high=0.1, size=self.model.nq)` 表示生成 `model.nq` 个随机数，每个数在 -0.1 到 0.1 之间。

```python
self.data.qvel[:] = 0.0
```

把所有速度清零。也就是每次 reset 时，机械臂从静止开始。

```python
self.steps = 0
return self._get_obs(), {}
```

步数清零，并返回初始观测和空 info。Gymnasium 要求 reset 返回两个值。

```python
def step(self, action):
```

定义 step。外部算法传入动作，环境返回下一步结果。

```python
action = np.asarray(action, dtype=np.float32)
```

把传入的 action 转成 NumPy 数组，并指定类型为 `float32`。

```python
action = np.clip(action, self.action_space.low, self.action_space.high)
```

把动作裁剪到动作空间允许范围内，避免传入过大控制值。

```python
self.data.ctrl[:] = action
```

把动作写入 MuJoCo 控制数组。因为这个环境有两个 actuator，所以 action 也必须是两个数。

```python
for _ in range(self.frame_skip):
    mujoco.mj_step(self.model, self.data)
```

一次环境 step 内部推进多个 MuJoCo 物理步。这里 `frame_skip=5`，所以外部调用一次 `env.step(action)`，内部实际执行 5 次 `mj_step`。

```python
self.steps += 1
```

环境步数加 1。注意这里加的是环境 step，不是 MuJoCo 物理步。

```python
obs = self._get_obs()
reward = self._get_reward()
```

计算新的观测和奖励。

```python
dist = float(np.linalg.norm(tip - target))
```

计算末端到目标的距离，并转换成 Python float。

```python
terminated = dist < 0.05
truncated = self.steps >= self.max_steps
```

如果距离小于 0.05，任务成功结束。若步数达到上限，episode 被截断。

```python
info = {"distance": dist}
return obs, reward, terminated, truncated, info
```

`info` 用来放调试信息。最后返回 Gymnasium 标准五元组。

```python
env = ReacherEnv()
obs, info = env.reset(seed=0)
```

创建环境并重置。`seed=0` 表示使用固定随机种子，方便复现实验。

```python
action = env.action_space.sample()
```

从动作空间里随机采样一个动作。这里还没有训练策略，所以用随机动作测试环境是否能跑。

## 5.运行结果说明

你会看到:

```text
initial obs shape: (10,)
initial info: {}
step: 0 reward: ...
...
total_reward: ...
```

这个环境已经具备强化学习环境的基本结构。

主函数里使用随机动作：

```python
action = env.action_space.sample()
```

所以每次运行的 reward 可能不同。这里的目标不是训练成功，而是验证环境接口能正常工作。

## 6.验证步骤

1. 运行程序。
2. 确认 `obs.shape == (10,)`。
3. 打印 `env.action_space`，应类似 `Box(-1.0, 1.0, (2,), float32)`。
4. 修改 `self.max_steps = 10`，确认环境会更快 `truncated=True`。
5. 把 `terminated = dist < 0.05` 改成 `dist < 0.2`，观察是否更容易结束。
6. 把 `self.frame_skip = 1`，观察每次 step 的物理推进变少。
7. 在 `info` 里加入 `"is_success": dist < 0.05`，模拟常见机器人环境输出。

## 7.常见错误与解决方案

### Gymnasium 返回值数量不匹配

Gymnasium 的 `step` 返回 5 个值:

```python
obs, reward, terminated, truncated, info
```

不是旧 Gym 的 4 个值。

### `data.ctrl[:] = action` 维度错误

检查:

```python
print(self.model.nu)
print(action.shape)
```

两者必须匹配。

### reset 后 site 坐标不更新

解决:

```python
mujoco.mj_forward(self.model, self.data)
```

### `observation_space` 维度和 obs 不一致

检查：

```python
obs = self._get_obs()
print(obs.shape)
print(self.observation_space.shape)
```

两者必须一致。本章观测是：

```text
qpos 2 + qvel 2 + tip 3 + target 3 = 10
```

### action 超过范围

外部算法可能传入超过 action space 的值，所以 step 里要写：

```python
action = np.clip(action, self.action_space.low, self.action_space.high)
```

这能避免无效动作直接写入 `data.ctrl`。

### 忘记返回 info

Gymnasium 的 `reset` 和 `step` 都会返回 info：

```python
obs, info = env.reset()
obs, reward, terminated, truncated, info = env.step(action)
```

即使暂时没有额外信息，也返回 `{}`。

## 8.下一步怎么接强化学习

这个环境已经可以被很多强化学习库包装，但正式训练前还应补充：

1. 更稳定的 reward。
2. 合理的 episode 长度。
3. 可重复的随机目标采样。
4. render 接口。
5. 环境注册代码。
6. 单元测试，检查 reset/step 返回值维度和 dtype。

如果只是自己写训练循环，最小形式是：

```python
env = ReacherEnv()
obs, info = env.reset(seed=0)

for _ in range(1000):
    action = env.action_space.sample()
    obs, reward, terminated, truncated, info = env.step(action)
    if terminated or truncated:
        obs, info = env.reset()
```

## 9.本章小结

Gymnasium 封装并没有改变 MuJoCo 的本质。它只是把前面章节的流程整理成标准接口：

```text
reset:
  mj_resetData → 设置初始状态 → mj_forward → obs

step:
  action → data.ctrl → mj_step → obs/reward/terminated/truncated/info
```

掌握这个接口后，你就可以把 MuJoCo 模型接入强化学习、模仿学习和数据采集流程。
