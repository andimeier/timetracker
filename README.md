Frontend
========

Build:

    grunt build

Run:

    grunt serve


Server (REST Backend)
=====================

Start server:

    npm start

Generate YUI documentation:

    npm run doc

This will generate the YUI documentation folder `doc/`, located in the project's root directory.

Run unit tests

    npm test

*Note:* to successfully run the tests, it is necessary to prepare the database fixture data.
Use the following statement to prepare the database before doing a `npm test`:

    mysql -u $DB_USER -h $DB_HOST -p$DB_PWD $DB_NAME </server/test/fixtures/timetracker.fixtures.dump.sql
