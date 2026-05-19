---
title: 7. 其他操作
description: 
---

# 7. 其他操作
    

## 7.1 工控机如何连wifi
    

当我们工控机从一个环境移动到另一个环境，且新的环境的wifi我们没有连接过，我们没有屏幕如何让工控机连上网呢？

进入工控机的硬盘目录，进入`/etc/netplan/`，底下有很多yaml,找到一个最符合下方格式的yaml:

```YAML
network: 
  version: 2 
  wifis: 
    NM-6f414fe0-2658-48ff-89ee-c7981b87bc96: 
      renderer: NetworkManager 
      match: 
        name: "wlan0" 
      dhcp4: true 
      dhcp6: true 
      access-points: 
        "EMIS_Vinci_Robocon_5G": 
          auth: 
            key-management: "psk" 
            password: "vinci666" 
          networkmanager: 
            uuid: "6f414fe0-2658-48ff-89ee-c7981b87bc96" 
            name: "EMIS_Vinci_Robocon_5G" 
            passthrough: 
              wifi-security.auth-alg: "open" 
              ipv6.addr-gen-mode: "default" 
              ipv6.ip6-privacy: "-1" 
              proxy._: "" 
      networkmanager: 
        uuid: "6f414fe0-2658-48ff-89ee-c7981b87bc96" 
        name: "EMIS_Vinci_Robocon_5G"
 
```

将其改为新wifi的名和密码：

```YAML
network:
  version: 2
  wifis:
    wlan0:
      dhcp4: true
      dhcp6: true
      access-points:
        "EMIS_Vinci_Robocon_5G":
          password: "vinci666"

```

工控机开机即可连上网。

  

## 7.2 SSH远程开发
    

### 7.2.1 环境准备
    

**1.硬件准备**

首先要有一台工控机（X68小型电脑，专业工控机，树莓派等等）。

控制系统的硬件载体是具有多样性的，常用的多是基于ARM、x86等架构的处理器，比如：PC、工控机、树莓派、NVIDIA Jetson...。不同的处理器都存在一定的优缺点，PC和工控机，处理器性能强大，但是功耗高、体积大、灵活性差，嵌入式系统则反之。对于我们而言，可以根据机器人平台的电气、载重、空间以及用途等诸多要素自主选择合适的控制系统。

无论选用何种处理器，只要是要进行机器人的开发，安装了ROS或者ROS2，那么对于开发人员而言，在使用上，没有任何本质的区别，或者换言之，作为软件工程师，部分场景下无需关注于硬件的选型。

**2.设置固定IP**

远程连接时，不管使用何种工具，需要根据IP地址定位到被连接的主机，再通过账号和密码登录该主机，因此，我们需要先获取该IP地址。并且每次连接时，都需要使用到IP，为了保证连接的便利性和稳定性，最好将被连接主机的IP地址设置为固定IP，具体操作如下。

1.进入设置界面

启动被连接的主机（启动时需要连接显示器或使用HDMI采集卡，并且配置完SSH远程访问之后，可以不再使用显示器或HDMI采集卡），并进入设置界面。

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-089.png)

2.配置所连接的网络

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-090.png)

3.设置固定IP

查看当前IP地址。

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-091.png)

设置固定IP。

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-092.png)

至此，IP配置完毕。

  

### 7.2.2 环境搭建
    

**概念**

SSH（Secure Shell）是一种通用的、功能强大的、基于软件的网络安全解决方案。计算机每次向网络发送数据时，SSH都会自动对其进行加密。数据到达目的地时，SSH自动对加密数据进行解密。整个过程都是透明的，使用OpenSSH工具将会增进你的系统安全性。SSH安装容易、使用简单。

**实现**

SSH实现架构上分为客户端和服务器端两大部分，客户端是数据的发送方，服务端是数据的接收方，当前场景下，我们需要从本地主机发送数据到远程主机，那么本地主机需要安装并启动SSH客户端，而远程主机则需要安装并启动SSH服务端，整个实现具体流程如下：

1.  本地主机安装SSH客户端，远程主机安装SSH服务端；
    
