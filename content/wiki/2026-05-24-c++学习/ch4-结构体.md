# 4.结构体
结构体属于用户自定义的数据类型，允许用户存储不同的数据类型
## 4.1结构体定义与使用
语法：struct 结构体名 {结构体成员列表}；

通过结构体创建变量的方式：
* struct 结构体名 变量名
* struct 结构体名 变量名={成员1值，成员2值...}
* 定义结构体时顺便创建变量
```c++
#include<iostream>
using namespace std;
#include<string>
//1.创建学生数据类型：学生包括：（姓名，年龄，分数）
struct Student
{
    //成员列表

    //姓名
    string name;
    //年龄
    int age;
    //分数
    int score;
};
struct School
{
    //成员列表

    //姓名
    string name;
    //年龄
    int age;
    //分数
    int score;
} s3; //创建结构体时就创建了变量
int main()
{
    //2.通过学生类型创建具体学生
    //2.1 struct Student s1;
    struct Student s1;
    //给s1属性赋值，通过访问结构体变量中的属性
    s1.name="张三";
    s1.age=18;
    s1.score=66;
    //输出结果
    cout<<s1.name<<s1.age<<s1.score<<endl;

    //2.2 struct Student s2={...}
    struct Student s2={"王五",18,66};

    //2.3在定义结构体时顺便创建结构体变量
    s3.name="1";
    s3.age=18;
    s3.score=20;
}
```
注意：结构体定义时关键词struct不可以省略，但是创建是可以省略

## 4.2结构体数组
将自定义的结构体放入到数组中方便维护

语法：struct 结构体名 数组名[元素个数]={ {}，{},...{} };
```c++
#include<iostream>
using namespace std;
#include<string>
//1.定义结构体
struct Student
{
    string name;
    int age;
    int score;

};
int main()
{
    //2.创建结构体数组
    struct Student stuArray[2]=
    {
        {"张三",18,100},
        {"1",15,15}
    }
    //3.给结构体数组中的元素赋值
    stuArray[1].name="2";
    stuArray[1].age=2;
    stuArray[1].score=2;
    //4.遍历结构体数组
    for (int i=0;i<2;i++)
    {
        cout<<stuArray[i].name<<stuArray[i].age<<stuArray[i].score<<endl;
    }
}
```
## 4.3结构体指针
作用：通过指针访问结构体中的成员

利用操作符->可以通过结构体指针访问结构体属性
```c++
#include<iostream>
using namespace std;
#include<string>
//1.定义结构体
struct Student
{
    string name;
    int age;
    int score;
};
int main()
{
    //创建学生结构体变量
    struct Student s={"张三",18,200};
    //通过指针指向结构体变量
    struct Student *p=&s
    //通过指针访问结构体变量中的数据
    cout<<p->name<<p->age<<p->score<<endl;
}
```
## 4.4结构体嵌套结构体
作用：结构体中的成员可以是另一个结构体

例如：每个老师辅导一个学员，一个老师的结构体中，记录一个学生的结构体
```c++
#include<iostream>
using namespace std;
#include<string>
//定义学生结构体
struct Student 
{
    string name;
    int age;
    int score;
}
//定义老师结构体
struct Teacher
{
    int id;
    string name;
    int age;
    Student stu;
}
int main() 
{
    //结构体嵌套结构体
    //创建老师
    Teacher t;
    t.id=100;
    t.name="老王";
    t.age=18;
    t.stu.name="小王"；
    t.stu.age=20;
    t.stu.score=6;
}
```
## 4.5结构体做函数参数
案例学习:将学生传入到一个参数中，打印学生身上的所有信息
```c++
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
```
注意：
* 1.先定义结构体，不要在函数中写结构体的定义
* 2.不想修改主函数中的数据，就用值传递；反之用地址传递

