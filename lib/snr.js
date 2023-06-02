/*
    Server Name Resolver
*/
module.exports = function (server, service) {
	const endpoint = {
		prod: 'https://secure.safecharge.com',
		int : 'https://ppp-test.nuvei.com',
		test: 'https://ppp-test.nuvei.com',
		qa  : 'https://apmtest.gate2shop.com',
	}[server] || 'https://srv-bsf-devpppjs.gw-4u.com';
	return endpoint + '/ppp/' + service;
};
