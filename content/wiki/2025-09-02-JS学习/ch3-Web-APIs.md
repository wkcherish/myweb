---
title: 3.Web APIs
description: 
---


# 3.Web APIs

尽量使用const，因为绝大多数定义的变量基本上它的值都不会再改变

实际开发中的思路：有了变量先给const，如果发现它后面是要被修改的，再改为let

![](../../public/images/feishu/assets/2025-09-02-JS学习-082.png)

此时arr.push(3),给数组添加新的元素，这个元素加添加到堆中了，地址还是那个地址，因此这里的使用const来声明是没有问题的。如果此时接着写arr=\[4,5,6\]，此时这个就是一个新的数组，存到堆中的位置与之前那个是不同的，在栈中存了新地址，所以此时就会报错，就是不对的，如果想这样干，只能使用let来声明变量。const声明的是常量

建议数组和对象使用 const 来声明

Web APIs分为DoM(页面文档对象模型)和BoM(浏览器对象模型)

## 3.1 Dom(文档对象模型)

### 非常重要：window是整个窗口；html是DOM树的根节点；document代表了整个html中所有内容，代表整个HTML页面（DOM树）

`document` = HTML 文件解析后的对象化表示；

`document` ≠ HTML 文件本身

**`window`** = 窗口对象，代表浏览器的这个标签页/容器

**`document`** ：容器里的内容，代表当前加载的网页（DOM）

document实际上为window.document的简写

### 3.1.1 关于DoM的基础知识

![](../../public/images/feishu/assets/2025-09-02-JS学习-083.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-084.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-085.png)

console.dir()

dir用来打印对象

*   任何一个标签，都是一个对象
    
*   也就是说这些标签在HTML中就是一个标签，但是在js的DoM中从HTML获取过来就是对象，叫作DoM对象
    
*   在DoM中最大的对象是document对象，它提供的方法是用来访问和操作网页内容的，document是整个网页中最大的对象，它存放了页面的所有元素！
    

  

  

DoM对象可以理解为就是标签元素，在html中就是标签，修饰的时候使用的是css，在js中就是对象，通过对对象的属性进行修改来实现对标签的修饰

### 3.1.2 获取DoM对象

css是通过选择器的方式来获取标签，对标签的样式进行修饰的

获取DoM元素现在主要是通过css选择器的方式来获取，必须牢记这一方法！！！

**查找元素DOM元素就是利用 JS 选择页面中标签元素**

1.  利用CSS选择器来获取标签元素
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-086.png)

里边的选择器必须必须加引号！！！

只选择第一个元素

```xml
<body>
  <div class="box">123</div>
  <div class="box">456</div>
  <script>
    // 1.获取匹配的第一个元素
    const box = document.querySelector('div')
    console.dir(box)
  </script>
</body>
```

只选123，不选456

![](../../public/images/feishu/assets/2025-09-02-JS学习-087.png)

返回的是一个数组的集合，不能对其进行直接修改

![](../../public/images/feishu/assets/2025-09-02-JS学习-088.png)

单个标签也可以使用querySelectAll()来获取，直接通过索引号就可以使用这个元素

querySelect()的调用对象是它的父亲，并不一定用document来进行调用

2.  其他方法来获取标签元素
    

不要使用，还是使用css法获取DoM的元素的方法就行，下面的方法认识就ok

![](../../public/images/feishu/assets/2025-09-02-JS学习-089.png)

### 3.1.3 操作元素的内容

设置修改DOM元素内容有两种方式：

*   元素.innerText=''
    
*   元素.innerHTML=''
    
*   不写字符串输出数字也是可以的
    
*   元素.innerHtml=1
    

#### 3.1.3.1 innerText

![](../../public/images/feishu/assets/2025-09-02-JS学习-090.png)

思路：实现了修改盒子中的内容！

它只显示纯文本，不解析标签

#### 3.1.3.2 innerHTML

![](../../public/images/feishu/assets/2025-09-02-JS学习-091.png)

相比于innerText，他的强大之处在于可以解析标签

### 3.1.4 操作元素属性

#### 3.1.4.1 操作元素常用属性

![](../../public/images/feishu/assets/2025-09-02-JS学习-092.png)

#### 3.1.4.2 操作元素样式属性

![](../../public/images/feishu/assets/2025-09-02-JS学习-093.png)

后边跟的是字符串，必须加引号，然后单位也不要忘记

  

div.style.backgroundColor = 'hotpink'

如果按照css的写法，-表示减，就会出错

body元素不需要再获取，直接用就行！！！！！！

如果使用的是body标签，它是网页写标签部分的唯一标签，所以对body来说可以不用获取他的DOM对象，直接使用document.body.style来进行修改样式

  

通过该方式来修改css样式，解析之后生成的是行内样式，行内样式的权重高于内部样式，权重非常高，所以可以覆盖原有样式

![](../../public/images/feishu/assets/2025-09-02-JS学习-094.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-095.png)

1.  className这个方式就是修改很多样式的时候来使用的！
    
2.  常常用于一个动作特效，比如轮播图点下边按钮才动
    
3.  这个只能添加类名，前边已经有classNmae，就不需要加点了，只写类名就ok!
    
4.  className为属性名，如果还用class的话就导致与关键字冲突
    
5.  通过操作类名来修改css时，一定要看看这个标签是否原本就有类名，如果不要之前的样式，写上div.classNmae=‘box’后会覆盖之前的nav，就是给对象中的属性改值了，就是如果要的话就写成div.className='nav box'
    
6.  解析标签的时候就变为了<div class="nav box"></div>
    

  

例子：

<body>

<div class="nav"></div>

<script>

const div = document.querySelector('div')

div.className = 'box'

</script>

</body>

![](../../public/images/feishu/assets/2025-09-02-JS学习-096.png)

追加和删除类名用classList

常用于类似于开关的操作

toggle,切换一个类名意思就是：有就删掉，没有就加上（指的是盒子中是否有这个类名，不是说css中有没有这个类名，css中肯定得写类名的，不写那还要操作类控制css干嘛）

4.classList.contains()看看有没有包含某个类，如果有则返回true，没有则返回false

  

#### 3.1.4.3 牢记点

1.  获取对象时在不忘记双引号的同时加上类选择器前的.；id选择器前的#
    
2.  使用style属性操作css时不要忘记引号
    
3.  使用className或者classList时也不要忘记引号
    
4.  修改标签内容，也就是获取后的对象（浏览器根据html生成的js对象），通过innerText和innerHTML来实现，只不过innerText不能识别标签，innerHTML可以识别标签
    
5.  获取后的标签就是一个对象，其中包含了非常多的属性值和方法，const xxx=document.querySelector('.nav')，这个xxx就是一个常量，起啥名也行，一般写成这个盒子的名或者原有类名，赋值给这个常量后，就变成对象，className等就是这个类（元素）下的方法
    
6.  body就这么一个元素，所以可以对它不获取，来xiu'ga
    
7.  若： let arr=\['1','2',3\] arr\[0\]=1
    
8.  如果一个对象第一个属性值为‘1’，则获取该对象的属性值就是这个1
    
9.  上述说明了输出对象和数组中字符串的时候是不带引号的，在修改对象属性值的时候必须加字符串必须加引号，不然中文会报错，计算机不会认为这是字符串，但是将这个字符串对应的数组加下标的方式给他，就不要加字符串了，它本身就是字符串呀这个元素
    

### 3.1.5 操作表单元素

1.  天生的属性
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-097.png)

innerHTML可以得到元素的内容 username.innerHTML,但是仅限于普通元素，表单不是通过它来进行获取的，得到表单内容用value,但是button比较特殊,它是双标签,要使用.innerHTML来获取,使用.value是无法获取的

console.log(username.innerHTML) 获取一般元素的值，对表单元素来说输出的是空，啥也没有，无法读取内容，修改内容是 username.innerHTML='修改的值'

console.log(username.value) 获取表单值 修改表单元素的值：username.value='修改的值'

![](../../public/images/feishu/assets/2025-09-02-JS学习-098.png)

```html
在复选框中如果checked='checked',则可以在表单元素中只写一个checked
<input type="checkbox" name="" id="" checked>
不选的话：
const input = document.querySelector('input')
input.checked=false
这里写'true'也对，但是不要这样写，字符串只有空时为假，这里有隐式转换，就正常写布尔值就行

禁用按钮：
它的属性值disabled='disabled'这样可以进行，属性与值相等，就只写一个属性值就行
<button disabled>点击</button>
<button>点击</button>
const bt = document.querySelector('button')
bt.disabled = false
```

2.  自定义属性
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-099.png)

```xml
<body>
  <div data-id="1" data-spm="我不知道">1</div>
  <div data-id="2">2</div>
  <div data-id="3">3</div>
  <div data-id="4">4</div>
  <div data-id="5">5</div>
  <script>
    const one = document.querySelector('div')
    console.log(one.dataset)
    console.log(one.dataset.id)
    console.log(one.dataset.spm)
  </script>
</body>
```

![](../../public/images/feishu/assets/2025-09-02-JS学习-100.png)

document.querySelector选择的是第一个对象（元素）

### 3.1.6 定时器-间歇函数

![](../../public/images/feishu/assets/2025-09-02-JS学习-101.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-102.png)

定时器返回的是数字，表示第几个定时器，每个定时器的都是独一无二的，表示的是第几个定时器：

<script>

function fn() {

   document.write(1)

   }

let n = setInterval(fn, 1000)

   console.log(n)

</script>

此时输出结果为1，每1000毫秒输出一个1，若：

<script>

function fn() {

   document.write(1)

   }

let n = setInterval(fn, 1000)

   let n1 = setInterval(fn, 1000)

   console.log(n1)

</script>

此时输出结果就是2，每1秒输出两个1（因为前边还有一个执行输出1的定时器，两个一起作用在浏览器就每秒输出11）

当个执行时输出前有一秒的空窗期，当经过setInterval时，如果间隔时间为1000，它就是过了一秒钟才去调用函数，他不是立即执行的函数，跟后边的间隔时间有关

单位为毫秒！！！

可以搭配匿名函数来用！！！

setInterval(function () {

alert('两秒执行一次')

}, 2000)

  

如果有名函数的话，就不要在函数名的后边加小括号，小括号表示调用这个函数

function fn() {

document.write(1)

}

setInterval(fn, 1000)

  

如果函数名后边非得加括号的话，就将这个函数再加个引号，但是尽量不要用这种方式

setInterval('fn()', 1000)

![](../../public/images/feishu/assets/2025-09-02-JS学习-103.png)

