var Model = require(__dirname + '/../utils/model');
var utils = require(__dirname + '/../utils/utils');


var invoice = new Model();

// mapping from model attribute names to query column names
invoice.attrs = {
	'invoiceId': 'i.invoice_id',
	'clientId': 'i.client_id',
	'invoiceYear': 'i.invoice_year',
	'invoiceNumber': 'i.invoice_number',
	'cancelled': 'i.cancelled',
	'sumNet': 'i.sum_net',
	'sumGross': 'i.sum_gross',
	'invoiceDate': 'i.invoice_date',
	'paid': 'i.paid',
	'paidOn': 'i.paid_on',
	'comment': 'i.comment',
	'cdate': 'i.cdate',
	'clientName': 'c.client_name',
	'clientAbbreviation': 'c.client_abbreviation'
};

invoice.limit = 10;

invoice.orderBy = 'invoiceNumber DESC';

invoice.keyCol = 'invoice_id';
invoice.select = "SELECT "
	+ "i.invoice_id, i.client_id, i.invoice_year, i.invoice_number, i.cancelled, i.sum_net, i.sum_gross, "
	+ "date_format(i.invoice_date, '%Y%m%dT%H%i%S') as invoice_date, i.paid, "
	+ "date_format(i.paid_on, '%Y%m%dT%H%i%S') as paid_on, i.comment, i.cdate, "
	+ "c.name as client_name, c.abbreviation as client_abbreviation "
	+ " from invoices i"
	+ " left join clients c on c.client_id=i.client_id";

module.exports = invoice;
