/**
 * Created by azimmer on 28.03.14.
 */
// set test environment (to switch logging behavior)
process.env.NODE_ENV = 'test';

var request = require('supertest'),
	assert = require('assert'),
	expect = require('chai').expect,
	app = require('../app/server.js').app,
	credentials = require('./credentials.json');

var Session = require('supertest-session')({
	app: require('../app/server.js').app
});

/**
 * retrieve a specific invoice from database and provide it via callback
 * @param invoiceId the ID of the invoice to be retrieved
 * @param callback a callback function taking 2 parameters:
 *   data ... the retrieved invoice
 *   err ... error object (in case of an error)
 */
var retrieveInvoice = function (invoiceId, callback) {
	request(app)
		.get('/invoices/' + invoiceId)
		.end(function (err, res) {
			callback(err ? null : res.body, err);
		});

}

describe('Invoice API', function () {

	before(function () {
		this.sess = new Session();
	});

	after(function () {
		this.sess.destroy();
	});

	// the first invoice when doing a 'select * from invoices order by invoice_number desc'
	var firstInv = {
		invoiceId: 1611,
		clientId: 18,
		comment: 'Comment for invoice nr. 211'
	};

	var testInv1 = {
		invoiceId: 1594,
		clientId: 18,
		comment: 'Comment for invoice nr. 190',
		sumNet: 6000
	};

	var testUpdate = {
		invoiceId: 1595,
		clientId: 6,
		comment: 'Updated!',
		invoiceDate: '20140409'
	};

	var testDelete = {
		invoiceId: 1610
	};

	describe('GET /invoices', function () {
		it('should login', function (done) {
			this.sess.post('/login')
				.send({
					user: credentials.login.username,
					pass: credentials.login.password
				})
				.expect(200)
				.end(done);
		});

		it('should return an array of invoices', function (done) {
			this.sess.get('/invoices')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});

		it('should return the correct invoices', function (done) {
			this.sess.get('/invoices')
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var data = res.body;
					expect(data).to.be.an('array');

					// 10 invoices returned
					expect(data).to.have.length(10);

					// investigate the first invoice
					var inv1 = data[0];
					expect(inv1).to.be.an('object');
					expect(inv1.invoiceId).to.be.equal(firstInv.invoiceId);
					expect(inv1.comment).to.be.equal(firstInv.comment);

					done();
				});
		});

		it('should return the expected fields', function (done) {
			this.sess.get('/invoices')
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var data = res.body;
					expect(data).to.be.an('array');

					// 10 invoices returned
					expect(data).to.be.have.length(10);

					// investigate the first invoice
					var inv1 = data[0];
					expect(inv1).to.contain.keys(
						'invoiceId',
						'clientId',
						'invoiceYear',
						'invoiceNumber',
						'cancelled',
						'sumNet',
						'sumGross',
						'invoiceDate',
						'paid',
						'paidOn',
						'comment',
						'cdate',
						'clientName',
						'clientAbbreviation'
					);
					done();
				});
		});

		it('should limit the output fields when using parameter fields=... with findAll()', function (done) {
			this.sess.get('/invoices?fields=invoiceId,comment')
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var data = res.body;
					expect(data).to.be.an('array');

					// investigate the first invoice
					var inv1 = data[0];
					expect(inv1).to.have.keys(
						'invoiceId',
						'comment'
					);
					done();
				});
		});

		it('should return a specific invoice when doing a findById(invoiceId)', function (done) {
			request(app)
			this.sess.get('/invoices/ ' + testInv1.invoiceId)
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var data = res.body;
					expect(data).to.be.an('array');

					// only 1 invoice returned
					expect(data).to.have.length(1);


					// investigate the first invoice
					var inv1 = data[0];
					expect(inv1).to.be.an('object');
					expect(inv1.comment).to.be.equal(testInv1.comment);
					expect(inv1.clientId).to.be.equal(testInv1.clientId);
					expect(inv1.sumNet).to.be.equal(testInv1.sumNet);
					done();
				});
		});
	});

	describe.skip('POST /invoices', function () {
		it('should reject request because we are not logged in', function (done) {
			request(app)
				.post('/invoices')
				.send({
					clientId: 6,
					invoiceYear: 2014,
					invoiceDate: '20140410',
					comment: 'Sample test comment (rejected - not logged in)'
				})
				.expect(401, done);
		});

		it('should accept a new (added) invoice', function (done) {

			var testNewInv = {
				clientId: 6,
				invoiceYear: 2014,
				invoiceDate: '20140410',
				comment: 'Sample test comment, new invoices'
			};

			this.sess.post('/invoices')
				.send(testNewInv)
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var data = res.body;

					// no error on saving
					expect(data).to.not.contain.key('error');

					logger.verbose('Posted data', { data: data });

					// invoiceId returned
					expect(data.insertId).to.be.a('number');
					var invoiceId = data.insertId;

					// retrieve invoice and check if saved correctly
					retrieveInvoice(invoiceId, function (data, err) {

						expect(err).to.be.null;

						// only 1 invoice returned
						expect(data).to.have.length(1);

						// investigate the first invoice
						var inv = data[0];
						logger.verbose('Retrieved invoice []' + invoiceId, { data: inv });
						logger.verbose('Comparing start time', { invoice: inv.starttime, testInvoice: testInv.starttime });
						expect(inv).to.be.an('object');
						expect(inv.clientId).to.be.equal(testNewInv.clientId);
						expect(inv.invoiceDate).to.be.equal(testNewInv.invoiceDate);
						expect(inv.invoiceYear).to.be.equal(testNewInv.invoiceYear);
						expect(inv.comment).to.be.equal(testNewInv.comment);
					});

					done();
				});
		});

		it('should update a invoice', function (done) {

			this.sess.post('/invoices/' + testUpdate.invoiceId)
				.send(testUpdate)
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var data = res.body;

					// no error on saving
					expect(data).to.not.contain.key('error');

					logger.verbose('Posted data', { data: data });

					expect(data.affectedRows).to.be.equal(1);
					expect(data.changedRows).to.be.equal(1);

					// retrieve invoice and check if saved correctly
					retrieveInvoice(testUpdate.invoiceId, function (data, err) {

						expect(err).to.be.null;

						// only 1 invoice returned
						expect(data).to.have.length(1);

						// investigate the first (and only) invoice
						var inv = data[0];
						logger.verbose('Retrieved invoice []' + testUpdate.invoiceId, { data: inv });
						expect(inv).to.be.an('object');
						expect(inv.comment).to.be.equal(testUpdate.comment);
						expect(inv.clientId).to.be.equal(testUpdate.clientId);
						expect(inv.invoiceDate).to.be.equal(testUpdate.invoiceDate);
					});

					done();
				});
		});

		it('should delete a invoice', function (done) {

			this.sess.del('/invoices/' + testDelete.invoiceId)
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var data = res.body;

					// no error on saving
					expect(data).to.not.contain.key('error');

					expect(data.affectedRows).to.be.equal(1);

					// retrieve invoice and check if saved correctly
					retrieveInvoice(testDelete.invoiceId, function (data, err) {

						expect(err).to.be.null;

						// no invoices returned
						expect(data).to.be.an('array');
						expect(data).to.have.length(0);
					});

					done();
				});
		});

		it('should logout', function (done) {
			this.sess.get('/logout')
				.expect(200, done);
		});

		it('should not be possible to read invoices because we are already logged out', function (done) {
			request(app)
				.get('/invoices')
				.expect(401, done);
		});

		it('should reject add request because we are already logged out', function (done) {

			var testInv = {
				clientId: 1,
				invoiceYear: 2014,
				invoiceDate: '20140410',
				comment: 'Sample test comment (should fail)'
			};

			request(app)
				.post('/invoices')
				.send(testInv)
				.expect(401, done);
		});

		it('should reject update request because we are already logged out', function (done) {

			request(app)
				.post('/invoices/' + testUpdate.invoiceId)
				.send(testUpdate)
				.expect(401, done);
		});

		it('should reject delete request because we are already logged out', function (done) {

			var testInv = {
				invoiceId: 3581
			};

			request(app)
				.del('/invoices/' + testInv.invoiceId)
				.send(testInv)
				.expect(401, done);
		});

	});
});