/**
 * Created by azimmer on 27.03.14.
 */
var request = require('supertest'),
  assert = require('assert'),
  expect = require('chai').expect,
  app = require('../../server/app/server.js').app;


describe('Project API', function() {
  describe('GET /projects', function() {
    it('should return an array of projects', function(done) {
      request(app)
        .get('/projects')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('should return the expected fields', function(done) {
      request(app)
        .get('/projects')
        .end(function(err,res) {
          if (err) {
            throw err;
          }
          var data = res.body;
          expect(data).to.be.an('array');

          // 7 projects returned
          expect(data).to.have.length(7);

          // investigate the first record
          var proj1 = data[0];
          expect(proj1).to.contain.keys('name', 'abbreviation', 'active', 'projectId');
          done();
        });
    });

    it('should return the list of active projects', function(done) {
      request(app)
        .get('/projects')
        .end(function(err,res) {
          if (err) {
            throw err;
          }
          var data = res.body;
          expect(data).to.be.an('array');

          // 7 projects returned
          expect(data).to.have.length(7);

          // investigate the first record
          var proj1 = data[0];
          expect(proj1).to.be.an('object');
          expect(proj1.name).to.be.equal('Active Project 1');
          expect(proj1.abbreviation).to.be.equal('Proj1');
          expect(proj1.active).to.be.ok;
          expect(proj1.projectId).to.be.equal(1);

          // check that all returned projects are active
          for (var i = 0; i < data.length; i++) {
            expect(data[i].active).to.be.ok;
          }

          done();
        });
    });

    it('should return record #1 when doing a findById(1)', function(done) {
      request(app)
        .get('/projects/1')
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
          var proj1 = data[0];
          expect(proj1).to.be.an('object');
          expect(proj1.name).to.be.equal('Active Project 1');
          expect(proj1.abbreviation).to.be.equal('Proj1');
          expect(proj1.active).to.be.ok;
          expect(proj1.projectId).to.be.equal(1);
          done();
        });
    });

  });
});
