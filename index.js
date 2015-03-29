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

	var regPhone = /^(?:(?:1(?:3[4-9]|5[012789]|8[78])\d{8}|1(?:3[0-2]|5[56]|8[56])\d{8}|18[0-9]\d{8}|1[35]3\d{8})|14[57]\d{8}|170[059]\d{7}|17[67]\d{8})$/,
		regMail = /^([_a-zA-Z\d\-\.])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

	validator.isPhone = function (str) {
		return str.length==0 || regPhone.test(str);
	};
	validator.isMail = function (str) {
		return str.length==0 || regMail.test(str);
	};
	validator.isFill = function (str) {
		return str.length !== 0;
	};
	validator.isNumber = function (str) {
		return str.length==0 || !isNaN(Number(str));
	};



	var Model = validator.Model = function (dom) {
		if (!dom) {
			this._root = null;
		} else {
			this._root = dom;
		}
		this.valid = function (callback) {
			this._root.find('input').each(function (i, ele) {
				var $ele = $(ele);
				var val = $ele.val();

				if ($ele.attr("required") && val.length === 0) {

					$ele.addClass("wrong").attr({
						'rg-msg': "null",
						'rg-status': 'wrong'
					});

				} else if ($ele.attr('maxlength') && val.length > $ele.attr('maxlength')) {

					$ele.addClass("wrong").attr({
						'rg-status': 'wrong',
						'rg-msg': "tooLong"
					});

				} else if ($ele.attr('max') && Number(val) > $ele.attr('max')) {

					$ele.addClass("wrong").attr({
						'rg-status': 'wrong',
						'rg-msg': "tooBig"
					});

				} else if ($ele.attr('min') && Number(val) < $ele.attr('min')) {

					$ele.addClass("wrong").attr({
						'rg-status': 'wrong',
						'rg-msg': "tooSmall"
					});

				} else if ($ele.attr('rg-type')) {

					switch ($ele.attr('rg-type')) {
					case 'number':
						if (!validator.isNumber(val)) {
							$ele.addClass("wrong").attr({
								'rg-status': 'wrong',
								'rg-msg': "noNumber"
							});
						} else {
							$ele.removeClass("wrong").removeAttr('rg-status rg-msg');
						}
						break;
					case 'tel':
						if (!validator.isPhone(val)) {
							$ele.addClass("wrong").attr({
								'rg-status': 'wrong',
								'rg-msg': "noPhone"
							});
						} else {
							$ele.removeClass("wrong").removeAttr('rg-status rg-msg');
						}
						break;
					case 'email':
						if (!validator.isMail(val)) {
							$ele.addClass("wrong").attr({
								'rg-status': 'wrong',
								'rg-msg': "noMail"
							});
						} else {
							$ele.removeClass("wrong").removeAttr('rg-status rg-msg');
						}
						break;
					default:
						break;
					}
				} else {
					$ele.removeClass("wrong").removeAttr('rg-status rg-msg');
				}
			});
			this._root.find('textarea').each(function (i, ele) {
				var $ele = $(ele);
				var val = $ele.val();
				if ($ele.attr("required") && val.length === 0) {

					$ele.addClass("wrong").attr({
						'rg-status': 'wrong',
						'rg-msg': "null"
					});

				} else if ($ele.attr('maxlength') && val.length > $ele.attr('maxlength')) {

					$ele.addClass("wrong").attr({
						'rg-status': 'wrong',
						'rg-msg': "tooLong"
					});

				}else {
					$ele.removeClass("wrong").removeAttr('rg-status rg-msg');
				}
			});
			if (callback){
				if(this._root.find('[rg-status="wrong"]').length > 0) {
					callback(this._root.find('[rg-status="wrong"]'));
				} else {
					callback(null, this._root);
				}
			}
		};
	};


	return validator;
}));
