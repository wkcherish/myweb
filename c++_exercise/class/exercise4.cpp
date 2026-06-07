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
    //1.括号法
    // Person p1;//默认构造函数调用
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
    return 0;
}