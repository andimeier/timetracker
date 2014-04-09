var Model = require(__dirname + '/../utils/model');
var utils = require(__dirname + '/../utils/utils');


var record = new Model();

record.keyCol = 'record_id';
record.select = "SELECT " +
  "c.client_id, c.name as client_name, c.abbreviation as client_abbreviation, " +
  "p.project_id, p.name as project_name, p.abbreviation as project_abbreviation, " +
	"r.record_id, date_format(r.starttime, '%Y%m%dT%H%i%S') as starttime, date_format(r.endtime, '%Y%m%dT%H%i%S') as endtime, " +
	"r.project_id, r.description, r.user_id, r.invoice_id, " +
	"date_format(r.cdate, '%Y%m%dT%H%i%S') as cdate, date_format(r.mdate, '%Y%m%dT%H%i%S') as mdate "
				+ " from records r "
				+ " left join projects p on p.project_id=r.project_id "
				+ " left join clients c on c.client_id=p.client_id";


module.exports = record;
