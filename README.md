MoreEasyUI
===========================
该组件是在EasyUI基础上进行扩展，主要功能：
1. 表单页复用（查看页和编辑页面可使用同一套`HTML元素`、`JS代码`）（推荐:heart_eyes:）
2. 表单统一赋值取值（推荐:heart_eyes:）
3. 扩展了表单控件 easyui-check、easyui-radio（推荐:heart_eyes:）
4. 增加了表单验证组件实现统一、多层次验证，提示信息统一设置（推荐:heart_eyes:）
5. 文件组列表
6. 通过配置条件显示HTML元素（推荐:heart_eyes:）
7. 展开及折叠

****
## 目录
* editlabel(可编辑可显示表单)
* validateform(验证表单)
* whereshowele(条件显示元素)
* fielgridui（文件组）
* foldpanel(折叠框)

##### editlabel (可编辑可显示表单)
    使用$.fn.editlabel.defaults重写默认值对象
    该组件可用来减少页面数量，使用一个页面可实现编辑和显示，取值和赋值使用 getData方法 和url/data 属性（或setData方法）。
    还有更多方便的功能等你来发现。
###### 用法
```html
    <!--样式引用-->
    <link href="../../bootstrap3.3.7/css/bootstrap.min.css" rel="stylesheet" />
    <link href="../../easyui1.5.4.5/themes/default/easyui.css" rel="stylesheet" />
    <link href="../../easyui1.5.4.5/themes/icon.css" rel="stylesheet" />
    <link href="../../dist/jquery.moreeasyui.min.css" rel="stylesheet" />

    <!--JS引用-->
    <script src="../../jquery-1.11.3.min.js"></script>
    <script src="../../bootstrap3.3.7/js/bootstrap.min.js"></script>
    <script src="../../jquery.cookie.js"></script>
    <script src="../../json2.min.js"></script>
    <script src="../../easyui1.5.4.5/jquery.easyui.1.5.4.5.min.js"></script>
    <script src="../../easyui1.5.4.5/locale/easyui-lang-zh_CN.js"></script>
    <script src="../../dist/jquery.moreeasyui.min.js"></script>
```

```html
 <div id="div_center2" class="easyui-editlabel easyui-validateform">
    <div class="container-fluid form-container">
        <div class="row">
            <div class="col-xs-3 text-right form-label">登录名：</div>
            <div class="col-xs-3 text-left form-content">
                <label class="editlabel-input" valname="UniqID"
                    data-options="required:true,validType:['LoginID'],novalidate:true,stage:1,disabled:true"></label>
            </div>
            <div class="col-xs-6 text-left form-content"><span style="color:red;">*</span>登录名为6~18位数字或字母组合</div>
        </div>
        <div class="row">
            <div class="col-xs-3 text-right form-label">密码：</div>
            <div class="col-xs-3 text-left form-content">
                <label class="editlabel-password" valname="Password"
                    data-options="required:true,validType:['password1'],novalidate:true,stage:3,editorid:'Password_editor'"></label>
            </div>
            <div class="col-xs-6 text-left form-content"><span style="color:red;">*</span>密码为4~16位数字或字母组合</div>
        </div>
        ......
    </div>
 </div>
```
```javascript
$('#div_center2').editlabel({
    data: {
        UniqID: "Admin", RegeditTiem: "2019-01-01T00:00:00", LinkMan: "联系人甲", MianJi: '',
        BankCradNum: "5103 2432 3232 1123", Hobby: "蓝球,排球,", FileGroupList: {
            "_Items": [
                {
                    "IDs": "f9175168-8066-4dba-879d-e976bd7be092",
                    "FileName": "Zszb指标.xml",
                    "FileSize": 12663
                },
                {
                    "IDs": "f9175168-8066-4dba-879d-34543435",
                    "FileName": "Zsz134324234.xml",
                    "FileSize": 12663
                }
            ]
        }

    },
    editable: true//editable: true,表示编制状态，editable: false表示查看状态
    , validateform: true, stages: [2], isMustFillStyle: true,
    onGetDataEnd: function (data) {
        data.BankCradNum = "99999999";
    }
    //optionsdatasou: optionsdatasou
});
```
###### 属性
| 属性名  | 属性值类型| 描述 | 默认值 |
| ---------- | -----------| -----------| -----------|
| url   | string   | ajax rul 地址| null|
| data   | json   | |{}|
| confirmbtn   | string   | 提交按钮选择器|null|
| editable   | boolean   |true:表示编制状态，false:表示查看状态 |false|
| validateform   | boolean   | 表单中是否有验证项|false|
| optionsdatasou   | object   | 为表单中统一配置下拉选项的值（不推荐），推荐使用下拉框组件data|null|
| isMustFillStyle   | boolen   | 必填项的开关|false|
| mustFillEle   | string   | 必填项的元素|&lt;span class="el-title-mustfill"&gt;*&lt;/span&gt;|
| mustFillClass   | string   | 必填项样式|null|
| mustFillLabel   | string   | 必填项放置位置|null|
| mustFillSelector   | string   | 必填项的选择器|function () { return $(this).parent().prev(); }|
###### 事件
| 事件名  | 参数 | 描述 |
| ---------- | ---------------| -----------|
| onLoadSuccess | data, _this, editable   | 可在此事件写入第三方插件的初始|
| onGetDataEnd | data   | 取完数据后触发|
###### 方法
| 方法名  | 方法属性 | 描述 |
| ---------- | ---------------| -----------|
| options | none  | 返回属性对象。|
| getData | none  | 取表单元素数据|
| getEditors | none  | 取得表单中所有编辑组件|
| getEditor | param为valname字符串 或 {valname:"UserName",editorid:""}  | 取得表单中指定编辑组件 |
| removeMustfill | param为valname字符串 或 {valname:"UserName",editorid:""}   | 删除必填项|
| appendMustfill | param为valname字符串 或 {valname:"UserName",editorid:""}   | 添加必填项|

