//取得FieldOption
function GetFieldOpts($this) {
    var field_data_opts = $this.attr('data-opts');
    var field_data_options = $this.attr('data-options');

    var valname = $this.attr('valname') || $this.attr('textfield');

    var field_opts = { valname: valname, textfield: valname };
    if (field_data_opts) {
        field_opts = $.extend(field_opts, field_data_opts.GetInstance());
    }

    if (field_data_options) {
        field_opts = $.extend(field_opts, field_data_options.GetInstance());
    }
    return field_opts;
}

/**
    * 给时间框控件扩展一个清除的按钮
    */
// $.fn.datebox.defaults.cleanText = '清空';
// (function ($) {
//     var buttons = $.extend([], $.fn.datebox.defaults.buttons);
//     console.info("buttons",$.fn.datebox.defaults.buttons);
//     buttons.splice(1, 0, {
//         text: function (target) {
//             return $(target).datebox("options").cleanText
//         },
//         handler: function (target) {
//             $(target).datebox("setValue", "");
//             $(target).datebox("hidePanel");
//         }
//     });
//     $.extend($.fn.datebox.defaults, {
//         buttons: buttons
//     });
// })(jQuery);

; (function ($) {
    Array.prototype.GetTextById = function (id) {
        var ret = '';
        $(this).each(function (i, o) {
            if (o.id === parseInt(id)) {
                ret = o.text;
                return;
            }
        });
        return ret;
    }

    //通过数符串对到实例
    String.prototype.GetInstance = function (str) {
        var opts = null;
        var s = this
        if (s) {
            if (s.substring(0, 1) !== "{") {
                s = "{" + s + "}";
            }
            try {
                opts = (new Function("return " + s))();
            } catch (err) {
                console.info("转对象报错了：" + s);
            }

        }
        return opts;
    };

    //通过数符串对到实例
    String.prototype.GetInstanceEx = function (data) {
        var attrValue = this;
        attrValue = attrValue.split(',')[0];//只取逗号之前的值
        var objCache = {};
        var tmpData = data;

        var dotIdx = attrValue.lastIndexOf('.');
        if (dotIdx > 0) { //链式取值
            var preLongStr = attrValue.substr(0, dotIdx);
            if (typeof (objCache[preLongStr]) === 'undefined') { //缓存链式属性指向对象
                var spArr = attrValue.split('.');
                spArr.splice(-1);
                $.each(spArr, function (i, item) {//开始步进取值
                    if (typeof (tmpData) === 'undefined' || tmpData === null)
                        return false;
                    var fieldName = item;
                    var charIdx = item.indexOf('[');
                    if (charIdx > 0 && item[item.length - 1] == ']') {//数组筛选
                        fieldName = item.substr(0, charIdx);
                        tmpData = tmpData[fieldName];
                        if (typeof (tmpData) == 'undefined' || tmpData === null)
                            return false;
                        var expStr = item.substr(charIdx + 1, item.length - charIdx - 2);
                        if ($.isNumeric(expStr)) {
                            tmpData = tmpData[expStr];
                        }
                        else {
                            expStrArr = expStr.split('=');//暂仅支持=表达式筛选
                            var filterVal = null;
                            $.each(tmpData, function (j, jItem) {//筛选满足条件的值
                                if (jItem[expStrArr[0]] == expStrArr[1]) {
                                    filterVal = jItem;
                                    return false;
                                }
                            });
                            tmpData = filterVal;
                            if (!tmpData) //未找到对应值跳出取值
                                return false;
                        }
                    }
                    else {
                        tmpData = tmpData[fieldName];
                    }
                });
                objCache[spArr.join('.')] = tmpData;
            }
            tmpData = objCache[preLongStr];
        }

        var targetVal = (tmpData || {})[dotIdx > 0 ? attrValue.substr(dotIdx + 1) : attrValue];
        return targetVal;
    };

    Date.prototype.Format = function (fmt) { //author: meizz 
        var d = null;

        if (!this) {
            return '';
        }
        if (!fmt) {
            fmt = 'yyyy-MM-dd';
        }
        try {
            if (typeof (this) === 'string') {
                var thisStr = this.replace('T', ' ').replace(/\-/g, '/').replace(/\.\d+/g, '');

                if (thisStr === '0001/01/01 00:00:00') {
                    return '';
                }

                d = new Date(thisStr);
            }
            else {
                d = this;
            }

            if (d.getFullYear() == 1) {
                return '';
            }
        }
        catch (e) {
            return '';
        }

        var o = {
            "M+": d.getMonth() + 1, //月份         
            "d+": d.getDate(), //日         
            "h+": d.getHours() % 12 == 0 ? 12 : d.getHours() % 12, //小时         
            "H+": d.getHours(), //小时         
            "m+": d.getMinutes(), //分         
            "s+": d.getSeconds(), //秒         
            "q+": Math.floor((d.getMonth() + 3) / 3), //季度         
            "S": d.getMilliseconds() //毫秒         
        };
        var week = {
            "0": "/u65e5",
            "1": "/u4e00",
            "2": "/u4e8c",
            "3": "/u4e09",
            "4": "/u56db",
            "5": "/u4e94",
            "6": "/u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[d.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };
}(jQuery));
$.fn.bindViewValByAtr = function (data, attrName, OptArrData, OptArrName) {

    $(this).find("*[" + attrName + "]").each(function () {
        var thisObj = $(this);
        var OptArrValue = thisObj.attr(OptArrName);
        var attrValue = thisObj.attr(attrName);
        var targetVal = attrValue.GetInstanceEx(data);
        var fieldopt = GetFieldOpts(thisObj);
        if (!fieldopt.showonly) {
            if (!thisObj.is("select") && !thisObj.is(".combobox-f") && OptArrData && thisObj.attr(OptArrName)) {
                var OptionArrList = OptArrValue.GetInstanceEx(OptArrData);
                if (OptionArrList && OptionArrList.length > 0) {
                    targetVal = OptionArrList.GetTextById(targetVal) || targetVal;
                }
            }

            if (targetVal != null && typeof (targetVal) != "undefined" && targetVal != "0001-1-1") {

                if (thisObj.is(".combobox-f")) {
                    var cbOpt = thisObj.combobox("options");
                    thisObj.combobox(cbOpt.multiple ? "setValues" : "select", targetVal);
                } else if (thisObj.is(".datebox-f")) {
                    if (targetVal == "1901-01-01T00:00:00" || targetVal == "0001-01-01T00:00:00") {
                        thisObj.datebox("setValue", "");
                    } else {
                        thisObj.datebox("setValue", targetVal);
                    }

                } else if (thisObj.is(".textbox-f"))
                    thisObj.textbox("setValue", targetVal);
                else if (thisObj.is("select")) {
                    thisObj.find("option:contains('" + targetVal + "')").attr("selected", true);
                    thisObj.find("option[value='" + targetVal + "']").attr("selected", true);
                }
                else if (thisObj.is(":input"))
                    thisObj.val(targetVal);
                else
                    thisObj.text(targetVal);
            }
        }
    });
}

/**
* html元素数据绑定, 可在元素上指定 cacheObj 属性,把数据所属的对象缓存在元素上, 使用时以$(元素).data("cacheObj") 的方式读取
* attrName：标签属性
* data：json数据对象
*/
$.fn.bindOptionDataByName = function (data, attrName) {
    attrName = attrName || "name";
    $(this).find("*[" + attrName + "]").each(function () {
        var thisObj = $(this);
        var attrValue = thisObj.attr(attrName);
        var targetVal = attrValue.GetInstanceEx(data);
        var fieldopt = GetFieldOpts(thisObj);
        if (!fieldopt.showonly) {
            if (targetVal != null && typeof (targetVal) != "undefined" && targetVal != "0001-1-1") {
                if (thisObj.is(".combobox-f")) {
                    var field_opts = thisObj.combobox("options");
                    if (field_opts.firstoption) {
                        targetVal = $.merge([field_opts.firstoption], targetVal);
                    }
                    thisObj.combobox({
                        valueField: 'id',
                        textField: 'text', data: targetVal
                    });
                } else {
                    $(targetVal).each(function (i, o) {
                        thisObj.append('<option value="' + o.id + '">' + o.text + '</option>');
                    });
                }
            }
        }
    });
};

/**
* html元素数据绑定, 可在元素上指定 cacheObj 属性,把数据所属的对象缓存在元素上, 使用时以$(元素).data("cacheObj") 的方式读取
* attrName：标签属性
* data：json数据对象
*/
$.fn.bindViewDataByName = function (data, attrName) {
    attrName = attrName || "name";
    var objCache = {};
    $(this).find("*[" + attrName + "]").each(function () {
        var thisObj = $(this);
        var attrValue = thisObj.attr(attrName);
        var targetVal = attrValue.GetInstanceEx(data);

        var targetVal = (tmpData || {})[dotIdx > 0 ? attrValue.substr(dotIdx + 1) : attrValue];
        if (targetVal != null && typeof (targetVal) != "undefined" && targetVal != "0001-1-1") {
            if (thisObj.is(".combobox-f")) {
                var cbOpt = thisObj.combobox("options");
                thisObj.combobox(cbOpt.multiple ? "setValues" : "select", targetVal);
            } else if (thisObj.is(".datebox-f")) {
                thisObj.datebox("setValue", targetVal);
            } else if (thisObj.is(".textbox-f"))
                thisObj.textbox("setValue", targetVal);
            else if (thisObj.is("select")) {
                //thisObj.find("option[id='" + targetVal + "']").attr("selected", true);
                thisObj.find("option[value='" + targetVal + "']").attr("selected", true);
            }
            else if (thisObj.is(":input"))
                thisObj.val(targetVal);
            else
                thisObj.text(targetVal);
        }
    });
    $(this).data("formdata", data);
};

/**
 * 取得所有editlabel表单编辑框
 * @param {any} jq
 */
function _getEditors(jq) {
    var ret = [];
    var labelList = $(jq).find('[class*=editlabel-]');
    $(labelList).each(function (i, o) {
        var ovalname = $(o).attr("valname");
        var $nextm = $(o).next();
        if (!$nextm || $nextm.length < 1) {
            $nextm = $(o);
        }
        var $m = ($nextm && $nextm.length > 0) ? $nextm : $(o);
        var mvalname = $m.attr("valname");
        if ($m && $m.length > 0 && ovalname === mvalname) {
            ret.push($m[0]);
        }
    });
    return ret;
}

function _getEditClass(_el, clsPrefix) {
    clsPrefix = clsPrefix || "editlabel-";
    var editClass = $(_el).attr("class");
    //处理validatebox 类影响 filegridui 取值问题
    if (editClass.indexOf("easyui-validatebox") > -1) {
        editClass = editClass.replace(/easyui-validatebox/, "");
    }
    editClass = editClass.substring(editClass.indexOf(clsPrefix) + clsPrefix.length, editClass.length);
    var firstSpace = editClass.indexOf(" ");
    editClass = firstSpace > -1 ? editClass.substring(0, firstSpace) : editClass;
    return editClass;
}

//单选择及复选按钮统一调用数据
function appendCheckboxOrRadio($editele, inputType, fieldopt, eleData, curValue, formData) {
    if (eleData) {
        if (fieldopt.formatval) {
            curValue = fieldopt.formatval.call(this, curValue, formData, fieldopt);
        }
        $(eleData).each(function (i, opteleData) {
            var attrs = '';

            if (curValue) {
                if ((inputType == "checkbox" && ((typeof (curValue) == "string") ? curValue.indexOf(opteleData.id) > -1 : opteleData.id == curValue))) {
                    attrs = 'checked="checked"';
                } else if ((inputType == "radio" && curValue && opteleData.id == curValue)) {
                    attrs = 'checked="checked"';
                }
            } else {
                if (opteleData.checked == 'checked' || opteleData.checked == true) {
                    attrs = 'checked="checked"';
                }
            }

            if (fieldopt.disabled) {
                attrs += ' disabled="true"';
            } else {
                if (opteleData.disabled) {
                    attrs += ' disabled="true"';
                }
            }
            var $optelespan = $('<div class=" ' + (fieldopt.class ? fieldopt.class : "") + '"  style="' + (fieldopt.style ? fieldopt.style : "") + '"></div>');
            if (fieldopt.horizontal) {
                $optelespan.addClass("el-inline");
            }
            var $optele = $('<input type="' + inputType + '" name="' + fieldopt.textfield + '" ' + attrs + '/>');
            $optele.val(opteleData.id);
            $optele.data("checkorradiodata", opteleData.id);
            var $opteletxt = $('<span style="padding-left:4px;padding-right:4px;margin-right:5px">' + opteleData.text + '</span>');

            $optelespan.append($optele);
            //TODO
            //if (opteleData.onChange) {
            //    function webChange() {
            //        var cv = $(this).is(':checked');
            //        console.info(cv);
            //        if (cv) {
            //            opteleData.onChange.call(this, cv);
            //        }
            //    }
            //    if ("\v" == "v") {
            //        $optele[0].onpropertychange = webChange;
            //    } else {
            //        $optele[0].addEventListener("ValChange", webChange(), false);
            //    }
            //}
            $optelespan.append($opteletxt);
            $editele.append($optelespan);
            if (!fieldopt.disabled && !opteleData.disabled) {
                //$opteletxt.click(function () {
                //    var curVal = $(this).parent().find("input:checked").val();
                //    if (curVal) {
                //        if (inputType == "checkbox") {
                //            $(this).parent().find("input").removeAttr("checked");
                //        }
                //    } else {
                //        $(this).parent().find("input").prop("checked", "checked");
                //    }
                //});
            }
        });
    }
}

//CheckboxControl
; (function ($) {
    function init(_this) {
        var dataBase = _this.opts.data._Items || _this.opts.data;
        var opts = _this.opts;

        appendCheckboxOrRadio(_this, "checkbox", opts, dataBase, opts.value);
        if (_this.opts.onLoadSuccess) {
            _this.opts.onLoadSuccess.call(this, dataBase, _this, _this.opts.editable);
        }
    }

    $.fn.checkbox = function (options, param) {
        if (typeof options === 'string') {
            var method = $.fn.checkbox.methods[options];
            if (method) {
                return method(this, param);
            }
        }
        options = options || {};

        var _this = this;
        _this.opts = $.extend({}, $.fn.checkbox.defaults, options);

        return this.each(function () {
            var state = $.data(this, 'checkbox');
            //if (state) {
            //    $.extend(state.options, options);
            //} else {
            $.ajaxSettings.async = false;
            if (_this.opts.url) {
                $.getJSON(_this.opts.url, function (_data) {
                    options.data = _this.opts.data = _data;
                });
            }
            $.ajaxSettings.async = true;

            state = $.data(this, 'checkbox', {
                options: $.extend({}, $.fn.checkbox.defaults, $.fn.checkbox.parseOptions(this), options),
                initobj: init(_this)
            });
            //}
        });
    };

    $.fn.checkbox.methods = {
        options: function (jq) {
            return $.data(jq[0], 'checkbox').options;
        },
        getValue: function (jq) {
            var opts = $.data(jq[0], 'checkbox').options;
            var curValue = opts.retIsArr ? [] : "";
            var space = opts.space || ",";//space为分隔符如果有则使用自己定义的如:、，,
            var allCheckbox = $(jq[0]).find('input:checkbox:checked');
            $.each(allCheckbox, function (cbi, cbo) {
                if (opts.retIsArr) {
                    var checkboxData = $(this).data("checkorradiodata");
                    curValue.push((checkboxData || $(this).val()));
                } else {
                    curValue += $(this).val() + ((allCheckbox.length == (cbi + 1)) ? "" : space);
                }
            });
            return curValue;
        },
        reload: function (jq, param) {//TODO，处理不同选择器绑定了两上单击事件
            var opts = $.data(jq[0], 'checkbox').options;
            opts = $.extend(opts, param)
            jq.opts = opts;
            return jq.each(function () {
                $.data(this, 'checkbox', {
                    options: opts,
                    initobj: init(jq)
                });
            });
        }
    };

    $.fn.checkbox.parseOptions = function (target) {
        return $.extend({}, $.parser.parseOptions(target, []));
    };

    $.fn.checkbox.defaults = {
        url: null,
        data: {}
    };
})(jQuery);
; $(function () {
    $('.easyui-checkbox').each(function () {
        var opts = {};
        var s = $.trim($(this).attr('data-options'));
        if (s) {
            if (s.substring(0, 1) !== "{") {
                s = "{" + s + "}";
            }

            try {
                opts = (new Function("return " + s))();
            } catch (err) {
                console.info("easyui-checkbox对象报错了：" + s);
            }
            $(this).checkbox(opts);
        }
    });
});
//CheckboxControlEnd

//radioControl
; (function ($) {
    function init(_this) {
        var dataBase = _this.opts.data._Items || _this.opts.data;
        var opts = _this.opts;

        appendCheckboxOrRadio(_this, "radio", opts, dataBase, opts.value);
        if (_this.opts.onLoadSuccess) {
            _this.opts.onLoadSuccess.call(this, dataBase, _this, _this.opts.editable);
        }
    }

    $.fn.radio = function (options, param) {
        if (typeof options === 'string') {
            var method = $.fn.radio.methods[options];
            if (method) {
                return method(this, param);
            }
        }
        options = options || {};

        var _this = this;
        _this.opts = $.extend({}, $.fn.radio.defaults, options);

        return this.each(function () {
            var state = $.data(this, 'radio');
            //if (state) {
            //    $.extend(state.options, options);
            //} else {
            $.ajaxSettings.async = false;
            if (_this.opts.url) {
                $.getJSON(_this.opts.url, function (_data) {
                    options.data = _this.opts.data = _data;
                });
            }
            $.ajaxSettings.async = true;

            state = $.data(this, 'radio', {
                options: $.extend({}, $.fn.radio.defaults, $.fn.radio.parseOptions(this), options),
                initobj: init(_this)
            });
            //}
        });
    };

    $.fn.radio.methods = {
        options: function (jq) {
            return $.data(jq[0], 'radio').options;
        },
        getValue: function (jq) {
            var opts = $.data(jq[0], 'checkbox').options;
            var curValue = $(editor).find("input[name=" + opts.textfield + "]:checked").val();
            return curValue;
        },
        reload: function (jq, param) {//TODO，处理不同选择器绑定了两上单击事件
            var opts = $.data(jq[0], 'radio').options;
            opts = $.extend(opts, param)
            jq.opts = opts;
            return jq.each(function () {
                $.data(this, 'radio', {
                    options: opts,
                    initobj: init(jq)
                });
            });
        }
    };

    $.fn.radio.parseOptions = function (target) {
        return $.extend({}, $.parser.parseOptions(target, []));
    };

    $.fn.radio.defaults = {
        url: null,
        data: {}
    };
})(jQuery);
; $(function () {
    $('.easyui-radio').each(function () {
        var opts = {};
        var s = $.trim($(this).attr('data-options'));
        if (s) {
            if (s.substring(0, 1) !== "{") {
                s = "{" + s + "}";
            }

            try {
                opts = (new Function("return " + s))();
            } catch (err) {
                console.info("easyui-radio对象报错了：" + s);
            }
            $(this).radio(opts);
        }
    });
});
//radioControlEnd

//editlablecontrol
; (function ($) {
    var easyuiForms = ["textbox", "passwordbox", "maskedbox", "combo", "combobox", "combotree", "combogrid", "combotreegrid", "tagbox",
        "numberbox", "datebox", "datetimebox", "datetimespinner", "calendar", "spinner", "numberspinner", "timespinner", "slider", "filebox"];
    var easyuiForms_date = ["datebox", "datetimebox", "datetimespinner", "calendar"];
    var easyuiForms_unvalcontrol = ["filegridui", "custom"];
    var easyuiForms_compatible = ["input","password","select"];
    var easyuiForms_compatible_compare = { "input": "textbox","password":"textbox","select":"combobox"};

    function formatdate(curValue) {
        if (curValue && curValue.indexOf(':') === -1) {
            curValue += 'T00:00:00'
        }
        if (!curValue) {
            curValue = '0001-01-01T00:00:00'
        }
        return curValue;
    }

    function loadMustFill(_this, curEle, fieldopt) {
        if (_this.opts.isMustFillStyle && fieldopt.required && _this.opts.editable) {
            var $mustFillLabel = null;
            if (fieldopt.mustFillLabel) {
                $mustFillLabel = $(fieldopt.mustFillLabel);
            } else {
                $mustFillLabel = _this.opts.mustFillSelector.call(curEle);
            }

            if ($mustFillLabel) {
                $mustFillLabel.prepend(_this.opts.mustFillEle);
                $mustFillLabel.addClass("el-title");
                if (_this.opts.mustFillClass) {
                    $mustFillLabel.addClass(_this.opts.mustFillClass);
                }
            }
        }
    }

    function init(_this) {

        if (_this.opts.validateform && !_this.hasClass("easyui-validateform")) {
            $(_this).addClass('easyui-validateform');
        }
        var dataBase = _this.opts.data._Items || _this.opts.data;
        var columns = _this.opts.columns;
        var opts = _this.opts;

        //文件组组件自己判断设置显示和不显示的状态
        $(_this).find('.editlabel-filegridui').each(function () {
            if (_this.opts.validateform && _this.opts.editable) $(this).addClass('easyui-validatebox');
            var fieldopt = GetFieldOpts($(this));
            fieldopt.isShow = fieldopt.isShow || !_this.opts.editable;
            if (!fieldopt.data && !fieldopt.url && fieldopt.textfield) {
                fieldopt.data = fieldopt.textfield.GetInstanceEx(dataBase);
            }
            //如果是查看地状态则取消必填项
            if (!_this.opts.editable && fieldopt.required) fieldopt.required = false;
            $(this).filegridui(fieldopt);
            if (_this.opts.editable) {
                loadMustFill(_this, $(this), fieldopt);
            }
        });

        if (_this.opts.editable) {

            function getEleVal() {
                var curValue = null;
                var curVal = null;
                if ($(this).is(".combobox-f")) {
                    curValue = $(this).combobox("getValues").join(',');
                    curVal = $.data($(this), "valfield");
                } else if ($(this).is(".datebox-f")) {
                    curValue = $(this).datebox("getValue");

                    if (curValue && curValue.indexOf(':') === -1) {
                        curValue += 'T00:00:00'
                    }
                    if (!curValue) {
                        curValue = '0001-01-01T00:00:00'
                    }
                } else if ($(this).is(".textbox-f"))
                    curValue = $(this).textbox("getValue");
                else if ($(this).is(":input") || $(this).is("select"))
                    curValue = $(this).val();
                else
                    curValue = $(this).text();

                var field_opts = GetFieldOpts($(this));

                if (field_opts && field_opts.getVal) {
                    field_opts.getVal.call(this, _this.opts.data, curValue);
                } else if (field_opts.textfield.indexOf('.') < 0 && field_opts.textfield.indexOf('[') < 0) {
                    _this.opts.data[field_opts.textfield] = curValue;
                    if (field_opts.valfield) {
                        _this.opts.data[field_opts.valfield] = curVal;
                    }
                }
            }

            //将属性值设置对编辑框上
            function SetAttr($this, $editele) {
                var valname = $this.attr('valname');
                var placeholder = $this.attr('placeholder');
                var dataoptions = $this.attr('data-options');
                var dataopts = $this.attr('data-opts');
                var optionsdata = $this.attr('optionsdata');

                if (valname) $editele.attr("valname", valname);
                if (placeholder) $editele.attr("placeholder", placeholder);
                if (dataoptions) $editele.attr("data-options", dataoptions);
                if (dataopts) $editele.attr("data-opts", dataopts);
                if (optionsdata) $editele.attr("optionsdata", optionsdata);

                //得到label的操作属性
                var fieldopt = GetFieldOpts($this);
                //如编辑框赋id
                if (fieldopt.editorid) {
                    $editele.attr("id", fieldopt.editorid);
                } else {
                    var labelid = $this.attr('id');
                    if (labelid) $editele.attr("id", labelid + "_editor");
                }

                if (fieldopt.class) {
                    $editele.addClass(fieldopt.class);
                }
                return fieldopt;
            }

            function SetValue(fieldopt, curValue) {
                if (fieldopt.getVal) {
                    if (fieldopt.valfield) {
                        fieldopt.getVal.call(this, _this.opts.data, curValue, _this.data("valfield_" + fieldopt.valfield));
                    } else {
                        fieldopt.getVal.call(this, _this.opts.data, curValue);
                    }
                } else {
                    _this.opts.data[fieldopt.textfield] = curValue;
                    if (fieldopt.valfield) {
                        _this.opts.data[fieldopt.valfield] = _this.data("valfield_" + fieldopt.valfield);
                    }
                }
            }

            //取得所有Easyui表单数据
            var labelList = $(_this).find('[class*=editlabel-]');
            $(labelList).each(function (i, _el) {
                var editClass = _getEditClass(_el);
                //判断是否有兼容控件
                var hasCompatible = $.inArray(editClass, easyuiForms_compatible) > -1;
                var input_type = null;
                if (hasCompatible) {
                    input_type = editClass == "password" ? editClass : null;
                    editClass = easyuiForms_compatible_compare[editClass];
                }
                if ($.inArray(editClass, easyuiForms) > -1) {
                    var field_opts = GetFieldOpts($(_el));
                    if (field_opts.showonly) {
                        $(_el).show();

                        $(_el).css("word-break", "break-all");
                        var val = field_opts.textfield.GetInstanceEx(dataBase);

                        var editClass = _getEditClass(_el);
                        if ($.inArray(editClass, easyuiForms_date) > -1) {
                            val = new Date(formatdate(val));
                        }
                        $(_el).val(val);
                        if (field_opts.formatter) {
                            var ret = field_opts.formatter.call(this, val, dataBase, field_opts, $(this));
                            if (typeof (ret) == "string") {
                                $(_el).html(ret);
                            } else {
                                $(_el).html('');
                                $(_el).append(ret);
                            }
                        } else {
                            if ($.inArray(editClass, easyuiForms_unvalcontrol) < 0) {
                                $(_el).html(val);
                            }
                        }
                        loadMustFill(_this, $(_el), field_opts);
                    } else {
                        var easyuiClass = "easyui-" + editClass;
                        input_type = input_type || "text";

                        var $editele = $('<input type="' + input_type + '" class="' + easyuiClass + '" required style="width: 100%; margin-right: 5px; display: inline" />');
                        if(editClass=="combobox"){
                            $editele = $('<select class="easyui-combobox"></select>');
                        }
                        var fieldopt = SetAttr($(this), $editele);
                        if (_this.opts.validateform) $editele.addClass('easyui-validatebox');
                        $(_el).hide();
                        $(_el).after($editele);
                        if(input_type=="password"){
                            $.extend(fieldopt, {
                                width: (fieldopt.width ? fieldopt.width : '99.5%')
                            });
                        }

                        if(editClass=="combobox"){
                            $.extend(fieldopt, {
                                width: (fieldopt.width ? fieldopt.width : '99.5%'),
                                onChange: function (curValue, oldValue) {
                                    SetValue(fieldopt, curValue);
                                },
                                firstoption: fieldopt.nofirstoption ? null : (fieldopt.firstoption || { id: "", text: "===请选择===" })
                            });
                        }

                        $editele[editClass](fieldopt);
                        loadMustFill(_this, $editele, fieldopt);
                    }
                }
            });

            $(_this).find('.editlabel-input-btntext').each(function () {
                var $editele = $('<input type="text" class="easyui-textbox" required style="width: 100%; margin-right: 5px; display: inline" />');
                var fieldopt = SetAttr($(this), $editele);
                if (_this.opts.validateform) $editele.addClass('easyui-validatebox');
                //验证框为影响readonly效果
                $editele.validatebox({ editable: true });
                $editele.bind("keyup", getEleVal);
                $editele.bind("change", getEleVal);
                $(this).hide();
                $(this).after($editele);

                var textboxbtn = $editele.textbox($.extend(fieldopt, {
                    width: (fieldopt.width ? fieldopt.width : '99.5%'),
                    onChange: function (curValue, oldValue) {
                        SetValue(fieldopt, curValue);
                    }
                }));

                //单独为textbox存valfield
                if (fieldopt.valfield) {
                    _this.data("valfield_" + fieldopt.valfield, fieldopt.valfield.GetInstanceEx(dataBase));
                }
                loadMustFill(_this, $editele, fieldopt);
            });

            $(_this).find('.editlabel-textarea').each(function () {
                var $editele = $('<textarea class="form-control" style="width: 100%; height: 60px"></textarea>');
                var fieldopt = SetAttr($(this), $editele);
                if (_this.opts.validateform) $editele.addClass('easyui-validatebox');
                $editele.validatebox();
                $editele.bind("keyup", getEleVal);
                $editele.bind("change", getEleVal);
                $(this).after($editele);
                loadMustFill(_this, $editele, fieldopt);
            });

            // $(_this).find('.editlabel-select').each(function (i, _el) {

            //     var $editele = $('<select class="easyui-combobox"></select>');
            //     var fieldopt = SetAttr($(this), $editele);
            //     if (fieldopt.showonly) {
            //         $(_el).show();

            //         $(_el).css("word-break", "break-all");
            //         var val = fieldopt.textfield.GetInstanceEx(dataBase);

            //         var editClass = _getEditClass(_el);
            //         if ($.inArray(editClass, easyuiForms_date) > -1) {
            //             val = new Date(formatdate(val));
            //         }
            //         $(_el).val(val);
            //         if (fieldopt.formatter) {
            //             var ret = fieldopt.formatter.call(this, val, dataBase, fieldopt, $(this));
            //             if (typeof (ret) == "string") {
            //                 $(_el).html(ret);
            //             } else {
            //                 $(_el).html('');
            //                 $(_el).append(ret);
            //             }
            //         } else {
            //             if ($.inArray(editClass, easyuiForms_unvalcontrol) < 0) {
            //                 $(_el).html(val);
            //             }
            //         }
            //         loadMustFill(_this, $(_el), fieldopt);
            //     } else {
            //         if (_this.opts.validateform) $editele.addClass('easyui-validatebox');
            //         $editele.validatebox();
            //         $(this).hide();
            //         $(this).after($editele);
            //         $editele.combobox($.extend(fieldopt, {
            //             width: (fieldopt.width ? fieldopt.width : '99.5%'),
            //             onChange: function (curValue, oldValue) {
            //                 SetValue(fieldopt, curValue);
            //             },
            //             firstoption: fieldopt.nofirstoption ? null : (fieldopt.firstoption || { id: "", text: "===请选择===" })
            //         }));
            //         loadMustFill(_this, $editele, fieldopt);
            //     }
            // });

            $(_this).find('.editlabel-select-native').each(function () {

                var $editele = $('<select class="form-control"><option value="0" >===请选择===</option></select>');
                var fieldopt = SetAttr($(this), $editele);
                if (_this.opts.validateform) $editele.addClass('easyui-validatebox');
                $editele.validatebox();
                $editele.bind("keyup", getEleVal);
                $editele.bind("change", getEleVal);
                $(this).hide();
                $(this).after($editele);
                loadMustFill(_this, $editele, fieldopt);
            });

            //optionsdatasou如果有下拉框数据源就绑定
            if (_this.opts.optionsdatasou) {
                $(_this).bindOptionDataByName(_this.opts.optionsdatasou, "optionsdata");
            }

            //绑定对应的数据
            $(_this).bindViewValByAtr(dataBase, "valname", _this.opts.optionsdatasou, "optionsdata");

            $(_this).find('.editlabel-checkbox').each(function () {

                var $editele = $('<div class="easyui-checkbox"></div>');
                var fieldopt = SetAttr($(this), $editele);
                if (_this.opts.validateform) $editele.addClass('easyui-validatebox');
                $editele.validatebox();
                var eleData = fieldopt.data;
                if (!fieldopt.data && _this.opts.optionsdatasou) {
                    if (fieldopt.optionsdata) {
                        eleData = fieldopt.optionsdata.GetInstanceEx(_this.opts.optionsdatasou);
                    }
                }

                var curValue = null;
                if (fieldopt.textfield) {
                    curValue = fieldopt.textfield.GetInstanceEx(dataBase);
                }

                appendCheckboxOrRadio($editele, "checkbox", fieldopt, eleData, curValue, dataBase);

                $(this).hide();
                $(this).after($editele);
                loadMustFill(_this, $editele, fieldopt);
            });

            $(_this).find('.editlabel-radio').each(function () {

                var $editele = $('<div class="easyui-radio"></div>');
                var fieldopt = SetAttr($(this), $editele);
                if (_this.opts.validateform) $editele.addClass('easyui-validatebox');
                $editele.validatebox();
                var eleData = fieldopt.data;
                if (!fieldopt.data && _this.opts.optionsdatasou) {
                    if (fieldopt.optionsdata) {
                        eleData = fieldopt.optionsdata.GetInstanceEx(_this.opts.optionsdatasou);
                    }
                }

                var curValue = null;
                if (fieldopt.textfield) {
                    curValue = fieldopt.textfield.GetInstanceEx(dataBase);
                }

                appendCheckboxOrRadio($editele, "radio", fieldopt, eleData, curValue, dataBase);

                //$editele.bind("keyup", getEleVal);
                //$editele.bind("change", getEleVal);
                $(this).hide();
                $(this).after($editele);
                loadMustFill(_this, $editele, fieldopt);
            });

            $(_this).find('.editlabel-custom').each(function () {
                var valname = $(this).attr('valname');
                var placeholder = $(this).attr('placeholder');
                var dataoptions = $(this).attr('data-options');
                var customselector = $(this).attr('custom-selector');


                var $editele = $(customselector);
                $editele.show();
                var optsd = $editele.attr('data-opts').GetInstance();

                if (optsd.formatter) {
                    optsd.formatter.call(this, valname.GetInstanceEx(_this.opts.data), $editele);
                }

                function SetEleVal() {
                    if ($editele.attr('data-opts')) {
                        var optsd = $editele.attr('data-opts').GetInstance();
                        if (optsd.getVal) {
                            optsd.getVal.call(this, _this.opts.data);
                        }
                    }
                }

                if (optsd.editelearr && optsd.editelearr.length) {
                    $(optsd.editelearr).each(function (k, elename) {
                        $editele.find(elename).bind("keyup", SetEleVal);
                        $editele.find(elename).bind("change", SetEleVal);
                    });
                }

                $(this).hide();

            });

            if (_this.opts.validateform && _this.opts.validateformopts) {
                $(_this).validateform(_this.opts.validateformopts);
            }

            $(_this.opts.confirmbtn).unbind();
            //$(_this).validateform("validateform", [1]);
            $(_this.opts.confirmbtn).click(function () {
                if (_this.opts.validateform) {
                    if (!$(_this).validateform("validateform", [1])) {
                        return;
                    }
                    var isvalid = true;
                    $(_this).find('.editlabel-filegridui').each(function () {
                        if (!isvalid) return;
                        var dataoptions = $(this).filegridui('options');
                        if (dataoptions.isvalid && !$(this).filegridui('isValid')) {
                            isvalid = false;
                            return;
                        }
                    });
                    if (!isvalid) return;
                }

                var gData = _this.editlabel("getData");
                if (_this.opts.onConfirm) {
                    _this.opts.onConfirm.call(this, gData);
                }
            });
        } else {
            $(_this).bindViewValByAtr(dataBase, "valname", _this.opts.optionsdatasou, "optionsdata");

            //取得所有Easyui表单数据
            var labelList = $(_this).find('[class*=editlabel-]');
            $(labelList).each(function (i, _el) {
                $(_el).show();
                var field_opts = GetFieldOpts($(_el));
                $(_el).css("word-break", "break-all");
                var val = field_opts.textfield.GetInstanceEx(dataBase);

                var editClass = _getEditClass(_el);
                if ($.inArray(editClass, easyuiForms_date) > -1) {
                    val = new Date(formatdate(val));
                }

                if (field_opts.formatter) {
                    var ret = field_opts.formatter.call(this, val, dataBase, field_opts, $(this));
                    if (typeof (ret) == "string") {
                        $(_el).html(ret);
                    } else {
                        $(_el).html('');
                        $(_el).append(ret);
                    }
                } else {
                    if ($.inArray(editClass, easyuiForms_unvalcontrol) < 0) {
                        $(_el).html(val);
                    }
                }
                loadMustFill(_this, $(_el), field_opts);
            });

            $(_this).find('.editlabel-custom').each(function () {
                var customselector = $(this).attr('custom-selector');
                var $editele = $(customselector);
                $editele.hide();
                $(this).show();
            });
            $(_this.opts.confirmbtn).hide();
        }

        if (_this.opts.validateform) {
            _this.validateform(_this.opts);
        }

        if (_this.opts.onLoadSuccess) {
            _this.opts.onLoadSuccess.call(this, dataBase, _this, _this.opts.editable);
        }
    }

    $.fn.editlabel = function (options, param) {
        if (typeof options === 'string') {
            var method = $.fn.editlabel.methods[options];
            if (method) {
                return method(this, param);
            }
        }
        options = options || {};

        var _this = this;
        _this.opts = $.extend({}, $.fn.editlabel.defaults, options);

        return this.each(function () {
            var state = $.data(this, 'editlabel');
            //if (state) {
            //    $.extend(state.options, options);
            //} else {
            $.ajaxSettings.async = false;
            if (_this.opts.url) {
                $.getJSON(_this.opts.url, function (_data) {
                    options.data = _this.opts.data = _data;
                });
            }
            $.ajaxSettings.async = true;

            if (_this.opts.editablecol) {
                if (!_this.opts.data[_this.opts.editablecol] && _this.opts.editable) {
                    _this.opts.editable = true;
                } else {
                    _this.opts.editable = false;
                }
            }
            state = $.data(this, 'editlabel', {
                options: $.extend({}, $.fn.editlabel.defaults, $.fn.editlabel.parseOptions(this), options),
                initobj: init(_this)
            });
            //}
        });
    };

    $.fn.editlabel.methods = {
        options: function (jq) {
            return $.data(jq[0], 'editlabel').options;
        },
        getData: function (jq) {
            try {


                var ret = undefined;
                var fg = $.data(jq[0], 'editlabel');
                if (fg) {
                    if (fg.options) {
                        //处理设置为editable=false 会产生readonly属性单独取值
                        var alleditors = _getEditors(jq);
                        $(alleditors).each(function (i, editor) {
                            var $editor = $(editor);
                            var curValue = $(editor).val();
                            var editClass = _getEditClass(editor, "easyui-");
                            var field_opts = GetFieldOpts($editor);

                            if (field_opts.showonly) {
                                if (field_opts.textfield) {
                                    curValue = field_opts.textfield.GetInstanceEx(fg.options.data);
                                } else {
                                    curValue = $editor.val();
                                }
                            }

                            if ($editor.attr("readonly")) {
                                curValue = $editor.val();
                            }

                            if ($.inArray(editClass, easyuiForms) > -1) {
                                curValue = $(editor)[editClass]("getValue");

                                if ($.inArray(editClass, easyuiForms_date) > -1) {
                                    curValue = formatdate(curValue);
                                }
                            }

                            if (editClass == "checkbox") {
                                var curValue = field_opts.retIsArr ? [] : "";
                                var space = field_opts.space || ",";//space为分隔符如果有则使用自己定义的如:、，,
                                var allCheckbox = $(editor).find('input:checkbox:checked');
                                $.each(allCheckbox, function (cbi, cbo) {
                                    if (field_opts.retIsArr) {
                                        var checkboxData = $(this).data("checkorradiodata");
                                        curValue.push((checkboxData || $(this).val()));
                                    } else {
                                        curValue += $(this).val() + ((allCheckbox.length == (cbi + 1)) ? "" : space);
                                    }
                                });
                            }
                            if (editClass == "radio") {
                                var allRadio = $(editor).find('input:radio:checked');
                                if (allRadio && allRadio.length > 0) {
                                    curValue = $(allRadio[0]).val();
                                }
                                //curValue = $(editor).find("input[name=" + field_opts.textfield + "]:checked").val();
                            }

                            if (editClass == "numberbox" && !curValue) {
                                curValue = 0;
                            }

                            if (editClass == "filegridui") {
                                curValue = $(editor).filegridui("getData");
                            }

                            //如果是字符串有去掉左右空格
                            if (typeof (curValue) == 'string') {
                                curValue = $.trim(curValue);
                            }

                            if (field_opts && field_opts.getVal) {
                                if (field_opts.valfield) {
                                    field_opts.getVal.call(this, fg.options.data, curValue, jq.data("valfield_" + field_opts.valfield));
                                } else {
                                    field_opts.getVal.call(this, fg.options.data, curValue);
                                }
                            } else if (field_opts.textfield.indexOf('.') < 0 && field_opts.textfield.indexOf('[') < 0) {
                                fg.options.data[field_opts.textfield] = curValue;
                                if (field_opts.valfield) {
                                    fg.options.data[field_opts.valfield] = jq.data("valfield_" + field_opts.valfield);
                                }
                            }
                        });
                        ret = fg.options.data;

                        if (fg.options.onGetDataEnd) {
                            fg.options.onGetDataEnd.call(this, ret);
                        }
                    }
                }
                return ret;
            } catch (error) {
                console.error("editlabel getData error:", error);
            }
        },
        //取得表单中所有编辑组件
        getEditors: _getEditors,
        //取得表单中指定编辑组件 param为valname字符串 或 {valname:"UserName",editorid:""}
        getEditor: function (jq, param) {
            var ret = undefined;
            var labelList = $(jq).find('[class*=editlabel-]');

            $(labelList).each(function (i, o) {
                var ofieldopts = GetFieldOpts($(o));
                var ovalname = ofieldopts.textfield;
                var $m = $(o).next();
                if (!$m || $m.length < 1) {
                    $m = $(o);
                }
                var fieldopts = GetFieldOpts($m);
                var mvalname = fieldopts.textfield;
                if ($m && $m.length > 0 && ovalname === mvalname) {
                    if (typeof (param) == 'undefined') {
                        ret = $m[0];
                        return false;
                    } else if (typeof (param) == 'object' && param.editorid && param.editorid === $m.id && param.valname && param.valname === mvalname) {
                        ret = $m[0];
                        return false;
                    } else if (typeof (param) == 'object' && param.editorid && param.editorid === $m.id && !param.valname) {
                        ret = $m[0];
                        return false;
                    } else if (typeof (param) == 'object' && param.valname && param.valname === mvalname && !param.editorid) {
                        ret = $m[0];
                        return false;
                    } else if (typeof (param) == 'string' && param === mvalname) {
                        ret = $m[0];
                        return false;
                    }
                }
            });
            return ret;
        },
        removeMustfill: function (jq, param) {
            var el = $.data(jq[0], 'editlabel');
            if (typeof (param) == "string") {
                param.editorfield = param;
            }
            if (el) {
                var opts = el.options;
                var $curForm = $(jq[0]).editlabel("getEditor", param.editorfield);
                var editClass = _getEditClass($curForm, "easyui-");
                if (param.stage) opts.stage = param.stage;
                var $labeltitle = opts.mustFillSelector.call($curForm);
                $labeltitle.find(".el-title-mustfill").remove();
                $($curForm).validatebox({ stage: param.stage });
                //$($curForm)[editClass]();
            }
        },
        appendMustfill: function (jq, param) {
            var el = $.data(jq[0], 'editlabel');
            if (typeof (param) == "string") {
                param.editorfield = param;
            }
            if (el) {
                var opts = el.options;
                var $curForm = $(jq[0]).editlabel("getEditor", param.editorfield);
                var editClass = _getEditClass($curForm, "easyui-");
                if (param.stage) opts.stage = param.stage;
                var $mustFillLabel = opts.mustFillSelector.call($curForm);
                $mustFillLabel.prepend($(opts.mustFillEle));
                $mustFillLabel.addClass("el-title");
                if (opts.mustFillClass) {
                    $mustFillLabel.addClass(opts.mustFillClass);
                }
                $($curForm).validatebox({ stage: param.stage });
            }
        },
        reload: function (jq, param) {//TODO，处理不同选择器绑定了两上单击事件
            var opts = $.data(jq[0], 'editlabel').options;
            opts = $.extend(opts, param)
            jq.opts = opts;
            return jq.each(function () {
                $.data(this, 'editlabel', {
                    options: opts,
                    initobj: init(jq)
                });
            });
        }
    };

    $.fn.editlabel.parseOptions = function (target) {
        return $.extend({}, $.parser.parseOptions(target, []));
    };

    $.fn.editlabel.defaults = {
        url: null,
        data: {},
        confirmbtn: null,//提交按钮选择器如：#btn_save,.submitclass
        editable: false,//editable: true,表示编制状态，editable: false表示查看状态
        editablecol: null,
        validateform: true,//表单中是否有验证项
        OpState: null,
        optionsdatasou: null, //表单的下拉框整体数据源
        isMustFillStyle: false,//显示必选择项开关
        mustFillEle: '<span class="el-title-mustfill">*</span>',//必须元素
        mustFillClass: null,
        mustFillLabel: null,
        mustFillSelector: function () { return $(this).parent().prev(); },
        onLoadSuccess: function (data, _this, editable) { },//可在此事件写入第三方插件的初始
        onGetDataEnd: function (data) { }//可在此事件写入第三方插件的取数据
    };
})(jQuery);
; $(function () {
    $('.easyui-editlabel').each(function () {
        var opts = {};
        var s = $.trim($(this).attr('data-options'));
        if (s) {
            if (s.substring(0, 1) !== "{") {
                s = "{" + s + "}";
            }
            opts = (new Function("return " + s))();
            $(this).editlabel(opts);
        }
    });
});