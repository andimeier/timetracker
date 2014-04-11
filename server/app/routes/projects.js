/**
 * CRUD Routes for projects.
 * @module projects
 * @type {*|Object}
 */
var utils = require(__dirname + '/../utils/utils');
var error = require(__dirname + '/../utils/error');
var project = require(__dirname + '/../models/project');

var userId = 10; //@TODO REMOVE ME!!


exports.findById = function(req, res) {

  project.findById(req.params.id, userId, function(data, err) {
    utils.sendResult(res, data, err);
  });
};

/**
 * Called with /projects
 * Retrieves all specified projects.
 * 
 * REST parameters (in query string):
 *   - fields ... specify list of fields to be delivered. All other fields are ignored. If unknown fields
 *       are specified here, they will be silently ignored. The list of fields must be comma-separated.
 *   - set ... specify set of projects to be returned, can be one of the following values:
 *       all ... all projects in the database
 *       active ... only active projects (with attribute "active")
 *   - add ... add a specific record into the result set, the value of the parameter is the
 *       project_id of the record to be added to the result set. This record will be
 *       included in the result set in any case, regardless of the other query parameters.
 */
exports.findAll = function(req, res) {

	logger.verbose('---------------------------------');
	logger.verbose('[' +  (new Date()).toLocaleTimeString() + '] Query (find all) called...');
	logger.verbose('  Query parameters: ' + JSON.stringify(req.query, undefined, 2));

	// parse parameters
	// ----------------

	var constraints = [ '1=1'], // find constraints
		include, // a project_id which should always be in the result set
		fields; // list of fields to be included in the output

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
		// parameter "add" will include a specific record into the result set,
		// regardless of other contraints
		include = parseInt(req.query.add);
	}

	if (req.query.fields) {
		fields = req.query.fields.split(',');
	}

	// let's fetch the data
	// --------------------

	// build query
	var where;
	if (include) {
		where = '((' + constraints.join(' and ') + ') or project_id=' + include + ')';
	} else {
		where = '' + constraints.join(' and ');
	}
	var sql = "SELECT p.project_id, p.name, p.abbreviation, p.active " 
				+ " from projects p where " + where + " order by p.name";
	logger.verbose('sql = [' + sql + ']');

	dbPool.getConnection(function(err, connection) {

		// Query the database to some data 
		connection.query(sql, function(err, rows) {
			logger.verbose('   ... got answer from DB server');

			if (err != null) {
				res.send(404, "Query error:" + err);
			} else {

				rows = utils.changeKeysToCamelCase(rows);
				if (fields) {
					rows = utils.filterProperties(rows, fields);
				}
				res.send(200, rows);
			}
		});

		// close connection
		connection.release();
	});
};
