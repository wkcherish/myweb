---
title: 2.基础语法
description: 
---


# 2.基础语法

## 2.1 js的使用基本介绍

### 2.1.1 js组成

1.  js是编程语言，html和css不是编程语言，是标记语言
    

js组成：ECMAScript(JavaScript语言基础)和Web APIs(由DOM页面文档对象模型和BOM浏览器对象模型)

2.  JavaScript 程序不能独立运行，它需要被嵌入 HTML 中，然后浏览器才能执行 JavaScript 代码
    

### 2.1.2 js书写位置

1.  **内部 JavaScript**
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-002.png)

2.  **外部 JavaScript**
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-003.png)

3.  **内联 JavaScript**
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-004.png)

### 2.1.3 JavaScript注释

![](../../public/images/feishu/assets/2025-09-02-JS学习-005.png)

alt+shift+a一定要记住！

### 2.1.4 JavaScript结束符

![](../../public/images/feishu/assets/2025-09-02-JS学习-006.png)

  

### 21.1.5 JavaScript 输入输出语法

1.  输出语法：
    

①document.write('要出的内容')

向body内输出内容；

如果输出的内容写的是标签，也会被解析cheng

②alert('要出的内容')

页面弹出警告对话框

③console.log('控制台打印')

控制台输出语法，程序员调试使用

输入log就行，自动生成：

![](../../public/images/feishu/assets/2025-09-02-JS学习-007.png)

2.  输入语法：
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-008.png)

### 21.1.6 字面量

在计算机科学中，字面量（literal）是在计算机中描述 事/物

例如：18 是一个数字字面量；'pink' 是一个字符串字面量

## 2.2 变量

1.  变量声明
    

let 变量名

*   声明变量有两部分组成：声明关键字 变量名（也叫标识符）
    
*   let 即关键字 (let: 允许、许可、让、要)，所谓关键字是系统提供的专门用来声明（定义）变量的词语
    

2.  变量赋值
    

```html
let age
age=18 
```

3.  连这些（变量的初始化）：let age=18
    
4.  更新变量
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-009.png)

5.  声明多个变量
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-010.png)

6.  变量命名规则与规范
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-011.png)

遵守小驼峰！

7.  变量拓展-let和var的区别
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-012.png)

## 2.3 数组

```html
let arr = []
```

  

![](../../public/images/feishu/assets/2025-09-02-JS学习-013.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-014.png)

## 2.4 常量

![](../../public/images/feishu/assets/2025-09-02-JS学习-015.png)

const — 类似于 let ，但是变量的值无法被修改

  

## 2.5 数据类型

![](../../public/images/feishu/assets/2025-09-02-JS学习-016.png)

1.  js是一门弱数据类型的语言，只要是数字就是数字型语言
    
2.  算数运算符：
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-017.png)

3.  数字类型（Number）
    

JavaScript 中的正数、负数、小数等 统一称为 数字类型

![](../../public/images/feishu/assets/2025-09-02-JS学习-018.png)

4.  字符串类型（string）
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-019.png)

反引号也是可以使用的

➕：数字相加，字符相连，只要有字符串就可以与其他进行相加

例如：document.write("我今年"+age+"岁")

5.  模板字符串
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-020.png)

类似于python的字符串格式化

6.  布尔类型
    

true 和 false

7.  未定义类型（underfined）
    

表示没有赋值

未定义类型是比较特殊的类型，只有一个值undefined

只声明变量，不赋值的情况下，变量的默认值为 undefined，一般很少【直接】为某个变量赋值为 undefined

8.  null（空类型）
    

JavaScript 中的 null 仅仅是一个代表“无”、“空”或“值未知”的特殊值

赋值了，但是内容为空

```html
typeof null
输出的是'object'，是一个对象数据类型
```

9.  控制台检测数据类型
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-021.png)

10.  类型转换
    

prompt输入的内容都是字符串字面量，还有html时的表单（input啥的输入的也是字符串字面量）

转换方式：隐式转换和显示转换

①隐式转换

*   号两边只要有一个是字符串，都会把另外一个转成字符串
    
*   除了+以外的算术运算符 比如 - \* / 等都会把数据转成数字类型（只要有数字就会把另一个转化成数字字面变量）
    
*   加号作为正号解析可以转换成数字型：console.log(+'123')不再是字符串类型，是数字类型为123
    
