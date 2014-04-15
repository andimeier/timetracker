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

	it('should inflate a date time value', function (done) {

		expect(dateUtils.inflateDateTime('dummy')).to.be.null;
		expect(dateUtils.inflateDateTime(null)).to.be.null;
		expect(dateUtils.inflateDateTime('2014031412111111')).to.be.null;
		expect(dateUtils.inflateDateTime('201403141211111')).to.be.null;
		expect(dateUtils.inflateDateTime('20140314121111')).to.be.null;
		expect(dateUtils.inflateDateTime('2014031412111')).to.be.null;
		expect(dateUtils.inflateDateTime('201403141211')).to.be.null;
		expect(dateUtils.inflateDateTime('20140314121')).to.be.null;
		expect(dateUtils.inflateDateTime('2014031412')).to.be.null;
		expect(dateUtils.inflateDateTime('201403141')).to.be.null;
		expect(dateUtils.inflateDateTime('20140314')).to.be.equal('2014-03-14');
		expect(dateUtils.inflateDateTime('2014031')).to.be.null;
		expect(dateUtils.inflateDateTime('201401')).to.be.null;
		expect(dateUtils.inflateDateTime('20141')).to.be.null;
		expect(dateUtils.inflateDateTime('2011')).to.be.null;
		expect(dateUtils.inflateDateTime('201')).to.be.null;
		expect(dateUtils.inflateDateTime('20')).to.be.null;
		expect(dateUtils.inflateDateTime('2')).to.be.null;
		expect(dateUtils.inflateDateTime('')).to.be.null;

		expect(dateUtils.inflateDateTime('20140314T12111111')).to.be.null;
		expect(dateUtils.inflateDateTime('20140314T1211111')).to.be.null;
		expect(dateUtils.inflateDateTime('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')).to.be.null;
		expect(dateUtils.inflateDateTime('20140314T121111')).to.be.equal('2014-03-14T12:11:11');
		expect(dateUtils.inflateDateTime('20140314T12111')).to.be.null;
		expect(dateUtils.inflateDateTime('20140314T1211')).to.be.null;
		expect(dateUtils.inflateDateTime('20140314T121')).to.be.null;
		expect(dateUtils.inflateDateTime('20140314T12')).to.be.null;
		expect(dateUtils.inflateDateTime('20140314T1')).to.be.null;

		expect(dateUtils.inflateDateTime('20140314T12111111', true)).to.be.null;
		expect(dateUtils.inflateDateTime('20140314T1211111', true)).to.be.null;
		expect(dateUtils.inflateDateTime('20140314T121111', true)).to.be.equal('2014-03-14');
		expect(dateUtils.inflateDateTime('20140314T12111', true)).to.be.null;
		expect(dateUtils.inflateDateTime('20140314T1211', true)).to.be.null;
		expect(dateUtils.inflateDateTime('20140314T121', true)).to.be.null;
		expect(dateUtils.inflateDateTime('20140314T12', true)).to.be.null;
		expect(dateUtils.inflateDateTime('20140314T1', true)).to.be.null;

		done();
	});

});