/**
 * Created by azimmer on 28.03.14.
 */
var request = require('supertest'),
	assert = require('assert'),
	expect = require('chai').expect,
	app = require('../../server/app/server.js').app;


describe.only('Login API', function () {

	// the correct login credentials
	var credentials = {
		username: 'test',
		password: 'test',
		userId: 2
	};

	it('should reject wrong credentials', function (done) {
		request(app)
			.post('login')
			.set('Content-Type', 'application/json')
			.send({
				user: 'dummy......',
				pass: 'wrong password'
			})
			.expect(401, done);
//			.end(function (err, res) {
//
//				var data = res.body;
//				expect(data).to.be.an('object');
//
//				// expect the correct error code to be returned
//				expect(data.errorCode).to.be.equal(1001);
//			})
	});
});