var express = require('express'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	mysql = require('mysql'),
	winston = require('winston'),
	records = require('./routes/records'),
	projects = require('./routes/projects'),
	invoices = require('./routes/invoices'),
	stats = require('./routes/stats'),
	login = require('./routes/login'),
	authenticate = require('./utils/auth'),
	fs = require('fs');

// server port
var port = 3000;

var config = require(__dirname + '/config/config.json');

// global MySql connection pool
global.dbPool = mysql.createPool({
	host: config.db.host,
	user: config.db.user,
	password: config.db.password,
	database: config.db.database,
	dateStrings: true // don't convert date fields into Date objects (since
	// it would make the process vulnerable due to implicit, automatic timezone
	// conversions. We do not want that, so let's treat these fields simply as
	// strings.
});

// enable routers access to mysql functions like mysql.escape
global.mysql = mysql;

// set up logging
// ==============

if (process.env.NODE_ENV !== 'test') {
	// production settings for logging
	global.logger = new (winston.Logger)({
		transports: [
			new (winston.transports.Console)({
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
	if ('OPTIONS' === req.method) {
		res.send(200);
	}
	else {
		next();
	}
};

// user validation using session cookies
var auth = function (req, res, next) {
	if (!req.session.userId) {
		res.status(401);
		res.end('Unauthorized access.');
	} else {
		logger.verbose('Session detected, SID=[' + req.sessionID + ']',
			{ userId: req.session.userId, firstName: req.session.firstName });
		next();
	}
};


var app = express();

app.use(function (req, res, next) {
	logger.verbose('=== NEW REQUEST', { query: req });
	next();
});

app.use(allowCrossDomain);
app.use(cookieParser());
app.use(session({
	secret: 'asdfsa$12{34))X_.sd',
	key: 'sid',
	cookie: {
		maxAge: config.session.expire,
		httpOnly: false
	},
	store: new (require('express-sessions'))({
		storage: 'redis',
		host: config.redis.host,
		port: config.redis.port,
		collection: config.redis.collection,
		expire: config.session.expire
	})
}));
app.use(bodyParser());

// express routes config starts here
// ---------------------------------

// ATTENTION: BE SURE TO ADD THE AUTH HANDLER TO ALL ROUTES WHICH CHANGE DATA OR MUST
// IN ANY OTHER SENSE BE CONSIDERED PRIVATE!

app.use(function (req, res, next) {
	logger.verbose('=== NEW REQUEST: ', {url: req.originalUrl, method: req.method, query: req.query });

	if (req.method === 'POST') {
		logger.verbose('=== INCOMING POST REQUEST: ', {url: req.originalUrl, body: req.body });
	}
	next();
});

app.post('/login', login.login);
app.get('/logout', auth, login.logout);

app.get('/records', records.findAll);
app.get('/records/:id', records.findById);
app.post('/records/:id', auth, records.update); // POST with ID => update
app.put('/records/:id', auth, records.update);
//app.post('/records',       auth, records.add); // POST without ID => add
app.post('/records', auth, records.add); // POST without ID => add
app.delete('/records/:id', auth, records.delete);

app.get('/projects', projects.findAll);
app.get('/projects/:id', projects.findById);

app.get('/stats', stats.recordedHours);

app.get('/invoices', auth, invoices.findAll);
app.get('/invoices/:id', auth, invoices.findById);
app.post('/invoices/:id', auth, invoices.update); // POST with ID => update
app.put('/invoices/:id', auth, invoices.update);
app.post('/invoices', auth, invoices.add); // POST without ID => add
app.delete('/invoices/:id', auth, invoices.delete);

// output version info
app.get('/version', function (req, res) {
	fs.exists(__dirname + '/version.json', function(exists) {

		if (exists) {
			fs.readFile(__dirname + '/version.json', function (err, data) {
				if (err) {
					logger.error(err);
					res.send(400, err);
				}
				res.send(200, data);
//		res.send({ version: "hoo" });
			});
		} else {
			logger.error('Version file [' + __dirname + '/version.json' + '] does not exist');
			res.send(400, { version: 'unknown' });
		}
	});
});

app.use(function (req, res) {
	logger.verbose('Unrecognized API call', { url: req.originalUrl });
	res.send(404);
});

// start the server
app.listen(port);
logger.verbose('Listening on port ' + port + ' ...');

exports.app = app;