*   任何数据和字符串相加结果都是字符串
    

②显示转换

![](../../public/images/feishu/assets/2025-09-02-JS学习-022.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-023.png)

在输入的时候要用好隐式转换，简单写起来

let num = +prompt(’请输入数字：‘)

  parseInt与parseFloat是只取前边的数字，如果前边有字母，是无法进行识别后边的数字的，会显示NaN，表示错误

console.log(parseInt('12.333px'))

输出为：12

console.log(parseInt('a'a'a12.333px'))

输出：NaN

## 2.6 运算符

### 2.6.1 赋值运算符

![](../../public/images/feishu/assets/2025-09-02-JS学习-024.png)

### 2.6.2 一元运算符

众多的 JavaScript 的运算符可以根据所需表达式的个数，分为一元运算符、二元运算符、三元运算符，就看需要几个数来操作，例如+需要两个数才能相加，所以叫做二元运算符，正负号的话就是一元运算符

![](../../public/images/feishu/assets/2025-09-02-JS学习-025.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-026.png)

两者的区别：

![](../../public/images/feishu/assets/2025-09-02-JS学习-027.png)

前置先自加；后置后加，代码执行完之后再加

### 2.6.3 比较运算符

![](../../public/images/feishu/assets/2025-09-02-JS学习-028.png)

比较运算符也有隐式转换

console.log(2 == '2')输出为true，只判断值，==含有隐式转换，前边是数字字面量的情况下，会将字符串转化为数字字面量

console.log(2==='2')输出false，===全等，会判断值和数据类型，需要全部一样才为true

要使用三等，开发的时候

NaN不等于任何人，包括它自己

小数在进行运算的时候它会先把自己转化为整数，然后最后再除以放大的数变回原来：例如：0.5+0.2：它是0.5\*10+0.2\*10=7

7/10=0.7

最后：0.5+0.2=0.7

字符串比较，比较的是字符对应的ASCII码

### 2.6.4 逻辑运算符

![](../../public/images/feishu/assets/2025-09-02-JS学习-029.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-030.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-031.png)

上述题目选D

与真2假1；或真1假2

### 2.6.5 运算符优先级

![](../../public/images/feishu/assets/2025-09-02-JS学习-032.png)

先算逻辑与，后算逻辑或

## 2.7 语句

表达式：是可以被求值的代码，会有结果给我们

语句：语句是可以被执行的代码，例如prompt()

![](../../public/images/feishu/assets/2025-09-02-JS学习-033.png)

因为表达式可被求值，所以它可以写在赋值语句的右侧。

而语句不一定有值，所以比如 alert() for和break 等语句就不能被用于赋值。

### 2.7.1 分支语句

#### 2.7.1.1 if分支语句

if语句单行简单的话，可以不写{}，写在一行就行

1.  单分支语句
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-034.png)

  

除了0，所有数字都为真

```html
if（0) {
    let a=1
    alert(typeof a)
}
不输出，括号为假
```

2.  双分支语句
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-035.png)

3.  多分支语句
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-036.png)

#### 2.7.1.2 三元运算符

![](../../public/images/feishu/assets/2025-09-02-JS学习-037.png)

#### 2.7.1.3 switch语句

![](../../public/images/feishu/assets/2025-09-02-JS学习-038.png)

如果不写break，在匹配成功之后，输出完这个匹配内容后，switch语句就失效了，他会把后边的内容也全部输出

### 2.7.2 循环语句

#### 2.7.2.1 断点演示

![](../../public/images/feishu/assets/2025-09-02-JS学习-039.png)

#### 2.7.2.2 while循环

![](../../public/images/feishu/assets/2025-09-02-JS学习-040.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-041.png)

#### 2.7.2.3 for循环

![](../../public/images/feishu/assets/2025-09-02-JS学习-042.png)

for(;;) {

}

表示无限循环

![](../../public/images/feishu/assets/2025-09-02-JS学习-043.png)

#### 2.7.2.4 循环的退出

![](../../public/images/feishu/assets/2025-09-02-JS学习-044.png)

## 2.8 数组

### 2.8.1 基础认识

![](../../public/images/feishu/assets/2025-09-02-JS学习-045.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-046.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-047.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-048.png)

  

### 2.8.2 操作数组

![](../../public/images/feishu/assets/2025-09-02-JS学习-049.png)

1.  添加元素
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-050.png)

console.log(arr.push('green'))