#### 3.1.6.1 阅读注册协议

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <textarea name="" id="" cols="30" rows="10">
        用户注册协议
        欢迎注册成为京东用户！在您注册过程中，您需要完成我们的注册流程并通过点击同意的形式在线签署以下协议，请您务必仔细阅读、充分理解协议中的条款内容后再点击同意（尤其是以粗体或下划线标识的条款，因为这些条款可能会明确您应履行的义务或对您的权利有所限制）。
        【请您注意】如果您不同意以下协议全部或任何条款约定，请您停止注册。您停止注册后将仅可以浏览我们的商品信息但无法享受我们的产品或服务。如您按照注册流程提示填写信息，阅读并点击同意上述协议且完成全部注册流程后，即表示您已充分阅读、理解并接受协议的全部内容，并表明您同意我们可以依据协议内容来处理您的个人信息，并同意我们将您的订单信息共享给为完成此订单所必须的第三方合作方（详情查看
    </textarea>
  <br>
  <button class="btn" disabled>我已经阅读用户协议(5)</button>
  <script>
    // 1. 获取元素
    const btn = document.querySelector('.btn')
    // console.log(btn.innerHTML)  butto按钮特殊用innerHTML
    // 2. 倒计时
    let i = 5
    // 2.1 开启定时器
    let n = setInterval(function () {
      i--
      btn.innerHTML = `我已经阅读用户协议(${i})`
      if (i === 0) {
        clearInterval(n)  // 关闭定时器
        // 定时器停了，我就可以开按钮
        btn.disabled = false
        btn.innerHTML = '同意'
      }
    }, 1000)

  </script>
</body>

</html>
```

不要一直想着用死循环,避免死循环

`定时器本身就是循环`,就直接在匿名函数中写就欧克了,不要再去写循环了,尤其死循环!!!

#### 3.1.6.2 轮播图定时版

1.  法1
    

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    * {
      padding: 0;
      margin: 0;
    }

    li {
      list-style: none;
    }

    .box {
      position: relative;
      width: 976px;
      height: 600px;
      margin: 100px auto;
    }

    .slider-footer {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 15%;
      background-color: skyblue;
    }

    .slider-footer p {
      position: absolute;
      font-size: 28px;
      left: 20px;
      top: 5px;
    }

    ul {
      position: absolute;
      top: 55px;
      left: 20px;
      display: flex;
      justify-content: space-between;
      position: absolute;
      width: 250px;
      height: 20px;
    }

    ul li {
      width: 20px;
      height: 20px;
      background-color: rgba(0, 0, 0, .4);
      border-radius: 10px;
    }

    .activate {
      background-color: #f7f7f7;
    }
  </style>
</head>

<body>
  <div class="box">
    <div class="slider-wrapper">
      <img src="..../../public/images/slider01.jpg" alt="">
    </div>
    <div class="slider-footer">
      <p>对人类来说会不会太超前了?</p>
      <ul>
        <li class="activate"></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  </div>
  <script>
    const arrImage = [
      { url: '..../../public/images/slider01.jpg', title: '对人类来说会不会太超前了?', color: 'rgba(100,67,68)' },
      { url: '..../../public/images/slider02.jpg', title: '开启剑与雪的黑暗传说!', color: 'rgba(43,35,26)' },
      { url: '..../../public/images/slider03.jpg', title: '真正的jo厨出现了!', color: 'rgba(36,31,33)' },
      { url: '..../../public/images/slider04.jpg', title: '李玉刚:让世界通过b站看到东方大国文化', color: 'rgba(139,98,66)' },
      { url: '..../../public/images/slider05.jpg', title: '快来分享你的寒假日常吧', color: 'rgba(67,90,92)' },
      { url: '..../../public/images/slider06.jpg', title: '哔哩哔哩小年YEAR', color: 'rgba(166,131,143)' },
      { url: '..../../public/images/slider07.jpg', title: '一站式解决你的电脑配置问题', color: 'rgba(53,29,25)' },
      { url: '..../../public/images/slider08.jpg', title: '谁不想和小猫咪贴贴呢?', color: 'rgba(99,72,114)' }
    ]
    const img = document.querySelector('.slider-wrapper img')
    const p = document.querySelector('.slider-footer p')
    const color = document.querySelector('.slider-footer')
    const lis = document.querySelectorAll('.slider-footer ul li')
    let i = 1
    let timer = setInterval(function () {
      img.src = arrImage[i].url
      p.innerHTML = arrImage[i].title
      color.style.backgroundColor = arrImage[i].color
      // let li = document.querySelector(`.slider-footer ul li:nth-child(${i + 1})`)
      // li.classList.add('activate')
      // lis[i + 1].classList.add('activate')
      // lis[i].classList.remove('activate')
      document.querySelector('.activate')?.classList.toggle('activate')
      lis[i].classList.add('activate')

      i = (i + 1) % arrImage.length

    }, 1000)
  </script>
</body>

</html>
```

![](../../public/images/feishu/assets/2025-09-02-JS学习-104.png)

?.就是短路保护,确保输出正常进行

不要忘记取余%,有时候可以用

  

相同部分可以封装成函数,然后调用这部分就可以!!!

2.  法2
    

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    * {
      padding: 0;
      margin: 0;
    }

    li {
      list-style: none;
    }

    .box {
      position: relative;
      width: 976px;
      height: 600px;
      margin: 100px auto;
    }

    .slider-footer {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 15%;
      background-color: skyblue;
    }

    .slider-footer p {
      position: absolute;
      font-size: 28px;
      left: 20px;
      top: 5px;
    }

    ul {
      position: absolute;
      top: 55px;
      left: 20px;
      display: flex;
      justify-content: space-between;
      position: absolute;
      width: 250px;
      height: 20px;
    }

    ul li {
      width: 20px;
      height: 20px;
      background-color: rgba(0, 0, 0, .4);
      border-radius: 10px;
    }

    .activate {
      background-color: #f7f7f7;
    }
  </style>
</head>

<body>
  <div class="box">
    <div class="slider-wrapper">
      <img src="..../../public/images/slider01.jpg" alt="">
    </div>
    <div class="slider-footer">
      <p>对人类来说会不会太超前了?</p>
      <ul>
        <li class="activate"></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  </div>
  <script>
    const sliderData = [
      { url: '..../../public/images/slider01.jpg', title: '对人类来说会不会太超前了?', color: 'rgba(100,67,68)' },
      { url: '..../../public/images/slider02.jpg', title: '开启剑与雪的黑暗传说!', color: 'rgba(43,35,26)' },
      { url: '..../../public/images/slider03.jpg', title: '真正的jo厨出现了!', color: 'rgba(36,31,33)' },
      { url: '..../../public/images/slider04.jpg', title: '李玉刚:让世界通过b站看到东方大国文化', color: 'rgba(139,98,66)' },
      { url: '..../../public/images/slider05.jpg', title: '快来分享你的寒假日常吧', color: 'rgba(67,90,92)' },
      { url: '..../../public/images/slider06.jpg', title: '哔哩哔哩小年YEAR', color: 'rgba(166,131,143)' },
      { url: '..../../public/images/slider07.jpg', title: '一站式解决你的电脑配置问题', color: 'rgba(53,29,25)' },
      { url: '..../../public/images/slider08.jpg', title: '谁不想和小猫咪贴贴呢?', color: 'rgba(99,72,114)' }
    ]
    // 1.获取元素
    const img = document.querySelector('.slider-wrapper img')
    const p = document.querySelector('.slider-footer p')
    let i = 0
    // 2.开启定时器
    // console.log(sliderData[i]) 拿到对应对象了
    setInterval(function () {
      i++
      if (i >= sliderData.length) {
        i = 0
      }
      // 更换图片路径
      img.src = sliderData[i].url
      // 把文字写到p里面
      p.innerHTML = sliderData[i].title
      // 小圆点
      // 先删除以前的active
      // 只让当前li添加active
      document.querySelector('.slider-footer .activate').classList.remove('activate')
      document.querySelector(`.slider-footer ul li:nth-child(${i + 1})`).classList.add('activate')

    }, 1000)

  </script>
</body>

</html>
```

### 3.1.7 重要知识点

浏览器在渲染文本时， **没有空格或换行符就没有“断行点”**

![](../../public/images/feishu/assets/2025-09-02-JS学习-105.png)

让一些文字一直在浏览器打印输出的话，如果没有空格，就一直在浏览器一行内打印；当加上空格后，在浏览器一行内打印不开时就自动换行

![](../../public/images/feishu/assets/2025-09-02-JS学习-106.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-107.png)

## 3.2 DOM事件基础

### 3.2.1 事件监听

![](../../public/images/feishu/assets/2025-09-02-JS学习-108.png)

事件监听有响应的发生

![](../../public/images/feishu/assets/2025-09-02-JS学习-109.png)

  

不会立即执行,跟定时器差不多,定时器是经过了间隔时间再输出;定时器是当经历事件触发之后才会执行

  

对于有名函数,要执行的函数名后边不要加()

### 3.2.2 随机点名案例

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    * {
      margin: 0;
      padding: 0;
    }

    h2 {
      text-align: center;
    }

    .box {
      width: 600px;
      margin: 50px auto;
      display: flex;
      font-size: 25px;
      line-height: 40px;
    }

    .qs {

      width: 450px;
      height: 40px;
      color: red;

    }

    .btns {
      text-align: center;
    }

    .btns button {
      width: 120px;
      height: 35px;
      margin: 0 50px;
    }
  </style>
</head>

<body>
  <h2>随机点名</h2>
  <div class="box">
    <span>名字是：</span>
    <div class="qs">这里显示姓名</div>
  </div>
  <div class="btns">
    <button class="start">开始</button>
    <button class="end">结束</button>
  </div>

  <script>
    // 数据数组
    const arr = ['马超', '黄忠', '赵云', '关羽', '张飞']
    const qs = document.querySelector('.qs')
    // 1.业务1.开始按钮模块
    const start = document.querySelector('.start')
    // 定义全局变量, 如果在函数里边的话就是局部变量, 另一个函数无法使用
    let timerId = 0
    // 随机号要全局变量
    let random = 0
    // 1.1 添加点击事件
    start.addEventListener('click', function () {
      timerId = setInterval(function () {
        // 随机数
        random = parseInt(Math.random() * arr.length)
        qs.innerHTML = arr[random]
      }, 35)
      // 如果数组里面只有一个值了, 不需要抽取了, 让两个按钮禁用就可以
      if (arr.length === 1) {
        // start.disabled = true
        // end.disabled = true
        // 可以合起来写
        start.disabled = end.disabled = true
      }
    })
    // 1.2 关闭按钮模块
    const end = document.querySelector('.end')
    end.addEventListener('click', function () {
      clearInterval(timerId)
      // 结束了.可以删除掉当前抽取的那个数组元素
      arr.splice(random, 1)
    })

  </script>
</body>

</html>
```

函数中声明的变量是局部作用变量,另一个函数是无法使用的,想使用的话,就将这个变量改为全局变量

### 3.2.3 垃圾回收机制

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <button>点击</button>
  <script>
    const btn = document.querySelector('button')
    btn.addEventListener('click', function () {
      const num = Math.random()
      console.log(num)
    })
  </script>
</body>

</html>
```

当对按钮进行点击事件,就会执行函数,执行完之后这个变量就没用了,js有自动回收机制,相当于把这两行代码给删除了,当再次点击时,会创立一个新的变量出来,这个新变量与之前的那个是不同的,之前那个压根就没了,被回了,所以写const没事

常量不可以重新赋值

函数内部的变量和定义的常量在函数执行之后会有垃圾回收机制

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <button>点击</button>
  <script>
    const num = 10
    const btn = document.querySelector('button')
    btn.addEventListener('click', function () {
      const num = Math.random()
      console.log(num)
    })
  </script>
</body>

</html>
```

