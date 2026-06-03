#include<iostream>
using namespace std;
int main()
{
    //利用指针访问数组中的元素
    int arr[10]={1,2,3,4,5,6,7,8,9,10};
    cout<<"数组的第一个元素为："<<arr[0]<<endl;
    int *p=arr;//注意数才要加取地址符号&
    cout<<sizeof(p)<<endl;
    p++; //让指针向后偏移4个字节
}