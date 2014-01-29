var express = require('express'),
	records = require('./routes/records'),
	projects = require('./routes/projects'),
	login = require('./routes/login'),
	authenticate = require('./auth');

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
 
var basicAuthMessage = 'Restricted operation, authorization required';

var app = express();
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(allowCrossDomain);

// express routes


// user validation
var auth = express.basicAuth(function(user, pass, callback) {
	console.log('Invoking auth helper ...');
	authenticate.authenticate(user, pass, function(authResult) {
		console.log('Going to call auth callback function with the result of [' + authResult + ']');
		callback(null /* error */, authResult);
	});
}, basicAuthMessage);

// ATTENTION: be sure to add the auth handler to all route which change data!

app.get('/records', records.findAll);
app.get('/records/:id', records.findById);
app.post('/records/:id', auth, records.update); // POST with ID => update
app.put('/records/:id', auth, records.update);
app.post('/records', auth, records.add); // POST without ID => add
app.delete('/records/:id', auth, records.delete);

app.get('/projects', projects.findAll);
app.get('/projects/:id', projects.findById);

app.post('/login', login.login);

app.listen(3000);
console.log('Listening on port 3000...');