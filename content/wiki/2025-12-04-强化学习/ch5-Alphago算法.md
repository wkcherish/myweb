# 5.Alphago算法

这一算法有两种实现形式：通过模仿学习来训练策略网络或通过强化学习来训练策略网络

## 5.1.Behavior cloning训练策略网络

使用behavior cloning来训练策略网络，模仿人类的动作来实现任务的，不会用到rewards奖励；behavior cloning的缺陷是无法保证状态St一定出现在训练数据中，策略网络没有见过状态St，策略网络的决策at就会比较差，会使得错误累加，导致状态变得越来越奇怪

![](..//images/feishu/assets/2025-12-04-强化学习-058.png)

## 5.2.上述弊端的解决方式

采用强化学习的方式训练策略网络

![](..//images/feishu/assets/2025-12-04-强化学习-059.png)

Alphago让两个策略网络进行博弈(player和opponent)，Player就是agent，它是由策略网络来控制的，用的是策略网络最新的模型参数，每下完一局围棋，把胜负作为奖励，靠奖励来更新player的参数；opponent相当于环境，它是用来陪agent的，每当player下一个棋子，opponent也要跟着走一步，相当于随机状态转移，opponent也是策略网络来控制的，但是opponent的参数不用学习，随机从旧的参数中选出一个作为opponent的参数即可

![](..//images/feishu/assets/2025-12-04-强化学习-060.png)

![](..//images/feishu/assets/2025-12-04-强化学习-061.png)

强化学习训练策略网络的总结：

![](..//images/feishu/assets/2025-12-04-强化学习-062.png)