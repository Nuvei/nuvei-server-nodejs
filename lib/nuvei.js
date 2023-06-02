const snr = require('./snr');
const crypto = require('crypto');
const moment = require('moment');
const request = require('request');

const schemas = require('./requestDefs');
const uuidv1 = require('uuid').v1;
const _ = require('lodash');
const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});
const localize = require('ajv-i18n');

const requestValidators = {};

function Safecharge() {
	return this;
}

Safecharge.prototype.initiate = function (merchantId, siteId, secretKey, env) {
	this.merchantId = merchantId;
	this.merchantSiteId = siteId;
	this.secretKey = secretKey;
	this.env = env || 'prod';
	this.algorithm = 'sha256';
	this.requestValidation = true;
	this.errLocale = 'en';
};

Safecharge.prototype.setAlgorithm = function (algorithm) {
	if (algorithm && typeof algorithm == 'string' &&
		( algorithm.toLowerCase() === 'md5' || algorithm.toLowerCase() === 'sha256')
	){
		this.algorithm = algorithm;
		return algorithm.toLowerCase();
	} else {
		throw new Error('Invalid algorithm. Supported algorithms are "md5" and "sha256"')
	}
};

Safecharge.prototype.getAlgorithm = function () {
	return this.algorithm;
};

Safecharge.prototype.setErrLocale = function (locale) {
	if (locale && typeof locale == 'string' &&
		["en", "ar", "de", "it", "ko", "nl", "ru", "th", "zh", "zh-tw"].indexOf(locale.toLowerCase()) > -1){
		this.errLocale = locale.toLowerCase();
	}else{
		throw new Error('Invalid locale. Supported locales are "en", "ar", "de", "it", "ko", "nl", "ru", "th", "zh" and "zh-tw"');
	}
	return this.errLocale;
};

Safecharge.prototype.getErrLocale = function () {
	return this.errLocale;
};

Safecharge.prototype.setClientRequestValidation = function (bool) {
	this.requestValidation = bool; // bool; bypass ajv validation
};

Safecharge.prototype.makeRequest = function (data, uri, cb) {
	let isValid = true;
	if (this.requestValidation && schemas[uri+'Request']) {
		if (!requestValidators[uri]) {
			requestValidators[uri] = ajv.compile(schemas[uri+'Request']);
		}
		isValid = requestValidators[uri](data);
	}
	if (isValid) {
		request.post({
			uri   : (uri + '.do'),
			baseUrl : snr(this.env, '/api/v1/'),
			json  : data
			//TODO: allow merchant to define custom timeout
		}, function (error, response, body) {
			if (!error && response.statusCode === 200 && body.errCode === 0) {
				cb(null, body, data);
			} else {
				cb(body, null, data);
			}
		});
	} else {
		localize[this.errLocale](requestValidators[uri].errors);
		cb({
			errCode: 4001,
			reason : ajv.errorsText(requestValidators[uri].errors)
		}, null, data);
	}
};

Safecharge.prototype.getSessionToken = function (data, cb) {
    let req = {
        merchantId: this.merchantId,
        merchantSiteId: this.merchantSiteId.toString(),
        clientRequestId: uuidv1(),
        timeStamp: _getTimestamp()
    };
    let callback = data;
    if (typeof cb === 'function') {
		callback = cb;
		req = _.extend(req, data);
	}
	req.checksum = this._calculateChecksum(this.merchantId + this.merchantSiteId + req.clientRequestId + req.timeStamp + this.secretKey);
	this.makeRequest(req, 'getSessionToken', callback);
};


Safecharge.prototype.dynamic3D = function (data, respCb) {
	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;
	data.clientRequestId = uuidv1();
	data.timeStamp = _getTimestamp();
	data.checksum = this._calculateChecksum(this.merchantId + this.merchantSiteId + data.clientRequestId + data.amount + data.currency + data.timeStamp + this.secretKey);
	this.makeRequest(data, 'dynamic3D', respCb);
};


Safecharge.prototype.payment3D = function (data, respCb) {

};

