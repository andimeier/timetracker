/**
 * CRUD Routes for invoices.
 * @module invoices
 * @type {*|Object}
 */
var utils = require(__dirname + '/../utils/utils');
var error = require(__dirname + '/../utils/error');
var invoice = require(__dirname + '/../models/invoice');

var userId = 10; //@TODO REMOVE ME!!!!!

exports.findById = function(req, res) {

  invoice.findById(req.params.id, userId, function(data, err) {
    utils.sendResult(res, data, err);
  });
};

exports.findAll = function(req, res) {

	invoice.findAll(req.query, userId, function(data, err) {
		utils.sendResult(res, data, err);
	});
};

exports.add = function(req, res) {
	invoice.add(req.body, userId, function(data, info, err) {
		utils.sendResult(res, data, info, err);
	});
};

exports.update = function(req, res) {
	logger.verbose('update called, with: ', {body: req.body});
	invoice.update(req.params.id, req.body, userId, function(data, info, err) {
		utils.sendResult(res, data, info, err);
	});
};

exports.delete = function(req, res) {
	invoice.delete(req.params.id, userId, function(data, info, err) {
		utils.sendResult(res, data, info, err);
	});
}