2.  远程主机启动SSH服务；
    
3.  本地主机登陆远程主机；
    
4.  实现数据传输。
    

1.安装SSH客户端与服务端

默认情况下，Ubuntu系统已经安装了SSH客户端，因此只需要在远程主机安装SSH服务端即可，安装命令如下：

```Plain Text
 sudo apt install openssh-server
```

如果SSH客户端需要自行安装，那么调用如下命令:

```Plain Text
sudo apt install openssh-client
```

2.远程主机启动SSH服务

远程主机启动 ssh 服务命令如下：

```Plain Text
sudo /etc/init.d/ssh start
```

启动后可使用如下命令查看服务是否正常运行：

```Plain Text
ps -e | grep ssh
```

如果启动成功，会包含 sshd 程序。

以后需要频繁的使用ssh远程登录，为了简化实现，可以将远程主机的ssh服务设置为开机自启动，命令如下：

```Plain Text
sudo systemctl enable ssh
```

3.本地远程登录

登录远程主机可以调用如下命令:

```Bash
ssh -X 用户名@ip地址
```

然后根据提示，录入登陆密码，即可成功登录。

如果退出，可以调用exit命令：

```Plain Text
exit
```

**4.实现数据传输**

通过SSH在本地主机只需调用相关指令，便可方便的实现与远程主机的数据上传或下载，指令格式如下所示：

上传文件指令格式如下：

```Plain Text
scp 本地文件路径 账号@ip:路径
```

上传文件夹指令格式如下：

```Plain Text
scp -r 本地文件夹路径 账号@ip:路径
```

下载文件指令格式如下：

```Plain Text
scp 账号@ip:路径 本地文件夹路径
```

下载文件夹指令格式如下：

```Plain Text
scp -r 账号@ip:路径 本地文件夹路径
```

**优化**

每次远程登录时，都需要输入密码，使用不方便，可以借助密钥简化登录过程，实现免密登录，提高操作效率。实现思想是：生成一对公钥私钥，私钥存储在本地，公钥上传至服务器，每次登录时，本地直接上传私钥到服务器，服务器有匹配的公钥就认为是合法用户，直接创建SSH连接即可。具体实现步骤只有两步：

1.  本地生成密钥对；
    
2.  将公钥上传至远程主机。
    

**1.生成密钥对**

本地客户端生成公私钥：（一路回车默认即可）

```Plain Text
ssh-keygen
```

上面这个命令会在用户目录.ssh文件夹下创建公私钥：

1.  id\_rsa （私钥）；
    
2.  id\_rsa.pub (公钥)。
    

**2.公钥上传**

上传指令如下：

```Plain Text
ssh-copy-id -i ~/.ssh/id_rsa.pub 账号@ip
```

上面这条指令是将本地公钥上传到远程主机的ssh目录下，该目录下有文件authorized\_keys保存了公钥内容。

以后再远程登录就无需录入密码了。

### 7.2.3 使用VScode优化
    

上一节，我们介绍了ssh远程连接的使用，但是如果只是纯粹使用ssh也存在一些不足，比如：编辑文件内容时，需要使用vi编辑器，且在一个终端内，无法同时编辑多个文件。本节将介绍一更为实用的功能——VSCode结合插件实现远程开发，这使我们可以以图形化的方式实现远程开发，比ssh的使用更方便快捷，可以大大的提高程序开发效率。

**1.准备工作**

VScode远程开发依赖于ssh，请首先按照上一节内容配置ssh远程连接。

**2.为VScode安装远程开发插件**

启动VScode，首先点击侧边栏的扩展按钮，然后在`扩展：商店`的搜索栏输入`Remote Development`并点击同名插件，最后在右侧显示区中点击`安装`。

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-093.png)

  

**3.配置远程连接**

步骤1：使用快捷键`ctrl + shift + p`打开命令输入窗口，并输入`Remote-SSH:Connect to Host...`，弹出列表中选择与之同名的选项。

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-094.png)

步骤2：步骤1完成将弹出一个新的命令窗口如下，选择下拉列表中的 `Add New SSH Host`。

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-095.png)