输出结果：为新数组的长度

![](../../public/images/feishu/assets/2025-09-02-JS学习-051.png)

push用的非常多，一定要记住

1.  删除元素
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-052.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-053.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-054.png)

### 2.8.3 根据数据生成柱形图

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
        }

        .box {
            display: flex;
            width: 700px;
            height: 300px;
            border-left: 1px solid pink;
            border-bottom: 1px solid pink;
            margin: 50px auto;
            justify-content: space-around;
            align-items: flex-end;
            text-align: center;
        }

        .box>div {
            display: flex;
            width: 50px;
            background-color: pink;
            flex-direction: column;
            justify-content: space-between;
        }

        .box div span {

            margin-top: -20px;
        }

        .box div h4 {
            margin-bottom: -35px;
            width: 70px;
            margin-left: -10px;
        }
    </style>
</head>

<body>

    <script>
        // 1. 四次弹框效果
        // 声明一个新的数组
        let arr = []
        for (let i = 1; i <= 4; i++) {
            // let num = prompt(`请输入第${i}季度的数据:`)
            // arr.push(num)
            arr.push(prompt(`请输入第${i}季度的数据:`))
            // push记得加小括号，不是等号赋值的形式
        }
        // console.log(arr)  ['123','135','345','234']
        // 盒子开头
        document.write(` <div class="box">`)

        // 盒子中间 利用循环的形式  跟数组有关系
        for (let i = 0; i < arr.length; i++) {
            document.write(`
              <div style="height: ${arr[i]}px;">
                <span>${arr[i]}</span>
                <h4>第${i + 1}季度</h4>
              </div>          
            `)
        }
        // 盒子结尾
        document.write(` </div>`)
    </script>
</body>

</html>
```

### 2.8.4 冒泡排序

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
    let arr = [5, 4, 3, 2, 1]
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        // 开始交换,但是前提 第一个数大于第二个数才会进行交换
        if (arr[j] > arr[j + 1]) {
          // 交换两个变量
          let tmp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = tmp
        }
      }
    }
    document.write(arr)
  </script>
</body>

</html>
```

![](../../public/images/feishu/assets/2025-09-02-JS学习-055.png)

实际开发中我们使用的是函数：sort()，默认按照升序

let arr = \[4, 2, 5, 1, 3\]

// 1.升序排列写法

arr.sort(function (a, b) {

return a - b

})

console.log(arr) // \[1, 2, 3, 4, 5\]

// 降序排列写法

arr.sort(function (a, b) {

return b - a

})

console.log(arr) // \[5, 4, 3, 2, 1\]

## 2.9 函数

![](../../public/images/feishu/assets/2025-09-02-JS学习-056.png)

（）是调用的意思，为了区分哪个函数，所以前边加上函数名，因此函数的调用：函数名()

函数的声明用function

函数里边可以嵌套函数

### 2.9.1 函数传参

![](../../public/images/feishu/assets/2025-09-02-JS学习-057.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-058.png)

*   形参：声明函数时写在函数名右边小括号里的叫形参（形式上的参数）
    
*   实参：调用函数时写在函数名右边小括号里的叫实参（实际上的参数）
    
*   形参可以理解为是在这个函数内声明的变量（比如 num1 = 10）实参可以理解为是给这个变量赋值
    
*   开发中尽量保持形参和实参个数一致
    
*   我们曾经使用过的 alert('打印'), parseInt('11'), Number('11') 本质上都是函数调用的传参
    
*   形参只在函数中有用，所以不需要进行声明这个变量
    

可以给形参初始值，此时函数调用的时候，不放实参这个函数也可以使用，不会报错；默认值只会在缺少实参参数传递时 才会被执行，所以有参数会优先执行传递过来的实参, 否则默认为undefined

### 2.9.2 函数的返回值

![](../../public/images/feishu/assets/2025-09-02-JS学习-059.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-060.png)

*   在函数体中使用 return 关键字能将内部的执行结果交给函数外部使用
    
*   return 后面代码不会再被执行，会立即结束当前函数，所以 return 后面的数据不要换行写，return要写在函数的最下边
    
*   return函数可以没有 return，这种情况函数默认返回值为 undefined
    
*   返回多个值时使用数组，让它返回数组，就能将多个值返回
    
*   断点调试:进入函数内部看执行过程F11
    

### 2.9.3 参数个数不同情况