不会报错,num所述的作用域不同,一个在全局作用域,一个在局部作用域

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <button>点击</button>
  <script>
    const num = 10
    const btn = document.querySelector('button')
    btn.addEventListener('click', function () {
      num = Math.random()
      console.log(num)
    })
  </script>
</body>

</html>
```

此时报错,对全局重新赋值,肯定不对,出错!!!

### 3.2.4 事件监听版本

![](../../public/images/feishu/assets/2025-09-02-JS学习-110.png)

DOM L0和DOM L1都是用的:事件源.on事件=function(){}

这种方式会覆盖前边的事件监听:

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <button>点击</button>
  <script>
    const btn = document.querySelector('button')
    btn.onclick = function () {
      alert(11)
    }
    btn.onclick = function () {
      alert(22)
    }
  </script>
</body>

</html>
```

只要点击就输出结果为22,前边11被覆盖了

```html
  btn.addEventListener('click', function () {
      alert(11)
    })
    btn.addEventListener('click', function () {
      alert(22)
    })
```

点击第一次输出11,第二次点击为22

### 3.2.5 事件类型

![](../../public/images/feishu/assets/2025-09-02-JS学习-111.png)

#### 3.2.5.1 鼠标事件

补充知识:

轮播图自动播放模块,可以使用

let timerId = setInterval(function () {

// 利用js自动调用点击事件 click() 一定加小括号调用函数

用js方法模拟进行点击事件,click必须加()

next.click()

}, 1000)

![](../../public/images/feishu/assets/2025-09-02-JS学习-112.png)

```xml

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>轮播图点击切换</title>
  <style>
    * {
      box-sizing: border-box;
    }

    .slider {
      width: 560px;
      height: 400px;
      overflow: hidden;
    }

    .slider-wrapper {
      width: 100%;
      height: 320px;
    }

    .slider-wrapper img {
      width: 100%;
      height: 100%;
      display: block;
    }

    .slider-footer {
      height: 80px;
      background-color: rgb(100, 67, 68);
      padding: 12px 12px 0 12px;
      position: relative;
    }

    .slider-footer .toggle {
      position: absolute;
      right: 0;
      top: 12px;
      display: flex;
    }

    .slider-footer .toggle button {
      margin-right: 12px;
      width: 28px;
      height: 28px;
      appearance: none;
      border: none;
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
    }

    .slider-footer .toggle button:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .slider-footer p {
      margin: 0;
      color: #fff;
      font-size: 18px;
      margin-bottom: 10px;
    }

    .slider-indicator {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      align-items: center;
    }

    .slider-indicator li {
      width: 8px;
      height: 8px;
      margin: 4px;
      border-radius: 50%;
      background: #fff;
      opacity: 0.4;
      cursor: pointer;
    }

    .slider-indicator li.active {
      width: 12px;
      height: 12px;
      opacity: 1;
    }
  </style>
</head>

<body>
  <div class="slider">
    <div class="slider-wrapper">
      <img src=".../../public/images/slider01.jpg" alt="" />
    </div>
    <div class="slider-footer">
      <p>对人类来说会不会太超前了？</p>
      <ul class="slider-indicator">
        <li class="active"></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <div class="toggle">
        <button class="prev">&lt;</button>
        <button class="next">&gt;</button>
      </div>
    </div>
  </div>
  <script>
    // 1. 初始数据
    const data = [
      { url: '.../../public/images/slider01.jpg', title: '对人类来说会不会太超前了？', color: 'rgb(100, 67, 68)' },
      { url: '.../../public/images/slider02.jpg', title: '开启剑与雪的黑暗传说！', color: 'rgb(43, 35, 26)' },
      { url: '.../../public/images/slider03.jpg', title: '真正的jo厨出现了！', color: 'rgb(36, 31, 33)' },
      { url: '.../../public/images/slider04.jpg', title: '李玉刚：让世界通过B站看到东方大国文化', color: 'rgb(139, 98, 66)' },
      { url: '.../../public/images/slider05.jpg', title: '快来分享你的寒假日常吧~', color: 'rgb(67, 90, 92)' },
      { url: '.../../public/images/slider06.jpg', title: '哔哩哔哩小年YEAH', color: 'rgb(166, 131, 143)' },
      { url: '.../../public/images/slider07.jpg', title: '一站式解决你的电脑配置问题！！！', color: 'rgb(53, 29, 25)' },
      { url: '.../../public/images/slider08.jpg', title: '谁不想和小猫咪贴贴呢！', color: 'rgb(99, 72, 114)' },
    ]
    // 获取元素
    const img = document.querySelector('.slider-wrapper img')
    const p = document.querySelector('.slider-footer p')
    const footer = document.querySelector('.slider-footer')
    // 1. 右按钮业务
    // 1.1 获取右侧按钮 
    const next = document.querySelector('.next')
    let i = 0  // 信号量 控制播放图片张数
    // 1.2 注册点击事件

    next.addEventListener('click', function () {
      // console.log(11)
      i++
      // 1.6判断条件  如果大于8 就复原为 0
      // if (i >= 8) {
      //   i = 0
      // }
      i = i >= data.length ? 0 : i
      // 1.3 得到对应的对象
      // console.log(data[i])
      // 调用函数
      toggle()
    })

    // 2. 左侧按钮业务
    // 2.1 获取左侧按钮 
    const prev = document.querySelector('.prev')
    // 1.2 注册点击事件
    prev.addEventListener('click', function () {
      i--
      // 判断条件  如果小于0  则爬到最后一张图片索引号是 7
      // if (i < 0) {
      //   i = 7
      // }
      i = i < 0 ? data.length - 1 : i
      // 1.3 得到对应的对象
      // console.log(data[i])
      // 调用函数
      toggle()
    })

    // 声明一个渲染的函数作为复用
    function toggle() {
      // 1.4 渲染对应的数据
      img.src = data[i].url
      p.innerHTML = data[i].title
      footer.style.backgroundColor = data[i].color
      // 1.5 更换小圆点    先移除原来的类名， 当前li再添加 这个 类名
      document.querySelector('.slider-indicator .active').classList.remove('active')
      document.querySelector(`.slider-indicator li:nth-child(${i + 1})`).classList.add('active')
    }

    // 3. 自动播放模块
    let timerId = setInterval(function () {
      // 利用js自动调用点击事件  click()  一定加小括号调用函数
      next.click()
    }, 1000)

    // 4. 鼠标经过大盒子，停止定时器
    const slider = document.querySelector('.slider')
    // 注册事件
    slider.addEventListener('mouseenter', function () {
      // 停止定时器
      clearInterval(timerId)
    })

    // 5. 鼠标离开大盒子，开启定时器
    // 注册事件
    slider.addEventListener('mouseleave', function () {
      // 停止定时器
      if (timerId) clearInterval(timerId)
      // 开启定时器
      timerId = setInterval(function () {
        // 利用js自动调用点击事件  click()  一定加小括号调用函数
        next.click()
      }, 1000)
    })
  </script>
</body>

</html>
```

#### 3.2.5.2 焦点事件

小米搜索框案例：

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        ul {

            list-style: none;
        }

        .mi {
            position: relative;
            width: 223px;
            margin: 100px auto;
        }

        .mi input {
            width: 223px;
            height: 48px;
            padding: 0 10px;
            font-size: 14px;
            line-height: 48px;
            border: 1px solid #e0e0e0;
            outline: none;
        }

        .mi .search {
            border: 1px solid #ff6700;
        }

        .result-list {
            display: none;
            position: absolute;
            left: 0;
            top: 48px;
            width: 223px;
            border: 1px solid #ff6700;
            border-top: 0;
            background: #fff;
        }

        .result-list a {
            display: block;
            padding: 6px 15px;
            font-size: 12px;
            color: #424242;
            text-decoration: none;
        }

        .result-list a:hover {
            background-color: #eee;
        }
    </style>

</head>

<body>
    <div class="mi">
        <input type="search" placeholder="小米笔记本">
        <ul class="result-list">
            <li><a href="#">全部商品</a></li>
            <li><a href="#">小米11</a></li>
            <li><a href="#">小米10S</a></li>
            <li><a href="#">小米笔记本</a></li>
            <li><a href="#">小米手机</a></li>
            <li><a href="#">黑鲨4</a></li>
            <li><a href="#">空调</a></li>
        </ul>
    </div>
    <script>
        // 1. 获取元素
        const input = document.querySelector('[type=search]')
        const ul = document.querySelector('.result-list')
        // console.log(input)
        // 2. 监听事件 获得焦点
        input.addEventListener('focus', function () {
            // ul显示
            ul.style.display = 'block'
            // 添加一个带有颜色边框的类名
            input.classList.add('search')
        })
        // 3. 监听事件 失去焦点
        input.addEventListener('blur', function () {
            ul.style.display = 'none'
            input.classList.remove('search')
        })
    </script>
</body>

</html>
```

#### 3.2.5.3 键盘事件

评论字数统计案例

补充知识点：点击表单元素，获得焦点时盒子变大，可以使用focus伪类选择器

牢记focus伪类选择器

<!DOCTYPE html>

<html lang="en">

  

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Document</title>

<style>

input {

width: 200px;

transition: all .3;

}

/\* 获得了光标 \*/

input:focus {

width: 300px;

}

</style>

</head>

<body>

<input type="text">

</body>

</html>

*   键盘事件代码，显示可以使用opacity样式属性，通过透明度的形式实现盒子或者文字显示和隐藏，相比于disabled来说显示效果更好一些，一定要学会使用
    
*   一定要用好placeholder，它是表单元素的属性值，表示提示文本
    

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>评论回车发布</title>
  <style>
    .wrapper {
      min-width: 400px;
      max-width: 800px;
      display: flex;
      justify-content: flex-end;
    }

    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
      background: url(.../../public/images/avatar.jpg) no-repeat center / cover;
      margin-right: 20px;
    }

    .wrapper textarea {
      outline: none;
      border-color: transparent;
      resize: none;
      background: #f5f5f5;
      border-radius: 4px;
      flex: 1;
      padding: 10px;
      transition: all 0.5s;
      height: 30px;
    }

    .wrapper textarea:focus {
      border-color: #e4e4e4;
      background: #fff;
      height: 50px;
    }

    .wrapper button {
      background: #00aeec;
      color: #fff;
      border: none;
      border-radius: 4px;
      margin-left: 10px;
      width: 70px;
      cursor: pointer;
    }

    .wrapper .total {
      margin-right: 80px;
      color: #999;
      margin-top: 5px;
      opacity: 0;
      transition: all 0.5s;
    }

    .list {
      min-width: 400px;
      max-width: 800px;
      display: flex;
    }

    .list .item {
      width: 100%;
      display: flex;
    }

    .list .item .info {
      flex: 1;
      border-bottom: 1px dashed #e4e4e4;
      padding-bottom: 10px;
    }

    .list .item p {
      margin: 0;
    }

    .list .item .name {
      color: #FB7299;
      font-size: 14px;
      font-weight: bold;
    }

    .list .item .text {
      color: #333;
      padding: 10px 0;
    }

    .list .item .time {
      color: #999;
      font-size: 12px;
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <i class="avatar"></i>
    <textarea id="tx" placeholder="发一条友善的评论" rows="2" maxlength="200"></textarea>
    <button>发布</button>
  </div>
  <div class="wrapper">
    <span class="total">0/200字</span>
  </div>
  <div class="list">
    <div class="item" style="display: none;">
      <i class="avatar"></i>
      <div class="info">
        <p class="name">清风徐来</p>
        <p class="text">大家都辛苦啦，感谢各位大大的努力，能圆满完成真是太好了[笑哭][支持]</p>
        <p class="time">2022-10-10 20:29:21</p>
      </div>
    </div>
  </div>
  <script>
    const tx = document.querySelector('#tx')
    const total = document.querySelector('.total')
    // 1. 当我们文本域获得了焦点，就让 total 显示出来
    tx.addEventListener('focus', function () {
      total.style.opacity = 1
    })
    // 2. 当我们文本域失去了焦点，就让 total 隐藏出来
    tx.addEventListener('blur', function () {
      total.style.opacity = 0
    })
    // 3. 检测用户输入
    tx.addEventListener('input', function () {
      // console.log(tx.value.length)  得到输入的长度
      total.innerHTML = `${tx.value.length}/200字`
    })

    // const str = 'andy'
    // console.log(str.length)
  </script>
</body>

</html>
```

