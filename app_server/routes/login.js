// var mysql = require('mysql');

// var dbConfig = require(__dirname + '/../config/db_config.json');
var auth = require(__dirname + '/../auth');

// MySql connection data
// var pool = mysql.createPool({
// 	host     : dbConfig.host,
// 	user     : dbConfig.user,
// 	password : dbConfig.password,
// 	database : dbConfig.database
// });


exports.login = function(req, res) {

	console.log('---------------------------------');
	console.log('[' +  (new Date()).toLocaleTimeString() + '] POST Request for login: ' + JSON.stringify(req.body));

	auth.authenticate(req.body['user'], req.body['pass'], function(result){
		if (result) {
			// login successful
			res.send(200, 'Login successful.');
		} else {
			res.send(401, 'Wrong credentials.');
		}
	});
};
