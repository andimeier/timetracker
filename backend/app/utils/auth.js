var crypto = require('crypto');

exports.authenticate = function(username, pass, callback) {

	if (!username || !pass) {
		logger.info('Username or password missing at login request');
		callback(false);
		return;
	}

	var md5sum = crypto.createHash('md5');
	md5sum.update(pass);
	var passHash = md5sum.digest('hex');

	logger.verbose('trying to get connection from dbPool ...');
	dbPool.getConnection(function(err, connection) {

		// secure text input
		usernameEscaped = connection.escape(username);
		logger.verbose('Escaped user name', { user: usernameEscaped });

		// query the database to some data 
		var sql = "SELECT first_name, last_name, user_id, username, password, lastlogin from users where username=" + usernameEscaped;
		logger.verbose('Trying to retrieve specified user', { sql: sql });
		connection.query(sql, function(err, rows) {

			logger.verbose('Query result: ' + JSON.stringify(rows));
			// logger.verbose('passed pw=[' + pass + '],  passHash=[' + passHash + ']');
			logger.verbose('error=[' + + JSON.stringify(err));
			if (rows.length > 0 && err == null) {
				logger.verbose('Query went (technically) ok, now check if password is correct ...');
				var user = rows[0];
				if (user.password == passHash) {
					logger.verbose('Whoa! Correct password! Congrats!');
					callback(true, user.user_id, user);
					logger.info('User [' + username + '] logged in successfully.');
					return;
				} else {
					logger.info('Wrong username or password (user: [' + username + '])');
				}
			}
			callback(false);
			return;
		});

		// close connection
		connection.release();
	});
	logger.verbose('return');

};
