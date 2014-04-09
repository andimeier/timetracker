var crypto = require('crypto');

exports.authenticate = function(user, pass, callback) {

	if (!user || !pass) {
		logger.verbose('username or password missing ...');
		callback(false);
		return;
	}

	var md5sum = crypto.createHash('md5');
	md5sum.update(pass);
	var passHash = md5sum.digest('hex');

	logger.verbose('get connection from dbPool ...');
	dbPool.getConnection(function(err, connection) {

		// secure text input
		user = connection.escape(user);
		logger.verbose('replaced: ' + user);

		// query the database to some data 
		var sql = "SELECT first_name, last_name, user_id, username, password, lastlogin from users where username=" + user;
		logger.verbose('SQL: [' + sql + ']');
		connection.query(sql, function(err, rows) {

			logger.verbose('Query result: ' + JSON.stringify(rows));
			// logger.verbose('passed pw=[' + pass + '],  passHash=[' + passHash + ']');
			logger.verbose('error=[' + + JSON.stringify(err));
			if (rows.length > 0 && err == null) {
				logger.verbose('Query went (technically) ok, now check if password is correct ...');
				var user = rows[0];
				if (user.password == passHash) {
					logger.verbose('Whoa! Correct password! Congrats!');
					logger.verbose('+++++++++++++++++++ HOW DID WE GET HERE? RETURNING 1');
					callback(true, user.user_id, user);
					return;
				} else {
					logger.verbose('Oh my! Wrong password!');
				}
			}
			logger.verbose('--------------------- HOW DID WE GET HERE? RETURNING 0');
			callback(false);
			return;
		});

		// close connection
		connection.release();
	});
	logger.verbose('return');

};
