var mysql = require('mysql');

var dbConfig = require(__dirname + '/../config/db_config.json');

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
		connection.query("SELECT p.project_id, p.name, p.abbreviation, p.active "
				+ " from projects p where project_id=" + req.params.id, function(err, rows) {

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

/**
 * REST parameters:
 *   - set ... specify set of projects to be returned, can be one of the following values:
 *       all ... all projects in the database
 *       active ... only active projects (with attribute "active")
 *   - add ... add a specific project into the result set, the value of the parameter is the 
 *       project_id of the project to be added to the result set. This project will be 
 *       included in the result set, regardless of the other query parameters.
 */
exports.findAll = function(req, res) {

	console.log('---------------------------------');
	console.log('[' +  (new Date()).toLocaleTimeString() + '] Query (find all) called...');
	console.log('  Query parameters: ' + JSON.stringify(req.query));

	// parse parameters
	var constraints = [ '1=1'], // find constraints
		include; // a project_id which should always be in the result set
	if (req.query.set) {
		// specifies the set of projects (default, if 'set' 
		// is omitted: 'active', thus requesting only active projects)
		switch(req.query.set) {
			case 'all': break;
			case 'active': constraints.push('active'); break;
		}
	} else {
		// default: query only active projects
		constraints.push('active'); 
	}
	if (req.query.add) {
		// parameter "add" will include a specific project into the result set,
		// regardless of other contraints
		include = parseInt(req.query.add);
		console.log('parameter "add" detected, include= [' + include + ']');
	}
	console.log('parameter "set" = [' + req.query.set + ']');
	console.log('parameter "add" = [' + req.query.add + ']');
	console.log('number of constraints = [' + constraints.length + ']');

	// build query
	var where;
	console.log('2 include= [' + include + ']');
	if (include) {
		where = '((' + constraints.join(' and ') + ') or project_id=' + include + ')';
	} else {
		where = '' + constraints.join(' and ');
	}
	console.log('constraints[0] = [' + constraints[0] + ']');
	console.log('where = [' + where + ']');
	var sql = "SELECT p.project_id, p.name, p.abbreviation, p.active " 
				+ " from projects p where " + where + " order by p.name";
	console.log('sql = [' + sql + ']');


	pool.getConnection(function(err, connection) {

		// Query the database to some data 
		connection.query(sql, function(err, rows) {
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

// exports.add = function(req, res) {

// 	console.log('---------------------------------');
// 	console.log('[' +  (new Date()).toLocaleTimeString() + '] add: ' + JSON.stringify(req.body));

// 	var attributes = [
// 		'starttime',
// 		'endtime',
// 		'pause',
// 		'project_id',
// 		'description'
// 	];
// 	var values = [];

// 	var project_id = req.body['project_id'];

// 	console.log('project_id is null: ' + (project_id === null)); 

// 	console.log('project_id undefined: ' + (project_id === undefined));

// 	console.log('project_id is NaN: ' + isNaN(project_id));

// 	console.log('!project_id: ' + (!project_id));

// 	console.log('project_id = ' + project_id);

// 	attributes.forEach(function(item) {
// 		values.push(pool.escape(req.body[item]));
// 	});
	
// 	// additional (calculated) attributes
// 	attributes.push('cdate');
// 	values.push('now()');
// 	attributes.push('mdate');
// 	values.push('now()');

// 	attributes.push('user_id');
// 	values.push(user_id);

// 	// begin input validation
// 	// ----------------------
// 	var ok = true; // optimistic assumption

// 	// check for mandatory fields
// 	if (!req.body.starttime) {
// 		res.send(400, 'Missing starttime');
// 		ok = false;
// 	}

// 	if (ok) {
// 		// input is ok, let's write to DB
// 		// ------------------------------
// 		pool.getConnection(function(err, connection) {

// 			// write to DB
// 			var sql = 'INSERT into projects(' + attributes.join(',') + ') ' +
// 				'select ' + values.join(',');
// 			console.log("SQL = " + sql);
// 			connection.query(sql, function(err, rows) {

// 				if (err != null) {
// 					res.status(400);
// 					res.end("Query error:" + err);
// 					console.log("Sent error response: status=400");
// 				} else {
// 					// Shows the result on console window
// 					res.send(201, rows);
// 					console.log("Sent OK (status 201)");
// 				}
// 			});

// 			// close connection
// 			connection.release();
// 			console.log("Connection released");

// 		});
// 	}
// }

// exports.update = function(req, res) {

// 	console.log('---------------------------------');
// 	console.log('[' +  (new Date()).toLocaleTimeString() + '] update: ' + JSON.stringify(req.body));

// 	var id = parseInt(req.params.id);
// 	if (!id) {
// 		res.send(400, 'No valid project_id passed');
// 	}

// 	var attributes = [
// 		'starttime',
// 		'endtime',
// 		'pause',
// 		'project_id',
// 		'description'
// 	];
// 	var values = [];
// 	attributes.forEach(function(item) {
// 		values.push(pool.escape(req.body[item]));
// 	});
	
// 	// additional (calculated) attributes
// 	attributes.push('mdate');
// 	values.push('now()');

// 	attributes.push('user_id');
// 	values.push(user_id);

// 	// begin input validation
// 	// ----------------------
// 	var ok = true; // optimistic assumption

// 	// check fo mandatory fields
// 	if (!req.body.starttime) {
// 		res.send(400, 'Missing starttime');
// 		ok = false;
// 	}

// 	if (ok) {
// 		// input is ok, let's write to DB
// 		// ------------------------------
// 		pool.getConnection(function(err, connection) {

// 			// build update string part
// 			var updateText = []
// 			for (var i = 0; i < attributes.length; i++) {
// 				updateText.push(attributes[i] + '=' + values[i]);
// 			};

// 			// write to DB
// 			var sql = 'UPDATE projects set ' + updateText.join() + ' where project_id=' + id;
// 			console.log("SQL = " + sql);
// 			connection.query(sql, function(err, rows) {

// 				if (err != null) {
// 					res.end("Query error:" + err);
// 				} else {

// 					if (!rows.affectedRows) {
// 						res.status(400);
// 						rows.error = 'No rows matched';
// 						console.log("Sent error response (no rows matched): status=400");
// 					} else {
// 						res.status(200);
// 						console.log("Sent OK (status 200)");
// 					}	

// 					// send the result
// 					res.send(rows);
// 				}
// 			});

// 			// close connection
// 			connection.release();
// 			console.log("Connection released");
// 		});
// 	}
// }

// exports.delete = function(req, res) {

// 	// Query the database to some data 
// 	console.log('---------------------------------');
// 	console.log('[' +  (new Date()).toLocaleTimeString() + '] delete: ' + JSON.stringify(req.body));

// 	// begin input validation
// 	// ----------------------
// 	var ok = true; // optimistic assumption

// 	var id = parseInt(req.params.id);
// 	if (!id) {
// 		res.send(400, 'No valid project_id passed');
// 		ok = false;
// 	}

// 	if (ok) {
// 		// input is ok, let's write to DB
// 		// ------------------------------
// 		pool.getConnection(function(err, connection) {
// 			// write to DB
// 			var sql = 'DELETE from projects where project_id=' + id;
// 			console.log("SQL = " + sql);
// 			connection.query(sql, function(err, rows) {

// 				if (err != null) {
// 					res.end("Query error:" + err);
// 				} else {

// 					if (!rows.affectedRows) {
// 						res.status(400);
// 						rows.error = 'No rows matched';
// 					} else {
// 						res.status(204);
// 					}	

// 					// send the result
// 					res.send(rows);
// 				}
// 			});		

// 			// close connection
// 			connection.release();
// 		});
// 	}


// }