Safecharge.prototype.paymentCC = function (data, respCb) {
	data = data || {};
	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;
	data.clientRequestId = uuidv1();
	data.timeStamp = _getTimestamp();
	const self = this;
	//merchantId, merchantSiteId, clientRequestId, amount, currency, timeStamp, secretKey.
	const checkSumStr = ['merchantId', 'merchantSiteId', 'clientRequestId', 'amount', 'currency', 'timeStamp', 'secretKey'].reduce(function (acc, currentValue) {
		const itemValue = data.hasOwnProperty(currentValue) ? data[currentValue] : self.hasOwnProperty(currentValue) ? self[currentValue] : '';
		return acc + itemValue;
	}, '');
	data.checksum = this._calculateChecksum(checkSumStr);
	this.makeRequest(data, 'paymentCC', respCb);
};

Safecharge.prototype.initPayment = function(data, respCb){
	data = data || {};
	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;
	data.clientRequestId = uuidv1();
	data.timeStamp = _getTimestamp();
	const self = this;
	//merchantId, merchantSiteId, clientRequestId, amount, currency, timeStamp, secretKey.
	const checkSumStr = ['merchantId', 'merchantSiteId', 'clientRequestId', 'amount', 'currency', 'timeStamp', 'secretKey'].reduce(function (acc, currentValue) {
		const itemValue = data.hasOwnProperty(currentValue) ? data[currentValue] : self.hasOwnProperty(currentValue) ? self[currentValue] : '';
		return acc + itemValue;
	}, '');
	data.checksum = this._calculateChecksum(checkSumStr);
	this.makeRequest(data, 'initPayment', respCb);
};

Safecharge.prototype.paymentAPM = function (data, respCb) {
	data = data || {};
	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;
	data.clientRequestId = uuidv1();
	data.timeStamp = _getTimestamp();
	const self = this;
	const checkSumStr = ['merchantId', 'merchantSiteId', 'clientRequestId', 'amount', 'currency', 'timeStamp', 'secretKey'].reduce(function (acc, currentValue) {
		const itemValue = data.hasOwnProperty(currentValue) ? data[currentValue] : self.hasOwnProperty(currentValue) ? self[currentValue] : '';
		return acc + itemValue;
	}, '');
	data.checksum = this._calculateChecksum(checkSumStr);
	this.makeRequest(data,'paymentAPM', respCb );
};

Safecharge.prototype.payment = function (data, respCb) {
	data = data || {};
	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;
	data.clientRequestId = uuidv1();
	data.timeStamp = _getTimestamp();
	const self = this;
	const checkSumStr = ['merchantId', 'merchantSiteId', 'clientRequestId', 'amount', 'currency', 'timeStamp', 'secretKey'].reduce(function (acc, currentValue) {
		const itemValue = data.hasOwnProperty(currentValue) ? data[currentValue] : self.hasOwnProperty(currentValue) ? self[currentValue] : '';
		return acc + itemValue;
	}, '');
	data.checksum = this._calculateChecksum(checkSumStr);
	this.makeRequest(data,'payment', respCb );
};


Safecharge.prototype.settleTransaction = function (data, respCb) {
	data = data || {};
	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;
	data.clientRequestId = uuidv1();
	data.timeStamp = _getTimestamp();
	const self = this;
	//merchantId, merchantSiteId, clientRequestId, clientUniqueId, amount, currency, relatedTransactionId, authCode, descriptorMerchantName, descriptorMerchantPhone, comment, urlDetails, timeStamp, merchantSecretKey.
	const checkSumStr = ['merchantId', 'merchantSiteId', 'clientRequestId', 'clientUniqueId', 'amount', 'currency',
		'relatedTransactionId', 'authCode', 'descriptorMerchantName', 'descriptorMerchantPhone', 'comment',
		'urlDetails', 'timeStamp', 'secretKey'].reduce(function (acc, currentValue) {
			let itemValue = data.hasOwnProperty(currentValue) ? data[currentValue] : self.hasOwnProperty(currentValue) ? self[currentValue] : '';
			if (currentValue === 'urlDetails'){
				itemValue = data[currentValue]?(data[currentValue]['notificationUrl'])?data[currentValue]['notificationUrl']:'':'';
			}
			return acc + itemValue;
	}, '');
	data.checksum = this._calculateChecksum(checkSumStr);

	this.makeRequest(data,'settleTransaction', respCb );
};

