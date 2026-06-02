---
title: 4.js进阶
description: 
---


# 4.js进阶

这部分是对es6的新特性和es7,es8等的描述，统称为es6+

## 4.1 作用域

### 4.1.1 局部作用域

![](/images/feishu/assets/2025-09-02-JS学习-212.png)

![](/images/feishu/assets/2025-09-02-JS学习-213.png)

*   函数作用域在函数内部
    
*   块级作用域在{}
    
*   对象的那个{}不是作用域，不是块作用域
    

### 4.1.2 全局作用域

![](/images/feishu/assets/2025-09-02-JS学习-214.png)

window.a=10不要这样写

### 4.1.3 作用域链

变量查找机制

![](/images/feishu/assets/2025-09-02-JS学习-215.png)

## 4.2 垃圾回收机制

### 4.2.1 大体介绍

垃圾回收机制(Garbage Collection) 简称 GC

![](/images/feishu/assets/2025-09-02-JS学习-216.png)

内存泄漏：程序中分配的内存由于某种原因程序未释放或无法释放叫作泄露

### 4.2.2 JS垃圾回收机制算法说明

堆栈空间分配区别：

1.  栈（操作系统）: 由操作系统自动分配释放函数的参数值、局部变量等，基本数据类型放到栈里面。
    
2.  堆（操作系统）: 一般由程序员分配释放，若程序员不释放，由垃圾回收机制回收。复杂数据类型放到堆里面。
    

目前常见的浏览器垃圾回收算法: 引用计数法 和 标记清除法

#### 4.2.2.1 引用计数

![](/images/feishu/assets/2025-09-02-JS学习-217.png)

![](/images/feishu/assets/2025-09-02-JS学习-218.png)

如果不写o1.a=o2和o2.a=o1，则函数执行完之后，o1和o2都是局部变量，会自动被系统回收掉，加上这个之后堆内的这两个对象相互指引，引用次数不为0，导致了变量的无法回收，就产生了内存泄漏

#### 4.2.2.2 标记清除法

![](/images/feishu/assets/2025-09-02-JS学习-219.png)

![](/images/feishu/assets/2025-09-02-JS学习-220.png)

这个算法就是全局开始的，找到就是有用，找不到就是没用，就清除

## 4.3 闭包

![](/images/feishu/assets/2025-09-02-JS学习-221.png)

闭包：内层函数+外层函数的变量

![](/images/feishu/assets/2025-09-02-JS学习-222.png)

closure就是闭包

![](/images/feishu/assets/2025-09-02-JS学习-223.png)

内层函数必须包含外层函数的变量才是闭包

![](/images/feishu/assets/2025-09-02-JS学习-224.png)

![](/images/feishu/assets/2025-09-02-JS学习-225.png)

闭包可能会引起内存泄漏

闭包作用：封闭数据，实现数据私有，外部也可以访问函数内部的变量

## 4.4 变量提升

![](/images/feishu/assets/2025-09-02-JS学习-226.png)

![](/images/feishu/assets/2025-09-02-JS学习-227.png)

在代码执行之前，先去检测当前作用域下所有var声明的变量，把所有var声明的变量提到当前作用域的前边，只提升声明，但不提升赋值

## 4.5 函数进阶

### 4.5.1 函数提升

在程序执行之前会把所有函数声明提升到当前作用域的最前面

只提升函数声明，不提升函数调用

<script>

fn()

function fn() {

console.log('函数提升')

}

上方程序在执行前将函数的声明进行了提前，但是不提前调用，然后我们去调用，是没有问题的

fun()

var fun = function () {

console.log('我将报错')

}

这个一个用var声明的变量，赋值等于一个匿名函数，var声明的变量会提前，但赋值不提前，所有在前边调用，此时会报错

</script>

### 4.5.2 函数参数

#### 4.5.2.1 动态参数

![](/images/feishu/assets/2025-09-02-JS学习-228.png)

![](/images/feishu/assets/2025-09-02-JS学习-229.png)

箭头函数里边没有arguments

#### 4.5.2.2 剩余参数

![](/images/feishu/assets/2025-09-02-JS学习-230.png)

![](/images/feishu/assets/2025-09-02-JS学习-231.png)

剩余参数使用的时候不需要写...

剩余参数更加的灵活，我可以在函数括号中写上参数，然后再写...arr，如果是：

  function getSum(a,b,...arr) {

  console.log(11)

  }

  getSum(1,2,3,4)

  将1传给a，2传给b，剩下的传给剩余参数

  getSum(1,2)

  将1传给a，2传给b，剩余参数为一个空数组

![](/images/feishu/assets/2025-09-02-JS学习-232.png)

#### 4.5.2.3 展开运算符与剩余参数的区别

![](/images/feishu/assets/2025-09-02-JS学习-233.png)

![](/images/feishu/assets/2025-09-02-JS学习-234.png)

...arr其实是等价于1,2,3的，这样才可以丢给Math对象来求最值

  

展开运算符可以用于数组之间的合并：

const arr1 = \[1, 2, 3\]

const arr2 = \[3, 4, 5\]

const arr = \[...arr1, ...arr2\]

console.log(arr) //输出\[1,2,3,3,4,5\]

  

剩余参数：函数参数使用，得到真数组

展开运算符：数组中使用，数组展开

### 4.5.3 箭头函数

#### 4.5.3.1 语法基本介绍

箭头函数不是为了替代以前的函数，不是意味着以前的函数不再写了，箭头函数是为了替代原来需要匿名函数的地方

它不是万能的！！！

箭头函数在vue中用的非常多，必须保证百分百会！！！

![](/images/feishu/assets/2025-09-02-JS学习-235.png)

注意点：

① 只有一个形参的时候，可以省略小括号：

const fn=x=>{console.log(x)}

② 只有一行代码时可以省略大括号：

const fn=x=>console.log(11)

③ 如果函数有返回值的话，如果只有一行代码的话return可以省略，大括号也可以省略，写在一行中：

const fn=x=>x+x

④ 没有参数或者两个参数及以上的都不可以省去括号

⑤ 阻止表单默认提交：

const form = document.querySelector('form')

form.addEventListener('click', ev => ev.preventDefault())

⑤ 箭头函数可以直接返回一个对象，理解为自带return的：

const fn=uname=>({uname:uname})

对象是需要大括号的，函数也有大括号，函数的大括号和对象大括号冲突了，所以将对象用小括号进行包住，这个等价会有一个返回值

![](/images/feishu/assets/2025-09-02-JS学习-236.png)

![](/images/feishu/assets/2025-09-02-JS学习-237.png)

![](/images/feishu/assets/2025-09-02-JS学习-238.png)

一定不要忘记用()，有()就理解为自带return

#### 4.5.3.2 箭头函数参数

箭头函数是没有动态参数的arguments

![](/images/feishu/assets/2025-09-02-JS学习-239.png)

#### 4.5.3.3 箭头函数this

总结：

1.  可以理解为箭头函数中this值就看它父亲的this的指向
    
2.  事件回调函数使用箭头函数时，this 为全局的 window
    
3.  DOM事件回调函数最好不要使用箭头函数，尤其是需要用到this的时候
    

![](/images/feishu/assets/2025-09-02-JS学习-240.png)

```xml
  <script>
    // 1.以前this的指向：谁调用的这个函数，this就指向谁
    console.log(this) //指向window
    // window.console.log(111)   实际写法，window进行了省略
    function fn() {
      console.log(this)  //指向window
    }
    window.fn()//实际写法，调用时可以省略window

    const obj = {
      name: 'andy',
      sayHai: function () {
        console.log(this)
      }
    }
    obj.sayHai() //this指向obj
    // 2.箭头函数的this
    const fn = () => console.log(this)
  </script>
```

2.箭头函数的this 是上一层作用域的this指向，箭头函数是不会创建自己的this的

const fn = () => console.log(this)

fn() //指向window

// 3.对象方法箭头函数 this

①

const obj = {

uname: 'pink老师',

sayHai: () => console.log(this) //this指向的是window

}

调用对象里边的函数

箭头函数里不会创建自己的this，所以在箭头函数没有this，所以会往这个箭头函数上方去寻找，对象是没有作用域的，上一层的作用域是指向window的，因为obj在这个作用域，也就是说可以看obj的this的指向，指向window，所以这个this指向window，obj实际为window.obj

obj.sayHai()

②

const obj1 = {

uname: 'pink老师',

sayHai: function () {

let i = 10

const count = () => {

console.log(this)

这个this指向的是obj1,箭头函数不会创建this，所以不指向这个作用域的的父亲

也就是count，这个作用域的上层作用域在这个匿名函数中，这个匿名函数的this指向的obj1

}

count()

}

}

obj1.sayHai()

## 4.6 解构赋值

### 4.6.1 数组解构

以前要是使用数组中的值的话：

假设一个数组我存放了3个值，分别为最大值，最小值和平均值，我要使用里边的值的话，我需要再去声明这个常量

const arr=\[100,60,80\]

const max=arr\[0\]

const min=arr\[1\]

const avg=arr\[2\]

要写很多行代码，较为麻烦，所以我们需要用到数组解构

用数组解构的话：const \[max,min,avr\]=\[100,60,80\]

这个写法就类似于上边的那种用很多const的方法

![](/images/feishu/assets/2025-09-02-JS学习-241.png)

```html
①变量之间交换值:
let a=1
let b=2;
必须加这行代码，不然就会报错
[b,a]=[a,b]


可以写成下面的方式：
let a=1
let b=2
;[b,a]=[a,b]

②排序
const arr1 = [2, 6, 4, 3, 5, 1]
for (let i = 0; i < arr1.length; i++) {
   for (let j = 0; j < arr1.length - 1; j++) {
      if (arr1[j] > arr1[j + 1]) {
         [arr1[j + 1], arr1[j]] = [arr1[j], arr1[j + 1]]
       }
   }
}
console.log(arr1)
```

