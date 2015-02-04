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
	
	Build = validator.Build = function () {
		
	};
	
	return validator;
}));

