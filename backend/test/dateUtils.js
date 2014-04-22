/**
 * Created by azimmer on 28.03.14.
 */
// set test environment (to switch logging behavior)
process.env.NODE_ENV = 'test';

var expect = require('chai').expect,
	app = require('../app/server.js').app,
	moment = require('moment'),
	cases = require('cases'),
	dateUtils = require('../app/utils/dateUtils.js');

describe('dateUtils', function () {

	it('should calculate the beginning of a week correctly', cases([
		[ '201415', '2014-04-07' ],
		[ '201414', '2014-03-31' ]
	], function(week, expectedStartOfWeek, done) {

			var result;

			result = moment(dateUtils.startOfWeek(week)).format('YYYY-MM-DD');
			expect(result).to.be.equal(expectedStartOfWeek);

			done();
		}
	));


	it('should calculate the beginning of a week containing a date', cases([
		[ '20140407', '2014-04-07' ],
		[ '20140408', '2014-04-07' ],
		[ '20140412', '2014-04-07' ],
		[ '20140413', '2014-04-07' ],
		[ '20140414', '2014-04-14' ],
		[ '20140415', '2014-04-14' ]
	], function(date, expectedStartOfWeek, done) {
		var result;

		result = moment(dateUtils.startOfWeekFromDate(date)).format('YYYY-MM-DD');
		expect(result).to.be.equal(expectedStartOfWeek);

		done();

	}));

	it('should inflate a date time value to <null> if no parseable date/time is given', cases([
		[ 'dummy', null ],
		[ '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', null ],
		[ null, null ],
		[ '', null ]
	], function(datetime, expectedResult, done) {
		expect(dateUtils.inflateDateTime(datetime)).to.be.equal(expectedResult);
		done();
	}));

	it('should inflate a date time value into date expression when no time is given', cases([
		[ '2014031412111111', null ],
		[ '201403141211111', null ],
		[ '20140314121111', null ],
		[ '2014031412111', null ],
		[ '201403141211', null ],
		[ '20140314121', null ],
		[ '2014031412', null ],
		[ '201403141', null ],
		[ '20140314', '2014-03-14' ],
		[ '2014031', null ],
		[ '201403', null ],
		[ '20140', null ],
		[ '2014', null ],
		[ '201', null ],
		[ '20', null ],
		[ '2', null ]
	], function(datetime, expectedResult, done) {
		expect(dateUtils.inflateDateTime(datetime)).to.be.equal(expectedResult);
		done();
	}));

	it('should inflate a date time value into date/time expression when date and time are given', cases([
		[ '20140314T12111111', null ],
		[ '20140314T1211111', null ],
		[ '20140314T121111', '2014-03-14T12:11:11' ],
		[ '20140314T12111', null ],
		[ '20140314T1211', null ],
		[ '20140314T121', null ],
		[ '20140314T12', null ],
		[ '20140314T1', null ]
	], function(datetime, expectedResult, done) {
		expect(dateUtils.inflateDateTime(datetime)).to.be.equal(expectedResult);
		done();
	}));

	it('should inflate a date time value into a date expression when using \'onlyDate\' parameter', cases([
		[ '20140314T12111111', null ],
		[ '20140314T1211111', null ],
		[ '20140314T121111', '2014-03-14' ],
		[ '20140314T12111', null ],
		[ '20140314T1211', null ],
		[ '20140314T121', null ],
		[ '20140314T12', null ],
		[ '20140314T1', null ]

	], function(datetime, expectedResult, done) {
		expect(dateUtils.inflateDateTime(datetime, true)).to.be.equal(expectedResult);
		done();
	}));
});