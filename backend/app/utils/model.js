/**
 * A generic model class. This is instantiated by specialized model classes
 * which represent e.g. database entities.
 *
 * @module model
 */
var utils = require(__dirname + '/../utils/utils'),
	Criteria = require('../utils/criteria'),
	error = require('../utils/error'),
//	pluralize = require('pluralize'),
	_ = require('lodash');

/**
 * @class Model
 * @constructor
 */
var Model = function () {
};

/**
 * The name of the database entity representing the model. This
 * will be used e.g. for CRU operations.
 * The table name will not be escaped.
 * @property tableName
 * @type String
 */
Model.prototype.tableName = '';

/**
 * The select statement for retrieving values.
 * The statement ust be written so that a WHERE clause can be appended
 * without producing a syntax error.
 * @property select
 * @type String
 */
Model.prototype.select = '';

/**
 * The list of attributes. Key is the attribute (model) name, value is
 * an object describing the column. The attribute object can contain the following
 * properties:
 * * 'column' ... column name as used in the SQL string, which may include a table
 * or alias prefix.
 * * 'type' ... data type, e.g. 'datetime'. This is for special treatment of the value
 * before saving resp. after reading it. For example, the conversion of date/time
 * values on writing a model is triggered by declaring the attribute to be a 'datetime'
 * field. Also, this property will determine whether values for this attribute will be
 * quoted or not. The type can be:
 *      - datetime (will be quoted)
 *      - string (will be quoted)
 *      - number (will _not_ be quoted)
 *      - boolean (will _not_ be quoted)
 * If 'type' is omitted, the value will be quoted by default.
 * * 'default' ... default value when not specified. Note that this is either a literal
 * which will be used as field value or one of the following special values:
 * '@NOW' (will be translated to MySql's now() function), '@USER_ID' (the user ID of the
 * session user)
 * * 'required' ... a truthy value indicates that this attribute is mandatory
 * * 'safe' ... list of methods where this attribute is considered "safe". This means,
 * the attribute is "allowed" to be used with the defined methods. If an attribute is
 * not safe, it is silently ignored.
 * The values specify in which REST functions the corresponding attributes are valid.
 * For example, a recordId is valid (and necessary) in an 'update' operation, but it
 * not legal in an 'add' operation under normal circumstances, because the recordId
 * should  be assigned by the database server in this case. Nevertheless, other
 * attributes can be set by the REST service itself (e.g. cdate, userId), but they
 * are silently ignored when coming over the API form the outside world.
 * Valid methods are
 * "udpate" and "add". If an attribute is defined to be safe for only "update", then
 * this attribute will be silently ignored when it is sent in a "add" request.
 * @property attributes
 * @type Object
 */
Model.prototype.attributes = {};

/**
 * The key column used for findById() and as required identifier for
 * update() and delete().
 * @property keyCol
 * @type String
 */
Model.prototype.keyCol = '';


/**
 * Number of objects to be retrieved by default on findAll()
 * @property limit
 * @type Number
 */
Model.prototype.limit = 10;

/**
 * Default sort order.
 * This is a string consisting of a comma-separated list of model
 * attributes, each optionally followed by a space and
 * the literal 'ASC' or 'DESC' to specify the direction.
 *
 * Examples:
 * * 'projectDate' ... order by project date ascending
 * * 'projectDate DESC' ... order by project date descending
 * * 'projectDate desc' ... order by project date descending (case insensitive)
 * * 'clientId DESC, invoiceDate' ... order by client ID descending, then by invoice date
 * @property orderBy
 * @type String
 */
Model.prototype.orderBy = '';


/**
 * Map alternative names for REST parameters
 * @property paramMap
 * @private
 */
Model.prototype.paramMap = {
	'n': 'limit',
	'p': 'page'
};


/**
 * If defined, this method will be invoked when parsing the input parameters.
 * By using this method, you can define special query parameters per model,
 * e.g. a model "project" may have the API query parameter 'all=1' to
 * retrieve all project, not just the active ones.
 * If defined, the function should expect two parameters, the parameter
 * object and the Criteria object. The parameter object contains all parameters
 * which have been received by the API. The Criteria object can be used to set
 * any database criteria, based on the parameters.
 *
 * @method setCriteria
 * @example
 *   model.setCriteria = function(params, criteria) {
 *     if (params.quiteNew) {
 *       criteria.add('date').between('2014', '2015')
 *     }
 *   };
 */