步骤3：步骤2完成又将弹出一个新的命令窗口，在其中输入：`ssh +X ubuntu@192.168.43.164`，其中，`ubuntu`需要替换为你的登录用户名，`192.18.43.164` 则替换为被远程连接主机的ip地址。

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-096.png)

步骤4：选择步骤3完成后的弹窗列表中的第一个选项(或直接回车)，即可完成配置，配置成功后会有提示信息。

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-097.png)

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-098.png)

**4.使用**

步骤1：继续使用快捷键`ctrl + shift + p`打开命令输入窗口，并输入`Remote-SSH:Connect to Host...`，此时列表中将显示步骤3中配置的ip地址，直接选择，选择后，VScode将打开一个新的窗口。

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-099.png)

或者，也可以点击侧边栏的`远程资源管理器`，在弹出的服务器列表中选择要连接的服务器，并右击，选择在本窗口或新窗口中实现远程连接。

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-100.png)

步骤2：选择菜单栏的`文件`下的`打开文件夹`，在弹窗列表中选择需要打开的文件夹并点击确定即可。

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-101.png)

最终，我们就可以像操作本地文件一样实现远程开发了。

  

## 7.3 远程桌面
    

因为用X11转发效率太低太低，所以还是要选用远程访问桌面的形式来看Rviz2和Gazebo等等（如果有需求的话）

我们选择使用VNC来看。

1.  安装VNC服务器：
    

这里以TigerVNC为例进行安装：

```Bash
sudo apt install tigervnc-standalone-server tigervnc-common
```

2.  设置VNC密码：
    

为VNC用户设置密码，运行以下命令：

```Bash
vncpasswd
```

3.  配置VNC启动脚本:
    

创建VNC配置文件，在用户家目录内的.vnc文件夹中创建启动文件：

```Bash
mkdir -p ~/.vnc
nano ~/.vnc/xstartup
```

在打开的编辑器里面输入以下内容（以GNOME为例）：

```Bash
#!/bin/sh
unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS
gnome-session
```

保存并退出（在nano中按Ctrl + O保存，然后按Ctrl + X退出）。

  

4.  给予执行权限：
    

为xstartup文件设置执行权限：

```Bash
chmod +x ~/.vnc/xstartup
```

5.  启动VNC服务器：
    

```Bash
vncserver -geometry 1920x1080 -localhost=0
```

geometry 选项指定窗口大小，localhost 选项设为 0 以开放连接。(设为1是只允许本地连接)

你将看到类似于:1的输出，这表示VNC会话的显示编号。例如，如果输出为:1，则VNC监听的端口为5901（5900 + 显示编号）。

6.  查看已开启的VNC服务器：
    

```Bash
vncserver -list
```

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-102.png)

7.  连接到VNC服务器：
    

使用VNC客户端（如vncviewer）连接到VNC服务器，输入你的服务器IP和端口。例如，如果服务器IP为192.168.31.10，且显示编号为1，你应该连接到192.168.31.10:1，或者直接输入192.168.31.10:5901。

8.  停止VNC服务器：
    

如果需要停止VNC服务器，可以使用以下命令：

```Bash
vncserver -kill :1
```

将:1替换为你实际使用的显示编号。

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-103.png)

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-104.png)

  

  

  

## 7.4 USB端口设置
    

**首先先配置好权限**

```Bash
# 将用户权限提高
sudo usermod -aG dialout $USER
newgrp dialout
# 查看下面命令是否输出dialout（若输出才正常）
groups
```

因为我们插拔USB设备，他的端口号可能会一直变，所以我们要给他的tty起一个固定的别名。

### 7.4.1 根据USB设备绑定端口(多个不同设备)
    

**需求：** Ubuntu系统中现接入雷达和智能小车，请为二者绑定端口。

**实现原理：** 可以通过USB设备本身的“标识”实现端口绑定。

**流程如下：**

（1）.查找设备idVendor和idProduct

接入两个USB设备，在终端调用指令`lsusb`查看显示系统中以及连接到系统的USB设备信息。

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-105.png)