数组解构的细节：

①变量多，单元值少

![](/images/feishu/assets/2025-09-02-JS学习-242.png)

防止出现undefined的方法：

const \[a=0,b=0\] =\[1\]

a为1，b为0；优先执行传过来的参数，没有参数传过来就是用自己的参数

②变量少，单元值多

![](/images/feishu/assets/2025-09-02-JS学习-243.png)

此时可以使用剩余参数来接收多余的值

const \[a,b,...c\]=\[1,2,3,4\]

console.log(c) 输出\[3,4\]

③可以按需导入，忽略某些返回值

![](/images/feishu/assets/2025-09-02-JS学习-244.png)

④支持多维数组的结构

```cpp
const arr = [1, 2, [3, 4]]
console.log(arr[0])  //1
console.log(arr[1])  //2
console.log(arr[2])  //[3,4]
console.log(arr[2][0])  //3
```
```cpp
const [a, b, c] = [1, 2, [3, 4]]
console.log(a)  //1
console.log(b)  //2
console.log(c)  //[3,4]
```
```cpp
const [a, b, [c, d]] = [1, 2, [3, 4]]
console.log(a)  //1
console.log(b)  //2
console.log(c)  //3
console.log(d)  //4
```

### 4.6.2 对象解构

对象解构是将对象属性和方法快速批量赋值给一系列变量的简洁语法

用的非常非常多！！！！！！

#### 4.6.2.1 对象解构的基本用法

基本语法：

1.  赋值运算符 = 左侧的 {} 用于批量声明变量，右侧对象的属性值将被赋值给左侧的变量
    
2.  对象属性的值将被赋值给与属性名相同的变量
    
3.  注意解构的变量名不要和外面的变量名冲突否则报错
    
4.  对象中找不到与变量名一致的属性时变量值为 undefined
    

```html
const obj = {
   uname: 'pink老师',
   age: 18,
}
const { uname, age } = obj
```

上方代码这样写等价于：

const uname等价于obj.uname

变量名可以重新改名：

const uname\='red老师'

const user={

  uname:'pink老师',

  age:18

}

const {uname,age}=user

解构的变量名与全局变量名冲突，此时会报错，解决方案是改解构变量名，因为全局变量名可能有很多代码正在使用，不能改，一改就会影响其他部分，所以要改解构变量名

const {旧变量名：新变量名}=对象

const {uname:username,age}=user

#### 4.6.2.2 数组对象的解构

![](/images/feishu/assets/2025-09-02-JS学习-245.png)

#### 4.6.2.3 多级对象解构

![](/images/feishu/assets/2025-09-02-JS学习-246.png)

```xml
  <script>
    const pig = {
      name: '佩奇',
      family: {
        mother: '猪妈妈',
        father: '猪爸爸',
        sister: '乔治'
      },
      age: 6
    }
    // 多级对象解构
    const { name, family: { mother, father, sister }, age } = pig
  </script>
```

多级对象跟多维数组不同的是，需要指定是哪个对象

```java
    // 这是后台传递过来的数据
    const msg = {
      "code": 200,
      "msg": "获取新闻列表成功",
      "data": [
        {
          "id": 1,
          "title": "5G商用自己，三大运用商收入下降",
          "count": 58
        },
        {
          "id": 2,
          "title": "国际媒体头条速览",
          "count": 56
        },
        {
          "id": 3,
          "title": "乌克兰和俄罗斯持续冲突",
          "count": 1669
        },
      ]
    }
```

1.针对后台的数据，如果我只要data的话，只需要： const {data}=msg

对象里边的属性和方法是无序的，我们只要里边的其中一个值的话，只需要：const{要的那个属性}=对象

//上面msg是后台传递过来的数据，我们需要把data选出当做参数传递给函数 function render(arr) { const { data } = arr // 我们只要 data 数据 // 内部处理 console.log(data) } render(msg) msg是个对象，为实参，arr为形参，上述代码可以实现msg内部的data对象的输出，我们也可以按照下方的形式来写：

function({data}) {

console.log(data)

}

render(msg)

实参传递给形参的时候解构了

这样可以节省空间，放在函数里解构，只有函数调用的时候才会用到，放在外面的话内存就要存好几遍这些数据

2.为了防止msg里面的data名字混淆，要求渲染函数里面的数据名改为 myData

function render({data:mydata}) {

  console.log(data)

}

### 4.6.3 总结代码加分号的情况

有两种情况：一个是数组结构，一个是立即执行函数

1.  如果对一个数组进行遍历，有两种方式：
    

①法1

const arr=\[1,2,3\]

arr.map(function(item,index) {

  console.log(item)

})

![](/images/feishu/assets/2025-09-02-JS学习-247.png)

②法2

const str='pink'

\[1,2,3\].map(function(item,index) {

console.log(item)

})

![](/images/feishu/assets/2025-09-02-JS学习-248.png)

此时会报错

他会认为是const str='pink' \[1,2,3\].map(function(item,index) {

console.log(item)

})

内部会当成这样处理，所以我们用分号进行隔开

## 4.7 遍历数组forEach方法

forEach多和字符串来进行联合使用，使用forEach遍历后加到小盒子中，字符串str+=小盒子，然后将字符串加到大盒子中，大盒子使用innerHTML

可以理解为加强版的for循环

![](/images/feishu/assets/2025-09-02-JS学习-249.png)

里边不写return，不返回数组，只遍历不返回

map是返回数组

forEach主要用于遍历数组对象

```xml
  <script>
    const arr = ['red', 'green', 'pink']
    const result = arr.forEach(function (item, index) {
      console.log(item)
      console.log(index)
    })
    console.log(result)
  </script>
```

![](/images/feishu/assets/2025-09-02-JS学习-250.png)

## 4.8 筛选数组 filter方法

![](/images/feishu/assets/2025-09-02-JS学习-251.png)

只能写比较符，写加号不写任何作用，map中写比较符也不起任何作用，每种方法都有其各自的作用，但是有一点他们两个方法返回的都是新数组

```xml
<body>
  <script>
    const arr = [10, 20, 30]
    const newArr = arr.filter(function (item, index) {
      console.log(item)
      console.log(index)
      return item >= 20
    })
    console.log(newArr)
  </script>
</body>
```

这个也可以写成箭头函数：

```html
const newArr = arr.filter(item => item >= 20)
```

## 4.9 商品列表价格筛选

![](/images/feishu/assets/2025-09-02-JS学习-252.png)

步骤：

①：渲染页面模块

*   初始化需要渲染页面，同时，点击不同的需求，还会重新渲染页面，所以渲染做成一个函数
    
*   用forEach+字符串的形式
    

②：点击不同需求，显示不同页面内容

*   点击采取事件委托方式 .filter
    
*   利用过滤函数 filter 筛选出符合条件的数据，因为生成的是一个数组，传递给渲染函数即可
    
*   筛选条件是根据点击的 data-index 来判断
    
*   可以使用对象解构，把事件对象解构
    
*   因为全部区间不需要筛选，直接把goodList渲染即可
    

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
      box-sizing: border-box;
    }

    .list {
      width: 990px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
    }

    .item {
      width: 240px;
      margin-left: 10px;
      padding: 20px 30px;
      transition: all ease .5s;
      margin-bottom: 20px;
    }

    .item:nth-child(4n) {
      margin-left: 0;
    }

    .item:hover {
      box-shadow: 0px 0px 5px rgba(0, 0, 0, .2);
      transform: translate3d(0, -4px, 0);
      cursor: pointer;
    }

    .item img {
      width: 100%;
    }

    .item .name {
      font-size: 18px;
      margin-bottom: 10px;
      color: #666;
    }

    .item .price {
      font-size: 22px;
      color: firebrick;
    }

    .item .price::before {
      content: '￥';
      font-size: 14px;
    }

    .filter {
      display: flex;
      width: 990px;
      margin: 0 auto;
      padding: 50px 30px
    }

    .filter a {
      padding: 10px 20px;
      background: #f5f5f5;
      color: #666;
      text-decoration: none;
      margin-right: 20px;
    }

    .filter a:focus {
      background-color: #05943c;
      color: #fff;
    }
  </style>
</head>

