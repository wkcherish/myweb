#include<iostream>
using namespace std;
#include<cmath>
class Point
{
public:
    //赋值
    void setPoint(double x, double y) { m_x = x; m_y = y; }
    //获取坐标
    double getX() { return m_x; }
    double getY() { return m_y; }

private:
    double m_x;
    double m_y;
};
class Circle
{
public:
    //赋值
    void setRadius(double r) { m_r = r; }
    void setCenter(Point center) { m_center = center; }
    //获取属性
    double getRadius() { return m_r; }
    Point getCenter() { return m_center; }

private:
    double m_r;
    //在类中可以让另一个类作为本来的成员
    Point m_center;
};
void isInCircle(Circle &c,Point &p)
{
    double dx = c.getCenter().getX() - p.getX();
    double dy = c.getCenter().getY() - p.getY();
    double distance = sqrt(dx * dx + dy * dy);
    if (distance < c.getRadius())
    {
        cout << "点在圆内" << endl;
    }
    else
    {
        cout << "点在圆外" << endl;
    }
}
int main()
{
    //实例化
    Circle c1;
    Point p1;
    //赋值
    cout<<"请输入圆的半径：";
    double r;
    cin>>r;
    c1.setRadius(r);
    cout<<"请输入圆心坐标：";
    double x, y;
    cin>>x>>y;
    p1.setPoint(x, y);
    c1.setCenter(p1);
    cout<<"请输入测试点坐标：";
    double x1, y1;
    cin>>x1>>y1;
    Point p2;
    p2.setPoint(x1, y1);
    isInCircle(c1, p2);
}