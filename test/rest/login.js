/**
 * Created by azimmer on 28.03.14.
 */
// set test environment (to switch logging behavior)
process.env.NODE_ENV = 'test';

var request = require('supertest'),
	assert = require('assert'),
	expect = require('chai').expect,
	app = require('../../server/app/server.js').app;

describe('Login API', function () {

	// the correct login credentials
	var credentials = {
		username: 'test',
		password: 'test',
		userId: 2
	};

	it('should reject wrong credentials', function (done) {
		request(app)
			.post('/login')
			.set('Content-Type', 'application/json')
			.send({
				user: 'dummy......',
				pass: 'wrong password'
			})
			.expect(401)
			.end(function (err, res) {

				var data = res.body;
				expect(data).to.be.an('object');

				// expect the correct error code to be returned
				expect(data.errorCode).to.be.equal(1001);

				done();
			});
	});

	it('should reject wrong request method', function (done) {
		request(app)
			.get('/login')
			.set('Content-Type', 'application/json')
			.expect(404, done);
	});

	it('should be able to login', function (done) {
		request(app)
			.post('/login')
			.set('Content-Type', 'application/json')
			.send({
				user: credentials.username,
				pass: credentials.password
			})
			.expect(200)
			.expect('Set-Cookie', /^.{3,}$/) // expect some cookie set
			.end(function (err, res) {

				var data = res.body;
				expect(data).to.be.an('object');

				expect(data.userId).to.be.equal(2);

				done();
			});
	});
});