## 4.6结构体中const使用场景
用const防止误操作
```c++
#include<iostream>
using namespace std;
#include<string>
sctuct Student
{
    string name;
    int age;
    int score;
};
void printStudents(student s)
{
    cout<<s.name<<s.age<<s.score<<endl;
}
int main() 
{
    Student s={"张三",18,18};
    printStudent(s);

}
```
注意：
* 1.值传递时形参会copy一份实参的数值，所以实参数据多时，就会比较浪费内存
* 2.将函数中的形参改为指针，可以减少内存空间，而且不会复制新的副本出来
* 3.在结构体形参前边加上const后，函数中就没法改参数信息了（加入const之后，一旦有修改的操作就会报错，可以防止我们的误操作）
```c++
void printStudents(const student *s)
{
    // s->age=18;//提示❎无，不可以这样做
    cout<<s.name<<s.age<<s.score<<endl;
}
```
## 4.7案例
1. 案例说明：学校正在做毕设项目，每名老师带领5个学生，总共有3名老师，需求如下：设计学生和老师的结构体，其中在老师的结构体中，有老师姓名和一个存放5名学生的数组，作为成员学生的成员有姓名、考试分数，创建数组存放3名老师，通过函数给每个老师及所带的学生赋值，最终打印出老师数据以及老师所带的学生数据。
```c++
#include<iostream>
using namespace std;
#include<string>
#include<ctime>
//定义学生结构体
struct Student
{
    string sName;
    int age;
    int score;
};
//定义老师结构体
struct Teacher
{
    string tName;
    //学生数组
    struct Student sArray[5];
};
//给老师和学生赋值的函数
void allocateSpace(struct Teacher tArray[],int len)
{
    string nameSeed="ABCDE";
    for (int i = 0; i < len; i++)
    {
        tArray[i].tName = "Teacher_";
        tArray[i].tName +=nameSeed[i];

        //通过循环给每名老师带的学生赋值
        for (int j = 0; j < 5; j++)
        {
            tArray[i].sArray[j].sName = "Student_";
            tArray[i].sArray[j].sName += nameSeed[j];
            int random=rand()%60+40;//40~99
            tArray[i].sArray[j].age = 20;
            tArray[i].sArray[j].score = random;
        }
    }
}
//打印所有信息的函数
void printInfo(struct Teacher tArray[], int len)
{
    for (int i = 0; i < len; i++)
    {
        cout << "Teacher: " << tArray[i].tName << endl;
        for (int j = 0; j < 5; j++)
        {
            cout << "\tStudent: " << tArray[i].sArray[j].sName<<endl;
            cout << "\tAge: " << tArray[i].sArray[j].age << endl;
            cout << "\tScore: " << tArray[i].sArray[j].score << endl;   
        }
    }
}
int main()
{
    //随机数种子
    srand((unsigned int)time(NULL));
    //1.创建3名老师的数组
    struct Teacher tArray[3];
    //2.通过函数给3名老师的信息赋值，并给老师带的学生信息赋值
    int len = sizeof(tArray) / sizeof(tArray[0]);
    allocateSpace(tArray, len);
    //3.打印所有老师及所带的学生信息
    printInfo(tArray, len);

}
```

2. **案例描述：**：设计一个英雄的结构体，包括成员姓名，年龄，性别;创建结构体数组，数组中存放5名英雄。通过冒泡排序的算法，将数组中的英雄按照年龄进行升序排序，最终打印排序后的结果。

五名英雄信息如下：

```C++
		{"刘备",23,"男"},
		{"关羽",22,"男"},
		{"张飞",20,"男"},
		{"赵云",21,"男"},
		{"貂蝉",19,"女"},
```
代码：
```c++
#include<iostream>
using namespace std;
#include<string>
struct Sanguo
{
    string name;
    int age;
    string gender;
};
//定义排序函数
void bubbleSort(Sanguo *s,int len)
{
    for(int i=0;i<len;i++)
    {
     for (int j=0;j<len-1-i;j++)
     {
         if ((s+j)->age > (s+j+1)->age)
         {
             Sanguo temp=*(s+j);
             *(s+j)=*(s+j+1);
             *(s+j+1)=temp;
         }
     }
    }
}
//定义打印函数
void printInfo(Sanguo *s,int len)
{
    for (int i=0;i<len;i++)
    {
        cout<<"\t姓名："<<(s+i)->name<<"\t年龄："<<(s+i)->age<<"\t性别："<<(s+i)->gender<<endl;
    }
}
int main()
{
    //定义结构体变量
    Sanguo s1[5]=
    {
        {"刘备",23,"男"},
		{"关羽",22,"男"},
		{"张飞",20,"男"},
		{"赵云",21,"男"},
		{"貂蝉",19,"女"},
    };
    int len=sizeof(s1)/sizeof(s1[0]);
    Sanguo *s = &s1[0];
    //排序前：
    cout << "排序前：" << endl;
    printInfo(s,len);
    //调用排序函数
    bubbleSort(s,len);
    //排序后
    cout << "排序后：" << endl;
    printInfo(s,len);
}
```
注意：使用指针时直接用传首地址**&s[0]**