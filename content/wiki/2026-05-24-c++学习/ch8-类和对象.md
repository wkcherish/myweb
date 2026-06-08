# 8.类和对象
C++面向对象的三大特性为**封装、继承、多态**

C++认为**万事万物都皆为对象**，对象上有其属性和行为

**例如：**

​	人可以作为对象，属性有姓名、年龄、身高、体重...，行为有走、跑、跳、吃饭、唱歌...

​	车也可以作为对象，属性有轮胎、方向盘、车灯...,行为有载人、放音乐、放空调...

​	具有相同性质的对象，我们可以抽象称为类，人属于人类，车属于车类

## 8.1封装
### 8.1.1封装的意义
封装是C++面向对象三大特性之一

封装的意义：

* 将属性和行为作为一个整体，表现生活中的事物
* 将属性和行为加以权限控制

**封装意义一：**

​	在设计类的时候，属性和行为写在一起，表现事物

**语法：** `class 类名{   访问权限： 属性  / 行为  };`
1. **示例1：**设计一个圆类，求圆的周长
```c++
class Circle
{
    //访问权限
    //公共权限
public:
    //属性
    int m_r;
    //行为
    double calculateZC()
    {
        return 2*PI*m_r;
    }
};
int main()
{
    //通过圆类 创建具体的圆(对象)
    //实例化（通过一个类 创建一个对象的过程）
    Circle c1;
    //给圆对象 的属性进行赋值
    c1.m_r=10;
    cout<<"圆的周长"<<c1.calculateZC()<<endl;
}
```
案例：设计一个学生类，属性有姓名和学号，可以给姓名和学号赋值，可以显示学生的姓名和学号
```c++
#include<iostream>
using namespace std;
#include<string>
class Student
{
public:
    string m_name;
    int m_id;
    //赋值姓名
    void setName(string name)
    {
        m_name=name;
    }
    //赋值学号
    void setId(int id)
    {
        m_id=id;
    }
    //打印学生信息
    void printInfo()
    {
        cout<<"姓名："<<m_name<<" "<<"学号："<<m_id<<endl;
    }
};
int main()
{
    //实例化
    Student s1;
    s1.setName("张三");
    s1.setId(123456);
    s1.printInfo();
}
```
类中的属性和行为统称为成员

属性：成员属性(成员变量)

方法：成员函数(成员方法)

**封装意义二：**

类在设计时，可以把属性和行为放在不同的权限下，加以控制

访问权限有三种：
1. public        公共权限  
2. protected 保护权限
3. private      私有权限

**示例：**

```C++
//三种权限
//公共权限  public     类内可以访问  类外可以访问
//保护权限  protected  类内可以访问  类外不可以访问  儿子可以访问父亲中的保护内容
//私有权限  private    类内可以访问  类外不可以访问  儿子不可以访问父亲中的保护内容

class Person
{
	//姓名  公共权限
public:
	string m_Name;

	//汽车  保护权限
protected:
	string m_Car;

	//银行卡密码  私有权限
private:
	int m_Password;

public:
	void func()
	{
		m_Name = "张三";
		m_Car = "拖拉机";
		m_Password = 123456;
	}
};

int main() {

	Person p;
	p.m_Name = "李四";
	//p.m_Car = "奔驰";  //保护权限类外访问不到
	//p.m_Password = 123; //私有权限类外访问不到

	system("pause");

	return 0;
}
```

### 8.1.2封装c++中的class和struct的区别
在C++中 struct和class唯一的**区别**就在于 **默认的访问权限不同**

区别：

* struct 默认权限为公共
* class   默认权限为私有



```C++
class C1
{
	int  m_A; //默认是私有权限
};

struct C2
{
	int m_A;  //默认是公共权限
};

int main() {

	C1 c1;
	c1.m_A = 10; //错误，访问权限是私有

	C2 c2;
	c2.m_A = 10; //正确，访问权限是公共

	system("pause");

	return 0;
}
```

### 8.1.3成员属性设置为私有
**优点1：**将所有成员属性设置为私有，可以自己控制读写权限

