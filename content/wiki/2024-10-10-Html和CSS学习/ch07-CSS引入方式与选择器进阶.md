---
title: 7. CSS引入方式与选择器进阶
description: 
---

# 7. CSS引入方式与选择器进阶

## 7.1 css引入方式

### 7.1.1 内部样式表（嵌入式）

```Html
<style>
  h1 {
    color: blue;
    font-size: 24px;
  }
</style>
```

**注意点** ：

①`<style>`理论上可以放在HTML文档的任意位置，但一般会放在`<head>`标签中

②通过这种方式可以方便控制整个页面的元素样式设置

③代码结构清晰，但是并没有实现结构与样式的完全分离

### 7.1.2 行内样式表（行内式）

```Html
<p style="color: red; font-size: 16px;">这是一个段落</p>
```

**注意点** ：

①style其实就是标签的属性

②在双引号中间，写法要符合css规范

③可以控制当前的标签设置样式

④书写繁琐，简单时才用

⑤使用行内样式表设定css，通常也被称为行内式引入

### 7.1.3 外部样式表（链接式）

使用最多，单独建一个css文件，然后html引用

①css文件部分： style.css

```Css
/* style.css */
h1 {
  color: blue;
  font-size: 24px;
}
```

②html部分

```Html
<link rel="stylesheet" href="style.css">
```

`<hr>`水平线标签（但是不常用！）

ctrl+0回到页面原来大小

## 7.2 Emmet语法 可以实现快速生成HTML结构语法和快速生成CSS样式语法

### 7.2.1 快速生成html

①生成标签直接输入标签名按tab键即可比如div然后tab键，就可以生成`<div>``</div>`

②如果想要生成多个相同标签加上\*就可以了比如div\*3就可以快速生成3个div

③如果有父子级关系的标签，可以用>比如ul>li就可以了

④如果有兄弟关系的标签，用+就可以了比如div+p

⑤如果生成带有类名或者id名字的，直接写.demo或者#twotab键就可以了

⑥如果生成的div类名是有顺序的，可以用自增符号$

⑦如果想要在生成的标签内部写内容可以用{}表示

```Html
<!-- Emmet 语法示例 -->
<!-- div*3        → 生成3个div -->
<!-- ul>li*5      → ul下生成5个li -->
<!-- div+p        → 兄弟div和p -->
<!-- .demo        → <div class="demo"></div> -->
<!-- #two         → <div id="two"></div> -->
<!-- .demo$*3     → demo1, demo2, demo3 -->
<!-- div{内容}     → <div>内容</div> -->
```

### 7.2.2 快速生成css

简写开头

①比如w200按tab可以生成width:200px; ②比如lh26px按tab可以生成line-height:26px;

## 7.3 css复合选择器

### 7.3.1 后代选择器

```Css
.parent .child {
  color: blue;
}
```

元素1 元素2 {样式声明}

**注意点:**

①元素1和元素2中间用空格隔开

②元素1是父级，元素2是子级，最终选择的是元素2

③元素2可以是儿子，也可以是孙子等，只要是元素1的后代即可

④元素1和元素2可以是任意基础选择器

### 7.3.2 子选择器 元素1 > 元素2 {样式声明}

**注意点:**

①元素1和元素2中间用大于号隔开

②元素1是父级，元素2是子级，最终选择的是元素2

③元素2必须是亲儿子，其孙子、重孙之类都不归他管.你也可以叫他亲儿子选择器

### 7.3.3 并集选择器

元素1，元素2 {样式声明}

**注意点:**

①元素1和元素2中间用逗号隔开

②逗号可以理解为和的意思

③并集选择器通常用于集体声明

### 7.3.4 链接伪类选择器

**注意点:**

①为了确保生效，请按照 LVHA 的循顺序声明 :link－:visited－:hover－:active。

②伪类选择器书写最大的特点是用冒号（:）表示，比如 :hover 、 :first-child 。

③ 因为 a 链接在浏览器中具有默认样式，所以我们实际工作中都需要给链接单独指定样式

link对没访问的进行设置

vistied对已访问的进行改变

hover鼠标经过就会变

active常按(点)就会变

```Css
/* 链接伪类选择器 —— 按 LVHA 顺序 */
a:link {
  color: #333;
  text-decoration: none;
}
a:visited {
  color: purple;
}
a:hover {
  color: skyblue;
  text-decoration: underline;
}
a:active {
  color: green;
}
```

### 7.3.5 :focus伪类选择器

:focus 伪类选择器用于选取获得焦点的表单元素。 焦点就是光标，一般情况 `<input>` 类表单元素才能获取，因此这个选择器也主要针对于表单元素来说。

```Css
input:focus {
  border-color: skyblue;
  outline: none;
}
```
