var express = require('express'),
	mysql = require('mysql'),
	records = require('./routes/records'),
	projects = require('./routes/projects'),
	invoices = require('./routes/invoices'),
	stats = require('./routes/stats'),
	login = require('./routes/login'),
	authenticate = require('./utils/auth'),
	winston = require('winston');

// server port
var port = 3000;

var config = require(__dirname + '/config/config.json');

// global MySql connection pool
global.dbPool = mysql.createPool({
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database,
	dateStrings: true // don't convert date fields into Date objects (since
	// it would make the process vulnerable due to implicit, automatic timezone
	// conversions. We do not want that, so let's treat these fields simply as
	// strings.
});

// enable routers access to mysql functions like mysql.escape
global.mysql = mysql;

if (process.env.NODE_ENV !== 'test') {
	// production settings for logging
	global.logger = new (winston.Logger)({
		transports: [
			new (winston.transports.Console)({
				level: 'verbose',
				handleExceptions: true
			}),
			new (winston.transports.File)({
				filename: 'timetracker.prod.log',
				level: 'verbose',
				handleExceptions: true
			})
		]
	});
	logger.cli();
} else {
	// in unit test mode, log only to file
	global.logger = new (winston.Logger)({
		transports: [
			new (winston.transports.File)({
				filename: 'timetracker.test.log',
				level: 'verbose'
				//handleExceptions: true
			})
		]
	});
	logger.cli();
}

var allowCrossDomain = function (req, res, next) {
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


var app = exports.app = express();

app.use(function (req, res, next) {
	logger.verbose('=== NEW REQUEST', { query: req });
	next();
});


app.use(allowCrossDomain);
app.use(express.urlencoded())
app.use(express.json())
app.use(express.cookieParser('asdr84353$^@k;1B'));
app.use(express.cookieSession({cookie: { httpOnly: false }}));
// app.use(express.csrf());
// app.use(function(req, res, next) {
// 	logger.verbose('XSRF-TOKEN from the request: [' + req.csrfToken() + ']');
// 	res.cookie('XSRF-TOKEN', req.csrfToken());
// 	next();
// });

// user validation using session cookies
var auth = function (req, res, next) {
	logger.verbose('Entering auth handler, try to identify user', { 'req.session': req.session });
	if (!req.session.userId) {
		res.status(401);
		res.end('Unauthorized access.');
	} else {
		logger.verbose('Session detected', { userId: req.session.userId, firstName: req.session.firstName });
		next();
	}
};


// express routes config starts here
// ---------------------------------

// ATTENTION: BE SURE TO ADD THE AUTH HANDLER TO ALL ROUTES WHICH CHANGE DATA OR MUST
// IN ANY OTHER SENSE BE CONSIDERED PRIVATE!

app.post('/login',               login.login);
app.get('/logout',         auth, login.logout);

app.get('/records',              records.findAll);
app.get('/records/:id',          records.findById);
app.post('/records/:id',   auth, records.update); // POST with ID => update
app.put('/records/:id',    auth, records.update);
//app.post('/records',       auth, records.add); // POST without ID => add
app.post('/records',       auth, records.add); // POST without ID => add
app.delete('/records/:id', auth, records.delete);

app.get('/projects',              projects.findAll);
app.get('/projects/:id',          projects.findById);

app.get('/stats',                 stats.recordedHours);

app.get('/invoices',       auth, invoices.findAll);
app.get('/invoices/:id',   auth, invoices.findById);


app.use(function (req, res) {
	logger.verbose('Unrecognized API call', { url: req.originalUrl });
	res.send(404);
});

// start the server
app.listen(port);
logger.verbose('Listening on port ' + port + ' ...');

