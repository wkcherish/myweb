#include<iostream>
using namespace std;
class Cube
{
public:
    //输入长宽高
    void setLwh(int l,int w,int h)
    {
        m_L=l;
        m_W=w;
        m_H=h;
    }
    int mianji()
    {
        return 2*(m_L*m_W + m_L*m_H + m_W*m_H);
    }
    int tiji()
    {
        return m_L*m_W*m_H;
    }
    //获取长宽高
    int getLength()
    {
        return m_L;
    }
    int getWidth()
    {
        return m_W;
    }
    int getHeight()
    {
        return m_H;
    }
    //成员函数判断两个立方体是否相等
    bool isEqual(Cube c)
    {
        if (c.getLength() == m_L && c.getWidth() == m_W && c.getHeight() == m_H)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    //私有属性
private:
    int m_L;
    int m_W;
    int m_H;

};
//全局函数判断两个立方体是否相等
bool isEqual(Cube c1,Cube c2)
{
    return (c1.getLength() == c2.getLength()) && (c1.getWidth() == c2.getWidth()) && (c1.getHeight() == c2.getHeight());
}
int main()
{
    Cube c1;
    //输入立方体的长宽高
    cout<<"请输入第一个立方体的长、宽、高："<<endl;
    int l,w,h,l1,w1,h1;
    cin>>l>>w>>h;
    c1.setLwh(l,w,h);
    //面积
    cout<<"立方体的表面积为："<<c1.mianji()<<endl;
    //体积
    cout<<"立方体的体积为："<<c1.tiji()<<endl;
    cout<<"请输入第二个立方体的长、宽、高："<<endl;
    cin>>l1>>w1>>h1;
    Cube c2;
    c2.setLwh(l1,w1,h1);
    cout<<"第二个立方体的表面积为："<<c2.mianji()<<endl;
    cout<<"第二个立方体的体积为："<<c2.tiji()<<endl;

    //判断两个立方体的表面积和体积是否相等
    cout<<"内部函数判断结果："<<endl;
    if (c1.isEqual(c2))
    {
        cout<<"两个立方体相等"<<endl;
    }
    else
    {
        cout<<"两个立方体不相等"<<endl;
    }

    cout<<"全局函数判断结果："<<endl;
    if (isEqual(c1, c2))
    {
        cout<<"两个立方体相等"<<endl;
    }
    else
    {
        cout<<"两个立方体不相等"<<endl;
    }
}