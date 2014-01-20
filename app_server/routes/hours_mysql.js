var mysql = require('mysql');
 
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'charlie',
  password : 'secret',
});


exports.findById = function(req, res) {
	// var id = req.params.id;
	// console.log('Retrieving wine: ' + id);
	// db.collection('wines', function(err, collection) {
	// 	collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
	// 		res.send(item);
	// 	});
	// });


	// RECEIVED A REQUEST!
	// for this example respond with a HTTP 200 OK
	res.writeHeader(200);
	res.write('Connect to mySql\n');
	// Connect to mySql (if there is an error, report it and terminate the request)
	connection.connect(function(err){
		if(err != null) {
			res.end('Error connecting to mysql:' + err + '\n');
		}
	});

	// Query the database to some data 
	connection.query("SELECT * from hours WHERE hour_id=?", function(err, rows){
	// There was a error or not?
	if(err != null) {
		res.end("Query error:" + err);
	} else {
	// Shows the result on console window
	console.log(rows[0]);
	res.end("Success!");
	}
	// Close connection
	connection.end();
	});


};

exports.findAll = function(req, res) {
	// Query the database to some data 
	connection.query("SELECT * from hours", function(err, rows){
	
	if(err != null) {
		res.end("Query error:" + err);
	} else {
		// Shows the result on console window
		console.log(rows[0]);
		res.end("Success!");
	}
	// Close connection
	connection.end();
	});
};

exports.add = function(req, res) {
	// var wine = req.body;
	// console.log('Adding wine: ' + JSON.stringify(wine));
	// db.collection('wines', function(err, collection) {
	// 	collection.insert(wine, {safe:true}, function(err, result) {
	// 		if (err) {
	// 			res.send({'error':'An error has occurred'});
	// 		} else {
	// 			console.log('Success: ' + JSON.stringify(result[0]));
	// 			res.send(result[0]);
	// 		}
	// 	});
	// });
}

exports.update = function(req, res) {
	// var id = req.params.id;
	// var wine = req.body;
	// console.log('Updating wine: ' + id);
	// console.log(JSON.stringify(wine));
	// db.collection('wines', function(err, collection) {
	// 	collection.update({'_id':new BSON.ObjectID(id)}, wine, {safe:true}, function(err, result) {
	// 		if (err) {
	// 			console.log('Error updating wine: ' + err);
	// 			res.send({'error':'An error has occurred'});
	// 		} else {
	// 			console.log('' + result + ' document(s) updated');
	// 			res.send(wine);
	// 		}
	// 	});
	// });
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
	// 			res.send(req.body);
	// 		}
	// 	});
	// });
}
