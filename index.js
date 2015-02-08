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

	validator.extend = function (obj) {
		var type = typeof obj;
		if (!(type === 'function' || type === 'object' && !!obj)) return obj;
		var source, prop;
		for (var i = 1, length = arguments.length; i < length; i++) {
			source = arguments[i];
			for (prop in source) {
				if (hasOwnProperty.call(source, prop)) {
					obj[prop] = source[prop];
				}
			}
		}
		return obj;
	};

	var method = {
		isPhone: function () {
			return /^(?:(?:1(?:3[4-9]|5[012789]|8[78])\d{8}|1(?:3[0-2]|5[56]|8[56])\d{8}|18[0-9]\d{8}|1[35]3\d{8})|14[57]\d{8}|170[059]\d{7}|17[67]\d{8})$/.test(this);
		},
		isMail: function () {
			return /^([_a-zA-Z\d\-\.])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(this);
		},
		isFill: function () {
			return this.length !== 0;
		},
		isPassword: function () {
			return /^[a-zA-Z0-9_-]{6,20}$/.test(this);
		}
	};

	validator.extend(String.prototype, method);
	
	var Model = validator.Model = function (dom) {
		if (!(dom && dom instanceof Element)) {
			this._root = null;
		} else {
			this._root = dom;
		}
	};

	return validator;
}));
