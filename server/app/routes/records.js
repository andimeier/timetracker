var utils = require(__dirname + '/../utils');
var error = require(__dirname + '/../error');

/*
Attributes sent over the API in request bodies being accepted for 
writing to the database.
Any attributes (properties) of the objects sent in a request body
over the API during POST/PUT/DELETE operations which are not listed
here will be ignored.
The value in this list describes in which REST functions the 
corresponding attributes are valid. For example, a recordId is valid
(and necessary) in an 'update' operation, but it not legal in an
'add' operation under normal circumstances, because the recordId 
should  be assigned by the database server in this case.
Nevertheless, other attributes can be set by the REST service itself
(e.g. cdate, userId), but they are silently ignored when coming over
the API form the outside world
*/
var acceptedPropertiesApi = {
	'recordId'   : [ 'update' ],
	'starttime'  : [ 'add', 'update' ],
	'endtime'    : [ 'add', 'update' ],
	'pause'      : [ 'add', 'update' ],
	'projectId'  : [ 'add', 'update' ],
	'description': [ 'add', 'update' ],
	'invoiceId'  : [ 'add', 'update' ]
};

var userId = 10; //@TODO: remove!!!! replace with session user id

// default values for parameters not specified via REST API
var defaultParams = {
	limit: 10, // number of records delivered at once
	page: 0 // deliver first page of result set
}


/*
 * Formats a JSON date string for being used in an SQL expression.
 * @return null if input is null or undefined, the datetime expressionin SQL format otherwise
 */
var formatDate = function(input) {
	// parse a date in yyyy-mm-dd formatDate

	if (!input) {
		return null;
	}

	console.log('called formatDate with [' + input + ']');
	var components = input.split(/[T ]/, 2);

	// get date portion
	var date = components[0];
	console.log(' --- extracted: date_part = [' + date + ']');

	// split time
	var time_parts = components[1].split(':', 3);		

	var r = date + ' ' + time_parts.splice(0,2).join(':'); 
	console.log(' --- will return: ' + r);
	return r;
}

exports.findById = function(req, res) {

	console.log('---------------------------------');
	console.log('[' +  (new Date()).toLocaleTimeString() + '] GET Request: ' + req);
	
	var recordId = req.params.id;

	dbPool.getConnection(function(err, connection) {

		// query the database to some data 
		connection.query("SELECT c.client_id, c.name as client_name, c.abbreviation as client_abbreviation, p.project_id, p.name as project_name, p.abbreviation as project_abbreviation, r.* "
				+ " from records r "
				+ " join projects p on p.project_id=r.project_id "
				+ " join clients c on c.client_id=p.client_id "
				+ " where record_id=" + recordId, function(err, rows) {

			if (err != null) {
				res.send(400, error.error({
					errorCode: 1002,
					errorObj: err,
					message: 'Query error'
				}));
			} else {
				res.send(200, utils.changeKeysToCamelCase(rows));
			}
		});

		// close connection
		connection.release();
	});
};

/**
 * Called with /records
 * Retrieves all specified records.
 * 
 * REST parameters (in query string):
 *   - fields ... specify list of fields to be delivered. All other fields are ignored. If unknown fields
 *       are specified here, they will be silently ignored. The list of fields must be comma-separated.
 *   - n ... specify number of records to be delivered at a maximum, of not specified, theconfigured 
 *       default value will be used.
 *   - p ... number of page to be delivered. The size of one page can be set with the parameter 
 *      'limit', defaulting to the default value otherwise. The first page is page 0.
 */
