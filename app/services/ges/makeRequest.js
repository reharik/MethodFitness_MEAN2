/**
 * Created by rharik on 10/21/14.
 */
'use strict';

var curl = require('curlrequest'),
    uuid = require('node-uuid'),
    is = require('is'),
    contentESMediaType= 'application/vnd.eventstore.events+json',
    acceptESMediaType = 'application/vnd.eventstore.atom+json',
    server = 'http://127.0.0.1:2113/streams/',
    username = 'admin',
    password = 'changeit';

module.exports = makeAuthorizedRequest;

function makeAuthorizedRequest(optsOrStream, cb) {
    var opts = is.string(optsOrStream) ? { stream: optsOrStream } : optsOrStream,
        uri = opts.stream.indexOf('http') === 0 ? opts.stream : server + opts.stream,
        options = {
            url: uri,
            headers: {
                'Accept': acceptESMediaType,
                 'Content-Type': contentESMediaType,
                'Authorization': 'Basic '+ new Buffer(username+':'+password).toString('base64')
                //, 'ES-LongPoll': 10
            },
            method:opts.method
        };

    if(opts.body ) {
        options.data = JSON.stringify([opts.body]);
    }
    curl.request(options, function(err, stdout, meta){
        if(err){
            console.log(err);
            cb(err);
        }else{
//            console.log('%s %s', meta.cmd, meta.args.join(' '));
            cb(stdout);
        }
    });
}
