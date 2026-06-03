//元素逆置
#include<iostream>
using namespace std;
int main()
{
   int arr[5]={1,2,3,4,5};
   int start=0;//起始下标
   int end=sizeof(arr)/sizeof(arr[0])-1;//结束下标
   while (start<end)
   {
    //实现元素互换代码
    int temp=arr[start];
    arr[start]=arr[end];
    arr[end]=temp;
    //下标更新
    start++;
    end--;
   }
   //输出逆置后的数组
   for (int i=0;i<5;i++)
   {
    cout<<arr[i]<<" ";
   }
   system("pause");
   return 0;
}