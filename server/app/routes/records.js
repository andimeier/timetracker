var utils = require(__dirname + '/../utils/utils');
var error = require(__dirname + '/../utils/error');
var record = require(__dirname + '/../models/record');

var userId = 10; //@TODO: remove!!!! replace with session user id



/**
 * find a specific record by primary key. Called with /records/:id
 * @param req express request object
 * @param res express response object
 */
exports.findById = function(req, res) {
  record.findById(req.params.id, userId, function(data, err) {
    utils.sendResult(res, data, err);
  });
};


/**
 * Called with /records
 * Retrieves all specified records.
 * @see model.findAll for details on possible parameters
 * @param req express request object
 * @param res express response object
 */
exports.findAll = function(req, res) {
	record.findAll(req.query, userId, function(data, err) {
		utils.sendResult(res, data, err);
	});
};

exports.add = function(req, res) {
	record.add(req.body, userId, function(data, err) {
		utils.sendResult(res, data, err);
	});
};

exports.update = function(req, res) {
	record.update(req.params.id, req.body, userId, function(data, err) {
		utils.sendResult(res, data, err);
	});
};

exports.delete = function(req, res) {
	record.delete(req.params.id, userId, function(data, err) {
		utils.sendResult(res, data, err);
	});
}
