# form-validator
a lightweight pure javascript form validator

遵循ecmascript5，兼容IE9+，配合jQuery可以兼容IE6+。

##用法
+ 首先为需要添加验证规则的dom元素添加自定义属性**rg-rule**，属性值为**|**分隔开的规则名称。

	<input rg-rule="required|email">
	
+ 如果想设置错误提示可以添加**rg-msg-{ruleword}**属性，设置对应规则的提示语。**rg-msg-all**表示设置默认提示语，除已设置提示语的错误类型外都将使用此提示语。
	
	<input rg-rule="tel" rg-msg-tel="请输入合法手机号">

+ 然后就可以在js里调用`validator.Form`方法`new`一个验证对象出来了。

	var valid = new validator.Form({
		form:dom,		//包含需要验证的一组dom元素的dom元素。可以是jQuery对象
		target: dom,	//
	}, alert);