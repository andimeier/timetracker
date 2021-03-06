/**
 * A class for a generic reporter, for retrieving statistical queries against the database.
 *
 * @class genericReport
 */
var utils = require(__dirname + '/utils');
var error = require(__dirname + '/error');

/**
 * Performs a database query, using the given SQL string as input, and returns
 * the retrieved rows.
 *
 * This provides a generic utility for "rapid report development". You don't have to
 * implement a separate module/function for every new report, but can simply
 * create the SQL statement and then use this "generic report" facility.
 *
 * The function executes the report, translates all database columns to the respective
 * JSON counterparts (changing case from snake case to camel case) and returns the
 * JSON result in the HTTP response object. Nothing else to do.
 *
 * Since this is a very simple class, parameter parsing and processing must be done
 * before (possibly changing the SQL statement).
 *
 * @method genericReport
 * @param req {Object} express' request object
 * @param res {Object} express' response object
 * @param sql {String} the SQL statement to be executed which generates the data for the report
 */
exports.genericReport = function(req, res, sql) {

	logger.verbose('---------------------------------');
	logger.verbose('[' +  (new Date()).toLocaleTimeString() + '] GET Request: ' + req);

	dbPool.getConnection(function(err, connection) {

		if (!err) {
			// connection established

			// query the database for some data 
			connection.query(sql, function(err, rows) {

				if (err != null) {
					res.send(400, error({
						errorCode: 1002,
						errorObj: err,
						message: 'Query error'
					}));
				} else {

					var result = utils.changeKeysToCamelCase(rows);
					if (result instanceof Error) {
						logger.error('Error at mapping keys to JSON keys: ' + result);
					}
					res.send(200, result);
				}
			});


			// close connection
			connection.release();

		}  else {
			// an error has occurred during connection

			logger.error('DB connection error: ' + JSON.stringify(err, null, 2));

			/* send error message back to client (in minimized form because
			the error details on failing to establish a connection is not 
			intended to be delivered to the client
			*/
			res.send(400, error({
				errorCode: 1004,
				message: 'Error trying to connect to database. See the server\'s logfile for details.'
			}));
		}
	});
}
