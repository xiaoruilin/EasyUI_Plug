; $(function () {
    function whereShowOrText(_this,opts) {
        $(_this).css("display", "");
        $(_this).removeClass("easyui-whereshowele");
        if (opts) {
            var textinner = '';
            if (opts.whereShowText) {
                var text = textinner = $(_this).text();
                if (opts.text) {
                    text = opts.text;
                }
                opts.text = opts.whereShowText.call(this, text);
            }
            
            if (opts.text) {
                if (opts.textIsEle) {
                    var $allele = $(_this).find(":contains('" + textinner + "')");
                    if ($allele && $allele.length > 0) {
                        $($allele[$allele.length-1]).text(opts.text);
                    }
                } else {
                    $(_this).text(opts.text);
                }
            }
        }
    }

    $('.easyui-whereshowele').each(function () {
        var opts = {};
        var s = $.trim($(this).attr('data-options'));
        if (s) {
            if (s.substring(0, 1) !== "{") {
                s = "{" + s + "}";
            }
            try {
                opts = (new Function("return " + s))();
            } catch (err) {
                console.error("whereshowele 转对象错误：", s);
            }
            //如果有whereShow方法则方法事件判断
            if (opts.whereShow) {
                if (!opts.whereShow.call(this,opts)) {
                    $(this).remove();
                } else {
                    whereShowOrText(this, opts);
                }
            } else {
                if (opts.isShow === false) {
                    $(this).remove();
                } else {
                    whereShowOrText(this, opts);
                }
            }

        } else {
            whereShowOrText(this);
        }
    });
});;; (function ($) {
    function init(_this) {
        $(_this).addClass('easyui-foldpanel');

        if (_this.opts.contentbar) {
            $(_this).find(_this.opts.contentbar).each(function () {
                $(this).addClass('l-div-content');
            });
        }

        if ($(_this).find(".l-div-content").length < 1) {
            alert("折叠内容层不存大");
        }

        //判断折叠头是否存在
        if (_this.opts.titlebar && $(_this).find(_this.opts.titlebar).length > 0) {
            $(_this).find(_this.opts.titlebar).each(function () {
                $(this).addClass('l-div-title');
            });
        } else {
            var titleStyle = '';
            if (_this.opts.titleico) {
                titleStyle += 'background: url(' + _this.opts.titleico + ') 10% 50% no-repeat;';
            }
            //直接添加
            var $titlebar = $('<div class="l-div-title" ></div>');
            var $title = $('<div class="plit_title_NewMain" style="' + titleStyle + '">' + _this.opts.title + '</div>');
            var $titlebtn = $('<a href="javascript:;" class="l-btn-iconEx l-btn-slide-up-sm" style=""></a>');
            $titlebar.append($title);
            $titlebar.append($titlebtn);
            $(_this).find(".l-div-content").before($titlebar);
        }



        var clsArr = _this.opts.classArr;

        $(_this).find('.l-btn-iconEx').each(function (i, btn) {
            if (_this.opts.fold) {
                $(btn).removeClass(clsArr.slideup).addClass(clsArr.slidedown);
                if (_this.opts.onFold) {
                    _this.opts.onFold.call(this);
                }
                $(_this).find(_this.opts.contentbar).each(function (i, c) {
                    $(c).slideUp("slow");
                });
            } else {
                if (_this.opts.onOpen) {
                    _this.opts.onOpen.call(this);
                }
                $(_this).find(_this.opts.contentbar).each(function (i, c) {
                    $(c).slideDown("slow");
                });
                $(btn).removeClass(clsArr.slidedown).addClass(clsArr.slideup);
            }

        });

        if (_this.opts.numlogo) {
            if (_this.opts.numlogocur) {
                if (_this.opts.numlogocur > _this.opts.numlogo) {
                    _this.foldpanel("changelogo", String.format("../../Images/" + _this.opts.numlogoStateArr["3"], _this.opts.numlogo));
                } else if (_this.opts.numlogocur === _this.opts.numlogo) {
                    _this.foldpanel("changelogo", String.format("../../Images/" + _this.opts.numlogoStateArr["2"], _this.opts.numlogo));
                } else {
                    _this.foldpanel("changelogo", String.format("../../Images/" + _this.opts.numlogoStateArr["1"], _this.opts.numlogo));
                }
            }
        }

        function isFlod() {
            $(_this).find("[class*='l-btn-slide']").each(function (i, btn) {
                if ($(btn).hasClass(clsArr.slideup)) {
                    $(btn).removeClass(clsArr.slideup).addClass(clsArr.slidedown);
                    if (_this.opts.onFold) {
                        _this.opts.onFold.call(this);
                    }
                    $(_this).find(_this.opts.contentbar).each(function (i, c) {
                        $(c).slideUp("slow");
                    });
                } else {
                    $(btn).removeClass(clsArr.slidedown).addClass(clsArr.slideup);
                    if (_this.opts.onOpen) {
                        _this.opts.onOpen.call(this);
                    }
                    $(_this).find(_this.opts.contentbar).each(function (i, c) {
                        $(c).slideDown("slow");
                    });
                }
            });
        }

        //点击事件
        if (_this.opts.istitlebarclick) {
            $(_this.opts.titlebar).click(function () {
                isFlod();
            });
        } else {
            $(_this).find("[class*='l-btn-iconEx']").click(function () {
                isFlod();
            });
        }


    }

    $.fn.foldpanel = function (options, param) {
        if (typeof options === 'string') {
            var method = $.fn.foldpanel.methods[options];
            if (method) {
                return method(this, param);
            }
        }
        options = options || {};

        var _this = this;
        _this.opts = $.extend({}, $.fn.foldpanel.defaults, options);

        return this.each(function () {
            var state = $.data(this, 'foldpanel');
            if (state) {
                $.extend(state.options, options);
            } else {
                $.ajaxSettings.async = false;
                if (_this.opts.url) {
                    $.getJSON(_this.opts.url, function (_data) {
                        _this.opts.data = _data;
                    });
                }
                $.ajaxSettings.async = true;
                state = $.data(this, 'foldpanel', {
                    options: $.extend({}, $.fn.foldpanel.defaults, $.fn.foldpanel.parseOptions(this), options),
                    initobj: init(_this)
                });
            }
        });
    };

    $.fn.foldpanel.methods = {
        options: function (jq) {
            return $.data(jq[0], 'foldpanel').options;
        },
        reload: function (jq, param) {//TODO，处理不同选择器绑定了两上单击事件
            var opts = $.data(jq[0], 'foldpanel').options;
            opts = $.extend(opts, param)
            jq.opts = opts;
            return jq.each(function () {
                $.data(this, 'foldpanel', {
                    options: opts,
                    initobj: init(jq)
                });
            });
        },
        changelogo: function (jq, url) {
            var opts = $.data(jq[0], 'foldpanel').options;

            $(jq).find('.title-logo').each(function (i, logo) {
                $(logo).attr('src', url);
            });
        },
        setTitle: function (jq, title) {
            var opts = $.data(jq[0], 'foldpanel').options;

            $(jq).find('.l-div-title > .plit_title_NewMain').each(function (i, titltele) {
                $(titltele).text(title);
            });
        },
        foldcontent: function (jq) {
            var opts = $.data(jq[0], 'foldpanel').options;
            $(jq).find(opts.contentbar).each(function (i, c) {
                $(c).slideUp("slow");
            });
        }
    };

    $.fn.foldpanel.parseOptions = function (target) {
        return $.extend({}, $.parser.parseOptions(target, []));
    };

    $.fn.foldpanel.defaults = {
        url: null,
        data: null,
        fold: false,
        istitlebarclick: false,
        numlogocur: null,
        numlogo: null,
        numlogoStateArr: { "1": "gray-{0}.png", "2": "orange-{0}.png", "3": "green-{0}.png" },
        classArr: { "slideup": "l-btn-slide-up-sm", "slidedown": "l-btn-slide-down-sm" },
        titlebar: ".l-div-title",
        title: "",
        titleico: "",//表头路径
        contentbar: ".l-div-content",
        onFold: function () { },//折叠事件
        onOpen: function () { }//展开事件
    };
})(jQuery);

