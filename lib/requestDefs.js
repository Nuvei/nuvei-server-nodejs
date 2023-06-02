const merchantId = {
	"type"      : "string",
	"pattern"   : "[0-9]{1,20}",
	"minLength" : 1,
	"maxLength" : 20
};

const merchantSiteId = {
	"anyOf" : [
		{
			type    : "integer",
			minimum : 1,
			maximum : 99999999999999999999
		},
		{
			type      : "string",
			pattern   : "[0-9]{1,20}",
			minLength : 1,
			maxLength : 20
		}
	]
};

const clientRequestId = {
	"type"      : "string",
	"minLength" : 1,
	"maxLength" : 255
};

const userTokenId = {
	"type"      : "string",
	"minLength" : 1,
	"maxLength" : 255
};
const timeStamp = {
	"type"      : "string",
	"pattern"   : "[0-9]{14}",
	"minLength" : 14,
	"maxLength" : 14
};

const checksum = {
	"type"      : "string",
	"pattern"   : "[0-9a-f]{1,64}",
	"minLength" : 32, //MD5
	"maxLength" : 64
};

const sessionToken = {
	"type"      : "string",
	"pattern"   : "[0-9a-f]{1,64}",
	"minLength" : 36,
	"maxLength" : 36
};
const any255string = {
	"type"      : "string",
	"minLength" : 0,
	"maxLength" : 255
};

function maxLengthString(n) {
	return {
		"type"      : "string",
		"minLength" : 0,
		"maxLength" : n || 255
	}
}

const dynamicDescriptor = {
	"type"                 : "object",
	"additionalProperties" : false,
	"properties"           : {
		"merchantName"  : maxLengthString(25),
		"merchantPhone" : maxLengthString(13),
	}
};

const ipAddress = {
	"type"  : "string",
	"oneOf" : [
		{ "format" : "ipv4" },
		{ "format" : "ipv6" }
	]
};

const amount = {
	"oneOf" : [
		{ "type" : "string", "maxLength" : 12 },
		{ "type" : "number", "minimum" : 0 }
	]
};

const countryCode = {
	"title"       : "ISO 3166-1 Alpha-2 Country code",
	"description" : "A valid 2-digit ISO country code (ISO 3166-1 alpha-2).",
	"type"        : "string",
	"enum"        : [
		"AD", "AE", "AF", "AG", "AI", "AL", "AM", "AN", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ", "BA",
		"BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW",
		"BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CW",
		"CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ",
		"FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR",
		"GS", "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ",
		"IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ",
		"LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH",
		"MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC",
		"NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL",
		"PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE",
		"SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ", "TC", "TD",
		"TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "US",
		"UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "XK", "YE", "YT", "ZA", "ZM", "ZW"
	]
};

const locales = {
	type   : "string",
	"enum" : [
		"ar_AA", "bg_BG", "cs_CZ", "cz_CZ", "da_DK", "de_DE", "de_de", "el_GR", "en_AU", "en_CA", "en_EN", "en_UK",
		"en_US", "es_ES", "fi_FI", "fr_FR", "hr_HR", "hu_HU", "in_ID", "it_IT", "iw_IL", "ja_JP", "ko_KR", "lt_LT",
		"nl_NL", "no_NO", "pl_PL", "pt_BR", "pt_PT", "ro_RO", "ru_RU", "sk_SK", "sl_SI", "sl_SL", "sq_AL", "sr_RS",
		"sv_SE", "tr_TR", "vi_VN", "zh_CN", "zh_TW"
	]
};