**优点2：**对于写权限，我们可以检测数据的有效性



**示例：**

```C++
class Person {
public:

	//姓名设置可读可写
	void setName(string name) {
		m_Name = name;
	}
	string getName()
	{
		return m_Name;
	}


	//获取年龄 
	int getAge() {
		return m_Age;
	}
	//设置年龄
	void setAge(int age) {
		if (age < 0 || age > 150) {
			cout << "你个老妖精!" << endl;
			return;
		}
		m_Age = age;
	}

	//情人设置为只写
	void setLover(string lover) {
		m_Lover = lover;
	}

private:
	string m_Name; //可读可写  姓名
	
	int m_Age; //只读  年龄

	string m_Lover; //只写  情人
};

int main() {

	Person p;
	//姓名设置
	p.setName("张三");
	cout << "姓名： " << p.getName() << endl;

	//年龄设置
	p.setAge(50);
	cout << "年龄： " << p.getAge() << endl;

	//情人设置
	p.setLover("苍井");
	//cout << "情人： " << p.m_Lover << endl;  //只写属性，不可以读取

	system("pause");

	return 0;
}
```
### 8.1.4封装案例
1. **练习案例1：设计立方体类**
设计立方体类(Cube)
* 求出立方体的面积和体积
* 分别用全局函数和成员函数判断两个立方体是否相等。

```c++
#include<iostream>
using namespace std;
class Cube
{
public:
    //输入长宽高
    void setLwh(int l,int w,int h)
    {
        m_L=l;
        m_W=w;
        m_H=h;
    }
    int mianji()
    {
        return 2*(m_L*m_W + m_L*m_H + m_W*m_H);
    }
    int tiji()
    {
        return m_L*m_W*m_H;
    }
    //获取长宽高
    int getLength()
    {
        return m_L;
    }
    int getWidth()
    {
        return m_W;
    }
    int getHeight()
    {
        return m_H;
    }
    //成员函数判断两个立方体是否相等
    bool isEqual(Cube c)
    {
        if (c.getLength() == m_L && c.getWidth() == m_W && c.getHeight() == m_H)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    //私有属性
private:
    int m_L;
    int m_W;
    int m_H;

};
//全局函数判断两个立方体是否相等
bool isEqual(Cube c1,Cube c2)
{
    return (c1.getLength() == c2.getLength()) && (c1.getWidth() == c2.getWidth()) && (c1.getHeight() == c2.getHeight());
}
int main()
{
    Cube c1;
    //输入立方体的长宽高
    cout<<"请输入第一个立方体的长、宽、高："<<endl;
    int l,w,h,l1,w1,h1;
    cin>>l>>w>>h;
    c1.setLwh(l,w,h);
    //面积
    cout<<"立方体的表面积为："<<c1.mianji()<<endl;
    //体积
    cout<<"立方体的体积为："<<c1.tiji()<<endl;
    cout<<"请输入第二个立方体的长、宽、高："<<endl;
    cin>>l1>>w1>>h1;
    Cube c2;
    c2.setLwh(l1,w1,h1);
    cout<<"第二个立方体的表面积为："<<c2.mianji()<<endl;
    cout<<"第二个立方体的体积为："<<c2.tiji()<<endl;

    //判断两个立方体的表面积和体积是否相等
    cout<<"内部函数判断结果："<<endl;
    if (c1.isEqual(c2))
    {
        cout<<"两个立方体相等"<<endl;
    }
    else
    {
        cout<<"两个立方体不相等"<<endl;
    }

    cout<<"全局函数判断结果："<<endl;
    if (isEqual(c1, c2))
    {
        cout<<"两个立方体相等"<<endl;
    }
    else
    {
        cout<<"两个立方体不相等"<<endl;
    }
}
```

