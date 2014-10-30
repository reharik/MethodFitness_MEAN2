'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * ClientSummary Schema
 */
var ClientSummarySchema = new Schema({
    Id: {
        type: String,
        default: '',
        trim: true
    },
    FirstName: {
		type: String,
		default: '',
		required: 'Please fill Client first name',
		trim: true
	},
    LastName: {
        type: String,
        default: '',
        required: 'Please fill Client last name',
        trim: true
    },
    EmailAddress: {
        type: String,
        default: '',
        required: 'Please fill Client email address',
        trim: true
    },
    Phone: {
        type: String,
        default: '',
        trim: true
    },
    Archived: {
        type: Boolean,
        default: false
    },
	ArchiveDate: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('ClientSummary', ClientSummarySchema);
