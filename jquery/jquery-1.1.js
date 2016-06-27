/**
 * Created by Duncan on 2016/6/27.
 */
    //保证undefined不会被修改
    ( function( window, undefined ){
        var $ = function ( selector ) {
            // 返回jquery原型上init方法的实例。这里把init函数当做构造函数
            return new $.fn.init( selector );
        }
        $.fn = $.prototype = {
            init: function ( selector ) {
                var result = $.select( selector );
                [].push.apply( this,result );
                return this;
            },
            jquery: '1.0',
            length: 0,
            size: function () {
                return this.length;
            }
        };
        // 扩展方法，分别加到$对象和$的原型上。插件扩展的本质（没有真正的jQuery那么复杂，没有考虑深度复制）
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
        // 最基本的选择器
        $.extend({
            select: function ( selector ) {
                // 后续补上判断
                var result = [],
                    firstChar = selector.charAt(0),
                    str = document.getElementsByTagName( '*' );
                switch(firstChar){
                    case '#':
                        result.push.call(result,document.getElementById( selector.slice(1) ));
                        break;
                    case '.':
                        if(document.getElementsByClassName){
                            result.push.apply(result,document.getElementsByClassName( selector.slice(1) ));
                        }else {
                            for(var i=0;i<str.length;i++){
                                var classname = str[i].className;
                                var arr =classname.split(/\s+/);
                                for(var j=0;j<arr.length;j++){
                                    if(arr[j] == selector.slice(1)){
                                        result.push.call(result,str[i]);
                                        break;
                                    }
                                }
                            }
                        }
                        break;
                    default :  result.push.apply(result,document.getElementsByTagName(selector));
                        break;
                }
                return result;
            }
        });
        //将$.fn.init的原型指向$的原型，这样通过init实例化出来的实例就可以访问$原型的成员了
        $.fn.init.prototype = $.fn;
        window.$ = window.jQuery = $;
    })( window )