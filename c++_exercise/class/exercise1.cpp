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