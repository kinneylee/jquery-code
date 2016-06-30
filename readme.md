## This is my jquery (simple)

#### 封装的简易版的jquery。基本实现jquery的封装原理，大致是四个核心点：

1. jquery实例化；

2. 选择器原理；

3. 隐式迭代 each

4. 动态扩展插件 extend


#### 文件夹的简要说明： 

- demo 主要是测试文件（简单的检验）
- jquery 存放各个版本

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
![](./images/01.png)

> ** jquery-1.1**

```js
$.extend = $.fn.extend = function ( o1,o2 ) {
            var arg = arguments;
            if(arg.length == 1){
                for(var key in arg[0]){
                    this[key] = arg[0][key];
                }
            }else {
                for(var key in o2){
                    o1[key] = o2[key];
                }
            }
        };
```
这是个简易版本，没考虑深层复制

> ** jquery-1.2** 

```js
	$.extend({
            each: function  (arr,fn){
                for(var i=0;i<arr.length;i++){
                    // 通过fn的返回值可以提前结束循环
                    if(fn.call(arr[i],i,arr[i]) === false){
                        break;
                    }
                }
                return arr;
            }
        });
        $.fn.extend({
            each: function (fn) {
                return $.each(this,fn);
            }
        });
```

每个函数的返回值保证jquery可以链式编程（当然得除掉那些本身就需要返回具体值的函数）

> ** jquery-1.3**

主要添加了一部分选择器功能和一些类型判读方法。



