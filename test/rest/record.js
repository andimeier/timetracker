/**
 * Created by azimmer on 28.03.14.
 */
// set test environment (to switch logging behavior)
process.env.NODE_ENV = 'test';

var request = require('supertest'),
  assert = require('assert'),
  expect = require('chai').expect,
  app = require('../../server/app/server.js').app;

/**
 * retrieve a specific record from database and provide it via callback
 * @param recordId the ID of the record to be retrieved
 * @param callback a callback function taking 2 parameters:
 *   data ... the retrieved record
 *   err ... error object (in case of an error)
 */
var retrieveRecord = function(recordId, callback) {
  request(app)
    .get('/records/' + recordId)
    .end(function(err,res) {
      callback(err ? null : res.body, err);
    });

}

describe('Record API', function() {

  // the first record when doing a 'select * from records order by starttime desc'
  var firstRec = {
      recordId: 3593,
      description: 'Test-Eintrag mit gewissen Taetigkeiten am 03.03.2011'
  };

  var testRec1 = {
      recordId: 3506,
      projectId: 149,
      description: 'Test-Eintrag mit gewissen Taetigkeiten am 04.10.2010'
  };

    var testRec2 = {
        recordId: 3590,
        description: 'Test-Eintrag mit gewissen Taetigkeiten am 01.03.2011'
    };

    describe('GET /records', function() {
    it('should return an array of records', function(done) {
      request(app)
        .get('/records')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('should return the correct records', function(done) {
      request(app)
        .get('/records')
        .end(function(err,res) {
          if (err) {
            throw err;
          }
          var data = res.body;
          expect(data).to.be.an('array');

          // 10 projects returned
          expect(data).to.have.length(10);

          // investigate the first record, it
          var rec1 = data[0];
          expect(rec1).to.be.an('object');
          expect(rec1.recordId).to.be.equal(firstRec.recordId);
          expect(rec1.description).to.be.equal(firstRec.description);

          done();
        });
    });

    it('should return the expected fields', function(done) {
      request(app)
        .get('/records')
        .end(function(err,res) {
          if (err) {
            throw err;
          }
          var data = res.body;
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

    it('should limit the output fields when using parameter fields=... with findAll()', function(done) {
      request(app)
        .get('/records?fields=recordId,description')
        .end(function(err,res) {
          if (err) {
            throw err;
          }
          var data = res.body;
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

    it('should limit the number of records returned when using parameters n, p with findAll()', function(done) {
      request(app)
        .get('/records?n=2&p=3')
        .end(function(err,res) {
          if (err) {
            throw err;
          }
          var data = res.body;
          expect(data).to.be.an('array');

          // 10 projects returned
          expect(data).to.have.length(2);

          // investigate the first record, it
          var rec1 = data[0];
          expect(rec1).to.be.an('object');
          expect(rec1.recordId).to.be.equal(testRec2.recordId);
          expect(rec1.description).to.be.equal(testRec2.description);

          done();
        });
    });


    it('should return a specific record when doing a findById(recordId)', function(done) {
      request(app)
        .get('/records/ ' + testRec1.recordId)
        .end(function(err,res) {
          if (err) {
            throw err;
          }
          var data = res.body;
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
  });

  describe('POST /records', function() {
    it.skip('should accept a new (added) record', function(done) {
      request(app)
        .post('/records')
        .send({
          projectId: 1,
          starttime: '20140328T1342',
          description: 'Sample test description'
        })
        .end(function(err,res) {
          if (err) {
            throw err;
          }
          var data = res.body;

          // no error on saving
          expect(data).to.not.contain.key('error');

          logger.verbose(':::::::::::::::::::::::::::::::', { data: data });

          // recordId returned
          expect(data.insertId).to.be.a('number');
          var recordId = data.insertId;

          // retrieve record and check if saved correctly
          retrieveRecord(recordId, function(data, err) {

            expect(err).to.be.null;

            // only 1 record returned
            expect(data).to.have.length(1);

            // investigate the first record
            var rec = data[0];
            expect(rec).to.be.an('object');
            expect(rec.description).to.be.equal('Sample test description');
            expect(rec.projectId).to.be(l);
            expect(rec.starttime).to.be('20140328T1342');
          });

          done();
        });
    });
  });
});