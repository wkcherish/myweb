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

```
