; (function ($) {
    function validate(_this) {
        var isValid = false;
        var opts = _this.opts;
        if (!opts.novalidate) {
            $(_this).find('.easyui-validatebox').each(function () {
                var vbopts = $(this).validatebox("options");
                if (opts.isLableValid) {
                    if ($(this).is("label,span,div")) {
                        isValid = $(this).text() ? true : false;

                        if (isValid && vbopts.regExpre) {
                            isValid = (new RegExp(vbopts.regExpre, "i")).test($(this).text());
                            if (!isValid) {
                                $.messager.alert("提示信息", vbopts.invalidMessage || vbopts.missingMessage);
                                return isValid;
                            }
                        }
                        if (!isValid) {
                            $.messager.alert("提示信息", vbopts.invalidMessage || vbopts.missingMessage);
                            return isValid;
                        }
                    }
                } else {
					if($(this).is(":hidden") && !opts.isHiddenValid){
						isValid=true;
						return isValid;
					}
						
					
                    if ($(this).hasClass('easyui-datebox')) {
                        var $dateboxval = $(this).next().find('.textbox-value').each(function () { $dateboxval = $(this); });
                        $(this).val($dateboxval.val());

                        var $dateboxtxt = $(this).next().find('.textbox-text').each(function () { $dateboxtxt = $(this); });
                        $dateboxtxt.val($dateboxval.val());

                        if ($.inArray(vbopts.stage, opts.stages) > -1 || $dateboxtxt.val()) {
                            isValid = $dateboxtxt.validatebox('enableValidation').validatebox("isValid");
                            if (!isValid) {
                                $.messager.alert("提示信息", vbopts.invalidMessage || vbopts.missingMessage);
                                return isValid;
                            }
                        } else {
                            $(this).validatebox('disableValidation');
                        }
                    }

                    if ($(this).is("label,span,div")) {
                        isValid = $(this).text() ? true : false;

                        if (isValid && vbopts.regExpre) {
                            isValid = (new RegExp(vbopts.regExpre, "i")).test($(this).text());
                            if (!isValid) {
                                $.messager.alert("提示信息", vbopts.invalidMessage || vbopts.missingMessage);
                                return isValid;
                            }
                        }

                        if (!isValid && !$(this).is(":hidden")) {
                            $.messager.alert("提示信息", vbopts.invalidMessage || vbopts.missingMessage);
                            return isValid;
                        }
                        return;
                    } else {
                        if ($.inArray(vbopts.stage, opts.stages) > -1) {
                            isValid = $(this).validatebox('enableValidation').validatebox('isValid');
							if (!isValid) {
                                $.messager.alert("提示信息", vbopts.invalidMessage || vbopts.missingMessage);
                                return isValid;
                            }
                        } else {
                            if ($(this).val() && $(this).val() !== "0") {
                                isValid = $(this).validatebox('enableValidation').validatebox('isValid');
                                if (!isValid) {
                                    $.messager.alert("提示信息", vbopts.invalidMessage || vbopts.missingMessage);
                                    return isValid;
                                }
                            } else {
                                $(this).validatebox('disableValidation');
                            }
                        }
                    }
                }
            });
        }
        return isValid;
    }

    function init(_this) {
        $(_this).addClass('easyui-validateform');
        var opts = _this.opts;

        if (opts) {
            //为所有easyui-validatebox绑定onblur
            $(_this).find('.easyui-validatebox').each(function () {
                $(this).validatebox();
                var vbopts = $(this).validatebox("options");
                if ($(this).hasClass('easyui-datebox')) {
                    var $dateboxval = $(this).next().find('.textbox-value').each(function () { $dateboxval = $(this); });
                    $(this).val($dateboxval.val());

                    var $dateboxtxt = $(this).next().find('.textbox-text').each(function () { $dateboxtxt = $(this); });
                    $dateboxtxt.val($dateboxval.val());

                    $dateboxtxt.blur(function () {
                        $(this).val($(this).next().val());
                        if ($.inArray(vbopts.stage, opts.stages) > -1 || $(this).val()) {
                            $(this).validatebox('enableValidation').validatebox("validate");
                        } else {
                            $(this).validatebox('disableValidation');
                        }
                    });
                } else {
                    var otherstages = opts.stages;

                    var textboxblurfn = function () {
                        function validfn(_this) {
                            var isValid = $(_this).validatebox('enableValidation').validatebox("isValid");
                        }

                        if ($.inArray(vbopts.stage, otherstages) > -1) {
                            validfn(this);
                        }
                        else {
                            if ($(this).val() && $(this).val() !== "0") {
                                validfn(this);
                            } else {
                                $(this).validatebox({ novalidate: true });
                            }
                        }
                    };

                    if ($(this).hasClass("easyui-textbox")) {
                        $("input", $(this).next("span")).blur(textboxblurfn);
                    } else {
                        $(this).blur(textboxblurfn);
                    }


                }
                if (!vbopts.stage) {
                    vbopts.stage = 1;
                }
                $(this).validatebox(vbopts);
            });
        }
    }

    $.fn.validateform = function (options, param) {
        if (typeof options == 'string') {
            var method = $.fn.validateform.methods[options];
            if (method) {
                return method(this, param);
            }
        }
        options = options || {};

        var _this = this;
        _this.opts = $.extend({}, $.fn.validateform.defaults, options);

        return this.each(function () {
            var state = $.data(this, 'validateform');
            //if (state) {
            //    $.extend(state.options, options);
            //} else {
            state = $.data(this, 'validateform', {
                options: $.extend({}, $.fn.validateform.defaults, $.fn.validateform.parseOptions(this), options),
                initobj: init(_this)
            });
            //}
        });
    };

    $.fn.validateform.methods = {
        options: function (jq) {
            return $.data(jq[0], 'validateform').options;
        },
        validateform: function (jq, stages) {
            var opts = $.data(jq[0], 'validateform').options;
            if (stages && stages.length > 0)
                opts.stages = stages;
            jq.opts = opts;
            return validate(jq);
        },
        validateformlable: function (jq, stages) {
            var opts = $.data(jq[0], 'validateform').options;
            if (stages && stages.length > 0)
                opts.stages = stages;
            opts.isLableValid = true;
            jq.opts = opts;
            return validate(jq);
        }
    };

    $.fn.validateform.parseOptions = function (target) {
        return $.extend({}, $.parser.parseOptions(target, []));
    };

    $.fn.validateform.defaults = {
        stages: [1],
        isAlert: true,
        novalidate: false,
        isLableValid: false,
		isHiddenValid:false
    };
})(jQuery);

