/**
 * Created by azimmer on 28.03.14.
 */
// set test environment (to switch logging behavior)
process.env.NODE_ENV = 'test';

var app = require('../app/server.js').app,
	Model = require('../app/utils/model'),
	expect = require('chai').expect;


var model = new Model();

// mapping from model attribute names to query column names
model.attributes = {
	'invoiceId': {
		column: 'i.invoice_id',
		safe: [ 'update' ]},
	'clientId': {
		column: 'i.client_id',
		safe: [ 'add', 'update' ]},
	'invoiceYear': {
		column: 'i.invoice_year',
		safe: [ 'add', 'update' ]},
	'invoiceDate': {
		column: 'i.invoice_date',
		safe: [ 'add', 'update' ]}
};

model.limit = 10;

model.orderBy = 'invoiceDate';

model.keyCol = 'invoice_id';
model.select = "SELECT "
	+ "i.invoice_id, i.client_id, i.invoice_year "
	+ " from invoices i";

describe('Model object', function () {

	it('should parse the orderBy string correctly', function (done) {

		var sort;

		this.orderBy = 'clientId';
		sort = model.buildOrderByString('clientId');
		expect(sort).to.be.equal('ORDER BY i.client_id');

		sort = model.buildOrderByString('   clientId ');
		expect(sort).to.be.equal('ORDER BY i.client_id');

		sort = model.buildOrderByString('invoiceId');
		expect(sort).to.be.equal('ORDER BY i.invoice_id');

		sort = model.buildOrderByString('invoiceId Asc');
		expect(sort).to.be.equal('ORDER BY i.invoice_id ASC');

		sort = model.buildOrderByString('invoiceId DESc');
		expect(sort).to.be.equal('ORDER BY i.invoice_id DESC');

		sort = model.buildOrderByString('invoiceId DESc,  invoiceYear DESC');
		expect(sort).to.be.equal('ORDER BY i.invoice_id DESC, i.invoice_year DESC');

		sort = model.buildOrderByString('   invoiceId DESc,  invoiceYear  ');
		expect(sort).to.be.equal('ORDER BY i.invoice_id DESC, i.invoice_year');

		sort = model.buildOrderByString('   invoiceId DESc,  dummy ');
		expect(sort).to.be.equal('ORDER BY i.invoice_id DESC'); // illegal field is ignored

		sort = model.buildOrderByString('   invoiceXXXXId DESc,  dummy ');
		expect(sort).to.be.equal(''); // all illegal fields are ignored

		done();
	});

	it('should map abbreviated parameter names correctly', function (done) {

		var p = { n: 10, p: 3 };
		model.mapParams(p);
		expect(p).to.have.keys(['limit', 'page']);
		expect(p.limit).to.be.equal(10);
		expect(p.page).to.be.equal(3);
		done();
	});

	it('should format a date value correctly', function (done) {
		var result;

		var result = model.formatDate('20140301T180103');
		expect(result).to.be.equal('2014-03-01 18:01:03');

		result = model.formatDate('20140301T1802');
		expect(result).to.be.equal('2014-03-01 18:02:00');

		result = model.formatDate('20140301');
		expect(result).to.be.equal('2014-03-01 00:00:00');

		result = model.formatDate('20140301T08');
		expect(result).to.be.equal('2014-03-01 08:00:00');

		result = model.formatDate('20140301T0804');
		expect(result).to.be.equal('2014-03-01 08:04:00');

		done();
	});

	it('should format and quote the object attributes correctly', function (done) {
		var result;

		var model = new Model();
		model.attributes = {
			'projectId': {
				column: 'p.project_id',
				type: 'number' },
			'name': {
				column: 'p.name',
				type: 'string' },
			'abbreviation': {
				column: 'p.abbreviation',
				type: 'string' },
			'startdate': {
				column: 'p.startdate',
				type: 'datetime' },
			'active': {
				column: 'p.active',
				type: 'boolean' },
			'inactive': {
				column: 'p.inactive',
				type: 'boolean' }
		};

		var obj = {
			projectId: 13,
			name: 'Project name',
			abbreviation: 'ProjName',
			startdate: '20140103T0913',
			active: true,
			inactive: false
		};

		model.formatFieldValues(obj);

		expect(obj.projectId).to.be.a('Number').and.be.equal(13);
		expect(obj.name).to.be.a('String').and.be.equal("'Project name'");
		expect(obj.abbreviation).to.be.a('String').and.be.equal("'ProjName'");
		expect(obj.startdate).to.be.a('String').and.be.equal("'2014-01-03 09:13:00'");
		expect(obj.active).to.be.a('Number').and.be.equal(1);
		expect(obj.inactive).to.be.a('Number').and.be.equal(0);
		done();
	});
});