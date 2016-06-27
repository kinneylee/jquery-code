## This is my jquery (simple)

#### 这个是个人模仿封装简易版的jquery。基本实现jquery的封装原理，大致是四个核心点：

1. jquery实例化；

2. 选择器原理；

3. 隐式迭代 each

4. 动态扩展插件 extend

#### 文件夹的简要说明： 

- demo文件夹主要是测试文件（简单的检验）
- jquery文件夹放的各个版本

#### jquery各个版本的说明：

 >** jquery-1.0 **

 ```js
 	var $ = function ( selector ) {
            // 返回jquery原型上init方法的实例。这里把init函数当做构造函数
            return new $.fn.init( selector );
        }
        $.fn = $.prototype = {
            init: function ( selector ) {
               //......
                return this;
            }
        };
          //将$.fn.init的原型指向$的原型，这样通过init实例化出来的实例就可以访问$原型的成员了
        $.fn.init.prototype = $.fn;
 ```
$ 首先是一个函数，在jquery里他体现了函数的两种身份，一个是普通函数，一个是对象。
![jquery原型图](images/01.png)
