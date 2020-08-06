; (function ($) {

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
    function LoadIsListTd(_this, col, colOptsb, i, opts, coltd,tablehtml) {
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
                if(typeof(opts.onUonEmpty)!=="undefined"){
                    opts.onUonEmpty.call(_this,opts,col, colOptsb, i, coltd,tablehtml);
                }
            } else {
                if (opts.isShow) {
                    $filelistdiv.append(col.emptyMessageForShow || opts.emptyMessageForShow);
                } else {
                    $filelistdiv.append(col.emptyMessage || opts.emptyMessage);
                }
                if(typeof(opts.onEmpty)!=="undefined"){
                    opts.onEmpty.call(_this,opts,col, colOptsb, i, coltd,tablehtml);
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
                    LoadIsListTd(_this, col, colOptsb, i, opts, coltd,tablehtml);

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
            var tablehtml=$(jq[0]).find("table");
            LoadIsListTd($(jq[0]), col, opts.data._Items[param.parentindex], param.parentindex, opts, coltd,tablehtml);
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
            var tablehtml=$(jq[0]).find("table");
            LoadIsListTd($(jq[0]), col, opts.data._Items[param.parentindex], param.parentindex, opts, coltd,tablehtml);
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
        required:false,//只有非文件组的情况起作用
        onUonEmpty:function(opts,col, colOptsb, i, coltd,tablehtml){
            if(opts.required){
                $(tablehtml).css({border:'1px solid #ccc'});
            }
        },//非文件组时的无数据调用
        onEmpty:function(opts,col, colOptsb, i, coltd,tablehtml){
            if(opts.required){
                $(tablehtml).css({border:'1px solid #f49a5e'});
            }
        },//非文件组时的无数据调用
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
})(jQuery);