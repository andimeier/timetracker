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
record.attributes = {
	'clientId': {
		column: 'c.client_id',
		safe: [ 'add', 'update' ] },
	'clientName': {
		column: 'c.name' },
	'clientAbbreviation,': {
		column: 'c.abbreviation' },
	'projectName': {
		column: 'p.name' },
	'projectAbbreviation': {
		column: 'p.abbreviation' },
	'recordId': {
		column: 'r.record_id',
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
		safe: [ 'add', 'update' ] },
	'description': {
		column: 'r.description',
		safe: [ 'add', 'update' ] },
	'userId': {
		column: 'r.user_id',
		default: '@USER_ID' },
	'invoiceId': {
		column: 'r.invoice_id',
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
	'recordId': [ 'update' ],
	'starttime': [ 'add', 'update' ],
	'endtime': [ 'add', 'update' ],
	'pause': [ 'add', 'update' ],
	'projectId': [ 'add', 'update' ],
	'description': [ 'add', 'update' ],
	'invoiceId': [ 'add', 'update' ]
};

record.orderBy = 'starttime DESC';

module.exports = record;
