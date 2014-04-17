General information
===================

The timetracker application consists of a Javascript frontend (running in the browser)
communicating via JSON REST API with the backend (a node.js server application running on the server).


Frontend
========

Build:

    grunt build

Run:

    grunt serve


Backend (REST service)
======================

Start server:

    npm start

Generate YUI documentation:

    npm run doc

This will generate the YUI documentation folder `doc/`, located in the project's root directory.

Run unit tests

    npm test

*Note:* to successfully run the tests, it is necessary to prepare the database fixture data.
Use the following statement to prepare the database before doing a `npm test`:

    mysql -u $DB_USER -h $DB_HOST -p$DB_PWD $DB_NAME < test/fixtures/timetracker.fixtures.dump.sql

Configuration
-------------

For the session storage (session data which will be referenced by session cookies), two session stores:

  1. MySql based session storage
  2. Redis

I don't think there is much of an argument pro or against one of these:

* MySql session store uses the MySql databases which is there anyway (for the application data),
so there is no extra tool to be installed/configured. This seems like the obvious choice for most users.
* Redis session store has the disadvantage that you have to install a Redis server to use it.
On the other hand, Redis has a very low memory footprint,
is lightning fast and has a feature set which makes it ideal for a session storage.
It holds all data in memory and you can attach an expiry date to the session data.
Perfect! I just *had* to implement a Redis session storage because it just felt right.

### MySql session store

***(MySql session store not working yet)***

The MySql session uses the MySql connection used for storing the application data.
An additional table will be used just for setting and getting the session related data.

Create/edit the config file `app/config/config.json` like that:

```
{
    "mysql": {
		"host": "server.com",
		"user": "username",
		"password": "password",
		"database": "timetracker",
		"sessionTable": "sessions"
	},
	"session": {
		"storage": "mysql",
		"expire": 86400
	},
}
```

The entry `"session.storage": "mysql"` tells the backend to use the MySql database to store
session data.

If the key `"session.expire"` is given, an expiration time will be attached to the session data.
I would regard 1 day (86400 seconds) as being suitable for this.

If session storage is set to "mysql",  you must provide the additional key `"mysql.sessionTable"` which determines
the table name where session data is stored. The table must be defined like that:

```
create table sessions (
  sid varchar(50) not null primary key,
  data varchar(1000),
  lastAccess datetime not null
 );
```



### Redis session store

You must have a Redis server installed. For Ubuntu or Debian, this would be something like:

    apt-get install redis-server

And you're done. Check it out:

    $ redis-cli ping
    PONG

Congratulations! Your Redis server is now up and running. Now we have to tell the application about it:

Create/edit the config file `app/config/config.json` like that:

```
{
	"db": {
		"host": "server.com",
		"user": "username",
		"password": "password",
		"database": "timetracker",
		"sessionTable": "sessions"
	},
	"session": {
		"storage": "redis",
		"expire": 86400
	},
	"redis": {
		"host": "localhost",
		"port": 6379,
		"collection": "sessions",
	}
}
```

The entry `"session.storage": "redis"` tells the backend to use the connection data
configured under the key "redis" for the Redis connection.

The entry `"collection"` specifies a prefix for the session data.
Each session will in this example config be stored under the key `sessions:5f98349abc0e9d0e723d`
where "5f98349abc0e9d0e723d" would  be the generated session ID for one of the session.

If the key `"session.expire"` is given, an expiration time will be attached to the session data in Redis.
I would regard 1 day (86400 seconds) as being suitable for this.