2. **练习案例2：点和圆的关系**
* 设计一个圆形类（Circle），和一个点类（Point），计算点和圆的关系。
```c++
#include<iostream>
using namespace std;
#include<cmath>
class Point
{
public:
    //赋值
    void setPoint(double x, double y) { m_x = x; m_y = y; }
    //获取坐标
    double getX() { return m_x; }
    double getY() { return m_y; }

private:
    double m_x;
    double m_y;
};
class Circle
{
public:
    //赋值
    void setRadius(double r) { m_r = r; }
    void setCenter(Point center) { m_center = center; }
    //获取属性
    double getRadius() { return m_r; }
    Point getCenter() { return m_center; }

private:
    double m_r;
    //在类中可以让另一个类作为本来的成员
    Point m_center;
};
void isInCircle(Circle &c,Point &p)
{
    double dx = c.getCenter().getX() - p.getX();
    double dy = c.getCenter().getY() - p.getY();
    double distance = sqrt(dx * dx + dy * dy);
    if (distance < c.getRadius())
    {
        cout << "点在圆内" << endl;
    }
    else
    {
        cout << "点在圆外" << endl;
    }
}
int main()
{
    //实例化
    Circle c1;
    Point p1;
    //赋值
    cout<<"请输入圆的半径：";
    double r;
    cin>>r;
    c1.setRadius(r);
    cout<<"请输入圆心坐标：";
    double x, y;
    cin>>x>>y;
    p1.setPoint(x, y);
    c1.setCenter(p1);
    cout<<"请输入测试点坐标：";
    double x1, y1;
    cin>>x1>>y1;
    Point p2;
    p2.setPoint(x1, y1);
    isInCircle(c1, p2);
}
```
在类中可以让另一个类作为本来的成员

这个案例非常重要的一点在于类和对象封装成一个单独文件

创建point.h
```c++
#pragma once //防止头文件重复包含
#include<iostream>
using namespace std;
class Point
{
//做好声明与变量定义就可以
public:
    //赋值
    void setPoint(double x, double y);
    //获取坐标
    double getX();
    double getY();

private:
    double m_x;
    double m_y;
};
```
创建point.cpp
```c++
#include<point.h>
//此时如果不给予他作用域就会报错，所以要加Point::
    void Point::setPoint(double x, double y) { m_x = x; m_y = y; }
    //获取坐标
    double Point::getX() { return m_x; }
    double Point::getY() { return m_y; }
```
创建circle.h
```c++
#pragma once
#include<iostream>
using namespace std;
#include<point.h>
class Circle
{
public:
    //赋值
    void setRadius(double r);
    void setCenter(Point center);
    //获取属性
    double getRadius();
    Point getCenter();

private:
    double m_r;
    //在类中可以让另一个类作为本来的成员
    Point m_center;
};
```
创建circle.cpp
```c++
#include<circle.h>
void Circle::setRadius(double r) { m_r = r; }
void Circle::setCenter(Point center) { m_center = center; }
//获取属性
double Circle::getRadius() { return m_r; }
Point Circle::getCenter() { return m_center; }
```
使用封装的类
```c++
#include<iostream>
using namespace std;
#include<circle.h>
#include<point.h>
void isInCircle(Circle &c,Point &p)
{
    double dx = c.getCenter().getX() - p.getX();
    double dy = c.getCenter().getY() - p.getY();
    double distance = sqrt(dx * dx + dy * dy);
    if (distance < c.getRadius())
    {
        cout << "点在圆内" << endl;
    }
    else
    {
        cout << "点在圆外" << endl;
    }
}
int main()
{
    //实例化
    Circle c1;
    Point p1;
    //赋值
    cout<<"请输入圆的半径：";
    double r;
    cin>>r;
    c1.setRadius(r);
    cout<<"请输入圆心坐标：";
    double x, y;
    cin>>x>>y;
    p1.setPoint(x, y);
    c1.setCenter(p1);
    cout<<"请输入测试点坐标：";
    double x1, y1;
    cin>>x1>>y1;
    Point p2;
    p2.setPoint(x1, y1);
    isInCircle(c1, p2);
}
```
## 8.2对象的初始化清理
*  生活中我们买的电子产品都基本会有出厂设置，在某一天我们不用时候也会删除一些自己信息数据保证安全
*  C++中的面向对象来源于生活，每个对象也都会有初始设置以及 对象销毁前的清理数据的设置。

