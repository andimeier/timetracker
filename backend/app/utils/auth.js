/**
 * Utility class for authenticating users.
 * @class authenticate
 * @type {exports}
 */
var crypto = require('crypto'),
	debug = require('debug')('login');

/**
 * Authenticates a user with username and password given.
 * The credentials are checked against the database. If successful, the function sends
 * user ID and other user data to the callback function.
 * If not successful (wrong password, no username or password provided, etc.), the
 * callback will be called with success=false.
 * @method authenticate
 * @param username {String} username
 * @param pass {String} password
 * @param cb {Function} a callback function accepting the following parameters:
 * * success {Boolean} true if authentication was successful, false otherwise
 * * userId {Number} user ID of successfully authenticated user, undefined otherwise
 * * user (Object} user object of successfully authenticated user from database, undefined otherwise
 */
exports.authenticate = function(username, pass, cb) {

	if (!username || !pass) {
		logger.verbose('Username or password missing at login request');
		cb(false);
		return;
	}

	var md5sum = crypto.createHash('md5');
	md5sum.update(pass);
	var passHash = md5sum.digest('hex');

	logger.verbose('trying to get connection from dbPool ...');
	dbPool.getConnection(function(err, connection) {

		// secure text input
		usernameEscaped = connection.escape(username);
		debug('Escaped user name', { user: usernameEscaped });

		// query the database to some data 
		var sql = "SELECT first_name, last_name, user_id, username, password, lastlogin from users where username=" + usernameEscaped;
		debug('Trying to retrieve specified user', { sql: sql });
		connection.query(sql, function(err, rows) {

			debug('Query result: ' + JSON.stringify(rows));
			debug('error=[' + JSON.stringify(err));
			if (rows.length > 0 && err == null) {
				debug('Query went (technically) ok, now check if password is correct ...');
				var user = rows[0];
				if (user.password == passHash) {
					debug('Whoa! Correct password! Congrats!');
					cb(true, user.user_id, user);
					logger.info('User [' + username + '] logged in successfully.');
					return;
				} else {
					logger.info('Wrong username or password (user: [' + username + '])');
				}
			}
			cb(false);
			return;
		});

		// close connection
		connection.release();
	});
};
