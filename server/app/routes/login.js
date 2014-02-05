var auth = require(__dirname + '/../utils/auth');
var error = require(__dirname + '/../utils/error');

exports.login = function(req, res) {

	console.log('---------------------------------');
	console.log('[' +  (new Date()).toLocaleTimeString() + '] POST Request for login: ' + JSON.stringify(req.body));

	auth.authenticate(req.body['user'], req.body['pass'], function(result, userId, user){
		if (result) {
			// login successful
			// store userId in (local) session data
			req.session.userId = userId;
			req.session.username = user.username;
			req.session.firstName = user.first_name;
			console.log('Stored user Id [' + userId + '] and firstName [' + user.first_name + '] in session');

			res.send(200, { 
				userId: userId, 
				username: user.username, 
				firstName: user.first_name, 
				lastName: user.last_name,
				lastLogin: user.lastlogin
			 });
		} else {
			res.send(401, error.error({
				errorCode: 1001, 
				errorObj: result
			}));
		}
	});
};

exports.logout = function(req, res) {

	console.log('---------------------------------');
	console.log('[' +  (new Date()).toLocaleTimeString() + '] GET Request for logout');

	// remove session data
	req.session = null;
	console.log('Session cleared');
	res.send(200, { message: 'Logout successful' });
};
