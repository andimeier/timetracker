var utils = require(__dirname + '/../utils/utils');
var error = require(__dirname + '/../utils/error');
var invoice = require(__dirname + '/../models/invoice');


/**
 * Called with /invoices/:invoiceId
 * Retrieves the specified invoice.
 */
exports.findById = function(req, res) {

  invoice.findById(req.params.id, function(data, err) {
    utils.sendResult(res, data, err);
  });
};

/**
 * Called with /invoices
 * Retrieves all specified invoices.
 * 
 * REST parameters (in query string):
 *   - fields ... specify list of fields to be delivered. All other fields are ignored. If unknown fields
 *       are specified here, they will be silently ignored. The list of fields must be comma-separated.
 */
exports.findAll = function(req, res) {

	invoice.findAll(req.query, function(data, err) {
		utils.sendResult(res, data, err);
	});
};
