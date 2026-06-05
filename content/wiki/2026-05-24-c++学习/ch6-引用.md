# 6.引用
## 6.1引用基本用法
引用的本质：给变量起别名

语法：数据类型 &别名=原名
```c++
int main() {

	int a = 10;
	int &b = a;

	cout << "a = " << a << endl;//10
	cout << "b = " << b << endl;//10

	b = 100;

	cout << "a = " << a << endl;//100
	cout << "b = " << b << endl;//100

	system("pause");

	return 0;
}
```
## 6.2引用的注意事项
1. 引用必须要初始化
```c++
int &b;//非常错误！
```
2. 引用一旦初始化后，就不可以更改了，引用a了，就不能引用b了
```c++
int main() {
	int a = 10;
	int b = 20;
	//int &c; //错误，引用必须初始化
	int &c = a; //一旦初始化后，就不可以更改
	c = b; //这是赋值操作，不是更改引用
	cout << "a = " << a << endl;//20
	cout << "b = " << b << endl;//20
	cout << "c = " << c << endl;//20
	system("pause");
	return 0;
}
```
## 6.3引用做函数参数
作用：函数传参时，可以利用引用的技术让形参修饰实参

优点：可以简化指针修改实参
```c++
//1. 值传递
void mySwap01(int a, int b) {
	int temp = a;
	a = b;
	b = temp;
}

//2. 地址传递
void mySwap02(int* a, int* b) {
	int temp = *a;
	*a = *b;
	*b = temp;
}

//3. 引用传递
void mySwap03(int& a, int& b) {
	int temp = a;
	a = b;
	b = temp;
}

int main() {

	int a = 10;
	int b = 20;

	mySwap01(a, b);//值传递，形参不会修饰实参
	cout << "a:" << a << " b:" << b << endl;

	mySwap02(&a, &b);//地址传递，形参会修饰实参
	cout << "a:" << a << " b:" << b << endl;

	mySwap03(a, b);//引用传递，形参会修饰实参
	cout << "a:" << a << " b:" << b << endl;

	system("pause");

	return 0;
}

```
## 6.4引用做函数的返回值
作用：引用是可以作为函数的返回值存在的

注意：**不要返回局部变量引用**

用法：函数调用作为左值
```C++
//返回局部变量引用
int& test01() {
	int a = 10; //局部变量
	return a;
}

//返回静态变量引用
int& test02() {
	static int a = 20;//静态变量，存放在全局区，全局区上的数据在程序结束后系统释放
	return a;
}

int main() {

	//不能返回局部变量的引用
	int& ref = test01();
	cout << "ref = " << ref << endl;//10 第一次正确，是因为编译器做了保留
	cout << "ref = " << ref << endl;//乱码状态 第二次结果错误，因为a的内存已经释放

	//如果函数做左值，那么必须返回引用
	int& ref2 = test02();
	cout << "ref2 = " << ref2 << endl; //20
	cout << "ref2 = " << ref2 << endl; //20

	test02() = 1000;//如果函数的返回值是引用，这个函数调用可以作为左值

	cout << "ref2 = " << ref2 << endl; //1000
	cout << "ref2 = " << ref2 << endl; //1000

	system("pause");

	return 0;
}
```
## 6.5引用的本质
本质：**引用的本质在c++内部实现是一个指针常量.**
```c++
//发现是引用，转换为 int* const ref = &a;
void func(int& ref){
	ref = 100; // ref是引用，转换为*ref = 100
}
int main(){
	int a = 10;
    
    //自动转换为 int* const ref = &a; 指针常量是指针指向不可改，也说明为什么引用不可更改
	int& ref = a; 
	ref = 20; //内部发现ref是引用，自动帮我们转换为: *ref = 20;
    
	cout << "a:" << a << endl;
	cout << "ref:" << ref << endl;
    
	func(a);
	return 0;
}
```
总结：
1. 引用的本质，就是一个指针常量
2. 引用一旦初始化，就不可以发生改变
## 6.6常量引用
作用：常量引用主要用来修饰形参

在函数形参列表中，可以加**const修饰形参**，防止形参改变实参
```c++
//引用使用的场景，通常用来修饰形参
//加上const就不能修改实参的
void showValue(const int& v) {
	//v += 100;
	cout << v << endl;
}

int main() {

	//int& ref = 10;  引用本身需要一个合法的内存空间，因此这行错误
	//加入const就可以了，编译器优化代码，int temp = 10; const int& ref = temp;
	const int& ref = 10;

	//ref = 100;  //加入const后不可以修改变量
	cout << ref << endl;

	//函数中利用常量引用防止误操作修改实参
	int a = 10;
	showValue(a);

	system("pause");

	return 0;
}
```
