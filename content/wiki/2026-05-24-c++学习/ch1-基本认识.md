# 1.基础入门
## 1.1注释
//或者/* */
## 1.2命名
1. 字母数字下划线
2. 开头必须是字母或_
3. 不能使用关键词
## 1.3数据类型
### 1.3.1整形
short 短整形 2

int 整形 4

long 长整形 win4 linux32位4 linux64位8

long long 长长整形 8

利用sizeof可以求数据类型占用的内存空间大小 
```c++
sizeof(int)
sizeof(num)
```
### 1.3.2浮点型
float 单精度 4节 7位有效数字

double 双精度 8节 15-16有效数字

默认情况下，输出一个小数，会显示6位有效数字

注意点：
```c++
float f1=3.14f; //要写上f,编辑器默认是双精度，鼠标放上去也是双精度，用float的变量去接受这个数字时会多做一步从双精度到单精度的转换，写上f就直接是单精度
float f2=3e2; //科学记数法
```
### 1.3.3字符型
```c++
char ch='a'
```
注意点：
1. 在显示字符型变量时，只能单引号，双引号x
2. 单引号内只能一个字符，不能字符串
3. c和c++字符型变量只占用一个字符
4. 字符型变量并不是把字符本身放到内存中存储，而是将对应的ASCII编码放入到存储单元

ASCII码大致由以下两部分组成：
1. ASCII非打印控制字符：ASCII表上的数字0-31分配给了控制字符，用于控制像打印机等一些外围设备
2. ASCII打印字符：数字32-126分配给了能在键盘上找到的字符，当查看或打印文档时就会出现（65A；97a）

ASCII码表格：

