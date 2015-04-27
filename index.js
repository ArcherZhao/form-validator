(function (root, factory) {
	'use strict';

	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = factory(root);
		} else {
			exports = factory(root);
		}

	} else {
		root.validator = factory(root);
	}

}(this, function (root) {
	'use strict';

	var previousValidator = root.validator,
		validator = {};

	validator.VERSION = '0.1.0';

	validator.noConflict = function () {
		root.validator = previousValidator;
		return this;
	};

	var regPhone = /^(?:(?:1(?:3[4-9]|5[012789]|8[78])\d{8}|1(?:3[0-2]|5[56]|8[56])\d{8}|18[0-9]\d{8}|1[35]3\d{8})|14[57]\d{8}|170[059]\d{7}|17[67]\d{8})$/,
		regMail = /^([_a-zA-Z\d\-\.])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

	var method = validator.method = {
		required: function(val) {
			return val.length !== 0;
		},
		tel: function(val) {
			return val.length == 0 || regPhone.test(val);
		},
		email: function(val) {
			return val.length == 0 || regMail.test(val);
		},
		number: function(val) {
			return val.length == 0 || !isNaN(Number(val));
		},
		int: function(val) {
			return val.length == 0 || !isNaN(Number(val));
		},
		max: function(val, lim) {
			return val.length == 0 || !isNaN(Number(val)) && Number(val) <= lim;
		},
		min: function(val, lim) {
			return val.length == 0 || !isNaN(Number(val)) && Number(val) >= lim;
		},
		maxlength: function(val, lim) {
			return val.length <= lim;
		},
		minlength: function(val, lim) {
			return val.length >= lim;
		}
	};
	method.required.msg = "不能为空！";
	method.tel.msg = "请输入合法手机号码！";
	method.email.msg = "请输入合法邮箱！";
	method.number.msg = "请输入数字！";
	method.int.msg = "请输入整数！";
	method.max.msg = "数字太大！";
	method.min.msg = "数字太小！";
	method.maxlength.msg = "数位太长！";
	method.minlength.msg = "数位太短！";

	var makeId = validator.uniqueId = function (prefix) {
		var idCounter = 0;
		return function () {
			var id = (idCounter++).toString();
			return prefix ? prefix + id : id;
		}
	};

	function extend(obj) {
		var length = arguments.length;
		for (var index = 1; index < length; index++) {
			var source = arguments[index];
			for (var key in source) {
				if (source.hasOwnProperty(key)) {
					obj[key] = source[key];
				}
			}
		}
		return obj;
	}

	var mId = makeId('m');

	var Model = validator.Model = function (par) {
		this.model = {
			value: '',
			dom: null,
			method: [],
			status: 'unverify',
			prompts: {}
		};
		par && extend(this.model, par);
		this.MID = mId();
	};

	extend(Model.prototype, {

		fashion: function (obj) {
			extend(this.model, obj);
		},

		destroy: function () {
			this.model = null;
			this.form = null;
		},

		verify: function (cb) {
			var model = this.model,
				arr;
			model.status = 'verifying';
			model.reason = "";

			for (var i = 0; i < model.method.length; i++) {
				arr = model.method[i].split('_');
				if (validator.method[arr[0]] && !validator.method[arr[0]](model.value, arr[1])) {
					model.status = 'fail';
					model.reason = arr[0];
					break;
				}
			};

			model.status = model.status == 'fail' ? 'fail' : 'ok';
			if (window.$) {
				if(model.status == 'fail'){
					$(model.dom).addClass('wrong');
				} else {
					$(model.dom).removeClass('wrong');
				}

			} else {
				if(model.status == 'fail'){
					model.dom.className = model.dom.className.search(/\bwrong\b/) == -1 ? model.dom.className + ' wrong' : model.dom.className;
				} else {
					model.dom.className = model.dom.className.replace(/\bwrong\b/, "");
				}
			}
			cb && cb(model.prompts[model.reason] || model.prompts.all || validator.method[model.reason].msg);
		}
	})

	var Form = validator.Form = function (par, cb) {
		if (par) {
			this._root = par.dom || document;
			this.event = par.event || (par.target ? 'click' : 'change');
			this.target = par.target;
		}

		var is$;
		var that = this;
		that.content = {};
		if(window.$ && this._root instanceof $){
			is$ = true;
			var domList = this._root.find("[rg-rule]");
		} else {
			var domList = this._root.querySelectorAll("[rg-rule]");
		}

		for (var i = 0; i < domList.length; i++) {

			var dom = domList[i],
				prompts;

			var model = new Model({
				value: dom.value || '',
				dom: dom,
				method: dom.getAttribute('rg-rule').split('|'),
				prompts:{}
			});
			model.form = that;

			that.content[model.MID] = model;

			dom.setAttribute('rg-model', model.MID);
			if (is$){
				if (!that.target) {
					$(dom).on(this.event, function (event) {
						that.content[event.target.getAttribute('rg-model')].model.value = event.target.value;
						that.handle(event.target.getAttribute('rg-model'), cb);
					});
				}
			} else {
				if (!that.target) {
					dom.addEventListener(this.event, function (event) {
						that.content[event.target.getAttribute('rg-model')].model.value = event.target.value;
						that.handle(event.target.getAttribute('rg-model'), cb);
					});
				}
			}
		}
		if (that.target) {
			that.target.addEventListener('click', function (event) {

				for (var prop in that.content) {
					if (that.content.hasOwnProperty(prop)) {
						that.handle(prop, cb);
					}
				}
			});
		}

	};
	extend(Form.prototype, {
		handle: function (mid, cb) {
			this.content[mid].verify(cb);
		}
	});


	return validator;
}));