const currency = {
	type   : "string",
	"enum" : [
		"AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF",
		"BMD", "BND", "BOB", "BRL", "BSD", "BTN", "BWP", "BYN", "BYR", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY", "COP",
		"CRC", "CUP", "CVE", "CYP", "CZK", "DJF", "DKK", "DOP", "DZD", "EEK", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP",
		"GBP", "GEL", "GGP", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS",
		"IMP", "INR", "IQD", "IRR", "ISK", "JEP", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KMF", "KPW", "KRW", "KWD",
		"KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LTL", "LVL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT",
		"MOP", "MRO", "MTL", "MUR", "MVR", "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NIS", "NOK", "NPR", "NZD",
		"OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RMB", "RON", "RSD", "RUB", "RWF", "SAR", "SBD",
		"SCR", "SDG", "SEK", "SGD", "SHP", "SLL", "SOS", "SPL", "SRD", "SSP", "STD", "SVC", "SYP", "SZL", "THB", "TJS",
		"TMM", "TND", "TOP", "TRY", "TTD", "TVD", "TWD", "TZS", "UAH", "UGX", "USD", "UYU", "UZS", "VEF", "VND", "VUV",
		"WST", "XAF", "XAG", "XAU", "XCD", "XDR", "XOF", "XPD", "XPF", "XPT", "YEN", "YER", "ZAR", "ZMK", "ZWD"
	]
};

const deviceDetails = {
	"type"                 : "object",
	"additionalProperties" : false,
	"properties"           : {
		"deviceType" : maxLengthString(10), //NOTE: we actually accept any value
		"deviceName" : any255string,
		"deviceOS"   : any255string,
		"browser"    : any255string,
		"ipAddress"  : ipAddress // 45 should be OK https://stackoverflow.com/questions/1076714/max-length-for-client-ip-address
	}
};
const paymentUserDetails = {
	"type"                 : "object",
	"title" : "User detail",
	"additionalProperties" : false,
	"properties"           : {
		firstName : maxLengthString(30),
		lastName  : maxLengthString(40),
		address   : maxLengthString(60),
		phone     : maxLengthString(18),
		zip       : maxLengthString(10),
		city      : maxLengthString(30),
		cell      : maxLengthString(1000), //*?????
		dateOfBirth      : maxLengthString(1000), ///??
		country   : countryCode,
		state     : maxLengthString(2),
		email     : maxLengthString(100),
		county    : any255string
	}
};

const merchantDetails = {
	"type"                 : "object",
	"additionalProperties" : false,
	"properties"           : {
		customField1  : maxLengthString(),
		customField2  : maxLengthString(),
		customField3  : maxLengthString(),
		customField4  : maxLengthString(),
		customField5  : maxLengthString(),
		customField6  : maxLengthString(),
		customField7  : maxLengthString(),
		customField8  : maxLengthString(),
		customField9  : maxLengthString(),
		customField10 : maxLengthString(),
		customField11 : maxLengthString(),
		customField12 : maxLengthString(),
		customField13 : maxLengthString(),
		customField14 : maxLengthString(),
		customField15 : maxLengthString(),
	}
};

const date = {
	type   : "string",
	format : "date"
};

const urlDetails = {
	"type"                 : "object",
	"additionalProperties" : false,
	"properties"           : {
		successUrl      : maxLengthString(1000),
		failureUrl      : maxLengthString(1000),
		pendingUrl      : maxLengthString(1000),
		notificationUrl : maxLengthString(1000),
	}
};

