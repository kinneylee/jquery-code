/**
 * Created by Duncan on 2016/6/27.
 */
    //��֤undefined���ᱻ�޸�
    ( function( window, undefined ){
        var $ = function ( selector ) {
            // ����jqueryԭ����init������ʵ���������init�����������캯��
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
        // ��չ�������ֱ�ӵ�$�����$��ԭ���ϡ������չ�ı��ʣ�û��������jQuery��ô���ӣ�û�п�����ȸ��ƣ�
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
        // �������ѡ����
        $.extend({
            select: function ( selector ) {
                // ���������ж�
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
        //��$.fn.init��ԭ��ָ��$��ԭ�ͣ�����ͨ��initʵ����������ʵ���Ϳ��Է���$ԭ�͵ĳ�Ա��
        $.fn.init.prototype = $.fn;
        window.$ = window.jQuery = $;
    })( window )