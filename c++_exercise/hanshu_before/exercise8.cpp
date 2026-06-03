#include<iostream>
using namespace std;
int main()
{
    int arr[5]={300,350,200,400,250};
    int tmp;
    tmp=arr[0];
    for (int i=0;i<5;i++)
    {
        if(tmp<arr[i])
        {
            tmp=arr[i];
        }
    }
    cout<<tmp<<endl;
    return 0;
}