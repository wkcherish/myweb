---
title: 5. HTML表格列表与表单
description: 
---

# 5. HTML表格列表与表单

## 5.1 表格标签

①表格的作用：表格主要是用于显示、展示数据，因为它可以使数据显示的非常的规整，可读性非常好。

特别是后台展示数据的时候，能够熟练运用表格就显得很重要。一个清爽简约的表格能够把繁杂的数据处理的很有条理。

②表格基本语法：

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-002.png">

③表头单元格标签：一般表头单元格位于第一行或者第一列，表头单元格里面的文本内容加粗居中显示

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-003.png">

④表格属性：表格属性实际在开发中不常用，基本都是用css来实现的

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-004.png">

⑤表格结构标签：解决表格过长问题，将表格分割成表格头部和表格主体

`<thead>`标签表格的头部区域，用于定义表格的头部，`<thead>`内部必须拥有`<tr>`标签，一般位于第一行，`<thead>`比`<th>`范围广

`<tbody>`标签表格的主体区域，用于定义表格的主体，用于放数据文本

## 5.2 合并单元格

（1）合并单元格方式：

①跨行合并：rowspan="合并单元格的个数"

②跨列合并：colspan="合并单元格的个数"

（2）目标单元格：

①跨行：最上侧单元格为目标单元格，写合并单元格

②跨列：最左侧单元格为目标单元格，写合并单元格

## 5.3 列表标签

（1）分类：无序列表、有序列表、自定义列表

①无序列表：

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-005.png">

无序列表的各个列表项之间顺序级别之分，是并列的

`<ul>``</ul>`中只能嵌套`<li>``</li>`，直接在`<ul>``</ul>`中输入其他标签或文字是不对的

`<li>``</li>`之间相当于一个容器，可以容纳所有元素

无序列表会带有自己的样式属性，但实际还是用css来设置

在css中去除前边的小圆点采用如下代码:

暂时无法在飞书文档外展示此内容

②有序列表：

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-006.png">

③自定义列表：

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-007.png">

  

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-008.png">

## 5.4 表单标签

一个完整表单通常由表单域、表单控件（也称表单元素）和提示信息3个部分组成

（1）表单域：包含单元素的区域，`<form>`标签可以实现信息的收集和传递。

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-009.png">

autocomplete属性是历史记录，记录表单输入信息，有两个值，一个off，一个on，为true时过几天点击表单，获得焦点时会显示前几天输入的信息

  

表单元素提交必须有name属性

注意点：①写表单元素前，应该有表单域把他们进行包含；②表单域是form标签

(2)表单控件：可以定义各种表单元素，这些表单元素就是允许用户在表单中输入或选择的内容控件

①`<input>`输入表单元素

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-010.png">

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-011.png">

单选按钮：`<input type="radio" name="danxuan">`

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-012.png">

写法差异源于不同版本的 HTML 或 XHTML 规范

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-013.png">

**注意点** ：name和value是每个表单元素都有的属性值，主要给后台人员使用；name表单元素的名字，要求单选按钮和复选按钮有相同的name值；checked属性主要针对于单选按钮和复选框，主要作用一打开页面，就要可以默认选中某个表单元素；maxlength是用户可以在表单输入的最大字符数

②select下拉表单元素：可以节约页面控件

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-014.png">

**注意点：** `<select>`中至少包含一对`<option>`；在`<option>`中定义selected="selected"时，当前项即为默认中选项

③`<textarea>`:适用于输入内容较多的场景

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-015.png">

3行20列

## 5.5 `<lable>`标签

它不是表单标签，但常常与表单标签搭配使用，`<lable>`标签用于绑定一个表单标签，当点击`<lable>`标签内的文本

时，浏览器就会自动将焦点（光标）转到或者选择对应的表单元素上，以增加用户体验

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-016.png">

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-017.png">

## 5.6 实例

<img style="max-width:100%" src="../../public/images/feishu/assets/2024-10-10-Html和CSS学习-018.png">