Model.prototype.setCriteria;


/**
 * Maps alternative names for REST parameters to the "official" ones.
 * The passed parameters list is manipulated and the modified list
 * will be returned as well. Parameters which are not defined in the
 * mapping will be left untouched.
 * @method mapParams
 * @param params {Object} the parameters object
 * @return {Object} the modified parameters list
 */
Model.prototype.mapParams = function (params) {
	_(params).forIn(function (value, key) {
		if (this.paramMap[key]) {
			params[this.paramMap[key]] = value;
			delete params[key];
		}
	}, this);
	return params;
};


/**
 * Converts and formats field values, if applicable. The values of the object's
 * properties are changed directly if the respective property is of
 * a data type which need conversion. For example, date time values
 * will be formatted. The type of the property is specified in the
 * property 'type' of this.attributes.
 * Quoting (e.g. for string values) will be done here, too
 * @param obj {Object} object to be processed.
 */
Model.prototype.formatFieldValues = function (obj) {
	_(obj).forIn(function (value, key, obj) {
		var attr = this.attributes[key];

		if (attr) {
			if (attr.type) {
				switch (attr.type) {
					case 'datetime':
						obj[key] = global.mysql.escape(this.formatDate(value));
						break;
					case 'string':
						obj[key] = global.mysql.escape(value);
						break;
					case 'boolean':
						obj[key] = value ? 1 : 0;
						break;
				}
			} else {
				// if 'type' is not defined, quote the value by default
				obj[key] = global.mysql.escape(value);
			}
		}
	}, this);
};


/**
 * Converts field value, if applicable. The values of the object's
 * properties are changed directly if the respective property is of
 * a data type which need conversion. For example, date time values
 * will be formatted. The type of the property is specified in the
 * property 'type' of this.attributes.
 * @param attribute {String} model attribute
 * @param value {*} the value which might be converted (or left
 *   unchanged if there is no conversion necessary)
 * @return the converted attribute value or the unmodified value if
 *   no conversion is applicable
 */
Model.prototype.convertFieldValue = function (attribute, value) {
	var attr = this.attributes[key];

	if (attr && attr.type) {
		switch (attr.type) {
			case 'datetime':
				value = this.formatDate(value);
				break;
		}
	}
	return value;
};


/**
 * Converts the attribute name into the corresponding database column name.
 * @param attribute {String} model attribute
 * @return the database column name of the specified attribute
 */
Model.prototype.getDatabaseColumn = function (attribute) {
	return this.attributes[attribute];
};


/**
 * Remove unacceptable fields. Unacceptable fields are all fields (model properties)
 * which are not defined as being "safe" for the specified method.
 * @param obj {Object} the object possibly containing unacceptable fields.
 * @param method {String} the REST method, can be either 'add' or 'update'. Depending on
 *   this method, some fields may be acceptable and others not. For example, in an 'add'
 *   operation, a recordId is generally not acceptable because it should be generated
 *   by a sequence / but in 'update' case it is definitely is acceptable (and necessary).
 */
Model.prototype.removeUnacceptableFields = function (obj, method) {
	_(obj).forIn(function (value, key) {
		var attrDef = this.attributes[key];
		var remove = false;
		if (!attrDef) {
			// not found
			logger.verbose('Attribute [%s] removed (unknown attribute)', key);
			remove = true;
		} else if (!attrDef.safe) {
			// no safe values defined
			logger.verbose('Attribute [%s] removed (no "safe" config defined for this attribute)', key);
			remove = true;
		} else if (_.indexOf(attrDef.safe, method) === -1) {
			// no 'add' safe value defined
			logger.verbose('Attribute [%s] removed ("safe" config does not contain method "%s")', key, method);
//				console.log('safe for [%s] is' + JSON.stringify(attrDef.safe), key);
			remove = true;
		}
		if (remove) {
			// remove attribute
			delete obj[key];
		}
	}, this);
};