Safecharge.prototype.refundTransaction = function (data, respCb) {
	data = data || {};
	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;
	data.clientRequestId = uuidv1();
	data.timeStamp = _getTimestamp();
	const self = this;
	const checkSumStr = ['merchantId', 'merchantSiteId', 'clientRequestId', 'clientUniqueId', 'amount', 'currency',
		'relatedTransactionId', 'authCode', 'comment', 'urlDetails', 'timeStamp', 'secretKey'].reduce(function (acc, currentValue) {
		let itemValue = data.hasOwnProperty(currentValue) ? data[currentValue] : self.hasOwnProperty(currentValue) ? self[currentValue] : '';
		if (currentValue === 'urlDetails'){
			itemValue = data[currentValue]?(data[currentValue]['notificationUrl'])?data[currentValue]['notificationUrl']:'':'';
		}
		return acc + itemValue;
	}, '');
	data.checksum = this._calculateChecksum(checkSumStr);

	this.makeRequest(data,'refundTransaction', respCb );
};

Safecharge.prototype.voidTransaction = function (data, respCb) {
	data = data || {};
	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;
	data.clientRequestId = uuidv1();
	data.timeStamp = _getTimestamp();
	const self = this;
	const checkSumStr = ['merchantId', 'merchantSiteId', 'clientRequestId', 'clientUniqueId', 'amount', 'currency',
		'relatedTransactionId', 'authCode', 'comment', 'urlDetails', 'timeStamp', 'secretKey'].reduce(function (acc, currentValue) {
		let itemValue = data.hasOwnProperty(currentValue) ? data[currentValue] : self.hasOwnProperty(currentValue) ? self[currentValue] : '';
		if (currentValue === 'urlDetails'){
			itemValue = data[currentValue]?(data[currentValue]['notificationUrl'])?data[currentValue]['notificationUrl']:'':'';
		}
		return acc + itemValue;
	}, '');
	data.checksum = this._calculateChecksum(checkSumStr);

	this.makeRequest(data,'voidTransaction', respCb );
};
//NOT IMPLEMENTED
Safecharge.prototype.payout = function (data, respCb) {

};

Safecharge.prototype.cardTokenization = function (data, respCb) {
	this.makeRequest(data, 'cardTokenization', respCb);
};

Safecharge.prototype.authorization3D = Safecharge.prototype.dynamic3D;

Safecharge.prototype._calculateChecksum = function (checkStr) {
	return crypto.createHash(this.algorithm).update(checkStr).digest("hex");
};

function _getTimestamp() {
	return moment().format('YYYYMMDDHHmmss');
}

Safecharge.prototype.createUser = function (data, callback) {
    data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId.toString();
	data.clientRequestId = uuidv1();
	data.timeStamp = _getTimestamp();
    const self = this;
    const checkSumStr = ['merchantId', 'merchantSiteId', 'userTokenId', 'clientRequestId', 'firstName', 'lastName', 'address', 'state', 'city', 'zip', 'countryCode', 'phone', 'locale', 'email', 'county', 'timeStamp', 'secretKey'].reduce(function (acc, currentValue) {
        const itemValue = data.hasOwnProperty(currentValue) ? data[currentValue] : self.hasOwnProperty(currentValue) ? self[currentValue] : '';
        return acc + itemValue;
    }, '');
	data.checksum = this._calculateChecksum(checkSumStr);

    let isValid = true;
    if (this.requestValidation) {
		if (!requestValidators['createUser']) {
			requestValidators['createUser'] = ajv.compile(schemas.createUserRequest);
		}
		isValid = requestValidators['createUser'](data);
	}
	if (isValid) {
		this.makeRequest(data, 'createUser', callback);
	} else {
		localize[this.errLocale](requestValidators['createUser'].errors);
		callback({
			errCode: 4001,
			reason : ajv.errorsText(requestValidators['createUser'].errors)
		});
	}

};

Safecharge.prototype.updateUser = function (data, respCb) {
	console.log('updating  user');

	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;
	data.clientRequestId = uuidv1();
	data.timeStamp = _getTimestamp();

    const self = this;
    const checkSumStr = ['merchantId', 'merchantSiteId', 'userTokenId', 'clientRequestId', 'firstName', 'lastName', 'address', 'state', 'city', 'zip', 'countryCode', 'phone', 'locale', 'email', 'county', 'timeStamp', 'secretKey'].reduce(function (acc, currentValue) {
        const itemValue = data.hasOwnProperty(currentValue) ? data[currentValue] : self.hasOwnProperty(currentValue) ? self[currentValue] : '';
        return acc + itemValue;
    }, '');
    data.checksum = this._calculateChecksum(checkSumStr);
    this.makeRequest(data, 'updateUser', respCb);
};

