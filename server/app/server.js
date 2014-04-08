var express = require('express'),
	mysql = require('mysql'),
	records = require('./routes/records'),
	projects = require('./routes/projects'),
	stats = require('./routes/stats'),
	login = require('./routes/login'),
	authenticate = require('./utils/auth'),
    winston = require('winston');
	
// server poonrt
var port = 3000;

var config = require(__dirname + '/config/config.json');

// global MySql connection pool
global.dbPool = mysql.createPool({
	host     : config.host,
	user     : config.user,
	password : config.password,
	database : config.database,
    dateStrings: true // don't convert date fields into Date objects (since
        // it would make the process vulnerable due to implicit, automatic timezone
        // conversions. We do not want that, so let's treat these fields simply as
        // strings.
});

// enable routers access to mysql functions like mysql.escape
global.mysql = mysql

global.logger = new (winston.Logger)({
    transports: [
        //new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'timetracker.log', level: 'verbose' })
    ]
});

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


var app = exports.app = express();


app.use(function(req, res, next) {
	logger.verbose('=======================================================');
	logger.verbose('==================== New request ======================');
	logger.verbose('=======================================================');
	logger.verbose('Query parameters: ' + JSON.stringify(req.query, null, 2));
	next();
});


app.use(allowCrossDomain);
app.use(express.bodyParser());
app.use(express.cookieParser('asdr84353$^@k;1B'));
app.use(express.cookieSession({cookie: { httpOnly: false }}));
// app.use(express.csrf());
// app.use(function(req, res, next) {
// 	logger.verbose('XSRF-TOKEN from the request: [' + req.csrfToken() + ']');
// 	res.cookie('XSRF-TOKEN', req.csrfToken());
// 	next();
// });

// user validation using session cookies
var auth = function(req, res, next) {
	logger.verbose('!!!!!!----- In auth(), session is ' + JSON.stringify(req.session, undefined, 2));
	if (!req.session.userId) {
		res.status(401);
		res.end('Unauthorized access.');
	} else {
		logger.verbose('SESSION DETECTED: userId=[' + req.session.userId + '], firstName=[' + req.session.firstName + ']');
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

app.get('/stats', stats.recordedHours);


// private services (need session for those)
app.get('/logout',         auth, login.logout);

app.post('/records/:id',   auth, records.update); // POST with ID => update
app.put('/records/:id',    auth, records.update);
app.post('/records',       auth, records.add); // POST without ID => add
app.delete('/records/:id', auth, records.delete);



// start the server
app.listen(port);
logger.verbose('Listening on port ' + port + ' ...');

