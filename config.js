'use strict';
exports.DATABASE_URL = 
	//'mongodb://localhost/jwt-auth-demo';
	'mongodb://admin:admin@ds155288.mlab.com:55288/datetripper';
	/* ||
    process.env.DATABASE_URL ||
    global.DATABASE_URL;*/
    //'mongodb://localhost/jwt-auth-demo';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
exports.TEST_DATABASE_URL = 'mongodb://admin:admin@ds153958.mlab.com:53958/datetripper-test';