var utils = require(__dirname + '/../utils/utils');
var error = require(__dirname + '/../utils/error');
var invoice = require(__dirname + '/../models/invoice');

var userId = 10; //@TODO REMOVE ME!!!!!

/**
 * Called with /invoices/:invoiceId
 * Retrieves the specified invoice.
 * @param req express request object
 * @param res express response object
 */
exports.findById = function(req, res) {

  invoice.findById(req.params.id, userId, function(data, err) {
    utils.sendResult(res, data, err);
  });
};

/**
 * Called with /invoices
 * Retrieves all specified invoices.
 * @see model.findAll for details on possible parameters
 * @param req express request object
 * @param res express response object
 */
exports.findAll = function(req, res) {

	invoice.findAll(req.query, userId, function(data, err) {
		utils.sendResult(res, data, err);
	});
};
