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
	
	validator.VERSION = '0.0.1';
	
	validator.noConflict = function () {
		root.validator = previousValidator;
		return this;
	};
	
	var Model = validator.Model = function (dom) {
		if (!(dom && dom instanceof Element)) {
			this._root = null;
		} else {
			this._root = dom;
		}
	};
	
	validator.isPhone = function (str) {
		return /^(?:(?:1(?:3[4-9]|5[012789]|8[78])\d{8}|1(?:3[0-2]|5[56]|8[56])\d{8}|18[0-9]\d{8}|1[35]3\d{8})|14[57]\d{8}|170[059]\d{7}|17[67]\d{8})$/.test(str);
	};
	validator.isMail = function (str) {
		return /^([_a-zA-Z\d\-\.])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(str);
	};
	validator.isFill ＝ function (str) {
		return str.length !== 0;
	}
	validator.isPassword = function (str) {
		return /^[a-zA-Z0-9_-]{6,20}$/.test(str);
	}
	String.prototype.isPhone = function() {
		return /^(?:(?:1(?:3[4-9]|5[012789]|8[78])\d{8}|1(?:3[0-2]|5[56]|8[56])\d{8}|18[0-9]\d{8}|1[35]3\d{8})|14[57]\d{8}|170[059]\d{7}|17[67]\d{8})$/.test(this);
	};
	
	
	return validator;
}));

