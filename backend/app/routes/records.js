/**
 * CRUD Routes for records.
 * @module records
 * @type {*|Object}
 */
var utils = require(__dirname + '/../utils/utils');
var error = require(__dirname + '/../utils/error');
var record = require(__dirname + '/../models/record');

var userId = 10; //@TODO: remove!!!! replace with session user id


exports.findById = function(req, res) {
  record.findById(req.params.id, userId, function(data, info, err) {
    utils.sendResult(res, data, info, err);
  });
};

exports.findAll = function(req, res) {
	record.findAll(req.query, userId, function(data, info, err) {
		utils.sendResult(res, data, info, err);
	});
};

exports.add = function(req, res) {
	record.add(req.body, userId, function(data, info, err) {
		utils.sendResult(res, data, info, err);
	});
};

exports.update = function(req, res) {
	record.update(req.params.id, req.body, userId, function(data, info, err) {
		utils.sendResult(res, data, info, err);
	});
};

exports.delete = function(req, res) {
	record.delete(req.params.id, userId, function(data, info, err) {
		utils.sendResult(res, data, info, err);
	});
}
