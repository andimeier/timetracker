var auth = require(__dirname + '/../utils/auth');
var error = require(__dirname + '/../utils/error');

exports.login = function (req, res) {

	logger.verbose('POST Request for login', { credentials: req.body });

	auth.authenticate(req.body['user'], req.body['pass'], function (result, userId, user) {
		if (result) {
			// login successful
			// store userId in (local) session data
			req.session.userId = userId;
			req.session.username = user.username;
			req.session.firstName = user.first_name;
			logger.verbose('Stored user Id [' + userId + '] and firstName [' + user.first_name + '] in session');

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

exports.logout = function (req, res) {

	logger.verbose('GET Request for logout');

	// remember username for logging purposes
	var username = req.session.username;

	// remove session data
	req.session = null;
	logger.info('Session cleared, user [' + username + '] logged out.');
	res.send(200, { message: 'Logout successful' });
};