如上图所示，红色方框内数据为USB设备，ID后面的`1a86:7523`分别为USB的idVendor和idProduct（两个参数之间使用”：“分隔）。

另外：可以通过重新插拔比较的方式确定哪些数据对应接入的USB设备。

（2）.编写映射规则

在`/etc/udev/rules.d`目录下新建文件xxx.rules（文件名自定义）

```Bash
sudo vim /etc/udev/rules.d/xxx.rules
```

输入如下内容：

```Bash
KERNEL=="ttyUSB*", ATTRS{idVendor}=="10c4", ATTRS{idProduct}=="ea60", MODE:="0777", SYMLINK+="mylidar"
KERNEL=="ttyUSB*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE:="0777", SYMLINK+="mycar"
```

代码解释：

*   KERNEL是内核固定名称，这里统一是“ttyUSB\*”；
    
*   MODE是节点权限，通常改为“0777”，表示可读写可运行；
    
*   SYMLINK是符号连接，即绑定的别名；
    
*   ATTRS是设备厂商的唯一标识，idVendor和idProduct正好组成上面通过lsusb查找到的设备ID。
    

***小提示：****一般的USB设备供应商都会提供类似的脚本文件，对于调用者而言，直接复制该文件到*`/etc/udev/rule.d`*目录即可。*

表格 还在加载中，请等待加载完成后再尝试复制

（3）.使规则生效

在终端下输入如下指令：

```Bash
# Ubuntu用下方命令
sudo service udev reload
sudo service udev restart

#Fedora用下方命令
sudo udevadm control --reload
sudo udevadm trigger
```

再重新插拔设备即可。

（4）.测试

终端下输入如下指令

```Bash
ll /dev | grep ttyUSB
```

运行结果如下：

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-106.png)

也可以多次插拔USB设备，会发现设备端口`ttyUSBn`中的n编号会变动，但是别名是始终可以指向对应的USB设备的。至此，就可以使用别名来关联所需使用的USB设备了。

**缺点：**

上述实现也存在一定的局限性，当Ubuntu接入两台或多台相同型号的USB设备时，由于设备ID是一样的，该种实现方式只会对其中的一台设备生效，这种情况下，就需要通过第二种策略来实现端口的绑定了。

  

  

### 7.4.2 根据主机硬件绑定端口（多个相同设备)
    

**需求：** 无人车中现接入一前一后两台相同型号的雷达，请为二者绑定端口。

**实现原理：** USB设备所连接主机的USB接口也是有其“标识”的，可以通过这个标识实现端口绑定。

**流程如下：**

（1）.查看所连接的主机USB接口的KERNELS

调用如下指令查看第一台雷达的USB信息：

```Bash
udevadm info --attribute-walk --name=/dev/ttyUSB0 | grep KERNELS
udevadm info --attribute-walk --name=/dev/ttyACM0 | grep KERNELS
```

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-107.png)

调用如下指令查看第二台雷达的USB信息：

```Bash
udevadm info --attribute-walk --name=/dev/ttyUSB1 | grep KERNELS
```

运行结果相比较不同的KERNELS，第一台雷达端口地址为`KERNELS==1-1.3:1.0`，第二个雷达端口地址为`KERNELS==1-1.4:1.0`。可以使用此数据作为不同端口的“**唯一性标识**”。

（2）.编写映射规则

在`/etc/udev/rules.d`目录下新建文件xxx.rules（文件名自定义），输入如下内容：

```Bash
sudo vim /etc/udev/rules.d/xxx.rules
```
```Bash
KERNEL=="ttyUSB*", KERNELS=="1-1.3:1.0", MODE:="0777", SYMLINK+="rplidar_front"
KERNEL=="ttyUSB*", KERNELS=="1-1.4:1.0", MODE:="0777", SYMLINK+="rplidar_back"
```

（3）.使规则生效

在终端下输入如下指令：

```Bash
# Ubuntu用下方命令
sudo service udev reload
sudo service udev restart

#Fedora用下方命令
sudo udevadm control --reload
sudo udevadm trigger
```

再重新插拔设备即可。

（4）.测试

