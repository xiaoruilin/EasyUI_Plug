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
});