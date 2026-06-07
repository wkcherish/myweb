---
title: 10. JSON与pyecharts折线图
description:
---

# 10. JSON与pyecharts折线图

## 10.1 数据可视化

数据可视化就是把数据转换成图表，让趋势、对比和异常更容易观察。

常见图表：

1. 折线图：看趋势。
2. 柱状图：看分类对比。
3. 饼图：看占比。
4. 地图：看地域分布。
5. 散点图：看两个变量之间的关系。

Python 可视化常用库：

| 库 | 特点 |
| --- | --- |
| matplotlib | 基础、经典、可定制 |
| seaborn | 统计图表更美观 |
| pyecharts | 生成交互式网页图表 |
| plotly | 交互图表能力强 |

黑马入门课程常用 pyecharts 做可视化案例，因为它能快速生成漂亮的 HTML 图表。

## 10.2 JSON回顾

JSON 是一种文本格式，常用于接口数据、配置文件和可视化数据。

Python 字典：

```python
data = {
    "name": "北京",
    "value": 100
}
```

JSON 字符串：

```json
{
  "name": "北京",
  "value": 100
}
```

Python 与 JSON 的转换：

```python
import json

data = {"name": "北京", "value": 100}

json_text = json.dumps(data, ensure_ascii=False)
print(json_text)

new_data = json.loads(json_text)
print(new_data)
```

## 10.3 安装pyecharts

```bash
pip install pyecharts
```

验证：

```python
import pyecharts

print(pyecharts.__version__)
```

如果使用虚拟环境，要先激活环境再安装。

## 10.4 第一个折线图

```python
from pyecharts.charts import Line

line = Line()
line.add_xaxis(["周一", "周二", "周三", "周四", "周五"])
line.add_yaxis("销售额", [100, 120, 90, 150, 180])
line.render("line.html")
```

运行后会生成 `line.html`，用浏览器打开即可看到图表。

核心步骤：

1. 导入图表类。
2. 创建图表对象。
3. 添加 x 轴数据。
4. 添加 y 轴数据。
5. 渲染为 HTML。

## 10.5 全局配置

常用配置在 `pyecharts.options` 中。

```python
from pyecharts import options as opts
from pyecharts.charts import Line

line = Line()
line.add_xaxis(["周一", "周二", "周三", "周四", "周五"])
line.add_yaxis("销售额", [100, 120, 90, 150, 180])
line.set_global_opts(
    title_opts=opts.TitleOpts(title="一周销售额"),
    xaxis_opts=opts.AxisOpts(name="日期"),
    yaxis_opts=opts.AxisOpts(name="金额"),
    tooltip_opts=opts.TooltipOpts(trigger="axis"),
)
line.render("line.html")
```

常见全局配置：

| 配置 | 作用 |
| --- | --- |
| `TitleOpts` | 标题 |
| `LegendOpts` | 图例 |
| `TooltipOpts` | 提示框 |
| `AxisOpts` | 坐标轴 |
| `VisualMapOpts` | 视觉映射 |
| `DataZoomOpts` | 区域缩放 |

## 10.6 系列配置

系列配置作用于某一组数据。

```python
line.add_yaxis(
    series_name="销售额",
    y_axis=[100, 120, 90, 150, 180],
    is_smooth=True,
    label_opts=opts.LabelOpts(is_show=True),
)
```

常用参数：

1. `series_name`：系列名称。
2. `y_axis`：y 轴数据。
3. `is_smooth`：是否平滑曲线。
4. `label_opts`：标签配置。
5. `symbol_size`：标记点大小。

## 10.7 多条折线

```python
from pyecharts import options as opts
from pyecharts.charts import Line

dates = ["周一", "周二", "周三", "周四", "周五"]

line = Line()
line.add_xaxis(dates)
line.add_yaxis("线上销售", [100, 130, 120, 160, 200], is_smooth=True)
line.add_yaxis("线下销售", [80, 90, 100, 120, 150], is_smooth=True)
line.set_global_opts(
    title_opts=opts.TitleOpts(title="线上线下销售趋势"),
    tooltip_opts=opts.TooltipOpts(trigger="axis"),
)
line.render("sales.html")
```

多条折线适合比较不同指标或不同地区。

## 10.8 从JSON文件读取数据

假设 `sales.json`：