##### validateform (验证表单)
    使用$.fn.validateform.defaults重写默认值对象
    实现元素内（表单）统一验证，使用easyui validatebox 实现，包括有验证提示信息统一设置，减少修改代码处。

###### 属性
| 属性名  | 属性值类型| 描述 | 默认值 |
| ---------- | -----------| -----------| -----------|
| stages   | Array   | ajax rul 地址| [1]|
| isAlert   | boolean | 是否有弹出框提示 |true|
| novalidate   | boolean   | 表单是否验证|false|
| isLableValid   | boolean   |是表对editlabel中显示表单值进行验证 |false|
| isHiddenValid   | boolean   | 是否对表单中隐藏域验证|false|
| alertpagejquery   | object   |弹出框页对象，解决有些情况会在父页面弹出提示（如：$.parent）|$|
###### 事件
    无

###### 方法
| 方法名  | 方法属性 | 描述 |
| ---------- | ---------------| -----------|
| options | none  | 返回属性对象。|
| validateform | [1,2,3]  | 验证指定层级表单|
| validateformlable | [1,2,3]| 可验证editlabel 中label值|

##### whereshowele (条件显示元素)
    按条件显示元素。

##### fielgridui (文件组)
    使用$.fn.fielgridui.defaults重写默认值对象
    实现项目中实现文件列表上一台加一个分组（各组文件格式区分），也可以直接使用文件列表或只限制单文件上传，上传文件组件必须自己实现。

###### 属性
| 属性名  | 属性值类型| 描述 | 默认值 |
| ---------- | -----------| -----------| -----------|
| url   | string   | ajax rul 地址| null|
| data   | json   | |{ "_Items": [] }|
| colwidth   | string   | 列宽|20px|
| align   | string   |对齐 |center|
| header   | boolean| 是否有标题|true|
| width| string| 文件组相对父页的宽度 |"95%"|
| class| string| 样式| table table-bordered |
| classforshow | string   | 查看模式下的类|空|
| style   | string   | 样式表|{ "width": "95%" }|
| columns | Array   | 与dataguid一至|默认有（序号，资料类型，附件列表，上传）几列|
| missingMessage | string |每一组上验证提示 |"送审资料：{0}  必须上传资料！"|
| hasnoFileMessage | string |附件列表中无数据时弹出框信息 |"请上传资料！"|
| emptyMessage | string |附件列表中无数据时显示信息 |"请上传附件"|
| emptyMessageForShow | string |附件列表中无数据时显示信息为显示模式 |"请上传附件"|
| delFileConfirmMessage | string |删除文件时的提示信息 |确定要删除该附件吗？|
| isLockFileDown | boolean |是否锁定下载功能 |false|
| isShow | boolean |如果是显示状态则会删除上传和删除按钮 |false|
| isFileGroup | boolean |区分是否是文件组默认是否则系统自动加上Group结构 |true|
| fileGroupFileListAttr | boolean |当isFileGroup会起作用 |"_Items"|
| uploaderServer | string |文件上传服务器地址 |undefined|
| onlyOneFile | boolean | 是否只能上传一个文件 |false|
| onekeydown | string | 是否有一键下载 |false|
###### 事件
| 事件名  | 参数 | 描述 |
| ---------- | ---------------| -----------|
| onDelFile | parentindex, rowindex  | 删除文件|
| onDelFileAfter | parentindex, rowindex, _this   | 删除文件后|
| onUploadFile | groupid, groupname, fileextlimit, filesizelimit, rowindex | 上传文件|
| onUploadSuccess | file, response | 上传成功|
| onOneKeyDown |  | 一键下载时|
| upfilebtnfun | i, o, fileAccept, _this, colOptsb | 正式使用必须重写这个方法|
###### 方法
| 方法名  | 方法属性 | 描述 |
| ---------- | ---------------| -----------|
| options | none  | 返回属性对象。|
| getData | none  | 取数据|
| setData | data  | 设置数据|
| hasFile | none  | 是否有文件|
| isValid | {stages:[1,2..],stage:1} | 验证文件组 |
| addChildRow |{parentindex:0,childRowObj:Object}  | 添加子行|
| deleteChildRow | {parentindex:0,rowindex:1} | 删除子行|

##### foldpanel (折叠框)
    使用$.fn.foldpanel.defaults重写默认值对象