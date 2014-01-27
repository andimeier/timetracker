var mysql = require('mysql');

var dbConfig = require(__dirname + '/db_config.json');

// MySql connection data
var pool = mysql.createPool({
	host     : dbConfig.host,
	user     : dbConfig.user,
	password : dbConfig.password,
	database : dbConfig.database
});


// @FIXME global variables
var user_id = 1;


exports.findById = function(req, res) {

	console.log('---------------------------------');
	console.log('[' +  (new Date()).toLocaleTimeString() + '] GET Request: ' + req);

	pool.getConnection(function(err, connection) {

		// query the database to some data 
		connection.query("SELECT c.client_id, c.name as client_name, p.project_id, p.name as project_name, r.* "
				+ " from records r "
				+ " join projects p on p.project_id=r.project_id "
				+ " join clients c on c.client_id=p.client_id "
				+ " where record_id=" + req.params.id, function(err, rows) {

			// console.log('Found record: ' + JSON.stringify(rows));
			// console.log('Records are of type [' + rows.constructor.name + ']');
			// console.log('Record[0] is of type [' + (rows[0]).constructor.name + ']');
			// console.log('Record[0][starttime] is of type [' + (rows[0]['starttime']).constructor.name + ']');
			
			// for (var i in rows[0]) {
			//   val = rows[i];
			//   console.log('field: ' + val);
			// }	

			// rows.forEach(rows, function(key, val) {
			// 	console.log('   value [' + key + '] is [' + value + ']');
			// });
			// console.log('Field "starttime" is [' + rows['starttime']);
			// console.log('Field "starttime" is [' + rows['starttime'].constructor.name + ']');

			if (err != null) {
				res.send(400, "Query error:" + err);
			} else {
				// Shows the result on console window
				res.send(200, rows);
			}
		});

		// close connection
		connection.release();
	});
};

exports.findAll = function(req, res) {

	console.log('---------------------------------');
	console.log('[' +  (new Date()).toLocaleTimeString() + '] Query (find all) called...');

	pool.getConnection(function(err, connection) {

		// Query the database to some data 
		//connection.query("SELECT * from records limit 10where starttime >= date_sub(current_date, interval 30 day) order by starttime desc limit 10", function(err, rows) {
		connection.query("SELECT c.client_id, c.name as client_name, p.project_id, p.name as project_name, "
				+ "r.record_id, r.starttime, r.endtime, r.pause, r.description, r.user_id, r.invoice_id "
				+ " from records r "
				+ " join projects p on p.project_id=r.project_id "
				+ " join clients c on c.client_id=p.client_id "
				+ " limit 10", function(err, rows) {
			console.log('   ... got answer from DB server');

			if (err != null) {
				res.send(404, "Query error:" + err);
			} else {
				// Shows the result on console window

				console.log('Found ' + rows.length + ' rows ...');


				res.send(200, rows);
			}
		});

		// close connection
		connection.release();
		console.log('   Connection closed');
	});
};

exports.add = function(req, res) {

	console.log('---------------------------------');
	console.log('[' +  (new Date()).toLocaleTimeString() + '] add: ' + JSON.stringify(req.body));

	var attributes = [
		'starttime',
		'endtime',
		'pause',
		'project_id',
		'description'
	];
	var values = [];

	var project_id = req.body['project_id'];

	console.log('project_id is null: ' + (project_id === null)); 

	console.log('project_id undefined: ' + (project_id === undefined));

	console.log('project_id is NaN: ' + isNaN(project_id));

	console.log('!project_id: ' + (!project_id));

	console.log('project_id = ' + project_id);

	attributes.forEach(function(item) {
		values.push(pool.escape(req.body[item]));
	});
	
	// additional (calculated) attributes
	attributes.push('cdate');
	values.push('now()');
	attributes.push('mdate');
	values.push('now()');

	attributes.push('user_id');
	values.push(user_id);

	// begin input validation
	// ----------------------
	var ok = true; // optimistic assumption

	// check for mandatory fields
	if (!req.body.starttime) {
		res.send(400, 'Missing starttime');
		ok = false;
	}

	if (ok) {
		// input is ok, let's write to DB
		// ------------------------------
		pool.getConnection(function(err, connection) {

			// write to DB
			var sql = 'INSERT into records(' + attributes.join(',') + ') ' +
				'select ' + values.join(',');
			console.log("SQL = " + sql);
			connection.query(sql, function(err, rows) {

				if (err != null) {
					res.status(400);
					res.end("Query error:" + err);
					console.log("Sent error response: status=400");
				} else {
					// Shows the result on console window
					res.send(201, rows);
					console.log("Sent OK (status 201)");
				}
			});

			// close connection
			connection.release();
			console.log("Connection released");

		});
	}
}

exports.update = function(req, res) {

	console.log('---------------------------------');
	console.log('[' +  (new Date()).toLocaleTimeString() + '] update: ' + JSON.stringify(req.body));

	var id = parseInt(req.params.id);
	if (!id) {
		res.send(400, 'No valid record_id passed');
	}

	var attributes = [
		'starttime',
		'endtime',
		'pause',
		'project_id',
		'description'
	];
	var values = [];
	attributes.forEach(function(item) {
		values.push(pool.escape(req.body[item]));
	});
	
	// additional (calculated) attributes
	attributes.push('mdate');
	values.push('now()');

	attributes.push('user_id');
	values.push(user_id);

	// begin input validation
	// ----------------------
	var ok = true; // optimistic assumption

	// check fo mandatory fields
	if (!req.body.starttime) {
		res.send(400, 'Missing starttime');
		ok = false;
	}

	if (ok) {
		// input is ok, let's write to DB
		// ------------------------------
		pool.getConnection(function(err, connection) {

			// build update string part
			var updateText = []
			for (var i = 0; i < attributes.length; i++) {
				updateText.push(attributes[i] + '=' + values[i]);
			};

			// write to DB
			var sql = 'UPDATE records set ' + updateText.join() + ' where record_id=' + id;
			console.log("SQL = " + sql);
			connection.query(sql, function(err, rows) {

				if (err != null) {
					res.end("Query error:" + err);
				} else {

					if (!rows.affectedRows) {
						res.status(400);
						rows.error = 'No rows matched';
						console.log("Sent error response (no rows matched): status=400");
					} else {
						res.status(200);
						console.log("Sent OK (status 200)");
					}	

					// send the result
					res.send(rows);
				}
			});

			// close connection
			connection.release();
			console.log("Connection released");
		});
	}
}

exports.delete = function(req, res) {

	// Query the database to some data 
	console.log('---------------------------------');
	console.log('[' +  (new Date()).toLocaleTimeString() + '] delete: ' + JSON.stringify(req.body));

	// begin input validation
	// ----------------------
	var ok = true; // optimistic assumption

	var id = parseInt(req.params.id);
	if (!id) {
		res.send(400, 'No valid record_id passed');
		ok = false;
	}

	if (ok) {
		// input is ok, let's write to DB
		// ------------------------------
		pool.getConnection(function(err, connection) {
			// write to DB
			var sql = 'DELETE from records where record_id=' + id;
			console.log("SQL = " + sql);
			connection.query(sql, function(err, rows) {

				if (err != null) {
					res.end("Query error:" + err);
				} else {

					if (!rows.affectedRows) {
						res.status(400);
						rows.error = 'No rows matched';
					} else {
						res.status(204);
					}	

					// send the result
					res.send(rows);
				}
			});		

			// close connection
			connection.release();
		});
	}


}
