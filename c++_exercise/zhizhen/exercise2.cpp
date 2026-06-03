#include<iostream>
using namespace std;
void bubbleSort(int *p,int len)
{
    for(int i=0;i<len-1;i++)
    {
        for(int j=0;j<len-i-1;j++)
        {
            if(p[j]>p[j+1])
            {
                int temp=p[j];
                p[j]=p[j+1];
                p[j+1]=temp;
            }
        }
    }
}

int main()
{
    // 1.创建数组
    int arr[10]={4,3,6,9,1,2,10,8,7,5};
    int len=10;
    int *p=arr;
    // 2.创建函数，实现冒泡排序
    bubbleSort(p,len);

    // 3.打印排序后的数组
    for (int i=0; i<len; i++)
    {
        cout<<*p<<"";
        p++;
    }
}