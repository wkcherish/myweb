---
title: 10. CSS规范与学成在线案例
description: 
---

# 10. CSS规范与学成在线案例

## 10.1 CSS属性书写顺序

1.  **布局定位属性** ：display / position / float / clear / visibility / overflow（建议 display 第一个写，毕竟关系到模式）
    
2.  **自身属性** ：width / height / margin / padding / border / background
    
3.  **文本属性** ：color / font / text-decoration / text-align / vertical-align / white- space / break-word
    
4.  **其他属性（CSS3）** ：content / cursor / border-radius / box-shadow / text-shadow / background:linear-gradient …
    

```Css
/* 边框复合写法：粗细 样式 颜色 */
div {
  border: 1px solid #ccc;
}
```

## 10.2 学成在线案例反思总结

### 10.2.1 header头部制作

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-051.png">

*   1号是版心盒子 **header** 1200 \* 42 的盒子水平居中对齐, 上下给一个margin值就好了
    
*   版心盒子 里面包含 2号盒子 **logo** 图标
    
*   版心盒子 里面包含 3号盒子 **nav** 导航栏
    
*   版心盒子 里面包含 4号盒子 **search** 搜索框
    
*   版心盒子 里面包含 5号盒子 **user** 个人信息
    
*   注意，要求里面的 **4个子盒子 必须都浮动**
    

1.  **导航栏注意点:**
    

实际开发中， **重要的****导航栏**，我们不会直接用链接a ，而是 **用 li 包含链接(li+a)的做法**

*   li+a 语义更清晰，一看这就是有条理的列表型内容
    
*   如果直接用a，搜索引擎容易辨别为有堆砌关键字嫌疑（故意堆砌关键字容易被搜索引擎有降权的风险），从而影响网站排名
    

注意：

  ①让导航栏一行显示, 给 li 加浮动, 因为 li 是块级元素, 需要一行显示

  ②这个nav导航栏可以不给宽度,将来可以继续添加其余文字

  ③因为导航栏里面文字不一样多,所以最好给链接 a 左右padding 撑开盒子,而不是指定宽度

2.  **4号盒子search的细节：**
    

*   search 搜索框的意思: 一个 search 大盒子里面包含 2个 表单
    
*   技巧：input和button都，属于行内块元素，会有缝隙，使用浮动，可以去缝隙
    
*   `<button>``</button>`按钮不能忘，按钮要手动去除边框
    

### 10.2.2 banner制作

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-052.png">

*   1号盒子是通栏的大盒子 **banner** ， 不给宽度，给高度，给一个蓝色背景
    
*   2号盒子是版心 **w** ， 要水平居中对齐
    
*   3号盒子版心内，左对齐 **subnav** 侧导航栏
    
*   4号盒子版心内，右对齐 **course** 课程
    

### 10.2.3 精品推荐小模块

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-053.png">

*   大盒子水平居中 goods 精品 ，注意此处有个盒子阴影
    
*   1号盒子是标题 H3 左侧浮动
    
*   2号盒子 里面放链接 左侧浮动goods-item距离可以控制链接的 左右外边距（注意行内元素只给左右内外边距）
    
*   3号盒子 右浮动 mod 修改
    

### 10.2.4 精品推荐大模块

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-054.png">

*   1号盒子为最大的盒子 **box** 版心水平居中对齐
    
*   2号盒子为上面部分 **box-hd** -- 里面 左侧标题H3 左浮动 右侧 链接 a 右浮动
    
*   3号盒子为底下部分 **box-bd** --- 里面是无序列表 有 10个 小li 组成
    
*   小li 外边距的问题， 在使用li的时候可能因为外边距的问题导致最后一个li盒子在这一行是放不开的，此时可以对ul进行处理，让ul大一点，大的那一块反正是外边距，所以不会有任何的影响，这样就不需要再单独写类选择器，对放不下的li盒子进行处理
    
*   复习点：我们用到清除浮动，因为 box-hd 里面的盒子个数不一定是多少，所以我们就不给高度了，但是里面的盒子浮动会影响下面的布局，因此需要清除浮动。
    

### 10.2.5 底部模块制作

<img style="max-width:100%" src="/images/feishu/assets/2024-10-10-Html和CSS学习-055.png">

*   1号盒子通栏大盒子 底部 **footer** 给高度 底色是白色
    
*   2号盒子版心水平居中
    
*   3号盒子版权 **copyright** 左对齐
    
*   4号盒子 链接组 **links** 右对齐
    

### 10.2.6 代码模块

1.  html部分
    

```Html
<a href="https://example.com" target="_blank">链接文字</a>
```

2.  css部分
    

```Html
<a href="https://example.com" target="_blank">链接文字</a>
```

### 10.2.7 收获

1.  先确定版心，然后写一个类选择器，直接后边的就直接调用这个类选择器就可以
    
2.  在设置导航栏时，对于横的导航栏对li设置浮动，对a设置大小就可以，对于竖的导航栏对li设置宽高，以后这样做，保证书写规范
    
3.  行内块元素之间有空隙，解决的一个好方法是设置浮动
    
4.  设置用户的时候要灵活使用img标签，一个盒子放头像和名字
    
5.  遗忘代码
    

```Css
div, p, h1, ul, li {
  /* 块级元素：独占一行，可设宽高 */
  display: block;
}
```

6.  html引css的程序
    

```Css
div, p, h1, ul, li {
  /* 块级元素：独占一行，可设宽高 */
  display: block;
}
```

7.  浮动的盒子不会有外边距合并问题
    
8.  子盒子没有设置宽高，是直接继承父盒子的宽高的，此时给子盒子设置padding,是不会撑大父盒子的，可以理解为已经约束了子盒子，子盒子在确定空间中再如何动，也不会打破空间
    
9.  ctrl+g快速定位行；shift+alt多个光标
    
10.  学习上方各个模块的选择器起名方法，以后就这样用
    
11.  在写选择器时尽量写全一些，例如
    

```Css
/* 静态定位（默认） */
.static { position: static; }
/* 相对定位 */
.relative { position: relative; }
/* 绝对定位 */
.absolute { position: absolute; }
/* 固定定位 */
.fixed { position: fixed; }
/* 粘性定位 */
.sticky { position: sticky; }
```

12.  一定要用好注释
    
13.  浮动的盒子不会有外边距合并的问题
    

  
