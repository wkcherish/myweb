---
title: 8. CSS显示模式与背景特性
description: 
---

# 8. CSS显示模式与背景特性

## 8.1 css元素显示模式

显示模式的作用是更好布局页面，元素显示模式就是元素（标签）以什么方式进行显示，比如`<div>`自己占一行，比如一行可以放多个`<span>`，HTML 元素一般分为块元素和行内元素两种类型

### 8.1.1 块元素

常见的块元素有`<h1>`~`<h6>`、`<p>`、`<div>`、`<ul>`、`<ol>`、`<li>`等，其中 `<div>` 标签是最典型的块元素

**块级元素的特点：**

① 比较霸道，自己独占一行。

② 高度，宽度、外边距以及内边距都可以控制。

③ 宽度默认是容器（父级宽度）的100%。

④ 是一个容器及盒子，里面可以放行内或者块级元素。

**注意点：**

①文字类的元素内不能使用块级元素

②`<p>` 标签主要用于存放文字，因此 `<p>` 里面不能放块级元素，特别是不能放`<div>`

⑥同理， `<h1>`~`<h6>`等都是文字类块级标签，里面也不能放其他块级元素

### 8.1.2 行内元素

常见的行内元素有 `<a>`、`<strong>`、`<b>`、`<em>`、`<i>`、`<del>`、`<s>`、`<ins>`、`<u>`、`<span>` 等，其中 `<span>` 标签是最典型的行内元素。有的地方也将行内元素称为内联元素。

**特点：**

① 相邻行内元素在一行上，一行可以显示多个。

② 高、宽直接设置是无效的。

③ 默认宽度就是它本身内容的宽度。

④ 行内元素只能容纳文本或其他行内元素。

**注意点：**

① 链接里面不能再放链接，也就是a里面不能再放a

②特殊情况链接 `<a>` 里面可以放块级元素，但是给 `<a>` 转换一下块级模式最安全

### 8.1.3 行内块元素

在行内元素中有几个特殊的标签 —— `<img />`、`<input />`、`<td>`，它们同时具有块元素和行内元素的特点。有些资料称它们为行内块元素

**行内块元素的特点：**

① 和相邻行内元素（行内块）在一行上，但是他们之间会有空白缝隙。一行可以显示多个（行内元素特点）

② 默认宽度就是它本身内容的宽度（行内元素特点）

③ 高度，行高、外边距以及内边距都可以控制（块级元素特点）

### 8.1.4 总结

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-033.png">

### 8.1.5 元素显示模式的转换

①转换为块元素：display:block;

```Css
/* 将行内元素 a 转换为块级元素 */
a {
  display: block;
  width: 100px;
  height: 40px;
}
```

②转换为行内元素：display:inline;

```Css
/* 将块级元素 div 转换为行内元素 */
div {
  display: inline;
}
```

③转换为行内块：display:inline-block;

```Css
/* 将行内元素 span 转换为行内块元素 */
span {
  display: inline-block;
  width: 80px;
  height: 30px;
}
```

### 8.1.6 小米侧边栏

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-034.png">

  

```Html
<!-- 小米侧边栏案例 -->
<div class="sidebar">
  <a href="#">手机 电话卡</a>
  <a href="#">电视 盒子</a>
  <a href="#">笔记本 平板</a>
  <a href="#">出行 穿戴</a>
  <a href="#">智能 路由器</a>
  <a href="#">健康 儿童</a>
  <a href="#">耳机 音响</a>
</div>
```

```Css
.sidebar a {
  display: block;
  width: 234px;
  height: 42px;
  line-height: 42px;
  padding-left: 30px;
  color: #fff;
  background-color: #55585a;
}
.sidebar a:hover {
  background-color: #ff6700;
}
```

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-035.png">

行高=盒子高度：实现文字的垂直居中

原理讲解：

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-036.png">

## 8.2 css背景

背景属性可以设置背景颜色、背景图片、背景平铺、背景图片位置、背景图像固定等

### 8.2.1 背景颜色

background-color:颜色值;

一般情况下元素背景颜色默认值是 transparent（透明）

### 8.2.2 背景图片

用于logo 或者一些装饰性的小图片或者是超大的背景图片, 优点是非常便于控制位置. (精灵图也是一种运用场景)

```Css
div {
  background-image: url(images/bg.png);
}
```

| 参数值 | 作用 |
|:---|:---|
| none | 无背景图（默认的） |
| url | 使用绝对或相对地址指定背景图像 |

```Css
div {
  background-image: url(images/bg.png);
}
```

注意：背景图片后面的地址，不能忘记加url,也不能加引号

### 8.2.3 背景平铺

```Css
div {
  background-repeat: no-repeat;
}
```

| 参数值 | 作用 |
|:---|:---|
| repeat | 背景图像在纵向和横向上平铺（默认的） |
| no-repeat | 背景图像不平铺 |
| repeat-x | 背景图像在横向上平铺 |
| repeat-y | 背景图像在纵向平铺 |

### 8.2.4 背景图片位置

```Css
/* 方位名词 */
div {
  background-position: center top;
}
/* 精确单位 */
div {
  background-position: 20px 50px;
}
/* 混合单位 */
div {
  background-position: 20px center;
}
```

参数代表的意思是：x 坐标和 y 坐标。 可以使用 方位名词 或者 精确单位

| 参数值 | 说明 |
|:---|:---|
| length | 百分数\|由浮点数和单位标识符组成的长度值 |
| position | top\|center\|bottom\|left\|center\|right 方位名词 |

其他说明：

①参数是方位名词