```html
    function fn(a, b) {
      console.log(a + b);
    }
    fn(1, 2, 3)输出3，最后一个参数没人接，不要
    fn(1)输出NaN，第二个值undefined,1+undefined=NaN,计算错误
```

### 2.9.4 作用域

*   一段程序代码中所用到的名字并不总是有效和可用的，而限定这个名字的可用性的代码范围就是这个名字的 **作用域**
    
*   **作用域的使用提高了程序逻辑的局部性，增强了程序的可靠性，减少了名字冲突**
    
*   分为全局作用域和局部作用域；全局作用域的变量叫作全局变量，局部作用域的变量叫作局部变量，也称为函数作用域，函数内部有效
    
*   函数内部可以直接所使用全局变量
    
*   如果函数内部，变量没有声明，直接赋值，也当全局变量看，但是强烈不推荐，但是需要先调用函数才可以输出函数内部的变量
    

例如：

```html
    function fun() {
      num = 10
    }
    fun()
    console.log(num)
   会输出10，如果不调用函数，直接就报错，尽量不要用这种方法，如果此时我在函数的上方写了
   let num=20,则num的值会被覆盖，这样值就乱了，这样是不对的！
```

*   函数内部的形参可以看做是局部变量
    
*   不同作用域变量可以重名；相同作用域变量不可以重名
    

变量访问原则： **在能够访问到的情况下 先局部， 局部没有在找全局**

### 2.9.5 匿名函数

函数可以分为具名函数和匿名函数

匿名函数是指没有名字的函数，它是无法直接使用的，使用的两种方式：

1.  函数表达式
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-061.png)

里边也可以写参数

具名函数调用位置可以随意调整；

匿名函数函数表达式形式只能在声明后才可以使用

2.  立即执行函数
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-062.png)

直接执行函数，不需要再调用！！！本质它已经调用了

写法：两个小括号，然后在第一个小括号中写function

(function () {})();

不要落下最后的;

立即执行函数必须要加;

分号写前写后都没问题

写前：

(function() {})()

;(function () {})();

写后:

(function() {})();

(function () {})();

  

可以这样理解：最后一个小括号实质是调用前边的函数，为了保证前边的函数正常进行又给其套了一层括号，最后括号里边的数为实参，function后面的参数为形参

还有一种写法：

(function(){}());

或者:

!function(){}();

立即执行函数有时候也是可以加名字的：

(function flexible(window,document) {}(window,document));

省一些调用方法

### 2.9.6 逻辑中断!!!

![](../../public/images/feishu/assets/2025-09-02-JS学习-063.png)

这样就不用非得给x,y初始化了

![](../../public/images/feishu/assets/2025-09-02-JS学习-064.png)

代码执行时先看左边

例如：console.log(false && 3+5)

&&逻辑与遇假则假，当执行左边为假时就不执行右边了，所以输出false

&&都是真时，就返回最后一个真值

console.log(11 && 22)

输出22

  

逻辑与：遇真则真

例如：

let age=1

console.log(11 || age++)

不执行后边的age++，先执行左边11为真，就是真，就直接结束语句了，输出11

console.log(11 || 22)

||逻辑或遇到真就直接输出，输出结果为11

||如果都是假的话，就取最后一个假的值了

### 2.9.7 转换为Boolean型

显示转换：

**记忆**： **‘’ 、0、undefined、null、false、NaN 转换为布尔值后都是false, 其余则为 true**

空字符串为假，其他字符串全为真

![](../../public/images/feishu/assets/2025-09-02-JS学习-065.png)

隐式转换：

![](../../public/images/feishu/assets/2025-09-02-JS学习-066.png)

隐式转换:

null+3=3

undefined+3=NaN

null==undefined 输出true,他两个都当0看

null===undefined 输出false

undefined做任何操作都是NaN

NaN不等于NaN，NaN表示计算错误

## 2.10 对象

### 2.10.1 对象的介绍

对象也是一种数据类型，里边的数据是无序的

对象由属性和方法组成

![](../../public/images/feishu/assets/2025-09-02-JS学习-067.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-068.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-069.png)

### 2.10.2 对象属性

![](../../public/images/feishu/assets/2025-09-02-JS学习-070.png)

1.  查询对象
    

对象名.属性 goods.uname

属性名中带有字符串时采用：对象名\['属性名'\] goods\['uname'\]