#### 3.2.5.4 change事件

在输入框中，获得焦点，不输入任何内容，再失去焦点，则会不会触发事件，函数不会执行

第一次要输入内容时，获得焦点，输入内容，失去焦点，函数执行

后边如果获得焦点不输入任何内容，表单里的内容只要不变，函数就不会去执行

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <input type="text">
  <script>
    const input = document.querySelector('input')
    input.addEventListener('change', function () {
      console.log(111)
    })
  </script>
</body>

</html>
```

总结：内容发生改变才回去触发

### 3.2.6 事件对象

#### 3.2.6.1 事件对象的介绍

![](../../public/images/feishu/assets/2025-09-02-JS学习-113.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-114.png)

点击一次，就输出了事件对象，它是个对象

只有事件监听中里边的执行函数括号里边的内容才是事件对象，其他的函数后边括号中的变量是一个形参

![](../../public/images/feishu/assets/2025-09-02-JS学习-115.png)

#### 3.2.6.2 事件对象的属性

![](../../public/images/feishu/assets/2025-09-02-JS学习-116.png)

实现按特殊字符才是实现打印输出效果：

```xml
<body>
  <!-- <button>点击</button> -->
  <input type="text">
  <script>
    // const btn = document.querySelector('button')
    // btn.addEventListener('click', function (e) {
    //   console.log(e);
    // })
    // 按回车键才进行触发这个事件的话一定要使用事件对象
    const input = document.querySelector('input')
    input.addEventListener('keyup', function (e) {
      if (e.key === 'Enter') {
        console.log('我按下了回车键')
      }
    })
  </script>
</body>
```

#### 3.2.6.3 trim方法

![](../../public/images/feishu/assets/2025-09-02-JS学习-117.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-118.png)

打印输出出现了空格，可以去除两侧的空格，不会去除左右的空格

str.trim()

### 3.2.7 环境对象

![](../../public/images/feishu/assets/2025-09-02-JS学习-119.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-120.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-121.png)

实际函数调用是window.fn()

普通函数里面this指向的是window

  

*   在普通函数下，this指向的是window
    
*   在事件监听中this指向的是调用者，例如下面的开关，this指向的是button
    
*   箭头函数没有this
    

  

粗略记法就是：谁调用，this就指向谁

![](../../public/images/feishu/assets/2025-09-02-JS学习-122.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-123.png)

这里button调用的这个执行函数，所以this就是button，this就表示它自己

this的用处，点击按钮，按钮自己的字变为粉色：

```xml
<body>
  <button>点击</button>
  <script>
    const button = document.querySelector('button')
    button.addEventListener('click', function () {
      // console.log(this);
      this.style.color = 'pink'
    })
  </script>
</body>
```

### 3.2.8 回调函数

![](../../public/images/feishu/assets/2025-09-02-JS学习-124.png)

定时器本身就是个函数，fn函数作为参数传递给了这个定时器这个函数，过了一秒钟就调用这个函数，fn就是回调函数

总结：

*   把函数当做另外一个函数的参数传递，这个函数就叫回调函数
    
*   回调函数本质还是函数，只不过把它当成参数使用
    
*   使用匿名函数做为回调函数比较常见
    

### 3.2.9 tab栏切换

![](../../public/images/feishu/assets/2025-09-02-JS学习-125.png)

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>tab栏切换</title>
  <style>
    * {
      margin: 0;
      padding: 0;
    }

    .tab {
      width: 590px;
      height: 340px;
      margin: 20px;
      border: 1px solid #e4e4e4;
    }

    .tab-nav {
      width: 100%;
      height: 60px;
      line-height: 60px;
      display: flex;
      justify-content: space-between;
    }

    .tab-nav h3 {
      font-size: 24px;
      font-weight: normal;
      margin-left: 20px;
    }

    .tab-nav ul {
      list-style: none;
      display: flex;
      justify-content: flex-end;
    }

    .tab-nav ul li {
      margin: 0 20px;
      font-size: 14px;
    }

    .tab-nav ul li a {
      text-decoration: none;
      border-bottom: 2px solid transparent;
      color: #333;
    }

    .tab-nav ul li a.active {
      border-color: #e1251b;
      color: #e1251b;
    }

    .tab-content {
      padding: 0 16px;
    }

    .tab-content .item {
      display: none;
    }

    .tab-content .item.active {
      display: block;
    }
  </style>
</head>

<body>
  <div class="tab">
    <div class="tab-nav">
      <h3>每日特价</h3>
      <ul>
        <li><a class="active" href="javascript:;">精选</a></li>
        <li><a href="javascript:;">美食</a></li>
        <li><a href="javascript:;">百货</a></li>
        <li><a href="javascript:;">个护</a></li>
        <li><a href="javascript:;">预告</a></li>
      </ul>
    </div>
    <div class="tab-content">
      <div class="item active"><img src="..../../public/images/tab00.png" alt="" /></div>
      <div class="item"><img src="..../../public/images/tab01.png" alt="" /></div>
      <div class="item"><img src="..../../public/images/tab02.png" alt="" /></div>
      <div class="item"><img src="..../../public/images/tab03.png" alt="" /></div>
      <div class="item"><img src="..../../public/images/tab04.png" alt="" /></div>
    </div>
  </div>
  <script>
    // 1. a 模块制作 要给 5个链接绑定鼠标经过事件
    // 1.1 获取 a 元素 
    const as = document.querySelectorAll('.tab-nav a')
    // console.log(as) 
    for (let i = 0; i < as.length; i++) {
      // console.log(as[i])
      // 要给 5个链接绑定鼠标经过事件
      as[i].addEventListener('mouseenter', function () {
        // console.log('鼠标经过')
        // 排他思想  
        // 干掉别人 移除类active
        document.querySelector('.tab-nav .active').classList.remove('active')
        // 我登基 我添加类 active  this 当前的那个 a 
        this.classList.add('active')

        // 下面5个大盒子 一一对应  .item 
        // 干掉别人
        document.querySelector('.tab-content .active').classList.remove('active')
        // 对应序号的那个 item 显示 添加 active 类
        document.querySelector(`.tab-content .item:nth-child(${i + 1})`).classList.add('active')

      })
    }
  </script>
</body>

</html>
```

总结：不要忘记this，还有tab栏优先考虑使用循环！！！

在监听事件中，this指向的就是他的调用者

补充：如果刚开始是没有active选中的，可以进行.active(使用这个类)的对象元素的获取，如果没有就是null，空为假，然后就可以进行if语句的判断，如果假的话就不用执行删除，真的话就删除，然后再添加active这个类就可以！

例子：

(function () {

const list = document.querySelector('.xtx-elevator-list')

list.addEventListener('click', function (e) {

if (e.target.tagName === 'A') {

// 排他思想

// 在不知道有么有active这个类的情况下不能上来就删除

const old = document.querySelector('.xtx-elevator-list .active')

// console.log(old);

// 判断

// 没有的话old=null，空为假，就不执行后边的操作

if (old) old.classList.remove('active')

e.target.classList.add('active')

}

})

})();

### 3.2.10 按钮全选或反选案例

```html
<!DOCTYPE html>

<html>

<head lang="en">
  <meta charset="UTF-8">
  <title></title>
  <style>
    * {
      margin: 0;
      padding: 0;
    }

    table {
      border-collapse: collapse;
      border-spacing: 0;
      border: 1px solid #c0c0c0;
      width: 500px;
      margin: 100px auto;
      text-align: center;
    }

    th {
      background-color: #09c;
      font: bold 16px "微软雅黑";
      color: #fff;
      height: 24px;
    }

    td {
      border: 1px solid #d0d0d0;
      color: #404060;
      padding: 10px;
    }

    .allCheck {
      width: 80px;
    }
  </style>
</head>

<body>
  <table>
    <tr>
      <th class="allCheck">
        <input type="checkbox" name="" id="checkAll"> <span class="all">全选</span>
      </th>
      <th>商品</th>
      <th>商家</th>
      <th>价格</th>
    </tr>
    <tr>
      <td>
        <input type="checkbox" name="check" class="ck">
      </td>
      <td>小米手机</td>
      <td>小米</td>
      <td>￥1999</td>
    </tr>
    <tr>
      <td>
        <input type="checkbox" name="check" class="ck">
      </td>
      <td>小米净水器</td>
      <td>小米</td>
      <td>￥4999</td>
    </tr>
    <tr>
      <td>
        <input type="checkbox" name="check" class="ck">
      </td>
      <td>小米电视</td>
      <td>小米</td>
      <td>￥5999</td>
    </tr>
  </table>
  <script>
    // 1. 获取大复选框
    const checkAll = document.querySelector('#checkAll')
    // 2. 获取所有的小复选框
    const cks = document.querySelectorAll('.ck')
    // 3. 点击大复选框  注册事件
    checkAll.addEventListener('click', function () {
      // 得到当前大复选框的选中状态
      // console.log(checkAll.checked)  // 得到 是 true 或者是 false
      // 4. 遍历所有的小复选框 让小复选框的checked  =  大复选框的 checked
      for (let i = 0; i < cks.length; i++) {
        cks[i].checked = this.checked
      }
    })
    // 5. 小复选框控制大复选框

    for (let i = 0; i < cks.length; i++) {
      // 5.1 给所有的小复选框添加点击事件
      cks[i].addEventListener('click', function () {
        // 判断选中的小复选框个数 是不是等于  总的小复选框个数
        // 一定要写到点击里面，因为每次要获得最新的个数
        // console.log(document.querySelectorAll('.ck:checked').length)
        // console.log(document.querySelectorAll('.ck:checked').length === cks.length)
        checkAll.checked = document.querySelectorAll('.ck:checked').length === cks.length
      })
    }
  </script>
</body>

</html>
```

