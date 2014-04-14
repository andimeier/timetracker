/**
 * Created by azimmer on 28.03.14.
 */
// set test environment (to switch logging behavior)
process.env.NODE_ENV = 'test';

var app = require('../app/server.js').app,
	Criteria = require('../app/utils/criteria'),
	Model = require('../app/utils/model'),
	expect = require('chai').expect;


describe('Criteria object', function () {

	it('should process raw criteria correctly', function (done) {

		var c = new Criteria();
		var literalCriterion = 'date = current_date()';

		c.addRaw(literalCriterion);
		var result = c.get();

		expect(result).to.be.an('Array');
		expect(result).to.have.lengthOf(1);
		expect(result[0]).to.be.equal(literalCriterion);

		done();
	});

	it('should process "equalTo" criteria correctly', function (done) {

		var c = new Criteria();
		var attr = 'date1';
		var value = 127;

		c.add(attr).equalTo(value);
		var result = c.get();

		expect(result).to.be.an('Array');
		expect(result).to.have.lengthOf(1);

		var item = result[0];
		expect(item).to.be.a('String');
		expect(item).to.be.equal(attr + '=' + value);

		done();
	});

	it('should process "between" criteria with dates correctly', function (done) {

		var c = new Criteria();
		var model = new Model();
		c.convertFieldValue = function(attr, value) {
			return "'" + model.formatDate(value) + "'";
		}

		var attr = 'date1';
		var from = '20140201T080102';
		var to = '20140201T163007';

		c.add(attr).between(from, to);
		var result = c.get();

		expect(result).to.be.an('Array');
		expect(result).to.have.lengthOf(1);

		var item = result[0];
		expect(item).to.be.a('String');
		expect(item).to.be.equal(attr + ' between \'2014-02-01 08:01:02\' and \'2014-02-01 16:30:07\'');

		done();
	});

});