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
