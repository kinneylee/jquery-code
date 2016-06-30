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
                 if( $.isString( selector )){
                    if( selector.replace(/^\s*/,'').charAt(0)==='<'){
                        [].push.apply( this, $.parseHTML( selector ));
                    }else {
                        [].push.apply( this, $.select( selector ));
                    }
                    // 设置jquery的标志位
                    this.selector = selector;
                    return this;
                }
                //如果selector本身就是一个jquery对象，那么直接返回
                if( 'selector' in selector){
                    return selector;
                }
                // 将DOM对象转化成jquery对象
                if( $.isDom( selector )){
                    this[0] = selector;
                    this.length = 1;
                    return this;
                }
                if($.isArrayLike( selector )){
                    [].push.apply( this, selector );
                    return this;
                }
            },
            jquery: '1.3',
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
            },
            parseHTML: function( html ){
                var result = [],
                    i = 0,
                    div = document.createElement('div');
                div.innerHTML = html;
                var len = div.children.length;
                for( ; i<len; i++ ){
                    result.push(div.children[i]);
                }
                return result;
            }
        });
        // 迭代
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
        // 类型判断
        $.extend({
            isString: function( str ){
                return typeof str === 'string';
            },
            isDom: function( dom ){
                return dom.nodeType === 1;
            },
            isArray: function( arr ){
                return Object.prototype.toString.call( arr ) === '[object Array]';
            },
            isObj: function ( obj ){
                return Object.prototype.toString.call( obj ) === '[object Object]';
            },
            isArrayLike: function ( arr ){
               return ( arr && arr.length && arr.length>0 && (!$.isArray( arr )))
            },
            isFunction: function( fun ){
                return typeof fun === 'function';
            }
        });
        //将$.fn.init的原型指向$的原型，这样通过init实例化出来的实例就可以访问$原型的成员了
        $.fn.init.prototype = $.fn;
        window.$ = window.jQuery = $;
    })( window )