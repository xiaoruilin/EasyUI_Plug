; (function ($) {
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
});