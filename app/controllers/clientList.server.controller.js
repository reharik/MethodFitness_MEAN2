'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
    ClientSummary = mongoose.model('ClientSummary');

/**
 * List of Clients
 */
exports.list = function(req, res) { ClientSummary.find().sort('-LastName').exec(function(err, clients) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(clients);
		}
	});
};

 /**
 * Client authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.client.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};