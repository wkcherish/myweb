# 6.手动创建Docker镜像

### 6.1.DockerFile

常用命令：

<!--br {mso-data-placement:same-cell;}--> td {white-space:nowrap;border:0.5pt solid #dee0e3;font-size:10pt;font-style:normal;font-weight:normal;vertical-align:middle;word-break:normal;word-wrap:normal;}
| 指令 | 说明 | 示例 |
|:---|:---|:---|
| FROM | 指定基础镜像，是 Dockerfile 的起点 | FROM ubuntu:22.04 |
| LABEL | 添加元数据（如作者、版本等） | LABEL maintainer=”you@example.com” |
| ENV | 设置环境变量 | ENV PORT=8080 |
| ARG | 构建参数，只在构建期间可用 | ARG VERSION=1.0 |
| RUN | 构建镜像时运行命令 | RUN apt-get update && apt-get install -y curl |
| COPY | 复制文件到镜像中 | COPY . /app |
| ADD | 类似 COPY，额外支持解压 .tar 文件或远程 URL（不推荐用于 URL） | ADD archive.tar.gz /data/ |
| WORKDIR | 设置工作目录 | WORKDIR /opt |
| CMD | 设置容器启动时默认命令（可被 docker run 覆盖） | CMD [“node”, “index.js”] |
| ENTRYPOINT | 设置容器启动时固定命令（通常用于 CLI 工具等） | ENTRYPOINT [“python3”] |
| EXPOSE | 声明镜像内服务监听的端口（不会自动映射） | EXPOSE 80 |
| VOLUME | 声明数据卷挂载点 | VOLUME [“/data”] |
| USER | 设置后续命令执行的用户 | USER appuser |
| ONBUILD | 当镜像作为其他镜像基础镜像时触发的构建指令 | ONBUILD COPY . /src |
| SHELL | 更改默认 shell，比如将 sh -c 改为 bash -c | SHELL [“/bin/bash”, “-c”] |
| HEALTHCHECK | 定义容器运行时的健康检查命令 | `HEALTHCHECK CMD curl –fail http://localhost:8080 |
| STOPSIGNAL | 容器停止时发送的信号 | STOPSIGNAL SIGKILL |

### 6.2.自己创建容器

#### 6.2.1.手动创建

在x86电脑上编译x86的：

```bash
docker build -t ros-melodic-cuda118-cudnn8-bionic:latest .

docker build -t ros-noetic-focal:latest .

docker build -t ros-humble-jammy:latest .

docker build -t ros-jazzy-noble:latest .

docker build -t ros-humble-opencv411-cuda128-cudnn970-jammy:latest .

docker build -t ros-jazzy-opencv411-cuda128-cudnn970-noble:latest .
```

![](../../public/images/feishu/assets/2025-11-10-Docker-011.png)

镜像大小5GB(压缩后的大小详见DockerHub)

![](../../public/images/feishu/assets/2025-11-10-Docker-012.png)

将 Docker 镜像推送到 Docker Hub 的步骤如下：

1.  创建 Docker Hub 账户
    

如果你还没有 Docker Hub 账户，请前往 Docker Hub 注册一个免费账户。

2.  登录 Docker Hub
    

在终端中使用以下命令登录到你的 Docker Hub 账户：

```bash
docker login
```

输入你的 Docker Hub 用户名和密码进行验证。

1.  为你的镜像打标签
    

Docker Hub 使用 `<用户名>/<镜像名>:<标签>` 的格式来标识镜像。你需要为你的镜像打上标签，以便能够推送到 Docker Hub。使用以下命令：

```bash
docker tag ros-jazzy-noble:latest <你的用户名>/ros-jazzy-noble:latest
```

例如，如果你的 Docker Hub 用户名是 `tungchiahui`，你应该执行：

```bash
docker tag ros-noetic-focal:latest tungchiahui/ros-noetic-focal:latest

docker tag ros-humble-jammy:latest tungchiahui/ros-humble-jammy:latest

docker tag ros-jazzy-noble:latest tungchiahui/ros-jazzy-noble:latest

docker tag ros-humble-opencv411-cuda128-cudnn970-jammy:latest /ros-humble-opencv411-cuda128-cudnn970-jammy:latest

docker tag ros-jazzy-opencv411-cuda128-cudnn970-noble:latest tungchiahui/ros-jazzy-opencv411-cuda128-cudnn970-noble:latest
```

2.  推送镜像到 Docker Hub
    

使用以下命令将镜像推送到 Docker Hub：

```bash
docker push <你的用户名>/ros-noetic-jazzy-noble:latest
```

例如：

```bash
docker push tungchiahui/ros-noetic-focal:latest

docker push tungchiahui/ros-humble-jammy:latest

docker push tungchiahui/ros-jazzy-noble:latest

docker push tungchiahui/ros-humble-opencv411-cuda128-cudnn970-jammy:latest

docker push tungchiahui/ros-jazzy-opencv411-cuda128-cudnn970-noble:latest

docker push tungchiahui/ros-noetic-focal-arm64:latest
```

3.  验证推送成功
    

你可以通过访问 Docker Hub 的个人页面来验证你的镜像是否已成功推送

**注意事项**

*   确保你的镜像大小在 Docker Hub 的限制范围内（一般为 10GB）
    
*   如果你打算将镜像公开，可以设置为公共仓库；如果希望只有你自己可以访问，可以设置为私有仓库
    

![](../../public/images/feishu/assets/2025-11-10-Docker-013.png)

![](../../public/images/feishu/assets/2025-11-10-Docker-014.png)

#### 6.2.2.手动创建(跨平台多架构构建)

如果您想在 **x86/x64 电脑上即为本机x86设备构建镜像，又想为树莓派、Jetson等ARM64 设备构建 Docker 镜像** ，需要使用 **Docker 的跨平台构建功能** 。以下是完整解决方案：

1\. **启用 Docker 跨平台构建**

在 x86 主机上模拟 ARM64 环境需要以下工具：

第一步：启用 buildx（只需执行一次）

```bash
docker buildx create --name multiarch_builder --use
```

这会创建并启用一个支持多架构构建的 builder，电脑重启后也依然存在，所以只用运行一次。

第二步：安装 QEMU 支持（一般新版 Docker Desktop 已自带，但是Linux必须要安装） 如果你用的是服务器或Linux发行版，确保有 qemu 模拟器：

```bash
docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
```

电脑重启后，就会消失，所以需要你每次电脑重启后，在buildx命令前，运行一次该命令即可。

第三步：构建多架构镜像 用下面的命令构建 amd64 和 arm64：

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t <你的镜像名>:<标签> --push .

# 例子：
docker buildx build \
--platform linux/amd64,linux/arm64 \
 -t tungchiahui/ros:noetic-focal \
 --push \
 .

docker buildx build \
--platform linux/amd64,linux/arm64 \
 -t tungchiahui/ros:humble-jammy \
 --push \
 .

docker buildx build \
--platform linux/amd64,linux/arm64 \
 -t tungchiahui/ros:jazzy-noble \
 --push \
 .

 docker buildx build \
--platform linux/amd64,linux/arm64 \
 -t tungchiahui/opencv:411-cuda128-cudnn970-focal \
 --push \
 .

docker buildx build \
--platform linux/amd64,linux/arm64 \
 -t tungchiahui/opencv:411-cuda128-cudnn971-jammy \
 --push \
 .

 docker buildx build \
--platform linux/amd64,linux/arm64 \
 -t tungchiahui/opencv:411-cuda128-cudnn971-noble \
 --push \
 .

docker buildx build \
--platform linux/amd64,linux/arm64 \
 -t tungchiahui/ros-opencv:noetic-411-cuda128-cudnn970-focal \
 --push \
 .

docker buildx build \
--platform linux/amd64,linux/arm64 \
 -t cherish/ros-opencv:humble-411-cuda128-cudnn970-jammy \
 --push \
 .

 docker buildx build \
--platform linux/amd64,linux/arm64 \
 -t tungchiahui/ros-opencv:jazzy-411-cuda128-cudnn970-noble \
 --push \
 .

  docker buildx build \
--platform linux/amd64,linux/arm64 \
 -t sdutvincirobot/ros-opencv:humble-411-cuda128-cudnn970-jammy \
 --push \
 .
```

说明： –platform 指定多架构。 –push 是必须的，因为 buildx 的多平台构建默认是不能本地加载的（除非加 –load，但那只能支持单一架构）

![](../../public/images/feishu/assets/2025-11-10-Docker-015.png)

![](../../public/images/feishu/assets/2025-11-10-Docker-016.png)

#### 6.2.3.清除构建缓存

```bash
# 清理BuildKit构建缓存
docker builder prune -f  
```

![](../../public/images/feishu/assets/2025-11-10-Docker-017.png)

### 6.3.补充

#### 6.3.1.使用Dockfile构建Docker镜像

Dockerfile是一个文本文件，其中包含了若干条指令，指令描述了构建镜像的细节

先来编写一个最简单的Dockerfile，以前文下载的Nginx镜像为例，来编写一个Dockerfile修改该Nginx镜像的首页

1、新建一个空文件夹docker-demo，在里面再新建文件夹app，在app目录下新建一个名为Dockerfile的文件，在里面增加如下内容（vim Dockerfile）：

```bash
FROM nginx
RUN echo '<h1>This is Tuling Nginx!!!</h1>' > /usr/share/nginx/html/index.html
```

该Dockerfile非常简单，其中的 FROM、 RUN都是 Dockerfile的指令。 FROM指令用于指定基础镜像， RUN指令用于执行命令

2、在Dockerfile所在路径执行以下命令构建镜像：

```bash
docker build -t nginx:tuling .
```

其中，-t指定镜像名字，命令最后的点（.）表示Dockerfile文件所在路径

3、执行以下命令，即可使用该镜像启动一个 Docker容器

```bash
docker run -d -p 92:80 nginx:tuling
```

4、访问 http://Docker宿主机IP:92/，可看到下图所示界面

![](../../public/images/feishu/assets/2025-11-10-Docker-018.png)

![](../../public/images/feishu/assets/2025-11-10-Docker-019.png)

#### 6.3.2.使用Dockerfile构建微服务镜像

只需要知道大体流程即可

以项目tulingmall-member为例，将该微服务的可运行jar包构建成docker镜像

1、将jar包上传linux服务器/root/tulingmall/tulingmall-member目录，在jar包所在目录创建名为Dockerfile的文件

2、在Dockerfile中添加以下内容

```markdown
# 基于哪个镜像
From java:8
# 复制文件到容器
ADD tulingmall-member-0.0.5.jar /tulingmall-member-0.0.5.jar
# 声明需要暴露的端口
EXPOSE 8877
# 配置容器启动后执行的命令
ENTRYPOINT java ${JAVA_OPTS} -jar /tulingmall-member-0.0.5.jar
```

3、使用docker build命令构建镜像

```bash
docker build -t tulingmall-member:0.0.5 .
```

格式： docker build -t 镜像名称:标签 Dockerfile的相对位置

![](../../public/images/feishu/assets/2025-11-10-Docker-020.png)

4、启动镜像，加-d可在后台启动

```bash
docker run -d -p 8877:8877 tulingmall-member:0.0.5
```

加上JVM参数：

```bash
# --cap-add=SYS_PTRACE 这个参数是让docker能支持在容器里能执行jdk自带类似jinfo，jmap这些命令，如果不需要在容器里执行这些命令可以不加
docker run  -d -p 8877:8877 \
-e SPRING_CLOUD_NACOS_CONFIG_SERVER_ADDR=192.168.65.174:8848  \
-e JAVA_OPTS='-Xmx1g -Xms1g -XX:MaxMetaspaceSize=512m'  \
--cap-add=SYS_PTRACE  \
tulingmall-member:0.0.5
```

5、访问会员服务接口

![](../../public/images/feishu/assets/2025-11-10-Docker-021.png)

#### 6.3.3.将微服务镜像发布到阿里云

我们制作好了微服务镜像，一般需要发布到镜像仓库供别人使用，我们可以选择自建镜像仓库，也可以直接使用官方镜像仓库，这里我们选择

阿里云docker镜像仓库：[https://cr.console.aliyun.com/cn-hangzhou/instance/repositories](https://cr.console.aliyun.com/cn-hangzhou/instance/repositories)

首先，我们需要注册一个阿里云账号，创建容器镜像服务

然后，在linux服务器上用docker login命令登录镜像仓库

![](../../public/images/feishu/assets/2025-11-10-Docker-022.png)

要把镜像推送到镜像仓库

```bash
docker tag tulingmall-member:0.0.5 registry.cn-hangzhou.aliyuncs.com/fox666/tulingmall-member:0.0.5
```

最后将镜像推送到远程仓库

```bash
docker push registry.cn-hangzhou.aliyuncs.com/fox666/tulingmall-member:0.0.5
```