终端下输入如下指令`ll /dev | grep ttyUSB`，运行结果如下：

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-108.png)

至此，就可以使用别名来关联所需使用的USB设备了。

**缺点：** USB设备必须连接在主机的指定端口上，否则，会导致端口绑定失败，或产生逻辑错误。(而且增加新设备可能会导致端口改变)

  

### 7.4.3 根据其他属性绑定端口
    

（1）.查看所连接的主机USB接口的信息

```Bash
udevadm info -a -p $(udevadm info -q path -n /dev/ttyACM0)
udevadm info -a -p $(udevadm info -q path -n /dev/ttyUSB0)
```

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-109.png)

这些数据都是不会变的，所以可以拿这些数据来做标识

  

（2）.编写映射规则

在`/etc/udev/rules.d`目录下新建文件xxx.rules（文件名自定义），输入如下内容：

```Bash
sudo vim /etc/udev/rules.d/xxx.rules
```
```Bash
KERNEL=="ttyACM*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="55d4", ATTRS{serial}=="0001", MODE:="0777", SYMLINK+="ttyACM_MCU"
KERNEL=="ttyACM*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="55d4", ATTRS{serial}=="0002", MODE:="0777", SYMLINK+="ttyACM_Lidar"
KERNEL=="ttyUSB*", ATTRS{idVendor}=="1a86", ATTRS{idProduct}=="7523", MODE:="0777", SYMLINK+="ttyUSB_IMU"
```

（3）.使规则生效

在终端下输入如下指令：

```Bash
# Ubuntu用下方命令
sudo service udev reload
sudo service udev restart

#Fedora用下方命令
sudo udevadm control --reload
sudo udevadm trigger
```

再重新插拔设备即可，或者 **直接重启系统。**

（4）.测试

终端下输入如下指令`ll /dev | grep ttyUSB`，运行结果如下：

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-110.png)

至此，就可以使用别名来关联所需使用的USB设备了。

**缺点：** 一些设备可能没有串口号等。

  

  

### 7.4.4 其他注意事项
    

并非所有的USB设备端口号都是`ttyUSBn`的格式，比如Arduino的端口号可能是`ttyACMn`，而对于USB摄像头而言，一台设备则对应两个端口号，分别是`videon`和`video(n+1)`，并且启用摄像头设备一般使用的是`videon`端口，绑定时需要关联的也是该接口。

但是无论是外接何种USB设备，也不管采用上述两种方案的哪一种进行端口绑定，其原理都是类似的，只是实现细节不同而已。如果是外接的Arduino设备，那么需要在rules文件中的将`KERNEL=="ttyUSB*"`修改为`KERNEL=="ttyACM*"`，如果外接的是USB摄像头，那么则需要在rules文件中的将`KERNEL=="ttyUSB*"`修改为类似于`KERNEL=="video[0,2,4,6]"`的格式，其中`video[0,2,4,6]`表示可以绑定的端口为`video0`或`video2`或`video4`或`video6`。

  

  

  

## 7.5 挂载内网网页
    

可以把本地的网页挂载到路由器端，或者同内网段其他设备上，甚至可以挂载在本地。

下面以安卓设备为例子，由于安卓设备暂时不能直接打开html,所以我们可以把html挂载到本地服务器，再通过浏览器查看。

由于安卓系统基于Linux内核，所以我们可以下载一个叫termux的app来敲一些Linux命令：

Termux 下载地址（F-Droid）：https://f-droid.org/packages/com.termux/

首先打开app后，先更新软件缓存：

```Bash
pkg update
```

然后换源

```Bash
nano $PREFIX/etc/apt/sources.list
```

将该文件内容替换为下面：

```Bash
deb https://mirrors.bfsu.edu.cn/termux/termux-packages-24 stable main
```

*   如果你使用的是`nano`编辑器：
    
    *   按 `Ctrl+O` 保存文件。
        
    *   按 `Enter` 确认文件名。
        
    *   按 `Ctrl+X` 退出编辑器。
        
*   如果你使用的是`vim`编辑器：
    
    *   按 `Esc` 退出编辑模式。
        
    *   输入 `:wq` 保存并退出。
        