### 8.2.1构造函数和析构函数
对象的**初始化和清理**也是两个非常重要的安全问题

​	一个对象或者变量没有初始状态，对其使用后果是未知

​	同样的使用完一个对象或变量，没有及时清理，也会造成一定的安全问题

c++利用了**构造函数**和**析构函数**解决上述问题，这两个函数将会被编译器自动调用，完成对象初始化和清理工作。

对象的初始化和清理工作是编译器强制要我们做的事情，因此如果**我们不提供构造和析构，编译器会提供**

**编译器提供的构造函数和析构函数是空实现。**

* 构造函数：主要作用在于创建对象时为对象的成员属性赋值，构造函数由编译器自动调用，无须手动调用。
* 析构函数：主要作用在于对象**销毁前**系统自动调用，执行一些清理工作。

**构造函数语法：**`类名(){}`

1. 构造函数，没有返回值也不写void
2. 函数名称与类名相同
3. 构造函数可以有参数，因此可以发生重载
4. 程序在调用对象时候会自动调用构造，无须手动调用,而且只会调用一次
5. 构造函数在程序运行时会自动调用，如果自己定义的话就用自己；否则就用编译器给我们生成的(例如`Person(){}`)

**析构函数语法：** `~类名(){}`

1. 析构函数，没有返回值也不写void
2. 函数名称与类名相同,在名称前加上符号  ~
3. 析构函数不可以有参数，因此**不可以发生重载**
4. 程序在对象销毁前会自动调用析构，无须手动调用,而且只会调用一次

```c++
class Person
{
public:
	//构造函数
	Person()
	{
		cout << "Person的构造函数调用" << endl;
	}
	//析构函数
	~Person()
	{
		cout << "Person的析构函数调用" << endl;
	}

};

void test01()
{
	Person p;//在栈上的数据，test01执行完毕后，释放这个
}

int main() {
	
	// test01();  调用这个会有构造和析构函数的调用

    Person p;//只有构造函数

	system("pause");//按键后程序才会结束，就会出现析构函数的调用，但是窗口很快就关了

	return 0;
}
```

构造和析构都是必须有的实现，如果我们自己不提供，编译器会提供一个空实现的构造和析构

### 8.2.2构造函数的分类及调用
两种分类方式：

​	按参数分为： 有参构造和无参构造

​	按类型分为： 普通构造和拷贝构造

三种调用方式：

​	括号法

​	显示法

​	隐式转换法

```c++
#include<iostream>
using namespace std;
//1.构造函数的分类及调用
//分类
//  按照参数分类 无参数构造(默认构造)  有参构造
//  按照类型分类 普通构造 拷贝构造

class Person 
{
public:
    //构造函数
    Person()
    {
        cout<<"Person构造函数无参构造"<<endl;
    }
    Person(int a)
    {
        age=a;
        cout<<"Person构造函数有参构造"<<endl;
    }
    //析构函数
    ~Person()
    {
        cout<<"Person析构函数被调用"<<endl;
    }
    //拷贝构造函数
    Person(const Person &p)
    {
        //将传入对象的age赋值给当前对象的age
        age=p.age;
        cout<<"Person拷贝构造函数被调用"<<endl;
    }
    int age;
};
//调用
void test01()
{
    // Person p1;//默认构造函数调用
}
void test02()
{
    //1.括号法
    // Person p2(10);//有参构造函数调用
    // Person p3(p2);//拷贝构造函数调用
    // cout<<"p2的age:"<<p2.age<<endl;
    // cout<<"p3的age:"<<p3.age<<endl;

    //注意事项
    //调用默认构造函数时候，不要加()
    //因为下面这行代码，编译器会认为是一个函数的声明,不会认为在创建对象
    // Person p4();

    //2.显示法
    Person p1;
    Person p2=Person(10);
    Person p3=Person(p2);
    // 如果单独拿出右侧Person(10);，这是个匿名对象

    // 注意事项2
    // 不要利用拷贝构造函数  初始化匿名对象
    // Person(p2);  编译器会认为 Person (p2)===Person p2； 错误的 编译器会认为是对象的声明   

    //3.隐士转换法
    Person p4=10;  // 这里会调用有参构造函数  相当于Person p4=Person(10);
    Person p5=p4; // 这里会调用拷贝构造函数
}
int main()
{
    test01();
    test02();
    return 0;
}
```
**匿名对象的特点**：当前行执行结束后，系统会立即回收掉匿名对象

