; (function ($) {
    if (!$.uploader) {
        _alert("请先引用Py JsCommon.js!");
        return;
    }
    $.extend($.fn.filegridui.defaults, {
        isShow: false, isLockFileDown: false, header: false, width: "100%", style: { "width": "100%" },
        class: "cqfilegrid",
        columns: [[{
            field: '_Items', title: '附件列表', width: "80%", islist: true, _items: [{
                field: 'FileName', formatter: function (value, rowData, rowindex, partentrow) {
                    return $('<div><a href="' + env.filesvr + 'FileAccessSelf.ashx?md5=' + rowData.IDs + '&fileName=' + escape(rowData.FileName) + '" target="_blank">' + value
                        + '</a>&nbsp;&nbsp;' + '<a class="fg-delfilebtn" style="color:red;cursor:pointer">删除</a></div>');
                }
            }], attributestr: function (value, rowData, rowindex) {
                return ' filegroupname="' + rowData.GroupName + '"';
            }
        },
        {
            field: 'sortnosdfxx', title: '上传', width: "36px", style: "text-align:right;", formatter: function (value, rowData, rowindex) {
                var $upfilebtn = $('<btton class="easyui-linkbutton fg-upfilebtn"  href="javascript:void(0)">选择</btton>');
                $upfilebtn.linkbutton();
                return $upfilebtn;
            }
        }]],
        onUploadFile: function (data) {
            console.info("dddd", data);
        }, onUploadSuccess: function (file, response) {
            var fileItem = {};
            fileItem.IDs = file.md5;
            fileItem.FileName = file.name;
            fileItem.FileSize = file.size;
            return fileItem;
        }, isFileGroup: false,
        upfilebtnfun: function (i, o, fileAccept, _this, colOptsb) {
            var uploader = '';  //页面可共用一个上传组件
            $(o).click(function () {
                uploader.uploadFile(); //开启文件选择框, 选择后自动上传
                var upfilebtnData = $(this).data("upfilebtnData");
                if (_this.opts.onUploadFile) {
                    _this.opts.onUploadFile.call(this, upfilebtnData.value, upfilebtnData.rowData, upfilebtnData.rowindex);
                }
            });
            uploader = $.uploader({
                server: _this.opts.uploaderServer, //默认此服务路径
                //multiple:false,  //单选文件, 默认多选
                accept: colOptsb.accept || _this.opts.accept || undefined,
                //chunkSize: 2 * 1024 * 1024,//默认2M文件,大于2M自动分片上传,大于2M需要服务器修改对应web.config文件
                beforeFileQueued: function (file) {
                    //return false;  //阻止该文件上传
                },
                //filesQueued: function (files) {//一般用此事件做页面信息提示
                //    $.each(files, function (i, item) {
                //        dvObj.append('<div id="{id}">{name} <span></span><a href="javascript:void(0)" class="cancelfilebtn" fileId="{id}">取消</a></div>'.Format(item));
                //    });
                //},
                uploadProgress: function (file, percent) {//一般用此事件做页面信息提示
                    //trtds.find('.progressDiv span').html(percent == 1 ? '正在合并文件' : (percent < 0 ? ' 计算md5进度:' : ' 上传进度:') + Math.floor(percent * 100));
                },
                uploadSuccess: function (file, response) {
                    var filedata = _this.opts.onUploadSuccess(file, response) || {};
                    console.info(filedata);
                    _this.filegridui("addChildRow", { parentindex: i, childRowObj: filedata });
                }
            }).on("error", function (type) {
                if (type == "Q_TYPE_DENIED") {
                    var typeError = "请选择正确文件类型！";
                    if (fileAccept && fileAccept.title) {
                        typeError = fileAccept.title;
                    }
                    $.messager.alert("提示信息", typeError, "info");
                }
                //else if (type == "Q_EXCEED_SIZE_LIMIT") {
                //    layer.msg("文件大小不能超过2M");
                //}
                else {
                    layer.msg("上传出错！请检查后重新上传！错误代码" + type);
                }
            });
        }
    });
})(jQuery);