Safecharge.prototype.getUserDetails = function (data, respCb) {
	data = data || {};
	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;
	data.clientRequestId = uuidv1();
	data.timeStamp = _getTimestamp();
    const self = this;
    const checkSumStr = ['merchantId', 'merchantSiteId', 'userTokenId', 'clientRequestId', 'timeStamp', 'secretKey'].reduce(function (acc, currentValue) {
        const itemValue = data.hasOwnProperty(currentValue) ? data[currentValue] : self.hasOwnProperty(currentValue) ? self[currentValue] : '';
        return acc + itemValue;
    }, '');

    data.checksum = this._calculateChecksum(checkSumStr);
    this.makeRequest(data, 'getUserDetails', respCb);
};

//addUPOCreditCardByTempToken.do
Safecharge.prototype.addUPOCreditCardByTempToken = function (data, respCb) {
	//dependency on getSessionToken
	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;
	data.clientRequestId = uuidv1();
	data.timeStamp = _getTimestamp();
    const self = this;
    const checkSumStr = ['merchantId', 'merchantSiteId', 'clientRequestId', 'timeStamp', 'secretKey'].reduce(function (acc, currentValue) {
        const itemValue = data.hasOwnProperty(currentValue) ? data[currentValue] : self.hasOwnProperty(currentValue) ? self[currentValue] : '';
        return acc + itemValue;
    }, '');
    data.checksum = this._calculateChecksum(checkSumStr);
	this.makeRequest(data, 'addUPOCreditCardByTempToken', respCb);
};

Safecharge.prototype.getUserUPOs = function (data, respCb) {
	data = data || {};
	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;
	data.clientRequestId = uuidv1();
	data.timeStamp = _getTimestamp();
	data.clientRequestId = uuidv1();
	data.sessionToken = this.sessionToken;
    const self = this;
    const checkSumStr = ['merchantId', 'merchantSiteId', 'userTokenId', 'clientRequestId', 'timeStamp', 'secretKey'].reduce(function (acc, currentValue) {
        const itemValue = data.hasOwnProperty(currentValue) ? data[currentValue] : self.hasOwnProperty(currentValue) ? self[currentValue] : '';
        return acc + itemValue;
    }, '');
    data.checksum = this._calculateChecksum(checkSumStr);
	this.makeRequest(data, 'getUserUPOs', respCb);
};

Safecharge.prototype.getMerchantPaymentMethods = function (data, respCb) {
	data = data || {};
	const self = this;
	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;
	data.clientRequestId = uuidv1();
	data.timeStamp = _getTimestamp();
	const checkSumStr = ['merchantId', 'merchantSiteId', 'clientRequestId', 'timeStamp', 'secretKey'].reduce(function (acc, currentValue) {
		const itemValue = data.hasOwnProperty(currentValue) ? data[currentValue] : self.hasOwnProperty(currentValue) ? self[currentValue] : '';
		return acc + itemValue;
	}, '');
	data.checksum = this._calculateChecksum(checkSumStr);
	this.makeRequest(data, 'getMerchantPaymentMethods', respCb);
};

/* TODO: not added to automatic tests yet */
Safecharge.prototype.addUPOCreditCardByToken = function (data, respCb) {

	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;
	data.clientRequestId = uuidv1();
	data.timeStamp = _getTimestamp();
	data.sessionToken = this.sessionToken;

	const self = this;
	const checkSumStr = ['merchantId', 'merchantSiteId', 'userTokenId', 'clientRequestId', 'userPaymentOptionId', 'timeStamp', 'secretKey'].reduce(function (acc, currentValue) {
		const itemValue = data.hasOwnProperty(currentValue) ? data[currentValue] : self.hasOwnProperty(currentValue) ? self[currentValue] : '';
		return acc + itemValue;
	}, '');
	data.checksum = this._calculateChecksum(checkSumStr);
	this.makeRequest(data, 'suspendUPO', respCb);
};

Safecharge.prototype.suspendUPO = function (data, respCb) {
	data = data || {};
	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;
	data.clientRequestId = uuidv1();
	data.timeStamp = _getTimestamp();
	data.sessionToken = this.sessionToken;

    const self = this;
    const checkSumStr = ['merchantId', 'merchantSiteId', 'userTokenId', 'clientRequestId', 'userPaymentOptionId', 'timeStamp', 'secretKey'].reduce(function (acc, currentValue) {
        const itemValue = data.hasOwnProperty(currentValue) ? data[currentValue] : self.hasOwnProperty(currentValue) ? self[currentValue] : '';
        return acc + itemValue;
    }, '');
    data.checksum = this._calculateChecksum(checkSumStr);
	this.makeRequest(data, 'suspendUPO', respCb);
};