一定要懂思路，反选做不出来去了解布尔值！！！

用好之间比较得到的布尔值！！！

在 JS 里访问的时候，`checkbox.checked` 是一个 **布尔值** (`true`/`false`)，不是字符串，也就是说js通过这个属性值可以实现对复选按钮选择与否的控制

HTML 的 `checked="checked"` 只是 **初始值；JS 的 `.checked` 表示当前实时状态，值是个布尔值，是true和false**

：checked是一个伪类选择器

![](../../public/images/feishu/assets/2025-09-02-JS学习-126.png)

:checked是一个伪类选择器，这个伪类选择器是对被勾选的复选框的样式进行处理

![](../../public/images/feishu/assets/2025-09-02-JS学习-127.png)

## 3.3 DOM事件进阶

### 3.3.1 事件流

![](../../public/images/feishu/assets/2025-09-02-JS学习-128.png)

#### 3.3.1.1 事件捕获

![](../../public/images/feishu/assets/2025-09-02-JS学习-129.png)

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .father {
      width: 500px;
      height: 500px;
      background-color: pink;
    }

    .son {
      width: 200px;
      height: 200px;
      background-color: skyblue;
    }
  </style>
</head>

<body>
  <div class="father">
    <div class="son"></div>
  </div>
  <script>
    const fa = document.querySelector('.father')
    const son = document.querySelector('.son')
    document.addEventListener('click', function () {
      alert('woshiu1')
    }, true)
    fa.addEventListener('click', function () {
      alert('1')
    }, true)
    son.addEventListener('click', function () {
      alert('2')
    }, true)
  </script>
</body>

</html>
```

![](../../public/images/feishu/assets/2025-09-02-JS学习-130.png)

点击小盒子，先从最大盒子开始执行，先弹出woshiu1，再弹出1，最后弹出2；点击粉色盒子：先弹出woshiu1，再弹出1；点击浏览器其他区域，弹出woshiu1，捕获就是从最大对象（元素）开始往下找

#### 3.3.1.2 事件冒泡

![](../../public/images/feishu/assets/2025-09-02-JS学习-131.png)

反着来

注意是同名事件，比如都是‘click’

#### 3.3.1.3 阻止冒泡

![](../../public/images/feishu/assets/2025-09-02-JS学习-132.png)

#### 3.3.1.4 解绑事件

![](../../public/images/feishu/assets/2025-09-02-JS学习-133.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-134.png)

#### 3.3.1.5 事件类型和注册事件的区别

1.  事件类型的区别
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-135.png)

mouseover有冒泡，如果想实现鼠标经过有冒泡效果，就不要使用mouseenter,用mouseover

2.  注册事件的区别
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-136.png)

#### 3.3.1.6 阻止冒泡

![](../../public/images/feishu/assets/2025-09-02-JS学习-137.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-138.png)

```xml
<body>
  <form action="http://www.itcast.cn">
    <input type="submit" value="免费注册">
    <script>
      const form = document.querySelector('form')
      form.addEventListener('submit', function (e) {
        e.preventDefault()
      })
    </script>
  </form>
</body>
```

点击不在跳转！！！

### 3.3.2 事件委托

![](../../public/images/feishu/assets/2025-09-02-JS学习-139.png)

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <li>5</li>
    <p>我不需要变色</p>
  </ul>
  <script>
    // 点击每个li，当前文字变为红色
    const ul = document.querySelector('ul')
    ul.addEventListener('click', function (e) {
      // alert(1)
      // e.target就是我们点击的对象
      // 当点击时会获得事件对象，事件对象下面target属性中里边就是li
      // e.target.style.color = 'red'
      console.log(e)

      console.dir(e.target)

      // 我们需求，我们只有点击li才会变色
      // 通过tagName来进行判断
      if (e.target.tagName === 'LI') {
        e.target.style.color = 'red'
      }
    })
  </script>
</body>

</html>
```

当进行点击时，会获得事件对象的信息，这个对象中有一个属性为target，里边存放了点击的那个对象，然后target中又有属性值为tagName为所点击对象的名字，如果只想点击确定的对象实现某功能的话，就可以使用tagName来进行判断，对于p标签，只有点击p标签的时候执行效果，使用的是

if(e.target.ragName==='P') {}

一定要大写，可能写源码的人为了区分跟获取的p对象，才必须得大写

通过事件委托的方式实现tab栏切换改造：

一定要记住自定义属性！！！！！！

自定义属性内容都存放在了dataset这个属性中了，也就是获取值的时候就得

id是自定义的属性名

dataset.id 获取的是后面自定义属性的内容（标号），这些内容是个字符串，如果需要的是数字的话可以用parseint()，优先用隐式转换，直接在前加个+就ok

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>tab栏切换</title>
  <style>
    * {
      margin: 0;
      padding: 0;
    }

    .tab {
      width: 590px;
      height: 340px;
      margin: 20px;
      border: 1px solid #e4e4e4;
    }

    .tab-nav {
      width: 100%;
      height: 60px;
      line-height: 60px;
      display: flex;
      justify-content: space-between;
    }

    .tab-nav h3 {
      font-size: 24px;
      font-weight: normal;
      margin-left: 20px;
    }

    .tab-nav ul {
      list-style: none;
      display: flex;
      justify-content: flex-end;
    }

    .tab-nav ul li {
      margin: 0 20px;
      font-size: 14px;
    }

    .tab-nav ul li a {
      text-decoration: none;
      border-bottom: 2px solid transparent;
      color: #333;
    }

    .tab-nav ul li a.active {
      border-color: #e1251b;
      color: #e1251b;
    }

    .tab-content {
      padding: 0 16px;
    }

    .tab-content .item {
      display: none;
    }

    .tab-content .active {
      display: block;
    }
  </style>
</head>

<body>
  <div class="tab">
    <div class="tab-nav">
      <h3>每日特价</h3>
      <ul>
        <li><a class="active" href="javascript:;" data-id="0">精选</a></li>
        <li><a href="javascript:;" data-id="1">美食</a></li>
        <li><a href="javascript:;" data-id="2">百货</a></li>
        <li><a href="javascript:;" data-id="3">个护</a></li>
        <li><a href="javascript:;" data-id="4">预告</a></li>
      </ul>
    </div>
    <div class="tab-content">
      <div class="item active"><img src="..../../public/images/tab00.png" alt="" /></div>
      <div class="item"><img src="..../../public/images/tab01.png" alt="" /></div>
      <div class="item"><img src="..../../public/images/tab02.png" alt="" /></div>
      <div class="item"><img src="..../../public/images/tab03.png" alt="" /></div>
      <div class="item"><img src="..../../public/images/tab04.png" alt="" /></div>
    </div>
  </div>
  <script>
    // 采取事件委托的形式，tab栏切换
    // 1.获取ul父元素，因为ul只有一个
    const ul = document.querySelector('.tab-nav ul')
    // 2.添加事件
    ul.addEventListener('click', function (e) {
      console.dir(e.target)
      //e.targer是我们点击的对象
      if (e.target.tagName === 'A') {
        document.querySelector('.active').classList.remove('active')
        e.target.classList.add('active')

        // 下面大盒子模块
        // console.log(e.target.dataset.id)
        const i = +e.target.dataset.id
        document.querySelector('.tab-content .active').classList.remove('active')
        document.querySelector(`.tab-content .item:nth-child(${i + 1})`).classList.add('active')

      }
    })
  </script>
</body>

