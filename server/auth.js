var crypto = require('crypto');

exports.authenticate = function(user, pass, callback) {

	if (!user || !pass) {
		console.log('username or password missing ...');
		callback(false);
		return;
	}

	var md5sum = crypto.createHash('md5');
	md5sum.update(pass);
	var passHash = md5sum.digest('hex');

	console.log('get connection from dbPool ...');
	dbPool.getConnection(function(err, connection) {

		// secure text input
		user = connection.escape(user);
		console.log('replaced: ' + user);

		// query the database to some data 
		var sql = "SELECT first_name, last_name, user_id, username, password, lastlogin from users where username=" + user;
		console.log('SQL: [' + sql + ']');
		connection.query(sql, function(err, rows) {

			console.log('Query result: ' + JSON.stringify(rows));
			// console.log('passed pw=[' + pass + '],  passHash=[' + passHash + ']');
			console.log('error=[' + + JSON.stringify(err));
			if (rows.length > 0 && err == null) {
				console.log('Query went (technically) ok, now check if password is correct ...');
				var user = rows[0];
				if (user.password == passHash) {
					console.log('Whoa! Correct password! Congrats!');
					console.log('+++++++++++++++++++ HOW DID WE GET HERE? RETURNING 1');
					callback(true, user.user_id, user);
					return;
				} else {
					console.log('Oh my! Wrong password!');
				}
			}
			console.log('--------------------- HOW DID WE GET HERE? RETURNING 0');
			callback(false);
			return;
		});

		// close connection
		connection.release();
	});
	console.log('return');

};