### 8.2.3拷贝构造函数

C++中拷贝构造函数调用时机通常有三种情况

* 使用一个已经创建完毕的对象来初始化一个新对象
* 值传递的方式给函数参数传值
* 以值方式返回局部对象

```c++
#include<iostream>
using namespace std;

//拷贝构造函数调用时机

//1.使用一个已经创建好的对象来初始化一个新对象
//2.值传递的方式给函数参数传值
//3.以值方式返回局部对象
class Person
{
public:
    Person()
    {
        cout << "Person的默认构造函数调用" << endl;
    }
    //有参构造
    Person(int age)
    {
        m_Age = age;
        cout << "Person的有参构造函数调用" << endl;
    }
    //拷贝构造函数
    Person(const Person &p)
    {
        m_Age = p.m_Age;
        cout << "Person的拷贝构造函数调用" << endl;
    }
    ~Person()
    {
        cout << "Person的析构函数调用" << endl;
    }
    int m_Age;
};
//1.使用一个已经创建好的对象来初始化一个新对象
void test01()
{
    Person p1(20);
    Person p2(p1);
    cout<<"P2的年龄为："<<p2.m_Age<<endl;
}
// 2.值传递的方式给函数参数传值
//值传递会拷贝一个新的对象，调用拷贝构造函数
void doWork(Person p)
{
    cout << "doWork函数调用" << endl;
}
void test02()
{
    Person p;
    doWork(p);
}
// 3.以值方式返回局部对象
Person doWork2()
{
    Person p1;
    cout<<(int *)&p1<<endl;//打印p1的地址
    return p1;//返回局部对象，调用拷贝构造函数
}
void test03()
{
    Person p = doWork2();
    cout<<(int *)&p<<endl;//打印p的地址
}


int main()
{
    // test01();
    // test02();
    test03();
//此时编译器进行了优化，返回值优化（RVO），没有调用拷贝构造函数，直接在p的地址上创建了p1对象
// 输出结果如下：
// Person的默认构造函数调用
// 0x7fffffffceec
// 0x7fffffffceec
// Person的析构函数调用

// 之前的输出结果如下：
// Person的默认构造函数调用
// 地址
// Person的拷贝构造函数调用
// Person的析构函数调用
// 地址
// (这两次输出的地址也是不同的) 
// Person的析构函数调用     
    return 0;
}
```
简化版理解
```c++
class Person {
public:
	Person() {
		cout << "无参构造函数!" << endl;
		mAge = 0;
	}
	Person(int age) {
		cout << "有参构造函数!" << endl;
		mAge = age;
	}
	Person(const Person& p) {
		cout << "拷贝构造函数!" << endl;
		mAge = p.mAge;
	}
	//析构函数在释放内存之前调用
	~Person() {
		cout << "析构函数!" << endl;
	}
public:
	int mAge;
};

//1. 使用一个已经创建完毕的对象来初始化一个新对象
void test01() {

	Person man(100); //p对象已经创建完毕
	Person newman(man); //调用拷贝构造函数
	Person newman2 = man; //拷贝构造

	//Person newman3;
	//newman3 = man; //不是调用拷贝构造函数，赋值操作
}

//2. 值传递的方式给函数参数传值
//相当于Person p1 = p;
void doWork(Person p1) {}
void test02() {
	Person p; //无参构造函数
	doWork(p);
}

//3. 以值方式返回局部对象
Person doWork2()
{
	Person p1;
	cout << (int *)&p1 << endl;
	return p1;
}

void test03()
{
	Person p = doWork2();
	cout << (int *)&p << endl;
}


int main() {

	//test01();
	//test02();
	test03();

	system("pause");

	return 0;
}
```
### 8.2.4构造函数的调用规则
默认情况下，c++编译器至少给一个类添加3个函数

