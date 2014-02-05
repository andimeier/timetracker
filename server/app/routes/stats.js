var utils = require(__dirname + '/../utils');
var error = require(__dirname + '/../error');


/**
 * get project statistics: how many hours have been recorded on which project?
 */
exports.recordedHours = function(req, res) {

	console.log('---------------------------------');
	console.log('[' +  (new Date()).toLocaleTimeString() + '] GET Request: ' + req);

	dbPool.getConnection(function(err, connection) {

		// query the database to some data 
		connection.query("select \
	p.project_id, \
	p.name as project_name, \
	date(min(r.starttime)) as first_recorded_date, \
	date(max(r.endtime)) as last_recorded_date, \
	sum((UNIX_TIMESTAMP(endtime) - UNIX_TIMESTAMP(starttime))/3600) as records_hours, \
	count(*) as number_of_records \
from records r \
join projects p on p.project_id=r.project_id \
where p.active \
group by \
	p.project_id, \
	p.name \
order by p.name", function(err, rows) {


		// connection.query("select * from projects p order by p.name", function(err, rows) {
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