</html>
```

### 3.3.3 页面加载事件

1.  load
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-140.png)

window代表整个窗口，比document还要大

并不一定非得window才可以用，其他的DOM对象也可以用

img.addEventListener('load', function () {

// 等待图片加载完毕，再去执行里面的代码

})

2.  DOMContentLoaded
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-141.png)

这个主要是给html标签，给的是文档进行处理的，所以不是对整个页面，不是window,是document

### 3.3.4 元素滚动事件

![](../../public/images/feishu/assets/2025-09-02-JS学习-142.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-143.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-144.png)

scrollTop和scrollLeft都是属性，他不是方法，所以后面不需要加括号

获得的是数字型数据，不带单位

scrollTop可读写，既可以获得数据，也可以进行赋值操作

  

body作为document的属性可以直接通过document.boby进行获取，但是html不可以这样获取

它是通过document.documentElement来获取

![](../../public/images/feishu/assets/2025-09-02-JS学习-145.png)

让页面滚动，scrollTo()是方法，上边那个scrollTop是属性值

### 3.3.5 页面缩放事件

![](../../public/images/feishu/assets/2025-09-02-JS学习-146.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-147.png)

### 3.3.6 元素尺寸位置

![](../../public/images/feishu/assets/2025-09-02-JS学习-148.png)

  

offsetWidth和offsetHeight相比于clientWidth和clientHeight来说多了包含边框

![](../../public/images/feishu/assets/2025-09-02-JS学习-149.png)

scrollLeft和scrollTop与滚动有关系，是读写的，而offsetLeft和offsetTop与盒子的位置有关系，只可以读取，不可以进行赋值操作

offsetTop和offsetLeft 得到位置以带有定位的父级为准，如果都没有则以 文档左上角为准

  

pageX和pageY可以获取鼠标在页面中的坐标，要搭配事件对象使用

大盒子中套了一个小盒子，大盒子为相对定位，小盒子为绝对定位，则我对小盒子使用offsetTop和offsetLeft获取的位置是从小盒子的外边框到大盒子的内边框的距离，如果我们想获得小盒子在浏览器页面的位置可以使用 getBoundingClientRect() 这个函数不会受定位盒子的影响

getBoundingClientRect()这个方法得到的是一个对象，包含left,top等属性

![](../../public/images/feishu/assets/2025-09-02-JS学习-150.png)

getBoundingClientRect()是相对于浏览器可视页面的距离，滚动条稍微向下滚动一些，getBoundingClientRect().top的值就不准了，如果想得到鼠标在盒子中的y方向的距离，此时需要：e.pageY-box.getBoundingClientRect().top-document.documentElement.scrollTop

多减一下滚动的距离(HTML文档在window窗口内滚动的距离)，就可以得到鼠标在box盒子中相对父盒子的距离

浏览器页面由于基本不会进行左右拖动，可以不用考虑这方面的因素，鼠标相对于浏览器可视区域左侧的距离为：

e.pageX-box.getBoundingClientRect()

  

### 3.3.7 获取元素位置的另一种方法

![](../../public/images/feishu/assets/2025-09-02-JS学习-151.png)

这个是相对于视口来说的，它是个方法，不是属性值

### 3.3.8 总结

![](../../public/images/feishu/assets/2025-09-02-JS学习-152.png)

clientWidth/clientHeight和offsetWidth/offsetHeight都是可读的，不能进行赋值操作

修改盒子的宽高只能通过width和height来实现

### 3.3.9 页面滚动丝滑css写法

```html
/* 页面滑动 */
html {
  /* 让滚动条丝滑的滚动 */
  scroll-behavior: smooth;
}
```

默认是auto

### 3.3.10 日期对象

#### 3.3.10.1 实例化

![](../../public/images/feishu/assets/2025-09-02-JS学习-153.png)

#### 3.3.10.2 时期对象方法

![](../../public/images/feishu/assets/2025-09-02-JS学习-154.png)

月份+1

老外认为第一天为0，星期天

方法使用的时候必须要跟括号

  

快速获得日期

// 得到年月日

// div.innerHTML = date.toLocaleDateString()

// 得到当地日期

// div.innerHTML = date.toLocaleString()

// 得到当地时间

// div.innerHTML = date.toLocaleTimeString()

  

注意再使用定时器时，在定时器外也写一个获得时间，不然刷新浏览器刚开始由于定时器要间隔一段时间采取调用函数，会导致一开始不显示

  

如果不考虑快速的方式，要设置自己的样式的话，自己封装一个函数！！！

<script>

const div = document.querySelector('div')

function getMyDate() {

const date = new Date()

let h = date.getHours()

let m = date.getMinutes()

let s = date.getSeconds()

h = h < 10 ? '0' + h : h

m = m < 10 ? '0' + m : m

s = s < 10 ? '0' + s : s

return \``今天是${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}号 ${h}:${m}:${s}`\`

}

// 外面还写一个这个时间是因为定时器需要经过1秒才调用一次函数，刚开始会有空白

div.innerHTML = getMyDate()

setInterval(function () {

div.innerHTML = getMyDate()

}, 1000)

</script>

  

学会去封装函数！

#### 3.3.10.3 时间戳

![](../../public/images/feishu/assets/2025-09-02-JS学习-155.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-156.png)

三种方法记住一个就可以

### 3.3.11 节点操作

#### 3.3.11.1 DOM节点

![](../../public/images/feishu/assets/2025-09-02-JS学习-157.png)

我们主要用的就是元素节点，因为对元素节点操作就可以实现对标签内容样式的修改，就不需要使用属性节点和文本节点来操作了，后边的增删改查都是对元素节点来进行操作的

#### 3.3.11.2 查找节点

前边的document.querySelector()是获取的元素

这里是通过关系来获取！！！，就是正常通过document.querySelector()获取元素，这个元素是个对象，此时他的父亲儿子啥的就不用再使用document.querySelector()来获取了，直接通过关系来获取

![](../../public/images/feishu/assets/2025-09-02-JS学习-158.png)

1.  父节点
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-159.png)

2.  子节点
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-160.png)

如果使用childNodes来获得子节点，还包括文本节点、注释节点等，但是这些对我们来说没啥用，所以children来获取子节点，他就是个标签

children获得的是伪数组，是亲儿子

3.  兄弟节点
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-161.png)

#### 3.3.11.3 增加节点

![](../../public/images/feishu/assets/2025-09-02-JS学习-162.png)

创建好之后给它通过innerHTML添加内容是不显示的内容的，因为只是创建了节点，还不知道节点在哪里

![](../../public/images/feishu/assets/2025-09-02-JS学习-163.png)

在主体板块制作时，就是将各个信息写成数组对象的形式，然后利用循环来添加和追加节点，并将信息使用innerHTML来实现效果输出，因为innerHTML可以实现对标签的解析

下面是写法的部分展示，就按照下边的格式来写

例：

<script>

// 1. 重构 let data = \[

{

src: 'images/course01.png',

title: 'Think PHP 5.0 博客系统实战项目演练',

num: 1125

},

{

src: 'images/course02.png',

title: 'Android 网络动态图片加载实战',

num: 357

},

{

src: 'images/course03.png',

title: 'Angular2 大前端商城实战项目演练',

num: 22250

},

{

src: 'images/course04.png',

title: 'Android APP 实战项目演练',

num: 389

},

{

src: 'images/course05.png',

title: 'UGUI 源码深度分析案例',

num: 124

},

{

src: 'images/course06.png',

title: 'Kami2首页界面切换效果实战演练',

num: 432

},

{

src: 'images/course07.png',

title: 'UNITY 从入门到精通实战案例',

num: 888

},

{

src: 'images/course08.png',

title: 'Cocos 深度学习你不会错过的实战',

num: 590

},

\]

// 1.根据数据的个数创建对应的li

const ul = document.querySelector('ul')

for (let i = 0; i < data.length; i++) {

// 2.创建新的li

const li = document.createElement('li')

ul.appendChild(li)

// 把内容给li

li.innerHTML = `<a href="#">`

   `<img src="${data[i].src}" alt="">`

   `<h4>${data[i].title}</h4>`

   `<div class="info">`

   `<span>高级</span>·<span>${data[i].num}</span>人在学 </div>`

   `</a>`

}

</script>

  

![](../../public/images/feishu/assets/2025-09-02-JS学习-164.png)

false只克隆标签，里边的内容不会克隆过来

```html
    ul.appendChild(ul.children[1].cloneNode(true))
```

#### 3.3.11.4 删除节点

![](../../public/images/feishu/assets/2025-09-02-JS学习-165.png)

父亲删儿子

removeChild是真删除节点了，直接从HTML中删除了；而display: none;只是隐藏起来了盒子，而且还不占位置

### 3.3.12 M端事件

M端就是移动端

![](../../public/images/feishu/assets/2025-09-02-JS学习-166.png)

### 3.3.13 插件

要熟悉官网！！！

https://www.swiper.com.cn/

https://www.swiper.com.cn/demo/index.html

### 3.3.14 学生信息表

1.  对于表单元素，添加事件监听的时候，事件类型应当为submit，即给form标签添加事件监听，事件类型为submit
    
2.  提交表单的时候不能跳转刷新，应当使用阻止跳转 e.preventDefault() 点任何地方都不可以跳转
    
3.  在提交信息之后内容填写的内容应当清空，清空的操作(this就是指的form,因为是对它添加的事件监听)：this.reset()
    
4.  用好表单元素自带的属性，value,name等
    
5.  删除操作的时不要删DOM节点，删除的是数组中的数据，要使用的是自定义属性，让它自己生成，循环的时候加上自定义属性
    
6.  不要忘记事件对象
    
7.  selecte选择标签，里边的option的value一定要写，不然通过.value的形式获取不到值
    
8.  表单元素不要具备记录标签，就是过段事件点击填写，不显示上次输入的内容：给form的属性autocomplete设为off，这个属性两个值，on是记录，off是不记录
    

结构：

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
  <title>学生信息管理</title>
  <link rel="stylesheet" href="css/index.css" />
</head>

<body>
  <h1>新增学员</h1>
  <form class="info" autocomplete="off">
    姓名：<input type="text" class="uname" name="uname" />
    年龄：<input type="text" class="age" name="age" />
    性别:
    <select name="gender" class="gender">
      <option value="男">男</option>
      <option value="女">女</option>
    </select>
    薪资：<input type="text" class="salary" name="salary" />
    就业城市：<select name="city" class="city">
      <option value="北京">北京</option>
      <option value="上海">上海</option>
      <option value="广州">广州</option>
      <option value="深圳">深圳</option>
      <option value="曹县">曹县</option>
    </select>
    <button class="add">录入</button>
  </form>

  <h1>就业榜</h1>
  <table>
    <thead>
      <tr>
        <th>序号</th>
        <th>姓名</th>
        <th>年龄</th>
        <th>性别</th>
        <th>薪资</th>
        <th>就业城市</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <!-- 
        <tr>
          <td>1001</td>
          <td>欧阳霸天</td>
          <td>19</td>
          <td>男</td>
          <td>15000</td>
          <td>上海</td>
          <td>
            <a href="javascript:">删除</a>
          </td>
        </tr> 
        -->
    </tbody>
  </table>
  <script>
    // 获取元素
    const uname = document.querySelector('.uname')
    const age = document.querySelector('.age')
    const gender = document.querySelector('.gender')
    const salary = document.querySelector('.salary')
    const city = document.querySelector('.city')
    const tbody = document.querySelector('tbody')

    // 获取所有带有name属性的元素
    const items = document.querySelectorAll('[name]')
    // 声明一个空的数组
    const arr = []
    // 1.录入模块
    // 1.1这是一个表单提交事件
    const info = document.querySelector('.info')
    info.addEventListener('submit', function (e) {
      // 阻止默认行为，点击按钮之后不进行跳转
      e.preventDefault()
      // console.log(11)

      // 这里进行表单验证  如果不通过,直接添加中断,不需要添加数据
      // 先遍历循环
      for (let i = 0; i < items.length; i++) {
        if (items[i].value === '') {
          return alert('输入内容不能为空')
        }
      }

      // 创建新的对象
      const obj = {
        stuID: arr.length + 1,
        uname: uname.value,
        age: age.value,
        gender: gender.value,
        salary: salary.value,
        city: city.value
      }
      // console.log(obj);
      // 追加到数组里面
      arr.push(obj)
      // console.log(arr);
      // 清空表单  reset重置表单
      this.reset()
      // 调用渲染函数
      render()
    })
    // 2.渲染函数(因为增加和删除都需要渲染)
    function render() {
      // 先清空tbody,把最新数组里面的数据渲染完毕
      tbody.innerHTML = ''
      // 遍历数组
      for (let i = 0; i < arr.length; i++) {
        const tr = document.createElement('tr')
        tr.innerHTML = `
        <td>${arr[i].stuID}</td>
          <td>${arr[i].uname}</td>
          <td>${arr[i].age}</td>
          <td>${arr[i].gender}</td>
          <td>${arr[i].salary}</td>
          <td>${arr[i].city}</td>
          <td>
            <a href="javascript:" data-id=${i}>删除</a>
          </td> 
          `
        // 追加元素 父元素.appendChild(子元素)
        tbody.appendChild(tr)
      }
    }

    // 3.删除委托
    // 3.1 事件委托 tbody
    tbody.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        // 得到当前元素的自定义属性 data-id
        // console.log(e.target.dataset.id);
        // 删除arr 数组里面对应的数据
        arr.splice(e.target.dataset.id, 1)
        // 重新渲染一次
        render()
      }
    })
  </script>

</body>

</html>
```

样式：

```yaml
* {
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
  color:#721c24;
}
h1 {
  text-align: center;
  color:#333;
  margin: 20px 0;
 
}
table {
  margin:0 auto;
  width: 800px;
  border-collapse: collapse;
  color:#004085;
}
th {
  padding: 10px;
  background: #cfe5ff;
  
  font-size: 20px;
  font-weight: 400;
}
td,th {
  border:1px solid #b8daff;
}
td {
  padding:10px;
  color:#666;
  text-align: center;
  font-size: 16px;
}
tbody tr {
  background: #fff;
}
tbody tr:hover {
  background: #e1ecf8;
}
.info {
  width: 900px;
  margin: 50px auto;
  text-align: center;
}
.info  input, .info select {
  width: 80px;
  height: 27px;
  outline: none;
  border-radius: 5px;
  border:1px solid #b8daff;
  padding-left: 5px;
  box-sizing: border-box;
  margin-right: 15px;
}
.info button {
  width: 60px;
  height: 27px;
  background-color: #004085;
  outline: none;
  border: 0;
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
}
.info .age {
  width: 50px;
}
```

思路：

![](../../public/images/feishu/assets/2025-09-02-JS学习-167.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-168.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-169.png)