<body>
  <div class="filter">
    <a href="#" data-index="1">0-100元</a>
    <a href="#" data-index="2">100-300元</a>
    <a href="#" data-index="3">300元以上</a>
    <a href="#">全部区间</a>
  </div>
  <div class="list">
    <!-- <div class="item">
      <img src="" alt="">
      <p class="name"></p>
      <p class="price"></p>
    </div> -->
  </div>
  <script>
    // 2. 初始化数据
    const goodsList = [
      {
        id: '4001172',
        name: '称心如意手摇咖啡磨豆机咖啡豆研磨机',
        price: '289.00',
        picture: 'https://yanxuan-item.nosdn.127.net/84a59ff9c58a77032564e61f716846d6.jpg',
      },
      {
        id: '4001594',
        name: '日式黑陶功夫茶组双侧把茶具礼盒装',
        price: '288.00',
        picture: 'https://yanxuan-item.nosdn.127.net/3346b7b92f9563c7a7e24c7ead883f18.jpg',
      },
      {
        id: '4001009',
        name: '竹制干泡茶盘正方形沥水茶台品茶盘',
        price: '109.00',
        picture: 'https://yanxuan-item.nosdn.127.net/2d942d6bc94f1e230763e1a5a3b379e1.png',
      },
      {
        id: '4001874',
        name: '古法温酒汝瓷酒具套装白酒杯莲花温酒器',
        price: '488.00',
        picture: 'https://yanxuan-item.nosdn.127.net/44e51622800e4fceb6bee8e616da85fd.png',
      },
      {
        id: '4001649',
        name: '大师监制龙泉青瓷茶叶罐',
        price: '139.00',
        picture: 'https://yanxuan-item.nosdn.127.net/4356c9fc150753775fe56b465314f1eb.png',
      },
      {
        id: '3997185',
        name: '与众不同的口感汝瓷白酒杯套组1壶4杯',
        price: '108.00',
        picture: 'https://yanxuan-item.nosdn.127.net/8e21c794dfd3a4e8573273ddae50bce2.jpg',
      },
      {
        id: '3997403',
        name: '手工吹制更厚实白酒杯壶套装6壶6杯',
        price: '100.00',
        picture: 'https://yanxuan-item.nosdn.127.net/af2371a65f60bce152a61fc22745ff3f.jpg',
      },
      {
        id: '3998274',
        name: '德国百年工艺高端水晶玻璃红酒杯2支装',
        price: '139.00',
        picture: 'https://yanxuan-item.nosdn.127.net/8896b897b3ec6639bbd1134d66b9715c.jpg',
      },
    ]

    // 1.渲染函数
    function render(arr) {
      // 声明空字符串
      let str = ''
      // 遍历数组
      arr.forEach(item => {
        const { name, price, picture } = item
        str += `
          <div class="item">
            <img src="${picture}" alt="">
            <p class="name">${name}</p>
            <p class="price">${price}</p>
          </div>
        `
      })
      // 追加给List
      document.querySelector('.list').innerHTML = str
    }
    // 页面一打开就需要渲染
    render(goodsList)
    // 2.过滤筛选
    document.querySelector('.filter').addEventListener('click', e => {
      // 我们需要根据自定属性值来判断点击的哪个小盒子a,即需要获取e.target.dataset.index
      const { tagName, dataset } = e.target
      // 判断
      if (e.target.tagName === 'A') {
        // console.log(11)
        // 创建用于接收新对象的数组，这个新数组直接覆盖掉它就行，或者这边let arr=[]也可以
        // 这里就给goodslist就行，因为如果下边的if不执行的话，我点击全部区间就会生效，因为渲染了个空数组
        let arr = goodsList
        if (dataset.index === '1') {
          arr = goodsList.filter(item => item.price >= 0 && item.price <= 100)
        } else if (dataset.index === '2') {
          arr = goodsList.filter(item => item.price >= 100 && item.price <= 300)
        } else if (dataset.index === '3') {
          arr = goodsList.filter(item => item.price >= 300)
        }
        // 渲染函数
        render(arr)
      }

    })
  </script>
</body>

</html>
```

## 4.10 深入了解对象

### 4.10.1 创建对象

![](/images/feishu/assets/2025-09-02-JS学习-253.png)

这个new Object方法创建对象也是一种函数的形式进行创建的，但是这个写法是写死的，只能这样写，它是系统给我们的创造函数

### 4.10.2 构造函数

**构造函数 ：** 是一种特殊的函数，主要用来初始化对象

**使用场景：** 常规的 {...} 语法允许创建一个对象。比如我们创建了佩奇的对象，继续创建乔治的对象还需要重新写一 遍，此时可以通过构造函数来快速创建多个类似的对象

```html
<script>
//例：
function Pig(name,age,gender) {
    this.name=name
    this.age=age
    this.gender=gender    
}
//创建佩奇对象
const Peppa=new Pig('佩奇',6,'女')
//创建乔治对象
const George=new Pig('乔治',3,'男')
</script>
```

![](/images/feishu/assets/2025-09-02-JS学习-254.png)

![](/images/feishu/assets/2025-09-02-JS学习-255.png)

这里非常重要的点：这里是构造函数来初始化对象， 过一会回来调用Pig，一会要new它，所以this指向的是对象，不是window，this指向的就是对象

无new就是纯函数了，有new说明这个函数是专门用于创建对象的

this.uname=uname 这里的第一uname是属性，第二个uname是形参

在利用对象字面量创建对象和new Object创建对象中都是用的是：不是=

这里用等号是因为：对象.属性=值

①利用对象字面量创建对象

const o={

name:'pink'

} ②利用new Object创建对象

const o=new Object({name:'pink'})

  

构造函数内部不需要写return，构造函数自动返回创建的新的对象

构造函数创建对象的执行过程：

![](/images/feishu/assets/2025-09-02-JS学习-256.png)

### 4.10.3 实例成员

通过构造函数创建的对象称为实例对象，实例对象中的属性和方法称为实例成员

1.  实例对象的属性和方法即为实例成员
    
2.  为构造函数传入参数，动态创建结构相同但值不同的对象
    
3.  构造函数创建的实例对象彼此独立互不影响
    

### 4.10.4 静态成员

![](/images/feishu/assets/2025-09-02-JS学习-257.png)

静态成员有Date.now() Math.PI Math.random()

构造函数理解为一个特殊的对象，给这个对象添加的属性和方法就是静态成员

对象的属性和方法只能该对象使用，该对象方法中的this指向的就是该对象（构造函数）

function Pig(name) n {

this.name=name

}

Pig.eyes=2

Pig.sayHai=function () { console.log(this) }

Pig.sayHai() //指向就是构造函数

console.log(Pig.eyes) //2

总结：

1.  实例对象的属性和方法即为实例成员；实例对象相互独立，实例成员当前实例对象使用
    
2.  静态成员是写在构造函数身上的，构造函数的属性和方法被称为静态成员；静态成员只能函数访问
    
3.  构造函数内部的属性不是静态成员，内部是通过this.属性名=值，它是给实例对象创建的
    
4.  构造函数外部创建的，构造函数名.属性名=值 是静态成员
    
5.  实例对象无法访问静态成员，静态成员只依附在这个构造函数上
    

自己的理解：构造函数可以认为是一个升级版的函数，它就是一个对象

### 4.10.5 内置构造函数

内置构造函数包含：

![](/images/feishu/assets/2025-09-02-JS学习-258.png)

![](/images/feishu/assets/2025-09-02-JS学习-259.png)

这些基本数据类型，js对他们进行了包装

<body>

<script>

// const str = 'pink'

console.log(str.length)

const num = 12

// toFixed()是保留几位小数

console.log(num.toFixed(2))

// 虽然写了const str='pink'

// 但是内部是按照下面的形式进行执行的：

//js底层完成的，把简单数据类型包装为了复杂数据类型，就是把他转化为了对象，就可以直接使用它的属性和方法了，下面这行代码是不需要自己写的

const str = String('pink')

</script>

</body>

#### 4.10.5.1 Object

Object 是内置的构造函数，用于创建普通对象

平时最好还是使用字面量的形式声明对象，而不是使用Object这个这个内置函数

```html
const user=new Object({name:'小明',age:15})
```

三个常用的静态方法：

##### 4.10.5.1.1 Object.keys和Object.values

它是创建对象那个构造函数里边的静态方法，是一个静态成员，使用的时候是函数名.方法（）

![](/images/feishu/assets/2025-09-02-JS学习-260.png)

![](/images/feishu/assets/2025-09-02-JS学习-261.png)

```xml
<body>
  <script>
    const o = { name: 'pink', age: 6 }
    // 获得所有属性名
    const arr = Object.keys(o)
    console.log(arr)
    // 获得所有属性值
    console.log(Object.values(o))
  </script>
</body>
```

##### 4.10.5.1.2 Object. assign

Object.assign(oo,o)

后的东西添加给前 是追加

![](/images/feishu/assets/2025-09-02-JS学习-262.png)

![](/images/feishu/assets/2025-09-02-JS学习-263.png)

```xml
<body>
  <script>
    const o = { name: 'pink', age: 6 }
    // 获得所有属性名
    const arr = Object.keys(o)
    console.log(arr)
    // 获得所有属性值
    console.log(Object.values(o))
    const oo = {}
    Object.assign(oo, o)
    console.log(oo)
    Object.assign(o, { gender: '女' })
    console.log(o)
  </script>
</body>
```

![](/images/feishu/assets/2025-09-02-JS学习-264.png)

#### 4.10.5.2 Array

Array 是内置的构造函数，用于创建数组

这个也是平时最好使用字面量的方式创建数组，而不是使用Array构造函数创建

```html
const arr=new Array(3,5)
console.log(arr)  //[3,5]
```

Array的实例方法，这个方法是实例成员

![](/images/feishu/assets/2025-09-02-JS学习-265.png)

##### 4.10.5.2.1 reduce

![](/images/feishu/assets/2025-09-02-JS学习-266.png)

```xml
<body>
  <script>
    const arr = [1, 5, 8]
    // 1.没有初始值
    const total = arr.reduce(function (prev, current) {
      return prev + current
    })
    console.log(total)   //14
    // 2.有初始值
    const total1 = arr.reduce(function (prev, current) {
      return prev + current
    }, 10)
    console.log(total1)  //14+10=24 最后结果为24

    // 3.箭头函数写法
    const total2 = arr.reduce((prev, current) => prev + current, 10)
    console.log(total2)   //24
  </script>