接下来重新更新软件源：

```Bash
pkg update && pkg upgrade
```

安装python：

```Bash
pkg install python
```

**通过Termux访问设备存储** ：

如果文件在安卓设备上，可以使用Termux的文件管理器访问设备的存储：

```Bash
termux-setup-storage
```

1.  **进入HTML文件所在的目录** ：
    
    1.  使用`cd`命令进入HTML文件所在的目录：
        

```Bash
cd ~/your_html_folder
```

2.  **启动Python HTTP服务器** ：
    
    1.  运行以下命令启动一个简单的HTTP服务器：
        
    ```Bash
    python -m http.server 8000
    ```
    3.  这会在端口`8000`上启动一个Web服务器。
        

*   启动服务器后，Termux会显示日志信息，例如：
    

```Plain Text
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

*   这表示服务器已成功启动。
    

**在浏览器中访问HTML文件**

1.  **在同一设备上访问** ：
    
    1.  打开安卓设备上的浏览器（如Chrome），输入以下地址：
        
    ```JSON
    http://localhost:8000
    ```
    

*   如果HTML文件中有`index.html`，它会自动加载；否则，你需要手动点击文件链接。
    

## 7.6 Linux重点知识

### 7.6.1 关于点的说明

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-111.png)

一点本目录，两点上目录

### 7.6.2 目录

#### 7.6.2.1 系统启动必须

**/boot:**

存放启动linux时使用的一些核心文件，包括一些连接文件和镜像文件

**/etc:**

存放所有的系统需要的配置文件和子目录列表，更改目录下的文件可能会导致系统不能启动

**/lib：**

存放基本代码库（比如c++库），其作用类似于Windows里的DLL文件。几乎所有的应用程序都需要用到这些共享库

**/sys:**

这是linux2.6内核的一个很大的变化。该目录下安装了2.6内核中新出现的一个文件系统 sysfs 。sysfs文件系统集成了下面3种文件系统的信息：针对进程信息的proc文件系统、针对设备的devfs文件系统以及针对伪终端的devpts文件系统。该文件系统是内核设备树的一个直观反映。当一个内核对象被创建的时候，对应的文件和目录也在内核对象子系统中

#### 7.6.2.2 指令集合

**/bin:**

为二进制文件的缩写，存放最经常使用的命令

**/sbin:**

只有系统管理员才能使用的程序和指令

#### 7.6.2.3 外部文件管理

**/dev:**

Device（设备）的缩写，存放linux的外部设备，在linux中访问设备和访问文件的方式是相同的

**/media:**

类windows的其他设备，例如U盘、光驱等等，识别后linux会把设备放到这个目录下

**/mnt:**

临时挂载别的文件系统，我们可以将光驱挂载在/mnt/上，然后进入该目录就可以查看光驱里的内容

#### 7.6.2.4 临时文件

**/run:**

是一个临时文件系统，存储系统启动以来的信息。当系统重启时，这个目录下的文件应该被删掉或清除。如果你的系统上有 /var/run 目录，应该让它指向 run

**/lost+found:**

一般情况下为空的，系统非法关机后，这里就存放一些文件

**/tmp:**

这个目录是用来存放一些临时文件的

#### 7.6.2.5 账户

**/root：**

系统管理员的用户主目录

**/home** ：

用户的主目录，以用户的账号命名的

**/usr** ：

用户的很多应用程序和文件都放在这个目录下，类似于windows下的program files目录

**/usr/bin：**

系统用户使用的应用程序与指令

**/usr/sbin：**

超级用户使用的比较高级的管理程序和系统守护程序

**/usr/src：**

内核源代码默认的放置目录

#### 7.6.2.6 运行过程要用

**/var：**

存放经常修改的数据，比如程序运行的日志文件（/var/log 目录下）

**/proc:**

  

管理 **内存空间！** 虚拟的目录，是系统内存的映射，我们可以直接访问这个目录来，获取系统信息。这个目录的内容不在硬盘上而是在内存里，我们也可以直接修改里面的某些文件来做修改

#### 7.6.2.7 扩展用的

**/opt:**

默认是空的，我们安装额外软件可以放在这个里面

**/srv:**

存放服务启动后需要提取的数据（不用服务器就是空）

### 7.6.3 终端利用ssh登陆远程服务器

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-112.png)

windows-->linux:

远程传输文件:scp- r 本地文件目录 服务器的用户名@服务器IP:/tmp

必须传入到服务器的/tmp这个路径下，因为只有这个路径有写入权限，可以上传之后移动到你的文件到你需要的指定目录

linux传输文件到windows

scp- r 服务器的用户名@服务器IP:/tmp 本地的文件目录

  

### 7.6.4 易忘知识

操作系统内核查看

```Bash
uname -r
```

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-113.png)

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-114.png)

```Bash
mv mvtest mvtest2 
mv不仅仅有移动文件与目录的功能，还可以实现修改名称的功能
```

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-115.png)

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-116.png)

当前目录中共有3个文件，每个占用4KB，目录本身因元数据占用4KB，总计16KB。通过 `du -a` 可以快速查看磁盘使用细节。

### 7.6.5 Vim

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-117.png)

（vim是一个linux使用非常广泛的编辑器，不是编译器）vscode就是编辑器，vim编辑器几乎支持所有编程语言，所以非常好用！

一开始进去为命令模式，此时点击输入的字母为命令

**1.命令模式：**

i 切换到输入模式，在光标当前位置开始输入文本

x 删除当前光标所在处的字符

：切换到底线命令模式，以在最底一行输入命令

a 进行插入模式，在光标下一个位置输入文本

o 在当前的下方插入一个新行，并进入插入模式

0 在当前行的上方插入一个新行，并进入插入模式

dd 剪切当前行

yy 复制当前行

p 粘贴剪贴板内容到光标下方

P 粘贴剪贴板内容到光标上方

u 撤销上一次操作

ctrl+r 重做上一次操作

:w 保存文件

:q 退出Vim编辑器

:q! 强制退出Vim编辑器，不保存修改

**2.输入模式：**

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-118.png)

**3.底线命令模式：**

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-119.png)

按下esc可以退出底线命令模式

### 7.6.6 apt

为Linux的Debian和Ubuntu中的shell前端软件包管理器

### 7.6.7 home与root的区别

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-120.png)

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-121.png)

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-122.png)

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-123.png)

### 7.6.8 linux系统如何安装软件：.5 补充

https://me.tungchiahui.cn/linux-tutorial/#%E5%BD%BB%E5%BA%95%E5%88%A0%E9%99%A4linux

1.  下载安装包+指令的形式进行安装 以fedora系统为例子： sudo dnf install 安装包
    
2.  下载程序压缩包并进行解压，配置图标启动文件，以安装pycharm为例进行说明：： 1️⃣解压压缩包：可以手动解压；也可以通过终端进行解压tar (tar -help看有啥选项)
    

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-124.png)

解压后的文件放到自己存放的位置 2️⃣查找启动文件，判断程序压缩包是正常的，在解压文件下的bin目录进行查看，在终端输入pycharm.sh或者pycharm来判断是否启动

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-125.png)

```Plain Text
cd /home/cherish/UserFloder/Applications/pycharm-2025.2.4/bin
./pycharm.sh
```

3️⃣创建.desktop文件

**原理：**

*   Linux 桌面环境（GNOME、KDE、XFCE 等）通过 **`.desktop` 文件** 来识别应用。
    
*   `.desktop` 文件相当于一个“应用注册表”，告诉系统：
    
    *   应用名字（Name）
        
    *   图标（Icon）
        
    *   执行命令（Exec）
        
    *   分类（Categories）
        
    *   是否需要终端（Terminal）
        

```Plain Text
cd ~/.local/share/applications
nano pycharm.desktop
```

nano是一个命令行下的编辑器，也可以使用vim

```Plain Text
[Desktop Entry]
Version=1.0
Type=Application
Name=PyCharm
Icon=/home/cherish/UserFloder/Applications/pycharm-2025.2.4/bin/pycharm.svg
Exec="/home/cherish/UserFloder/Applications/pycharm-2025.2.4/bin/pycharm.sh" %f
Comment=JetBrains PyCharm IDE
Categories=Development;IDE;
Terminal=false
StartupWMClass=jetbrains-pycharm
```

*   `Exec` → 点击图标时执行的命令
    
*   `Icon` → 显示在菜单和桌面上的图标
    
*   `Terminal=false` → 不打开终端
    
*   `StartupWMClass` → GNOME 用它区分窗口实例，如果桌面环境是kde的话可以不用设置
    

> 可以理解成 `.desktop` 文件是 Linux 的 **快捷方式配置文件**

4️⃣设置可执行权限

```Plain Text
chmod +x ~/.local/share/applications/pycharm.desktop
```

5️⃣桌面图标启动的话如下：

```Plain Text
cp ~/.local/share/applications/pycharm.desktop ~/Desktop/
chmod +x ~/Desktop/pycharm.desktop
```

3.  下载Appimage文件实现软件的安装
    

1️⃣先下载appimage

https://y.qq.com/download/download.html

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-126.png)

2️⃣下载图标，可以去google下载qq音乐图标，.svg透明的图标

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-127.png)

当然.png格式的也没问题，或者都可以在linux系统上更换使用图标

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-128.png)

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-129.png)

3️⃣给他们放在`/home/用户名`的某个文件夹中（可以自己定）

4️⃣给软件执行权限

```Plain Text
cd ~/UserFloder/Applications/qqmusic
sudo chmod +x ./qqmusic-1.1.7.AppImag
```

5️⃣配置图标启动文件并添加执行权限（也可以继续使用nano）

```Bash
cd ~/.local/share/applications/
touch ./qqmusic.desktop
vim ./qqmusic.desktop
sudo chmod +x ./qqmusic.desktop
```

`touch`：一个 Linux 命令，主要功能是：

*   如果文件不存在，就创建一个新的空文件
    
*   如果文件已存在，就更新该文件的最后修改时间
    

```Plain Text
[Desktop Entry]
Name=QQ音乐
Exec=/home/tungchiahui/UserFloder/Applications/qqmusic/qqmusic-1.1.7.AppImage
Icon=/home/tungchiahui/UserFloder/Applications/qqmusic/QQ_Music2023.svg
Type=Application
Categories=Audio;Music;Player;
Comment=QQ Music Client for Linux
```

将文件复制进去

6️⃣此时找到软件就可以打开了，如果找不到，请重启，部分不先进的发行版刷新图标列表不会很快

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-130.png)

6️⃣如果点击图标打不开就禁用沙盒-->如果QQ音乐闪退，这个只是QQ音乐自己软件的问题，按下图这样做

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-131.png)

如果你用的不是KDE，那么也可以直接修改`qqmuic.desktop`：在exec的末尾加上`--no-sandbox`（通过禁用安全沙盒机制，赋予应用程序更高的系统权限，从而解决因权限限制导致的运行问题）

```Plain Text
[Desktop Entry]
Name=QQ音乐
Exec=/home/tungchiahui/UserFloder/Applications/qqmusic/qqmusic-1.1.7.AppImage --no-sandbox
Icon=/home/tungchiahui/UserFloder/Applications/qqmusic/QQ_Music2023.svg
Type=Application
Categories=Audio;Music;Player;
Comment=QQ Music Client for Linux
```

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-132.png)

在qq音乐中如果缺字体,那么请安装字体(这个字体是多种语言合一的字体)

```Plain Text
sudo dnf install google-noto-sans-cjk-fonts google-noto-serif-cjk-fonts
```

4.  去Flathub上安装软件
    

https://flathub.org/

1️⃣去上面的官网搜索软件+下载软件

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-133.png)

```Plain Text
flatpak install flathub com.obsproject.Studio
```

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-134.png)

2️⃣运行软件

a.官方方式：

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-135.png)

```Plain Text
flatpak install flathub com.obsproject.Studio
```

b.当普通软件运行：

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-136.png)

![](../../public../../public/images/feishu/assets/2025-01-27-Linux基本操作-137.png)
