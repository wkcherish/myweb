#include<iostream>
using namespace std;
class Circle
{
public:
    //赋值
    void setRadius(double r) { m_r = r; }
    void setCenter(double x, double y) { m_x = x; m_y = y; }

private:
    double m_r;
    double m_x;
    double m_y;
};
class Point
{
public:
    //赋值
    void setPoint(double x, double y) { m_x = x; m_y = y; }

private:
    double m_x;
    double m_y;
};



int main()
{
    return 0;
}