---
title: 14. HTML5与CSS3新特性
description: 
---

# 14. HTML5与CSS3新特性

## 14.1 HTML5的新特性

### 14.1.1 基本标签

HTML5 的新增特性主要是针对于以前的不足，增加了一些新的标签、新的表单和新的表单属性等

这些新特性都有兼容性问题，基本是 **IE9+ 以上版本的浏览器** 才支持，如果不考虑兼容性问题，可以大量使用这些新特性

以前布局，我们基本用 div 来做。div 对于搜索引擎来说，是没有语义的

现在使用的是新特性：

*   `<header>` 头部标签
    
*   `<nav>` 导航标签
    
*   `<article>` 内容标签
    
*   `<section>` 定义文档某个区域
    
*   `<aside>` 侧边栏标签
    
*   `<footer>` 尾部标签
    

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-115.png">

注意点：

*   这种语义化标准主要是针对搜索引擎的
    
*   这些标签页面中可以经常使用
    
*   在IE9中，需要把这些元素转换为块级元素
    
*   移动端更喜欢使用这些标签
    

### 14.1.2 多媒体标签

音频 **audio** 和视频 **video** 两个标签

#### 14.1.2.1 视频标签- video

1.  支持格式：
    

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-116.png">

尽量使用MP4，兼容性好

用MP4就可以

```Html
<video src="movie.mp4" controls autoplay muted loop></video>
```

2.  兼容写法
    

由于各个浏览器的支持情况不同，所以我们会有一种兼容性的写法，这种写法了解一下即可

```Html
<video src="movie.mp4" controls autoplay muted loop></video>
```

面这种写法，浏览器会匹配video标签中的source，如果支持就播放，如果不支持往下匹配，直到没有匹配的格式，就提示文本

3.  video常用属性
    

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-117.png">

poster属性后面是跟的等待加载图片的地址

```Html
<img src="images/pic.jpg" alt="描述文字" title="悬停提示">
```

谷歌浏览器为了避免移动端自动播放视频导致消耗较大的流量问题，对自动播放进行了禁用，解决方式：

```Css
/* 2D 位移 */
div {
  transform: translate(100px, 50px);
  /* transform: translateX(100px);  仅水平 */
  /* transform: translateY(50px);   仅垂直 */
}
```

muted:自动静音属性

#### 14.1.2.2 音频标签audio

1.  基本使用
    

当前 **`<audio>`** 元素支持三种视频格式： 尽量使用 **mp3格式**

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-118.png">

2.  兼容写法
    

```Html
<video src="movie.mp4" controls autoplay muted loop></video>
```

上面这种写法，浏览器会匹配audio标签中的source，如果支持就播放，如果不支持往下匹配，直到没有匹配的格式，就提示文本

3.  常用属性
    

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-119.png">

```Html
<video src="movie.mp4" controls autoplay muted loop></video>
```

谷歌也把音频的自动播放功能给禁用了：只能通过js来解决

#### 14.1.2.3 总结

*   音频标签和视频标签使用方式基本一致
    
*   浏览器支持情况不同
    
*   谷歌浏览器把音频和视频自动播放禁止了
    
*   我们可以给视频标签添加 muted 属性来静音播放视频，音频不可以（可以通过JavaScript解决）
    
*   视频标签是重点，我们经常设置自动播放，不使用 controls 控件，循环和设置大小属性
    

### 14.1.3 表单元素

#### 14.1.3.1 HTML5新增input类型

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-120.png">

```Html
<input type="text" name="username" placeholder="请输入用户名">
```

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-121.png">

#### 14.1.3.2 HTML5新增表单属性

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-122.png">

使用autocomplete时需要给name值，可以理解为name就是用于连接服务器的

快捷操作：

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-123.png">

例子1：

```Html
<form action="/submit" method="post">
  <input type="text" name="username" placeholder="用户名">
  <input type="password" name="pwd" placeholder="密码">
  <button type="submit">提交</button>
</form>
```

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-124.png">