; $(function () {
    $('.easyui-validateform').each(function () {
        var opts = {};
        var s = $.trim($(this).attr('data-options'));
        if (s) {
            if (s.substring(0, 1) != "{") {
                s = "{" + s + "}";
            }
            opts = (new Function("return " + s))();
            $(this).validateform(opts);
        }
    });

    /** 
     * 扩展easyui的validator插件rules，支持更多类型验证 
     */
    if (typeof ($.fn.validatebox) !== typeof (undefined)) {
        $.extend($.fn.validatebox.defaults.rules, {
            choice: {
                validator: function (value, param) {
                    var ret = false;
                    if (value && value != "0")
                        ret = true;
                    return ret;
                },
                message: '此为必选项！'
            },
            minLength: { // 判断最小长度  
                validator: function (value, param) {
                    return value.length >= param[0];
                },
                message: '最少输入 {0} 个字符'
            },
            maxLength: { // 判断最小长度  
                validator: function (value, param) {
                    return value.length <= param[0];
                },
                message: '最多输入 {0} 个字符'
            },
            maxLengthJoin: { //TODO 
                validator: function (value, param) {
                    return value.length <= param[0];
                },
                message: '最多输入 {0} 个字符'
            },
            phone: {// 验证电话号码  
                validator: function (value) {
                    return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
                },
                message: '格式不正确,请使用下面格式:028-88888888'
            },
            mobile: {// 验证手机号码  
                validator: function (value) {
                    return /^(13|15|18|17)\d{9}$/i.test(value);
                },
                message: '手机号码格式不正确'
            },
            telNumber: {// 
                validator: function (value) {
                    // return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
                    return /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(value) || /^(\d{7,8})(-(\d{3,}))?$/.test(value);
                },
                message: '电话号码格式不正确'
            },
            phoneAndMobile: {// 电话号码或手机号码  
                validator: function (value) {
                    //去除首尾空格
                    value = $.trim(value);
                    return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value) || /^(13|15|18|11|17|12|14|16|19)\d{9}$/i.test(value);
                },
                message: '电话号码或手机号码格式不正确'
            },
            idcard: {// 验证身份证  
                validator: function (value, type) {
                    value = $.trim(value);
                    var idcardType = $(type[0]).combobox('getValue');
                    switch (idcardType) {
                        case "大陆身份证":
                            return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value) || /^\d{18}(\d{2}[A-Za-z0-9])?$/i.test(value);
                            break;
                        case "香港身份证":
                            return /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/i.test(value);
                            break;
                        case "护照":
                            return /^[a-zA-Z]{5,17}$/i.test(value);
                            break;
                        case "军官证":
                            return /南字第(\d{8})号|北字第(\d{8})号|沈字第(\d{8})号|兰字第(\d{8})号|成字第(\d{8})号|济字第(\d{8})号|广字第(\d{8})号|海字第(\d{8})号|空字第(\d{8})号|参字第(\d{8})号|政字第(\d{8})号|后字第(\d{8})号|装字第(\d{8})号/i.test(value);
                            break;
                        case "澳门身份证":
                            return /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/i.test(value);
                            break;
                        case "台湾身份证":
                            return /^[0-9]{8}$/i.test(value) || /^[0-9]{10}$/i.test(value);
                            break;
                    }
                },
                message: '身份证号码格式不正确'
            },
            nonumber: {
                validator: function (value) {
                    return !(/^\d+$/i.test(value));
                },
                message: '不允许输入数字'
            },
            number: {// 验证纯数字组成的字符串 
                validator: function (value) {
                    return /^\d+$/i.test(value);
                },
                message: '请输入数字'
            },
            numberletter: {
                validator: function (value) {
                    return /^[A-Za-z0-9]+$/i.test(value);
                },
                message: '请输入字母或数字'
            },
            numberletterhyphen: {
                validator: function (value) {
                    return /^[A-Za-z0-9/-]+$/i.test(value);
                },
                message: '请输入字母或数字或"-"'
            },
            noeqzero: {
                validator: function (value) {
                    return parseFloat(value) != 0;
                },
                message: '请输入非零数字'
            },
            gtzero: {
                validator: function (value) {
                    return parseFloat(value) > 0;
                },
                message: '请输入大于零的数字'
            },
            intOrFloat: {// 验证整数或小数  
                validator: function (value) {
                    return /^\d+(\.\d+)?$/i.test(value);
                },
                message: '请输入数字，并确保格式正确'
            },
            currencyNum: {// 验证正的整数或正的任意位数的小数  
                validator: function (value) {
                    //return /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/i.test(value);
                    return /^[0-9]+([.]{1}[0-9]+){0,1}$/i.test(value);
                },
                message: '输入格式不正确'
            },
            currency: {// 验证货币  
                validator: function (value) {
                    return /^\d+(\.\d+)?$/i.test(value);
                },
                message: '货币格式不正确'
            },
            ltInNum: {
                validator: function (value, param) {
                    return parseFloat(value) <= parseFloat($(param[0]).val());
                },
                message: '此数字必须小于等于立项金额！'
            },
            equals: {
                validator: function (value, param) {
                    for (var j = 0; j < param.length; j++) {
                        if (value == $(param[j]).val()) {
                            return false;
                        }
                    };
                    return true;
                },
                message: '不能含有相同经营品牌'
            },
            LSLBltInNum: {
                validator: function (value, param) {
                    return (parseFloat(value) <= (parseFloat($(param[0]).val()) * 1.1));
                },
                message: '不能超过资金下达金额的10%！'
            },
            gtInNum: {
                validator: function (value, param) {
                    return parseFloat(value) >= parseFloat($(param[0]).val());
                },
                message: '此数字必须大于等于前者！'
            },
            qq: {// 验证QQ,从10000开始  
                validator: function (value) {
                    return /^[1-9]\d{4,9}$/i.test(value);
                },
                message: 'QQ号码格式不正确'
            },
            integer: {// 验证整数  
                validator: function (value) {
                    return /^[+]?[1-9]+\d*$/i.test(value);
                },
                message: '请输入正整数'
            },
            integerOrZero: {// 验证整数或零  
                validator: function (value) {
                    return /^[+]?[0-9]+\d*$/i.test(value);
                },
                message: '请输入0或正整数'
            },
            chinese: {// 验证中文  
                validator: function (value) {
                    return /^[\u0391-\uFFE5]+$/i.test(value);
                },
                message: '请输入中文'
            },
            chineseAndLength: {// 验证中文及长度  
                validator: function (value) {
                    var len = $.trim(value).length;
                    if (len >= param[0] && len <= param[1]) {
                        return /^[\u0391-\uFFE5]+$/i.test(value);
                    }
                },
                message: '请输入中文'
            },
            english: {// 验证英语  
                validator: function (value) {
                    return /^[A-Za-z]+$/i.test(value);
                },
                message: '请输入英文'
            },
            englishAndLength: {// 验证英语及长度  
                validator: function (value, param) {
                    var len = $.trim(value).length;
                    if (len >= param[0] && len <= param[1]) {
                        return /^[A-Za-z]+$/i.test(value);
                    }
                },
                message: '请输入英文'
            },
            englishUpperCase: {// 验证英语大写  
                validator: function (value) {
                    return /^[A-Z]+$/.test(value);
                },
                message: '请输入大写英文'
            },
            Email: {
                validator: function (value) {
                    var flag = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/.test(value);
                    var email_suffix = '.com|.com.cn|.net|.cn';
                    var suffix = new String(value.split('@')[1]);
                    var _s = suffix.indexOf('.');
                    var _e = suffix.length;
                    var _suffix = new String(suffix).substring(_s, _e);
                    if (email_suffix.indexOf(_suffix) < 0) {
                        flag = false;
                    }
                    return flag;
                },
                message: '电子邮箱格式不正确'
            },
            gtMinDate: {
                validator: function (value) {
                    var date = new Date(value);
                    return new Date(value) > new Date('1900-01-01');
                },
                message: '请选择大于最小日期'
            },
            md: {
                validator: function (value, param) {
                    var d1 = $.fn.datebox.defaults.parser(param[0]);
                    var d2 = $.fn.datebox.defaults.parser(value);
                    return d2 <= d1;
                },
                message: 'The date must be less than or equals to {0}.'
            },
            unnormal: {// 验证是否包含空格和非法字符  
                validator: function (value) {
                    return /.+/i.test(value);
                },
                message: '输入值不能为空和包含其他非法字符'
            },
            username: {// 验证用户名  
                validator: function (value) {
                    return /^[a-zA-Z][a-zA-Z0-9_]{3,12}$/i.test(value);
                },
                message: '用户名不合法（字母开头，允许4-12字节，允许字母数字下划线）'
            },
            usernameEx: {// 验证用户名  
                validator: function (value) {
                    return /^[a-zA-Z][a-zA-Z0-9_]{3,11}$/i.test(value);
                },
                message: '用户名不合法（字母开头，允许4-12字节，允许字母数字下划线）'
            },
            usernameLoginID: {// 验证登录名  
                validator: function (value) {
                    return /^[a-zA-Z][a-zA-Z0-9_]{3,11}$/i.test(value);
                },
                message: '登录名不合法（字母开头，允许4-12字节，允许字母数字下划线）'
            },
            LoginName: {
                validator: function (value) {
                    return /^[a-zA-Z][a-zA-Z0-9]{3,11}$/i.test(value);
                },
                message: '登录名格式不正确！'
            },
            LoginNameEx: {
                validator: function (value) {
                    return /^[\u4E00-\u9FA5\w-a-zA-Z0-9_]{2,14}$/i.test(value);
                },
                message: '登录名格式不正确！'
            },
            password: {
                validator: function (value) {
                    if (/^[\w\u4e00-\u9fa5]+$/gi.test(value)) {
                        return /^[a-zA-Z0-9]{4,14}$/i.test(value);
                    }
                    else {
                        return false
                    }
                },
                message: '密码格式不正确！'
            },
            faxno: {// 验证传真  
                validator: function (value) {
                    return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
                },
                message: '传真号码不正确'
            },
            zip: {// 验证邮政编码  
                validator: function (value) {
                    return /^[0-9]\d{5}$/i.test(value);
                },
                message: '邮政编码格式不正确'
            },
            ip: {// 验证IP地址  
                validator: function (value) {
                    var regEx = /(?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/;
                    return regEx.test(value);
                },
                message: 'IP地址格式不正确'
            },
            name: {// 验证姓名，可以是中文或英文  
                validator: function (value) {
                    return /^[\u0391-\uFFE5]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
                },
                message: '请输入姓名'
            },
            engOrChinese: {// 可以是中文或英文  
                validator: function (value) {
                    return /^[\u0391-\uFFE5]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
                },
                message: '请输入中文'
            },
            engOrChineseAndLength: {// 可以是中文或英文  
                validator: function (value) {
                    var len = $.trim(value).length;
                    if (len >= param[0] && len <= param[1]) {
                        return /^[\u0391-\uFFE5]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
                    }
                },
                message: '请输入中文或英文'
            },
            carNo: {
                validator: function (value) {
                    return /^[\u4E00-\u9FA5][\da-zA-Z]{6}$/.test(value);
                },
                message: '车牌号码无效（例：川B12350）'
            },
            carenergin: {
                validator: function (value) {
                    return /^[a-zA-Z0-9]{16}$/.test(value);
                },
                message: '发动机型号无效(例：FG6H012345654584)'
            },
            same: {
                validator: function (value, param) {
                    if ($(param[0]).val() != "" && value != "") {
                        return $(param[0]).val() == value;
                    } else {
                        return true;
                    }
                },
                message: '两次输入的密码不一致!'
            },
            selectValueRequired: {
                validator: function (value, param) {
                    if (value == "" || value.indexOf('请选择') >= 0) {
                        $(this).trigger("focus");
                        return false;
                    } else {
                        return true;
                    }
                },
                message: '该下拉框为必选项'
            },
            OrganCode: {
                validator: function (value, param) {
                    if (value == '/') return true;
                    var ws = [3, 7, 9, 10, 5, 8, 4, 2];
                    var str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    var reg = /^([0-9A-Z]){8}-[0-9|X]$/;// /^[A-Za-z0-9]{8}-[A-Za-z0-9]{1}$/
                    var regEx = /^([0-9A-Z]){8}-[0-9a-zA-Z|X|*]$/;
                    var sum = 0;
                    for (var i = 0; i < 8; i++) {
                        sum += str.indexOf(value.charAt(i)) * ws[i];
                    }
                    var c9 = 11 - (sum % 11);
                    c9 = c9 == 10 ? 'X' : c9

                    if (regEx.test(value)) {
                        return true;
                    }
                    else {
                        if (!reg.test(value) || c9 == value.charAt(9)) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                },
                message: '企业代码不正确，请输入正确的企业代码'
            },
            OrganCodeEx: {
                validator: function (value, param) {
                    var ws = [3, 7, 9, 10, 5, 8, 4, 2];
                    var str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    var reg = /^([0-9A-Z]){8}-[0-9|X]$/;// /^[A-Za-z0-9]{8}-[A-Za-z0-9]{1}$/
                    var regEx = /^([0-9A-Z]){8}-[0-9a-zA-Z|X|*]$/;
                    var sum = 0;
                    for (var i = 0; i < 8; i++) {
                        sum += str.indexOf(value.charAt(i)) * ws[i];
                    }
                    var c9 = 11 - (sum % 11);
                    c9 = c9 == 10 ? 'X' : c9

                    if (regEx.test(value)) {
                        return true;
                    }
                    else {
                        if (!reg.test(value) || c9 == value.charAt(9)) {
                            //验证统一社会信用代码

                            //代码字符集-代码字符
                            var charCode = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "T", "U", "W", "X", "Y", "0"];
                            //代码字符集-代码字符数值
                            var charVal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
                            //各位置序号上的加权因子
                            var posWi = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
                            //统一代码由十八位的数字或大写英文字母（不适用I、O、Z、S、V）组成，第18位为校验位。
                            //第1位为数字或大写英文字母，登记管理部门代码
                            //第2位为数字或大写英文字母，机构类别代码
                            //第3到8位共6位全为数字登记管理机关行政区划码
                            //第9-17位共9位为数字或大写英文字母组织机构代码
                            //第18为为数字或者大写的Y
                            var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };
                            var reg = /^[0-9ABCDEFGY][1239]\d{6}([0-9ABCDEFGHJKLMNPQRTUWXY]{9})([0-9A-Z])$/;
                            if (value.length != 0) {
                                if (!reg.test(value)) {
                                    return false;
                                }
                                else if (!city[value.substr(2, 2)]) {
                                    return false;
                                }
                                else {
                                    //校验位校验
                                    value = value.split('');
                                    //∑(ci×Wi)(mod 31)
                                    var sum = 0;
                                    var ci = 0;
                                    var Wi = 0;
                                    for (var i = 0; i < 17; i++) {
                                        ci = charVal[charCode.indexOf(value[i])];
                                        Wi = posWi[i];
                                        sum += ci * Wi;
                                    }
                                    var c10 = 31 - (sum % 31);
                                    if (charCode[c10] != value[17]) {
                                        return false;
                                    }
                                    else {
                                        return true;
                                    }
                                }
                            }
                        } else {
                            return true;
                        }
                    }
                },
                message: '企业代码不正确，请输入正确的企业代码'
            },
            SocityOrganCode: {
                validator: function (value, param) {
                    if (value == '/') return true;
                    var regEx = /^([0-9A-Z]){18}$/;
                    if (regEx.test(value)) {
                        return true;
                    }
                    else {
                        //验证统一社会信用代码
                        //代码字符集-代码字符
                        var charCode = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "T", "U", "W", "X", "Y", "0"];
                        //代码字符集-代码字符数值
                        var charVal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
                        //各位置序号上的加权因子
                        var posWi = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
                        //统一代码由十八位的数字或大写英文字母（不适用I、O、Z、S、V）组成，第18位为校验位。
                        //第1位为数字或大写英文字母，登记管理部门代码
                        //第2位为数字或大写英文字母，机构类别代码
                        //第3到8位共6位全为数字登记管理机关行政区划码
                        //第9-17位共9位为数字或大写英文字母组织机构代码
                        //第18为为数字或者大写的Y
                        var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };
                        var reg = /^[0-9ABCDEFGY][1239]\d{6}([0-9ABCDEFGHJKLMNPQRTUWXY]{9})([0-9A-Z])$/;
                        if (value.length != 0) {
                            if (!reg.test(value)) {
                                return false;
                            }
                            else if (!city[value.substr(2, 2)]) {
                                return false;
                            }
                            else {
                                //校验位校验
                                value = value.split('');
                                //∑(ci×Wi)(mod 31)
                                var sum = 0;
                                var ci = 0;
                                var Wi = 0;
                                for (var i = 0; i < 17; i++) {
                                    ci = charVal[charCode.indexOf(value[i])];
                                    Wi = posWi[i];
                                    sum += ci * Wi;
                                }
                                var c10 = 31 - (sum % 31);
                                if (charCode[c10] != value[17]) {
                                    return false;
                                }
                                else {
                                    return true;
                                }
                            }
                        }
                    }
                },
                message: '社会信用代码不正确，请输入正确的代码'
            },
            ProjectCode: {
                validator: function (value, param) {
                    var regEx = param[0] || '^\S+〔\S+〕\S+号$';
                    if (regEx.test(value)) {
                        return true;
                    }
                    return false;
                },
                message: '请将立项文号填写完整!'
            },
            exceptChar: {
                validator: function (value, param) {
                    for (var i = 0; i < param.length; i++) {
                        if (value.indexOf(param[i]) >= 0) {
                            $.fn.validatebox.defaults.rules.exceptChar.message = "输入不正确，请不要包含 " + param.join(' ') + " 字符";
                            return false;
                        }
                    }
                    return true;
                },
                message: ''
            }
        });
    }
});