如果指定的两个值都是方位名词，则两个值前后顺序无关，比如 left top 和 top left 效果一致

如果只指定了一个方位名词，另一个值省略，则第二个值默认居中对齐

②参数是精确单位

如果参数值是精确坐标，那么第一个肯定是 x 坐标，第二个一定是 y 坐标

如果只指定一个数值，那该数值一定是 x 坐标，另一个默认垂直居中

③参数是混合单位

如果指定的两个值是精确单位和方位名词混合使用，则第一个值是 x 坐标，第二个值是 y 坐标

### 8.2.5 背景图片固定

```Css
/* 背景滚动（默认） */
div {
  background-attachment: scroll;
}
/* 背景固定 */
div {
  background-attachment: fixed;
}
```

| 参数 | 作用 |
|:---|:---|
| scroll | 背景图像是随对象内容滚动 |
| fixed | 背景图像固定 |

### 8.2.6 背景样式合写

```Css
/* 背景复合写法：颜色 图片 平铺 滚动 位置 */
div {
  background: #fff url(images/bg.png) no-repeat fixed center top;
}
```

### 8.2.7 背景色半透明

```Css
div {
  background: rgba(0, 0, 0, 0.3);
}
```

解释：

①最后一个参数是 alpha 透明度，取值范围在 0~1之间

②我们习惯把 0.3 的 0 省略掉，写为 background: rgba(0, 0, 0, .3);

③背景半透明是指盒子背景半透明，盒子里面的内容不受影响

④CSS3 新增属性，是 IE9+ 版本浏览器才支持的，但是现在实际开发,我们不太关注兼容性写法了,可以放心使用

### 8.2.8 总结

| 属性 | 作用 | 值 |
|:---|:---|:---|
| background-color | 背景颜色 | 预定义的颜色值/十六进制/RGB代码 |
| background-image | 背景图片 | url(图片路径) |
| background-repeat | 是否平铺 | repeat/no-repeat/repeat-x/repeat-y |
| background-position | 背景位置 | length/position 分别是x和y坐标 |
| background-attachment | 背景附着 | scroll(背景滚动) /fixed (背景固定) |
| 背景简写 | 书写更简单 | 背景颜色 背景图片地址 背景平铺 背景滚动 背景位置； |
| 背景半透明 | 背景颜色半透明 | background: rgba(0,0,0.3); 后面必须是4个值 |

颜色渐变：

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-037.png">

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-038.png">

### 8.2.9 案例-五彩导航栏

```Html
<div class="nav">
  <a href="#">五彩导航1</a>
  <a href="#">五彩导航2</a>
  <a href="#">五彩导航3</a>
  <a href="#">五彩导航4</a>
  <a href="#">五彩导航5</a>
</div>
```

```Css
.nav a {
  display: inline-block;
  width: 120px;
  height: 58px;
  text-align: center;
  line-height: 58px;
  color: #fff;
}
.nav a:nth-child(1) { background-color: #ff6700; }
.nav a:nth-child(2) { background-color: #ff0000; }
.nav a:nth-child(3) { background-color: #00a4ff; }
.nav a:nth-child(4) { background-color: #ff00ff; }
.nav a:nth-child(5) { background-color: #00ff00; }
```

## 8.3 css三大特性

### 8.3.1 层叠性

为了解决样式冲突问题

原则：①样式冲突，遵循的原则是就近原则，哪个样式离结构近，就执行哪个样式

   ②样式不冲突，不会层叠

### 8.3.2 继承性

子标签会继承父标签的某些样式，如文本颜色和字号。恰当地使用继承可以简化代码，降低 CSS 样式的复杂性

子元素可以继承父元素的样式：text-, font-, line-和color属性

```Css
p {
  color: #333;
}
```

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-039.png">

解释：①行高可以跟单位也可以不跟单位

②如果子元素没有设置行高，则会继承父元素的行高为 1.5

③此时子元素的行高是：当前子元素的文字大小 \* 1.5

④body 行高 1.5 这样写法最大的优势就是里面子元素可以根据自己文字大小自动调整行高

### 8.3.3 优先级

1.  选择器相同，则执行层叠性
    
2.  选择器不同，则根据选择器权重执行
    

| 选择器 | 选择器权重 |
|:---|:---|
| 继承 或者* | 0，0，0，0 |
| 标签选择器 | 0，0，0，1 |
| 类选择器，伪类选择器 | 0，0，1，0 |
| ID选择器 | 0，1，0，0 |
| 行内样式 | 1，0，0，0 |
| ！important | 无穷大 |

! important用法：

```Css
/* !important 拥有最高优先级 */
div {
  color: pink !important;
}
/* 以下规则不会生效，因为上面有 !important */
div {
  color: red;
}
```

优先级注意点：

①权重是有4组数字组成,但是不会有进位

②可以理解为类选择器永远大于元素选择器, id选择器永远大于类选择器,以此类推..

③等级判断从左向右，如果某一位数值相同，则判断下一位数值

④可以简单记忆法: 通配符和继承权重为0, 标签选择器为1,类(伪类)选择器为 10, id选择器 100, 行内样式表为 1000, !important 无穷大.

⑤继承的权重是0， 如果该元素没有直接选中，不管父元素权重多高，子元素得到的权重都是 0

⑥复合选择器

| div ul li | 0,0,0,3 |
|:---|:---|
| .nav ul li | 0,0,1,1这是个带有类选择器的后代选择器，有继承关系，实际最后权重就是一个类选择器加上一个标签选择器 |
| a:hover | 0,0,1,1 |
| .nav a | 0,0,1,1 |
