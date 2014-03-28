/**
 * Created by azimmer on 27.03.14.
 */
var request = require('supertest'),
  assert = require('assert'),
  app = require('../../server/app/server.js').app;

var should = require('chai').should();

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
          data.should.be.an('array');

          // 7 projects returned
          data.should.have.length(7);

          // investigate the first project
          var proj1 = data[0];
          proj1.should.contain.keys('name', 'abbreviation', 'active', 'projectId');
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
          data.should.be.an('array');

          // 7 projects returned
          data.should.have.length(7);

          // investigate the first project
          var proj1 = data[0];
          proj1.should.be.an('object');
          proj1.name.should.be.equal('Active Project 1');
          proj1.abbreviation.should.be.equal('Proj1');
          proj1.active.should.be.ok;
          proj1.projectId.should.be.equal(1);

          // check that all returned projects are active
          for (var i = 0; i < data.length; i++) {
            data[i].active.should.be.ok;
          }

          done();
        });
    });

    it('should return project #1 when doing a findById(1)', function(done) {
      request(app)
        .get('/projects/1')
        .end(function(err,res) {
          if (err) {
            throw err;
          }
          var data = res.body;
          data.should.be.an('array');

          // only 1 project returned
          data.should.have.length(1);

          // investigate the first project
          var proj1 = data[0];
          proj1.should.be.an('object');
          proj1.name.should.be.equal('Active Project 1');
          proj1.abbreviation.should.be.equal('Proj1');
          proj1.active.should.be.ok;
          proj1.projectId.should.be.equal(1);
          done();
        });
    });

  });
});
