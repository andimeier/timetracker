var mysql = require('mysql');
 
var connection = mysql.createConnection({
  host     : 'sql4.freesqldatabase.com',
  user     : 'sql427640',
  password : 'hE6!nX4!',
  database : 'sql427640'
});


exports.findById = function(req, res) {
	// Query the database to some data 
	console.log('Request: ' + req);
	connection.query("SELECT * from hours where hour_id=" + req.params.id, function(err, rows){
	
	if(err != null) {
		res.send(400, "Query error:" + err);
	} else {
		// Shows the result on console window
		res.send(200, rows);
	}
	// Close connection
//	connection.end();
	});
};

exports.findAll = function(req, res) {
	// Query the database to some data 
	connection.query("SELECT * from hours where starttime >= date_sub(current_date, interval 30 days) order by starttime", function(err, rows){
	
	if(err != null) {
		res.send(404, "Query error:" + err);
	} else {
		// Shows the result on console window
		res.send(200, rows);
	}
	// Close connection
//	connection.end();
	});
};

exports.add = function(req, res) {
	// Query the database to some data 
	console.log('INSERT, Body: ' + JSON.stringify(req.body));

	var attributes = [
		'starttime',
		'endtime',
		'pause',
		'project_id',
		'description'
	];
	var values = [];
	attributes.forEach(function(item) {
		var v = req.body[item];
		v !== null || v = 'null';
		values.push("'" + v + "'");
	});
	
	// additional (calculated) attributes
	attribute.push('cdate');
	values.push('now()');
	attribute.push('mdate');
	values.push('now()');

	attribute.push('user_id');
	values.push(1);

	// check fo mandatory fields
	if (!req.body.starttime) {
		res.send(400, 'Missing starttime');
	}

	// write to DB
	var sql = 'INSERT into hours(' + attributes.join(',') + ') ' +
		'select ' + values.join(',');
	console.log("SQL = " + sql);
	connection.query('INSERT into hours(' + attributes.join(',') + ') ' +
		'select ' + values.join(','), function(err, rows){
	
	if(err != null) {
		res.end("Query error:" + err);
	} else {
		// Shows the result on console window
		res.send(201, rows);
	}
	// Close connection
//	connection.end();
	});
}

exports.update = function(req, res) {
	// Query the database to some data 
	console.log('UPDATE, Body: ' + JSON.stringify(req.body));

	var id = parseInt(req.params.id);
	if (!id) {
		res.send(400, 'No valid hour_id passed');
	}

	var attributes = [
		'starttime',
		'endtime',
		'pause',
		'project_id',
		'description'
	];
	var values = [];
	attributes.forEach(function(item) {
		var v = req.body[item];
		if (v === null) {
			v = 'null';	
		} 
		values.push("'" + v + "'");
	});
	
	// additional (calculated) attributes
	attributes.push('mdate');
	values.push('now()');

	attributes.push('user_id');
	values.push(1);

	// check fo mandatory fields
	if (!req.body.starttime) {
		res.send(400, 'Missing starttime');
	}

	// build update string part
	var updateText = []
	for (var i = 0; i < attributes.length; i++) {
		updateText.push(attributes[i] + '=' + values[i]);
	};

	// write to DB
	var sql = 'UPDATE hours set ' + updateText.join() + ' where hour_id=' + id;
	console.log("SQL = " + sql);
	connection.query(sql, function(err, rows){
	
	if(err != null) {
		res.end("Query error:" + err);
	} else {

		if (!rows.affectedRows) {
			res.status(400);
			rows.error = 'No rows matched';
		} else {
			res.status(200);
		}	

		// Shows the result on console window
		res.send(rows);
	}
	// Close connection
//	connection.end();
	});
}

exports.delete = function(req, res) {
	// var id = req.params.id;
	// console.log('Deleting wine: ' + id);
	// db.collection('wines', function(err, collection) {
	// 	collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
	// 		if (err) {
	// 			res.send({'error':'An error has occurred - ' + err});
	// 		} else {
	// 			console.log('' + result + ' document(s) deleted');
	// 			res.send(204, req.body);
	// 		}
	// 	});
	// });
}
