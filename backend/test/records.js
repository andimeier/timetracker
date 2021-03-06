/**
 * Created by azimmer on 28.03.14.
 */
// set test environment (to switch logging behavior)
process.env.NODE_ENV = 'test';

var request = require('supertest'),
	assert = require('assert'),
	expect = require('chai').expect,
	app = require('../app/server.js').app,
	_ = require('lodash'),
	moment = require('moment'),
	credentials = require('./credentials.json'),
	dateUtils = require('../app/utils/dateUtils');

var Session = require('supertest-session')({ app: app });

/**
 * retrieve a specific record from database and provide it via callback
 * @param recordId the ID of the record to be retrieved
 * @param callback a callback function taking 2 parameters:
 *   data ... the retrieved record
 *   err ... error object (in case of an error)
 */
var retrieveRecord = function (recordId, callback) {
	request(app)
		.get('/records/' + recordId)
		.end(function (err, res) {
			callback(err ? null : res.body, err);
		});

}

describe('Record API', function () {

	before(function () {
		this.sess = new Session();
	});

	after(function () {
		this.sess.destroy();
	});

	// the first record when doing a 'select * from records order by starttime desc limit 1'
	var firstRec = {
		recordId: 3593,
		description: 'Newest record so far'
	};

	var testRec1 = {
		recordId: 3506,
		projectId: 149,
		description: 'Test-Eintrag mit gewissen Taetigkeiten am 04.10.2010'
	};

	var recsOnPage3 = [ 3590, 3589 ];

	var testUpdate = {
		recordId: 3591,
		description: 'Updated!',
		starttime: '20140409T163800'
	};

	var testDelete = {
		recordId: 3580
	};

	describe('GET /records', function () {
		it('should return an array of records', function (done) {
			request(app)
				.get('/records')
				.expect('Content-Type', /json/)
				.expect(200, done);
		});

		it('should return the correct records', function (done) {
			request(app)
				.get('/records')
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var data = res.body.data;
					expect(data).to.be.an('array');

					// 10 records returned
					expect(data).to.have.length(10);

					// investigate the first record
					var rec1 = data[0];
					expect(rec1).to.be.an('object');
					expect(rec1.recordId).to.be.equal(firstRec.recordId);
					expect(rec1.description).to.be.equal(firstRec.description);

					done();
				});
		});

		it('should return the expected fields', function (done) {
			request(app)
				.get('/records')
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var data = res.body.data;
					expect(data).to.be.an('array');

					// 10 records returned
					expect(data).to.be.have.length(10);

					// investigate the first record
					var rec1 = data[0];
					expect(rec1).to.contain.keys(
						'starttime',
						'endtime',
						'pause',
						'description',
						'clientId',
						'clientName',
						'clientAbbreviation',
						'projectId',
						'projectName',
						'projectAbbreviation',
						'recordId',
						'userId',
						'invoiceId'
					);
					done();
				});
		});

		it('should limit the output fields when using parameter fields=... with findAll()', function (done) {
			request(app)
				.get('/records?fields=recordId,description')
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var data = res.body.data;
					expect(data).to.be.an('array');

					// investigate the first record
					var rec1 = data[0];
					expect(rec1).to.have.keys(
						'description',
						'recordId'
					);
					done();
				});
		});

		it('should limit the number of records returned when using parameters n, p with findAll()', function (done) {
			request(app)
				.get('/records?n=2&p=3')
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var data = res.body.data;
					expect(data).to.be.an('array');

					// 2 projects returned per page
					expect(data).to.have.length(2);

					// investigate the records on this page
					for (var i = 0; i < 2; i++) {
						var rec = data[i];
						expect(rec).to.be.an('object');
						expect(rec.recordId).to.be.equal(recsOnPage3[i]);
					}

					done();
				});
		});


		it('should return a specific record when doing a findById(recordId)', function (done) {
			request(app)
				.get('/records/ ' + testRec1.recordId)
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var data = res.body.data;
					expect(data).to.be.an('array');

					// only 1 record returned
					expect(data).to.have.length(1);


					// investigate the first record
					var rec1 = data[0];
					expect(rec1).to.be.an('object');
					expect(rec1.description).to.be.equal(testRec1.description);
					expect(rec1.projectId).to.be.equal(testRec1.projectId);
					done();
				});
		});

		it('should return a complete month using the parameter "month"', function (done) {
			var month = '201011';
			var nrOfRecords = 22; // expected number of records for this month
			request(app)
				.get('/records?n=100&month=' + month)
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var data = res.body.data;

					// 17 records returned for this month
					expect(data).to.have.length(nrOfRecords);

					// investigate the records on this page
					_.forEach(data, function (rec) {
						expect(rec).to.be.an('object');
						// check if all records belong to the requested month
						expect(rec.starttime.substr(0, 6)).to.be.equal(month);
					});

					done();
				});
		});

		it('should return a complete week using the parameter "week" (weekNo)', function (done) {
			var weekNo = '201041'; // week 2010-10-11 ... 2010-10-18 = cw 2010/41
			var nrOfRecords = 8; // expected number of records for this week
			request(app)
				.get('/records?week=' + weekNo)
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var data = res.body.data;

					// 17 records returned for this month
					expect(data).to.have.length(nrOfRecords);

					// investigate the records on this page
					_.forEach(data, function (rec) {
						expect(rec).to.be.an('object');
						// check if all records belong to the requested month
						var start = dateUtils.inflateDateTime(rec.starttime)
						expect(moment(start).format('GGGGWW')).to.be.equal(weekNo);
					});

					done();
				});
		});

		it('should return a complete week using the parameter "week" (a day in the week)', function (done) {
			var week = '20101013'; // week 2010-10-11 ... 2010-10-18 = cw 2010/41
			var weekNo = '201041';
			var nrOfRecords = 8; // expected number of records for this week
			request(app)
				.get('/records?week=' + week)
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var data = res.body.data;

					// 17 records returned for this month
					expect(data).to.have.length(nrOfRecords);

					// investigate the records on this page
					_.forEach(data, function (rec) {
						expect(rec).to.be.an('object');
						// check if all records belong to the requested mont
						var start = dateUtils.inflateDateTime(rec.starttime);
						expect(moment(start).format('GGGGWW')).to.be.equal(weekNo);
					});

					done();
				});
		});

		it('should include info about next page and previous page for browsing', function (done) {
			request(app)
				.get('/records?n=2&p=3')
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var result = res.body;

					expect(result).to.contain.keys('data', 'info');

					var data = result.data;
					expect(data).to.be.an('array');

					// 2 projects returned per page
					expect(data).to.have.length(2);

					var info = result.info;
					expect(info.prevPage).to.be.equal(2);
					expect(info.nextPage).to.be.equal(4);

					done();
				});

		});

		it('should include info about next page and previous page for browsing (test #2)', function (done) {
			request(app)
				.get('/records?n=2&p=1')
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var result = res.body;

					expect(result).to.contain.keys('data', 'info');

					var data = result.data;
					expect(data).to.be.an('array');

					// 2 projects returned per page
					expect(data).to.have.length(2);

					var info = result.info;
					expect(info.prevPage).to.be.null;
					expect(info.nextPage).to.be.equal(2);

					done();
				});

		});

		it('should include info about next page and previous page for browsing (test #3)', function (done) {
			request(app)
				.get('/records?n=2&p=1')
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var result = res.body;

					expect(result).to.contain.keys('data', 'info');

					var data = result.data;
					expect(data).to.be.an('array');

					// 2 projects returned per page
					expect(data).to.have.length(2);

					var info = result.info;
					expect(info.nextPage).to.be.equal(2);
					expect(info.prevPage).to.be.null;

					done();
				});
		});

		it('should include info about next page and previous page for browsing (test #4)', function (done) {
			request(app)
				.get('/records?n=60')
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var result = res.body;

					expect(result).to.contain.keys('data', 'info');

					var data = result.data;
					expect(data).to.be.an('array');

					// 2 projects returned per page
					expect(data).to.have.length(60);

					var info = result.info;
					expect(info.nextPage).to.be.equal(2);
					expect(info.prevPage).to.be.null;

					done();
				});
		});

		it('should include info about next page and previous page for browsing (test #5)', function (done) {
			request(app)
				.get('/records?n=60&p=1')
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var result = res.body;

					expect(result).to.contain.keys('data', 'info');

					var data = result.data;
					expect(data).to.be.an('array');

					// 2 projects returned per page
					expect(data).to.have.length(60);

					var info = result.info;
					expect(info.nextPage).to.be.equal(2);
					expect(info.prevPage).to.be.null;

					done();
				});
		});

		it('should include info about next page and previous page for browsing (test #6)', function (done) {
			request(app)
				.get('/records?n=60&p=2')
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var result = res.body;

					expect(result).to.contain.keys('data', 'info');

					var data = result.data;
					expect(data).to.be.an('array');

					// 2 projects returned per page
					expect(data).to.have.length(28);

					var info = result.info;
					expect(info.prevPage).to.be.equal(1);
					expect(info.nextPage).to.be.null;

					done();
				});
		});
	});


	describe('POST /records', function () {
		it('should reject request because we are not logged in', function (done) {
			request(app)
				.post('/records')
				.send({
					projectId: 1,
					starttime: '20140328T1342',
					description: 'Sample test description (rejected - not logged in)'
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

		it('should accept a new (added) record', function (done) {

			var testRec = {
				projectId: 1,
				starttime: '20140328T134200',
				description: 'Sample test description, new record'
			};

			this.sess.post('/records')
				.send(testRec)
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var result = res.body;

					// no error on saving
					expect(result).to.not.contain.key('error');
					var info = result.info;

					logger.verbose('Posted data', { data: testRec });

					// recordId returned
					var recordId = info.insertId;
					expect(recordId).to.be.a('number');

					// retrieve record and check if saved correctly
					retrieveRecord(recordId, function (result, err) {

						expect(err).to.be.null;

						// only 1 record returned
						expect(result).to.contain.key('data');
						expect(result.data).to.have.length(1);

						// investigate the first record
						var rec = result.data[0];
						logger.verbose('Retrieved record []' + recordId, { data: rec });
						expect(rec).to.be.an('object');
						expect(rec.description).to.be.equal(testRec.description);
						expect(rec.projectId).to.be.equal(testRec.projectId);
						logger.verbose('Comparing start time', { rec: rec.starttime, testRec: testRec.starttime });
						expect(rec.starttime).to.be.equal(testRec.starttime);
					});

					done();
				});
		});

		it('should reject add request because required fields are missing', function (done) {

			var testRec = {
				projectId: 1,
				description: 'Sample test description (should fail)'
			};

			this.sess.post('/records')
				.send(testRec)
				.expect(400)
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var result = res.body;
					expect(result).to.be.an('Object').and.have.key('error');

					var error = result.error;
					expect(error).to.be.an('Object')
						.and.have.keys('errorCode', 'errorObj', 'message')
					expect(error.errorCode).to.be.at.least(1000);

					done();
				});
		});

		it('should update a record', function (done) {

			this.sess.post('/records/' + testUpdate.recordId)
				.send(testUpdate)
				.expect(200)
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var result = res.body;

					// no error on saving
					expect(result).to.not.contain.key('error');
					expect(result).to.contain.key('info');

					logger.verbose('In "should update a record": posted data', { data: testUpdate });

					expect(result.info.affectedRows).to.be.equal(1);

					// retrieve record and check if saved correctly
					retrieveRecord(testUpdate.recordId, function (data, err) {

						expect(err).to.be.null;

						// only 1 record returned
						expect(data.data).to.have.length(1);

						// investigate the first (and only) record
						var rec = data.data[0];
						logger.verbose('Retrieved record []' + testUpdate.recordId, { data: rec });
						expect(rec).to.be.an('object');
						expect(rec.description).to.be.equal(testUpdate.description);
						expect(rec.starttime).to.be.equal(testUpdate.starttime);
					});

					done();
				});
		});

		it('should delete a record', function (done) {

			this.sess.del('/records/' + testDelete.recordId)
				.end(function (err, res) {
					if (err) {
						throw err;
					}
					var result = res.body;

					// no error on saving
					expect(result).to.not.contain.key('error');
					expect(result).to.contain.key('info');

					expect(result.info.affectedRows).to.be.equal(1);

					// retrieve record and check if saved correctly
					retrieveRecord(testDelete.recordId, function (data, err) {

						expect(err).to.be.null;

						// no records returned
						expect(data.data).to.be.an('array');
						expect(data.data).to.have.length(0);
					});

					done();
				});
		});

		it('should logout', function (done) {
			this.sess.get('/logout')
				.expect(200, done);
		});

		it('should reject add request because we are already logged out', function (done) {

			var testRec = {
				projectId: 1,
				starttime: '20140328T1343',
				description: 'Sample test description (should fail)'
			};

			this.sess.post('/records')
				.send(testRec)
				.expect(401, done);
		});

		it('should reject update request because we are already logged out', function (done) {

			this.sess.post('/records/' + testUpdate.recordId)
				.send(testUpdate)
				.expect(401, done);
		});

		it('should reject delete request because we are already logged out', function (done) {

			var testRec = {
				recordId: 3581
			};

			this.sess.del('/records/' + testRec.recordId)
				.send(testRec)
				.expect(401, done);
		});

	});
});
