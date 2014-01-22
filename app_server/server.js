var express = require('express'),
records = require('./routes/records');


var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

	// intercept OPTIONS method
	if ('OPTIONS' == req.method) {
		res.send(200);
	}
	else {
		next();
	}
};
 
var app = express();
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(allowCrossDomain);

app.get('/records', records.findAll);
app.get('/records/:id', records.findById);
app.post('/records/:id', records.update); // POST with ID => update
app.put('/records/:id', records.update);
app.post('/records', records.add); // POST without ID => add
app.delete('/records/:id', records.delete);

app.listen(3000);
console.log('Listening on port 3000...');