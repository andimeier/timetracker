var utils = require(__dirname + '/utils');
var error = require(__dirname + '/error');


exports.genericReport = function(req, res, sql) {

	logger.log('---------------------------------');
	logger.log('[' +  (new Date()).toLocaleTimeString() + '] GET Request: ' + req);

	dbPool.getConnection(function(err, connection) {

		if (!err) {
			// connection established

			// query the database for some data 
			connection.query(sql, function(err, rows) {

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

		}  else {
			// an error has occurred during connection

			console.error('DB connection error: ' + JSON.stringify(err, null, 2));

			/* send error message back to client (in minimized form because
			the error details on failing to establish a connection is not 
			intended to be delivered to the client
			*/
			res.send(400, error.error({
				errorCode: 1004,
				message: 'Error trying to connect to database. See the server\'s logfile for details.'
			}));
		}
	});
}
