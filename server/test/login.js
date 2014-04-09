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

describe('Login API', function () {

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
			.send({
				user: credentials.login.username,
				pass: credentials.login.password
			})
			.expect(200)
			.expect('Set-Cookie', /^.{3,}$/, done); // expect some cookie set
	});
});