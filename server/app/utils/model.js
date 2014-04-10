var utils = require(__dirname + '/../utils/utils'),
	_ = require('lodash');

var Model = function () {

};

// the select statement for retrieving values. The statement
// must be written so that a WHERE clause can be appended without producing
// a syntax error.
Model.prototype.select = '';

// the list of attributes. Key is the attribute (model) name, value is
// the column name as used in the SQL string, which may include a table or
// alias prefix.
Model.prototype.attrs = {};

// the key column used for "findById"
Model.prototype.keyCol = '';

// number of objects to be retrieved by default on findAll()
Model.prototype.limit = 10;

// default sort order. This is a string consisting of a comma-separated
// list of model attributes, each optionally followed by a space and
// the literal 'ASC' or 'DESC' to specify the direction.
// Examples:
//   'projectDate' ... order by project date ascending
//   'projectDate DESC' ... order by project date descending
//   'projectDate desc' ... order by project date descending (case insensitive)
//   'clientId DESC, invoiceDate' ... order by client ID descending, then by invoice date
Model.prototype.orderBy = '';


// map alternative names for REST parameters
Model.prototype.paramMap = {
	'n': 'limit',
	'p': 'page'
};

/**
 * Maps alternative names for REST parameters to the "official" ones.
 * The passed parameters list is manipulated and the modified list
 * will be returned as well. Parameters which are not defined in the
 * mapping will be left untouched.
 * @param params the parameters object
 * @returns {*} the modified parameters list
 */
Model.prototype.mapParams = function(params) {
	_(params).forIn(function(value, key) {
		if (this.paramMap[key]) {
			params[this.paramMap[key]] = value;
			delete params[key];
		}
	}, this);
	return params;
};

/**
 * find a specific record by its primary ID and return it
 * @param id the primary ID to be searched for. The columnn name
 *   to be used for this is defined in the property this.keyCol.
 * @param callback a callback function which is called when the
 *   record has been retrieved. It must accept two parameters:
 *   data (the record data as array with length==1) and err (error
 *   object).
 */
Model.prototype.findById = function (id, callback) {

	var where = this.keyCol + '=' + parseInt(id);

	var sql = this.select + ' where ' + where;
	logger.verbose('=====> (in model.js) NEW select is [' + sql + ']');


	dbPool.getConnection(function (err, connection) {

		// query the database to some data
		connection.query(sql, function (err, rows) {

			var result;
			if (err === null) {
				result = utils.changeKeysToCamelCase(rows);
				if (result instanceof Error) {
					err = {'msg': 'Error at mapping keys to JSON keys: ' + result};
				}
			}

			// close connection
			connection.release();

			callback(result, err);
		});
	});

};

Model.prototype.buildOrderByString = function (orderBy) {
	var sort = '',
		sortFields = [];

	var isAttr = function(a) {
		return this.attrs[a] ? true : false;
	};

	if (orderBy) {
		// split orderBy string to get all involved fields
		logger.verbose('orderBy property is: ' + orderBy);

		var f = orderBy.split(',');
		_(f).forEach(function (attr) {
			var attrPlusDirection;
			if (attrPlusDirection = attr.match(/^ *\b(.+)\b *(ASC|DESC) *$/i)) {
//				if (isAttr(attrPlusDirection[0])) {
				var trimmedAttr = attrPlusDirection[1].trim();
				if (this.attrs[trimmedAttr]) {
					sortFields.push(this.attrs[trimmedAttr] + ' ' + attrPlusDirection[2].toUpperCase().trim());
				} else {
					logger.error('Specified "order by" attribute [%s] is not found in the list of attributes', trimmedAttr);
					// ... and ignore illegal field
				}
			} else {
				attr = attr.trim();
				// no ASC/DESC modifier
//				if (isAttr(attr)) {

				if (this.attrs[attr]) {
					sortFields.push(this.attrs[attr]);
				} else {
					logger.error('Specified "order by" attribute [%s] is not found in the list of attributes', attr);
					// ... and ignore illegal field
				}
			}
		}, this);

		if (sortFields.length) {
			sort = 'ORDER BY ' + sortFields.join(', ');
		}
		return sort;
	}
}

/**
 * find a specific record by its primary ID and return it
 * @param params object containing parameters for the query.
 *   Parameter set depends on the model instance, but typical parameters are:
 *   'fields' ... restrict output to the specified attributes
 *   'orderBy' ... an order by expression (comma-separated list of attributes,
 *     each optionally followed by 'ASC' or 'DESC' (case insensitive)
 * @param callback a callback function which is called when the
 *   records have been retrieved. It must accept two parameters:
 *   data (the record data as array of retrieved records) and err (error
 *   object).
 */
Model.prototype.findAll = function (params, callback) {

	var constraints = [ '1=1'], // find constraints, default: not constrained
		fields, // list of fields to be displayed in the output
		orderBy = this.orderBy, // order by fields
		limit = [this.limit, 1], // limit/pageNr for limit/offset clause
		limitClause, // assembled limit clause
		whereClause, // assembled where clause
		sortClause; // assembled sort clause

	this.mapParams(params);

	if (params.fields) {
		fields = params.fields.split(',');
	}

	if (params.orderBy) {
		orderBy = params.orderBy;
	}
	sortClause = this.buildOrderByString(orderBy)

	// build 'where' constraint
	whereClause = constraints.join(' and ');

	if (params.limit) {
		limit[0] = params.limit;
	}
	if (params.page) {
		limit[1] = params.page;
	}
	if (limit[0]) {
		limitClause = 'LIMIT ' + limit[0];
		if (limit[1]) {
			limitClause += ' OFFSET ' +  (limit[1] - 1) * limit[0];
		}
	};


	var sql = this.select + ' where ' + _.compact([whereClause, sortClause, limitClause]).join(' ');
	logger.verbose('=====> (in model.js) NEW select is [' + sql + ']');

	dbPool.getConnection(function (err, connection) {

		// query the database to some data
		connection.query(sql, function (err, rows) {

			var result;
			if (err === null) {
				result = utils.changeKeysToCamelCase(rows);
				if (fields) {
					// filter output fields
					result = utils.filterProperties(result, fields);
				}
				if (result instanceof Error) {
					err = {'msg': 'Error at mapping keys to JSON keys: ' + result};
				}
			}

			// close connection
			connection.release();

			callback(result, err);
		});
	});

};

module.exports = Model;