var Model = require(__dirname + '/../utils/model');
var utils = require(__dirname + '/../utils/utils');


var record = new Model();

record.keyCol = 'record_id';
record.select = "SELECT " +
	"c.client_id, c.name as client_name, c.abbreviation as client_abbreviation, " +
	"p.name as project_name, p.abbreviation as project_abbreviation, " +
	"r.record_id, date_format(r.starttime, '%Y%m%dT%H%i%S') as starttime, date_format(r.endtime, '%Y%m%dT%H%i%S') as endtime, " +
	"r.pause, r.project_id, r.description, r.user_id, r.invoice_id, " +
	"date_format(r.cdate, '%Y%m%dT%H%i%S') as cdate, date_format(r.mdate, '%Y%m%dT%H%i%S') as mdate "
	+ " from records r "
	+ " left join projects p on p.project_id=r.project_id "
	+ " left join clients c on c.client_id=p.client_id";


// mapping from model attribute names to query column names
record.attrs = {
	'clientId': 'c.client_id',
	'clientName': 'c.name',
	'clientAbbreviation,': 'c.abbreviation',
	'projectName': 'p.name',
	'projectAbbreviation': 'p.abbreviation',
	'recordId': 'r.record_id',
	'starttime': 'r.starttime',
	'endtime': 'r.endtime',
	'pause': 'r.pause',
	'projectId': 'r.project_id',
	'description': 'r.description',
	'userId': 'r.user_id',
	'invoiceId': 'r.invoice_id',
	'cdate': 'r.cdate',
	'mdate': 'r.mdate'
};

record.orderBy = 'starttime DESC';

module.exports = record;