</body>
```

执行过程：

1.  如果没有起始值，则上一次值以数组的第一个数组元素的值
    
2.  每一次循环，把返回值给作为下一次循环的上一次值
    
3.  如果有起始值，则起始值作为上一次值
    

```xml
<body>
  <script>
    const arr = [1, 5, 8]
    // 1.没有初始值
    const total = arr.reduce(function (prev, current) {
      return prev + current
    })
    console.log(total)   //14
    // 上一次值         当前值           返回值（第一次循环）
    //     1              5                    6
    // 上一次值         当前值           返回值（第二次循环）
    //     6              8                    14
    // 无初始值时，循环次数是比数组长度小一的
    // 2.有初始值
    const total1 = arr.reduce(function (prev, current) {
      return prev + current
    }, 10)
    console.log(total1)  //14+10=24 最后结果为24
    // 上一次值         当前值           返回值（第一次循环）
    //     10             1                     11
    // 上一次值         当前值           返回值（第二次循环）
    //     11             5                    16
    // 上一次值         当前值           返回值（第二次循环）
    //     16             8                    24
    // 有初始值时循环次数就是数组的长度
    // 3.箭头函数写法
    const total2 = arr.reduce((prev, current) => prev + current, 10)
    console.log(total2)   //24
  </script>
</body>
```

##### 4.10.5.2.2 员工涨薪案例

![](/images/feishu/assets/2025-09-02-JS学习-267.png)

```xml
<body>
  <script>
    const arr = [
      { name: '张三', salary: 10000 },
      { name: '李四', salary: 10000 },
      { name: '王五', salary: 10000 }
    ]
    // 如果是个数组对象的话从0开始，起始值设为0，不然从数组第一个开始的话，就是加一个对象了
    // prev是累计值
    const total = arr.reduce((prev, current) => prev + current.salary * 1.3, 0)
    console.log(total)
    // 上一次值        当前值       返回值（第一次遍历）
    //    0       10000*1.3=13000       13000
    // 上一次值        当前值       返回值（第一次遍历）
    //  13000     10000*1.3=13000       26000
    // 上一次值        当前值       返回值（第一次遍历）
    //  26000     10000*1.3=13000       39000
  </script>
</body>
```

##### 4.10.5.2.3 Array的其他方法

![](/images/feishu/assets/2025-09-02-JS学习-268.png)

![](/images/feishu/assets/2025-09-02-JS学习-269.png)

1.  find()
    

循环查找，找到第一个就ok

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global\_Objects/Array/find

```html
const array1 = [5, 12, 8, 130, 44]
const found = array1.find((element) => element > 10)
console.log(found)  //12
```

`find()` 方法是一个[迭代方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array#%E8%BF%AD%E4%BB%A3%E6%96%B9%E6%B3%95)。它按索引升序顺序为数组中的每个元素调用提供的 `callbackFn` 函数，直到 `callbackFn` 返回一个[真值](https://developer.mozilla.org/zh-CN/docs/Glossary/Truthy)。然后 `find()` 返回该元素并停止迭代数组。如果 `callbackFn` 从未返回真值，则 `find()` 返回 `[undefined](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)`

```xml
<body>
  <script>
    const arr = ['red', 'blue', 'green']
    const found = arr.find(item => item === 'pink')
    console.log(found)   //没有，输出undefined

    // 使用场景，用于查找数据
    const arr1 = [
      {
        name: '小米',
        price: 1999
      },
      {
        name: '华为',
        price: 3999
      }
    ]
    // 这小米这个对象，并且返回这个对象
    // const found1 = arr1.find(item => {
    //   if (item.name === '小米') {
    //     return item
    //   }
    // })
    // 另一种写法
    const found1 = arr1.find(item => {
      // 这个return是为了在找到小米之后退出函数，但是这个函数返回的是包含小米的这个对象
      return item.name = '小米'
    })
    console.log(found1)
  </script>
</body>

```

![](/images/feishu/assets/2025-09-02-JS学习-270.png)

上面还可以进一步的省略，写为：const found1 = arr1.find(item => item.name === '小米')

2.  every()返回的是布尔值
    

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global\_Objects/Array/every

filter是筛选之后返回的是数组，every()返回的是筛选后的布尔值

some是只有有一个就没问题

every是必须全是才行

```sql
function isBigEnough(element, index, array) {
  return element >= 10;
}
[12, 5, 8, 130, 44].every(isBigEnough); // false
[12, 54, 18, 130, 44].every(isBigEnough); // true
```
```xml
<body>
  <script>
    // every 每个是否都符合条件，如果都符合返回true，否则返回false
    const arr = [10, 20, 30]
    const flag = arr.every(item => item >= 10)
    console.log(flag)    //true
  </script>
</body>
```
```xml
<body>
  <script>
    // every 每个是否都符合条件，如果都符合返回true，否则返回false
    const arr = [10, 0, 5]
    const flag = arr.some(item => item >= 10)
    console.log(flag)   //true
  </script>
</body>
```

##### 4.10.5.2.4 处理数据案例

![](/images/feishu/assets/2025-09-02-JS学习-271.png)

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    div {
      width: 200px;
      height: 40px;
      line-height: 40px;
      font: 12px;
      text-align: center;
      background-color: pink;
    }
  </style>
</head>

<body>
  <div></div>
  <script>
    const spec = { size: '40cm*40cm', color: '黑色' }
    // const arr = Object.values(spec)
    // document.querySelector('div').innerHTML = arr.join('/')
    document.querySelector('div').innerHTML = Object.values(spec).join('/')
  </script>
</body>

</html>
```

一定要记住Object是内置构造函数，他的那三个方法都是静态方法

##### 4.10.5.2.5 Array.from()方法

静态方法，将伪数组转换为真数组

![](/images/feishu/assets/2025-09-02-JS学习-272.png)

```xml
<body>
  <ul>
    <li></li>
    <li></li>
    <li></li>
  </ul>
  <script>
    const lis = document.querySelectorAll('li')
    const liss = Array.from(lis)
    liss.pop()
    console.log(liss)
  </script>
</body>
```

![](/images/feishu/assets/2025-09-02-JS学习-273.png)

#### 4.10.5.3 String

![](/images/feishu/assets/2025-09-02-JS学习-274.png)

##### 4.10.5.3.1 split()字符串变数组

```xml
<body>
  <script>
    // 把字符串转化为数组
    const str = 'pink,red'
    const arr = str.split(',')
    console.log(arr)
    const str1 = '2025-8-25'
    const arr1 = str1.split('-')
    console.log(arr1)
  </script>
</body>
```

##### 4.10.5.3.2 字符串的截取

语法：

substring(indexStart)

substring(indexStart, indexEnd)

*   如果省略了 `indexEnd`，则 `substring()` 提取字符直到字符串的末尾
    
*   如果 `indexStart` 等于 `indexEnd`，则 `substring()` 返回一个空字符串
    
*   如果 `indexStart` 大于 `indexEnd`，则 `substring()` 的效果就像交换了这两个参数一样
    
*   结束的索引号不包含想要截取的部分
    

```sql
const anyString = "Mozilla";

console.log(anyString.substring(0, 1))  // 'M'
console.log(anyString.substring(1, 0))  // 'M'

console.log(anyString.substring(0, 6))  // 'Mozill'

console.log(anyString.substring(4))  // 'lla'
console.log(anyString.substring(4, 7))   // 'lla'
console.log(anyString.substring(7, 4))  // 'lla'

console.log(anyString.substring(0, 7))  // 'Mozilla'
console.log(anyString.substring(0, 10))  // 'Mozilla'
```

##### 4.10.5.3.3 startsWith

`[String](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)` 的 **`startsWith()`** 方法用来判断当前字符串是否以另外一个给定的子字符串开头，并根据判断结果返回 `true` 或 `false`

```cpp
const str1 = "Saturday night plans"
console.log(str1.startsWith("Sat"))
// Expected output: true
console.log(str1.startsWith("Sat", 3))
// Expected output: false
```
```html
startsWith(searchString)
startsWith(searchString, position)       position指的是第一个字符的索引，默认为0

const str3 = 'pink老师上课中'
console.log(str3.startsWith('pink'))   //true
console.log(str3.startsWith('p'))   //true
```

##### 4.10.5.3.4 includes

includes(searchString) includes(searchString, position)

1.  searchString:
    

