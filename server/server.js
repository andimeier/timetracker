var express = require('express'),
	records = require('./routes/records'),
	projects = require('./routes/projects'),
	login = require('./routes/login'),
	authenticate = require('./auth');

// server port
var port = 3000;

var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:9000');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	res.header('Access-Control-Allow-Credentials', 'true');

	// intercept OPTIONS method
	if ('OPTIONS' == req.method) {
		res.send(200);
	}
	else {
		next();
	}
};


var app = express();
app.use(allowCrossDomain);
app.use(express.bodyParser());
app.use(express.cookieParser('asdr84353$^@k;1B'));
app.use(express.cookieSession({cookie: { httpOnly: false }}));
// app.use(express.csrf());
// app.use(function(req, res, next) {
// 	console.log('XSRF-TOKEN from the request: [' + req.csrfToken() + ']');
// 	res.cookie('XSRF-TOKEN', req.csrfToken());
// 	next();
// });

app.use(function(req, res, next) {
	console.log('=======================================================');
	console.log('==================== New request ======================');
	console.log('=======================================================');
	next();
});

// user validation using session cookies
var auth = function(req, res, next) {
	console.log('!!!!!!----- In auth(), session is ' + JSON.stringify(req.session, undefined, 2));
	if (!req.session.userId) {
		res.status(401);
		res.end('Unauthorized access.');
	} else {
		console.log('SESSION DETECTED: userId=[' + req.session.userId + '], firstName=[' + req.session.firstName + ']');
    	next();
    }
};


// express routes config starts here
// ---------------------------------

// ATTENTION: BE SURE TO ADD THE AUTH HANDLER TO ALL ROUTES WHICH CHANGE DATA!

// public services (without authentication)
app.post('/login', login.login);

app.get('/records', records.findAll);
app.get('/records/:id', records.findById);

app.get('/projects', projects.findAll);
app.get('/projects/:id', projects.findById);


// private services (need session for those)
app.get('/logout',         auth, login.logout);

app.post('/records/:id',   auth, records.update); // POST with ID => update
app.put('/records/:id',    auth, records.update);
app.post('/records',       auth, records.add); // POST without ID => add
app.delete('/records/:id', auth, records.delete);


// start the server
app.listen(port);
console.log('Listening on port ' + port + ' ...');
