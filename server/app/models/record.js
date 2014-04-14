var Model = require(__dirname + '/../utils/model'),
	utils = require(__dirname + '/../utils/utils'),
	moment = require('moment');


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
record.attributes = {
	'clientId': {
		column: 'c.client_id',
		type: 'number',
		safe: [ 'add', 'update' ] },
	'clientName': {
		column: 'c.name',
		type: 'string' },
	'clientAbbreviation,': {
		column: 'c.abbreviation',
		type: 'string' },
	'projectName': {
		column: 'p.name',
		type: 'string' },
	'projectAbbreviation': {
		column: 'p.abbreviation',
		type: 'string' },
	'recordId': {
		column: 'r.record_id',
		type: 'number',
		safe: [ 'update' ] },
	'starttime': {
		column: 'r.starttime',
		type: 'datetime',
		safe: [ 'add', 'update' ],
		required: true },
	'endtime': {
		column: 'r.endtime',
		type: 'datetime',
		safe: [ 'add', 'update' ] },
	'pause': {
		column: 'r.pause',
		safe: [ 'add', 'update' ] },
	'projectId': {
		column: 'r.project_id',
		type: 'number',
		safe: [ 'add', 'update' ] },
	'description': {
		column: 'r.description',
		type: 'string',
		safe: [ 'add', 'update' ] },
	'userId': {
		column: 'r.user_id',
		type: 'number',
		default: '@USER_ID' },
	'invoiceId': {
		column: 'r.invoice_id',
		type: 'number',
		safe: [ 'add', 'update' ] },
	'cdate': {
		column: 'r.cdate',
		type: 'datetime',
		default: '@NOW' },
	'mdate': {
		column: 'r.mdate',
		type: 'datetime',
		default: '@NOW' }
};

record.orderBy = 'starttime DESC';

/**
 * Model-specific API parameters
 * @method setCriteria
 * @param params will be passed by Model and contains request.query.params
 * @param criteria {Object{} a Criteria object which will be passed by Model and
 *   must be used to add model-specific criteria
 */
record.setCriteria = function(params, criteria) {
	var m = params.month;
	if (m) {
		if (m.length == 6 && m >= 190000 && m <= 230000) {
			var start = m + '01';
			// month in new Date(year, month) must be beginning with 0, so if we
			// don't substract  1 from the month, it means automatically the next
			// month - which is exactly what we need:
			var d = new Date(m.substr(0, 4), parseInt(m.substr(4, 2)));
			var end = moment(d).format('YYYYMMDD');
			criteria.add('starttime').between(start, end);
		} else {
			logger.error('Illegal parameter format for parameter records/month: [%s], should be YYYYMM', m);
		}
	}
};
module.exports = record;
