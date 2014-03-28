var utils = require(__dirname + '/../utils/utils');

var attrs = exports.attrs = {

};

var Model = function() {

};

// the select statement for retrieving values. The statement
// must be written so that a WHERE clause can be appended without producing
// a syntax error.
Model.prototype.select = '';

// the key column used for "findById"
Model.prototype.keyCol = '';


/**
 * find a specific record by its primary ID and return it
 * @param id the primary ID to be searched for. The columnn name
 *   to be used for this is defined in the property this.keyCol.
 * @param callback a callback function which is called when the
 *   record has been retrieved. It must accept two parameters:
 *   data (the record data as array with length==1) and err (error
 *   object).
 */
Model.prototype.findById = function(id, callback) {

  var where = this.keyCol + '=' + parseInt(id);

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