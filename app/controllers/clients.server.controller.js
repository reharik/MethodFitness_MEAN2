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
    uuid = require('node-uuid'),
    that = this;


that.createCommand = function(res, vent, cmdName){
    var metadata = {
        'CommitId':uuid.v1(),
        'CommandTypeName':cmdName
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
    appender('CommandDispatch', new gesEvent(uuid.v1(), metadata.CommandTypeName, true, vent, metadata),cb);
};

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

    that.createCommand(res, _event,req.body.cmdName);

};

/**
 * Show the current Client
 */
exports.read = function(req, res) {
console.log(req.client);
	res.jsonp(req.client);
};

/**
 * Update a Client
 */
exports.update = function(req, res, next) {
    var clientId = req.params.clientId;
    var cmdName = req.params.cmdName;
	var client = req.body.item;
    console.log("params log");
    _.forEach(req.body,function(i){
        console.log(i+' value:'+req.body[i]);
    })
    that[cmdName](req, res, client);
};


that.correctClientsName = function(req,res, client){
    console.log("client log");
    console.log(client);
    _.forEach(Object.keys(client),function(i){
        console.log(i+' value:'+client[i]);
    })
    var _event = {
        ClientId: client._id,
        Contact: {  FirstName: client.Contact.FirstName,
                    LastName: client.Contact.LastName
        }
    };
    _.forEach(Object.keys(_event),function(i){
        console.log(i+' value:'+_event[i]);
    });
    that.createCommand(res,_event,'CorrectClientName');
}

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
    if (req.client.user._id !== req.user._id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};