/**
 * Gets calculated attributes.
 * The values for these attributes will not be escaped, but used literally
 * in the query string. The keys here are exactly the database table
 * column names, no changing of case will take place.
 * @param obj {Object} the object which will be analyzed to see if any attribute
 *   is already included - in this case, the respective property will not be
 *   added as calculated field. This effectively means that if you specify a
 *   property which normally is a calculated field, you can override the value
 *   with any value you wish. If you do not include it, it will be considered
 *   with the default value specified in this.attributes.
 * @param userId {Number} the user ID of the session user or null. This is needed
 *   if any field is defined as a calculated field with @USER_ID.
 * @returns {Object} object containing the calculated attributes which should
 *   be considered when writing the model to the database
 */
Model.prototype.getCalculatedAttributes = function (obj, userId) {
	var calculatedAttributes = {}
	_(this.attributes).forIn(function (value, key) {
		if (value.default && !obj[key]) {
			var column = this.stripTableAlias(value.column);
			switch (value.default) {
				case '@NOW':
					calculatedAttributes[column] = 'now()';
					break;
				case '@USER_ID':
					calculatedAttributes[column] = userId;
					break;
				default:
					calculatedAttributes[column] = value.default;
			}
		}
	}, this);
	return calculatedAttributes;
};


/*
 * Formats a JSON date string for being used in an SQL expression. If seconds or minutes/seconds
 * or hours/minutes/seconds are omitted, the missing parts will be considered '00'.
 *
 * @method formatDate
 * @param datetime {String} date time string in the compact format 20140301T180103 (YYYYMMDD'T'hhmmss)
 * @return {*} null if input is null or undefined, the datetime expression in SQL format otherwise
 */
Model.prototype.formatDate = function (datetime) {
	// parse a date/time string in yyyymmdd'T'HHMMSS format

	if (!datetime) {
		return null;
	}

	var r = datetime.substr(0, 4)
		+ '-' + datetime.substr(4, 2)
		+ '-' + datetime.substr(6, 2)
		+ ' ' + (datetime.substr(9, 2) || '00')
		+ ':' + (datetime.substr(11, 2) || '00')
		+ ':' + (datetime.substr(13, 2) || '00') // seconds may be omitted
	return r;
}

/**
 * Removes the table alias of a column name, if given. Technically, removes everything
 * until after the first dot, if the column name contains a dot. Special cases like
 * column names containing a dot (escaped or quoted) are NOT considered.
 * @method stripTableAlias
 * @param column {String} the column name which may or may not contain a table alias
 * @return {String} the pure column name with no table alias
 */
Model.prototype.stripTableAlias = function (column) {
	var ix = column.indexOf('.');
	if (ix) {
		column = column.slice(ix + 1);
	}
	return column;
}


/**
 * Validates the attributes and returns validation errors.
 * @method validate
 * @param obj {Object} the object (model) to be validated
 * @return {Array} list of validation error messages. If the method returns an empty array,
 *   no validation errors have been found and the object is considered ok.
 */
Model.prototype.validate = function (obj) {
	var errorMessages = [];
	_(this.attributes).forIn(function (value, key) {
		if (value.required && !obj[key]) {
			errorMessages.push('Attribute [' + key + '] is mandatory and missing');
		}
	}, this);

	// return error messages
	return errorMessages;
};


/**
 * Finds a specific record by its primary ID and return it
 * @method findById
 * @param id {Number} the primary ID to be searched for. The column name
 *   to be used for this is defined in the property this.keyCol.
 * @param userId the user ID of the session user
 * @param callback {Function} a callback function which is called when the
 *   record has been retrieved. It must accept the following parameters:
 *   * data (the record data as array with length==1)
 *   * info (metadata), containing the following keys:
 *       - rows: number of rows returned
 *   * err (error object)
 */
Model.prototype.findById = function (id, userId, callback) {

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

			callback(result, { rows: 1 }, err);
		});
	});

};


