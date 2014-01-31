var mysql = require('mysql');

var dbConfig = require(__dirname + '/../config/db_config.json');
var utils = require(__dirname + '/../utils');

// MySql connection data
var pool = mysql.createPool({
	host     : dbConfig.host,
	user     : dbConfig.user,
	password : dbConfig.password,
	database : dbConfig.database
});


exports.findById = function(req, res) {

	console.log('---------------------------------');
	console.log('[' +  (new Date()).toLocaleTimeString() + '] GET Request: ' + req);

	pool.getConnection(function(err, connection) {

		// query the database to some data 
		connection.query("SELECT p.project_id, p.name, p.abbreviation, p.active "
				+ " from projects p where project_id=" + req.params.id, function(err, rows) {

			if (err != null) {
				res.send(400, error.error({
					errorCode: 1002,
					errorObj: err,
					message: 'Query error'
				}));
			} else {

				var result = utils.changeKeysToCamelCase(rows);
				if (result instanceof Error) {
					console.error('Error at mapping keys to JSON keys: ' + result);
				}
				res.send(200, result);
			}
		});

		// close connection
		connection.release();
	});
};

/**
 * Called with /projects
 * Retrieves all specified projects.
 * 
 * REST parameters (in query string):
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
	console.log('  Query parameters: ' + JSON.stringify(req.query, undefined, 2));

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
	}

	// build query
	var where;
	if (include) {
		where = '((' + constraints.join(' and ') + ') or project_id=' + include + ')';
	} else {
		where = '' + constraints.join(' and ');
	}
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
				var result = utils.changeKeysToCamelCase(rows);
				if (result instanceof Error) {
					console.error('Error at mapping keys to JSON keys: ' + result);
				}
				res.send(200, result);
			}
		});

		// close connection
		connection.release();
	});
};