### 3.3.15 重绘回流

![](../../public/images/feishu/assets/2025-09-02-JS学习-170.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-171.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-172.png)

## 3.4 BOM

![](../../public/images/feishu/assets/2025-09-02-JS学习-173.png)

平时写的document省略了window而已，实际上是window.document

函数也是这样，调用的时候实际为window.fn()

var声明标量也是这样的，const和let是挂载在自己的作用域内，所以如果写：const num=10 console.log(window.num)会输出undefined

window大部分情况下可以省略

### 3.4.1 定时器-延时函数

只执行一次

![](../../public/images/feishu/assets/2025-09-02-JS学习-174.png)

某些特殊情况下，如递归函数中，我需要自己调用自己，此时就需要清除一下延时函数了

![](../../public/images/feishu/assets/2025-09-02-JS学习-175.png)

### 3.4.2 JS执行机制

![](../../public/images/feishu/assets/2025-09-02-JS学习-176.png)

两个的结果都是1111 3333 2222

![](../../public/images/feishu/assets/2025-09-02-JS学习-177.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-178.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-179.png)

总结：同步任务是立马可以执行的，异步是需要事件的

工作流程：

![](../../public/images/feishu/assets/2025-09-02-JS学习-180.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-181.png)

js只能进行单线程的操作，右边部分是浏览器操作，在浏览的作用下可以实现多线程任务

由于主线程不断的重复获得任务、执行任务、再获取任务、再执行，所以这种机制被称为事件循环（ event loop）

### 3.4.3 location对象

location对象属于window这个全局对象下的，可以 省略window

![](../../public/images/feishu/assets/2025-09-02-JS学习-182.png)

href可以跳转页面

1.  search:在表单中提交信息之后,上边的网址后面会包含自己的信息
    

search得到提交信息之后网站后边的地址

![](../../public/images/feishu/assets/2025-09-02-JS学习-183.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-184.png)

2.  hash:这个获取单页面应用#后边的地址
    

如下,点击我的音乐等按钮,浏览器不会刷新,只是刷新下边的内容,此时网站后边的地址为#

![](../../public/images/feishu/assets/2025-09-02-JS学习-185.png)

  

  

```xml
  <a href="#/my">我的</a>
  <a href="#/friend">关注</a>
  <a href="#/download">下载</a>
```

就是当时候提前写好每部分,一点就会换过来写好的这部分,浏览器不会刷新,在vue中会详细说明

3.  reload 类似于浏览器中点击F5,进行刷新操作,它是个方法!!! 用的时候要加()
    
      强制刷新是从在线重新获取数据(ctrl+f5) location.reload(true)
    
      刷新是从本地获取数据 (f5) location.reload(false)
    

### 3.4.5 navigator对象

![](../../public/images/feishu/assets/2025-09-02-JS学习-186.png)

```javascript
// 检测 userAgent（浏览器信息） 
!(function () { 
const userAgent = navigator.userAgent 
// 验证是否为Android或iPhone 
const android = userAgent.match(/(Android);?[\s\/]+([\d.]+)?/) 
const iphone = userAgent.match(/(iPhone\sOS)\s([\d_]+)/) 
// 如果是Android或iPhone，则跳转至移动站点 
if (android || iphone) { 
location.href = 'http://m.itcast.cn' 
} 
})()
```

### 3.4.6 histroy对象

![](../../public/images/feishu/assets/2025-09-02-JS学习-187.png)

浏览器地址的前进与后退!!!

history.back() 等效于 history.go(-1)

history.forward() 等效于 history.go(1)

## 3.5 本地存储

1.  数据存储在用户浏览器中
    
2.  设置、读取方便、甚至页面刷新不丢失数据
    
3.  容量较大，sessionStorage和localStorage约 5M 左右
    

### 3.5.1 本地存储分类- localStorage

只能存储字符串

![](../../public/images/feishu/assets/2025-09-02-JS学习-188.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-189.png)

键值对要加引号,不然就会当变量来看了

localStorage.setItem('uname', 'pink')

刷新之后信息不再丢失

  

操作key,value会跟着变

删除只删除键就可以,即名字

  

localStorage.setItem('uname', 'pink')

改:

localStorage.setItem('uname','red')

有这个键就是改,没有这个键就是改

![](../../public/images/feishu/assets/2025-09-02-JS学习-190.png)

这个是全部删除,但是如果代码没有改动的话,一刷新,这些数据又都会存储在这里边,在测试中使用:

![](../../public/images/feishu/assets/2025-09-02-JS学习-191.png)

本地存储只能存储字符串,在存储数据时,文字必须使用引号,不然字母会被看成变量,数字可以不加引号,但是本地存储之后都会变成字符串

### 3.5.2 本地存储分类- sessionStorage

相比于localStorage来说,关闭浏览器就会消失,但是localStorage关闭浏览器是不会消失的

特性:

1.  生命周期为关闭浏览器窗口
    
2.  在同一个窗口(页面)下数据可以共享
    
3.  以键值对的形式存储使用
    
4.  用法跟localStorage 基本相同
    

### 3.5.3 存储复杂数据类型

本地只能存储字符串,无法直接存储复杂数据类型

```xml
<script>
    const obj = {
      uname: 'pink老师',
      age: 18,
      gender: '女'
    }
    // 存储复杂数据类型
    localStorage.setItem('obj', obj)
  </script>
```

![](../../public/images/feishu/assets/2025-09-02-JS学习-192.png)

如果获取一下数据:

log(localStorage.getItem('obj'))

![](../../public/images/feishu/assets/2025-09-02-JS学习-193.png)

发现直接存对象是使用不了的!!!

#### 3.5.3.1 复杂对象转化为JSO字符串

![](../../public/images/feishu/assets/2025-09-02-JS学习-194.png)

```html
<script>
    const obj = {
      uname: 'pink老师',
      age: 18,
      gender: '女'
    }
    // 存储复杂数据类型
  localStorage.setItem('obj', JSON.stringify(obj))
  console.log(localStorage.getItem('obj'))
  </script>
  
  输出:{"uname":"pink老师","age":18,"gender":"女"}
  类型是字符串的
  JSON对象 属性和值有引号,而且引号统一是双引号
```

#### 3.5.3.2 JSON字符串转化为对象

![](../../public/images/feishu/assets/2025-09-02-JS学习-195.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-196.png)

```xml
  <script>
    const obj = {
      uname: 'pink老师',
      age: 18,
      gender: '女'
    }
    // 1.存储复杂数据类型
    // localStorage.setItem('obj', obj)
    // console.log(localStorage.getItem('obj'))
    // 2.复杂数据类型存储必须转换为JSON字符串存储
    localStorage.setItem('obj', JSON.stringify(obj))
    // 取
    // console.log(typeof localStorage.getItem('obj'))
    console.log(JSON.parse(localStorage.getItem('obj')))
  </script>
```

![](../../public/images/feishu/assets/2025-09-02-JS学习-197.png)

### 3.5.6 数组map方法

map多和join一起使用，使用map，将原数组的内容给小盒子，然后遍历完得到好多小盒子（就是小盒子填上了内容），这些小盒子就作为元素添加到了新的数组中，新的数组使用join的方法，比如新数组叫newArr，然后新数组newArr.join(''),元素之间不再有分隔符，转为了一个字符串塞给了大盒子，就可以实现对大盒子的填充

![](../../public/images/feishu/assets/2025-09-02-JS学习-198.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-199.png)

**map 也称为映射。** 映射是个术语，指两个元素的集之间元素相互“对应”的关系

map有返回值，但是forEach没有返回值

map是个方法。用的时候要加 ()

map返回的是一个数组

### 3.5.7 数组中join方法

![](../../public/images/feishu/assets/2025-09-02-JS学习-200.png)

类似于python中拼接字符串一样！

1.  小括号为空则逗号分开
    
2.  小括号为空字符串 ''，则元素之间没有分隔符
    
3.  小括号用啥符号就用进行分割
    

### 3.5.8 学生就业统计表本地存储

1.  记住本地时间获取快速方式：new Date().toDateString()
    
2.  尽量减少DOM操作，用好map+join的渲染方式
    
3.  输入内容为空不执行，可以使用！,获取输入的内容，!输入的内容 如果输入了字，那这个字符串的非为假，放到if语句中就不执行，如果没有输入字，那么输入的字符串的非为真，就去执行if语句
    
4.  return可以实现函数的结束
    
5.  禁止跳转是 preventDefault() 不要忘记
    

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    * {
      padding: 0;
      margin: 0;
    }

    h2 {
      text-align: center;
      margin-top: 20px;
    }

    .info {
      width: 700px;
      margin: 10px auto;
      text-align: center;
    }

    .uname,
    .age,
    .salary {
      width: 100px;
      height: 20px;
      outline: none;
      margin-right: 15px;
    }

    .gender,
    .city {
      width: 100px;
      height: 25px;
      outline: none;
      margin-right: 15px;
      border: 1px solid rgb(200, 197, 197);
    }

    button {
      height: 25px;
      width: 75px;
      background-color: rgb(126, 187, 36);
      color: #fff;
      border: 0;
    }

    button span {
      display: inline-block;
      width: 10px;
      height: 10px;
      line-height: 11px;
      border: 1px solid #fff;
      border-radius: 5px;
      margin-right: 1px;
    }

    .total {
      width: 800px;
      height: 40px;
      line-height: 40px;
      text-align: right;
      margin: 40px auto 10px;
      padding-right: 10px;
      font-size: 13px;
      background-color: rgb(237, 235, 235);
      box-sizing: border-box;
    }

    .total span {
      color: red;
    }

    table {
      width: 800px;
      margin: auto;
      border-collapse: collapse;
    }

    th {
      background-color: rgb(237, 235, 235);
    }

    th,
    td {
      height: 35px;
      text-align: left;
      font-size: 14px;
      border: 1px solid rgb(228, 225, 225);
      padding-left: 5px;
      transition: all linear 0.5s;
    }

    tbody tr:hover {
      background-color: rgb(237, 235, 235);
      cursor: pointer;
    }

    tbody tr td a {
      display: block;
      width: 60px;
      height: 25px;
      line-height: 25px;
      margin-top: 2px;
      color: #fff;
      text-align: center;
      text-decoration: none;
      background-color: orange;
      border-radius: 12.5px;
    }
  </style>
</head>

