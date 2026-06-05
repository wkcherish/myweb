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