1．默认构造函数(无参，函数体为空)

2．默认析构函数(无参，函数体为空)

3．默认拷贝构造函数，对属性进行值拷贝  (值拷贝)

构造函数调用规则如下：

* 如果用户定义有参构造函数，c++不在提供默认无参构造，但是会提供默认拷贝构造
* 如果用户定义拷贝构造函数，c++不会再提供其他构造函数

```c++
class Person {
public:
	//无参（默认）构造函数
	Person() {
		cout << "无参构造函数!" << endl;
	}
	//有参构造函数
	Person(int a) {
		age = a;
		cout << "有参构造函数!" << endl;
	}
	//拷贝构造函数
	Person(const Person& p) {
		age = p.age;
		cout << "拷贝构造函数!" << endl;
	}
	//析构函数
	~Person() {
		cout << "析构函数!" << endl;
	}
public:
	int age;
};

void test01()
{
	Person p1(18);
	//如果不写拷贝构造，编译器会自动添加拷贝构造，并且做浅拷贝操作
	Person p2(p1);

	cout << "p2的年龄为： " << p2.age << endl;
}

void test02()
{
	//如果用户提供有参构造，编译器不会提供默认构造，会提供拷贝构造
	Person p1; //此时如果用户自己没有提供默认构造，会出错
	Person p2(10); //用户提供的有参
	Person p3(p2); //此时如果用户没有提供拷贝构造，编译器会提供

	//如果用户提供拷贝构造，编译器不会提供其他构造函数
	Person p4; //此时如果用户自己没有提供默认构造，会出错
	Person p5(10); //此时如果用户自己没有提供有参，会出错
	Person p6(p5); //用户自己提供拷贝构造
}

int main() {

	test01();

	system("pause");

	return 0;
}
```
### 8.2.5深拷贝和浅拷贝
浅拷贝：简单的赋值拷贝操作

深拷贝：在堆区重新申请空间，进行拷贝操作
```c++
#include<iostream>
using namespace std;
class Person
{
public:
    //默认构造函数
    Person()
    {
        cout<<"默认构造函数"<<endl;
    }
    //有参构造函数
    ~Person(int age,int height)
    {
        m_Age=age;
        m_Height=new int(height);//放到堆区
        cout<<"有参构造函数"<<endl;
    }
    //深拷贝解决上述问题
    //自己实现拷贝构造函数，解决浅拷贝带来的问题
    Person(const Person &p)
    {
        cout<<"拷贝构造函数"<<endl;
        //编译器默认的写如下注释部分
        //m_Age=p.m_Age;
        //m_Height=p.m_Height;
        m_Age=p.m_Age;
        //深拷贝操作
        m_Height=new int(*p.m_Height);
    }

    //析构函数
    ~Person()
    {
        //析构函数，将堆区开辟数据做释放操作
        if(m_Height != NULL)
        {
            delete m_Height; //释放堆区内存
            m_Height=NULL; //防止野指针
        }
        cout<<"Person的析构函数调用"
    }
    int m_Age;
    int *m_Height; //定义一个指针，指向身高
};
void test01()
{
    Person p1(18,160);
    cout<<"p1的年龄为:"<<p1.m_Age<<"身高为："<<*p1.m_Height<<endl;  //18
    Person p2(p1);
    cout<<"p2的年龄为："<<p2.m_Age<<"身高为："<<*p2.m_Height<<endl;  //18
    
}
int main()
{
    test01();
}
```
浅拷贝时，对象释放是先进后放，所以会先释放p2，然后再释放p1；所以就出现了两次释放内存，也就是会出现非法操作

浅拷贝带来的问题是堆区的内存重复释放

![](/images/feishu/assets/2026-05-24-c++学习-007.png)

浅拷贝问题要使用深拷贝来解决

![](/images/feishu/assets/2026-05-24-c++学习-008.png)

**总结：**如果属性有在堆区开辟的，一定要自己提供拷贝构造函数，防止浅拷贝带来的问题


