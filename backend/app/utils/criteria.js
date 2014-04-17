/**
 * A criteria class representing the database criteria to be used for the
 * query. This is used with a model's findAll() method to set individual
 * constraints (in the WHERE clause of the query) based on API parameters.
 * This class provides all methods necessary to add different kinds of
 * constraints (criteria).
 *
 * @module criteria
 */

/**
 * @class Criteria
 * @constructor
 */
var Criteria = function () {
	/**
	 * This property holds the list of defined criteria. Each time
	 * a criteria is added via add(), it is appended to this list.
	 */
	this.criteria = [];

	// hold the attribute to be specified with the criterion
	this.attribute;
};

/**
 * If defined, this function will be called each time a model attribute's
 * value is processed. This function should accept the following parameters:
 *   * attribute ... the model attribute name
 *   * value ... the attribute's value
 * The function must return the converted value (or unmodified if conversion
 * is not applicable or needed for this attribute)
 * @method convertFieldValue
 */
Criteria.prototype.convertFieldValue;

/**
 * If defined, this function will be called to convert a model's attribute namen
 * into the corresponding database column name.
 * This function should accept the following parameters:
 *   * attribute ... the model attribute name
 * The function must return the corresponding database column name
 * @method getDatabaseColumn
 */
Criteria.prototype.getDatabaseColumn;


/**
 * Adds another criterion to the list of criteria. It must
 * be followed by some criterion helper methods like equalTo(),
 * between() or similar.
 *
 * @method add
 * @param attr {String} the model attribute in question
 *   for which a criterion will be defined
 * @example
 *   criteria.add('date').equalTo('2014-01-01');
 */
Criteria.prototype.add = function(attr) {
	if (this.getDatabaseColumn) {
		attr = this.getDatabaseColumn(attr);
	}
	this.attribute = attr;
	return this; // enable method chaining
};

/**
 * Adds another criterion to the list of criteria without
 * further magic. This is an alternative to add().
 * <b>Note</b> that you must use <i>database field names</i> in this case,
 * not model attribute names because the string will not get parsed!
 *
 * @method addRaw
 * @param newCriterion {String} the new, complete database criterion
 * @example
 *   criteria.addRaw('date > now()' )
 */
Criteria.prototype.addRaw = function(newCriterion) {
	this.criteria.push(newCriterion);
};

/**
 * Adds a 'equal to' criterion
 * @method equal
 * @param value {String/Number} the value which the attribute
 *   must have
 */
Criteria.prototype.equalTo = function(value) {
	if (this.convertFieldValue) {
		value = this.convertFieldValue(this.attribute, value);
	}
	this.criteria.push(this.attribute + '=' + value);
	this.attribute = null;
}

/**
 * Adds a 'between' criterion
 * @method equal
 * @param from {String/Number} the minimum value for the attribute
 * @param to {String/Number} the maximum value for the attribute
 */
Criteria.prototype.between = function(from, to) {
	if (this.convertFieldValue) {
		from = this.convertFieldValue(this.attribute, from);
		to = this.convertFieldValue(this.attribute, to);
	}
	this.criteria.push(this.attribute + ' between ' + from
		+ ' and ' + to);
	this.attribute = null;
}

/**
 * Adds a 'is true' criterion
 * @method true
 */
Criteria.prototype.true = function() {
	this.criteria.push(this.attribute);
	this.attribute = null;
}

/**
 * Adds a 'is false' criterion
 * @method true
 */
Criteria.prototype.false = function() {
	this.criteria.push('not ' + this.attribute);
	this.attribute = null;
}

/**
 * Returns the list of defined criteria.
 *
 * @method get
 * @returns {Array}
 */
Criteria.prototype.get = function() {
	if (this.attribute) {
		logger.error('There is still an orphaned attribute value in the "Criteria" object which is never used: [%s].', this.attribute);
	}
	return this.criteria;
};



module.exports = Criteria;