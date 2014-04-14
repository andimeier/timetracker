var Model = require(__dirname + '/../utils/model');
//var util = require('util');
//var utils = require(__dirname + '/../utils/utils');
var utils = require(__dirname + '/../utils/utils');


var project = new Model();

project.keyCol = 'project_id';

project.select = "SELECT p.project_id, p.name, p.abbreviation, " +
  "p.active from projects p";


project.attributes = exports.attrs = {
	'projectId': {
		column: 'p.project_id',
		type: 'number',
		safe: [ 'update' ] },
	'name': {
		column: 'p.name',
		type: 'string',
		safe: [ 'add', 'update' ] },
	'abbreviation': {
		column: 'p.abbreviation',
		type: 'string',
		safe: [ 'add', 'update' ] },
	'active': {
		column: 'p.active',
		type: 'boolean',
		safe: [ 'add', 'update' ] }
};

// we don't expect to 'paginate', just retrieve all projects, use
// 200 as a reasonable limit, as a safety net ...
project.limit = 200;

project.orderBy = 'name';


/**
 * Model-specific API parameters
 * @method setCriteria
 * @param params will be passed by Model and contains request.query.params
 * @param criteria {Object{} a Criteria object which will be passed by Model and
 *   must be used to add model-specific criteria
 */
project.setCriteria = function(params, criteria) {
	if (params.set && params.set === 'all') {
		// don't add a constraint for limiting the result set
		// to just active projects => do nothing

	} else {
		// default: only active projects
		criteria.add('active').true();
	}
};

module.exports = project;