# SafeCharge REST API SDK for Node

Nuvei’s Node Library provides developer tools for accessing Safecharge's REST API. SafeCharge’s REST API is a simple, easy to use, secure and stateless API, which enables online merchants and service providers to process consumer payments through SafeCharge’s payment gateway. The API supports merchants of all levels of PCI certification, from their online and mobile merchant applications, and is compatible with a large variety of payment options, i.e. payment cards, alternative payment methods, etc. For SafeCharge REST API documentation, please see: 
https://docs.nuvei.com/api/main


## Install

```
$ npm i nuvei
```

## Usage

Exapmple:

```js

const nuvei = require('nuvei');
nuvei.initiate(<merchantId>, <merchantSiteId>, <merchantSecretKey>, <env>);
// env is optional can be 'test' or 'prod'
// the last parameter has a default value of 'prod' if omitted

```
Default hashing algorithm is sha256, but
if your account still uses md5 you may need to call:

```
nuvei.setAlgorithm('md5');
```
