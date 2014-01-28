var mysql = require('mysql');
var crypto = require('crypto');

var dbConfig = require(__dirname + '/config/db_config.json');

// MySql connection data
var pool = mysql.createPool({
	host     : dbConfig.host,
	user     : dbConfig.user,
	password : dbConfig.password,
	database : dbConfig.database
});


exports.authenticate = function(user, pass, callback) {

	var md5sum = crypto.createHash('md5');
	md5sum.update(pass);
	var passHash = md5sum.digest('hex');

	console.log('get connection from pool ...');
	pool.getConnection(function(err, connection) {

		// secure text input
		user = connection.escape(user);
		console.log('replaced: ' + user);

		// query the database to some data 
		var sql = "SELECT username, password from users where username=" + user;
		console.log('SQL: [' + sql + ']');
		connection.query(sql, function(err, rows) {

			console.log('Query result: ' + JSON.stringify(rows));
			// console.log('passed pw=[' + pass + '],  passHash=[' + passHash + ']');
			console.log('error=[' + + JSON.stringify(err));
			if (rows.length > 0 && err == null) {
				console.log('Query went (technically) ok, now check if password is correct ...');
				if (rows[0].password == passHash) {
					console.log('Whoa! Correct password! Congrats!');
					console.log('+++++++++++++++++++ HOW DID WE GET HERE? RETURNING 1');
					callback(true);
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
