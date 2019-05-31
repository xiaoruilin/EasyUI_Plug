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

###### 属性
| 属性名  | 属性值类型| 描述 | 默认值 |
| ---------- | -----------| -----------| -----------|
| url   | string   | ajax rul 地址| null|
| data   | json   | |{}|
| editable   | boolean   |true:表示编制状态，false:表示查看状态 |false|
| validateform   | boolean   | 表单中是否有验证项|false|
###### 事件
| 事件名  | 参数 | 描述 |
| ---------- | ---------------| -----------|
| onLoadSuccess | data, _this, editable   | 可在此事件写入第三方插件的初始|
###### 方法
| 方法名  | 方法属性 | 描述 |
| ---------- | ---------------| -----------|
| getData | none  | 取表单元素数据|
| options | none  | 返回属性对象。|

##### validateform (验证表单)
    使用$.fn.validateform.defaults重写默认值对象
    实现元素内（表单）统一验证，使用easyui validatebox 实现，包括有验证提示信息统一设置，减少修改代码处。

##### whereshowele (条件显示元素)
    按条件显示元素。

##### fielgridui (文件组)
    使用$.fn.fielgridui.defaults重写默认值对象
    实现项目中实现文件列表上一台加一个分组（各组文件格式区分），也可以直接使用文件列表或只限制单文件上传，上传文件组件必须自己实现。

##### foldpanel (折叠框)
    使用$.fn.foldpanel.defaults重写默认值对象