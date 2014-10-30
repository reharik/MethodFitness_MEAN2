'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
    Client = mongoose.model('Client'),
	_ = require('lodash'),
    appender = require('../services/ges/ges-appender.js'),
    gesEvent = require('../services/ges/eventData.js'),
    uuid = require('node-uuid');

/**
 * Create a Client
 */
exports.create = function(req, res) {
    console.log(req.body.item)
	var client = new Client(req.body.item);
    Client.findOne({ 'EmailAddress': client.EmailAddress }).exec(function (err, _client) {
        var msg = err? err : {errors:[{'message':'Client with email: '+client.EmailAddress+' already exists.'}]};
        if (err || _client) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(msg)
            });
        }
    });

    var metadata = {
        'CommitId':uuid.v1(),
        'CommandTypeName':req.body.cmdName
    };
    var _event = {
        Contact: {  FirstName: client.FirstName,
            LastName: client.LastName,
            EmailAddress: client.EmailAddress,
            PhoneMobile: client.PhoneMobile,
            PhoneSecondary: client.PhoneSecondary
        },
        TrainerId: client.TrainerId,
        SourceNotes: client.SourceNotes,
        StartDate: client.StartDate
    };

    var cb = function(err, body) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(body);
        }
    };
    appender('CommandDispatch', new gesEvent(uuid.v1(), metadata.CommandTypeName, true, _event, metadata),cb);
};

/**
 * Show the current Client
 */
exports.read = function(req, res) {
	res.jsonp(req.client);
};

/**
 * Update a Client
 */
exports.update = function(req, res) {
	var client = req.client ;

	client = _.extend(client , req.body);

	client.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(client);
		}
	});
};

/**
 * Delete an Client
 */
exports.delete = function(req, res) {
	var client = req.client ;

	client.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(client);
		}
	});
};

/**
 * Client middleware
 */
exports.clientByID = function(req, res, next, id) { Client.findById(id).populate('user', 'displayName').exec(function(err, client) {
		if (err) return next(err);
		if (! client) return next(new Error('Failed to load Client ' + id));
		req.client = client ;
		next();
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