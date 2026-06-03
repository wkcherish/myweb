# 2.函数
## 2.1函数概述
1. 函数的定义一般主要有5个步骤：返回值类型、函数名、参数表列、函数体语句、return表达式
2. 语法：
```text
返回值类型 函数名 （参数列表）
{
    函数体语句
    return 表达式
}
```
小案例
```c++
//num1,num2形参
int add(int num1,int num2)
{
    int sum=num1+num2;
    return sum;
}
```
## 2.2函数调用
调用刚刚写的求和函数
```c++
int main()
{
    //a,b实参
    int a=0;
    int b=0;
    cin>>a,b;
    //调用函数时，实参值传给了形参
    cout<<add(a,b);
}
```
## 2.3值传递
值传递就是函数调用时实参将数值传给形参

值传递时，如果形参发生任何改变，不会影响实参

如果函数不需要返回值，声明的时候可以写void,此时函数返回值可以写return；或者直接不写
```c++
void swap(int num1,int num2)
{
    cout<<"交换前："<<endl;
    cout<<"num1="<<num1<<endl;
    cout<<"num2="<<num2<<endl;
    int temp=num1;
    num1=num2;
    num2=temp;
    cout<<"交换后："<<endl;
    cout<<"num1="<<num1<<endl;
    cout<<"num2="<<num2<<endl;
    return;//或者不写
}
int main()
{
    int a=10;
    int b=20;
    swap(a,b);
}
```
## 2.4函数的常见形式
1. 无参无返
```c++
void test01()
{
    cout<<"你好"<<endl;
}
int main()
{
    //函数调用
    test01();
}
```
2. 有参无返
```c++
void test02(int a)
{
    cout<<"你好"<<endl;
}
int main()
{
    test02(100);
}
```
3. 无参有返
```c++
int test03()
{
    cout<<"你好"<<endl;
    return 100;
}
int main()
{
    int num1=test03();
    cout<<"num1="<<num1<<endl; //100
}
```
4.有参有返
```c++
int test04(int a)
{
    cout<<"hello"<<endl;
    return a;
}
int mian()
{
    int b=1;
    int c=test04(b);
    cout<<c<<endl; //1
}
```

## 2.5函数的声明
作用：告诉编译器函数名称以及如何调用函数，函数的实际主体可以单独定义

函数的**声明可以多次，但是函数的定义只能有一次**
```c++
//函数声明
//比较函数，实现两个整型数字进行比较，返回较大的值
int max(int a,int b);//这样函数就可以写在后面，不报错了
int main() 
{
    int a=10;
    int b=20;
    cout<<max(a,b)<<endl;
}
int max(int a,int b)
{
    return a>b?a:b;
}
```
## 2.6函数的分文件编写
4个步骤：
* 1.创建后缀名为.h的头文件
* 2.创建后缀名为.cpp的源文件
* 3.在头文件中写函数的定义
* 4.在源文件中写函数的定义
示例：

头文件：swap.h
```c++
#include<iostream>
using namespace std;
//函数声明
void swap(int a,int b);
```
源文件：swap.cpp
```c++
#include "swap.h"
//函数的定义
void swap(int a,int b)
{
    int temp=a;
    a=b;
    b=temp;
    cout<<"a="<<a<<endl;
    cout<<"b="<<b<<endl;
}
```