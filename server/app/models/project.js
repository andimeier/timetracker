var Model = require(__dirname + '/../utils/model');
//var util = require('util');
//var utils = require(__dirname + '/../utils/utils');
var utils = require(__dirname + '/../utils/utils');


// define the Student class
function Project() {
  // Call the parent constructor
  Model.call(this);
  console.log('MODEL ---------------- inherited');
};

// inherit Model
Project.prototype = new Model();

// correct the constructor pointer because it points to Person
Project.prototype.constructor = Model;

// replace some inherited values
Project.prototype.keyCol = 'project_id';
Project.prototype.select = "SELECT p.project_id, p.name, p.abbreviation, " +
  "p.active from projects p";



//project.findById = function(id, callback) {
//
//  var where = this.keyCol + '=' + parseInt(id);
//  console.log('=====> select is [' + this.select + ']');
//
//  var sql = this.select + ' where ' + where;
//  console.log('=====> NEW select is [' + sql + ']');
//
//
//  dbPool.getConnection(function(err, connection) {
//
//    // query the database to some data
//    connection.query(sql, function(err, rows) {
//
//      var result;
//      if (err === null) {
//        result = utils.changeKeysToCamelCase(rows);
//        if (result instanceof Error) {
//          err = {'msg': 'Error at mapping keys to JSON keys: ' + result};
//        }
//      }
//
//      // close connection
//      connection.release();
//
//      callback(result, err);
//    });
//  });
// };

var attrs = exports.attrs = {
  'name': 'name',
  'abbreviation': 'abbreviation',
  'active': 'active',
  'projectId': 'projectId'
};


module.exports = Project;