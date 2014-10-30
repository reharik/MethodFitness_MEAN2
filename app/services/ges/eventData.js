/**
 * Created by rharik on 10/21/14.
 */
'use strict';

module.exports = function EventData(eventId, type, isJson, data, metadata) {
    if(!(this instanceof EventData)) {
        return new EventData(eventId, type, isJson, data, metadata);
    }

    isJson = !!isJson;
    data = data || new Buffer(0);
    metadata = metadata || new Buffer(0);
    if(metadata.CommandTypeName){
        metadata.CommandTypeName = 'MF.Core.Messages.Command.'+metadata.CommandTypeName+', MF.Core.Messages, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null';
    }
    Object.defineProperties(this, {
        EventId: { value: eventId, enumerable: true },
        EventType: { value: type, enumerable: true },
         IsJson: { value: isJson, enumerable: true },
         Data: { value: data, enumerable: true },
         Metadata: { value: metadata, enumerable: true }
    });
};

