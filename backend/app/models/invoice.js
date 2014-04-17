var Model = require(__dirname + '/../utils/model');
var utils = require(__dirname + '/../utils/utils');


var invoice = new Model();

invoice.tableName = 'invoices';

// mapping from model attribute names to query column names
invoice.attributes = {
	'invoiceId': {
		column: 'i.invoice_id',
		type: 'number',
		safe: [ 'update' ]},
	'clientId': {
		column: 'i.client_id',
		type: 'number',
		safe: [ 'add', 'update' ]},
	'invoiceYear': {
		column: 'i.invoice_year',
		type: 'number',
		safe: [ 'add', 'update' ]},
	'invoiceNumber': {
		column: 'i.invoice_number',
		type: 'number',
		safe: [ 'add', 'update' ]},
	'cancelled': {
		column: 'i.cancelled',
		type: 'boolean',
		safe: [ 'add', 'update' ]},
	'sumNet': {
		column: 'i.sum_net',
		type: 'number',
		safe: [ 'add', 'update' ]},
	'sumGross': {
		column: 'i.sum_gross',
		type: 'number',
		safe: [ 'add', 'update' ]},
	'invoiceDate': {
		column: 'i.invoice_date',
		type: 'date',
		safe: [ 'add', 'update' ]},
	'paid': {
		column: 'i.paid',
		type: 'boolean',
		safe: [ 'add', 'update' ]},
	'paidOn': {
		column: 'i.paid_on',
		type: 'date',
		safe: [ 'add', 'update' ]},
	'comment': {
		column: 'i.comment',
		type: 'string',
		safe: [ 'add', 'update' ]},
	'cdate': {
		column: 'i.cdate',
		type: 'datetime',
		default: '@NOW'},
	'clientName': {
		column: 'c.client_name',
		type: 'string' },
	'clientAbbreviation': {
		column: 'c.client_abbreviation',
		type: 'string' }
};

invoice.limit = 10;

invoice.orderBy = 'invoiceNumber DESC';

invoice.keyCol = 'invoice_id';
invoice.select = "SELECT "
	+ "i.invoice_id, i.client_id, i.invoice_year, i.invoice_number, i.cancelled, i.sum_net, i.sum_gross, "
	+ "date_format(i.invoice_date, '%Y%m%d') as invoice_date, i.paid, "
	+ "date_format(i.paid_on, '%Y%m%d') as paid_on, i.comment, i.cdate, "
	+ "c.name as client_name, c.abbreviation as client_abbreviation "
	+ " from invoices i"
	+ " left join clients c on c.client_id=i.client_id";

module.exports = invoice;