| **ASCII**值 | **控制字符** | **ASCII**值 | **字符** | **ASCII**值 | **字符** | **ASCII**值 | **字符** |
| ----------- | ------------ | ----------- | -------- | ----------- | -------- | ----------- | -------- |
| 0           | NUT          | 32          | (space)  | 64          | @        | 96          | 、       |
| 1           | SOH          | 33          | !        | 65          | A        | 97          | a        |
| 2           | STX          | 34          | "        | 66          | B        | 98          | b        |
| 3           | ETX          | 35          | #        | 67          | C        | 99          | c        |
| 4           | EOT          | 36          | $        | 68          | D        | 100         | d        |
| 5           | ENQ          | 37          | %        | 69          | E        | 101         | e        |
| 6           | ACK          | 38          | &        | 70          | F        | 102         | f        |
| 7           | BEL          | 39          | ,        | 71          | G        | 103         | g        |
| 8           | BS           | 40          | (        | 72          | H        | 104         | h        |
| 9           | HT           | 41          | )        | 73          | I        | 105         | i        |
| 10          | LF           | 42          | *        | 74          | J        | 106         | j        |
| 11          | VT           | 43          | +        | 75          | K        | 107         | k        |
| 12          | FF           | 44          | ,        | 76          | L        | 108         | l        |
| 13          | CR           | 45          | -        | 77          | M        | 109         | m        |
| 14          | SO           | 46          | .        | 78          | N        | 110         | n        |
| 15          | SI           | 47          | /        | 79          | O        | 111         | o        |
| 16          | DLE          | 48          | 0        | 80          | P        | 112         | p        |
| 17          | DCI          | 49          | 1        | 81          | Q        | 113         | q        |
| 18          | DC2          | 50          | 2        | 82          | R        | 114         | r        |
| 19          | DC3          | 51          | 3        | 83          | S        | 115         | s        |
| 20          | DC4          | 52          | 4        | 84          | T        | 116         | t        |
| 21          | NAK          | 53          | 5        | 85          | U        | 117         | u        |
| 22          | SYN          | 54          | 6        | 86          | V        | 118         | v        |
| 23          | TB           | 55          | 7        | 87          | W        | 119         | w        |
| 24          | CAN          | 56          | 8        | 88          | X        | 120         | x        |
| 25          | EM           | 57          | 9        | 89          | Y        | 121         | y        |
| 26          | SUB          | 58          | :        | 90          | Z        | 122         | z        |
| 27          | ESC          | 59          | ;        | 91          | [        | 123         | {        |
| 28          | FS           | 60          | <        | 92          | /        | 124         | \|       |
| 29          | GS           | 61          | =        | 93          | ]        | 125         | }        |
| 30          | RS           | 62          | >        | 94          | ^        | 126         | `        |
| 31          | US           | 63          | ?        | 95          | _        | 127         | DEL      |

ASCII 码大致由以下**两部分组**成：

* ASCII 非打印控制字符： ASCII 表上的数字 **0-31** 分配给了控制字符，用于控制像打印机等一些外围设备。
* ASCII 打印字符：数字 **32-126** 分配给了能在键盘上找到的字符，当查看或打印文档时就会出现。
### 1.3.4转义字符
```c++
//换行符
cout <<"hello world/n"; //就等同于如下：
cout <<"hello world"<<endl;
//反斜杠
cout <<"//"<<endl;
//水平制表符
cout <<"aaaa\thelloworld"<<endl; //输出窗口时有对齐效果
```
### 1.3.5字符串型
char 变量名[]="字符串值"
```c++
//c风格字符串
//注意事项：
//1.char字符串名[]
//2.等号后面要用双引号，包含起来字符串
char str[]="hello world";
cout <<str<<endl;
//c++风格字符串
//需要先引用一个头文件 #include<string>
string str2="hello world";
cout <<str2<<endl;
```
### 1.3.6布尔类型bool
```c++
bool flag=true;
cout<<sizeof(flag)<<endl; //查看布尔占内存空间
```
## 1.4键盘输入cin
```c++
int a=0;
cout<<"请给整型变量a赋值"<<a<<endl;
cin >> a;
cout << "整型变量a=" <<a<<endl; 
```
## 1.5运算符
### 1.5.1算术运算符
![](/images/feishu/assets/2026-05-24-c++学习-001.png)
注意：
1. 两个整数相除，结果依然是整数，小数部分被去除掉了
2. 两个小数不可以做取模运算
3. 前置递增++a;后置递增a++，两者区别：前置递增先让变量+1,再进行表达式计算；后置递增是先让表达式运算，再让变量+1
### 1.5.2赋值运算符
![](/images/feishu/assets/2026-05-24-c++学习-002.png)
### 1.5.3比较运算符
![](/images/feishu/assets/2026-05-24-c++学习-003.png)
### 1.5.4逻辑运算符
![](/images/feishu/assets/2026-05-24-c++学习-004.png)
## 1.6程序流程结构
### 1.6.1选择结构
1. if语句
单行、多行、多条件if语句
```c++
//单行格式if语句：if (条件){条件满足执行的语句}
if(score>600)
{
    cout<<'这是单行if语句'<<endl;
}
//多行格式if语句：if (条件){条件满足执行的语句}else{条件不满足执行的语句}
cin >> score
if(score<=600)
{
    cout>>"小于等于600"<<endl;
}
else
{
    cout>>"大于600">>endl;
}
//多条件格式if语句：if (条件){条件1满足执行的语句}else if{条件2满足执行的语句}····else{条件不满足执行的语句}
if (0<num<100)
{
    cout<<"小于100"<<endl;
}
else if (nmu>=100&&num<200)
{
    cout<<"不小于100且小于200"<<endl; //可以无限else if,python中是elif：
}
else
{
    cout<<"不小于200"<<endl;
}
// 嵌套if语句(if套if,注意条件即可)
```
2. 三目运算符
```c++
//创建三个变量a,b,c
//将a和b做比较，将变量大的值赋值给变量c
int a=20,b=10,c=0;
c=(a>b?a:b)
cout<<"c="<<c<<endl;
//在c++中三目运算符返回的是变量，可以继续赋值
(a>b?a:b)=100;
cout<<a<<endl; //100  a是大于b的，将100赋值给了a
cout<<b<<endl; //10   a>b,b还是原值
```
3. switch语句
执行多条件分支语句
注意：python没有switch语句
switch(表达式)
{
    case 结果1:执行语句;break;
    case 结果2:执行语句;break;
    case 结果3:执行语句;break;
    ···
    default:执行语句;break;
}
不写break就会一直往下执行
```c++
//案例-电影打分
#include<iostream>
using namespace std;
int main()
{
    int score=0;
    cout<<"电影打分："<<endl;
    cin>>score;
    switch(score)
    {
        case 10:cout<<"经典"<<endl;break;
        case 9:cout<<"经典"<<endl;break;
        case 8:cout<<"非常好"<<endl;break;
        case 7:cout<<"非常好"<<endl;break;
        case 6:cout<<"一般"<<endl;break;
        case 5:cout<<"一般"<<endl;break;
        default:cout<<"烂片"<<endl;break;
    }
}
```
if和switch区别：
* switch缺点：判断时候只能是整行或者字符型，不可以是一个区间
* switch优点：结构清晰，执行效率高
### 1.6.2循环结构
1. while循环结构
满足循环条件，执行循环语句
语法：while(循环条件){循环语句}
```c++
//打印0-9数字
int main()
{
    int num=0;
    while(num<10)
    {
       std::cout<<num<<std::endl;
        num++;
    }
    system("pause")
}
```
注意：写好循环条件，避免死循环情况
```c++
//循环结构-猜数字
#include <iostream>
#include <ctime>
using namespace std;
int main()
{
    //添加随机数种子，利用当前系统时间生成随机数，防止每次随机数相同
    srand((unsigned int)time(NULL));

    //1.系统生成随机数
    //rand()%100 //生成0-99的随机数
    int num=rand()%100+1; //这是个伪随机数，每次都不同，要想每次不同就添加随机数种子
    //cout<<"系统生成了一个1-100之间的随机数，请你来猜："<<endl;
    //2.玩家猜测
    int val=0;
    while (1)
    {
        cin>>val;
        //3.判断玩家猜测
        if(val<num) 
        {
            cout<<"猜小了！"<<endl;
        }
        else if (val>num)
        {
            cout<<"猜大了！"<<endl;
        }
        else
        {
            cout<<"猜对了！"<<endl;
            break;
        }
        //猜对 退出游戏
        //猜错 提示猜的结果 过大或者过小 重新返回第二步
    }
}
```
2. do...while循环结构
语法： do{循环语句}while(循环条件)；
与while的区别在于**do...while会先执行一次循环语句**，在判断循环语句
```c++
//在屏幕中输出0-9这10个数字
int main()
{
    int num=0;
    do 
    {
        std::cout<<num<<std::endl;
        num++
    }
    while(num<10);
    system("pause");
}
```
案例-水仙花数

描述：水仙花数是指一个3位数，它的每个位上的数字的3次幂之和等于它本身

例如：1^3+5^3+3^3=153

请用do...while语句，求出所有3位数的水仙花数
```c++
#include <iostream>
using namespace std;
int main()
{
    //1.先打印所有三位数字
    int num=100;
    do 
    {
        //2.从所有三位数字中找到水仙花数
        int a=0; //个位
        int b=0; //十位
        int c=0; //百位
        a=num%10;
        b=num/10%10;
        c=num/100;
        if(a*a*a+b*b*b+c*c*c == num) //如果是水仙花数，才打印
        {
            cout<<num<<endl;
        }
        num++;
    }
    while (num < 1000);
}
```
3. for循环语句
语法：for(起始表达式；条件表达式；末尾循环体){循环语句;}
```c++
//从数字0-9打印
for(int i=0;i<10;i++)
{
    cout<<i<<endl;
}
//上式可以进行拆分
int i=0
for(;;;)
{
    if(i>=10)
    {
        break;
    }
    cout<<i<<endl;
    i++;
}
```
小练习
```c++
#include<iostream>
using namespace std;
int main()
{
    //敲桌子案例
    //1.先输出1-100的数字
    for(int i=1; i<=100; i++)
    {
        //2.从100个数字中找到特殊数字，打印敲桌子
        //如果是7的倍数、个为有7、或者十位有7,打印敲桌子
        if(i%7==0 || i%10==7 || i/10==7)
        {
            cout<<"敲桌子"<<endl;
        }
        else
        {
            cout<<i<<endl;
        }
    }
}
```
嵌套实现星图
```c++
#include<iostream>
using namespace std;
int main()
{
    for (int i=0;i<10;i++)
    {
        for (int j=0;j<10;j++)
        {
            cout<<"*";
        }
        cout<<endl;
    }
}
```
乘法口诀表
```c++
#include <iostream>
using namespace std;
int main()
{
    for(int i=1;i<10;i++)
    {
        for(int j=1;j<=i;j++)
        {
            cout<<j<<"*"<<i<<"="<<i*j<<'\t';
        }
        cout<<endl;
    }
} 
```
### 1.6.3跳出语句
1. break语句
作用：用于跳出选择结构或者循环结构

break使用时机：
* 出现在switch条件语句中，作用是终止case并跳出switch
* 出现在循环结构中，作用是跳出当前的循环结构
* 出现在嵌套循环中，跳出最近的内层循环语句
2. continue语句
作用：在循环语句中，跳过本次循环中余下尚未执行的语句，继续执行下一次循环
3. goto语句
语法：goto 标记;

解释：如果标记的名称存在，执行到goto语句时，会跳转到标记的位置（类似于html中的a标签）
```c++
int main()
{
    cout<<"1"<<endl;
    goto FLAG;
    cout<<"2"<<endl;
    cout<<"3"<<endl;
    cout<<"4"<<endl;
    FLAG:
    cout<<"5"<<endl;//跳过了2,3,4,直接到5
}
```
## 1.7数组
### 1.7.1一维数组
1. 一维数组定义方式

| 方式 | 注意事项 |
| --- | --- |
| 数据类型 数组名[数组长度];| 这种方式是先定义再arr[i]赋值 |
| 数据类型 数组名[数组长度]={值1,值2....}; | 如果在初始化数据时，没有全部填写完，会用0来填补剩余数据 |
| 数据类型 数组名[]={值1,值2....}; | int arr[];这是不正确的，按照这样的方式定义必须有初始长度 |
2. 一维数组数组名
用途：
* 1.可以统计整个数组在内存中的长度：
```c++
sizeof(arr);
sizeof(arr[0]);
```
* 2.可以获取数组在内存中的首地址: 
```c++
//查看16进制的首地址
cout<<arr<<endl;
//看10进制数
cout<<(int)&arr[0]<<endl;
```
数组名是常量，不可以进行赋值操作
3. 小案例
* 1️⃣五只小猪称体重
```c++
#include<iostream>
using namespace std;
int main()
{
    int arr[5]={300,350,200,400,250};
    int tmp=0;
    for (int i=0;i<5;i++)
    {
        if(tmp<arr[i])
        {
            tmp=arr[i];
        }
    }
    cout<<tmp<<endl;
    return 0;
}
```
* 2️⃣数组元素逆置
```c++
//元素逆置
#include<iostream>
using namespace std;
int main()
{
   int arr[5]={1,2,3,4,5};
   int start=0;//起始下标
   int end=sizeof(arr)/sizeof(arr[0])-1;//结束下标
   while (start<end)
   {
    //实现元素互换代码
    int temp=arr[start];
    arr[start]=arr[end];
    arr[end]=temp;
    //下标更新
    start++;
    end--;
   }
   //输出逆置后的数组
   for (int i=0;i<5;i++)
   {
    cout<<arr[i]<<" ";
   }
   system("pause");
   return 0;
}
```
* 3️⃣冒泡排序
对数组元素进行排序，做法：
比较相邻的元素，如果第一个比第二个大，就交换他们；对每一对相邻元素做同样的工作，执行完毕后，找到第一个最大值；重复以上的步骤，每次比较次数-1,直到不需要比较
```c++
//冒泡排序,升序
#include<iostream>
using namespace std;
int main()
{
    int arr[9] = {4,2,8,0,5,7,1,3,9};
    cout<<"排序前："<<endl;
    for (int i=0;i<9;i++)
    {
        cout<<arr[i]<<" ";
    }
    //开始冒泡排序
    //总共排序轮数为 元素个数-1
    for (int i=0;i<9-1;i++)
    {
        //内层循环对比 次数=元素个数-1-当前轮数
        for (int j=0;j<9-i-1;j++)
        {
            //如果前一个元素大于后一个元素，则交换它们
            if(arr[j]>arr[j+1])
            {
                int temp=arr[j];
                arr[j]=arr[j+1];
                arr[j+1]=temp;
            }
        }
    }
    cout<<"排序后："<<endl;
    for (int i=0;i<9;i++)
    {
        cout<<arr[i]<<" ";
    }
    return 0;
}
```
### 1.7.2二维数组
1. 二维数组的四种定义方式

| 序号 | 方式 |
| --- | --- |
| 1 | 数据类型 数组名[行数][列数]; |
| 2 | 数据类型 数组名[行数][列数]={ {数据1,数据2}，{数据3，数据4}... } |
| 3 | 数据类型 数组名[行数][列数]={数据1,数据2,数据3...} |
| 4 | 数据类型 数组名[][列数]={数据1,数据2,数据3...} |
注意：不能只省略列数

2. 二维数组数组名
* 1.查看二维数组所占内存空间
* 2.获取二维数组首地址

已知二维数组，求二维数组的行数与列数
```c++
int main()
{
    int arr[2][3]=
    {
        {1,2,3},
        {4,5,6}
    };
    cout<<"二维数组的行数"<<sizeof(arr)/sizeof(arr[0])<<endl;
    cout<<"二维数组的列数"<<sizeof(arr[0])/sizeof(arr[0][0])<<endl;
}
```
查看二维数组首地址
```c++
cout<<"二维数组首地址："<<arr<<endl;
cout<<"二维数组第一行的首地址："<<(int)arr[0]<<endl;
cout<<"二维数组第二行的首地址："<<(int)arr[1]<<endl;
cout<<"二维数组第一个元素的首地址:"<<(int)&arr[0][0]<<endl;//对于数，要加取址符
```