#include<iostream>
using namespace std;
int main()
{
    int score=0;
    cout<<"电影打分："<<endl;
    cin>>score;
    switch(score)
    {
        case 10:cout<<"经典"<<endl;break;
        case 9:cout<<"经典"<<endl;break;
        case 8:cout<<"非常好"<<endl;break;
        case 7:cout<<"非常好"<<endl;break;
        case 6:cout<<"一般"<<endl;break;
        case 5:cout<<"一般"<<endl;break;
        default:cout<<"烂片"<<endl;break;
    }
}