module.exports = {
	sessionTokenRequest   : {
		"type"                 : "object",
		"required"             : [
			"merchantId",
			"merchantSiteId",
			"clientUniqueId",
			"clientRequestId",
			"timeStamp",
			"checksum"
		],
		"additionalProperties" : false,
		"properties"           : {
			"merchantId"      : merchantId,
			"merchantSiteId"  : merchantSiteId,
			"clientRequestId" : clientRequestId,
			"timeStamp"       : timeStamp,
			"checksum"        : checksum
		}
	},
	openOrderResponse : {
		"type"                 : "object",

	},
	openOrderRequest2      : {
		"type"                 : "object",
		"required"             : [
			"merchantId",
			"merchantSiteId",
			"clientRequestId",
			"timeStamp",
			"checksum"
		],
		"additionalProperties" : false,
		"properties"           : {
			merchantId        : merchantId,
			merchantSiteId    : merchantSiteId,
			userTokenId       : any255string,
			clientRequestId   : clientRequestId,
			sessionToken      : sessionToken,
			clientUniqueId    : maxLengthString(45),
			currency          : currency,
			amount            : amount,
			dynamicDescriptor : dynamicDescriptor, // object

			amountDetails   : { type : "object" },
			items           : { type : "array" },
			deviceDetails   : deviceDetails,
			userDetails     : paymentUserDetails,
			shippingAddress : { type : "object" },
			billingAddress  : { type : "object" },
			merchantDetails : merchantDetails, // object
			addendums       : { type : "object" }, // object
			timeStamp       : timeStamp,
			checksum        : checksum
		}
	},
	initPaymentRequest1    : {
		"type"                 : "object",
		"additionalProperties" : false,
		"properties"           : {
			"sessionToken"  : sessionToken,
			merchantId      : { type : "string" },
			merchantSiteId  : { type : "string" },
			orderId         : { type : "string" },
			clientRequestId : { type : "string" },
			clientUniqueId  : { type : "string" },
			isRebilling     : { type : "string" },
			currency        : currency,
			amount          : amount,
			paymentOption   : { type : "object" },
			deviceDetails   : deviceDetails,
			urlDetails      : urlDetails,
			customData      : any255string,
			webMasterId     : any255string,
		}
	},
	paymentAPMRequest2     : {
		"type"                 : "object",
		"required"             : [
			"sessionToken",
			"merchantId",
			"merchantSiteId",
			"clientRequestId",
			"currency",
			"amount",
			"timeStamp",
			"checksum"
		],
		"additionalProperties" : false,
		"properties"           : {
			merchantId        : merchantId,
			merchantSiteId    : merchantSiteId,
			userTokenId       : any255string,
			clientRequestId   : clientRequestId,
			paymentMethod     : maxLengthString(50),
			currency          : currency,
			amount            : amount,
			sessionToken      : sessionToken,
			clientUniqueId    : maxLengthString(45),
			userPaymentOption : { type : "object" },
			dynamicDescriptor : dynamicDescriptor, // object

			userAccountDetails : { type : "object" },
			subMethodDetails   : { type : "object" },
			amountDetails      : { type : "object" },
			items              : { type : "array" },
			deviceDetails      : deviceDetails,
			userDetails        : paymentUserDetails,
			shippingAddress    : { type : "object" },
			billingAddress     : { type : "object" },
			merchantDetails    : merchantDetails, // object
			addendums          : { type : "object" }, // object
			urlDetails         : urlDetails, // object
			customData         : any255string,
			webMasterId        : any255string,
			timeStamp          : timeStamp,
			checksum           : checksum
		}
	},
	getUserDetailsRequest : {
		"type"                 : "object",
		"required"             : [
			"merchantId",
			"merchantSiteId",
			"userTokenId",
			"clientRequestId",
			"timeStamp",
			"checksum"
		],
		"additionalProperties" : false,
		"properties"           : {
			"merchantId"      : merchantId,
			"merchantSiteId"  : merchantSiteId,
			"userTokenId"     : any255string,
			"clientRequestId" : clientRequestId,
			"timeStamp"       : timeStamp,
			"checksum"        : checksum
		}
	},
	"createUserRequest"   : {
		"type"                 : "object",
		"required"             : [
			"merchantId",
			"merchantSiteId",
			"userTokenId",
			"countryCode",
			"clientRequestId",
			"timeStamp",
			"checksum"
		],
		"additionalProperties" : false,
		"properties"           : {
			merchantId      : merchantId,
			merchantSiteId  : merchantSiteId,
			userTokenId     : userTokenId,
			clientRequestId : clientRequestId,
			timeStamp       : timeStamp,
			checksum        : checksum,
			firstName       : maxLengthString(30),
			lastName        : maxLengthString(40),
			address         : maxLengthString(40),
			state           : maxLengthString(2),
			city            : maxLengthString(30),
			zip             : maxLengthString(10),
			countryCode     : countryCode,
			phone           : maxLengthString(18),
			locale          : locales,
			email           : maxLengthString(100),
			dateOfBirth     : date,
			county          : any255string
		}
	}
};