不带字符串的属性名也可以使用 对象名\['属性名'\]

\[\]语法里面的值如果不添加引号 默认会当成变量解析

  

总结：点后面的属性名一定不要加引号；\[\] 里面的属性名一定加引号(单引双引都🆗)

2.  重新赋值
    

对象名.属性=新值

3.  增加新数据
    

对象名.属性=新值

4.  删除对象中的属性
    

delete 对象名.属性

### 2.10.3 对象方法

![](../../public/images/feishu/assets/2025-09-02-JS学习-071.png)

后边跟的是匿名函数

对象外面的叫函数；对象内部的叫方法

![](../../public/images/feishu/assets/2025-09-02-JS学习-072.png)

### 2.10.4 遍历对象

理解为加括号的python字典遍历

![](../../public/images/feishu/assets/2025-09-02-JS学习-073.png)

k是字符串类型

用for in可以实现对数组的遍历工作，但是k为字符串，我们在遍历的时候需要用到数组的下标，下表是数组字面量，不应该为字符串，所以我们不要使用for in来遍历字典，正常for循环遍历就可以

```html
   let arr = [1, 2, 3]
    for (let k in arr) {
      console.log(k)
      console.log(arr[k])
    }
```

![](../../public/images/feishu/assets/2025-09-02-JS学习-074.png)

数字型控制台输出颜色偏蓝，字符串型控制台打印是黑色的

for in 用来遍历对象 k这个写啥也行，习惯使用key或k

for in 得到的k是属性名

<script>

let pink = {

uname: 'pink老师',

age: 18,

gender: '男',

sing: function () {

document.write('唱歌')

}

}

// 遍历对象

for (let k in pink) {

console.log(k)

console.log(pink\[k\])

}

</script>

k是字符串，不可以进行pink.k，这是不对的，k是带引号的属性名，点k的话，对象中就没有这个属性名了，所以得到的是undefined，无法准确遍历

### 2.10.5 遍历数组对象、

数组中放对象信息

```xml
<script>
    let students = [
      { name: '小明', age: 18, gender: '男', hometown: '河北省' },
      { name: '小红', age: 19, gender: '女', hometown: '河南省' },
      { name: '小刚', age: 17, gender: '男', hometown: '山西省' },
      { name: '小丽', age: 18, gender: '女', hometown: '山东省' }
    ]
    for (let i = 0; i < students.length; i++) {
      for (let k in students[i]) {
        console.log(`输出第${i + 1}个同学的${k}:${students[i][k]}`)
        //输出每个人的名字：
        //console.log(students[i].name)
      }
    }
  </script>
```

### 2.10.6 内置对象

JavaScript内部提供的对象，包含各种属性和方法给开发者调用，例如document.write()

1.  数学对象Math
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-075.png)

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Math

联想：parseInt转换为整数型，与floor相似，输入小数的数字，只取最小值

两者区别是parseInt可以传入字符串，会去掉后边的字符串，只留前边的数字

数组不可以使用Math中的max,min来求最大值与最小值

null是一个空对象，可以认为：null类似于let obj={}

null属于对象数据类型

2.  生成任意范围随机数
    

![](../../public/images/feishu/assets/2025-09-02-JS学习-076.png)

这里加1是想取到右边的部分，因为它是左闭右开，第一个是\[0,11），永远取不到11

乘以几就取不到几

取数组中的随机元素：

let arr = \['red', 'green', 'blue'\]

let random = Math.floor(Math.random() \* arr.length)

console.log(arr\[random\])

  

这个函数得到的是全闭区间

function getRandom(N, M) {

return Math.floor(Math.random() \* (M - N + 1)) + N

}

console.log(getRandom(4, 8))

### 2.10.7 基本数据类型和引用数据类型

![](../../public/images/feishu/assets/2025-09-02-JS学习-077.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-078.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-079.png)

简单数据类型是直接把值放在了栈中，复杂数据类型是将值的地址放在栈中，值放在堆中，通过地址得到存放的内容

![](../../public/images/feishu/assets/2025-09-02-JS学习-080.png)

![](../../public/images/feishu/assets/2025-09-02-JS学习-081.png)

所有复杂数据类型都存放在堆中，将它内容的地址存放在栈中

简单数据类型是深拷贝，复杂数据类型是浅拷贝

js实际是没有堆栈的，这里是为了方便理解，在ts中有堆栈，ts与js百分之80是相同的

