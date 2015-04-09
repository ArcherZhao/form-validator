(function (root, factory) {
	'use strict';

	if (typeof exports !== 'undefined') {
		module.exports = factory(root);
	} else {
		root.validator = factory(root);
	}

}(this, function (root) {
	'use strict';

	var previousValidator = root.validator,
		validator = {};

	validator.VERSION = '0.0.2';

	validator.noConflict = function () {
		root.validator = previousValidator;
		return this;
	};

	var regPhone = /^(?:(?:1(?:3[4-9]|5[012789]|8[78])\d{8}|1(?:3[0-2]|5[56]|8[56])\d{8}|18[0-9]\d{8}|1[35]3\d{8})|14[57]\d{8}|170[059]\d{7}|17[67]\d{8})$/,
		regMail = /^([_a-zA-Z\d\-\.])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

	validator.isPhone = function (str) {
		return str.length == 0 || regPhone.test(str);
	};
	validator.isMail = function (str) {
		return str.length == 0 || regMail.test(str);
	};
	validator.isFill = function (str) {
		return str.length !== 0;
	};
	validator.isNumber = function (str) {
		return str.length == 0 || !isNaN(Number(str));
	};

	var makeId = validator.uniqueId = function(prefix) {
		var idCounter = 0;
		return function(){
			var id = (idCounter++).toString();
			return prefix ? prefix + id : id;
		}
	};
	
	function extend(obj) {
		var length = arguments.length;
		for (var index = 1; index < length; index++) {
			var source = arguments[index];
			for (var key in source) {
				obj[key] = source[key];
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
			reason: ''
		};
		extend(this.model, par);
		this.MID = mId();
	};
	
	extend (Model.prototype, {
		
		fashion: function (obj){
			extend(this.model, obj);
		},
		
		remove: function (){
			this.model = null;
		},
		
		verify: function (){
			this.status = 'verifying';
			for(var i = 0, i < this.model.method, i++){
				if (!validator[this.model.method[i]](this.model.value)){
					this.model.status = 'fail';
					this.model.reason = validator[this.model.method[i]].msg;
					break;
				}
			};
			this.model.status = this.model.status == 'fail' ? 'fail' : 'ok';
		}
	})
	
	var Form = validator.Form = function (par) {
		this._root = par.dom || null;
		this.event = par.event || 'blur';
		this.content = [];
		
		var domList = this._root.querySelectorAll("[rg-rule]");
		
		for (var i = 0, i < domList.length, i++){
			
			var dom = domList[i];
			var model = new Model({
				value: dom.value || '',
				dom: dom,
				method: dom.getAttribute('rg-rule').split('|')
			});
			
			this.content.push(model);
			
			dom.setAttribute('rg-model', model.MID);
			
		}
		
		dom.addEventListener(this.event, verify);
		
		function verify(e){
			
		}
	};


	return validator;
}));