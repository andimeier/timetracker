/**
 * Created by azimmer on 28.03.14.
 */
// set test environment (to switch logging behavior)
process.env.NODE_ENV = 'test';

var expect = require('chai').expect,
	app = require('../app/server.js').app,
	moment = require('moment'),
	dateUtils = require('../app/utils/dateUtils.js');

describe('dateUtils', function () {

	it('should calculate the beginning of a week correctly', function (done) {

		var result;

		result = moment(dateUtils.startOfWeek('201415')).format('YYYY-MM-DD');
		expect(result).to.be.equal('2014-04-07');

		result = moment(dateUtils.startOfWeek('201414')).format('YYYY-MM-DD');
		expect(result).to.be.equal('2014-03-31');

		done();
	});


	it('should calculate the beginning of a week containing a date', function (done) {

		var result;

		result = moment(dateUtils.startOfWeekFromDate('20140407')).format('YYYY-MM-DD');
		expect(result).to.be.equal('2014-04-07');

		result = moment(dateUtils.startOfWeekFromDate('20140408')).format('YYYY-MM-DD');
		expect(result).to.be.equal('2014-04-07');

		result = moment(dateUtils.startOfWeekFromDate('20140412')).format('YYYY-MM-DD');
		expect(result).to.be.equal('2014-04-07');

		result = moment(dateUtils.startOfWeekFromDate('20140413')).format('YYYY-MM-DD');
		expect(result).to.be.equal('2014-04-07');

		result = moment(dateUtils.startOfWeekFromDate('20140414')).format('YYYY-MM-DD');
		expect(result).to.be.equal('2014-04-14');

		result = moment(dateUtils.startOfWeekFromDate('20140415')).format('YYYY-MM-DD');
		expect(result).to.be.equal('2014-04-14');

		done();
	});
});