value是表单域的内容

例子2：

```Html
<form action="/submit" method="post">
  <input type="text" name="username" placeholder="用户名">
  <input type="password" name="pwd" placeholder="密码">
  <button type="submit">提交</button>
</form>
```

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-125.png">

  

  

  

## 14.2 CSS新特性

### 14.2.1 新增选择器

#### 14.2.1.1 属性选择器

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-126.png">

```Css
input[type="text"] {
  border: 1px solid #999;
}
```

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-127.png">

注意点：

*   属性选择器，按照字面意思，都是根据标签中的属性来选择元素
    
*   属性选择器可以根据元素特定属性的来选择元素。 这样就可以不用借助于类或者id选择器
    
*   属性选择器也可以选择出来自定义的属性
    
*   **注意：** 类选择器、属性选择器、伪类选择器，权重为 10
    

#### 14.2.1.2 结构伪类选择器

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-128.png">

1.  fist-child
    

```Css
/* 属性选择器 */
input[type="text"] { }
input[class^="icon"] { }  /* 以 icon 开头 */
input[class$="icon"] { }  /* 以 icon 结尾 */
input[class*="icon"] { }  /* 包含 icon */
```

ul的第一个儿子文本为红色

一定要在冒号前加空格，不然就是选中所有的了

```Css
.center {
  color: red;
}
```Css
/* 结构伪类选择器 */
li:first-child { }           /* 第一个 */
li:last-child { }            /* 最后一个 */
li:nth-child(2) { }          /* 第2个 */
li:nth-child(2n) { }         /* 偶数 */
li:nth-child(2n+1) { }       /* 奇数 */
li:nth-child(-n+3) { }       /* 前3个 */
```
<!-- HTML 代码示例 -->
<div class="example">
  示例内容
</div>
```

此时有1会执行操作，确定为第一个孩子:光头强，但是它是p标签，然后接着与前边进行匹配，前面是div与p是不匹配的，所以此时是不输出任何结果的，不会使第一个孩子的背景变为蓝色

*   `E:nth-of-type(n)` 匹配同类型中的第n个同级兄弟元素E，也就是说，对父元素里面指定子元素进行排序选择。 先去匹配E ，然后再根据E 找第n个孩子
    

也就是说它选择的是熊大

6.  权重
    

```Css
/* 结构伪类选择器 */
li:first-child { }           /* 第一个 */
li:last-child { }            /* 最后一个 */
li:nth-child(2) { }          /* 第2个 */
li:nth-child(2n) { }         /* 偶数 */
li:nth-child(2n+1) { }       /* 奇数 */
li:nth-child(-n+3) { }       /* 前3个 */
```

这个的权重为12，:nth-of-type(1)为结构伪类选择器，权重为10，div为标签选择器为1，section也为标签选择器权重也为1,也就是上述总权重为12

#### 14.2.1.3 伪元素选择器

伪元素选择器可以帮助我们利用CSS创建新标签元素，而不需要HTML标签，从而简化HTML结构

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-130.png">

1.  注意点：
    

*   before 和 after 创建一个元素，但是属于行内元素（也就是宽高不起作用，需要转换模式才会起作用）
    
*   新创建的这个元素在文档树中是找不到的（在网页F12中查看文档树），找不到这个盒子，所以我们称为伪元素
    
*   语法： element::before {}
    
*   before 和 after 必须有 content 属性
    
*   before 在父元素内容里面的前面创建元素，after 在父元素内容里面的后面插入元素，内容是放到中间的，不会影响本身的内容
    
*   伪元素选择器和标签选择器一样，权重为 1
    

2.  实例
    

```Css
/* 结构伪类选择器 */
li:first-child { }           /* 第一个 */
li:last-child { }            /* 最后一个 */
li:nth-child(2) { }          /* 第2个 */
li:nth-child(2n) { }         /* 偶数 */
li:nth-child(2n+1) { }       /* 奇数 */
li:nth-child(-n+3) { }       /* 前3个 */
```

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-131.png">

