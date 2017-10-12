;
(function ($, window, document, undefined) {
    //定义Beautifier的构造函数
    var MyCaptcha = function (ele, opt) {
        this.$element = ele,
            this.defaults = {
                'url': '/captcha',
                'fontSize': '12px',
                'textDecoration': 'none'
            },
            this.options = $.extend({}, this.defaults, opt),
            this.clickPoint = [];
    }
    //定义MyCaptcha的方法
    MyCaptcha.prototype = {
        imgclick: function (target, e) {
            if (this.clickPoint.length >= 3) {
                return;
            }
            var offsetX = e.offsetX;

            var offsetY = e.offsetY;
            var imgWidth = target.width;
            var imgHeight = target.height;
            console.log(imgWidth);
            var iWidth = 330; //图片宽度
            var iHeight = 160; //图片高度
            var x = offsetX * (iWidth / imgWidth);
            var y = offsetY * (iHeight / imgHeight);
            var point = {};
            point['x'] = x;
            point['y'] = y;
            this.clickPoint.push(point);

            console.log("array size" + this.clickPoint.length);

            //显示选择点
            var html = '<div class="myCaptcha-point myCaptcha-point'+this.clickPoint.length+'"></div>';
            $(html).appendTo(this.$element.find('.myCaptcha-img-box')).css({"left":offsetX-13,"top":offsetY-25});
            if (this.clickPoint.length >= 3) {
                this.checkCaptcha();
            }
        },
        checkCaptcha: function () {
            //base64加密
            var _this = this;
            var encClickPoint = $.base64.encode(JSON.stringify(this.clickPoint));
            console.log("encoded click point:" + encClickPoint);
            $.get("checkCaptcha", {"a": encClickPoint}, function (data) {

                if (data.status == "OK") {
                    _this.success();
                    console.log("验证成功");
                } else {
                    _this.showTip("warning");
                    setTimeout(function(){_this.load();}, 800);
                    //_this.load();
                    console.log("验证失败");
                }

            }, "json");
        },
        init: function () {
            //构建html
            var html = '<div class="myCaptcha-img-box">'
                + '<img class="myCaptcha-image" src="">'
                + '<div class="myCaptcha-btn-refresh" title="刷新"></div>'
                + '</div>'
                + '<div class="myCaptcha-tip-box normal"><span class="myCaptcha-tip-box tip-text"></span></div>'
                + '<div class="myCaptcha-tip-box success"><div class="success-icon"></div>验证成功</div>'
                + '<div class="myCaptcha-tip-box warning"><div class="warning-icon"></div>验证失败，请重试</div>';

            this.$element.append(html);
            this.$element.addClass("myCaptcha");
            //加载图片
            this.load();
            //监听
            var _this = this;
            this.$element.find('.myCaptcha-image').click(function (e) {
                _this.imgclick(this, e);
            });
            //获取验证码
            this.$element.find('.myCaptcha-btn-refresh').click(function (e) {
                _this.load()
            });


            return this.$element;
        },
        load: function () {
            //显示刷新按钮
            this.$element.find('.myCaptcha-btn-refresh').show();
            this.showTip("normal");
            //删除选择标注
            this.$element.find('.myCaptcha-point').remove();

            this.clickPoint = [];
            var _this = this;
            $.get("/captcha", {}, function (data) {
                if (data.status == "OK") {
                    console.log("数据:" + data.data);
                    //显示提示
                    var tip = "请依次点击:";
                    for (var i = 0; i < 3; i++) {
                        tip += "\"" + data.data[i] + "\" "
                    }

                    _this.$element.find(".tip-text:first").html(tip);
                    var img= _this.$element.find(".myCaptcha-image");
                    img.fadeOut("fast").attr("src", "/captchaImg?r=" + Math.random()).fadeIn("fast");
                } else {
                    console.log("获取图片验证码失败!");
                }
            }, "json");
        },
        success:function(){

            //验证成功
            //框变绿色，并提示验证成功
            this.showTip("success");
            //把刷新隐藏
            this.$element.find('.myCaptcha-btn-refresh').hide();

        },
        showTip:function(type){
            var n = this.$element.find('.myCaptcha-tip-box.normal').hide();
            var s = this.$element.find('.myCaptcha-tip-box.success').hide();
            var w = this.$element.find('.myCaptcha-tip-box.warning').hide();
            if(type=='success'){
                s.fadeIn("slow");
            }else if(type=='warning'){
                w.fadeIn("slow");
            }else{
                n.fadeIn("slow");
            }
            return this;
        }

    }
    //在插件中使用MyCaptcha对象
    $.fn.MyCaptcha = function (options) {
        //创建Beautifier的实体
        var myCaptcha = new MyCaptcha(this, options);
        //调用其方法
        return myCaptcha.init();
    }
})(jQuery, window, document);