//https://ppp-test.safecharge.com/pppenableUPO.do
Safecharge.prototype.enableUPO = function (data, respCb) {
	data = data || {};
	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;
	data.clientRequestId = uuidv1();
	data.timeStamp = _getTimestamp();
	data.sessionToken = this.sessionToken;

    const self = this;
    const checkSumStr = ['merchantId', 'merchantSiteId', 'userTokenId', 'clientRequestId', 'userPaymentOptionId', 'timeStamp', 'secretKey'].reduce(function (acc, currentValue) {
        const itemValue = data.hasOwnProperty(currentValue) ? data[currentValue] : self.hasOwnProperty(currentValue) ? self[currentValue] : '';
        return acc + itemValue;
    }, '');
    data.checksum = this._calculateChecksum(checkSumStr);
	this.makeRequest(data, 'enableUPO', respCb);
};

Safecharge.prototype.deleteUPO = function (data, respCb) {
	data = data || {};
	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;
	data.clientRequestId = uuidv1();
	data.timeStamp = _getTimestamp();
	data.sessionToken = this.sessionToken;

    const self = this;
    const checkSumStr = ['merchantId', 'merchantSiteId', 'userTokenId', 'clientRequestId', 'userPaymentOptionId', 'timeStamp', 'secretKey'].reduce(function (acc, currentValue) {
        const itemValue = data.hasOwnProperty(currentValue) ? data[currentValue] : self.hasOwnProperty(currentValue) ? self[currentValue] : '';
        return acc + itemValue;
    }, '');
    data.checksum = this._calculateChecksum(checkSumStr);
	this.makeRequest(data, 'deleteUPO', respCb);
};

//addUPOCreditCard.do
Safecharge.prototype.addUPOCreditCard = function (data, respCb) {
	data = data || {};
	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;
	data.clientRequestId = uuidv1();
	data.timeStamp = _getTimestamp();
    const self = this;
    const checkSumStr = ['merchantId', 'merchantSiteId', 'userTokenId', 'clientRequestId', 'ccCardNumber', 'ccExpMonth', 'ccExpYear', 'ccNameOnCard', 'billingAddress', 'userPaymentOptionId', 'timeStamp', 'secretKey'].reduce(function (acc, currentValue) {
        let itemValue = data.hasOwnProperty(currentValue) ? data[currentValue] : self.hasOwnProperty(currentValue) ? self[currentValue] : '';

        if (currentValue === 'billingAddress') {
            itemValue = ['firstName', 'lastName', 'address', 'phone', 'zip', 'city', 'countryCode', 'state', 'email', 'county'].reduce(function (bAcc, bItem) {
                const baValue = itemValue.hasOwnProperty(bItem) ? itemValue[bItem] : '';
                return bAcc + baValue;
            }, '');
        }
        return acc + itemValue;
    }, '');

    data.checksum = this._calculateChecksum(checkSumStr);
	//TODO: do validation against a schema before sending
	this.makeRequest(data, 'addUPOCreditCard', respCb);
};

//openOrder.do
Safecharge.prototype.openOrder = function (data, respCb) {
	data = data || {};
	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;
	data.clientRequestId = uuidv1();
	data.timeStamp = _getTimestamp();
    const self = this;
    //merchantId, merchantSiteId, clientRequestId, amount, currency, timeStamp, secretKey.
    const checkSumStr = ['merchantId', 'merchantSiteId', 'clientRequestId', 'amount', 'currency', 'timeStamp', 'secretKey'].reduce(function (acc, currentValue) {
        const itemValue = data.hasOwnProperty(currentValue) ? data[currentValue] : self.hasOwnProperty(currentValue) ? self[currentValue] : '';
        return acc + itemValue;
    }, '');

    data.checksum = this._calculateChecksum(checkSumStr);
	//TODO: do validation against a schema before sending
	this.makeRequest(data, 'openOrder', respCb);
};

