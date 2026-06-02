#include<iostream>
using namespace std;
int main() 
{
    cout<<'请输入三只小猪体重:'<<endl;
    double weight1=0, weight2=0, weight3=0;
    cout<<"小猪A："<<endl;
    cin>>weight1;
    cout<<"小猪B:"<<endl;
    cin>>weight2;
    cout<<"小猪C："<<endl;
    cin>>weight3;
    // if (weight1>weight2 && weight1>weight3) {
    //     cout<<"小猪A最重！"<<endl;
    // } else if (weight2>weight1 && weight2>weight3) {
    //     cout<<"小猪B最重！"<<endl;
    // } else {
    //     cout<<"小猪C最重！"<<endl;
    // }

    if(weight1>weight2)
    {
        if(weight1>weight3)
        {
            cout<<"小猪A最重！"<<endl;
        }
        else
        {
            cout<<"小猪C最重！"<<endl;
        }
    }
    else if(weight2>weight3)
    {
        cout<<"小猪B最重！"<<endl;
    }
    else
    {
        cout<<"小猪C最重！"<<endl;
    }
    system("pause");
    return 0;
}