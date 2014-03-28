var utils = require(__dirname + '/../utils/utils');

var attrs = exports.attrs = {

};

var Model = function() {

};

// the select statement for retrieving values
Model.prototype.select = '';

// the key column used for "findById"
Model.prototype.keyCol = '';

Model.prototype.findById = function(id, callback) {

  var where = this.keyCol + '=' + parseInt(id);
  console.log('=====> (in model.js) select is [' + this.select + ']');

  var sql = this.select + ' where ' + where;
  console.log('=====> (in model.js) NEW select is [' + sql + ']');


  dbPool.getConnection(function(err, connection) {

    // query the database to some data
    connection.query(sql, function(err, rows) {

      var result;
      if (err === null) {
        result = utils.changeKeysToCamelCase(rows);
        if (result instanceof Error) {
          err = {'msg': 'Error at mapping keys to JSON keys: ' + result};
        }
      }

      // close connection
      connection.release();

      callback(result, err);
    });
  });

};

module.exports = Model;