/**
 * Created by azimmer on 28.03.14.
 */
var request = require('supertest'),
  assert = require('assert'),
  app = require('../../server/app/server.js').app;

var expect = require('chai').expect;

describe('Record API', function() {
  describe('GET /records', function() {
    it('expect return an array of records', function(done) {
      request(app)
        .get('/records')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('expect return the expected fields', function(done) {
      request(app)
        .get('/records')
        .end(function(err,res) {
          if (err) {
            throw err;
          }
          var data = res.body;
          expect(data).to.be.an('array');

          // 7 projects returned
          expect(data).to.be.have.length(10);

          // investigate the first record
          var proj1 = data[0];
          expect(proj1).to.contain.keys(
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

    it('expect return record #3649 when doing a findById(3649)', function(done) {
      request(app)
        .get('/records/3649')
        .end(function(err,res) {
          if (err) {
            throw err;
          }
          var data = res.body;
          expect(data).to.be.an('array');

          // only 1 record returned
          expect(data).to.have.length(1);

          console.log('================>>>>>>>>>>> retrieved: ' + JSON.stringify(data[0]));

          // investigate the first record
          var rec1 = data[0];
          expect(rec1).to.be.an('object');
          expect(rec1.description).to.be.equal('oh jo to ho');
          expect(rec1.projectId).to.be.null;
          done();
        });
    });

  });
});