<body>
  <h2>学生就业统计表</h2>
  <form class="info" autocomplete="off">
    <input type="text" name="uname" placeholder="姓名" class="uname">
    <input type="text" name="age" placeholder="年龄" class="age">
    <input type="text" name="salary" placeholder="薪资" class="salary">
    <select name="gender" id="" class="gender">
      <option value="男">男</option>
      <option value="女">女</option>
    </select>
    <select name="city" id="" class="city">
      <option value="北京">北京</option>
      <option value="上海">上海</option>
      <option value="广州">广州</option>
      <option value="深圳">深圳</option>
      <option value="曹县">曹县</option>
    </select>
    <button>
      <span>+</span>添加</button>
  </form>
  <div class="total">共有数据 <span>0</span> 条</div>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>姓名</th>
        <th>年龄</th>
        <th>性别</th>
        <th>薪资</th>
        <th>就业城市</th>
        <th>录入时间</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <!-- <tr>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>
          <a href="#" data-id=""></a>
        </td>
      </tr> -->
    </tbody>
  </table>
  <script>
    // const initData = [{
    //   unameId: 1,
    //   uname: '华晨宇',
    //   age: 22,
    //   salary: 12000,
    //   gender: '男',
    //   city: '北京',
    //   time: '2099/9/9 08:08:08'
    // }]
    // localStorage.setItem('data', JSON.stringify(initData))
    // 1.渲染业务
    // 1.1 先读取本地存储的数据
    // (1) 本地存储有数据记得转换为对象然后存储到变量里面，后期用于渲染页面
    // (2) 如果没有数据，则用空数组来代替

    // 下面这句话意思是去本地存储读取最新的数据
    // const arr = JSON.parse(localStorage.getItem('data')) || []
    const arr = []
    console.log(arr)

    // 时间函数
    function getTime() {
      const date = new Date()
      const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      const m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      const str = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${h}:${m}:${s}`
      return str
    }
    // 渲染函数
    const tbody = document.querySelector('tbody')
    function render() {
      // (1) 利用map遍历数组，返回对应tr的数组
      // map遍历的是数组，这里里边存的都是对象，所以ele就是代表里边的对象
      const trArr = arr.map(function (ele, index) {
        return `
      <tr>
        <td>${ele.unameId}</td>
        <td>${ele.uname}</td>
        <td>${ele.age}</td>
        <td>${ele.gender}</td>
        <td>${ele.salary}</td>
        <td>${ele.city}</td>
        <td>${ele.time}</td>
        <td>
          <a href="#" data-id="${index}">删除</a>
        </td>
      </tr>
  `
      })
      console.log(trArr)

      // (2) 把数组转换为字符串join
      // (3) 把生成的字符串追加给tobody
      tbody.innerHTML = trArr.join('')
      // 显示共有几条
      document.querySelector('.total span').innerHTML = arr.length
    }
    // render()

    // 获取DOM对象
    const info = document.querySelector('.info')
    const uname = document.querySelector('.uname')
    const age = document.querySelector('.age')
    const salary = document.querySelector('.salary')
    const gender = document.querySelector('.gender')
    const city = document.querySelector('.city')

    // form表单注册提交事件，阻止默认行为
    info.addEventListener('submit', function (e) {
      // 禁止浏览器跳转
      e.preventDefault()
      // 非空判断
      // !代表取反的意思，输入的是字符串，如果输入了内容，字符串就是真，取反之后就为假
      // 就不执行if语句，如果没输入取反就为真，就执行了if语句，表示信息输入不全
      if (!uname.value || !age.value || !salary.value) {
        return alert('输入内容不能为空')
      }
      arr.push({
        // 这里是push，给数组添加对象，原来的数组如果只有一个对象的话，数组长度为1，
        // 在加上现在这个对象，数组里边的对象就有两个了，数组长度为2，所以新加的这个
        // 对象的序号应为数组长度+1
        // unameId: arr.length + 1,

        // 因为是push  元素从数组的最后边添加，如果按照上边按照数组长度的方式来计算的话会出现图中两个数据ID分别为1，2
        // 删除1后，在添加一个数据，此时就都为2，2了
        // 必须进行判断，因为当全删除之后，就没有数据了，就不能通过数组中最后元素的unameId来获取了，此时直接给它赋值为1就可以
        // 0当假看
        unameId: arr.length ? arr[arr.length - 1].unameId + 1 : 1,
        uname: uname.value,
        age: age.value,
        salary: salary.value,
        gender: gender.value,
        city: city.value,
        // 这里的时间可以不去封装函数，直接使用toLocaleString()方法
        // time: new Date().toDateString()
        time: getTime()
      })
      // 渲染页面和重置表单 （reset()方法）
      render()
      this.reset() //重置表单
      // 把数据重新存放在本地存储里面，记得转换为JOSN字符串存储
      localStorage.setItem('data', JSON.stringify(arr))
    })

    // 3.删除业务
    // 3.1 采取事件委托的形式，给body注册点击事件
    tbody.addEventListener('click', function (e) {
      // 判断是否点击的是删除按钮
      if (e.target.tagName === 'A') {
        // alert(1)
        // 3.2 得到当前点击的索引号。渲染数据的时候，动态给a链接添加自定义属性例如data-id='0'
        // console.log(e.target)
        // 3.3 根据索引号，利用splice删除数组这条数据

        // 确认框，确然是否真的要删除
        // confirm()为确认框
        // confirm会返回两个值，如果点击确定，就会返回true，如果点击取消，就会返回false
        if (confirm('您确定要删除这条数据吗？')) {
          arr.splice(e.target.dataset.id, 1)
          // 3.4 重新渲染页面
          render()
          // 3.5 把最新arr数组存到本地存储
          localStorage.setItem('data', JSON.stringify(arr))
        }
      }

    })

  </script>
</body>

</html>
```

## 3.6 正则表达式

正则表达式（Regular Expression）是用于匹配字符串中字符组合的模式。在 JavaScript中，正则表达式也是对

象，通常用来查找、替换那些符合正则表达式的文本，许多语言都支持正则表达式。

正则表达式的作用：

*   表单验证（ **匹配** ）
    
*   过滤敏感词（ **替换** ）
    
*   字符串中提取我们想要的部分（ **提取** ）
    

### 3.6.1 语法

正则表达式使用步骤：

1.  定义规则
    
2.  查找是否匹配
    

正则表达式里边不需要写引号

![](../../public/images/feishu/assets/2025-09-02-JS学习-201.png)

记忆方法：先有规则，再有在看后边的数据是否可以与前边规则匹配

reg.test(str)

![](../../public/images/feishu/assets/2025-09-02-JS学习-202.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-203.png)

### 3.6.2 元字符

1.  普通字符：大多数的字符仅能够描述它们本身，这些字符称作普通字符，例如所有的字母和数字。也就是说普通字符只能够匹配字符串中与它们相同的字符。
    
2.  元字符（特殊字符）：是一些具有特殊含义的字符，可以极大提高了灵活性和强大的匹配功能。
    
3.  比如，规定用户只能输入英文26个英文字母，普通字符的话 abcdefghijklm….. 但是换成元字符写法： \[a-z\]
    
4.  正则验证工具：https://tool.oschina.net/regex
    
5.  分类：边界符（表示位置，开头和结尾，必须用什么开头，用什么结尾）、量词（（表示重复次数）、字符类（比如 \\d 表示 0~9）
    

#### 3.6.2.1 边界符

![](../../public/images/feishu/assets/2025-09-02-JS学习-204.png)

console.log(/^哈$/.test('哈哈')) //false 加上量词之后会true

只有console.log(/^哈$/.test('哈'))这样才会true，开头结尾都写的话就是精准匹配

  

只匹配一次

两个其中一个来进行匹配的话，可以使用| ：/我是|它会/

#### 3.6.2.2 量词

![](../../public/images/feishu/assets/2025-09-02-JS学习-205.png)

console.log(/^哈\*$/.test('哈好哈')) //false，只允许里边只允许有哈，不允许出现任何其他字符

#### 3.6.2.3 元字符

![](../../public/images/feishu/assets/2025-09-02-JS学习-206.png)

匹配的是a或b或c \[\]只选一个

![](../../public/images/feishu/assets/2025-09-02-JS学习-207.png)

qq号是从1开始的，第一个为1-9已经进行匹配完成了，从第二位开始0-9都可以了，大括号{}只重复前边离他最近的那个字符，{}就近原则

![](../../public/images/feishu/assets/2025-09-02-JS学习-208.png)

（2）. 匹配除换行符之外的任何单个字符，除了换行都行

![](../../public/images/feishu/assets/2025-09-02-JS学习-209.png)

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <script>
    // 元字符中
    console.log(/哈/.test('哈'))  //true
    console.log(/哈/.test('哈哈'))  //true
    console.log(/哈/.test('二哈'))   //true

    // 1.边界符
    console.log(/^哈/.test('哈'))  //true
    console.log(/^哈$/.test('哈哈'))  //false
    // 2.量词
    // 量词 * 类似于 >= 0
    console.log(/^哈*$/.test('哈哈'))  //true
    console.log(/^哈*$/.test('二哈好傻'))  //false 必须以哈开头或结尾
    console.log(/^哈*$/.test('哈好哈'))   //false，只允许里边只有哈，不允许出现任何其他字符

    // +类似于>=1
    console.log(/^哈+$/.test('哈哈'))  //true
    console.log(/^哈+$/.test('二哈好傻'))  //false 必须以哈开头或结尾
    console.log(/^哈+$/.test('哈好哈'))   //false

    // ?类似于0次或一次
    console.log(/^哈？$/.test(''))   //true
    console.log(/^哈?$/.test('哈哈'))  //false
    console.log(/^哈?$/.test('二哈好傻'))  //false 必须以哈开头或结尾
    console.log(/^哈?$/.test('哈好哈'))  //false

    // {n}写几，就必须出现几次
    console.log(/^哈{4}$/.test('哈哈哈哈')) //true

    // {n,}大于等于n次
    console.log(/^哈{4,}$/.test('哈哈哈哈')) //true
    console.log(/^哈{4,}$/.test('哈哈哈哈哈')) //true

    // 重复{n,m} 重复n到m次，逗号两侧不能有空格
    console.log(/^哈{4,6}$/.test('哈哈哈哈')) //true
    console.log(/^哈{4,6}$/.test('哈哈哈哈哈')) //true
    console.log(/^哈{4,6}$/.test('哈哈哈哈哈哈哈')) //false

    // 3.字符类 [abc] 只选一个字符
    console.log(/^[abc]$/.test('a'))  //true
    console.log(/^[abc]$/.test('b'))  //true
    console.log(/^[abc]$/.test('c'))  //true
    console.log(/[abc]/.test('ab'))  //true
    console.log(/^[abc]$/.test('ab'))  //false     不加精确匹配，就是true
    console.log(/^[abc]{2}$/.test('ab'))  //true   可以选两个
    console.log(/^[a-z]$/.test('p'))   //true   依然只能选一个
    console.log(/^[A-Z]$/.test('p'))   //false
    console.log(/^[A-Z]$/.test('P'))   //true
    console.log(/^[0-9]$/.test('0'))   //true
    console.log(/^[a-zA-Z0-9]$/.test('p'))  //true
  </script>
</body>

</html>
```

#### 3.6.2.4 修饰符

![](../../public/images/feishu/assets/2025-09-02-JS学习-210.png)

replace是个方法，使用的时候一定不要忘记括号()

![](../../public/images/feishu/assets/2025-09-02-JS学习-211.png)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <script>
    console.log(/^java$/.test('java')) //true
    console.log(/^java$/.test('Java')) //false
    // 不区分大小写、
    console.log(/^java$/i.test('Java')) //true
    const str = 'java是一门编程语言，学完java工资很高'
    const result = str.replace(/java/ig, '前端')
    console.log(result)
  </script>
</body>
</html>
```

