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