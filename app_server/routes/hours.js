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
		res.end("Query error:" + err);
	} else {
		// Shows the result on console window
		res.send(rows);
		//res.sendend("Success!");
	}
	// Close connection
//	connection.end();
	});
};

exports.findAll = function(req, res) {
	// Query the database to some data 
	connection.query("SELECT * from hours", function(err, rows){
	
	if(err != null) {
		res.end("Query error:" + err);
	} else {
		// Shows the result on console window
		res.send(rows);
		//res.sendend("Success!");
	}
	// Close connection
//	connection.end();
	});
};

exports.add = function(req, res) {
	// Query the database to some data 
	connection.query("SELECT * from hours where hour_id=" + req.params.id, function(err, rows){
	
	if(err != null) {
		res.end("Query error:" + err);
	} else {
		// Shows the result on console window
		res.send(rows);
		//res.sendend("Success!");
	}
	// Close connection
//	connection.end();
	});
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
