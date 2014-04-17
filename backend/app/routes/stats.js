/**
 * Routes for statistics.
 * @module stats
 * @type {*|Object}
 */
var report = require(__dirname + '/../utils/report');


/**
 * get record statistics: how many hours have been recorded on which record?
 */
exports.recordedHours = function(req, res) {

	report.genericReport(req, res, "select \
	p.project_id, \
	p.name as project_name, \
	p.estimated_hours, \
	date(min(r.starttime)) as first_recorded_date, \
	date(max(r.endtime)) as last_recorded_date, \
	sum((UNIX_TIMESTAMP(endtime) - UNIX_TIMESTAMP(starttime))/3600) as records_hours, \
	count(*) as number_of_records \
from records r \
join projects p on p.project_id=r.project_id \
where p.active \
group by \
	p.project_id, \
	p.name, \
	p.estimated_hours \
order by p.name");

}
