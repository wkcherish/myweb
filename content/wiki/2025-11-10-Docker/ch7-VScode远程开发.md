# 7.VScode远程开发

1.  插件1：微软Docker工具
    

![](/images/feishu/assets/2025-11-10-Docker-023.png)

docker扩展插件已经进化为container tools了，请安装container tools

![](/images/feishu/assets/2025-11-10-Docker-024.png)

2.  插件2：微软Docker远程开发工具
    

下面这是远程开发的插件。

![](/images/feishu/assets/2025-11-10-Docker-025.png)

![](/images/feishu/assets/2025-11-10-Docker-026.png)

上述教程已经挂载了本地磁盘了，所以在Docker容器中可以轻松访问本地的工程

![](/images/feishu/assets/2025-11-10-Docker-027.png)

安装完拓展之后，vscode进行链接：

1.按ctrl+shift+p

2.输入 "Dev Containers: Attach to Running Container"

3.选择目前运行的容器

4.VS Code 会在新窗口中打开并连接到容器

5.补充一点：在开发时候最好不要将项目所需要的文件夹放到容器中，可以将本地目录挂载到容器内，这样就可以实现项目文件在本地，环境仍然在容器当中 挂载实现方式：

```bash
docker run -v 主机目录:容器目录 image-name
```
```bash
docker run -it -v /home/cherish/project/pi0.5/:/home/cherish/project/pi0.5/ cherish6/ros-humble-opencv411-cuda128-cudnn970-jammy:latest
```

在运行的时候进行挂载，挂载自己的这个项目目录就可以，不会对其他目录产生影响的 需要补充一点非常重要：不要把系统文件给挂载进去，在容器中如果误删除后，本地就崩了！

查看挂载情况：

```bash
mount | grep -i project
```

也可以通过ls来进行查看