//updateOrder.do
Safecharge.prototype.updateOrder = function (data, respCb) {
	data = data || {};
	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;
	data.clientRequestId = uuidv1();
	data.timeStamp = _getTimestamp();
    const self = this;
    const checkSumStr = ['merchantId', 'merchantSiteId', 'clientRequestId', 'amount', 'currency', 'timeStamp', 'secretKey'].reduce(function (acc, currentValue) {
        const itemValue = data.hasOwnProperty(currentValue) ? data[currentValue] : self.hasOwnProperty(currentValue) ? self[currentValue] : '';
        return acc + itemValue;
    }, '');

    data.checksum = this._calculateChecksum(checkSumStr);
	//TODO: do validation against a schema before sending
	this.makeRequest(data, 'updateOrder', respCb);
};
//getOrderDetails
Safecharge.prototype.getOrderDetails = function (data, respCb) {
	data = data || {};
	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;
	data.clientRequestId = uuidv1();
	data.timeStamp = _getTimestamp();
    const self = this;
    const checkSumStr = ['merchantId', 'merchantSiteId', 'clientRequestId', 'timeStamp', 'secretKey'].reduce(function (acc, currentValue) {
        const itemValue = data.hasOwnProperty(currentValue) ? data[currentValue] : self.hasOwnProperty(currentValue) ? self[currentValue] : '';
        return acc + itemValue;
    }, '');

    data.checksum = this._calculateChecksum(checkSumStr);
	//TODO: do validation against a schema before sending
	this.makeRequest(data, 'getOrderDetails', respCb );

};

//getPaymentStatus
Safecharge.prototype.getPaymentStatus = function (data, respCb) {
	data = data || {};

	this.makeRequest(data, 'getPaymentStatus', respCb);
};

//getCardDetails
Safecharge.prototype.getCardDetails = function (data, respCb) {
	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;
	data.clientRequestId = uuidv1();
	
	this.makeRequest(data, 'getCardDetails', respCb);
};

//authorize3d
Safecharge.prototype.authorize3d = function (data, respCb) {
	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;	
	data.timeStamp = _getTimestamp();
	data.clientRequestId = uuidv1();

    const self = this;
    const checkSumStr = ['merchantId', 'merchantSiteId', 'clientRequestId', 'amount', 'currency', 'timeStamp', 'secretKey'].reduce(function (acc, currentValue) {
        let itemValue = data.hasOwnProperty(currentValue) ? data[currentValue] : self.hasOwnProperty(currentValue) ? self[currentValue] : '';
        return acc + itemValue;
	}, '');
	
	data.checksum = this._calculateChecksum(checkSumStr);
	
	this.makeRequest(data, 'authorize3d', respCb);
};

//verify3d
Safecharge.prototype.verify3d = function (data, respCb) {
	data.merchantId = this.merchantId;
	data.merchantSiteId = this.merchantSiteId;
	data.timeStamp = _getTimestamp();
	data.clientRequestId = uuidv1();
	
	this.makeRequest(data, 'verify3d', respCb);
};

module.exports = (function(){
	let sfcInstance = new Safecharge();
	sfcInstance.paymentService = { // all tested
		createPayment :  Safecharge.prototype.payment.bind(sfcInstance),
		initPayment   :  Safecharge.prototype.initPayment.bind(sfcInstance),
		openOrder	  :  Safecharge.prototype.openOrder.bind(sfcInstance),
		settleTransaction: Safecharge.prototype.settleTransaction.bind(sfcInstance),
		refundTransaction: Safecharge.prototype.refundTransaction.bind(sfcInstance),
		voidTransaction : Safecharge.prototype.voidTransaction.bind(sfcInstance)
	};

	sfcInstance.userService = {
		createUser : Safecharge.prototype.createUser.bind(sfcInstance),
		updateUser : Safecharge.prototype.updateUser.bind(sfcInstance),
		getUserDetails: Safecharge.prototype.getUserDetails.bind(sfcInstance),
		getUserUPOs : Safecharge.prototype.getUserUPOs.bind(sfcInstance)
	};


	sfcInstance.userPaymentOptions = {
		addUPOCreditCard: Safecharge.prototype.addUPOCreditCard.bind(sfcInstance),
		addUPOCreditCardByTempToken : Safecharge.prototype.addUPOCreditCardByTempToken.bind(sfcInstance),
		addUPOCreditCardByToken: Safecharge.prototype.addUPOCreditCardByToken.bind(sfcInstance),
		getUserUPOs : Safecharge.prototype.getUserUPOs.bind(sfcInstance)
		//addUPOAPM : Safecharge.prototype.addUPOAPM,
	};


	return sfcInstance;
}()) ;
