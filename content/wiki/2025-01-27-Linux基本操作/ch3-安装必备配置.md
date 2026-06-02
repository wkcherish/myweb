---
title: 3. 安装必备配置
description: 
---

# 3. 安装必备配置
    
## 3.1 软件包换源（以Debian系的发行版为例）
        
    
      打开下方网站（注意，该Ubuntu仓库版本是X86、amd64的仓库，ARM的仓库并非该网站（99.9%的人的电脑是X86的，很多工控机是ARM的，但工控机也有X86的，请看[Vinci机器人队单片机教程](https://sdutvincirobot.feishu.cn/docx/PRAodvrWvoXTrVxP1EDcMKM7nXb)中讲的了解一下，或者自行百度。）
    
      下方这俩学校二选一。
    
    1.  清华大学开源软件镜像站：https://mirrors.tuna.tsinghua.edu.cn
    
    2.  中国科学技术大学镜像站：https://mirrors.ustc.edu.cn
    
      可以测速，选择出速度最快的源。
    
    ```Bash
    curl https://mirrors.cernet.edu.cn/oh-my-mirrorz.py | python3
    ```
    
      在北方（山东）测速如下：
    
    ![](/images/feishu/assets/2025-01-27-Linux基本操作-036.png)
    
      在南方（广东）测速如下：
    
    ![](/images/feishu/assets/2025-01-27-Linux基本操作-037.png)
    
      在南北都比较快的是`北京外国语大学BFSU`和`南方科技大学SUSTech`，不想测速可以无脑选，也可以测速选择最好的源。
    
      
    
### 3.1.1 Ubuntu22.04(及Debian10)及以下版本
        
    
      输入以下命令
    
    ```Bash
    sudo apt update
    sudo apt install vim
    sudo vim /etc/apt/sources.list
    ```
    
      在以下界面，用键盘按ggdG（注意区分大小写）
    
    ![](/images/feishu/assets/2025-01-27-Linux基本操作-038.png)
    
    ![](/images/feishu/assets/2025-01-27-Linux基本操作-039.png)
    
      选择好Ubuntu版本后，
    
    ![](/images/feishu/assets/2025-01-27-Linux基本操作-040.png)
    
      粘贴进去
    
    ![](/images/feishu/assets/2025-01-27-Linux基本操作-041.png)
    
      按一下ESC，然后英文冒号，输入 `:wq!`然后回车
    
    ![](/images/feishu/assets/2025-01-27-Linux基本操作-042.png)
    
      输入以下命令
    
    ```Bash
    sudo apt update
    ```
    
      下方出现对应学校源网站则成功
    
    ![](/images/feishu/assets/2025-01-27-Linux基本操作-043.png)
    
      至此换源结束
    
### 3.1.2 Ubuntu24.04(及Debian12)及以上版本
        
    
    ```Shell
    sudo apt update
    sudo apt install vim
    sudo rm -rf /etc/apt/sources.list
    sudo rm -rf /etc/apt/sources.list.d/**
    
    sudo vim /etc/apt/sources.list.d/ubuntu.sources
    ```
    

选择好Ubuntu版本后，复制下方的内容。

![](/images/feishu/assets/2025-01-27-Linux基本操作-044.png)

粘贴进去

![](/images/feishu/assets/2025-01-27-Linux基本操作-045.png)

按一下ESC，然后英文冒号，输入 `:wq!`然后回车

![](/images/feishu/assets/2025-01-27-Linux基本操作-046.png)

输入以下命令

```Bash
sudo apt update
```

这里被替换成对应学校则成功

![](/images/feishu/assets/2025-01-27-Linux基本操作-047.png)

  

  

## 3.2 卸载恶心的snap(Ubuntu及其衍生版)
    

### 3.2.1 安装非firefox浏览器
    

卸载snap前，请先安装一个浏览器（以Google Chrome为例）(这里是因为Ubuntu默认安装的是snap版本的FireFox)

以下是Google上海服务器的Chrome官网（无需挂梯）

https://www.google.com/chrome/

![](/images/feishu/assets/2025-01-27-Linux基本操作-048.png)

咱们这里是Ubuntu所以是Debian系的系统，所以选deb扩展名的程序包。（也就是红色框框）

红帽系则需要安装的是rpm扩展名程序包。（也就是蓝色框框）

![](/images/feishu/assets/2025-01-27-Linux基本操作-049.png)

```Bash
#某些发行版中，可能Downloads是中文下载，所以就需要  cd ~/下载
cd ~/Downloads
#下方chrome安装包名不一定是这个，根据名字来看
sudo apt install ./google-chrome-stable_current_amd64.deb
```

![](/images/feishu/assets/2025-01-27-Linux基本操作-050.png)

### 3.2.2 查看snap包应用数量
    

```Bash
# 老版
sudo apt update
sudo apt install neofetch
neofetch

# 新版
sudo add-apt-repository ppa:zhangsongcui3371/fastfetch
sudo apt update
sudo apt install fastfetch
fastfetch
```

这里显示，一共有3162个debian的程序，7个snap程序

![](/images/feishu/assets/2025-01-27-Linux基本操作-051.png)

### 3.2.3 移除snap应用
    

系统在启动时，会自动启动Snap相关服务，我们先禁用掉这些服务

```Bash
sudo systemctl disable snapd.service
sudo systemctl disable snapd.socket
sudo systemctl disable snapd.seeded.service
```

然后查看snap应用列表

根据你安装的选择不同（最小安装或普通安装），有[不同的](https://so.csdn.net/so/search?q=%E4%B8%8D%E5%90%8C%E7%9A%84&spm=1001.2101.3001.7020)Snap软件会被预装到系统，在删除Snap服务之前，我们需要移除Snap安装的这些

```Bash
# 查询当前系统上snap安装了哪些app
snap list
```

![](/images/feishu/assets/2025-01-27-Linux基本操作-052.png)

卸载掉图中所有应用，按照 **先删除应用软件，再删除非应用软件** 的顺序进行删除

```Bash
#移除snap-store，如果是Kubuntu，则没有这个东西，测不需要卸载
sudo snap remove snap-store
#移除firefox浏览器
sudo snap remove firefox
#移除gnome-42-2204
sudo snap remove gnome-42-2204
#移除gtk-common-themes
sudo snap remove gtk-common-themes
#移除其它...
 
#移除core22,bare以及snapd
sudo snap remove core22
sudo snap remove bare
sudo snap remove snapd
```

![](/images/feishu/assets/2025-01-27-Linux基本操作-053.png)

输入以下命令查看是否还有snap包

```Bash
snap list
# 老版
neofetch
# 新版
fastfetch
```

  

![](/images/feishu/assets/2025-01-27-Linux基本操作-054.png)

### 3.2.4 移除snap
    

在删除掉[Snap安装](https://so.csdn.net/so/search?q=Snap%E5%AE%89%E8%A3%85&spm=1001.2101.3001.7020)的软件后，下一步就是把Snap本身也删除掉，这里需要使用Apt来实现

```Bash
 #使用apt移除掉snap
sudo apt autoremove --purge snapd
#移除snapd的一些目录
sudo rm -rf /var/cache/snapd
sudo rm -rf ~/snap
```

至此，其实snap已经被删除掉了。但是这个并不足够，如果你使用apt安装一些软件 `sudo apt install firefox`时，会自动下载并重新安装snap服务。因为Ubuntu源中的一些软件已经是snap版本，而非deb版本，下载snap版本时，会自动检查并在必要时重新安装snap服务。这也是Canonical为了推广自己的Snap Store而做的一些额外的努力吧。(这一点最被很多人不喜欢)

  

### 3.2.5 禁止系统自动安装snap
    

我们可以利用APT可配置禁用安装哪些依赖的特性，来实现禁止重新自动安装Snap服务

```Bash
sudo vim /etc/apt/preferences.d/nosnap.pref
```

按insert进入编辑模式，然后复制以下内容，最后按ESC，切换为英文输入法模式，然后敲 `:wq` 回车

```Bash
Package: snapd
Pin: release a=*
Pin-Priority: -10
```

![](/images/feishu/assets/2025-01-27-Linux基本操作-055.png)

### 3.2.6 测试是否成功
    

```Bash
sudo apt update
sudo apt install firefox
```

这里提示snapd无法被安装，就证明成功了

![](/images/feishu/assets/2025-01-27-Linux基本操作-056.png)

### 3.2.7 重新安装FireFox浏览器（没大有必要）
    

我个人其实更偏好Google Chrome浏览器，浏览器是从Chrome官网下载deb进行安装的。所以我有浏览器了，就没必要安装火狐浏览器了，

但如果你确实喜欢Firefox，在删除掉Snap后，其实没法再通过Snap或Apt来安装Firefox了，而Firefox官网提供的下载，又没有deb包，没有桌面快捷方式，不是非常方便。

所以，你可以考虑使用Mozilla提供的源来安装debian版本的Firefox

```Bash
# 添加Mozilla提供的源
sudo add-apt-repository ppa:mozillateam/ppa
# 安装Firefox
sudo apt update
sudo apt install firefox
```

  

### 3.2.8 跨Ubuntu大版本更新
    

跨Ubuntu大版本更新，是指从Ubuntu22.04LTS更新到Ubuntu24.04LTS这种大版本更新。

跨Ubuntu大版本更新时，建议恢复snap，等更新完毕后再删掉snap，以防止Canonical公司从中作妖。

```Bash
#删掉禁止安装snap的配置文件
sudo rm -rf /etc/apt/preferences.d/nosnap.pref
sudo apt update

sudo apt dist-update
```

  

## 3.3 中文输入法
    

### 3.3.1 搜狗(Ubuntu22.04及以下)
    

官网下载搜狗输入法

![](/images/feishu/assets/2025-01-27-Linux基本操作-057.png)

![](/images/feishu/assets/2025-01-27-Linux基本操作-058.png)

打开终端输入如下

```Bash
cd ~/Downloads/
sudo apt install ./sogoupinyin_4.2.1.145_amd64.deb
```

打开Fcitx

![](/images/feishu/assets/2025-01-27-Linux基本操作-059.png)![](/images/feishu/assets/2025-01-27-Linux基本操作-060.png)

![](/images/feishu/assets/2025-01-27-Linux基本操作-061.png)

添加搜狗输入法

![](/images/feishu/assets/2025-01-27-Linux基本操作-062.png)

![](/images/feishu/assets/2025-01-27-Linux基本操作-063.png)

将搜狗输入法设置为唯一输入法

![](/images/feishu/assets/2025-01-27-Linux基本操作-064.png)

### 3.3.2 Fcitx5(Ubuntu22.04及以上、Debian12及以上)
    

1.  卸载旧输入法
    

```Shell
sudo apt purge fcitx* ibus*
```

2.  安装Fcitx5
    

```Bash
# Ubuntu22.04及以上、Debian12及以上
sudo apt install fcitx5 fcitx5-chinese-addons

# Ubuntu20.04
sudo add-apt-repository ppa:zhsj/fcitx5
sudo apt update
sudo apt install fcitx5 fcitx5-chinese-addons
```

3.  Reboot System
    
4.  启动Fcitx5
    

![](/images/feishu/assets/2025-01-27-Linux基本操作-065.png)

5.  修改一些设置
    

将Pinyin和Keyboard - English US加入到左边。

![](/images/feishu/assets/2025-01-27-Linux基本操作-066.png)

添加快捷键以便于更好切换中英文

![](/images/feishu/assets/2025-01-27-Linux基本操作-067.png)

6.  重启
    

```Shell
sudo shutdown -r now
```

  

7.  使用Fcitx5工具箱优化Fcitx5(进入Github自己看说明书安装)
    

https://github.com/fcitx/fcitx5

  

8.  再重启
    

```Shell
sudo shutdown -r now
```

  

## 3.4 pip3源替换
    

非Debian系发行版需要做。

像Ubuntu、Debian这类使用apt工具的发行版不需要此操作。

使用dnf的系统也可能不用做。

```Bash
# 检查是否已安装 pip
pip3 --version
# 如果未安装，先安装 pip3（见下方）
# 配置 pip 使用清华源
pip3 config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

按图中顺序敲，但是不出意外的话，会报错，因为大部分发行版不自带pip，所以请接着往下看。

![](/images/feishu/assets/2025-01-27-Linux基本操作-068.png)

```Bash
#安装pip3
sudo apt update
sudo apt-get install python3-pip

#更新pip3
python3 -m pip install -i https://pypi.tuna.tsinghua.edu.cn/simple --upgrade pip

#设置pip源为清华源
pip3 config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

#测试
python3 -m pip install --upgrade pip
```

成功的话，会看到Looking后面是tsinghua字样。

![](/images/feishu/assets/2025-01-27-Linux基本操作-069.png)

  

## 3.5 显卡驱动安装
    

### 3.5.1 卸载显卡驱动(卸载干净)
    

```Shell
# 如果是使用apt安装的驱动
sudo apt-get remove --purge nvidia*
# 如果使用了.run文件进行安装的，再使用下面命令卸载干净
sudo /usr/bin/nvidia-uninstall
```

### 3.5.2 安装显卡驱动
    

#### 3.5.2.1 APT安装英伟达驱动（方式一）
    

##### 3.5.2.1.1 Ubuntu
    

```Shell
# 安装英伟达驱动
sudo apt install nvidia-driver-版本号
# 重启 
sudo shutdown -r now
# 检查驱动是否安装成功
nvidia-smi
```

  

##### 3.5.2.1.2 Debian
    

```Shell
# 安装英伟达驱动
sudo apt install nvidia-driver nvidia-settings
# 重启 
sudo shutdown -r now
# 检查驱动是否安装成功
nvidia-smi
```

  

#### 3.5.2.2 官网下载驱动（方式二）
    

使用这种方式安装，需要先禁用掉nouveau，请先往下翻，找到**常见问题**那节内容里的禁用nouveau，将nouveau禁用。

  

用以下命令停止可视化桌面环境（用ctrl alt f\*也可以）***（也可以不禁用桌面环境，直接进行下一步。）***

```Shell
# 通用的命令（sudo telinit 5是打开图形界面）
sudo telinit 3
# ubuntu 使用下方命令
sudo service lightdm stop
# Fedora 使用下方命令
sudo systemctl isolate multi-user.target
```

之后会进入一个新的命令行会话，使用当前的用户名密码登录。(不用使用root用户)

```Shell
# 编译环境+准备工作
sudo apt install build-essential
# 进入到.run目录中
cd /home/tungchiahui/Downloads/
# 给驱动文件增加可执行权限：
sudo chmod a+x NVIDIA-Linux-x86_64-550.107.02.run
# 然后执行安装：
sudo ./NVIDIA-Linux-x86_64-550.107.02.run
# 如果有异常则：(一般不用下方这条，会导致OPENGL没法被安装，这样ROS有些功能无法使用)
sudo ./NVIDIA-Linux-x86_64-550.107.02.run  --no-opengl-files
```

安装完毕重启即可

```Shell
# 重启 
sudo reboot
# 检查驱动是否安装成功
nvidia-smi
```

### 3.5.3 安装CUDA
    

（此教程以Debian 12 Bookworm和RTX3060Laptop为例）(Ubuntu也类似)

![](/images/feishu/assets/2025-01-27-Linux基本操作-070.png)

1.  先查看显卡驱动所支持的最高CUDA版本
    

```Shell
nvidia-smi
```

左边是英伟达驱动版本，右边是所支持CUDA的最高版本，注意是最高版本，比这个版本低的CUDA都是可以安装的。(不用追求最高，稳定即可，虽然都很稳定)

![](/images/feishu/assets/2025-01-27-Linux基本操作-071.png)

2.  下载CUDA并安装CUDA
    

前往 NVIDIA CUDA Toolkit 下载页面：https://developer.nvidia.com/cuda-downloads

选择一个版本，这里以CUDA12.4为例（绿色框住的都是我这台电脑对应可安装的版本，而红色框则不能）

![](/images/feishu/assets/2025-01-27-Linux基本操作-072.png)

我这里是Intel CPU(X86\_64架构或者叫amd64架构)，所以选择X86\_64。（AMD和Intel全是X86的，如果分不清，请看[Vinci机器人队单片机教程](https://sdutvincirobot.feishu.cn/wiki/PqsGwcPCuidbN6k13jfcGWtWn0b)）

我是Debian12，所以选择了Debian12 ,(你是Ubuntu要选择Ubuntu)如下图所示，建议选择runfile文件进行安装。

![](/images/feishu/assets/2025-01-27-Linux基本操作-073.png)

将最下方框框里的命令敲入终端

```Shell
# 在当前文件夹下创建一个ttt的子文件夹
mkdir -p ./ttt
# 进入ttt文件夹
cd ttt
# 输入复制的第一条命令（用来下载cuda的runfile文件）
wget https://developer.download.nvidia.com/compute/cuda/12.4.0/local_installers/cuda_12.4.0_550.54.14_linux.run
# 给予权限
sudo chmod a+x ./cuda_12.4.0_550.54.14_linux.run
# 运行脚本
sudo ./cuda_12.4.0_550.54.14_linux.run
```

![](/images/feishu/assets/2025-01-27-Linux基本操作-074.png)

正在安装中：

![](/images/feishu/assets/2025-01-27-Linux基本操作-075.png)

输入accept接受即可

![](/images/feishu/assets/2025-01-27-Linux基本操作-076.png)

因为我们已经安装了驱动，所以删掉该项，Install即可。

![](/images/feishu/assets/2025-01-27-Linux基本操作-077.png)

等待片刻后，一般不出红色字体就是安装成功了，可以读读英语确认一下。(顺便确定一下位置)

![](/images/feishu/assets/2025-01-27-Linux基本操作-078.png)

3.  配置环境
    

根据上方确认一下路径，比如我上面红色框起来的为

```Shell
Please make sure that 
 -   PATH includes /usr/local/cuda-12.4/bin 
 -   LD_LIBRARY_PATH includes /usr/local/cuda-12.4/lib64, or, add /usr/local/cuda-12.4/lib64 to /etc/ld.so.conf and run ldconfig as root
```

如果刚才忘记查看了，也可以使用下方命令查看路径：

```Shell
which nvcc
```

![](/images/feishu/assets/2025-01-27-Linux基本操作-079.png)

所以我进行以下操作：

```Shell
sudo vim ~/.bashrc
```

复制下面这一串到~/.bashrc文件中，并保存，不会用vim编辑器的请自行百度。

```Shell
export PATH=/usr/local/cuda-12.4/bin:$PATH
export LD_LIBRARY_PATH=/usr/local/cuda-12.4/lib64:$LD_LIBRARY_PATH
```

![](/images/feishu/assets/2025-01-27-Linux基本操作-080.png)

```Shell
# 刷新当前终端的环境变量
source ~/.bashrc
# 验证CUDA是否安装成功
nvcc -V
```

出现下图这种则安装成功。

![](/images/feishu/assets/2025-01-27-Linux基本操作-081.png)

  

  

  

### 3.5.4 安装cuDNN
    

1.  据安装好的CUDA版本选择合适的cuDNN版本进行下载，注意这里是需要注册登录的：
    

前往 NVIDIA cuDNN 下载页面：https://developer.nvidia.com/cudnn（需要注册 NVIDIA 开发者账号并登录）

因为我是CUDA12.4，所以下方红圈版本都是可以安装的，越新越好。

![](/images/feishu/assets/2025-01-27-Linux基本操作-082.png)

红色是X86架构的所有Linux通用的，所以我选择红色的。

![](/images/feishu/assets/2025-01-27-Linux基本操作-083.png)

绿色的是X86架构的Ubuntu，是Ubuntu且CPU为X86架构的可以选择下载。

蓝色的是arm64(aarch64)架构的Ubuntu，是Ubuntu且CPU为arm64(aarch64)架构的可以选择下载。

**我这里选择所有Linux X86\_64最通用的办法：**

下载好的：

![](/images/feishu/assets/2025-01-27-Linux基本操作-084.png)

2.  安装cuDNN
    

找到该文件所在目录，并打开终端，cd到该目录。

![](/images/feishu/assets/2025-01-27-Linux基本操作-085.png)

解压文件，并复制到对应位置完成安装

```Shell
# 解压cuDNN文件
tar -xvf ./cudnn-linux-x86_64-8.9.7.29_cuda12-archive.tar.xz
# cd进文件夹
cd ./cudnn-linux-x86_64-8.9.7.29_cuda12-archive
# 复制cuDNN文件到CUDA目录
sudo cp include/cudnn*    /usr/local/cuda/include 
sudo cp lib/libcudnn*    /usr/local/cuda/lib64
# 对比一下有没有缺文件
ls /usr/local/cuda/include/cudnn* 
ls /usr/local/cuda/lib64/libcudnn*
# 给予权限
sudo chmod a+r /usr/local/cuda/include/cudnn*   
sudo chmod a+r /usr/local/cuda/lib64/libcudnn*
```

3.  检查是否安装成功
    

```Shell
# 检查cuDNN版本命令
cat /usr/local/cuda/include/cudnn_version.h | grep CUDNN_MAJOR -A 2
```

出现下图这样的就是安装成功了

![](/images/feishu/assets/2025-01-27-Linux基本操作-086.png)

  

4.  软链接(一般不需要)
    

```Shell
# 运行 ldconfig 以更新库缓存：（如果运行 ldconfig 后没有出现任何错误，说明配置已经完成。）
sudo ldconfig
```

如果出现下列提示，则需要软链接**(如果没有下列提示，则什么都不需要做)**

```Plain Text
ldconfig: /usr/local/cuda-12.4/targets/x86_64-linux/lib/libcudnn_cnn_train.so.8 is not a symbolic link  
ldconfig: /usr/local/cuda-12.4/targets/x86_64-linux/lib/libcudnn_ops_train.so.8 is not a symbolic link  
ldconfig: /usr/local/cuda-12.4/targets/x86_64-linux/lib/libcudnn_ops_infer.so.8 is not a symbolic link  
ldconfig: /usr/local/cuda-12.4/targets/x86_64-linux/lib/libcudnn_adv_infer.so.8 is not a symbolic link  
ldconfig: /usr/local/cuda-12.4/targets/x86_64-linux/lib/libcudnn_cnn_infer.so.8 is not a symbolic link  
ldconfig: /usr/local/cuda-12.4/targets/x86_64-linux/lib/libcudnn.so.8 is not a symbolic link  
ldconfig: /usr/local/cuda-12.4/targets/x86_64-linux/lib/libcudnn_adv_train.so.8 is not a symbolic link
```

运行下方的命令

```Shell
# cd进入CUDA路径
cd /usr/local/cuda-12.4/targets/x86_64-linux/lib
 # 查看本路径下的需要软链接的文件名
 ls
```

![](/images/feishu/assets/2025-01-27-Linux基本操作-087.png)

如上图，我需要将`libcudnn_xxx_xxxxx.so.8.9.7`和`libcudnn_xxx_xxxxx.so.8`和`libcudnn_xxx_xxxxx.so`软链接

```Shell
# 创建符号链接。对于每个 .so.8 文件，需要创建一个指向该文件的符号链接，通常链接的名称是不包含 .8 的文件名。
sudo ln -sf libcudnn_cnn_train.so.8.9.7 libcudnn_cnn_train.so.8
sudo ln -sf libcudnn_adv_infer.so.8.9.7 libcudnn_adv_infer.so.8
sudo ln -sf libcudnn_adv_train.so.8.9.7 libcudnn_adv_train.so.8
sudo ln -sf libcudnn_cnn_infer.so.8.9.7 libcudnn_cnn_infer.so.8
sudo ln -sf libcudnn.so.8.9.7 libcudnn.so.8
sudo ln -sf libcudnn_ops_infer.so.8.9.7 libcudnn_ops_infer.so.8
sudo ln -sf libcudnn_ops_train.so.8.9.7 libcudnn_ops_train.so.8
# 运行 ldconfig 以更新库缓存：（如果运行 ldconfig 后没有出现任何提示，说明配置已经完成。）
sudo ldconfig
# 使用 ls -l 来确认符号链接是否创建成功：(再次确认链接）
ls -l /usr/local/cuda-12.4/targets/x86_64-linux/lib/libcudnn_*.so*
```

  

  

  

### 3.5.5 常见问题
    

1.  禁用开源驱动nouveau，nouveau经常会引起卡顿黑屏，所以要禁用
    

```Shell
sudo vim /etc/modprobe.d/blacklist-nouveau.conf
```

blacklist-nouveau.conf文件内容如下：

```Shell
blacklist nouveau
blacklist lbm-nouveau
options nouveau modeset=0
alias nouveau off
alias lbm-nouveau off
```

接着运行下方命令

```Shell
sudo update-initramfs -u
或者
sudo dracut --force
```

重启后，查询nouveau是否还开着，如果什么都不出现，说明禁用成功。

```Shell
lsmod | grep nouveau
```

  

2.  无法调节屏幕亮度，无法使用HDMI插口(这是因为xorg文件没配置)
    

```Shell
sudo vim /usr/share/X11/xorg.conf.d/10-nvidia.conf
```

并把10-nvidia.conf里的内容修改为下方内容并保存，然后重启即可。

```Shell
Section "OutputClass"
   Identifier "nvidia"
   MatchDriver "nvidia-drm"
   Driver "nvidia"
   Option "AllowEmptyInitialConfiguration"
   Option "PrimaryGPU" "yes"
   ModulePath "/usr/lib/x86_64-linux-gnu/nvidia/xorg"
EndSection
```

  

3.  安装N卡驱动提示错误
    

```Plain Text
Unable to find the kernel source tree for the currently running kernel.  Please make sure you have installed the kernel source files for your kernel and that they are properly configured; on Red Hat Linux systems, for example, be sure you have the 'kernel-source' or 'kernel-devel' RPM installed.If you know the correct kernel source files are installed, you may specify the kernel source path with the '--kernel-source-path' command line option.
```

1.  检查当前运行的内核版本：
    

运行以下命令以查看你当前正在使用的内核版本：

```Bash
uname -r
```

2.  安装内核开发文件：
    

确保你已经安装了与当前内核版本相匹配的 `kernel-devel` 包。运行以下命令来安装：

```Bash
sudo dnf install kernel-devel-$(uname -r)
```

这将自动安装与你当前内核版本匹配的内核开发包。

3.  安装内核源代码（如果需要）：
    

如果需要访问完整的内核源代码，你可以运行以下命令来安装它：

```Bash
sudo dnf install kernel-headers kernel-source
```

4.  检查安装：
    

安装完成后，确认路径是否正确。内核源文件通常位于 `/usr/src/kernels/` 目录下，你可以使用以下命令来检查该目录是否存在：

```Bash
ls /usr/src/kernels/
```

如果仍然遇到问题，可以通过 `--kernel-source-path` 选项手动指定内核源文件路径。