一个要在 `str` 中查找的字符串。[不能是正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp#%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E7%9A%84%E7%89%B9%E6%AE%8A%E5%A4%84%E7%90%86)。所有非正则表达式的值都会被[强制转换为字符串](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String#%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%BC%BA%E5%88%B6%E8%BD%AC%E6%8D%A2)，因此如果该参数被省略或传入 `undefined`，`includes()` 方法会在字符串中搜索 `"undefined"`，这通常不是你想要的

2.  `[position 可选](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/includes#position)`:
    

在字符串中开始搜索 `searchString` 的位置。默认值为 `0`

3.  返回值：
    

如果在给定的字符串中找到了要搜索的字符串（包括 `searchString` 为空字符串的情况），则返回 **`true`** ，否则返回 **`false`**

4.  异常：
    

如果 `searchString` [是一个正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp#%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E7%9A%84%E7%89%B9%E6%AE%8A%E5%A4%84%E7%90%86)，则会抛出

只要是有就是true，不需要非得以谁开头结尾

```cpp
const str = "To be, or not to be, that is the question."
console.log(str.includes("To be"))  // true
console.log(str.includes("question"))  // true
console.log(str.includes("nonexistent"))  // false
console.log(str.includes("To be", 1))  // false
console.log(str.includes("TO BE"))  // false
console.log(str.includes(""))  // true
```

##### 4.10.5.3.5 转换为字符串

```xml
<body>
  <script>
    const num = 10
    // 强制转换
    console.log(String(num))
    // toString()方法转换
    console.log(num.toString())
  </script>
</body>
```

##### 4.10.5.3.6 显示赠品练习

![](/images/feishu/assets/2025-09-02-JS学习-275.png)

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <div></div>
  <script>
    const gift = '50g的茶叶，清洗球'
    // 1.把字符串拆分为数组
    // console.log(gift.split(','))
    // 2.根据数组元素的个数生成对应的标签
    const str = gift.split('，').map(item => `<span>【赠品】${item}</span><br>`).join('')
    document.querySelector('div').innerHTML = str
  </script>
</body>

</html>
```

#### 4.10.5.4 Number

![](/images/feishu/assets/2025-09-02-JS学习-276.png)

整数也可以进行toFixed来保留小数

比如：

const price=10

console.log(price.tofixed(2)) //输出：10.00

#### 4.10.5.5 购物车展示

![](/images/feishu/assets/2025-09-02-JS学习-277.png)

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
      box-sizing: border-box;
    }

    .list {
      width: 990px;
      margin: 100px auto;
    }

    .item {
      padding: 15px;
      transition: all ease .5s;
      display: flex;
      border: 1px solid #e4e4e4;
    }

    .item:hover {
      cursor: pointer;
      background-color: #f5f5f5;
    }

    .item img {
      width: 80px;
      height: 80px;
      margin-right: 5px;
    }

    .item .name {
      width: 200px;
    }

    .item .name .tag {
      display: block;
      padding: 2px;
      font-size: 12px;
      color: #999;
    }

    .item .price,
    .item .sub-total {
      font-size: 18px;
      color: firebrick;
      flex: 1;
    }

    .item .price::before,
    .item .sub-total::before,
    .amount::before {
      content: '￥';
      font-size: 12px;
    }

    .item .spec {
      flex: 2;
      color: #888;
      font-size: 14px;
      margin-left: 20px;
    }

    .item .count {
      flex: 1;
      color: #aaa;
    }

    .total {
      width: 990px;
      margin: 0 auto;
      display: flex;
      justify-content: flex-end;
      border-top: 1px solid #4e4e4e;
      padding: 20px;
    }

    .total .amount {
      font-size: 18px;
      color: firebrick;
      font-weight: 700;
      margin-right: 50px;
    }
  </style>
</head>

<body>
  <div class="list">
  </div>
  <div class="total">
    <div>合计：<span class="amount"></span></div>
  </div>
  <script>
    const goodsList = [
      {
        id: '4001172',
        name: '称心如意手摇咖啡磨豆机咖啡豆研磨机',
        price: 289.9,
        picture: 'https://yanxuan-item.nosdn.127.net/84a59ff9c58a77032564e61f716846d6.jpg',
        count: 2,
        spec: { color: '白色' }
      },
      {
        id: '4001009',
        name: '竹制干泡茶盘正方形沥水茶台品茶盘',
        price: 109.8,
        picture: 'https://yanxuan-item.nosdn.127.net/2d942d6bc94f1e230763e1a5a3b379e1.png',
        count: 3,
        spec: { size: '40cm*40cm', color: '黑色' }
      },
      {
        id: '4001874',
        name: '古法温酒汝瓷酒具套装白酒杯莲花温酒器',
        price: 488,
        picture: 'https://yanxuan-item.nosdn.127.net/44e51622800e4fceb6bee8e616da85fd.png',
        count: 1,
        spec: { color: '青色', sum: '一大四小' }
      },
      {
        id: '4001649',
        name: '大师监制龙泉青瓷茶叶罐',
        price: 139,
        picture: 'https://yanxuan-item.nosdn.127.net/4356c9fc150753775fe56b465314f1eb.png',
        count: 1,
        spec: { size: '小号', color: '紫色' },
        gift: '50g茶叶,清洗球'
      }
    ]
    //  1.根据数据渲染页面
    document.querySelector('.list').innerHTML = goodsList.map(item => {
      // 对象解构
      const { picture, name, count, price, spec, gift } = item
      // 规格文字模块处理
      const text = Object.values(spec).join('/')
      // 处理赠品模块
      const str = gift ? gift.split(',').map(item => `<span class="tag">【赠品】${item}</span>`).join('') : ''
      // 计算小计模块，保留两位小数,在计算有关小数的问题时，我们要将其转化为整数，然后再除回去，就可以避免小数计算时精度的问题
      const subtotal = ((price * 100 * count) / 100).toFixed(2)

      return `
        <div class="item">
          <img src="${picture}" alt="">
          <p class="name">${name}${str}</p>
          <p class="spec">${text}</p>
          <p class="price">${price.toFixed(2)}</p>
          <p class="count">x${count}</p>
          <p class="sub-total">${subtotal}</p>
        </div> 
             `
    }).join('')
    // 合计模块   prev为累计值   item为当前元素   为了保证精度也先把它转化为整数计算完再变回去
    const total = goodsList.reduce((prev, item) => prev + (item.price * 100 * item.count) / 100, 0)
    document.querySelector('.amount').innerHTML = total.toFixed(2)
  </script>
</body>

</html>
```

## 4.11 编程思想

### 4.11.1 面向过程介绍

**面向过程** 就是分析出解决问题所需要的步骤，然后用函数把这些步骤一步一步实现，使用的时候再一个一个的依次

调用就可以了

![](/images/feishu/assets/2025-09-02-JS学习-278.png)

### 4.11.2 面向对象

面向对象编程具有灵活、代码可复用、容易维护和开发的优点，更适合多人合作的大型软件项目

![](/images/feishu/assets/2025-09-02-JS学习-279.png)

面向对象的特性：

*   封装性
    
*   继承性
    
*   多态性
    

### 4.11.3 两者比较

![](/images/feishu/assets/2025-09-02-JS学习-280.png)

## 4.12 构造函数回顾

![](/images/feishu/assets/2025-09-02-JS学习-281.png)

![](/images/feishu/assets/2025-09-02-JS学习-282.png)

构造函数在进行实例化创建对象的时候，会先创建一个空的对象，这个空的对象，属性和方法存在堆里，栈里存放存放堆里内容的地址，然后构造函数的this指向新对象；执行构造函数代码，修改this，添加新的属性；返回新对象，这样导致了一个问题，相同的方法在各自的堆里都存了一下，导致了内存的浪费问题

![](/images/feishu/assets/2025-09-02-JS学习-283.png)

## 4.13 原型

### 4.13.1 原型对象的认识

可以解决构造函数有时导致内存浪费问题，实现方法共享

![](/images/feishu/assets/2025-09-02-JS学习-284.png)

![](/images/feishu/assets/2025-09-02-JS学习-285.png)

原型是构造函数的属性，它也是一个对象

公共的属性写在构造函数里边，因为这个属性一会在实例化的时候会赋值

公共的方法写在原型对象身上，这样就可以一起使用了

```xml
<body>
  <!-- 构造函数  公共的属性和方法  封装到构造函数里面了 -->
  <script>
    function Star(uname, age) {
      this.uname = uname,
        this.age = age
      // this.sing = function () {
      //   console.log('唱歌')

      // }
    }
    Star.prototype.sing = function () {
      console.log('唱歌')
    }
    // console.dir(Star.prototype)
    const pink = new Star('pink', 18)
    const red = new Star('red', 20)
    pink.sing()
    console.log(pink.sing = red.sing)   //如果不使用圆型对象就是false，使用之后就是true,现在是true

  </script>
</body>
```

![](/images/feishu/assets/2025-09-02-JS学习-286.png)

```xml
<body>
  <script>
    let that
    function Star(uname) {
      this.uname = uname
      that = this
    }
    // 实例对象是 ldh
    const ldh = new Star('刘德华')
    console.log(that === ldh)    //true   说明构造函数里的this就是实例对象

    Star.sing = function () {
      console.log('唱歌')
    }
    ldh.sing()    //原型对象里的函数this指向的也是实例对象

  </script>
</body>
```

构造函数的this指向的是实例对象；

原型对象的this指向的也是实例对象（因为是实例对象去调用这个方法）

### 4.13.2 数组扩展方法

![](/images/feishu/assets/2025-09-02-JS学习-287.png)

```xml
<body>
  <script>
    // 注意数组不可以直接用min和max求最值
    const arr = [1, 2, 3]
    // 自己定义数组的扩展方法
    // 1.我们定义的这个方法，任何一个数组实例对象都可以使用
    // 2.自定义的方法写到prototype身上
    // ①.最大值
    Array.prototype.max = function () {
      // 使用展开运算符,这里不是剩余运算符   ...为展开运算符
      return Math.max(...this)
      // 原型对象中函数的this指向的是实例对象   这里指向的是arr
    }
    console.log(arr.max())
    // ②最小值
    Array.prototype.min = function () {
      return Math.min(...this)
    }
    console.log(arr.min())
    //③求和
    Array.prototype.sum = function () {
      return this.reduce((prev, current) => prev + current, 0)
    }
    console.log(arr.sum())
    // ③排序
    Array.prototype.rever = function () {
      return this.reverse()
    }
    console.log(arr.rever())

  </script>
</body>
```

![](/images/feishu/assets/2025-09-02-JS学习-288.png)

### 4.13.3 constructor 属性

每个原型对象里面都有个constructor 属性（constructor 构造函数）

![](/images/feishu/assets/2025-09-02-JS学习-289.png)

```xml
<body>
  <script>
    //constructor   单词是构造函数的意思
    function Star() {
    }
    const ldh = new Star()
    console.log(Star.prototype)
    console.log(Star.prototype.constructor === Star)
  </script>
</body>
```

![](/images/feishu/assets/2025-09-02-JS学习-290.png)

问题：如果很多的公共方法的话,那么要写太多了,较为繁琐,所以我们考虑将这些方法塞一个对象中，例：

```xml
  <script>
    //constructor   单词是构造函数的意思
    function Star() {
    }
    // const ldh = new Star()
    // console.log(Star.prototype)
    // console.log(Star.prototype.constructor === Star)

    // 如果很多的公共方法的话,那么要写太多了,较为繁琐
    // Star.prototype.sing = function () {
    //   console.log('唱歌')
    // }
    // Star.prototype.dance = function () {
    //   console.log('跳舞')
    // }
    console.log(Star.prototype)
    Star.prototype = {
      sing: function () {
        console.log('唱歌')
      },
      dance: function () {
        console.log('跳舞')
      }
    }
    console.log(Star.prototype)
  </script>
```

进行输出结果后会发现：

![](/images/feishu/assets/2025-09-02-JS学习-291.png)

将方法塞进这个原型对象中，打印后没有constructor，也就是说这个原型对象是谁的不知道了，因为这里进行了赋值操作，把以前的内容直接给覆盖了，赋值把以前的原型对象给覆盖了，指向了现在自己创建的这个对象了

所以，要重新指回创造这个原型对象的构造函数

```javascript
Star.prototype = {
// 要重新指回创造这个原型对象的构造函数
  constructor: Star,
  sing: function () {
    console.log('唱歌')
   },
   dance: function () {
     console.log('跳舞')
   }
}
```

![](/images/feishu/assets/2025-09-02-JS学习-292.png)

总结1：

如果有多个对象的方法，我们可以给原型对象采取对象形式赋值，但是这样就会覆盖构造函数原型对象原来的内容，这样修改后的原型对象 constructor 就不再指向当前构造函数了

此时，我们可以在修改后的原型对象中，添加一个 constructor 指向原来的构造函数

  

constructor指的是他的来源

![](/images/feishu/assets/2025-09-02-JS学习-293.png)

![](/images/feishu/assets/2025-09-02-JS学习-294.png)

总结2：

![](/images/feishu/assets/2025-09-02-JS学习-295.png)

![](/images/feishu/assets/2025-09-02-JS学习-296.png)

![](/images/feishu/assets/2025-09-02-JS学习-297.png)

### 4.13.4 对象原型

解释实例对象可以访问原型对象里边的方法的问题（解释实例对象如何拿到方法的问题）

对象原型就是\_\_proto\_\_这个属性

![](/images/feishu/assets/2025-09-02-JS学习-298.png)

![](/images/feishu/assets/2025-09-02-JS学习-299.png)

![](/images/feishu/assets/2025-09-02-JS学习-300.png)

![](/images/feishu/assets/2025-09-02-JS学习-301.png)

```xml
<body>
  <script>
    function Star() {
    }
    const ldh = new Star()
    console.log(ldh)
  </script>
</body>
```

\_\_proto\_\_是非标准属性，在浏览器中的写法可能不同，下面是谷歌浏览器的表示方法，最新的浏览器基本上都是使用的下面这种方式，就理解为两个是相同的就可以，这个是只读的，不可以进行修改

原型对象中\[\[Prototype\]\]只是现在大部分浏览器对对象原型的展示，以前浏览器使用的是\_\_proto\_\_，但是要访问这个原型对象的话，还是得使用\_\_proto\_\_

![](/images/feishu/assets/2025-09-02-JS学习-302.png)

理解总结: 对象原型\_\_proto\_\_指向该构造函数的原型对象

对象原型指向原型对象

![](/images/feishu/assets/2025-09-02-JS学习-303.png)

![](/images/feishu/assets/2025-09-02-JS学习-304.png)

![](/images/feishu/assets/2025-09-02-JS学习-305.png)

### 4.13.5 构造函数，对象原型和原型对象总结

![](/images/feishu/assets/2025-09-02-JS学习-306.png)

1.  构造函数通过new的形式实例化得到实例对象
    
2.  每一个实例对象中都有一个\_\_proto\_\_属性，这个属性中有constructor属性，指向构造函数
    
3.  构造函数公共的属性和方法放在原型对象中，这个原型对象（prototype）是构造函数本身的一个属性，它指向的是一个对象。只要创建一个构造函数就会自动产生一个原型对象。原型对象属于构造函数，构造函数通过prototype引用它，原型对象有一个constructor属性，指回构造函数
    
4.  每个实例对象的\_\_proto\_\_属性都会指向原型对象（prototype）
    

![](/images/feishu/assets/2025-09-02-JS学习-307.png)

题目梳理：

![](/images/feishu/assets/2025-09-02-JS学习-308.png)

### 4.13.6 原型继承

![](/images/feishu/assets/2025-09-02-JS学习-309.png)

![](/images/feishu/assets/2025-09-02-JS学习-310.png)

![](/images/feishu/assets/2025-09-02-JS学习-311.png)

![](/images/feishu/assets/2025-09-02-JS学习-312.png)

![](/images/feishu/assets/2025-09-02-JS学习-313.png)

![](/images/feishu/assets/2025-09-02-JS学习-314.png)

![](/images/feishu/assets/2025-09-02-JS学习-315.png)

![](/images/feishu/assets/2025-09-02-JS学习-316.png)

回顾：构造函数每次new得到对象都是不同的

### 4.13.7 原型链

![](/images/feishu/assets/2025-09-02-JS学习-317.png)

只要是对象就有对象原型，它可以通过\_\_proto\_\_属性来访问原型对象，获取公共的属性和方法，然后每个原型对象都会有一个\[\[prototype\]\]，它是个指针，用来查看它自己的原型对象的信息，然后会提供一个\_\_proto\_\_的属性以供对象原型来访问，\_\_proto\_\_这个属性就理解为是对象原型，这个对象原型就在对象实例中。其实\_\_proto\_\_就是浏览器给开发者的接口，用来访问\[\[prototype\]\]

  

对象原型指向原型对象，这个原型对象本身就含有对象原型，因为所有对象都有一个对象原型\_\_proto\_\_，所以这个原型对象可以通过它内部的对象原型\_\_proto\_\_指向他自己的原型对象

大哥是Object

![](/images/feishu/assets/2025-09-02-JS学习-318.png)

![](/images/feishu/assets/2025-09-02-JS学习-319.png)

ldh属于构造函数的，由这个构造函数构成的，只要是在这个链上就是true

万物皆对象

### 4.13.8 消息提示对象封装

模态框

以后遇见这个效果直接使用这个就行

![](/images/feishu/assets/2025-09-02-JS学习-320.png)

![](/images/feishu/assets/2025-09-02-JS学习-321.png)

![](/images/feishu/assets/2025-09-02-JS学习-322.png)

![](/images/feishu/assets/2025-09-02-JS学习-323.png)

补充知识点：

1.  append()
    

![](/images/feishu/assets/2025-09-02-JS学习-324.png)

```html
append(param1)
append(param1, param2)
append(param1, param2, /* …, */ paramN)



let div = document.createElement("div");
let p = document.createElement("p");
div.append(p);

console.log(div.childNodes); // NodeList [ <p> ]
```

2.  remove()
    

自己删自己

![](/images/feishu/assets/2025-09-02-JS学习-325.png)

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .modal {
      width: 300px;
      min-height: 100px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      position: fixed;
      z-index: 999;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
      background-color: #fff;
    }

    .modal .header {
      line-height: 40px;
      padding: 0 10px;
      position: relative;
      font-size: 20px;
    }

    .modal .header i {
      font-style: normal;
      color: #999;
      position: absolute;
      right: 15px;
      top: -2px;
      cursor: pointer;
    }

    .modal .body {
      text-align: center;
      padding: 10px;
    }

    .modal .footer {
      display: flex;
      justify-content: flex-end;
      padding: 10px;
    }

    .modal .footer a {
      padding: 3px 8px;
      background: #ccc;
      text-decoration: none;
      color: #fff;
      border-radius: 2px;
      margin-right: 10px;
      font-size: 14px;
    }

    .modal .footer a.submit {
      background-color: #369;
    }
  </style>
</head>

<body>
  <button id="delete">删除</button>
  <button id="login">登录</button>
  <script>
    // 1.Model 构造函数的封装  模态框
    function Modal(title = '', message = '') {
      // 创建Model 模态框盒子
      // 1.1 创建div标签
      this.modalBox = document.createElement('div')
      // 1.2 给div 添加类名为model
      this.modalBox.className = 'modal'
      // 1.3 model盒子内部填充2个div标签并且修改文字内容 
      this.modalBox.innerHTML = `
        <div class="header">${title}<i>x</i></div>
        <div class="body">${message}</div>
      `
      // console.log(this.modalBox)
    }
    // new Model('温馨提示', '您没有删除权限操作')
    // new Model('友情提示', '您还没有登录呢')
    // 2.给构造函数原型对象挂载open方法
    Modal.prototype.open = function () {
      // 准备open显示的时候，先判断页面中有没有modal盒子，有就移除，没有加添加
      const box = document.querySelector('.modal')
      // 使用逻辑中断来判断   若前边为假则中断，box.remove()就不执行了，就接着执行后边的代码；如果box为真，则执行box.remove()，再接着执行后边的代码
      box && box.remove()
      // 主要这个方法不要用箭头函数
      // 把刚才创建的modelBox 显示到页面body中
      // append可以增加对象
      document.body.append(this.modalBox)

      //要等到盒子显示出来，就可以绑定点击事件了
      this.modalBox.querySelector('i').addEventListener('click', () => {
        // 这个地方需要用到箭头函数
        // 这个this是指向的是上上级 是实例对象
        // 如果不用箭头函数的话，就指向的是i这个DOM对象了
        this.close()
      })
    }

    // 测试一下 点击 删除按钮
    document.querySelector('#delete').addEventListener('click', () => {
      // 先调用Model构造函数
      const del = new Modal('温馨的提示', '您没有删除权限操作')
      // 实例对象调用open方法
      del.open()
    })
    // 测试一下 点击 登录按钮
    document.querySelector('#login').addEventListener('click', () => {
      // 先调用Model构造函数
      const log = new Modal('友情提示', '您还没有登录呢')
      // 实例对象调用open方法
      log.open()
    })
    // 3.给构造函数原型对象挂载close方法
    Modal.prototype.close = function () {
      this.modalBox.remove()
    }
  </script>
</body>

</html>
```

![](/images/feishu/assets/2025-09-02-JS学习-326.png)

## 4.14 深浅拷贝

### 4.14.1 浅拷贝

![](/images/feishu/assets/2025-09-02-JS学习-327.png)

展开运算符也可以对对象使用，将对象的键值取出放到新对象中

![](/images/feishu/assets/2025-09-02-JS学习-328.png)

![](/images/feishu/assets/2025-09-02-JS学习-329.png)

下边这个情况的时候，浅拷贝只拷贝外面这一层，外面这一层是把值给了这个新对象，里层的这个对象在拷贝的时候还是拷贝的地址，所以一改里层对象的值，原来的对象和拷贝的对象的值就都变了，这样拷贝就会有问题

![](/images/feishu/assets/2025-09-02-JS学习-330.png)

总结：

![](/images/feishu/assets/2025-09-02-JS学习-331.png)

### 4.14.2 深拷贝

深拷贝：拷贝的是对象，不是地址

常用的三种方法：

1.  通过递归实现深拷贝
    
2.  lodash/cloneDeep
    
3.  通过JSON.stringify()实现
    

#### 4.14.2.1 递归函数

![](/images/feishu/assets/2025-09-02-JS学习-332.png)

1.  死递归占溢出：
    

```xml
<body>
  <script>
    function fn() {
      fn()
    }
    fn()
  </script>
</body>
```

2.  递归函数要加判断条件：
    

![](/images/feishu/assets/2025-09-02-JS学习-333.png)

  

3.  应用：利用递归函数实现setTimeout模拟setInterval效果
    

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <div></div>
  <script>
    function getTime() {
      document.querySelector('div').innerHTML = new Date().toLocaleString()
      setTimeout(getTime, 1000)
    }
    getTime()
  </script>
</body>

</html>
```

![](/images/feishu/assets/2025-09-02-JS学习-334.png)

4.  通过递归实现深拷贝
    

![](/images/feishu/assets/2025-09-02-JS学习-335.png)

现在的这个递归函数还是一个浅拷贝的函数，通过将旧值给新值的方式进行，简单数据直接就是把值给他了，但是复杂数据是把他的地址给他

解决方式:

这个是简易版的递归函数深拷贝

一定要注意先数组再对象，因为万物皆可对象

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
    const obj = {
      uname: 'pink',
      age: 18,
      hobby: ['乒乓球', '足球'],
      family: {
        baby: '小pink'
      }
    }
    const o = {}
    // 拷贝函数
    function deepCopy(newObj, oldObj) {
      for (let k in oldObj) {
        // 处理数组的问题
        // 判断是否属于数组
        // 一定先写数组，因为万物皆对象，数组也属于对象，把对象写前边的话，数组就执行对象的操作了，就无法正常运行了
        if (oldObj[k] instanceof Array) {
          // newObj[k]  接收的内容放到[]
          // oldObj[k]  就是['乒乓球','足球']
          newObj[k] = []
          deepCopy(newObj[k], oldObj[k])
        } else if (oldObj[k] instanceof Object) {
          newObj[k] = {}
          deepCopy(newObj[k], oldObj[k])
        } else {
          //  k 是属性名  属性值为oldObj[k]
          // newObj[k]与newObj写法是等价的
          newObj[k] = oldObj[k]
        }
      }
    }
    deepCopy(o, obj) //函数调用 两个参数 o是新对象，obj是旧对象
    console.log(o)
    o.age = 20
    o.hobby[0] = '篮球'
    o.family = '老pink'
    console.log(obj)
  </script>
</body>

</html>
```

![](/images/feishu/assets/2025-09-02-JS学习-336.png)

#### 4.14.2.2 **js库lodash里面cloneDeep内部实现了深拷贝**

https://www.lodashjs.com/

lodash里边的方法都要加上一个下划线\_

\_.cloneDeep()

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <!-- 先引用这个库 -->
  <script src="lodash.min.js"></script>
  <script>
    const obj = {
      uname: 'pink',
      age: 18,
      hobby: ['乒乓球', '足球'],
      family: {
        baby: '小pink'
      }
    }
    const o = _.cloneDeep(obj)
    console.log(o)
    o.family.baby = '老pink'
    console.log(obj)
  </script>
</body>

</html>
```

![](/images/feishu/assets/2025-09-02-JS学习-337.png)

#### 4.14.2.3 利用JSON实现深拷贝

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
    const obj = {
      uname: 'pink',
      age: 18,
      hobby: ['乒乓球', '足球'],
      family: {
        baby: '小pink'
      }
    }
    // stringify 把对象转换为 JOSN 字符串; parse 把字符串转换为对象
    // 字符串就是简单数据类型了，就直接存值了，然后再转化为对象，然后就在堆里存值了，栈里存地址
    // 但是与原来对象没有联系了，独立了，修改值不会改变原对象了，中间经过了转化为字符串
    const o = JSON.parse(JSON.stringify(obj))
    console.log(o)
    o.family.baby = '123'
    console.log(obj)
  </script>
</body>

</html>
```

![](/images/feishu/assets/2025-09-02-JS学习-338.png)

## 4.15 异常处理

1.  throw抛异常
    

![](/images/feishu/assets/2025-09-02-JS学习-339.png)

2.  try/catch 捕获错误信息
    

![](/images/feishu/assets/2025-09-02-JS学习-340.png)

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <p>123</p>
  <script>
    function fn() {
      try {
        // 可能发生错误的代码  要写到try中
        const p = document.querySelector('.p')
        p.style.color = 'red'
      } catch (err) {
        // 拦截错误，提示浏览器提供的错误信息，但是不中断程序的执行
        console.log(err.message)
        // 想要中断程序，需要加return
        // return
        // 或者不用return，搭配throw来使用，因为throw可以中断程序
        throw new Error('你看看，选择器错误了吧')
      }
      // finally时不管程序对不对，都要去执行的代码
      finally {
        alert('弹出对话框')
      }
      console.log(11)

    }
    // catch后边括号的是形参，写啥内容都行，保存了浏览器提供的错误信息
    // message是一个属性，没有错误信息时，catch就不会执行
    fn()
  </script>
</body>

</html>
```

try和catch去处理可能有错误的代码，finally去处理不管有没有错误一定会执行的代码

3.  debugger
    

![](/images/feishu/assets/2025-09-02-JS学习-341.png)

在代码比较长的情况用比较方便，在检查代码的时候输上debugger，浏览器f12，直接就跳转断点位置，剩下的调式与之前在浏览器手动打断点方式相同

## 4.16 处理this

### 4.16.1 this的指向

1.  普通函数的this
    

![](/images/feishu/assets/2025-09-02-JS学习-342.png)

2.  箭头函数的this
    

![](/images/feishu/assets/2025-09-02-JS学习-343.png)

![](/images/feishu/assets/2025-09-02-JS学习-344.png)

![](/images/feishu/assets/2025-09-02-JS学习-345.png)

### 4.16.2 this的改变

call() apply() bind()

1.  call()
    

![](/images/feishu/assets/2025-09-02-JS学习-346.png)

两个作用：①调用函数；②改变this指向

```xml
<body>
  <script>
    const obj = {
      uname: 'pink'
    }
    function fn(x, y) {
      console.log(this)  //window
      console.log(x + y)
    }
    fn.call(obj, 1, 2)
  </script>
</body>
```

![](/images/feishu/assets/2025-09-02-JS学习-347.png)

2.  apply()
    

![](/images/feishu/assets/2025-09-02-JS学习-348.png)

两个作用：①调用函数；②改变this指向

call传递的是普通参数，而apply必须传递的是数组

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
    const obj = {
      age: 18
    }
    // 形参接收的不是数组，是数组里的值，但实参必须是数组
    function fn(x, y) {
      console.log(this)
      console.log(x + y)
    }
    // fn.apply(this指向谁, 数组参数)
    fn.apply(obj, [1, 2])
    // 和call一样，返回值就是函数的返回值，因为他就是在调用函数

    // 使用场景：求数组最大值
    // const max = Math.max(1, 2, 3)
    // console.log(max)   //3
    // 指向空或者Math都是可以的
    const arr = [100, 44, 77]
    // apply这个方法实参必须是数组，形参是接收的是数组中的每一个值
    const max = Math.max.apply(Math, arr)
    const min = Math.min.apply(Math, arr)
    console.log(max, min)     //100,4

    // 求最大值的另一种方式:展开运算符
    console.log(Max.max(...arr))
  </script>
</body>

</html>
```

![](/images/feishu/assets/2025-09-02-JS学习-349.png)

3.  bind()
    

![](/images/feishu/assets/2025-09-02-JS学习-350.png)

bind()相比于call和apply来说不会调用函数，call和apply只要一写就直接调用函数

bind的语法跟call很相似

```xml
<body>
  <script>
    const obj = {
      age: 18
    }
    function fn() {
      console.log(this)
    }
    // 1.bind 不会调用函数
    // 2.bind能改变this的指向
    fn.bind()
    // 3.返回值是一个函数,他相当于进行的是对原函数拷贝,然后新函数的这个this指向我们设定的那个指定值
    const fun = fn.bind(obj)
    // console.log(fun)
    // 调用,查看this的指向
    fun()
  </script>
</body>
```

![](/images/feishu/assets/2025-09-02-JS学习-351.png)

4.  按钮案例：按钮点击之后被禁用，两秒之后自动变为不禁用状态，要求尽可能多的用this
    

```xml
<body>
  <button>禁用</button>
  <script>
    const btn = document.querySelector('button')
    btn.addEventListener('click', function () {
      this.disabled = true
      // 定时器是window进行调用的
      setTimeout(function () {
        // 在这个普通函数里面，我们要this由原来的window 改为 btn
        this.disabled = false
      }.bind(this), 2000)
      // 上边的这个this是在延时函数外面的，所以这个this跟上边的那个this是相同的，就是指的是btn
      // .bind(this)之后就已经拷贝完之前对象了，就可以等两秒之后延时函数来调用它就可以了
    })
  </script>
</body>
```

5.  总结
    

![](/images/feishu/assets/2025-09-02-JS学习-352.png)

## 4.17 性能优化

### 4.17.1 防抖

![](/images/feishu/assets/2025-09-02-JS学习-353.png)

**案例：利用防抖来处理-鼠标经过盒子显示文字（要求:鼠标在盒子上移动，里面的数字就会变化+1）**

防抖实现方式：

*   lodash 提供了防抖处理
    

\_.debounce(func,\[wait=0\],\[options={}\])

创建一个debounced（防抖函数），该函数会从上一次被调用后，延迟wait毫秒后调用func方法。

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .box {
      box-sizing: border-box;
      width: 200px;
      height: 200px;
      background-color: gray;
      font-size: 25px;
      color: #fff;
      text-align: center;
      padding-top: 5px;
    }
  </style>
</head>

<body>
  <div class="box"></div>
  <script src="lodash.min.js"></script>
  <script>
    const box = document.querySelector('.box')
    let i = 0
    function mouseMove() {
      box.innerHTML = i++
      // 如果里面存在大量消耗性能的代码，比如dom操作，比如数据处理，可能会造成卡顿
    }
    // box.addEventListener('mousemove', mouseMove)
    // 利用lodash库实现防抖 -500毫秒之后才去+1
    // 以前在事件监听中的执行函数是不可以加括号的，加括号就成调用了，但是现在是需要传递参数的，所以必须加
    box.addEventListener('mousemove', _.debounce(mouseMove, 500))
  </script>
</body>

</html>
```

*   手写一个防抖函数来处理
    

防抖的核心就是利用定时器来实现的：

①声明一个定时器变量

②当鼠标每次滑动都先判断是否有定时器了，如果有定时器先清除以前的定时器

③如果没有定时器则开启定时器，记得存到变量里面

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .box {
      box-sizing: border-box;
      width: 200px;
      height: 200px;
      background-color: gray;
      font-size: 25px;
      color: #fff;
      text-align: center;
      padding-top: 5px;
    }
  </style>
</head>

<body>
  <div class="box"></div>
  <script src="lodash.min.js"></script>
  <script>
    const box = document.querySelector('.box')
    let i = 0
    function mouseMove() {
      box.innerHTML = i++
      // 如果里面存在大量消耗性能的代码，比如dom操作，比如数据处理，可能会造成卡顿
    }
    // box.addEventListener('mousemove', mouseMove)
    // 手写防抖函数
    // 核心是利用延时器setTimeout来实现的
    // 1.声明定时器变量
    // 2.每次鼠标移动(事件触发)的时候都要先判断是否有定时器,如果有先清除以前的定时器
    // 3.如果没有定时器,则开启定时器,存入到定时器变量里面
    // 4.定时器里面写函数调用
    function debounce(fn, t) {
      let timer
      // return 返回一个匿名函数
      return function () {
        // 这里边写第二三四步
        if (timer) clearTimeout(timer)
        timer = setTimeout(function () {
          fn() //加小括号调用fn }, t)
        }, t)
      }
    }
    box.addEventListener('mousemove', debounce(mouseMove, 500))

    // debounce(mouseMove, 500)是在调用函数,一调用就会拿到return后边的内容
    // 相当于debounce(mouseMove, 500) = function () {// 这里边写第二三四步}
    // 我们移动鼠标时想要实现的是这个匿名函数
    // 要的其实是这个函数名,事件中的执行函数不能写括号,写括号就是函数调用
  </script>
</body>

</html>
```

### 4.17.2 节流

![](/images/feishu/assets/2025-09-02-JS学习-354.png)

![](/images/feishu/assets/2025-09-02-JS学习-355.png)

**案例：利用节流来处理-鼠标滑过盒子显示文字（要求：鼠标在盒子上移动，不管移动多少次，每隔500ms才+1）**

实现方式：

*   lodash 提供的节流函数来处理
    

\_.throttle(func,\[wait=0\],\[options=\])

创建一个节流函数，在wait秒内最多执行func一次的函数

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .box {
      box-sizing: border-box;
      width: 200px;
      height: 200px;
      background-color: gray;
      font-size: 25px;
      color: #fff;
      text-align: center;
      padding-top: 5px;
    }
  </style>
</head>

<body>
  <div class="box"></div>
  <script src="lodash.min.js"></script>
  <script>
    const box = document.querySelector('.box')
    let i = 0
    function mouseMove() {
      box.innerHTML = i++
      // 如果里面存在大量消耗性能的代码，比如dom操作，比如数据处理，可能会造成卡顿
    }
    // box.addEventListener('mousemove', mouseMove)
    // 利用lodash库实现节流 -500毫秒之后才去加1
    // 语法:_.throttle(fun,时间)
    box.addEventListener('mousemove', _.throttle(mouseMove, 500))
  </script>
</body>

</html>
```

*   手写一个节流函数来处理
    

思路：

①声明一个定时器变量

②当鼠标每次滑动都先判断是否有定时器了，如果有定时器则不开启新定时器

③如果没有定时器则开启定时器，记得存放到变量里面:定时器里面调用执行的函数；定时器里面要把定时器清空

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .box {
      box-sizing: border-box;
      width: 200px;
      height: 200px;
      background-color: gray;
      font-size: 25px;
      color: #fff;
      text-align: center;
      padding-top: 5px;
    }
  </style>
</head>

<body>
  <div class="box"></div>
  <script src="lodash.min.js"></script>
  <script>
    const box = document.querySelector('.box')
    let i = 0
    function mouseMove() {
      box.innerHTML = i++
      // 如果里面存在大量消耗性能的代码，比如dom操作，比如数据处理，可能会造成卡顿
    }
    // box.addEventListener('mousemove', mouseMove)
    // 手写节流函数  每隔500ms+1
    // 1.声明一个定时器变量
    // 2.当鼠标每次滑动都先判断是否有定时器,如果有定时器则不开启新定时器
    // 3.如果没有定时器则开启定时器,记得存到变量里面
    // 3.1定时器里面调用执行函数
    // 3.2定时器里面要把定时器清空
    function throttle(fn, t) {
      let timer
      return function () {
        if (!timer) {
          timer = setTimeout(function () {
            fn()
            // 清空定时器,当时间到了,定时器就停止了,但原来那个timer还有,
            // 所以需要清除定时器,这样timer就是空的了,然后就又重复执行了
            timer = null
            // 不能用clearTimeout(timer)
            // 在开启的定时器里边是无法清除定时器的
          }, t)
        }
      }
    }
    box.addEventListener('mousemove', throttle(mouseMove, 500))
  </script>
</body>

</html>
```

### 4.17.3 清除定时器遇到的问题

```xml
<body>
  <script>
    let timer = null
    timer = setTimeout(() => {
      clearTimeout(timer)
      console.log(timer)
    }, 1000)
  </script>
</body>
```

输出为1

在开启的定时器里边写清除定时器

总结：在setTimeout中是无法删除定时器的，因为定时器还在运作，所以使用timer=null 而不是clearTimeout(timer)

### 4.17.4 节流综合案例

页面打开，可以记录上一次的视频播放位置

![](/images/feishu/assets/2025-09-02-JS学习-356.png)

![](/images/feishu/assets/2025-09-02-JS学习-357.png)

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="referrer" content="never" />
  <title>综合案例</title>
  <style>
    * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
    }

    .container {
      width: 1200px;
      margin: 0 auto;
    }

    .video video {
      width: 100%;
      padding: 20px 0;
    }

    .elevator {
      position: fixed;
      top: 280px;
      right: 20px;
      z-index: 999;
      background: #fff;
      border: 1px solid #e4e4e4;
      width: 60px;
    }

    .elevator a {
      display: block;
      padding: 10px;
      text-decoration: none;
      text-align: center;
      color: #999;
    }

    .elevator a.active {
      color: #1286ff;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <a href="http://pip.itcast.cn">
        <img src="/images/feishu/assets/2025-09-02-JS学习-367.png" alt="" />
      </a>
    </div>
    <div class="video">
      <video src="https://v.itheima.net/LapADhV6.mp4" controls></video>
    </div>
    <div class="elevator">
      <a href="javascript:;" data-ref="video">视频介绍</a>
      <a href="javascript:;" data-ref="intro">课程简介</a>
      <a href="javascript:;" data-ref="outline">评论列表</a>
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
  <script>
    // 1.获取元素 要对视频进行操作
    const video = document.querySelector('video')
    // 这个事件类似于点击事件的另外一个写法.onclick
    video.ontimeupdate = _.throttle(() => {
      // 要进行本地存储,存当前播放的时间
      // 控制台输出当前的时间
      // console.log(video.currentTime)  //获得当前的视频时间
      // 简单数据类型本地存储直接存储就可以,把当前的时间存储到本地存储
      localStorage.setItem('currentTime', video.currentTime)
    }, 1000)
    // 打开页面触发事件,就从本地存储里面取出事件,赋值给 video.currentTime
    video.onloadeddata = () => {
      // console.log(11)
      // 第一次打开的话,若本地存储无数据的话,就从0开始,从视频的开头开始,使用逻辑中断
      video.currentTime = localStorage.getItem('currentTime') || 0
    }
  </script>
</body>

</html>
```
