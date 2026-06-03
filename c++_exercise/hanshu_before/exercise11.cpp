#include<iostream>
using namespace std;
int main()
{
    int score[3][3]={100,100,100,90,50,100,60,70,80};
    int sum[]={0,0,0};
    cout<<"成绩矩阵："<<endl;
    for (int i=0;i<3;i++)
    {
        for (int j=0;j<3;j++)
        {
            cout<<score[i][j]<<" ";
            sum[i]+=score[i][j];
        }
        cout<<endl;
    }
    cout<<"每个人总分如下："<<endl;
    for (int i=0;i<3;i++)
    {
        cout<<"第"<<i+1<<"个人的总分是："<<sum[i]<<endl;
    }
    system("pause");
    return 0;
}