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
		safe: [ 'update' ] },
	'name': {
		column: 'p.name',
		safe: [ 'add', 'update' ] },
	'abbreviation': {
		column: 'p.abbreviation',
		safe: [ 'add', 'update' ] },
	'active': {
		column: 'p.active',
		safe: [ 'add', 'update' ] }
};

project.orderBy = 'name DESC';

module.exports = project;