/**
 * Builds a valid "ORDER BY" string suitable for an SQL statement. Basically this
 * helper function does just a translation of all attribute names in the given
 * orderBy string, translating them from model attribute names to the database
 * entity names (column names). The keywords "ASC" and "DESC" are recognized and
 * will be preserved.
 *
 * Example:
 * The input string "clientId, date DESC" will be translated to "client_id, date DESC"
 *
 * @method buildOrderByString
 * @private
 * @param orderBy
 * @return {string}
 */
Model.prototype.buildOrderByString = function (orderBy) {
	var sort = '',
		sortFields = [];

	/**
	 * returns the column name if configured, and 'null' if not
	 */
	var getColumn = function (a, self) {
		return (self.attributes[a] && self.attributes[a].column) ?
			self.attributes[a].column : null;
	};

//	// just for isolated unit testing of this class, use the following
//	// lines to have the log messages appear on the console:
//	var logger = function () {
//	};
//	logger.verbose = console.log;
//	logger.error = console.log;

	if (orderBy) {
		// split orderBy string to get all involved fields
		logger.verbose('orderBy property is: ' + orderBy);

		var f = orderBy.split(',');
		_(f).forEach(function (attr) {
			var attrPlusDirection;
			if (attrPlusDirection = attr.match(/^ *\b(.+)\b *(ASC|DESC) *$/i)) {
				var trimmedAttr = attrPlusDirection[1].trim();
				var column = getColumn(trimmedAttr, this);
				if (column) {
//				if (this.attributes[trimmedAttr]) {
					// push column name plus ASC/DESC string
					sortFields.push(column + ' ' + attrPlusDirection[2].toUpperCase().trim());
				} else {
					logger.error('Specified "order by" attribute [%s] is not found in the list of attributes', trimmedAttr);
					// ... and ignore illegal field
				}
			} else {
				attr = attr.trim();
				// no ASC/DESC modifier
				var column = getColumn(attr, this);
				if (column) {
//				if (this.attributes[attr]) {
					sortFields.push(column);
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
 * Finds some records by specified criteria and returns them.
 * @method findAll
 * @param params {Object} object containing parameters for the query.
 *   Parameter set depends on the model instance, but typical parameters are:
 *   * 'fields' ... restrict output to the specified attributes
 *   * 'orderBy' ... an order by expression (comma-separated list of attributes,
 *     each optionally followed by 'ASC' or 'DESC' (case insensitive)
 *   * 'n'/'limit' ... specify number of records to be delivered at a maximum, of not specified, theconfigured
 *       default value will be used.
 *   * 'p'/'page' ... number of page to be delivered. The size of one page can be set with the parameter
 *      'limit', defaulting to the default value otherwise. The first page is page 1.
 * @param userId the user ID of the session user
 * @param callback {Function} a callback function which is called when the
 *   records have been retrieved. It must accept the following parameters:
 *   * data (the record data as array of retrieved records)
 *   * info (metadata), containing the following keys:
 *       - rows: number of rows returned
 *       - pageSize: max. number of rows per page (equivalent to the 'limit' parameter
 *       - nextPage: number of next page for pagination, or null if this is the last page
 *       - prevPage: number of previous page for pagination, or null if this is the first page
 *   * err (error object)
 */
Model.prototype.findAll = function (params, userId, callback) {

	var fields, // list of fields to be displayed in the output
		orderBy = this.orderBy, // order by fields
		limit = this.limit, // limit for limit/offset clause
		limitClause, // assembled limit clause
		whereClause, // assembled where clause
		sortClause,  // assembled sort clause
		page = 1, nextPage = null;

	// process model-specific input parameters
	if (typeof(this.setCriteria) === 'function') {
		criteria = new Criteria();
		this.setCriteria(params, criteria);
		var constraints = criteria.get();
		if (constraints.length) {
			whereClause = 'WHERE ' + constraints.join(' AND ');
		}
	}
	whereClause = whereClause || '';

	debugger;
	this.mapParams(params);

	if (params.fields) {
		fields = params.fields.split(',');
	}

	if (params.orderBy) {
		orderBy = params.orderBy;
	}
	sortClause = this.buildOrderByString(orderBy)

	if (params.limit) {
		limit = parseInt(params.limit);
	}
	if (params.page) {
		page = parseInt(params.page);
	}
	if (limit) {
		// retrieve one record beyond the limit to see if there are further
		// records (for paginating)
		limitClause = 'LIMIT ' + (limit + 1);
		if (page) {
			limitClause += ' OFFSET ' + (page - 1) * limit;
		}
	}

	var sql = _.compact([this.select, whereClause, sortClause, limitClause]).join(' ');
	logger.verbose('=====> (in model.js) NEW select is [' + sql + ']');

	dbPool.getConnection(function (err, connection) {

		// query the database to some data
		connection.query(sql, function (err, rows) {

			// if there is one record "too much", strip it and remember that
			// there are further records for paginating ...
			if (rows.length > limit) {
				rows = rows.slice(0, limit);
				nextPage = page + 1;
			}

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

			callback(result, {
				rows: result.length,
				pageSize: limit || null,
				nextPage: nextPage,
				prevPage: page > 1 ? page - 1 : null
			} , err);
		});
	});

};

/**
 * Inserts a new record into the database.
 * @method add
 * @param obj {Object} the object to be written
 * @param userId the user ID of the session user
 * @param callback {Function} a callback function which is called when the
 *   record has been written. It must accept the following parameters:
 *   * data (will be empty in this case as no rows are returned)
 *   * info (metadata), containing the following keys:
 *       - insertId {number}: ID of the inserted row (value of AUTO_INCREMENT field)
 *       - db {object}: database specific info returned from MySql
 *   * err (error object).
 */
Model.prototype.add = function (obj, userId, callback) {

	console.log(')))))))))))))))))) class name: DUMMYYYYY ');

	logger.verbose('User attempts to post a new record', { obj: obj });
//	console.log('User attempts to post a new record: ' + JSON.stringify(obj));

	this.removeUnacceptableFields(obj, 'add');
	this.formatFieldValues(obj);
	var calculatedAttributes = this.getCalculatedAttributes(obj, userId);

	// begin input validation
	// ----------------------

	var validationErrors = this.validate(obj);
	if (validationErrors.length) {
		// validation error
		var err = error({
			errorCode: 1003,
			message: 'Validation error',
			errorObj: validationErrors
		})
		callback(null, null, err);

	} else {
		// input is ok, let's write to DB
		// ------------------------------
		self = this;
		dbPool.getConnection(function (err, connection) {

			// convert case of the column names into database syntax
			obj = utils.changeKeysToSnakeCase(obj);
			var dataFields = utils.getInsertLists(obj);

			var columnNames = dataFields['keys'].join(',');
			var values = dataFields['values'].join(',');
			if (!_.isEmpty(calculatedAttributes)) {
//				console.log('-----calc fields: ' + JSON.stringify(calculatedAttributes));
//				formatFieldValues(calculatedAttributes, this);
//				console.log('-----AFTER CONVERT calc fields: ' + JSON.stringify(calculatedAttributes));
//				console.log('YES there are calc fields');
				var calcFields = utils.getInsertLists(calculatedAttributes);
//				console.log('calcFields: ' + JSON.stringify(calcFields));
				columnNames += ',' + calcFields['keys'].join(',');
				values += ',' + calcFields['values'].join(',');
//			} else {
//				console.log('NO there are no calc fields: ' + JSON.stringify(calculatedAttributes));
			}
			var sql = 'INSERT into ' + self.tableName + '(' + columnNames + ') values ('
				+ values + ')';

			logger.verbose("SQL = " + sql);
			connection.query(sql, function (err, rows) {

				var result;
				if (err === null) {
					result = {
						insertId: rows.insertId,
						db: rows
					};
				}
				// close connection
				connection.release();

				callback({}, result, err);
			});
		});
	}
};

/**
 * Updates an existing record in the database.
 * @method update
 * @param id {Number} the primary ID identifying the object to be updated. The column name
 *   to be used for this is defined in the property this.keyCol.
 * @param obj {Object} the object to be written
 * @param userId the user ID of the session user
 * @param callback {Function} a callback function which is called when the
 *   record has been written. It must accept the following parameters:
 *   * data (will be empty in this case as no rows are returned)
 *   * info (metadata), containing the following keys:
 *       - affectedRows {number}: number of udpated rows
 *       - db {object}: database specific info returned from MySql
 *   * err (error object).
 */
Model.prototype.update = function (id, obj, userId, callback) {

	var recordId = parseInt(id);
	if (!recordId) {
		callback(null, null, error({
			errorCode: 1003,
			message: 'No ID passed in the API call'
		}));
		return;
	}

	logger.verbose('User attempts to update a record', { obj: obj });
//	console.log('User attempts to update an existing record: ' + JSON.stringify(obj));

	this.removeUnacceptableFields(obj, 'update');
	this.formatFieldValues(obj);
	var calculatedAttributes = this.getCalculatedAttributes(obj, userId);

	// begin input validation
	// ----------------------
//	console.log('obj is now (1): ' + JSON.stringify(obj));

	// SOMETHING must be updated, if no attributes are left, throw an error
	if (_.keys(obj).length == 0) {
		throw new Expection('Empty object passed for UPDATE, this makes no sense!');
	}

	var validationErrors = this.validate(obj);
	if (validationErrors.length) {
		// validation error
		var err = error({
			errorCode: 1003,
			message: 'Validation error',
			errorObj: validationErrors
		})
		callback(null, null, err);

	} else {
		// input is ok, let's write to DB
		// ------------------------------
		self = this;
		dbPool.getConnection(function (err, connection) {

			// convert case of the column names into database syntax
			obj = utils.changeKeysToSnakeCase(obj);
			var fieldAssignments = utils.getUpdateString(obj);

			if (!_.isEmpty(calculatedAttributes)) {
//				console.log('-----calc fields: ' + JSON.stringify(calculatedAttributes));
//				formatFieldValues(calculatedAttributes, this);
//				console.log('-----AFTER CONVERT calc fields: ' + JSON.stringify(calculatedAttributes));
//				console.log('YES there are calc fields');

				fieldAssignments += ',' + utils.getUpdateString(calculatedAttributes);
//			} else {
//				console.log('NO there are no calc fields: ' + JSON.stringify(calculatedAttributes));
			}


			var sql = 'UPDATE ' + self.tableName + ' set ' + fieldAssignments + ' where record_id=' + recordId;

			logger.verbose("SQL = " + sql);
			connection.query(sql, function (err, rows) {

				var result;
				if (err === null) {
					if (!rows.affectedRows) {
						err = error({
							errorCode: 1002,
							errorObj: rows,
							message: 'No rows matched'
						});
					}

					result = {
						affectedRows: rows.affectedRows,
						db: rows
					};
				}
				// close connection
				connection.release();

				callback({}, result, err);
			});
		});
	}
};


/**
 * Deletes an existing record from the database.
 * @method delete
 * @param id {Number} the primary ID identifying the object to be deleted. The column name
 *   to be used for this is defined in the property this.keyCol.
 * @param userId the user ID of the session user
 * @param callback {Function} a callback function which is called when the
 *   record has been written. It must accept the following parameters:
 *   * data (will be empty in this case as no rows are returned)
 *   * info (metadata), containing the following keys:
 *       - affectedRows {number}: number of deleted rows
 *       - db {object}: database specific info returned from MySql
 *   * err (error object).
 */
Model.prototype.delete = function (id, userId, callback) {

	var recordId = parseInt(id);
	if (!recordId) {
		callback(null, null, error({
			errorCode: 1003,
			message: 'No ID passed in the API call'
		}));
		return;
	}

	self = this;
	dbPool.getConnection(function (err, connection) {
		// write to DB
		var sql = 'DELETE from ' + self.tableName + ' where record_id=' + recordId;
		logger.verbose("SQL = " + sql);
		connection.query(sql, function (err, rows) {

			var result;
			if (err === null) {
				if (!rows.affectedRows) {
					err = error({
						errorCode: 1002,
						errorObj: rows,
						message: 'No rows matched'
					});
				}

				result = {
					affectedRows: rows.affectedRows,
					db: rows
				};
			}
			// close connection
			connection.release();

			callback({}, result, err);
		});
	});
};


module.exports = Model;