3.  使用场景1
    

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-132.png">

不需要再加盒子来整红色那部分了

```Css
/* 伪元素选择器（必须有 content 属性） */
div::before {
  content: "";
  display: block;
}
div::after {
  content: "→";
  color: #999;
}
```

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-133.png">

如果使用字体图标时可以不复制后边的矩形框，复制前边的数字也是可以的

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-134.png">

但是在引用时需要先转义一下

content='\\e930'

4.  使用场景2
    

仿土豆效果

通过使用伪元素选择器可以减少body中盒子的数量

```Css
/* 伪元素选择器（必须有 content 属性） */
div::before {
  content: "";
  display: block;
}
div::after {
  content: "→";
  color: #999;
}
```

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-135.png">

5.  使用场景3
    

清除浮动：原因回顾，大盒子没有设置高度，里边的两个盒子都设置浮动之后，大盒子会塌陷

```Css
.box {
  float: left;
}
```Css
/* 伪元素选择器（必须有 content 属性） */
div::before {
  content: "";
  display: block;
}
div::after {
  content: "→";
  color: #999;
}
```
div {
  margin: 0 auto;
}
```

### 14.2.3 CSS3图片变模糊

filter CSS属性将模糊或颜色偏移等图形效果应用于元素

`filter: 函数();`，例如：`filter: blur(5px);`，`blur` 表示模糊处理，数值越大越模糊。

### 14.2.4 计算盒子宽度

calc() 此CSS函数让你在声明CSS属性值时执行一些计算

width: calc(100% - 80px);

括号里面可以使用 + - \* / 来进行计算

运算符前后要加空格，不然显示不出来

要求子盒子宽度永远比父盒子小30像素

### 14.2.5 CSS3 过渡

过渡（transition)是CSS3中具有颠覆性的特征之一，我们可以在不使用 Flash 动画或 JavaScript 的情况下，当元素从一种样式变换为另一种样式时为元素添加效果

**过渡动画：** 是从一个状态 渐渐的过渡到另外一个状态

可以让我们页面更好看，更动感十足，虽然 低版本浏览器不支持（ie9以下版本） 但是不会影响页面布局。

我们现在经常和 :hover 一起 搭配使用

语法：

transition: 要过渡的属性 花费时间 运动曲线 何时开始;

*   属性 ： 想要变化的 css 属性， 宽度高度 背景颜色 内外边距都可以 。如果想要所有的属性都变化过渡， 写一个all 就可以
    
*   花费时间： 单位是 秒（必须写单位） 比如 0.5s
    
*   运动曲线： 默认是 ease （可以省略）
    
*   何时开始：单位是 秒（必须写单位）可以设置延迟触发时间 默认是 0s （可以省略）
    
*   **后面两个属性可以省略**
    
*   **记住过渡的使用口诀： 谁做过渡给谁加**
    

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-140.png">

代码案例

```Css
div {
  transition: all 0.3s ease;
}
```

如果想让多个元素都发生变化

不能如下操作：

transition: width 2s ease 0.5s;

transition: height 2s ease 0.5s;不对！！！

上方会样式冲突，导致不显示任何过渡效果

  

使用如下：加逗号隔开

transition: width 2s ease 0.5s, height 2s ease 0.5s, background-color 2s ease;

transition all 2s ease;

### 14.2.6 过渡练习

1.  进度条
    

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-141.png">

```Css
div {
  transition: all 0.3s ease;
}
```

2.  小米logo
    

当将鼠标放到图标时，mi-logo会往右侧过渡；mi-home出现

```Css
/* CSS3 过渡 */
div {
  transition: all 0.3s ease;
  /* transition: 属性 时长 曲线 延迟； */
}
```

理解：在设计的时候可以多考虑使用伪元素选择器，动画的时候不要想着只通过一个hover就可以实现，可以让before和after都添加hover来进行运动
