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