exports.findAll = function(req, res) {

	console.log('---------------------------------');
	console.log('[' +  (new Date()).toLocaleTimeString() + '] Query (find all) called...');
	console.log('  All Query parameters: ' + JSON.stringify(req.query));

	// parse parameters
	// ----------------
	var params = {};

	// start with default values
	for (key in defaultParams) {
		params[key] = defaultParams[key];
	}

	if (req.query.fields) {
		params.fields = req.query.fields.split(',');
		delete req.query.fields;
	}

	if (req.query.n) {
		console.log('Parameter n given: [' + req.query.n + ']');
		params.limit = parseInt(req.query.n);
		delete req.query.limit;
	}

	if (req.query.p) {
		console.log('Parameter p given: [' + req.query.p + ']');
		params.page = parseInt(req.query.p);
		delete req.query.page;
	}

	console.log('Params are now: ' + JSON.stringify(params, null, 2));

	if (req.query) {
		// there are query parameters left which could not be processed
		console.error('Unknown query parameter(s) used: ' + JSON.stringify(req.query, null, 2));
	}

	// let's fetch the data
	// --------------------

	dbPool.getConnection(function(err, connection) {

		// Query the database to some data 
		//connection.query("SELECT * from records limit 10where starttime >= date_sub(current_date, interval 30 day) order by starttime desc limit 10", function(err, rows) {
		console.log('2Params are now: ' + JSON.stringify(params, null, 2));
		var sql = "SELECT c.client_id, c.name as client_name, c.abbreviation as client_abbreviation, p.project_id, p.name as project_name, p.abbreviation as project_abbreviation, "
				+ "r.record_id, r.starttime, r.endtime, r.pause, r.description, r.user_id, r.invoice_id "
				+ " from records r "
				+ " left join projects p on p.project_id=r.project_id "
				+ " left join clients c on c.client_id=p.client_id "
				+ " order by r.starttime desc "
				+ " limit " + params.limit + ' offset ' + params.page * (params.limit);
		console.log('SQL string: ' + sql);
		connection.query(sql, function(err, rows) {
			console.log('   ... got answer from DB server');

			if (err != null) {
				res.send(404, "Query error:" + err);
			} else {

				rows = utils.changeKeysToCamelCase(rows);
				if (params.fields) {
					rows = utils.filterProperties(rows, params.fields);
				}

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

	var obj = req.body;

	// remove unacceptable fields
	for (key in obj) {
		if (!acceptedPropertiesApi[key] || acceptedPropertiesApi[key].indexOf('add') == -1) {
			console.log('Removed attribute [' + key + '] (illegal over API)');
			delete obj[key];
		}
	}

	// convert date fields
	[ 'starttime', 'endtime' ].forEach(function(field) {
		if (obj[field]) {
			obj[field] = formatDate(obj[field]);
		}
	});

	
	// set additional (calculated) attributes, these will not be escaped,
	// but used literally in the query string. The keys here are exactly
	// the database table column names, no changing of case will take place
	var calculatedAttributes = {
		cdate: "now()",
		mdate: "now()",
		user_id: userId
	};

	// begin input validation
	// ----------------------
	var ok = true; // optimistic assumption

	// check for mandatory fields
	if (!obj.starttime) {
		res.send(400, error.error({
			errorCode: 1003,
			message: 'Missing starttime parameter - starttime is mandatory'
		}));
		ok = false;
	}

	if (ok) {
		// input is ok, let's write to DB
		// ------------------------------
		dbPool.getConnection(function(err, connection) {


			// convert case of the column names into database syntax
			obj = utils.changeKeysToSnakeCase(obj);
			var dataFields = utils.getInsertLists(obj, global.mysql.escape);
			var calcFields = utils.getInsertLists(calculatedAttributes);
			var sql = 'INSERT into records('
				+ [dataFields['keys'], calcFields['keys']].join(',')
				+ ') select '
				+ [dataFields['values'], calcFields['values']].join(',');

			console.log("SQL = " + sql);
			connection.query(sql, function(err, rows) {

				if (err != null) {
					res.send(400, "Query error:" + err);
				} else {
					// Shows the result on console window
					res.send(201, {
						insertId: rows['insertId'],
						db: rows
					});
				}
			});

			// close connection
			connection.release();
		});
	}
}

exports.update = function(req, res) {

	console.log('---------------------------------');
	console.log('[' +  (new Date()).toLocaleTimeString() + '] update: ' + JSON.stringify(req.body));

	var obj = req.body;

	// remove unacceptable fields
	for (key in obj) {
		if (!acceptedPropertiesApi[key] || acceptedPropertiesApi[key].indexOf('update') == -1) {
			console.log('Removed attribute [' + key + '] (illegal over API)');
			delete obj[key];
		}
	}

	// convert date fields
	[ 'starttime', 'endtime' ].forEach(function(field) {
		if (obj[field]) {
			obj[field] = formatDate(obj[field]);
		}
	});

	
	// set additional (calculated) attributes, these will not be escaped,
	// but used literally in the query string. The keys here are exactly
	// the database table column names, no changing of case will take place
	var calculatedAttributes = {
		mdate: "now()",
		user_id: userId
	};

	// begin input validation
	// ----------------------
	var ok = true; // optimistic assumption

	var recordId = parseInt(req.params.id);
	if (!recordId) {
		res.send(400, error.error({
			errorCode: 1003,
			message: 'No ID passed in the API call'
		}));
		ok = false;
	}


	// check for mandatory fields
	if (!obj.starttime) {
		res.send(400, error.error({
			errorCode: 1003,
			message: 'Missing starttime parameter - starttime is mandatory'
		}));
		ok = false;
	}


	if (ok) {
		// input is ok, let's write to DB
		// ------------------------------
		dbPool.getConnection(function(err, connection) {

			// convert case of the column names into database syntax
			obj = utils.changeKeysToSnakeCase(obj);
			var dataFields = utils.getUpdateString(obj, global.mysql.escape);
			var calcFields = utils.getUpdateString(calculatedAttributes);
			var sql = 'UPDATE records set ' 
				+ [dataFields, calcFields].join(',') 
				+ ' where record_id=' + recordId;

			console.log("SQL = " + sql);
			connection.query(sql, function(err, rows) {

				if (err != null) {
					res.status(400);

					res.end("Query error:" + err);
					rows.error = 'Error at updating: ' + err.code;
					console.log('Error at updating: ' + err.code);
					res.send(error.error({
						errorCode: 1002,
						errorObj: rows,
						message: 'Error at updating row'
					}));
				} else {

					if (!rows.affectedRows) {
						res.status(400);
						res.send(error.error({
							errorCode: 1002,
							errorObj: rows,
							message: 'No rows matched'
						}));
					} else {
						res.status(200);
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

	var recordId = parseInt(req.params.id);
	if (!recordId) {
		res.send(400, error.error({
			errorCode: 1003,
			message: 'No ID passed in the API call'
		}));
		ok = false;
	}

	if (ok) {
		// input is ok, let's write to DB
		// ------------------------------
		dbPool.getConnection(function(err, connection) {
			// write to DB
			var sql = 'DELETE from records where record_id=' + recordId;
			console.log("SQL = " + sql);
			connection.query(sql, function(err, rows) {

				if (err != null) {
					res.end("Query error:" + err);
				} else {

					if (!rows.affectedRows) {
						res.status(400);
						res.send(error.error({
							errorCode: 1002,
							errorObj: rows,
							message: 'No rows matched'
						}));
					} else {
						res.status(200);
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
