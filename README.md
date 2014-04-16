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