```json
[
  {"date": "周一", "online": 100, "offline": 80},
  {"date": "周二", "online": 130, "offline": 90},
  {"date": "周三", "online": 120, "offline": 100}
]
```

读取并绘图：

```python
import json
from pyecharts import options as opts
from pyecharts.charts import Line

with open("sales.json", "r", encoding="utf-8") as file:
    data = json.load(file)

dates = []
online_sales = []
offline_sales = []

for item in data:
    dates.append(item["date"])
    online_sales.append(item["online"])
    offline_sales.append(item["offline"])

line = Line()
line.add_xaxis(dates)
line.add_yaxis("线上销售", online_sales, is_smooth=True)
line.add_yaxis("线下销售", offline_sales, is_smooth=True)
line.set_global_opts(
    title_opts=opts.TitleOpts(title="销售趋势"),
    tooltip_opts=opts.TooltipOpts(trigger="axis"),
)
line.render("sales.html")
```

## 10.9 数据清洗

真实数据经常不整齐，需要清洗。

常见问题：

1. 数字是字符串。
2. 字段缺失。
3. 空值。
4. 日期格式不统一。

示例：

```python
raw_data = [
    {"date": "周一", "sales": "100"},
    {"date": "周二", "sales": ""},
    {"date": "周三", "sales": "120"},
]

dates = []
sales = []

for item in raw_data:
    value = item.get("sales")
    if not value:
        continue

    dates.append(item["date"])
    sales.append(int(value))

print(dates)
print(sales)
```

## 10.10 小案例：每日销售额折线图

```python
from pyecharts import options as opts
from pyecharts.charts import Line

sales = [
    {"date": "2024-10-01", "amount": 1200},
    {"date": "2024-10-02", "amount": 1800},
    {"date": "2024-10-03", "amount": 1500},
    {"date": "2024-10-04", "amount": 2100},
    {"date": "2024-10-05", "amount": 2600},
]

dates = [item["date"] for item in sales]
amounts = [item["amount"] for item in sales]

line = Line()
line.add_xaxis(dates)
line.add_yaxis(
    series_name="销售额",
    y_axis=amounts,
    is_smooth=True,
    label_opts=opts.LabelOpts(is_show=True),
)
line.set_global_opts(
    title_opts=opts.TitleOpts(title="每日销售额"),
    xaxis_opts=opts.AxisOpts(name="日期"),
    yaxis_opts=opts.AxisOpts(name="金额"),
    tooltip_opts=opts.TooltipOpts(trigger="axis"),
    datazoom_opts=[opts.DataZoomOpts()],
)
line.render("daily_sales.html")
```

`datazoom_opts` 可以让图表支持拖拽缩放，数据量大时很有用。

## 10.11 小案例：疫情趋势折线图结构

如果数据结构如下：

```python
data = {
    "北京": [
        {"date": "2024-01-01", "confirm": 10},
        {"date": "2024-01-02", "confirm": 12},
    ],
    "上海": [
        {"date": "2024-01-01", "confirm": 8},
        {"date": "2024-01-02", "confirm": 13},
    ],
}
```

绘制多地区趋势：

```python
from pyecharts import options as opts
from pyecharts.charts import Line

dates = [item["date"] for item in data["北京"]]

line = Line()
line.add_xaxis(dates)

for city, records in data.items():
    values = [item["confirm"] for item in records]
    line.add_yaxis(city, values, is_smooth=True)

line.set_global_opts(
    title_opts=opts.TitleOpts(title="多地区趋势图"),
    tooltip_opts=opts.TooltipOpts(trigger="axis"),
)
line.render("trend.html")
```

这种思路适合一批地区、一批商品或一批指标的趋势对比。

## 10.12 易错点

1. `add_xaxis()` 的数据数量要和 y 轴数量对应。
2. `render()` 生成的是 HTML，不是图片。
3. JSON 字符串用 `json.loads()`，JSON 文件用 `json.load()`。
4. 中文 JSON 保存时加 `ensure_ascii=False`。
5. pyecharts 图表不能在纯终端里直接显示，需要浏览器打开 HTML。

## 10.13 本章练习

1. 安装 pyecharts 并生成第一个折线图。
2. 用 JSON 文件保存一周销售数据，并读取绘制图表。
3. 绘制两条折线，对比线上和线下销售额。
4. 给折线图添加标题、坐标轴名称、提示框和缩放条。
5. 对含有空值的销售数据进行清洗后再绘图。

