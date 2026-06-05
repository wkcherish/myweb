#include<iostream>
using namespace std;
#include<string>
struct Student
{
    string name;
    int age;
    int score;
};
//打印学生信息的函数
//值传递
void printStudent1(struct Student s)
{
    cout << s.name << " " << s.age << " " << s.score << endl;
}
//地址传递
void printStudent2(struct Student *s)
{
    cout << s->name << " " << s->age << " " << s->score << endl;
}
int main()
{
    struct Student s;
    s.name = "张三";
    s.age = 20;
    s.score = 85;
    cout<<"值传递:"<<endl;
    printStudent1(s);
    cout<<"地址传递:"<<endl;
    printStudent2(&s); 
    return 0;
}