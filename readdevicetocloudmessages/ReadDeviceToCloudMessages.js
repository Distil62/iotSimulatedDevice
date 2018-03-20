'use strict'

var EventHubClient = require('azure-event-hubs').Client;

var connectionString = "HostName=RealitXHub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=V7wYbYbg4EQgRQau2t+sbaPOPgoDTpLMccbt+y6gUaI=";

var printError = function(err)
{
    console.log(err.message);
};

var printMessage = function(message)
{
    console.log("Message received : ");
    console.log(JSON.stringify(message.body))
    console.log('°~-~-~-~-~-~-~-~-~-~-~°');
};

var client = EventHubClient.fromConnectionString(connectionString);
client.open()
    .then(client.getPartitionIds.bind(client))
    .then(function(partitionsIds)
    {
        return partitionsIds.map(function (partitionsId)
        {
            return client.createReceiver('$Default', partitionsId, {'startAfterTime' : Date.now()}).then(function(receiver)
            {
                console.log('Created partition receiver ' + partitionsId);
                receiver.on("errorReceived", printError);
                receiver.on('message', printMessage);
            });
        });
    })
    .catch(printError);