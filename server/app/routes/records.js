var utils = require(__dirname + '/../utils/utils');
var error = require(__dirname + '/../utils/error');
var record = require(__dirname + '/../models/record');

var userId = 10; //@TODO: remove!!!! replace with session user id



/**
 * find a specific record by primary key. Called with /records/:id
 * @param req express request object
 * @param res express response object
 */
exports.findById = function(req, res) {
  record.findById(req.params.id, userId, function(data, err) {
    utils.sendResult(res, data, err);
  });
};


/**
 * Called with /records
 * Retrieves all specified records.
 * @see model.findAll for details on possible parameters
 * @param req express request object
 * @param res express response object
 */
exports.findAll = function(req, res) {
	record.findAll(req.query, userId, function(data, err) {
		utils.sendResult(res, data, err);
	});
};

exports.add = function(req, res) {
	record.add(req.body, userId, function(data, err) {
		utils.sendResult(res, data, err);
	});
};

exports.update = function(req, res) {
	record.update(req.params.id, req.body, userId, function(data, err) {
		utils.sendResult(res, data, err);
	});
};

exports.delete = function(req, res) {

	// Query the database to some data 
	logger.verbose('Delete a record', { data: req.body });

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
			logger.verbose("SQL = " + sql);
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
