//循环结构-猜数字
#include <iostream>
#include <ctime>
using namespace std;
int main()
{
    //添加随机数种子，利用当前系统时间生成随机数，防止每次随机数相同
    srand((unsigned int)time(NULL));

    //1.系统生成随机数
    //rand()%100 //生成0-99的随机数
    int num=rand()%100+1; //这是个伪随机数，每次都不同，要想每次不同就添加随机数种子
    //cout<<"系统生成了一个1-100之间的随机数，请你来猜："<<endl;
    //2.玩家猜测
    int val=0;
    while (1)
    {
        cin>>val;
        //3.判断玩家猜测
        if(val<num) 
        {
            cout<<"猜小了！"<<endl;
        }
        else if (val>num)
        {
            cout<<"猜大了！"<<endl;
        }
        else
        {
            cout<<"猜对了！"<<endl;
            break;
        }
        //猜对 退出游戏
        //猜错 提示猜的结果 过大或者过小 重新返回第二步
    }
}