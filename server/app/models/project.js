var Model = require(__dirname + '/../utils/model');
//var util = require('util');
//var utils = require(__dirname + '/../utils/utils');
var utils = require(__dirname + '/../utils/utils');


var project = new Model();

project.keyCol = 'project_id';
project.select = "SELECT p.project_id, p.name, p.abbreviation, " +
  "p.active from projects p";


var attrs = exports.attrs = {
  'name': 'name',
  'abbreviation': 'abbreviation',
  'active': 'active',
  'projectId': 'projectId'
};


module.exports = project;