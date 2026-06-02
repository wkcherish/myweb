# 3.动作价值函数

## 3.1.DQN

Deep Q-Network是一种价值学习的方法，用一个神经网络去近似Q\*函数，将神经网络近似为Q（s,a;w）

![](..//images/feishu/assets/2025-12-04-强化学习-018.png)

![](..//images/feishu/assets/2025-12-04-强化学习-019.png)

DQN算法的描述：

![](..//images/feishu/assets/2025-12-04-强化学习-020.png)

这里的Dense指的是全连接层

![](..//images/feishu/assets/2025-12-04-强化学习-021.png)

当前观测的状态为St，用DQN把St作为输入，给所有的动作打分，选出动作最高的动作作为at，agent做出at动作后，环境会改变状态，用状态转移函数p来随机抽一个新的状态st+1，环境还会告诉我们这一步的奖励Rt，这个奖励可以+-0，奖励是强化学习中的监督信号，DQN要靠这些奖励来训练，有了新的状态St+1，DQN会再对所有的动作打分，agent选择分数最高的动作作为at+1，agent执行at+1后，环境会再更新状态s和再给一个奖励R，然后会继续重复之前的动作 训练DQN的最常用方法是TD算法

## 3.2.DQN的举例

![](..//images/feishu/assets/2025-12-04-强化学习-022.png)

上方进行模型预测的话需要完成整个过程才可以对模型进行更新，使用TD算法可以改进这一问题，不需要完成整个过程，只需要利用其中的一段过程来更新模型

![](..//images/feishu/assets/2025-12-04-强化学习-023.png)

![](..//images/feishu/assets/2025-12-04-强化学习-024.png)

![](..//images/feishu/assets/2025-12-04-强化学习-025.png)

TD算法的原理是尽可能的让TD error=0(预计时间与实际时间相等)，TD算法要用梯度下降来减少TD error

## 3.3.TD算法

![](..//images/feishu/assets/2025-12-04-强化学习-026.png)

强化学习TD算法公式的粗略解释：

![](..//images/feishu/assets/2025-12-04-强化学习-027.png)

![](..//images/feishu/assets/2025-12-04-强化学习-028.png)

![](..//images/feishu/assets/2025-12-04-强化学习-029.png)

![](..//images/feishu/assets/2025-12-04-强化学习-030.png)

TD算法总结：

![](..//images/feishu/assets/2025-12-04-强化学习-031.png)