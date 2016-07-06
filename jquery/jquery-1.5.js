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
            jquery: '1.4',
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
            },
            // 获取样式
            getStyle: function( obj, key){
                if( obj.currentStyle ){
                    return obj.currntStyle[key];
                }else {
                    return window.getComputedStyle( obj, null )[key];
                }
            },
            // 去除字符串左右空格
            trim: function( str ){
                return str.replace( /^(\s+)|(\s+$)/g,'');
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
        // DOM 操作方法
        $.fn.extend({
            // get 方法返回的是DOM对象
            get: function( num ){
                if( num && typeof num === 'number' && num < this.length){
                    return this[num];
                }
            },
            // eq 返回的是jquery对象
            eq: function ( num ){
                return $( this.get( num ));
            },
            appendTo: function ( param ) {
                var targets = $( param ),
                    that = this,
                    arr = [];
                $.each( targets, function ( index,element ) {
                    $.each( that, function () {
                        var node = null;
                        if( targets.length-1 === index ){
                            node = this;
                        }else{
                            node = this.cloneNode(true);
                            arr.push( node );
                        }
                        // 防止出现自己添加到自己
                        if( element != node ){
                            element.appendChild( node );
                        }
                    })
                });
                // 用unshift保证添加的顺序
                [].unshift.apply( this,arr );
                return this;
            },
            append: function ( param ) {
                $(param).appendTo( this );
                return this;
            },
            prependTo : function ( param ) {
                var that = this ;
                var targets = $( param )
                var arr = [];
                $.each(targets, function (index,element) {
                    //保证添加的顺序
                    var docfrag = document.createDocumentFragment();
                    $.each( that, function () {
                        var node = null;
                        if( targets.length-1 === index){
                            node = this;
                        }else {
                            node = this.cloneNode(true);
                            arr.push(node);
                        }
                        docfrag.appendChild(node);
                    })
                    element.insertBefore(docfrag,element.children[0]);
                })
                arr.unshift.apply( this,arr );
                return this;
            },
            prepend: function ( param ) {
                $(param).prependTo(this);
                return this;
            },
            remove: function () {
                this.each(function () {
                    this.parentNode.removeChild(this);
                });
                return this;
            }
        });
        //样式操作
        $.fn.extend({
             css: function( key, val ) {
                    var arg = arguments;
                    // 一个参数的情况： 分三种
                    if (arg.length === 1) {
                        // 第一个参数是一个对象
                        if ($.isObj(arg[0])) {
                            this.each(function() {
                                for (var k in key) {
                                    this.style[k] = key[k];
                                }
                            });
                            return this
                            // 一个数组参数，但是需要获取多个属性值，返回一个对象
                        } else if ($.isArray(arg[0])) {
                            var obj = {};
                            for (var i = 0; i < arg[0].length; i++) {
                                obj[arg[0][i]] = $.getStyle(this[0], arg[0][i]);
                            }
                            return obj;
                            // 只有一个字符串参数
                        } else {
                            return $.getStyle(this[0], key);
                        }
                        // 两个参数 ： 设置属性
                    } else if (arg.length === 2) {
                        this.each(function() {
                            this.style[key] = val;
                        });
                        return this;
                    }
                },
            val: function ( param ) {
                if( param === undefined ){
                    // 返回的第一个元素的值
                    return this[0].value;
                }else if( typeof param === 'string' ){
                    this.each( function () {
                        this.value = param;
                    });
                    return this;
                }
            },
            attr: function ( key,value ) {
                if( typeof key ==='string' &&  value === undefined ){
                    return this[0].getAttribute( key );
                }else if ( typeof key === 'string' && typeof value === 'string'){
                    return $.each(this, function () {
                        this.setAttribute( key,value );
                    })
                }
            },
            html: function ( html ) {
                if( html === undefined ){
                    return this[0].innerHTML;
                }else {
                    return $.each( this, function () {
                        this.innerHTML = html;
                    });
                }
            },
            hasClass: function ( cname ) {//只要有就返回true
                var flag = false;
                this.each(function () {
                    var item = $.trim( this.className );
                    var arr = item.split(/\s+/g);
                    for( var i=0; i<arr.length; i++ ){
                        if( arr[i] == $.trim( cname )){
                            flag = true;
                            //只要有这个class就终止遍历
                            return false;
                        }
                    }
                });
                return flag;
            },
            addClass: function ( cname ) {
                //是实现了添加一个类的情况
                var cname = $.trim( cname );
                if( $.isString( cname)){
                    // 如果没有这个class，直接加上
                    if( this.hasClass(cname) === false){
                        this.each(function () {
                            this.className += ' ' + cname;
                        });
                    }else {
                        this.each(function () {
                            var className = $.trim(this.className);
                            var arr = className.split(/\s+/g);
                            for(var i=0;i<arr.length;i++){
                                if(arr[i] === cname){
                                    //去除相同的类名
                                    break;
                                }else {
                                    className += ' ' + cname;
                                    this.className = className;
                                }
                            }
                        });
                    }
                }
                return this;
            },
            removeClass: function ( cname ) {
                if( $.isString(cname)){
                    this.each(function () {
                        var className = this.className;
                        // arr1 是单个DOM对象的类名分隔的数组，arr2是参数分割的数组。（支持移除多个）
                        var arr1 = className.split(/\s+/g);
                        var arr2 = $.trim( cname ).split(/\s+/g);
                        for(var i=0;i<arr1.length;i++){
                            for(var j=0;j<arr2.length;j++){
                                if(arr1[i] === arr2[j]){
                                    arr1[i] = '';
                                }
                            }
                        }
                        this.className = arr1.join(' ');
                    });
                }
                return this;
            },
            toggleClass: function () {
                // 函数和那个布尔型的可选参数没有考虑
                var p = arguments;
                if( p.length ===1 && $.isString( p[0] ) ){
                    var arr = $.trim( p[0] ).split( /\s+/g );
                    // 只有一个类名
                    if( arr.length === 1){
                        var that = this;
                        this.each( function () {
                            if( $(this).hasClass( p[0]) ){
                                that.removeClass( p[0] );
                            }else {
                                that.addClass( p[0] );
                            }
                        });
                        // 有两个类名，则这两个类交替
                    } else if (arr.length ===2 ){
                        this.each(function () {
                            if( $(this).hasClass( arr[0]) ){
                                $(this).removeClass( arr[0] );
                                $(this).addClass( arr[1] );
                            }else {
                                $(this).addClass( arr[0] );
                                $(this).removeClass( arr[1] );
                            }
                        });
                    }
                }
                return this;
            }
        });
        // 事件模块
        $.fn.extend({
            on: function (type,fn) {
                var addEvent = function (param,element,fn1) {
                    param.each(function () {
                        if(this.addEventListener){
                            this.addEventListener(element,fn1,false);
                        }else {
                            this.attachEvent('on'+element,fn1);
                        }
                    });
                }
                var p = arguments;
                // 只绑定一个事件
                if(p.length ===1 && $.isObj(p[0])){
                    for(var key in p[0]){
                        addEvent(this,key,p[0][key])
                    }
                }else if(p.length ===2 && $.isString(p[0])){
                    // 将事件拆开，分别绑定
                    var reg = /\b\w+\b/g;
                    var arr = p[0].match(reg);
                    for(var i=0;i<arr.length;i++){
                        addEvent(this,arr[i],fn);
                    }
                }
                return this;
            },
            off: function (type,fn) {
                var p = arguments;
                var reg = /\b\w+\b/g;
                var arr = p[0].match(reg);
                for(var i=0;i<arr.length;i++){
                    this.each(function () {
                        if(this.removeEventListener){
                            this.removeEventListener(arr[i],fn);
                        }else{
                            this.detachEvent('on'+arr[i],fn);
                        }
                    });
                }
                return this;
            },
            one: function (type,fn) {
                var oriFn = fn;
                fn = function () {
                    // this是调用的那个单个dom元素。
                    oriFn.apply(this,arguments);
                    jQuery(this).off(type,fn);
                };
                return this.on(type,fn);
            },
            hover: function (fn1,fn2) {
                this.mouseover(fn1);
                this.mouseout(fn2);
            },
            toggle: function () {
                var p = arguments;
                this.click(function () {
                    if(!this.i){//保证在实例有多个的情况下，每个切换不受对方干扰
                        this.i = 0;
                    }
                    p[this.i++ % p.length].call(this);
                });
            }
        });
        var arr = ['click','mouseover','mouseout','mousemove','blur','dblclick'];
        $.each(arr, function (index,element) {
            $.fn[element] = function (fn) {
                return  this.on(element,fn);
            }
        });
        //将$.fn.init的原型指向$的原型，这样通过init实例化出来的实例就可以访问$原型的成员了
        $.fn.init.prototype = $.fn;
        window.$ = window.jQuery = $;
    })( window )