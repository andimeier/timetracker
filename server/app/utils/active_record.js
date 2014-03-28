var attrs = exports.attrs = {

};

// the select statement for retrieving values
var select = exports.select = '';

exports.findById = function() {

  dbPool.getConnection(function(err, connection) {

    // query the database to some data
    connection.query(select + ' and ' project_id=" + req.params.id, function(err, rows) {

      if (err != null) {
        res.send(400, error.error({
          errorCode: 1002,
          errorObj: err,
          message: 'Query error'
        }));
      } else {

        var result = utils.changeKeysToCamelCase(rows);
        if (result instanceof Error) {
          console.error('Error at mapping keys to JSON keys: ' + result);
        }
        res.send(200, result);
      }
    });

    // close connection
    connection.release();
  });
};

