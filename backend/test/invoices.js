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
 * Retrieve a specific invoice from database and provide it via callback.
 * This function will also check if there IS a record retrieved and
 * if ONLY ONE record is retrieved and there is no database error.
 * something goes wrong.
 * There are only 2 cases where this function will not assert an error:
 *   1. exactly one record is retrieved => this record will be passed to the callback
 *   2. no record is retrieved => 'null' will be passed to the callback
 * @param invoiceId the ID of the invoice to be retrieved
 * @param session {Object} session object to be used for authenticated access
 * @param callback a callback function taking 1 parameter:
 *   invoice ... the retrieved invoice object or null if not found
 */
var retrieveInvoice = function (invoiceId, session, callback) {
	session.post('/invoices/' + invoiceId)
		.expect(200)
		.end(function (err, res) {

			expect(err).to.be.null;

			var invoice = null;
			var result = res.body;

			console.log('------ check: ' + JSON.stringify(result, null, 2));

			// only 1 invoice returned
			expect(result).to.contain.key('info');

			var info = result.info;
			expect(info.rows).to.be.within(0, 1);

			if (info.rows == 0) {
				logger.verbose('Invoice [%s] was not found in database.', invoiceId);
			} else {
				expect(result.data).to.have.length(1);
				logger.verbose('Retrieved invoice []' + invoiceId, { data: result.data[0] });
				invoice = result.data[0];
			}
			// deliver the invoice object (or null)
			callback(invoice);
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
					var data = res.body.data;
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
					var data = res.body.data;
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
					var data = res.body.data;
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
					var data = res.body.data;
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

	describe('POST /invoices', function () {
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

		it('should login', function (done) {
			this.sess.post('/login')
				.send({
					user: credentials.login.username,
					pass: credentials.login.password
				})
				.expect(200)
				.end(done);
		});

		it.skip('should accept a new (added) invoice', function (done) {

			var testNewInv = {
				clientId: 6,
				invoiceYear: 2014,
				invoiceDate: '20140410',
				comment: 'Sample test comment, new invoice'
			};

			var self = this;
			this.sess.post('/invoices')
				.send(testNewInv)
				.expect(200)
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var result = res.body;

					// no error on saving
					console.log('result: ' + JSON.stringify(result));
					expect(result).to.contain.key('info').and.not.contain.key('error');

					logger.verbose('Posted data', { data: testNewInv });

					var info = result.info;
					console.log('----------- Received result', { result: result});
					logger.verbose('Received info', { info: info});

					// invoiceId returned
					var invoiceId = info.insertId;
					expect(invoiceId).to.be.a('number');

					// retrieve invoice and check if saved correctly
					retrieveInvoice(invoiceId, self.sess, function (inv) {

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

		it.skip('should update a invoice', function (done) {

			var self = this;
			console.log('testUpdate: ' + testUpdate);
			logger.verbose('testUpdate: ',  { testUpdate: testUpdate });
			this.sess.post('/invoices/' + testUpdate.invoiceId)
				.send(testUpdate)
				.expect(200)
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var result = res.body;

					// no error on saving
					expect(result).to.contain.key('info').and.not.contain.key('error');

					logger.verbose('Posted data', { data: testUpdate });

					var info = result.info;
					expect(info.affectedRows).to.be.equal(1);
					expect(info.changedRows).to.be.equal(1);

					// retrieve invoice and check if saved correctly
					retrieveInvoice(testUpdate.invoiceId, self.sess, function (inv) {

						expect(inv).to.be.an('object');
						expect(inv.comment).to.be.equal(testUpdate.comment);
						expect(inv.clientId).to.be.equal(testUpdate.clientId);
						expect(inv.invoiceDate).to.be.equal(testUpdate.invoiceDate);
					});

					done();
				});
		});

		it.skip('should delete a invoice', function (done) {

			var self = this;
			this.sess.del('/invoices/' + testDelete.invoiceId)
				.expect(200)
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var result = res.body;

					// no error on saving
					expect(result).to.contain.key('info').and.not.contain.key('error');

					var info = result.info;
					expect(info.affectedRows).to.be.equal(1);

					// retrieve invoice and check if saved correctly
					retrieveInvoice(testDelete.invoiceId, self.sess, function (inv) {

						// no invoices returned => invoices has been deleted
						expect(inv).to.be.null;
					});

					done();
				});
		});

		it('should logout', function (done) {
			this.sess.get('/logout')
				.expect(200, done);
		});

		it.skip('should not be possible to read invoices because we are already logged out', function (done) {
			logger.verbose('Logged out, let\'s see...');
			this.sess.get('/invoices/' + 3591)
				.expect(401, done);
		});

		it.skip('should reject add request because we are already logged out', function (done) {

			var testInv = {
				clientId: 1,
				invoiceYear: 2014,
				invoiceDate: '20140410',
				comment: 'Sample test comment (should fail)'
			};

			this.sess.post('/invoices')
				.send(testInv)
				.expect(401, done);
		});

		it.skip('should reject update request because we are already logged out', function (done) {

			this.sess.post('/invoices/' + testUpdate.invoiceId)
				.send(testUpdate)
				.expect(401, done);
		});

		it.skip('should reject delete request because we are already logged out', function (done) {

			var testInv = {
				invoiceId: 3581
			};

			this.sess.del('/invoices/' + testInv.invoiceId)
				.send(testInv)
				.expect(401, done);
		});

	});
});