; $(function () {
    $('.easyui-foldpanel').each(function () {
        var opts = {};
        var s = $.trim($(this).attr('data-options'));
        if (s) {
            if (s.substring(0, 1) !== "{") {
                s = "{" + s + "}";
            }
            opts = (new Function("return " + s))();
            $(this).foldpanel(opts);
        }
    });
});;; (function ($) {

    Number.prototype.filesize = function () {
        var _this = this;
        var Value = (Number(_this) / 1024);
        if (Value >= 1024) {
            Value = (Number(Value) / 1024);
            if (Value >= 1024) {
                Value = (Number(Value) / 1024);
                if (Value >= 1024) {
                    Value = (Number(Value) / 1024).toFixed(2) + "GB";
                    return Value;
                }
            } else {
                Value = Value.toFixed(2) + "MB";
                return Value;
            }
        } else {
            Value = Value.toFixed(2) + "KB";
            return Value;
        }
    };

    String.prototype.formatdate = function (fmt) {
        var date = this;
        var d = null;
        if (!date) {
            return '';
        }

        if (date == "") {
            return '';
        }

        if (!fmt) {
            fmt = 'yyyy-MM-dd';
        }
        try {
            if (date.constructor === String) {
                date = date.replace('T', ' ').replace(/\-/g, '/').replace(/\.\d+/g, '').replace(/\+08:00/g, '+0800');

                if (date === '0001/01/01 00:00:00') {
                    return '';
                }

                d = new Date(date);
            }
            else {
                d = date;
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

    function getcolvalue(rowObj, colName) {
        var colStr = JSON.stringify(rowObj);
        for (var name in rowObj) {
            if (name === colName) {
                return rowObj[name];
            }
        }
    }

    /**
     * 
     * @param {any} col 列的属性
     * @param {any} colOptsb 文件组行的数据
     * @param {any} i 行数
     * @param {any} opts 选项
     * @param {any} coltd 列的Td
     */
    function LoadIsListTd(_this, col, colOptsb, i, opts, coltd) {
        //列表字段
        if (col.islist) {
            var $filelistdivList = coltd.find("div[class=filelistdiv]");
            var $filelistdiv = ($filelistdivList && $filelistdivList.length > 0) ? $($filelistdivList[0]) : null;
            coltd.attr("islistrow", i);
            var listdiv = "";
            if (!$filelistdiv) {
                $filelistdiv = $('<div class="filelistdiv"></div>');
            }
            $filelistdiv.html('');//将列值空
            var colvallist = getcolvalue(colOptsb, col.field);
            if (colvallist && colvallist.length > 0) {
                $(colvallist).each(function (x, xo) {
                    for (var xi = 0; xi < col._items.length; xi++) {
                        var xcol = col._items[xi];
                        var xcolval = getcolvalue(xo, xcol.field);
                        if (xcol.formatter) {
                            var xcolele = $('<div class="fg-grouplist-row"></div');//如果不换行请重写此处和class
                            var xcoleleinner = xcol.formatter(xcolval, xo, x, colOptsb, i);
                            if (typeof (xcoleleinner) == "string" && xcoleleinner.indexOf("<") > -1) {
                                xcoleleinner = $(xcoleleinner);
                            }
                            xcolele.append(xcoleleinner);
                            var $delfilebtn = xcolele.find(".fg-delfilebtn");
                            if ($delfilebtn && $delfilebtn.length > 0) {
                                if (opts.isShow) {
                                    $delfilebtn.remove();
                                } else {
                                    $($delfilebtn[0]).data("delfilebtnData", { parentindex: i, rowindex: x, parentRowData: colOptsb, rowData: xcol });
                                }
                            }
                            $filelistdiv.append(xcolele);
                        } else {
                            listdiv += '<div>' + (x + 1) + '、' + xcolval + '<div>';
                        }
                    }
                });
            } else {
                if (opts.isShow) {
                    $filelistdiv.append(col.emptyMessageForShow || opts.emptyMessageForShow);
                } else {
                    $filelistdiv.append(col.emptyMessage || opts.emptyMessage);
                }
            }

            if (!$filelistdivList || $filelistdivList.length < 1) {
                coltd.append($filelistdiv);
            }

            var $progressDivList = coltd.find("div[class=progressDiv]");
            var $progressDiv = ($progressDivList && $progressDivList.length > 0) ? $($progressDivList[0]) : null;
            if (!$progressDiv) {
                $progressDiv = $('<div class="progressDiv"><span></span></div>');
                coltd.append($progressDiv);
            } else {
                $progressDiv.find("span").html('');
            }
            colval = listdiv;

            //绑定删除文件事件
            coltd.find(".fg-delfilebtn").each(function (i, o) {
                $(o).click(function () {
                    var delfilebtnData = $(this).data("delfilebtnData");
                    if (opts.onDelFile) {
                        opts.onDelFile.call(this, delfilebtnData.parentindex, delfilebtnData.rowindex, _this);
                    }

                    function delFile() {
                        _this.filegridui("deleteChildRow", delfilebtnData);
                        if (opts.onDelFileAfter) {
                            opts.onDelFileAfter.call(this, delfilebtnData.parentindex, delfilebtnData.rowindex, _this);
                        }
                    }

                    if (opts.delFileConfirmMessage) {
                        $.messager.confirm('提示信息', opts.delFileConfirmMessage, function (r) { if (r) { delFile(); } });
                    } else {
                        delFile();
                    }
                });
            });
        }
    }

    function init(_this) {
        if (!_this.hasClass("easyui-filegridui")) {
            $(_this).addClass('easyui-filegridui');
        }

        var dataBase = _this.opts.data._Items || _this.opts.data;
        var columns = _this.opts.columns;
        var opts = _this.opts;
        _this.html('');
        if (_this.opts.onekeydown && !_this.opts.isLockFileDown) {
            var $onekeydownbtn = $('<button type="button" style="margin-left: 5PX;" class="btn btn-success btn-xs" >资料一键下载</button>');
            $onekeydownbtn.click(function () {
                if (_this.opts.onOneKeyDown) {
                    _this.opts.onOneKeyDown.call(this);
                }
            });
            var $onekeydownspan = $('<span style="float:right;margin-right:10px;"></span>');
            $onekeydownspan.append($onekeydownbtn);
            $onekeydowndiv = $('<div></div>')
            if (_this.opts.width)
                $onekeydowndiv.css("width", _this.opts.width);

            $onekeydowndiv.append($onekeydownspan);
            _this.append($onekeydowndiv);
        }

        var tablehtml = $('<table ></table>');

        if (_this.opts.align)
            tablehtml.attr("align", _this.opts.align);
        if (_this.opts.width)
            tablehtml.css("width", _this.opts.width);
        if (!_this.opts.isShow && _this.opts.class)
            tablehtml.addClass(_this.opts.class);

        if (_this.opts.isShow && _this.opts.classforshow)
            tablehtml.addClass(_this.opts.classforshow);

        if (_this.opts.style)
            tablehtml.css(_this.opts.style);
        if (_this.opts.border)
            tablehtml.attr("border", _this.opts.border);


        var trths = $('<tr style="background-color: #EEEEEE"></tr>');
        $(columns).each(function (i, colOpts) {
            $(colOpts).each(function (j, col) {
                var coltitle = col.title;
                trths.append($('<th style="width:' + (col.width ? col.width : opts.colwidth) + '">' + coltitle + '</th>'));
            });
        });

        trths = opts.header ? trths : $("");//判断是否表头

        //载入表头
        tablehtml.append(trths);

        //循环每行数据
        $(dataBase).each(function (i, colOptsb) {

            var trtds = $('<tr></tr>');
            $(columns).each(function (j, colOpts) {
                $(colOpts).each(function (k, col) {
                    var colval = (i + 1);
                    if (col.sortno) {
                        colval = (i + 1);
                    } else {
                        colval = getcolvalue(colOptsb, col.field);
                        colval = colval === undefined ? '' : colval;
                    }

                    var coltd = $('<td></td>');
                    //自定义单元格属性
                    if (col.attributestr) {
                        var attributestr = col.attributestr(colval, colOptsb, i);
                        coltd = $('<td ' + attributestr + '></td>');
                    }

                    //自定义单元
                    if (col.formatter) {
                        colval = col.formatter.call(this, colval, colOptsb, i);
                        if (typeof (colval) == "string" && colval.indexOf("<") > -1) {
                            colval = $(colval);
                        }
                    }

                    //加载列表列
                    LoadIsListTd(_this, col, colOptsb, i, opts, coltd);

                    //向内部加入单元格值
                    if (colval) {
                        coltd.append(colval);
                    }

                    var $upfilebtn = coltd.find(".fg-upfilebtn")
                    if ($upfilebtn && $upfilebtn.length > 0) {
                        $($upfilebtn[0]).data("upfilebtnData", { value: colval, rowData: colOptsb, rowindex: i })
                    }

                    //判断到是查看模式就把删除和上传按钮删除
                    if (opts.isShow) {
                        $(coltd).find(".fg-delfilebtn").remove();
                        $(coltd).find(".fg-upfilebtn").remove();
                    }

                    //设置单元格高度
                    if (col.height) {
                        coltd.attr("height", col.height);
                    }
                    //设置单元格宽度
                    if (col.width) {
                        coltd.attr("width", col.width);
                    }
                    //设置单元格样式
                    if (col.style) {
                        coltd.attr("style", col.style);
                    }
                    //设置单元格类
                    if (col.class) {
                        coltd.attr("class", col.class);
                    }

                    trtds.append(coltd);
                });
            });
            tablehtml.append($(trtds));
            //绑定上传文件事件
            trtds.find(".fg-upfilebtn").each(function (i, o) {
                var fileAccept = colOptsb.accept || _this.opts.accept || undefined;
                _this.opts.upfilebtnfun(i, o, fileAccept, _this, colOptsb);
            });

        });

        _this.append(tablehtml);

        if (_this.opts.isLockFileDown) {
            _this.find('a').each(function () {
                $(this).attr('href', 'javascript:void(0)');
            });
        }



    }

    $.fn.filegridui = function (options, param) {
        if (typeof options === 'string') {
            var method = $.fn.filegridui.methods[options];
            if (method) {
                return method(this, param);
            }
        }
        options = options || {};

        // this 为当前的 smallslider 对象，为了区别，使用 _this 替换
        var _this = this;
        _this.opts = $.extend({}, $.fn.filegridui.defaults, options);

        return this.each(function () {
            var state = $.data(this, 'filegridui');
            //if (state) {
            //    $.extend(state.options, options);
            //} else {
            if (_this.opts.url) {
                $.ajaxSettings.async = false;
                $.getJSON(_this.opts.url, { IsItems: true }, function (_data) {

                    options.data = _this.opts.data = _data;
                });
                $.ajaxSettings.async = true;
            }

            if (!options.data) {
                options.data = { _Items: [] };
            }

            if (!_this.opts.isFileGroup) {
                var _data1 = {};
                _data1[_this.opts.fileGroupFileListAttr] = options.data[_this.opts.fileGroupFileListAttr];
                options.data = _this.opts.data = { _Items: [_data1] };
            }

            state = $.data(this, 'filegridui', {
                options: $.extend({}, $.fn.filegridui.defaults, $.fn.filegridui.parseOptions(this), options),
                initobj: init(_this)
            });
            //}
        });
    };

    $.fn.filegridui.methods = {
        options: function (jq) {
            return $.data(jq[0], 'filegridui').options;
        },
        hasFile: function (jq) {
            var ret = false;
            var opts = $.data(jq[0], 'filegridui').options;
            $(opts.data._Items).each(function (i, d1) {
                if (ret) return;
                if (d1._Items && d1._Items.length > 0) {
                    ret = true;
                }
            });
            if (!ret) {
                $.messager.alert("提示信息", opts.hasnoFileMessage);
            }
            return ret;
        },
        isValid: function (jq, param) {
            var ret = true;
            var opts = $.data(jq[0], 'filegridui').options;
            if (!param.stages) param.stages = [];
            param.alertpagejquery = param.alertpagejquery || $;
            var curstage = param.stage || opts.stage || 0;
            if (opts.isFileGroup) {
                $(opts.data._Items).each(function (i, d1) {
                    if (!ret) return;
                    if ($.inArray(curstage, param.stages) > -1) {
                        if (d1._Items.length === 0) {
                            param.alertpagejquery.messager.alert("提示信息", opts.missingMessage, 'info');
                            ret = false;
                        }
                    } else {
                        if (d1.GroupParams === 1 && d1._Items.length === 0) {
                            param.alertpagejquery.messager.alert("提示信息", String.format(opts.missingMessage, d1.GroupName), 'info');
                            ret = false;
                        }
                    }
                });
            } else {
                if ($.inArray(curstage, param.stages) > -1) {
                    if (!opts.data._Items || !opts.data._Items[0]._Items || opts.data._Items[0]._Items.length < 1) {
                        param.alertpagejquery.messager.alert("提示信息", opts.missingMessage, 'info');
                        ret = false;
                    }
                }
            }

            return ret;
        },
        addChildRow: function (jq, param) {
            var optsData = $.data(jq[0], 'filegridui');
            var opts = optsData.options;
            if (opts.onlyOneFile) {
                var fileList = opts.data._Items[param.parentindex]._Items;
                if (fileList && fileList.length > 0) {
                    opts.data._Items[param.parentindex]._Items.splice(0, fileList.length);
                }
            }
            opts.data._Items[param.parentindex]._Items.push(param.childRowObj);
            jq.opts = opts;
            var col = null;
            $(opts.columns[0]).each(function (z, zo) {
                if (zo.islist) {
                    col = zo;
                    return false;
                }
            });
            if (!col) {
                alert("文件组没有List列不能添加行文件！");
            }
            var coltd = $(jq[0]).find("td[islistrow='" + param.parentindex + "']");
            LoadIsListTd($(jq[0]), col, opts.data._Items[param.parentindex], param.parentindex, opts, coltd);
            optsData.options = opts;
            $(jq[0]).data('filegridui', optsData);
        },
        deleteChildRow: function (jq, param) {
            var optsData = $.data(jq[0], 'filegridui');
            var opts = optsData.options;
            opts.data._Items[param.parentindex]._Items.splice(param.rowindex, 1);
            jq.opts = opts;
            var col = null;
            $(opts.columns[0]).each(function (z, zo) {
                if (zo.islist) {
                    col = zo;
                    return false;
                }
            });
            if (!col) {
                alert("文件组没有List列不能删除文件！");
            }
            var coltd = $(jq[0]).find("td[islistrow='" + param.parentindex + "']");
            LoadIsListTd($(jq[0]), col, opts.data._Items[param.parentindex], param.parentindex, opts, coltd);
            optsData.options = opts;
            $(jq[0]).data('filegridui', optsData);
        },
        getData: function (jq) {
            var ret = undefined;
            var fg = $.data(jq[0], 'filegridui');
            if (fg) {
                if (fg.options) {
                    ret = fg.options.data;
                    //如果不是文件组就返回第一组的文件列表
                    if (!fg.options.isFileGroup) {
                        ret = ret[fg.options.fileGroupFileListAttr][0];
                    }
                }
            }
            return ret;
        },
        setData: function (jq, data) {
            var _this = jq;
            var opts = $.data(jq[0], 'filegridui').options;
            //如果不是文件组就设置文件组并把文件列表放入
            if (!opts.isFileGroup) {
                var _data1 = {};
                _data1[_this.opts.fileGroupFileListAttr] = data[_this.opts.fileGroupFileListAttr];
                data = { _Items: [_data1] };
            }
            opts.data = data;
            _this.opts = opts;
            return jq.each(function () {
                $.data(this, 'filegridui', {
                    options: opts,
                    initobj: init(_this)
                });
            });
        }
    };

    $.fn.filegridui.parseOptions = function (target) {
        return $.extend({}, $.parser.parseOptions(target, []));
    };

    $.fn.filegridui.defaults = {
        url: null,
        data: { "_Items": [] },
        colwidth: '20px',
        align: "center",
        header: true,
        width: "95%",
        class: "table table-bordered",
        classforshow: "",//查看模式下的类
        style: { "width": "95%" },
        columns: [
            [
                { field: 'sortnosdf', title: '序号', sortno: true, width: "60px" },
                {
                    field: 'GroupName', title: '资料类型', width: "260px", formatter: function (v, rowdata, i) {
                        if (rowdata !== undefined) {
                            if (rowdata.GroupParams === 1) {
                                return '<span style="color: red; margin-right: 4px; margin-bottom: 0px">*' + v + '</span>';
                            } else if (rowdata.GroupParams === 2) {
                                return '<span style="color: red; margin-right: 4px; margin-bottom: 0px">' + v + '</span>';
                            } else {
                                return v;
                            }
                        }
                    }
                },
                {
                    field: '_Items', title: '附件列表', width: 410, islist: true, align: 'left', _items: [{
                        field: 'AttName', formatter: function (value, rowData, rowindex, partentrow, partentrowindex) {
                            return '<div><span>' + (rowindex + 1) + '、</span><a href="FileDownload.aspx?SouFilePath=' + rowData.SouFilePath + '&FileName=' + escape(rowData.AttName) + '" target="_blank">' + value + '</a>&nbsp;&nbsp;' +
                                '<span style="color:gray">(' + rowData.FileSize.filesize() + ')' + rowData.UploadTime.formatdate('yyyy-MM-dd HH:mm:ss') + '</span>&nbsp;&nbsp;' +
                                '<a delfilebtn="true" rowindex="' + rowindex + '" parentindex="' + partentrowindex + '"  style="color:red;cursor:pointer">删除</a></div>';
                        }
                    }]
                },
                {
                    field: 'sortnosdfxx', title: '上传', width: "60px", formatter: function (value, rowData, rowindex) {
                        return '<img id="' + rowData.GroupID + '" upfilebtn="true" rowindex="' + rowindex + '" groupname="' + rowData.GroupName + '" fileextlimit="' + rowData.FileExtLimit + '" filesizelimit="' + rowData.FileSizeLimit + '" filegridui="' + _this.opts.filegridui + '" src="../Images/uplode.png" style="cursor: pointer" />';
                    }
                }
            ]
        ],
        missingMessage: "送审资料：{0}  必须上传资料！",
        hasnoFileMessage: "请上传资料！",
        emptyMessage: "请上传附件",
        emptyMessageForShow: "无",
        delFileConfirmMessage: "确定要删除该附件吗？",
        isLockFileDown: false,
        isShow: false,//如果是显示状态则会删除上传和删除按钮
        isFileGroup: true,//区分是否是文件组默认是否则系统自动加上Group结构
        fileGroupFileListAttr: "_Items",//当isFileGroup会起作用
        uploaderServer: undefined,//文件上传服务器地址
        onlyOneFile: false,
        onekeydown: false,
        onDelFile: function (parentindex, rowindex) { },
        onDelFileAfter: function (parentindex, rowindex, _this) { },
        onUploadFile: function (groupid, groupname, fileextlimit, filesizelimit, rowindex) { },
        onUploadSuccess: function (file, response) { },//在文件上传成返回要存也的文件数据结构（可自定义） 如：{IDs:'',FileName:'',FileSize:'',UploadTime:''}
        onOneKeyDown: function () { },
        //正式使用必须重写这个方法
        upfilebtnfun: function (i, o, fileAccept, _this, colOptsb) {
            console.debug("请自已实现该方法upfilebtnfun");
        }
    };
})(jQuery);;function messageralert(vbopts, opts, confirmfn) {
    opts.alertpagejquery.messager.alert("提示信息", vbopts.invalidMessage || vbopts.missingMessage, 'info', confirmfn);
}
; (function ($) {
    
    function _hasEasyuiClass(_el) {
        var clsPrefix = "easyui-";
        var editClass = $(_el).attr("class");
        return editClass.indexOf(clsPrefix) > -1;
    }

    function textboxblurfn() {
        var curData = $(this).data("CurData");

        function validfn(_this) {
            var isValid = $(_this).validatebox('enableValidation').validatebox("isValid");
        }

        if ($.inArray(curData.vbopts.stage, curData.otherstages) > -1) {
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

    function enableValidationisValid($this, opts, vbopts, isTrigger) {
        if ($this.hasClass("easyui-textbox") || $this.hasClass("easyui-numberbox")) {
            var easyuitextbox = $("input", $this.next("span"));
            if (easyuitextbox && easyuitextbox.length > 0) {
                $(easyuitextbox[0]).data("CurData", { otherstages: opts.stages, vbopts: vbopts });
                if (isTrigger) {
                    textboxblurfn.call($(easyuitextbox[0]));
                    $(easyuitextbox[0]).focus();
                } else {
                    $(easyuitextbox[0]).bind("blur", textboxblurfn);
                }
            }
        } else if ($this.hasClass("easyui-combobox")) {
            var $thisspan = $this.next("span");
            var easyuitextbox = $("input", $this.next("span"));
            if ($.inArray(vbopts.stage, opts.stages) > -1) {
                var thisVal = $this.combobox("getValue");
                if (!thisVal || thisVal == '全部') {
                    if (isTrigger) {
                        $thisspan.addClass("textbox-invalid");
                        $(easyuitextbox[0]).focus();
                    }
                } else {
                    $thisspan.removeClass("textbox-invalid");
                }
            }
        } else {
            $this.data("CurData", { otherstages: opts.stages, vbopts: vbopts });
            if (isTrigger) {
                textboxblurfn.call($this);
                $this.focus();
            } else {
                $this.blur(textboxblurfn);
            }
        }
    }

    function validate(_this) {
        var isValid = false;
        var opts = _this.opts;
        if (!opts.novalidate) {
            var $allvalidatebox = $(_this).find('.easyui-validatebox');
            if ($allvalidatebox && $allvalidatebox.length > 0) {
                for (var i = 0; i < $allvalidatebox.length; i++) {
                    var $this = $($allvalidatebox[i])
                    var vbopts = $this.validatebox("options");
                    if (opts.isLableValid) {
                        if ($this.is("label,span,div")) {
                            isValid = $this.text() ? true : false;

                            if (isValid && vbopts.regExpre) {
                                isValid = (new RegExp(vbopts.regExpre, "i")).test($this.text());
                                if (!isValid) {
                                    messageralert(vbopts,opts);
                                    return isValid;
                                }
                            }
                            if (!isValid) {
                                messageralert(vbopts,opts);
                                return isValid;
                            }
                        }
                    } else {
                        if ($this.is(":hidden") && !_hasEasyuiClass($this) && !opts.isHiddenValid) {
                            isValid = true;
                            return isValid;
                        }

                        if ($this.hasClass('easyui-datebox')) {
                            var $dateboxval = $this.next().find('.textbox-value').each(function () { $dateboxval = $this; });
                            $this.val($dateboxval.val());

                            var $dateboxtxt = $this.next().find('.textbox-text').each(function () { $dateboxtxt = $this; });
                            $dateboxtxt.val($dateboxval.val());

                            if ($.inArray(vbopts.stage, opts.stages) > -1 || $dateboxtxt.val()) {
                                enableValidationisValid($dateboxtxt, opts, vbopts);
                                isValid = $dateboxtxt.validatebox('enableValidation').validatebox("isValid");
                                if (!isValid) {
                                    var $vthis = $dateboxtxt;
                                    opts.alertpagejquery.messager.alert("提示信息", vbopts.invalidMessage || vbopts.missingMessage, "info", function () {
                                        enableValidationisValid($vthis, opts, vbopts, true);
                                    });
                                    return isValid;
                                }
                            } else {
                                $this.validatebox('disableValidation');
                            }
                        }

                        if ($this.hasClass('easyui-combobox')) {
                            var $thisval = $this.next().find('.textbox-value').each(function () { $dateboxval = $this; });
                            var thisval= $thisval.val();

                            var $thistxt = $this.next().find('.textbox-text').each(function () { $dateboxtxt = $this; });
                            var thistxt = $thistxt.val();

                            if ($.inArray(vbopts.stage, opts.stages) > -1) {
                                var thisVal = $this.combobox("getValue");
                                isValid =!(!thisVal || thisVal == '全部');
                                if (!isValid) {
                                    var $vthis = $this;
                                    opts.alertpagejquery.messager.alert("提示信息", vbopts.invalidMessage || vbopts.missingMessage, "info", function () {
                                        enableValidationisValid($vthis, opts, vbopts, true);
                                    });
                                    return isValid;
                                }
                            } else {
                                $this.validatebox('disableValidation');
                            }
                        }

                        if ($this.hasClass('easyui-checkbox')) {
                            var curValue = "";
                            $.each($this.find('input:checkbox:checked'), function () {
                                curValue += $this.val() + ",";
                            });

                            if ($.inArray(vbopts.stage, opts.stages) > -1) {
                                isValid = curValue ? true : false;
                                if (!isValid) {
                                    messageralert(vbopts,opts);
                                    return isValid;
                                }
                            } else {
                                $this.validatebox('disableValidation');
                            }
                        }

                        if ($this.hasClass('easyui-radio')) {
                            var curValue = $this.find("input:checked").val();

                            if ($.inArray(vbopts.stage, opts.stages) > -1) {
                                isValid = curValue ? true : false;
                                if (!isValid) {
                                    var $vthis = $this;
                                    opts.alertpagejquery.messager.alert("提示信息", vbopts.invalidMessage || vbopts.missingMessage, "info",function () {
                                        enableValidationisValid($vthis, opts, vbopts, true);
                                    });
                                    return isValid;
                                }
                            } else {
                                $this.validatebox('disableValidation');
                            }
                        }

                        //文件组验证
                        if ($this.hasClass('easyui-filegridui')) {
                            if ($.inArray(vbopts.stage, opts.stages) > -1) {
                                var isValid = $this.filegridui("isValid", { stage: vbopts.stage, stages: opts.stages, alertpagejquery: opts.alertpagejquery });
                                if (!isValid) {
                                    return isValid;
                                }
                            }
                        }

                        //判断是不是Div之类
                        if ($this.is("label,span,div")) {
                            if (!$this.hasClass('easyui-filegridui') && !$this.hasClass('easyui-radio') && !$this.hasClass('easyui-checkbox')) {
                                isValid = $this.text() ? true : false;

                                if (isValid && vbopts.regExpre) {
                                    isValid = (new RegExp(vbopts.regExpre, "i")).test($this.text());
                                    if (!isValid) {
                                        messageralert(vbopts,opts);
                                        return isValid;
                                    }
                                }

                                if (!isValid && !$this.is(":hidden")) {
                                    messageralert(vbopts,opts);
                                    return isValid;
                                }
                            }
                        } else {
                            if ($.inArray(vbopts.stage, opts.stages) > -1) {
                                isValid = $this.validatebox('enableValidation').validatebox('isValid');
                                if (!isValid) {
                                    var $vthis = $this;
                                    opts.alertpagejquery.messager.alert("提示信息", vbopts.invalidMessage || vbopts.missingMessage, "info", function () {
                                        enableValidationisValid($vthis, opts, vbopts, true);
                                    });
                                    return isValid;
                                }
                            } else {
                                if ($this.val() && $this.val() !== "0") {
                                    isValid = $this.validatebox('enableValidation').validatebox('isValid');
                                    if (!isValid) {
                                        messageralert(vbopts,opts);
                                        return isValid;
                                    }
                                } else {
                                    $this.validatebox('disableValidation');
                                }
                            }
                        }
                    }
                }
            }
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
                    enableValidationisValid($(this), opts, vbopts);
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
        validateform: function (jq, param) {
            var stages = [];
            var alertpagejquery = $;
            if (param.constructor == Array) {
                stages = param;
            } else {
                stages = param.stages;
                alertpagejquery = param.alertpagejquery;
            }

            var opts = $.data(jq[0], 'validateform').options;
            if (stages && stages.length > 0)
                opts.stages = stages;
            if (alertpagejquery) {
                opts.alertpagejquery = alertpagejquery;
            }
            jq.opts = opts;
            return validate(jq);
        },
        validateformlable: function (jq, param) {
            var stages = [];
            var alertpagejquery = $;
            if (param.constructor == Array) {
                stages = param;
            } else {
                stages = param.stages;
                alertpagejquery = param.alertpagejquery;
            }

            var opts = $.data(jq[0], 'validateform').options;
            if (stages && stages.length > 0)
                opts.stages = stages;
            if (alertpagejquery) {
                opts.alertpagejquery = alertpagejquery;
            }
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
        isHiddenValid: false,
        alertpagejquery:$,
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
            idcarddalu: {// 验证身份证  
                validator: function (value) {
                    value = $.trim(value);
                    return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value) || /^\d{18}(\d{2}[A-Za-z0-9])?$/i.test(value);
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
            gtelzero: {
                validator: function (value) {
                    return parseFloat(value) >= 0;
                },
                message: '请输入大于等于零的数字'
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
            JJQltInNum: {
                validator: function (value, param) {
                    return parseFloat(value) >= parseFloat($(param[0]).val());
                },
                message: '此数字必须大于等于送审金额！'
            },
            datetimeltInEndtime: {
                validator: function (value, param) {
                    var odate = $(param[0]).val();
                    if (odate) {
                        return new Date(value) >= new Date($(param[0]).val());
                    } else {
                        return true;
                    }
                },
                message: '结束日期不能小于开始日期！'
            },
            datetimeltInStarttime: {
                validator: function (value, param) {
                    var odate = $(param[0]).val();
                    if (odate) {
                        return new Date(value) <= new Date(odate);
                    } else {
                        return true;
                    }
                },
                message: '开始日期不能大于结束日期！'
            },
            JSltInNum: {
                validator: function (value, param) {
                    return parseFloat(value) <= parseFloat(param);
                },
                message: '此分值应不能超过限额！'
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
            LoginID: {// 验证登录名  
                validator: function (value) {
                    return /^[a-zA-Z][a-zA-Z0-9]{5,17}$/i.test(value);
                },
                message: '登录名为6~18位数字或字母组合'
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
            password1: {// 验证登录名  
                validator: function (value) {
                    return /^[a-zA-Z][a-zA-Z0-9]{3,15}$/i.test(value);
                },
                message: '密码为4~16位数字或字母组合'
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
                    var p1 = $(param[0]).val() || $(param[0]).textbox("getValue");
                    if (p1 && value) {
                        return p1 == value;
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
;//取得FieldOption
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
    var easyuiForms_compatible = ["input", "input-btntext","textarea", "password", "select"];
    var easyuiForms_compatible_compare = { "input": "textbox", "input-btntext": "textbox", "textarea":"textbox","password": "textbox", "select": "combobox" };

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
                var oldeditClass = editClass;
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
                        if (editClass == "combobox") {
                            $editele = $('<select class="easyui-combobox"></select>');
                        }
                        var fieldopt = SetAttr($(this), $editele);
                        if (_this.opts.validateform) $editele.addClass('easyui-validatebox');
                        $(_el).hide();
                        $(_el).after($editele);
                        if (input_type == "password") {
                            $.extend(fieldopt, {
                                width: (fieldopt.width ? fieldopt.width : '99.5%')
                            });
                        }

                        if (editClass == "combobox") {
                            $.extend(fieldopt, {
                                width: (fieldopt.width ? fieldopt.width : '99.5%'),
                                onChange: function (curValue, oldValue) {
                                    SetValue(fieldopt, curValue);
                                },
                                firstoption: fieldopt.nofirstoption ? null : (fieldopt.firstoption || { id: "", text: "===请选择===" })
                            });
                            if (field_opts.formatter) {
                                $.extend(fieldopt, { formatter: null });
                            }

                        }
                        if(oldeditClass=="textarea"){
                            $.extend(fieldopt, { multiline: true });
                        }

                        //单独为textbox存valfield
                        if (fieldopt.valfield) {
                            _this.data("valfield_" + fieldopt.valfield, fieldopt.valfield.GetInstanceEx(dataBase));
                        }
                        $editele[editClass](fieldopt);
                        loadMustFill(_this, $editele, fieldopt);
                    }
                }
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